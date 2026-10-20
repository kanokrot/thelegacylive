import { describe, expect, it, vi } from 'vitest'
import { balance } from './balance'
import { buildBirthStory } from './birthStory'
import isanTambons from './data/isan-tambon.json'
import { rollBirth } from '../engine/game'

describe('birth story presentation', () => {
  it('uses real administrative names, the person name, and a stable seed based story', () => {
    const person = rollBirth(532916, 2026).person
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 20, 12))
    const first = buildBirthStory(person)
    const second = buildBirthStory(person)
    vi.useRealTimers()
    const fullText = first.paragraphs.join(' ')

    expect(first).toEqual(second)
    expect(fullText).toContain(person.name)
    expect(fullText).toContain(person.province)
    expect(fullText).toContain(first.tambon)
    expect(fullText).toContain(first.amphoe)
    expect(fullText).toContain('เดือนตุลาคม')
    expect(first.fictionalVillage.startsWith('บ้าน')).toBe(true)
    expect(fullText).toContain('หมู่บ้านสมมติ')
    expect(fullText).toContain('ชีวิตของคุณเพิ่งเริ่มต้น')
    const province = (isanTambons as Array<{ province: string; amphoes: Array<{ name: string; tambons: string[] }> }>).find(item => item.province === person.province)!
    expect(province.amphoes.some(amphoe => amphoe.name.includes(first.amphoe) && amphoe.tambons.some(tambon => tambon.includes(first.tambon)))).toBe(true)
    expect(fullText).not.toMatch(/\{[^}]+\}|\b(?:TODO|TEMPLATE|PLACEHOLDER)\b/i)
  })

  it('provides family narration for every configured household type', () => {
    const person = rollBirth(532916, 2026).person
    const familyStories = new Set<string>()
    for (const householdType of balance.householdTypes) {
      const story = buildBirthStory({ ...person, householdType }, new Date(2026, 9, 20, 12))
      expect(story.paragraphs[1].length).toBeGreaterThan(20)
      expect(story.paragraphs.join(' ')).not.toMatch(/\{[^}]+\}|\b(?:TODO|TEMPLATE|PLACEHOLDER)\b/i)
      familyStories.add(story.paragraphs[1])
    }
    expect(familyStories.size).toBe(balance.householdTypes.length)
  })
})
