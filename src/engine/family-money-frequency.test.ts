import { describe, expect, it } from 'vitest'
import { simulateLife } from './game'

const ageWindows: Record<string, readonly [number, number]> = {
  'fm-care-start': [0, 2],
  'fm-care-school': [6, 9],
  'fm-rice-season': [5, 8],
  'fm-dry-spell': [9, 12],
  'fm-harvest-plan': [13, 16],
  'fm-rising-water': [8, 12],
  'fm-parent-moves': [3, 7],
  'fm-message-home': [13, 14],
  'fm-school-budget': [6, 10],
  'fm-school-route': [11, 12],
  'fm-grandparent-care': [0, 5],
  'fm-next-study-step': [15, 17],
  'fm-hired-work-round': [8, 12],
  'fm-hired-work-study': [15, 17],
  'fm-shop-restock': [8, 12],
  'fm-shop-keep-record': [15, 17],
  'fm-craft-materials': [8, 12],
  'fm-craft-pricing': [15, 17],
  'fm-fishing-equipment': [8, 12],
  'fm-fishing-repair-plan': [15, 17],
  'fm-city-commute-cost': [8, 12],
  'fm-city-school-plan': [15, 17],
  'fm-public-household-plan': [8, 12],
  'fm-public-study-cost': [15, 17],
}

describe('family and money event frequency', () => {
  it('reports 1,000 seeded lives by household type and finds no out-of-age event', () => {
    const groups = new Map<string, { lives: number; livesWithEvent: number; events: number; cards: Record<string, number> }>()
    const outOfAge: Array<{ id: string; age: number; householdType: string }> = []

    for (let seed = 1; seed <= 1000; seed++) {
      const life = simulateLife(seed)
      const type = life.person.householdType
      const group = groups.get(type) ?? { lives: 0, livesWithEvent: 0, events: 0, cards: {} }
      group.lives++
      const familyMoneyEvents = life.log.filter(event => event.cardId?.startsWith('fm-'))
      if (familyMoneyEvents.length) group.livesWithEvent++
      for (const event of familyMoneyEvents) {
        group.events++
        group.cards[event.cardId!] = (group.cards[event.cardId!] ?? 0) + 1
        const age = event.year - life.person.birthYear
        const window = ageWindows[event.cardId!]
        if (!window || age < window[0] || age > window[1]) outOfAge.push({ id: event.cardId!, age, householdType: type })
      }
      groups.set(type, group)
    }

    const report = Object.fromEntries([...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'th')).map(([type, group]) => [type, {
      lives: group.lives,
      livesWithEvent: group.livesWithEvent,
      averageEventsPerLife: Number((group.events / group.lives).toFixed(3)),
      eventsByCard: group.cards,
    }]))
    console.info(`FM_1000_REPORT=${JSON.stringify({ report, outOfAge })}`)
    expect(groups.size).toBeGreaterThan(0)
    expect(outOfAge).toEqual([])
  })
})
