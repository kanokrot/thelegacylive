import type { Card, Condition, Effect } from '../engine/types'

const ages = (min: number, max: number): Condition => ({ all: [{ age: '>=', value: min }, { age: '<=', value: max }] })
const household = (name: string): Condition => ({ household: name })
const anyHousehold = (...names: string[]): Condition => ({ any: names.map(household) })
const home = (key: 'money' | 'debt', delta: number): Effect => ({ target: 'household', key, delta })
const self = (key: 'wellbeing' | 'knowledge' | 'relationships' | 'careBurden' | 'diligence', delta: number): Effect => ({ target: 'self', key, delta })
const thread = (id: string, title: string, body: string, type: Condition, flag: string, choiceA: string, choiceB: string, effectsA: Effect[], effectsB: Effect[]): Card => ({
  id, stage: 'childhood', title, body, when: { all: [ages(8, 12), type] }, weight: 2, once: true,
  choices: [
    { id: `${id}-a`, label: choiceA, effects: effectsA, setFlags: [flag] },
    { id: `${id}-b`, label: choiceB, effects: effectsB, setFlags: [flag] },
  ],
})
const continuation = (id: string, title: string, body: string, type: Condition, flag: string, choiceA: string, choiceB: string, effectsA: Effect[], effectsB: Effect[]): Card => ({
  id, stage: 'teen', title, body, when: { all: [ages(15, 17), type, { flag }] }, weight: 2, once: true,
  choices: [
    { id: `${id}-a`, label: choiceA, effects: effectsA },
    { id: `${id}-b`, label: choiceB, effects: effectsB },
  ],
})

const hiredHome = household('รับจ้าง')
const shopHome = anyHousehold('ค้าขายเล็ก ๆ', 'ค้าขายครอบครัวไทยเชื้อสายจีน')
const craftHome = household('งานฝีมือ')
const fishingHome = household('ประมงน้ำจืด')
const cityWorkHome = household('แรงงานในเมือง')
const publicWorkHome = anyHousehold('ข้าราชการชั้นผู้น้อย', 'ข้าราชการในเมือง')

// Sources: FM01, FM02. These are fictional situations; household type is a story context, not a claim about a family's wealth.
// TODO(verify): Review the local details of work scheduling with people from the communities represented.
const hiredWork = [
  thread('fm-hired-work-round', 'งานเข้ามาไม่พร้อมกัน', 'ช่วงหนึ่งงานรับจ้างเข้ามาไม่ตรงกัน ผู้ใหญ่คุยกันว่าจะเดินทางไปรับงานไกลขึ้นหรือเก็บแรงไว้รองานใกล้บ้าน', hiredHome, 'fmHiredWorkRound', 'รับงานไกลขึ้นเพื่อเพิ่มรายรับ', 'รอรับงานใกล้บ้านและกันเงินไว้ก่อน', [home('money', 2), self('careBurden', 1)], [home('money', -1), self('wellbeing', 1)]),
  continuation('fm-hired-work-study', 'คุยเรื่องงานกับค่าเรียน', 'พอใกล้จบช่วงมัธยมต้น คุณช่วยผู้ใหญ่ดูรายจ่ายที่ต้องใช้ต่อ ผู้ใหญ่ชั่งใจว่าจะรับงานเพิ่มหรือกันเงินไว้ให้คุณเรียนต่อ', hiredHome, 'fmHiredWorkRound', 'ช่วยกันหาเงินค่าเรียนและเรียนต่อ', 'เรียนใกล้บ้านแล้วช่วยงานหลังเลิกเรียน', [home('money', -1), self('knowledge', 2)], [home('money', 1), self('careBurden', 1)]),
]

// TODO(verify): Review the small-shop and family-business details locally; no ethnic practice is assumed here.
const shopWork = [
  thread('fm-shop-restock', 'ของที่ต้องเติมเข้าร้าน', 'ของบางอย่างในร้านใกล้หมด ผู้ใหญ่คุยกันว่าจะซื้อมาเติมให้ครบหรือซื้อเท่าที่เงินสำรองพอไหว', shopHome, 'fmShopRestock', 'ซื้อของให้ครบตามที่วางแผน', 'เติมเฉพาะของจำเป็นและเก็บเงินไว้', [home('money', -2), self('wellbeing', 1)], [home('money', -1), self('knowledge', 1)]),
  continuation('fm-shop-keep-record', 'ช่วยจดรายจ่ายของร้าน', 'ตอนนี้คุณโตพอจะช่วยจดของที่ซื้อเข้าร้านได้ ผู้ใหญ่ชวนคุยว่าจะจดทุกอย่างไว้หรือช่วยดูร้านช่วงที่คนในบ้านออกไปทำธุระ', shopHome, 'fmShopRestock', 'ช่วยจดรายจ่ายให้เป็นรายการ', 'ช่วยเฝ้าร้านเป็นบางช่วง', [self('knowledge', 2), self('diligence', 1)], [self('relationships', 2), self('careBurden', 1)]),
]

