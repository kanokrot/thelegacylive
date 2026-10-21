import { describe, expect, it } from 'vitest'
import { balance } from './balance'
import { isanFamilyMoneyCards } from './isanFamilyMoneyCards'
import { eligibleCards, stageFor } from '../engine/game'
import { evaluateCondition } from '../engine/conditions'
import type { LifeState } from '../engine/types'

const flags = {
  fmSharedCare: true,
  fmRicePlan: true,
  fmParentAway: true,
}

function stateAt(age: number, householdType = 'ทำนา'): LifeState {
  return {
    person: {
      id: 'test-life', name: 'test', gender: 'หญิง', birthYear: 2000, birthYearBE: 2543,
      province: 'ขอนแก่น', householdType, householdLandRai: 10, householdMoney: 20,
      occupation: '', location: 'ขอนแก่น', migrated: false, partnered: false, children: 0,
      remittancesSent: 0, birthOrder: 1, siblingCount: 1, health: 80, wellbeing: 60,
      knowledge: 20, relationships: 60, careBurden: 10, aptitude: 60, diligence: 60,
      temperament: 60, money: 10, debt: 10, personalDebt: 0, flags,
      affinities: {}, relatives: [{ id: 'grandmother', name: 'test', role: 'grandmother', age: 65,
        alive: true, health: 70, relationship: 60, migrated: false, married: true, gender: 'หญิง' }],
      stage: stageFor(age), alive: true,
    },
    year: 2000 + age,
    region: { id: 'test', name: 'ขอนแก่น', schoolAccess: 0.56, hospitalAccess: 0.42, jobAccess: 0.38 },
    seed: 1, rngCounter: 0, playedCards: [], currentCardIds: [], metPeople: [], log: [],
    status: 'playing', memorial: '',
  }
}

describe('Isan family and money cards', () => {
  it('contains twelve cards that can be reached at an age from 0 through 17', () => {
    expect(isanFamilyMoneyCards).toHaveLength(12)
    for (const card of isanFamilyMoneyCards) {
      const reachable = Array.from({ length: 18 }, (_, age) => stateAt(age))
        .some(state => eligibleCards(state, [card]).includes(card))
      expect(reachable, `${card.id} should be reachable in childhood or teen years`).toBe(true)
    }
  })

  it('keeps every new card inside its authored age window', () => {
    for (const card of isanFamilyMoneyCards) {
      const eligibleAges = Array.from({ length: 18 }, (_, age) => age)
        .filter(age => evaluateCondition(card.when, stateAt(age)))
      expect(eligibleAges.length, card.id).toBeGreaterThan(0)
      expect(eligibleAges.every(age => age >= 0 && age <= 17), card.id).toBe(true)
      expect(eligibleAges.every(age => stageFor(age) === card.stage), card.id).toBe(true)
      expect(eligibleAges.every(age => age <= balance.stages.teen), card.id).toBe(true)
    }
  })

  it('gates choices behind household or family background where authored', () => {
    const gated = isanFamilyMoneyCards.flatMap(card => card.choices
      .filter(choice => choice.requires)
      .map(choice => ({ card, choice })))
    expect(gated.length).toBeGreaterThanOrEqual(4)
    const farmChoice = gated.find(({ choice }) => choice.id === 'fm-rising-water-c')!
    expect(evaluateCondition(farmChoice.choice.requires, stateAt(10, 'ทำนา'))).toBe(true)
    expect(evaluateCondition(farmChoice.choice.requires, stateAt(10, 'รับจ้าง'))).toBe(false)
    const familyChoice = gated.find(({ choice }) => choice.id === 'fm-next-study-step-c')!
    expect(evaluateCondition(familyChoice.choice.requires, stateAt(16, 'รับจ้าง'))).toBe(true)
    expect(evaluateCondition(familyChoice.choice.requires, { ...stateAt(16), person: { ...stateAt(16).person, flags: {} } })).toBe(false)
  })

  it('connects care, rice work, and migration stories across later ages', () => {
    const byId = (id: string) => isanFamilyMoneyCards.find(card => card.id === id)!
    expect(evaluateCondition(byId('fm-care-school').when, stateAt(7))).toBe(true)
    expect(evaluateCondition(byId('fm-dry-spell').when, stateAt(10))).toBe(true)
    expect(evaluateCondition(byId('fm-harvest-plan').when, stateAt(14))).toBe(true)
    expect(evaluateCondition(byId('fm-message-home').when, stateAt(13, 'รับจ้าง'))).toBe(true)
    expect(evaluateCondition(byId('fm-next-study-step').when, stateAt(16, 'รับจ้าง'))).toBe(true)
  })
})
