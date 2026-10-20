import isanTambons from './data/isan-tambon.json'
import type { Person } from '../engine/types'

type ProvincePlaces = { province: string; amphoes: Array<{ name: string; tambons: string[] }> }
type Band = 'low' | 'mid' | 'high'

const places = isanTambons as ProvincePlaces[]
const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const seasonalNotes = [
  'ช่วงฤดูหนาว', 'ช่วงฤดูร้อน', 'ช่วงฤดูร้อน', 'ช่วงอากาศร้อน', 'ช่วงต้นฤดูฝน', 'ช่วงต้นฤดูฝน',
  'ช่วงฤดูฝน', 'ช่วงฤดูฝน', 'ช่วงปลายฤดูฝน', 'ช่วงปลายฤดูฝน', 'ช่วงปลายฝน', 'ช่วงอากาศเย็น',
]

const householdWork: Record<string, readonly [string, string, string]> = {
  'ทำนา': ['พ่อแม่ทำนาและช่วยกันดูแลแปลงข้าว', 'พ่อแม่แบ่งเวลาระหว่างงานนาและงานรับจ้างตามฤดูกาล', 'ครอบครัวทำนา โดยมีญาติช่วยกันในช่วงลงแขก'],
  'รับจ้าง': ['พ่อแม่รับจ้างหลายอย่างตามงานที่มี', 'พ่อแม่ทำงานรับจ้างและแบ่งกันดูแลบ้าน', 'คนในบ้านรับงานเป็นครั้งคราวเพื่อให้มีรายได้ต่อเนื่อง'],
  'ค้าขายเล็ก ๆ': ['พ่อแม่ดูแลร้านเล็ก ๆ และจัดของขายในแต่ละวัน', 'ครอบครัวหารายได้จากการค้าขายของใช้และอาหาร', 'พ่อแม่ค้าขายเล็ก ๆ ควบคู่กับงานในบ้าน'],
  'ข้าราชการชั้นผู้น้อย': ['พ่อแม่ทำงานราชการระดับต้นและช่วยกันดูแลบ้าน', 'คนหนึ่งทำงานราชการ อีกคนรับผิดชอบงานในบ้านและงานเสริม', 'ครอบครัวมีรายได้จากงานราชการระดับต้นและงานเสริม'],
  'ประมงน้ำจืด': ['พ่อแม่หาปลาและแบ่งเวลาขายหรือแปรรูป', 'ครอบครัวทำประมงน้ำจืดควบคู่กับงานตามฤดูกาล', 'พ่อแม่ดูแลเครื่องมือหาปลาและนำผลจับไปขาย'],
  'งานฝีมือ': ['พ่อแม่รับทำงานฝีมือและแบ่งงานกันในครอบครัว', 'ครอบครัวทำงานฝีมือเป็นชิ้น ๆ ตามคำสั่งซื้อ', 'พ่อแม่ทำของใช้และงานฝีมือขายควบคู่กับงานอื่น'],
  'แรงงานในเมือง': ['พ่อแม่ทำงานรับค่าจ้างในเมืองและกลับบ้านตามเวลางาน', 'ครอบครัวพึ่งรายได้จากงานประจำในเมือง', 'พ่อแม่เดินทางไปทำงานในเมืองและจัดเวลาดูแลบ้านร่วมกัน'],
  'ค้าขายครอบครัวไทยเชื้อสายจีน': ['ครอบครัวดูแลร้านค้าและแบ่งหน้าที่กันในแต่ละวัน', 'พ่อแม่ค้าขายและช่วยกันจัดของกับดูแลลูกค้า', 'คนในบ้านร่วมกันดูแลร้านและงานประจำวัน'],
  'ข้าราชการในเมือง': ['พ่อแม่ทำงานราชการในเมืองและช่วยกันดูแลบ้าน', 'ครอบครัวมีรายได้จากงานราชการและแบ่งหน้าที่ในบ้าน', 'พ่อแม่ทำงานในหน่วยงานของรัฐและจัดเวลาครอบครัวร่วมกัน'],
}

const homeDetails = [
  'บ้านมีชานเล็ก ๆ ไว้นั่งพักช่วงเย็น',
  'มุมหนึ่งของบ้านจัดไว้สำหรับเก็บของใช้ประจำวัน',
  'ในบ้านมีเสื่อผืนหนึ่งที่ทุกคนใช้พักและพูดคุยกัน',
  'พื้นที่หน้าบ้านใช้ตากผ้าและวางของที่ต้องหยิบใช้บ่อย',
  'ครอบครัวแบ่งพื้นที่ในบ้านให้ทำงานและพักผ่อนได้พร้อมกัน',
]
const villageParts = ['โนน', 'โคก', 'ดอน', 'หนอง', 'ห้วย', 'นา', 'โพน', 'บุ่ง', 'คำ']
const villageEndings = ['คำ', 'แก้ว', 'ทอง', 'คูณ', 'สุข', 'ดิน', 'ดาว', 'งาม']

