import { describe, expect, it } from 'vitest'
import { createLife, beginTurn, cardWeightForState } from './game'
import { evaluateCondition } from './conditions'
import type { Card } from './types'

const card = (id: string, weight = 1): Card => ({
  id,
  stage: 'childhood',
  title: id,
  body: '',
  weight,
  once: false,
  choices: [{ id: `${id}-choice`, label: 'เลือก', effects: [] }],
})

describe('economic conditions and contextual card weights', () => {
  it('reads household money and household debt from their own person fields', () => {
    const state = createLife(701)
    state.person.money = 85
    state.person.householdMoney = 12
    state.person.debt = 34

    expect(evaluateCondition({ householdMoney: '<', value: 20 }, state)).toBe(true)
    expect(evaluateCondition({ householdMoney: '>=', value: 20 }, state)).toBe(false)
    expect(evaluateCondition({ householdDebt: '>=', value: 30 }, state)).toBe(true)
    expect(evaluateCondition({ householdDebt: '<', value: 30 }, state)).toBe(false)
  })

  it('applies matching multipliers without changing card data or consuming random values', () => {
    const state = createLife(702)
    state.person.householdMoney = 10
    state.person.debt = 32
    const baseA = card('a')
    const moddedA: Card = { ...baseA, weightMods: [
      { when: { householdMoney: '<', value: 20 }, mult: 1.5 },
      { when: { householdDebt: '>=', value: 30 }, mult: 2 },
    ] }
    expect(cardWeightForState(baseA, state)).toBe(1)
    expect(cardWeightForState(moddedA, state)).toBe(3)
    expect(baseA.weight).toBe(1)
  })

  it('replays weighted draws from the same seed with the same RNG consumption', () => {
    const a = card('a')
    const b = card('b')
    const weightedA: Card = { ...a, weightMods: [{ when: { householdMoney: '<', value: 25 }, mult: 20 }] }
    for (let seed = 1; seed <= 100; seed++) {
      const baseline = createLife(seed)
      const weighted = createLife(seed)
      baseline.person.householdMoney = weighted.person.householdMoney = 10
      beginTurn(baseline, [a, b])
      beginTurn(weighted, [weightedA, b])
      const replay = createLife(seed)
      replay.person.householdMoney = 10
      beginTurn(replay, [weightedA, b])
      expect(weighted.currentCardIds).toEqual(replay.currentCardIds)
      expect(weighted.rngCounter).toBe(baseline.rngCounter)
      expect(weighted.rngCounter).toBe(replay.rngCounter)
    }
  })

  it('makes a matching card more likely while preserving seeded determinism', () => {
    const a = card('a')
    const b = card('b')
    const weightedA: Card = { ...a, weightMods: [{ when: { householdMoney: '<', value: 25 }, mult: 20 }] }
    let baselineA = 0
    let weightedAFirst = 0
    for (let seed = 1; seed <= 400; seed++) {
      const baseline = createLife(seed)
      const weighted = createLife(seed)
      baseline.person.householdMoney = weighted.person.householdMoney = 10
      beginTurn(baseline, [a, b])
      beginTurn(weighted, [weightedA, b])
      expect(baseline.currentCardIds).not.toHaveLength(0)
      expect(weighted.currentCardIds).not.toHaveLength(0)
      if (baseline.currentCardIds[0] === 'a') baselineA++
      if (weighted.currentCardIds[0] === 'a') weightedAFirst++
      expect(weighted.currentCardIds).toEqual(createWeightedReplay(seed, weightedA, b))
    }
    expect(weightedAFirst).toBeGreaterThan(baselineA)
  })
})

function createWeightedReplay(seed: number, a: Card, b: Card): string[] {
  const replay = createLife(seed)
  replay.person.householdMoney = 10
  beginTurn(replay, [a, b])
  return replay.currentCardIds
}
