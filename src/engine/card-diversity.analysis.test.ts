import { describe, expect, it } from 'vitest'
import { balance, cards } from '../content'
import { advanceYear, beginTurn, choose, createLifeFromRoll, resolveAutoCard, rollBirth, simulateLife } from './game'
import { evaluateCondition } from './conditions'
import { lifeExpectancyCalibration, mortalityProvenanceSummary } from './mortality'
import type { Card } from './types'

const SAMPLE_SIZE = 2_000
const START_YEAR = 2026
type HouseholdType = typeof balance.householdTypes[number]

function percent(count: number, total: number): string {
  return total ? `${(count / total * 100).toFixed(1)}%` : 'n/a'
}

function analyze(): string {
  const householdCounts = new Map(balance.householdTypes.map(type => [type, 0]))
  const cardLives = new Map(cards.map(card => [card.id, new Map(balance.householdTypes.map(type => [type, new Set<number>()]))]))
  const appearances = new Map<string, number>()
  const availableChoices = new Map<string, number>()
  const selectedChoices = new Map<string, number>()
  const lifeCardAges = new Map<number, Set<number>>()
  const deathYears = new Map<number, number>()

  for (let sample = 0; sample < SAMPLE_SIZE; sample++) {
    const seed = 100_000 + sample
    const roll = rollBirth(seed, START_YEAR)
    const householdType = roll.person.householdType as HouseholdType
    householdCounts.set(householdType, (householdCounts.get(householdType) ?? 0) + 1)
    const state = createLifeFromRoll(seed, roll)
    const seen = new Set<string>()
    let guard = 0

    while (state.status === 'playing' && guard++ < balance.maxAge.value + 2) {
      beginTurn(state, cards)
      const cardId = state.currentCardIds[0]
      if (cardId) {
        const card = cards.find(item => item.id === cardId) as Card
        seen.add(cardId)
        const groups = cardLives.get(cardId)!
        groups.get(householdType)!.add(sample)
        appearances.set(cardId, (appearances.get(cardId) ?? 0) + 1)
        const age = state.year - state.person.birthYear
        if (!lifeCardAges.has(age)) lifeCardAges.set(age, new Set())
        lifeCardAges.get(age)!.add(sample)

        for (const choice of card.choices) {
          if (!choice.requires) continue
          const key = `${card.id}:${choice.id}`
          if (evaluateCondition(choice.requires, state)) availableChoices.set(key, (availableChoices.get(key) ?? 0) + 1)
        }

        const choice = card.choices.find(item => evaluateCondition(item.requires, state)) ?? card.choices[0]
        if (choice) {
          selectedChoices.set(`${card.id}:${choice.id}`, (selectedChoices.get(`${card.id}:${choice.id}`) ?? 0) + 1)
          if (card.auto) resolveAutoCard(state, card)
          else choose(state, card, choice)
        } else if (card.auto) {
          resolveAutoCard(state, card)
        }
      }
      advanceYear(state, cards)
    }

    for (const cardId of seen) cardLives.get(cardId)!.get(householdType)!.add(sample)
    deathYears.set(sample, state.person.deathYear ?? state.year)
  }

  const householdTypes = [...balance.householdTypes]
  const matrix = cards.map(card => {
    const groups = cardLives.get(card.id)!
    const values = householdTypes.map(type => groups.get(type)!.size)
    const totalRate = values.reduce((sum, value) => sum + value, 0) / SAMPLE_SIZE
    const rates = values.map((value, index) => value / (householdCounts.get(householdTypes[index]!) || 1))
    return { card, values, totalRate, rates, spread: Math.max(...rates) - Math.min(...rates) }
  })

  const lines: string[] = []
  lines.push(`SAMPLE: ${SAMPLE_SIZE} lives; births fixed to ${START_YEAR}; seeds ${100_000}–${100_000 + SAMPLE_SIZE - 1}`)
  lines.push(`HOUSEHOLDS: ${householdTypes.map((type, index) => `H${index + 1}=${type} (n=${householdCounts.get(type)})`).join(' | ')}`)
  lines.push('\nCARD FREQUENCY: % of lives in each household type who encountered the card at least once')
  lines.push(['cardId', ...householdTypes.map((_, index) => `H${index + 1}`), 'all'].join('\t'))
  for (const row of matrix) {
    lines.push([row.card.id, ...row.values.map((value, index) => percent(value, householdCounts.get(householdTypes[index]!) ?? 0)), percent(row.values.reduce((sum, value) => sum + value, 0), SAMPLE_SIZE)].join('\t'))
  }

  const common = matrix.filter(row => row.totalRate > 0.7)
  const dead = matrix.filter(row => row.rates.every(rate => rate < 0.03))
  const diverse = [...matrix].sort((a, b) => b.spread - a.spread).slice(0, 12)
  lines.push('\nCOMMON (>70% of all lives):')
  lines.push(common.length ? common.map(row => `${row.card.id} ${percent(Math.round(row.totalRate * SAMPLE_SIZE), SAMPLE_SIZE)}`).join(', ') : 'none')
  lines.push('\nRARE IN EVERY HOUSEHOLD (<3%):')
  lines.push(dead.length ? dead.map(row => row.card.id).join(', ') : 'none')
  lines.push('\nLARGEST HOUSEHOLD DIFFERENCES (max minus min life rate):')
  for (const row of diverse) {
    const lowIndex = row.rates.indexOf(Math.min(...row.rates))
    const highIndex = row.rates.indexOf(Math.max(...row.rates))
    lines.push(`${row.card.id}\t${(row.spread * 100).toFixed(1)} pp\t${householdTypes[lowIndex]} ${percent(Math.round(row.rates[lowIndex]! * (householdCounts.get(householdTypes[lowIndex]!) ?? 0)), householdCounts.get(householdTypes[lowIndex]!) ?? 0)} -> ${householdTypes[highIndex]} ${percent(Math.round(row.rates[highIndex]! * (householdCounts.get(householdTypes[highIndex]!) ?? 0)), householdCounts.get(householdTypes[highIndex]!) ?? 0)}`)
  }

  lines.push('\nAGE GAPS: age / reached lives / lives with no card / no-card share')
  const maxObservedAge = Math.max(...[...lifeCardAges.keys(), ...[...deathYears.values()].map(year => year - START_YEAR)])
  const gaps: string[] = []
  for (let age = 0; age <= maxObservedAge; age++) {
    const year = START_YEAR + age
    const reached = [...deathYears.values()].filter(deathYear => deathYear >= year).length
    const withCard = lifeCardAges.get(age)?.size ?? 0
    const empty = reached - withCard
    if (reached && empty / reached > 0.5) gaps.push(`${age}: ${empty}/${reached} (${percent(empty, reached)})`)
  }
  lines.push(gaps.join('\n') || 'none')

  lines.push('\nREQUIRES-GATED CHOICES: selectable and selected by the simulator default policy per card appearance')
  for (const card of cards) {
    const gated = card.choices.filter(choice => choice.requires)
    if (!gated.length) continue
    const seenCount = appearances.get(card.id) ?? 0
    for (const choice of gated) {
      const key = `${card.id}:${choice.id}`
      lines.push(`${key}\tavailable ${percent(availableChoices.get(key) ?? 0, seenCount)}\tselected ${percent(selectedChoices.get(key) ?? 0, seenCount)}\tappearances ${seenCount}`)
    }
  }

  return lines.join('\n')
}

