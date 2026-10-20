import type { Person } from '../engine/types'

const summaryByCard: Record<string, string> = {
  'school-start': 'เริ่มเรียนรู้จากโรงเรียนใกล้บ้าน',
  'grade-six': 'พยายามเรียนต่อหลังจบประถม',
  'grade-nine': 'ตัดสินใจเรื่องเรียนต่อและงานตามกำลังครอบครัว',
  'grade-twelve': 'ก้าวสู่การเรียนต่อหรือการทำงาน',
  'migration-first': 'เดินทางไปทำงานไกลบ้านและช่วยส่งเงินกลับ',
  'love': 'สร้างความสัมพันธ์ที่มีความหมาย',
  'marriage': 'สร้างชีวิตร่วมกับคนรัก',
  'children': 'เลี้ยงดูลูกโดยมีครอบครัวช่วยกัน',
  'grandparent-care': 'ทำงานไกลบ้านและฝากลูกไว้กับยายช่วยดูแล',
  'parent-care': 'ช่วยดูแลแม่เมื่ออายุมากขึ้น',
  'land-dispute': 'หาทางพูดคุยเรื่องที่ดินในครอบครัว',
  'inheritance': 'ร่วมตกลงเรื่องทรัพย์สินในครอบครัว',
}

export function buildMemorial(person: Person, year: number, log: Array<{ title: string; text: string; cardId?: string }>): string {
  const moments = log.flatMap(event => event.cardId && summaryByCard[event.cardId] ? [summaryByCard[event.cardId]!] : [])
  const unique = [...new Set(moments)].slice(-2)
  const story = unique.length ? unique.join(' และ ') : 'ใช้ชีวิตท่ามกลางผู้คนและบ้านเกิด'
  return `${person.name} เกิดที่${person.province} มีชีวิตอยู่ ${year - person.birthYear} ปี ${story}`
}
