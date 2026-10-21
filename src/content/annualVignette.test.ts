import { describe, expect, it } from 'vitest'
import { annualVignette } from './annualVignette'
import { createLife } from '../engine/game'

describe('annual quiet-year vignette', () => {
  it('uses the province and household context and stays stable for the same life and year', () => {
    const state = createLife(481)
    state.person.province = 'ขอนแก่น'
    state.person.householdType = 'งานฝีมือ'
    const first = annualVignette(state)
    expect(first).toContain('ขอนแก่น')
    expect(first).toContain('งานฝีมือ')
    expect(annualVignette(state)).toBe(first)
    state.year++
    expect(annualVignette(state)).not.toBe(first)
  })

  it('uses migration or caregiving context when those relatives are present', () => {
    const state = createLife(72)
    state.person.relatives[0]!.migrated = true
    expect(annualVignette(state)).toContain('ไปทำงานไกลบ้าน')
    state.person.relatives[0]!.migrated = false
    state.person.flags.fmGrandparentCare = true
    expect(annualVignette(state)).toContain('ช่วยดูแล')
  })

  it('names the relative in age-zero family notes and checks every household scene for dangling kin terms', () => {
    const state = createLife(72)
    state.year = state.person.birthYear
    const aunt = state.person.relatives[0]!
    aunt.role = 'aunt'
    aunt.name = 'แก้ว'
    aunt.migrated = false
    state.person.relatives = [aunt]
    state.person.flags.fmGrandparentCare = false
    expect(annualVignette(state)).toContain('แก้ว')
    expect(annualVignette(state)).not.toMatch(/(?:แม่|พ่อ|ยาย|ตา|ป้า|ลุง|พี่น้อง)\s+(?:ยัง|เป็น|ช่วย)/u)

    const householdTypes = [
      'ทำนา', 'รับจ้าง', 'ค้าขายเล็ก ๆ', 'ข้าราชการชั้นผู้น้อย', 'ประมงน้ำจืด',
      'งานฝีมือ', 'แรงงานในเมือง', 'ค้าขายครอบครัวไทยเชื้อสายจีน', 'ข้าราชการในเมือง',
    ]
    for (const [index, householdType] of householdTypes.entries()) {
      const sample = createLife(100 + index)
      sample.year = sample.person.birthYear
      sample.person.householdType = householdType
      for (let seed = 0; seed < 30; seed++) {
        sample.seed = seed
        expect(annualVignette(sample)).not.toMatch(/(?:แม่|พ่อ|ยาย|ตา|ป้า|ลุง|พี่น้อง)\s+(?:ยัง|เป็น|ช่วย)/u)
      }
    }
  })
})
