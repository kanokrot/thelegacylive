import type { LifeState } from '../engine/types'

const seasons = ['ต้นฤดูฝน', 'ช่วงฝนเว้นช่วง', 'หน้าแล้ง'] as const
const householdScenes: Record<string, readonly string[]> = {
  ทำนา: ['ผู้ใหญ่ในบ้านคอยดูฝนและจัดงานที่ต้องทำ', 'คนในบ้านแบ่งเงินไว้ใช้ก่อนรอบปลูกหน้า'],
  รับจ้าง: ['ผู้ใหญ่คุยกันว่าจะรับงานใกล้บ้านหรือเดินทางไกล', 'รายรับจากงานแต่ละรอบถูกแบ่งไว้ใช้ในบ้าน'],
  'ค้าขายเล็ก ๆ': ['คนในบ้านช่วยกันดูของที่ต้องซื้อมาเติมร้าน', 'ครอบครัวคุยกันว่าจะเก็บเงินสำรองไว้เท่าไร'],
  'ข้าราชการชั้นผู้น้อย': ['คนในบ้านช่วยกันวางแผนค่าเดินทางและรายจ่ายประจำ', 'ผู้ใหญ่จัดตารางงานให้ลงตัวกับเรื่องในบ้าน'],
  'ประมงน้ำจืด': ['ผู้ใหญ่ดูแลเครื่องมือที่ใช้หาเลี้ยงบ้าน', 'คนในบ้านคุยกันว่าจะซ่อมของที่ชำรุดหรือรอก่อน'],
  งานฝีมือ: ['ผู้ใหญ่จัดเวลาทำงานฝีมือควบคู่กับงานในบ้าน', 'คนในบ้านคุยกันว่าจะซื้อวัสดุเพิ่มหรือใช้ของที่มี'],
  แรงงานในเมือง: ['ผู้ใหญ่จัดเวลาเดินทางไปทำงานและกลับบ้าน', 'ค่าเดินทางของคนทำงานถูกนำมาคิดรวมกับรายจ่ายในบ้าน'],
  'ค้าขายครอบครัวไทยเชื้อสายจีน': ['คนในบ้านช่วยกันดูของที่ต้องซื้อมาเติมร้าน', 'ครอบครัวคุยกันว่าจะเก็บเงินสำรองไว้เท่าไร'],
  ข้าราชการในเมือง: ['คนในบ้านช่วยกันวางแผนค่าเดินทางและรายจ่ายประจำ', 'ผู้ใหญ่จัดตารางงานให้ลงตัวกับเรื่องในบ้าน'],
}
export function annualVignette(state: LifeState): string {
  const { person } = state
  const key = (state.seed ^ Math.imul(state.year, 0x45d9f3b)) >>> 0
  const season = seasons[key % seasons.length]
  const scenes = householdScenes[person.householdType] ?? ['คนในบ้านช่วยกันจัดการเรื่องที่ต้องทำในแต่ละวัน']
  const scene = scenes[(key >>> 4) % scenes.length]
  const livingRelatives = person.relatives.filter(relative => relative.alive)
  const migrant = livingRelatives.find(relative => relative.migrated)
  const grandmother = person.flags.fmGrandparentCare ? livingRelatives.find(relative => relative.role === 'grandmother') : undefined
  const familyNote = migrant
    ? 'ข่าวจากญาติที่ไปทำงานไกลบ้านยังเป็นเรื่องที่บ้านถามไถ่กัน'
    : grandmother
      ? `${grandmother.name || 'ญาติคนหนึ่งในบ้าน'}ยังช่วยดูแลคุณอยู่`
      : livingRelatives.length
        ? `${livingRelatives[key % livingRelatives.length]!.name || 'ญาติคนหนึ่งในบ้าน'} ยังเป็นคนหนึ่งที่อยู่ในเรื่องราวของครอบครัว`
        : 'คนในบ้านค่อย ๆ ผ่านเรื่องต่าง ๆ ไปด้วยกัน'

  return `${season}ในจังหวัด${person.province} ${scene} ${familyNote}`
}
