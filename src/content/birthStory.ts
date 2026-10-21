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
  'ไร่อ้อย': ['ครอบครัวดูแลไร่อ้อยและแบ่งงานกันตามช่วงของไร่', 'ผู้ใหญ่ในบ้านทำไร่อ้อยและคุยกันเรื่องงานกับเวลาของลูก', 'คนในบ้านช่วยกันดูแลไร่อ้อยและวางแผนค่าใช้จ่ายระหว่างรอผลผลิต'],
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
const lowResourceDetails = [
  'ของใช้ในบ้านต้องเลือกซื้อทีละอย่างตามเงินที่มี',
  'คนในบ้านช่วยกันวางแผนค่าใช้จ่ายจำเป็น',
  'บางช่วงครอบครัวต้องเลื่อนการซื้อของที่ยังไม่รีบใช้',
]
const debtDetails = [
  'ครอบครัวมีหนี้ที่ต้องทยอยจัดการควบคู่กับค่าใช้จ่ายประจำวัน',
  'ผู้ใหญ่ในบ้านคอยคิดเรื่องการชำระหนี้และรายจ่ายของครอบครัว',
  'รายรับส่วนหนึ่งถูกกันไว้สำหรับภาระหนี้ของบ้าน',
]
const villageParts = ['โนน', 'โคก', 'ดอน', 'หนอง', 'ห้วย', 'นา', 'โพน', 'บุ่ง', 'คำ']
const villageEndings = ['คำ', 'แก้ว', 'ทอง', 'คูณ', 'สุข', 'ดิน', 'ดาว', 'งาม']

const phrases: Record<'health' | 'aptitude' | 'diligence' | 'temperament', Record<Band, readonly string[]>> = {
  health: { low: ['สุขภาพแรกเกิดต้องคอยดูแลใกล้ชิด', 'ช่วงแรกต้องใส่ใจเรื่องการพักผ่อนและการดูแล', 'คนรอบตัวคอยสังเกตอาการอย่างใกล้ชิด'], mid: ['สุขภาพแรกเกิดอยู่ในระดับพอประคอง', 'ร่างกายเริ่มต้นในระดับกลาง ต้องดูแลตามวัย', 'การเติบโตเริ่มต้นอย่างค่อยเป็นค่อยไป'], high: ['สุขภาพแรกเกิดแข็งแรงดี', 'ร่างกายเริ่มต้นด้วยพื้นฐานที่แข็งแรง', 'ช่วงแรกเติบโตได้ดีตามวัย'] },
  aptitude: { low: ['ความถนัดยังค่อย ๆ เผยให้เห็น', 'ยังไม่มีใครรู้ว่าคุณจะสนใจสิ่งใดเป็นพิเศษ', 'การเรียนรู้เริ่มจากการค่อย ๆ สังเกตสิ่งรอบตัว'], mid: ['มีแววเรียนรู้จากสิ่งรอบตัว', 'เริ่มทำความเข้าใจสิ่งใหม่ได้ตามจังหวะของตัวเอง', 'ความสนใจค่อย ๆ ก่อตัวจากเรื่องใกล้ตัว'], high: ['รับรู้สิ่งใหม่ได้ไว', 'มักจับใจความจากสิ่งที่พบเห็นได้เร็ว', 'มีแววเรียนรู้สิ่งใหม่ได้คล่อง'] },
  diligence: { low: ['จังหวะการลงมือทำยังต้องอาศัยคนชวน', 'ต้องมีคนช่วยเตือนให้ค่อย ๆ ทำต่อ', 'การทำสิ่งเดิมให้ต่อเนื่องยังเป็นเรื่องที่ต้องฝึก'], mid: ['ค่อย ๆ ทำสิ่งเล็ก ๆ ได้ต่อเนื่อง', 'ทำงานตามจังหวะของตัวเองได้ดีขึ้นเรื่อย ๆ', 'เมื่อมีเวลาและคนคอยแนะนำก็ทำต่อได้'], high: ['มีแนวโน้มตั้งใจทำสิ่งที่เริ่มไว้', 'มักค่อย ๆ ทำงานจนเห็นผล', 'มีแรงตั้งต้นดีเมื่อได้ลองลงมือทำ'] },
  temperament: { low: ['อารมณ์อ่อนไหวต่อความเปลี่ยนแปลง', 'สิ่งแปลกใหม่อาจทำให้ต้องใช้เวลาปรับตัว', 'บรรยากาศรอบตัวส่งผลกับความรู้สึกได้ง่าย'], mid: ['ค่อย ๆ ปรับตัวเข้ากับสิ่งรอบข้าง', 'รับมือกับวันธรรมดาได้ตามจังหวะของตัวเอง', 'ความคุ้นเคยช่วยให้รู้สึกมั่นคงขึ้น'], high: ['รับมือกับความเปลี่ยนแปลงได้ดี', 'เปิดรับสิ่งใหม่ได้ค่อนข้างสบายใจ', 'ปรับจังหวะตามสถานการณ์ได้ดี'] },
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
  const siblings = person.relatives.filter(relative => relative.role === 'sibling')
  const siblingDetail = siblings.length
    ? ` พี่น้องที่มีชื่ออยู่ในครอบครัวคือ${siblings.map(relative => relative.name).join(' กับ ')}`
    : ' บ้านนี้ไม่มีพี่น้องร่วมรุ่นกับคุณ'
  const olderRelative = person.relatives.find(relative => relative.alive && (relative.role === 'grandmother' || relative.role === 'grandfather'))
  const elderDetail = olderRelative ? ` ญาติผู้ใหญ่คนหนึ่งในครอบครัวชื่อ${olderRelative.name}` : ''
  const familyDetail = person.debt > 0
    ? choose(debtDetails, `${seed}:debt-detail`)
    : person.householdMoney <= 20
      ? choose(lowResourceDetails, `${seed}:resource-detail`)
      : choose(homeDetails, `${seed}:home-detail`)
  const landDetail = person.householdLandRai > 0 ? ` ครอบครัวมีที่นา ${person.householdLandRai} ไร่` : ''
  const second = `${familyStory} คุณ${familyPosition}${siblingDetail}${elderDetail} ${familyDetail}${landDetail}`
  const third = [
    choose(phrases.health[bandFor(person.health)], `${seed}:health`),
    choose(phrases.aptitude[bandFor(person.aptitude)], `${seed}:aptitude`),
    choose(phrases.diligence[bandFor(person.diligence)], `${seed}:diligence`),
    choose(phrases.temperament[bandFor(person.temperament)], `${seed}:temperament`),
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

