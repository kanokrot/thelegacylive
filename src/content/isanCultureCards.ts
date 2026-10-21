import type { Card, Condition, Effect } from '../engine/types'

const ages = (min: number, max: number): Condition => ({ all: [{ age: '>=', value: min }, { age: '<=', value: max }] })
const self = (key: 'wellbeing' | 'knowledge' | 'relationships' | 'careBurden' | 'diligence', delta: number): Effect => ({ target: 'self', key, delta })
const home = (key: 'money', delta: number): Effect => ({ target: 'household', key, delta })

export const isanCultureCards: Card[] = [
  {
    id: 'isan-sugarcane-school-break', stage: ['childhood', 'teen'], title: 'ช่วงตัดอ้อยกับวันเรียน',
    body: 'ตอนอายุ 12–13 ช่วงที่ไร่อ้อยต้องใช้แรงเพิ่มมาใกล้กับวันเรียน ครอบครัวคุยกันว่างานส่วนไหนที่คุณช่วยได้โดยไม่กระทบการเรียน',
    when: { all: [ages(12, 13), { household: 'ไร่อ้อย' }] }, weight: 2, once: true,
    choices: [
      { id: 'isan-sugarcane-school-break-a', label: 'ช่วยงานเบา ๆ ในวันหยุดและแบ่งเวลาอ่านหนังสือ', effects: [self('diligence', 2), self('careBurden', 1)] },
      { id: 'isan-sugarcane-school-break-b', label: 'คุยกับผู้ใหญ่ให้จัดงานไร่ไม่ชนเวลาเรียน', effects: [self('knowledge', 1), self('wellbeing', 1)] },
    ],
  },
  {
    id: 'isan-extra-study', stage: 'teen', title: 'เรียนพิเศษก่อนสอบ',
    body: 'ผู้ใหญ่ในบ้านอยากเพิ่มโอกาสให้คุณเรียนต่อ จึงชวนคุยเรื่องค่าเรียนพิเศษกับทางเลือกอ่านหนังสือกับครูหรือเพื่อน',
    when: { all: [ages(13, 17), { householdMoney: '>=', value: 30 }] }, weight: 1, once: true,
    choices: [
      { id: 'isan-extra-study-a', label: 'จ่ายค่าเรียนพิเศษเพื่อเตรียมสอบ', effects: [home('money', -3), self('knowledge', 3)] },
      { id: 'isan-extra-study-b', label: 'อ่านหนังสือกับครูหรือเพื่อนแล้วเก็บเงินไว้', effects: [self('knowledge', 1), self('wellbeing', 1)] },
    ],
  },
  {
    id: 'isan-bun-bang-fai-yasothon', stage: 'teen', title: 'ซ้อมฟ้อนก่อนบุญบั้งไฟ',
    body: 'ในยโสธร ชุมชนกำลังเตรียมขบวนบุญบั้งไฟ มีทั้งซ้อมฟ้อนและช่วยตกแต่งขบวน คุณต้องแบ่งเวลาให้กิจกรรมชุมชนกับเรื่องเรียนหรือเรื่องที่บ้าน',
    when: { all: [ages(12, 18), { province: 'ยโสธร' }] }, weight: 2, once: true,
    choices: [
      { id: 'isan-bun-bang-fai-yasothon-a', label: 'ไปซ้อมฟ้อนและช่วยงานขบวนกับเพื่อนบ้าน', effects: [self('relationships', 2), self('wellbeing', 1)] },
      { id: 'isan-bun-bang-fai-yasothon-b', label: 'ช่วยงานที่บ้านและเก็บเวลาไว้เตรียมสอบ', effects: [self('knowledge', 1), self('careBurden', 1)] },
    ],
  },
  {
    id: 'isan-bun-khao-sak', stage: ['childhood', 'teen', 'youngAdult', 'midLife'], title: 'เตรียมพาข้าวสาก',
    body: 'ปีนี้คนในบ้านบางคนจะเตรียมพาข้าวและของทำบุญข้าวสากไปวัด เขียนชื่อใส่สลาก และฝากของถึงญาติใกล้บ้าน พร้อมระลึกถึงคนในครอบครัวที่ล่วงลับ',
    when: ages(10, 55), weight: 1, once: true,
    choices: [
      { id: 'isan-bun-khao-sak-a', label: 'ช่วยผู้ใหญ่เตรียมสำรับและนำของไปวัด', effects: [home('money', -1), self('relationships', 2)] },
      { id: 'isan-bun-khao-sak-b', label: 'แบ่งของเท่าที่บ้านไหวแล้วแวะไปหาญาติ', effects: [self('relationships', 2), self('wellbeing', 1)] },
    ],
  },
  {
    id: 'isan-bai-si-next-step', stage: ['teen', 'youngAdult'], title: 'ผูกแขนส่งขวัญก่อนก้าวต่อ',
    body: 'หลังจบ ม.6 และก่อนเริ่มเส้นทางใหม่ ญาติผู้ใหญ่บางคนชวนมาผูกแขนบายศรีสู่ขวัญ ให้กำลังใจก่อนเดินทางไปเรียนต่อหรือเริ่มงาน',
    when: { all: [ages(18, 22), { flag: 'completedM6' }] }, weight: 2, once: true,
    choices: [
      { id: 'isan-bai-si-next-step-a', label: 'ชวนญาติมาร่วมผูกแขนและรับพร', effects: [home('money', -2), self('relationships', 3)] },
      { id: 'isan-bai-si-next-step-b', label: 'จัดวงเล็ก ๆ กับผู้ใหญ่ใกล้ชิดก่อนออกเดินทาง', effects: [self('relationships', 2), self('wellbeing', 1)] },
    ],
  },
]
