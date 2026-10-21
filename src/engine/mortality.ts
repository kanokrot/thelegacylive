import { balance } from '../content/balance'
import reference from '../content/data/mortality-reference.json'
import type { DeathCause, Gender, LifeState, Person } from './types'

type Sex = 'male' | 'female'
type CauseRow = (typeof reference.observations)[number]
const causeRows = reference.observations as CauseRow[]
const ageRows = reference.calibration.bands
const allCauseInputs = reference.calibration.allCauseRateInputs

export function mortalityProvenanceSummary(): Record<'sourced' | 'calibrated' | 'design', { count: number; percent: number }> {
  const parameters = [
    ...reference.modelParameters.map(parameter => parameter.provenance.type),
    ...Object.values(balance.mortality).map(parameter => parameter.provenance.type),
    balance.maxAge.provenance.type,
  ]
  const total = parameters.length
  return (['sourced', 'calibrated', 'design'] as const).reduce((summary, type) => {
    const count = parameters.filter(parameter => parameter === type).length
    summary[type] = { count, percent: total ? count / total * 100 : 0 }
    return summary
  }, {} as Record<'sourced' | 'calibrated' | 'design', { count: number; percent: number }>)
}

export interface MortalityFactor { id: string; label: string; strength: number }
export interface MortalityDraw { probability: number; causes: Array<{ cause: DeathCause; weight: number }>; factors: string[] }

const sexFor = (gender: Gender): Sex | 'other' => gender === 'ชาย' ? 'male' : gender === 'หญิง' ? 'female' : 'other'
const rawRate = (sex: Sex, age: number) => {
  const index = Math.min(age < 65 ? Math.floor(age / 5) : 13, ageRows.length - 1)
  const row = ageRows[index]!
  return (row[`${sex}Deaths`] as number) / (row[`${sex}Population`] as number)
}
function expectedAge(sex: Sex, scale: number): number {
  let survival = 1
  let ageAtDeath = 0
  for (let age = 0; age < balance.maxAge.value; age++) {
    ageAtDeath += survival
    survival *= 1 - Math.min(balance.mortality.maxAnnualRisk.value, rawRate(sex, age) * scale)
  }
  return ageAtDeath
}
function calibrationScale(sex: Sex): number {
  const target = reference.calibration.lifeExpectancyTargets[sex].years
  let low = 0
  let high = 1
  while (expectedAge(sex, high) > target) high *= 2
  for (let index = 0; index < 60; index++) {
    const middle = (low + high) / 2
    if (expectedAge(sex, middle) > target) low = middle
    else high = middle
  }
  return (low + high) / 2
}
const scaleBySex: Record<Sex, number> = { male: calibrationScale('male'), female: calibrationScale('female') }

function baseHazard(gender: Gender, age: number): number {
  const sex = sexFor(gender)
  return sex === 'other'
    ? (rawRate('male', age) * scaleBySex.male + rawRate('female', age) * scaleBySex.female) / 2
    : rawRate(sex, age) * scaleBySex[sex]
}

function allCauseRate(sex: Sex): number {
  const input = allCauseInputs[sex]
  const deaths = input.deaths
  const population = input.population
  return deaths / population * 100_000
}
function causeWeights(gender: Gender, age: number, healthZone?: number) {
  const sex = sexFor(gender)
  const rates = causeRows.map(row => {
    const national = row.national as Record<string, number | undefined>
    const ageSex = row.ageSex as Array<Record<string, number | string | undefined>>
    const matchingBands = ageSex.filter(item => {
      const band = String(item.ageBand)
      if (band.endsWith('+')) return age >= Number(band.slice(0, -1))
      const [start, end] = band.split('-').map(Number)
      return Number.isFinite(start) && Number.isFinite(end) && age >= start! && age <= end!
    })
    const match = sex === 'other'
      ? matchingBands.find(item => typeof item.male === 'number' && typeof item.female === 'number')
      : matchingBands.find(item => typeof item[sex] === 'number')
    let weight = match
      ? sex === 'other'
        ? ((match.male as number) + (match.female as number)) / 2
        : match[sex] as number
      : sex === 'other' ? ((national.male ?? 0) + (national.female ?? 0)) / 2 : national[sex] ?? 0
    const zone = row.healthZones.find(item => item.zone === healthZone)
    if (zone && row.cause === 'drowning' && age < balance.mortality.childAgeLimit.value) weight *= zone.rate / row.national.total
    return { cause: row.cause as DeathCause, weight }
  })
  const knownTotal = rates.reduce((sum, row) => sum + row.weight, 0)
  const crude = sex === 'other' ? (allCauseRate('male') + allCauseRate('female')) / 2 : allCauseRate(sex)
  rates.push({ cause: 'other', weight: Math.max(0, crude - knownTotal) })
  return rates
}