// TODO(verify): Review the craft-work details and avoid suggesting one practice fits every household.
const craftWork = [
  thread('fm-craft-materials', 'วัสดุทำงานใกล้หมด', 'ผู้ใหญ่ในบ้านรับงานฝีมือไว้และวัสดุบางอย่างใกล้หมด จึงต้องเลือกว่าจะซื้อเพิ่มตอนนี้หรือแบ่งงานตามของที่มี', craftHome, 'fmCraftMaterials', 'ซื้อวัสดุให้พอทำงานที่รับไว้', 'ทำเท่าที่วัสดุเดิมพอและเก็บเงินสำรอง', [home('money', -2), self('wellbeing', 1)], [home('money', 1), self('diligence', 1)]),
  continuation('fm-craft-pricing', 'ลองคิดต้นทุนงานชิ้นหนึ่ง', 'คุณช่วยผู้ใหญ่ไล่ดูว่างานชิ้นหนึ่งใช้วัสดุและเวลาแค่ไหน ก่อนคุยว่าจะรับงานเพิ่มหรือพักให้เสร็จตามกำหนดเดิม', craftHome, 'fmCraftMaterials', 'ช่วยจดต้นทุนก่อนรับงานเพิ่ม', 'ช่วยทำงานเดิมให้เสร็จแล้วค่อยตัดสินใจ', [self('knowledge', 2), self('diligence', 1)], [self('wellbeing', 1), self('relationships', 1)]),
]

// TODO(verify): Review the fishing-equipment details with local freshwater fishing households.
const fishingWork = [
  thread('fm-fishing-equipment', 'เครื่องมือหาปลาต้องซ่อม', 'เครื่องมือที่ผู้ใหญ่ใช้หาเลี้ยงบ้านชำรุดบางส่วน ครอบครัวคุยกันว่าจะจ่ายค่าซ่อมก่อนหรือรอแล้วกันเงินไว้ใช้เรื่องอื่น', fishingHome, 'fmFishingEquipment', 'ซ่อมก่อนเพื่อกลับไปใช้งาน', 'รอซ่อมและกันเงินไว้ก่อน', [home('money', -2), self('wellbeing', 1)], [home('money', 1), self('careBurden', 1)]),
  continuation('fm-fishing-repair-plan', 'วางแผนดูแลเครื่องมือ', 'คุณช่วยผู้ใหญ่ทบทวนค่าใช้จ่ายที่เกิดขึ้นกับเครื่องมือ ครอบครัวคุยกันว่าจะทยอยซ่อมหรือเก็บเงินก้อนสำหรับครั้งหน้า', fishingHome, 'fmFishingEquipment', 'ทยอยซ่อมตามความจำเป็น', 'เก็บเงินสำรองก่อนแล้วค่อยซ่อม', [home('money', -1), self('knowledge', 1)], [home('money', 1), self('wellbeing', 1)]),
]

// Sources: FM01, FM02. These fictional choices do not assume that all city workers have the same schedule.
const cityWork = [
  thread('fm-city-commute-cost', 'ค่าเดินทางของผู้ใหญ่', 'ผู้ใหญ่ในบ้านต้องจัดค่าเดินทางไปทำงานรวมกับรายจ่ายอื่น ครอบครัวคุยกันว่าจะเลือกเวลาเดินทางที่ประหยัดกว่าหรือรักษาตารางเดิมไว้', cityWorkHome, 'fmCityCommuteCost', 'ปรับเวลาเดินทางเพื่อลดค่าใช้จ่าย', 'ใช้ตารางเดิมและกันเงินส่วนอื่นให้น้อยลง', [home('money', 1), self('wellbeing', -1)], [home('money', -1), self('relationships', 1)]),
  continuation('fm-city-school-plan', 'เวลาเรียนกับเวลางานในบ้าน', 'เมื่อคุณเริ่มคิดเรื่องเรียนต่อ คนในบ้านช่วยกันดูเวลาเดินทางและรายจ่ายที่เพิ่มขึ้น คุณคุยกับผู้ใหญ่ว่าจะจัดแผนอย่างไร', cityWorkHome, 'fmCityCommuteCost', 'เลือกที่เรียนที่เดินทางไหว', 'สมัครที่อยากเรียนแล้วช่วยกันวางแผนค่าเดินทาง', [home('money', 1), self('knowledge', 1)], [home('money', -1), self('knowledge', 2)]),
]

// TODO(verify): Review the work and household scheduling details locally before treating them as representative.
const publicWork = [
  thread('fm-public-household-plan', 'รายจ่ายประจำของบ้าน', 'ผู้ใหญ่ในบ้านไล่ดูรายจ่ายประจำกับเงินที่ต้องเก็บไว้เรื่องจำเป็น คุณได้ยินพวกเขาคุยว่าจะลดรายจ่ายส่วนไหนก่อน', publicWorkHome, 'fmPublicHouseholdPlan', 'ช่วยกันลดรายจ่ายที่เลื่อนได้', 'เก็บแผนเดิมไว้แล้วค่อยปรับเดือนหน้า', [home('money', 1), self('diligence', 1)], [home('money', -1), self('wellbeing', 1)]),
  continuation('fm-public-study-cost', 'เตรียมค่าใช้จ่ายเรียนต่อ', 'พอถึงเวลาคุยเรื่องเรียนต่อ ผู้ใหญ่ช่วยคุณไล่ดูค่าใช้จ่ายและการเดินทางที่ต้องเตรียมล่วงหน้า', publicWorkHome, 'fmPublicHouseholdPlan', 'วางแผนค่าใช้จ่ายทีละส่วน', 'เลือกทางที่ใกล้บ้านและแบ่งเงินไว้ก่อน', [self('knowledge', 2), self('diligence', 1)], [home('money', 1), self('knowledge', 1)]),
]

export const isanHouseholdThreadCards: Card[] = [
  ...hiredWork, ...shopWork, ...craftWork, ...fishingWork, ...cityWork, ...publicWork,
]