const phrases: Record<'health' | 'aptitude' | 'diligence' | 'temperament', Record<Band, readonly string[]>> = {
  health: { low: ['สุขภาพแรกเกิดต้องคอยดูแลใกล้ชิด'], mid: ['สุขภาพแรกเกิดอยู่ในระดับพอประคอง'], high: ['สุขภาพแรกเกิดแข็งแรงดี'] },
  aptitude: { low: ['ความถนัดยังค่อย ๆ เผยให้เห็น'], mid: ['มีแววเรียนรู้จากสิ่งรอบตัว'], high: ['รับรู้สิ่งใหม่ได้ไว'] },
  diligence: { low: ['จังหวะการลงมือทำยังต้องอาศัยคนชวน'], mid: ['ค่อย ๆ ทำสิ่งเล็ก ๆ ได้ต่อเนื่อง'], high: ['มีแนวโน้มตั้งใจทำสิ่งที่เริ่มไว้'] },
  temperament: { low: ['อารมณ์อ่อนไหวต่อความเปลี่ยนแปลง'], mid: ['ค่อย ๆ ปรับตัวเข้ากับสิ่งรอบข้าง'], high: ['รับมือกับความเปลี่ยนแปลงได้ดี'] },
}

const hash = (text: string): number => {
  let value = 0x811c9dc5
  for (let index = 0; index < text.length; index++) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 0x01000193)
  }
  return value >>> 0
}

const choose = <T>(items: readonly T[], seed: string): T => items[hash(seed) % items.length]!
const bandFor = (value: number): Band => value < 34 ? 'low' : value < 67 ? 'mid' : 'high'

export interface BirthStory {
  paragraphs: [string, string, string]
  tambon: string
  amphoe: string
  fictionalVillage: string
}

export function buildBirthStory(person: Person, date = new Date()): BirthStory {
  const seed = person.id
  const province = places.find(item => item.province === person.province)
  if (!province) throw new Error(`Missing Isan administrative data for ${person.province}`)
  const amphoe = choose(province.amphoes, `${seed}:amphoe`)
  const tambon = choose(amphoe.tambons, `${seed}:tambon`)
  const village = `บ้าน${choose(villageParts, `${seed}:village-prefix`)}${choose(villageEndings, `${seed}:village-ending`)}`
  const month = date.getMonth()
  const familyStory = choose(householdWork[person.householdType] ?? householdWork['รับจ้าง']!, `${seed}:family-work`)
  const first = `${person.name} เกิดในเดือน${monthNames[month]} ${seasonalNotes[month]} ที่โรงพยาบาลของอำเภอ ใน${tambon} ${amphoe.name} จังหวัด${person.province} หมู่บ้านสมมติในเรื่องนี้มีชื่อว่า${village}`
  const familyPosition = person.siblingCount === 0 ? 'เป็นลูกคนเดียว' : `เป็นลูกคนที่ ${person.birthOrder} จากพี่น้อง ${person.siblingCount + 1} คน`
  const second = `${familyStory} คุณ${familyPosition} ${choose(homeDetails, `${seed}:home-detail`)}`
  const third = [
    phrases.health[bandFor(person.health)][0],
    phrases.aptitude[bandFor(person.aptitude)][0],
    phrases.diligence[bandFor(person.diligence)][0],
    phrases.temperament[bandFor(person.temperament)][0],
    'ชีวิตของคุณเพิ่งเริ่มต้น',
  ].join(' ')
  return { paragraphs: [first, second, third], tambon: tambon.replace(/^ตำบล/, ''), amphoe: amphoe.name.replace(/^อำเภอ/, ''), fictionalVillage: village }
}

export const birthStoryContent = {
  title: 'ประวัติ',
  gender: 'เพศ',
  birthYear: 'ปีเกิด',
  birthOrder: 'ลำดับพี่น้อง',
  family: 'ครอบครัว',
  provinceMap: 'แผนที่จังหวัดเกิด',
  incomeTitle: 'รายได้ครัวเรือนต่อเดือน',
  median: 'มัธยฐาน',
  mean: 'ค่าเฉลี่ยจังหวัด',
  regionalMean: 'ค่าเฉลี่ยภาคอีสาน',
  traits: ['สุขภาพแรกเกิด', 'พรสวรรค์', 'ความขยัน', 'นิสัยใจคอ'] as const,
  source: 'สสช. สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน 2566',
} as const

