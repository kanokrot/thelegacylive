import { describe, expect, it } from 'vitest'
import { cards } from './index'
import { isanHouseholdThreadCards } from './isanHouseholdThreadCards'
import { createLife, eligibleCards, stageFor } from '../engine/game'

const threadHomes: Record<string, string> = {
  'fm-hired-work-round': 'รับจ้าง',
  'fm-hired-work-study': 'รับจ้าง',
  'fm-shop-restock': 'ค้าขายเล็ก ๆ',
  'fm-shop-keep-record': 'ค้าขายเล็ก ๆ',
  'fm-craft-materials': 'งานฝีมือ',
  'fm-craft-pricing': 'งานฝีมือ',
  'fm-fishing-equipment': 'ประมงน้ำจืด',
  'fm-fishing-repair-plan': 'ประมงน้ำจืด',
  'fm-city-commute-cost': 'แรงงานในเมือง',
  'fm-city-school-plan': 'แรงงานในเมือง',
  'fm-public-household-plan': 'ข้าราชการชั้นผู้น้อย',
  'fm-public-study-cost': 'ข้าราชการชั้นผู้น้อย',
}
const continuationFlags: Record<string, string> = {
  'fm-hired-work-study': 'fmHiredWorkRound',
  'fm-shop-keep-record': 'fmShopRestock',
  'fm-craft-pricing': 'fmCraftMaterials',
  'fm-fishing-repair-plan': 'fmFishingEquipment',
  'fm-city-school-plan': 'fmCityCommuteCost',
  'fm-public-study-cost': 'fmPublicHouseholdPlan',
}

describe('non-farm household story threads', () => {
  it('registers twelve cards with a linked follow-up for each household thread', () => {
    expect(isanHouseholdThreadCards).toHaveLength(12)
    expect(cards.filter(card => card.id.startsWith('fm-'))).toHaveLength(24)
    for (const card of isanHouseholdThreadCards) {
      const age = continuationFlags[card.id] ? 15 : 8
      const state = createLife(180 + age)
      state.person.householdType = threadHomes[card.id]!
      state.person.stage = stageFor(age)
      state.year = state.person.birthYear + age
      if (continuationFlags[card.id]) state.person.flags[continuationFlags[card.id]!] = true
      expect(eligibleCards(state, [card]), card.id).toContain(card)
      expect(eligibleCards(state, cards), card.id).toContain(card)
    }
  })

  it('keeps the new events inside childhood and teen age windows', () => {
    for (const card of isanHouseholdThreadCards) {
      const householdType = threadHomes[card.id]!
      const flag = continuationFlags[card.id]
      const eligibleAges = Array.from({ length: 18 }, (_, age) => {
        const state = createLife(700 + age)
        state.person.householdType = householdType
        state.person.stage = stageFor(age)
        state.year = state.person.birthYear + age
        if (flag) state.person.flags[flag] = true
        return { age, visible: eligibleCards(state, [card]).includes(card) }
      }).filter(item => item.visible).map(item => item.age)
      expect(eligibleAges.length, card.id).toBeGreaterThan(0)
      expect(eligibleAges.every(age => age >= 8 && age <= 17), card.id).toBe(true)
      expect(eligibleAges.every(age => age <= 12 ? card.stage === 'childhood' : card.stage === 'teen'), card.id).toBe(true)
    }
  })
})
