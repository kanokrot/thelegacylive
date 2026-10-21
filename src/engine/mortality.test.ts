import { describe, expect, it } from 'vitest'
import { balance } from '../content/balance'
import reference from '../content/data/mortality-reference.json'
import { normalizeDeathRecord, lifeExpectancyCalibration, mortalityDraw, mortalityProvenanceSummary } from './mortality'
import { choose, chooseAuto, createLife, rollBirth, simulateLife } from './game'
import { buildMemorial } from '../content/chronicle'

describe('mortality model', () => {
  it('stores a death cause and age on every finished simulated life', () => {
    const life = simulateLife(8271)
    expect(life.status).toBe('dead')
    expect(life.person.deathCause).toBeTruthy()
    expect(life.person.deathAge).toBeGreaterThanOrEqual(0)
    expect(life.person.deathYear).toBe(life.person.birthYear + life.person.deathAge!)
    expect(life.person.deathFactors?.length).toBeLessThanOrEqual(3)
  })

  it('fills legacy death saves with safe fallback values', () => {
    const person = rollBirth(8272).person
    normalizeDeathRecord(person, person.birthYear + 64)
    expect(person.deathYear).toBe(person.birthYear + 64)
    expect(person.deathAge).toBe(64)
    expect(person.deathCause).toBe('unknown')
    expect(person.deathFactors).toEqual([])
    expect(person.manualDecisions).toBe(0)
    expect(person.autoDecisions).toBe(0)
  })

  it('counts player and auto choices separately', () => {
    const manual = createLife(8273)
    const card = { id: 'decision-test', title: 'test', body: 'test', stage: 'childhood' as const, weight: 1, once: false, choices: [{ id: 'a', label: 'a', effects: [] }, { id: 'b', label: 'b', effects: [] }] }
    manual.currentCardIds = [card.id]
    chooseAuto(manual, card, 'neutral')
    expect(manual.person.autoDecisions).toBe(1)
    expect(manual.person.manualDecisions).toBeUndefined()
    const player = createLife(8276)
    player.currentCardIds = [card.id]
    choose(player, card, card.choices[0]!)
    expect(player.person.manualDecisions).toBe(1)
    expect(player.person.autoDecisions).toBeUndefined()
  })

  it('caps combined annual modifiers and maximum annual risk', () => {
    const life = createLife(8274)
    life.year = life.person.birthYear + 35
    life.person.health = 0
    life.person.debt = 100
    life.person.careBurden = 100
    life.person.migrated = true
    life.person.flags.hazardousWork = true
    life.person.flags.motorcycleUse = true
    const draw = mortalityDraw(life)
    expect(draw.probability).toBeLessThanOrEqual(balance.mortality.maxAnnualRisk.value)
    expect(draw.factors.length).toBeLessThanOrEqual(3)
  })

  it('uses household context, not player choice flags or adult status modifiers, before age fifteen', () => {
    const life = createLife(8275)
    life.year = life.person.birthYear + 10
    life.person.health = 0
    life.person.debt = 100
    life.person.careBurden = 100
    life.person.migrated = true
    life.person.flags.hazardousWork = true
    life.person.flags.motorcycleUse = true
    const draw = mortalityDraw(life)
    expect(draw.factors).not.toContain('lowHealth')
    expect(draw.factors).not.toContain('highDebt')
    expect(draw.factors).not.toContain('careBurden')
    expect(draw.factors).not.toContain('migration')
    expect(draw.factors).not.toContain('hazardousWork')
    expect(draw.factors).not.toContain('motorcycle')
  })

  it('keeps baseline expectations close to the official targets and annotates each parameter group', () => {
    const expectation = lifeExpectancyCalibration()
    expect(expectation.male).toBeCloseTo(71.9, 5)
    expect(expectation.female).toBeCloseTo(80, 5)
    for (const parameter of Object.values(balance.mortality)) {
      expect(['sourced', 'calibrated', 'design']).toContain(parameter.provenance.type)
    }
    expect(reference.modelParameters.every(parameter => ['sourced', 'calibrated', 'design'].includes(parameter.provenance.type))).toBe(true)
    expect(reference.observations.every(row => row.provenance.type === 'sourced' && row.provenance.sourceId && row.provenance.year && row.provenance.ageBands.length > 0)).toBe(true)
    expect(reference.calibration.bands.every(row => row.provenance.type === 'sourced' && row.provenance.sourceId && row.provenance.year && row.provenance.ageBands[0] === row.ageBand)).toBe(true)
    expect(reference.calibration.allCauseRateInputs.male.provenance.type).toBe('sourced')
    expect(reference.calibration.allCauseRateInputs.female.provenance.type).toBe('sourced')
    expect(reference.calibration.provenance.type).toBe('calibrated')
    const summary = mortalityProvenanceSummary()
    expect(summary.sourced.count + summary.calibrated.count + summary.design.count).toBeGreaterThan(0)
    expect(summary.sourced.percent + summary.calibrated.percent + summary.design.percent).toBeCloseTo(100)
  })

  it('includes no percentage statistic in memorial text', () => {
    const person = rollBirth(8277).person
    person.deathAge = 69
    person.deathCause = 'other'
    const memorial = buildMemorial(person, person.birthYear + 69, [])
    expect(memorial).not.toMatch(/\d+\s*%/)
  })
})