function analyzeMortality(): { report: string; manualAverageAge: number } {
  const lines = [`MORTALITY SIMULATION: ${SAMPLE_SIZE} lives per decision mode`]
  const reports: Array<{ mode: 'manual' | 'auto'; averageAge: number; counts: Map<string, number> }> = []
  for (const mode of ['manual', 'auto'] as const) {
    let totalAge = 0
    const counts = new Map<string, number>()
    for (let sample = 0; sample < SAMPLE_SIZE; sample++) {
      const life = simulateLife(500_000 + sample, cards, { decisionMode: mode, autoPolicy: 'neutral' })
      expect(life.status, `${mode} seed ${sample}`).toBe('dead')
      expect(life.person.deathCause, `${mode} seed ${sample} death cause`).toBeTruthy()
      totalAge += life.person.deathAge ?? 0
      const cause = life.person.deathCause ?? 'unknown'
      counts.set(cause, (counts.get(cause) ?? 0) + 1)
    }
    const averageAge = totalAge / SAMPLE_SIZE
    reports.push({ mode, averageAge, counts })
    const causeSummary = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([cause, count]) => `${cause} ${percent(count, SAMPLE_SIZE)}`).join(', ')
    const manualAuto = mode === 'manual' ? 'player' : 'game'
    lines.push(`${mode}: mean death age ${averageAge.toFixed(2)}; causes ${causeSummary}; decision source ${manualAuto}`)
  }
  const lifeExpectancy = lifeExpectancyCalibration()
  lines.push(`REFERENCE: NSO/Mahidol 2024 male ${lifeExpectancy.male.toFixed(1)}, female ${lifeExpectancy.female.toFixed(1)}; accepted manual cohort range 73–79 years (midpoint reference 75.95).`)
  const provenance = mortalityProvenanceSummary()
  lines.push(`RISK PARAMETER GROUPS: sourced ${provenance.sourced.percent.toFixed(1)}% (${provenance.sourced.count}), calibrated ${provenance.calibrated.percent.toFixed(1)}% (${provenance.calibrated.count}), design ${provenance.design.percent.toFixed(1)}% (${provenance.design.count}). Counted by documented model parameter group and each scalar in balance.mortality / balance.maxAge.`)
  return { report: lines.join('\n'), manualAverageAge: reports.find(report => report.mode === 'manual')!.averageAge }
}

describe('card diversity analysis', () => {
  it('prints a reproducible 2,000-life household and age report', () => {
    const report = analyze()
    console.log(report)
    expect(report).toContain('CARD FREQUENCY')
    expect(report).toContain('REQUIRES-GATED CHOICES')
  })

  it('reports 2,000 manual and 2,000 auto mortality outcomes without calibrating on auto lives', () => {
    const { report, manualAverageAge } = analyzeMortality()
    console.log(report)
    expect(report).toContain('manual: mean death age')
    expect(report).toContain('auto: mean death age')
    expect(report).toContain('RISK PARAMETER GROUPS')
    expect(manualAverageAge).toBeGreaterThanOrEqual(73)
    expect(manualAverageAge).toBeLessThanOrEqual(79)
  }, 20_000)
})