export function mortalityDraw(state: LifeState): MortalityDraw {
  const person = state.person
  const age = state.year - person.birthYear
  const factors: MortalityFactor[] = []
  let modifier = 1
  const add = (id: string, strength: number, active: boolean) => {
    if (!active) return
    modifier *= strength
    factors.push({ id, label: id, strength })
  }
  const cfg = balance.mortality
  add('lowHealth', cfg.lowHealthMultiplier.value, age >= cfg.childAgeLimit.value && person.health <= cfg.lowHealthThreshold.value)
  add('highDebt', cfg.highDebtMultiplier.value, age >= cfg.childAgeLimit.value && person.debt >= cfg.highDebtThreshold.value)
  add('careBurden', cfg.highCareBurdenMultiplier.value, age >= cfg.childAgeLimit.value && person.careBurden >= cfg.highCareBurdenThreshold.value)
  add('migration', cfg.migratedRoadMultiplier.value, age >= cfg.childAgeLimit.value && person.migrated)
  add('hazardousWork', cfg.hazardousWorkMultiplier.value, age >= cfg.childAgeLimit.value && person.flags.hazardousWork === true)
  add('motorcycle', cfg.motorcycleMultiplier.value, age >= cfg.childAgeLimit.value && person.flags.motorcycleUse === true)
  if (age < cfg.childAgeLimit.value) {
    const lowerResources = person.householdMoney <= balance.lowWealthThreshold
    const waterLinkedHousehold = person.householdType === 'ทำนา' || person.householdType === 'ประมงน้ำจืด'
    add('childHouseholdResources', cfg.childLowHouseholdMultiplier.value, lowerResources)
    add('childWaterExposureProxy', cfg.childFarmOrFishingMultiplier.value, waterLinkedHousehold)
  }
  modifier = Math.min(cfg.maxModifier.value, modifier)
  const probability = age >= balance.maxAge.value ? 1 : Math.min(cfg.maxAnnualRisk.value, baseHazard(person.gender, age) * modifier)
  return { probability, causes: causeWeights(person.gender, age, state.region.healthZone), factors: factors.sort((a, b) => b.strength - a.strength).slice(0, 3).map(factor => factor.id) }
}

export function chooseDeathCause(rng: () => number, causes: MortalityDraw['causes']): DeathCause {
  const total = causes.reduce((sum, item) => sum + item.weight, 0)
  if (!(total > 0)) return 'other'
  let roll = rng() * total
  for (const item of causes) {
    roll -= item.weight
    if (roll < 0) return item.cause
  }
  return causes.at(-1)?.cause ?? 'other'
}

export function lifeExpectancyCalibration(): Record<Sex, number> {
  return { male: expectedAge('male', scaleBySex.male), female: expectedAge('female', scaleBySex.female) }
}

export function normalizeDeathRecord(person: Person, year: number): void {
  person.deathYear ??= year
  person.deathAge ??= Math.max(0, person.deathYear - person.birthYear)
  person.deathCause ??= 'unknown'
  person.deathFactors ??= []
  person.manualDecisions ??= 0
  person.autoDecisions ??= 0
}
