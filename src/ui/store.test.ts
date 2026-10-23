import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { cards } from '../content'
import { createLife } from '../engine/game'
import type { LifeState } from '../engine/types'
import { useGameStore } from './store'

const storage = new Map<string, string>()
const localStorageStub = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
  key: (index: number) => [...storage.keys()][index] ?? null,
  get length() { return storage.size },
}

vi.mock('../world/service', () => ({
  world: {
    getLiveCounts: () => ({ lives: 1, birthsToday: 0 }),
    getRecentBirths: () => [],
    getCohort: () => [],
    publishLife: () => {},
  },
}))

function savedLife(cardId?: string): LifeState {
  const life = createLife(74321)
  life.year = life.person.birthYear + 7
  life.person.stage = 'childhood'
  life.currentCardIds = cardId ? [cardId] : []
  return life
}

function createStoreWithSave(life: LifeState) {
  storage.set('chiwit-save-v2', JSON.stringify(life))
  setActivePinia(createPinia())
  return useGameStore()
}

beforeEach(() => {
  storage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00'))
  vi.stubGlobal('window', globalThis)
  vi.stubGlobal('localStorage', localStorageStub)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  storage.clear()
})

describe('player decision clock', () => {
  it('pauses the running year clock when a decision card appears', async () => {
    const life = savedLife()
    const store = createStoreWithSave(life)
    expect(store.playbackRunning).toBe(true)

    store.game!.currentCardIds = ['school-start']
    await nextTick()

    expect(store.playbackRunning).toBe(false)
    await vi.advanceTimersByTimeAsync(60_000)
    expect(store.game!.year).toBe(life.year)
    expect(store.game!.currentCardIds).toEqual(['school-start'])
  })

  it('starts a full selected duration after the player picks', async () => {
    const life = savedLife('school-start')
    const store = createStoreWithSave(life)
    const choiceId = cards.find(card => card.id === 'school-start')!.choices[0]!.id

    expect(store.playbackRunning).toBe(false)
    store.setYearDuration(15)
    store.pick(choiceId)

    expect(store.playbackRunning).toBe(true)
    expect(store.yearDurationSeconds).toBe(15)
    expect(store.yearRemainingMs).toBe(15_000)
    await vi.advanceTimersByTimeAsync(14_999)
    expect(store.game!.year).toBe(life.year)
    await vi.advanceTimersByTimeAsync(1)
    expect(store.game!.year).toBe(life.year + 1)
  })

  it('keeps auto cards resolving and the year clock running', async () => {
    const life = savedLife('heat-wave-auto')
    const store = createStoreWithSave(life)
    const year = store.game!.year
    const health = store.person!.health

    expect(store.playbackRunning).toBe(true)
    store.continueAuto()
    expect(store.person!.health).toBe(health - 1)
    expect(store.game!.log.at(-1)?.cardId).toBe('heat-wave-auto')
    expect(store.playbackRunning).toBe(true)

    await vi.advanceTimersByTimeAsync(30_000)
    expect(store.game!.year).toBe(year + 1)
  })

  it('resumes with a pending decision card paused until the player chooses', async () => {
    const life = savedLife('school-start')
    const store = createStoreWithSave(life)

    expect(store.card?.id).toBe('school-start')
    expect(store.playbackRunning).toBe(false)
    await vi.advanceTimersByTimeAsync(60_000)
    expect(store.game!.year).toBe(life.year)
    expect(store.card?.id).toBe('school-start')
  })

  it('skips and logs a stale decision card when no choice is available', async () => {
    const card = cards.find(item => item.id === 'school-start')!
    const originalChoices = card.choices
    card.choices = originalChoices.map(choice => ({ ...choice, requires: { age: '=', value: 99 } }))
    try {
      const life = savedLife('school-start')
      const store = createStoreWithSave(life)

      expect(store.playbackRunning).toBe(true)
      await vi.advanceTimersByTimeAsync(30_000)

      expect(store.game!.year).toBe(life.year + 1)
      expect(store.game!.log).toContainEqual(expect.objectContaining({
        cardId: 'school-start',
        text: 'เหตุการณ์นี้ไม่มีตัวเลือกที่ใช้ได้ในสถานการณ์นี้ จึงผ่านไปโดยไม่มีการตัดสินใจ',
      }))
    } finally {
      card.choices = originalChoices
    }
  })
})
