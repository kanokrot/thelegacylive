import type { Card, Condition, Effect } from '../engine/types'

const ages = (min: number, max: number): Condition => ({ all: [{ age: '>=', value: min }, { age: '<=', value: max }] })
const home = (key: 'money' | 'debt', delta: number): Effect => ({ target: 'household', key, delta })
const self = (key: 'wellbeing' | 'knowledge' | 'relationships' | 'careBurden' | 'diligence', delta: number): Effect => ({ target: 'self', key, delta })
const farmHome = { household: 'ทำนา' } as const

export const isanFamilyMoneyCards: Card[] = [
  // Sources: FM03, FM04.
  {
    id: 'fm-care-start', stage: 'childhood', title: 'แบ่งเวลาดูแลกัน',
    body: 'ตอนคุณยังเล็ก ผู้ใหญ่ในบ้านต้องออกไปทำงานและคุยกันว่าใครจะช่วยดูแลคุณระหว่างวัน บางวันคนในบ้านต้องสลับเวลางานเพื่อให้มีคนอยู่ด้วย',
    when: ages(0, 2), weight: 3, once: true,
    choices: [
      { id: 'fm-care-start-a', label: 'ให้ญาติช่วยดูแล แล้วผู้ใหญ่ไปทำงานตามเวลา', effects: [home('money', 2), self('relationships', -1)], setFlags: ['fmSharedCare'] },
      { id: 'fm-care-start-b', label: 'ผู้ใหญ่ขอลดเวลางานเพื่ออยู่กับคุณ', effects: [home('money', -2), self('wellbeing', 1)], setFlags: ['fmParentNearby'] },
    ],
  },
  // Sources: FM03, FM04.
  {
    id: 'fm-care-school', stage: 'childhood', title: 'คนมารับหลังเลิกเรียน',
    body: 'พอคุณเริ่มไปโรงเรียน คนที่เคยช่วยดูแลต้องจัดเวลาให้ตรงกับรถรับส่งและเวลางาน ผู้ใหญ่คุยกันว่าจะจ่ายค่าเดินทางเพิ่มหรือขอให้ญาติช่วยรับ',
    when: { all: [ages(6, 9), { flag: 'fmSharedCare' }] }, weight: 2, once: true,
    choices: [
      { id: 'fm-care-school-a', label: 'จ่ายค่าเดินทางให้มารับตามเวลา', effects: [home('money', -2), self('wellbeing', 1)], setFlags: ['fmReliablePickup'] },
      { id: 'fm-care-school-b', label: 'ขอให้ญาติช่วยรับในวันที่ว่าง', effects: [self('relationships', 2), self('careBurden', 1)], setFlags: ['fmFamilyPickup'] },
    ],
  },
  // Source: FM05.
  {
    id: 'fm-rice-season', stage: 'childhood', title: 'เตรียมตัวก่อนลงนา',
    body: 'ช่วงเริ่มฤดูปลูกข้าว ผู้ใหญ่เตรียมเมล็ดพันธุ์และดูฝนก่อนลงมือ คุณยังเล็ก ผู้ใหญ่จึงเป็นคนตัดสินใจว่าจะซื้อของให้ครบหรือเก็บเงินไว้ใช้ในบ้าน',
    when: { all: [ages(5, 8), farmHome] }, weight: 2, once: true,
    choices: [
      { id: 'fm-rice-season-a', label: 'ซื้อของที่ต้องใช้ให้พร้อมก่อน', effects: [home('money', -2), self('wellbeing', 1)], setFlags: ['fmRicePlan'] },
      { id: 'fm-rice-season-b', label: 'ยืมอุปกรณ์จากญาติและเก็บเงินสำรอง', effects: [home('money', 1), home('debt', 1), self('relationships', 1)], setFlags: ['fmRicePlan'] },
    ],
  },
  // Source: FM06.
  {
    id: 'fm-dry-spell', stage: 'childhood', title: 'ฝนเว้นช่วง',
    body: 'ฝนทิ้งช่วงระหว่างฤดูปลูกทำให้ผู้ใหญ่ในบ้านคอยดูแปลงนาและข่าวอากาศ พวกเขาต้องเลือกระหว่างจ่ายค่าน้ำเพิ่มหรือรอฝนโดยกันเงินไว้ก่อน',
    when: { all: [ages(9, 12), farmHome, { flag: 'fmRicePlan' }] }, weight: 2, weightMods: [{ when: { householdDebt: '>=', value: 20 }, mult: 1.5 }], once: true,
    choices: [
      { id: 'fm-dry-spell-a', label: 'ช่วยกันหาน้ำมาให้ต้นข้าว', effects: [home('money', -2), self('relationships', 1)], setFlags: ['fmWatchedDrought'] },
      { id: 'fm-dry-spell-b', label: 'รอดูฝนและกันเงินไว้จ่ายของจำเป็น', effects: [home('money', 1), self('wellbeing', -1)], setFlags: ['fmWatchedDrought'] },
    ],
  },
  // Sources: FM05, FM01.
  {
    id: 'fm-harvest-plan', stage: 'teen', title: 'เงินหลังเกี่ยวข้าว',
    body: 'เมื่อถึงช่วงเก็บเกี่ยว ผู้ใหญ่คุยกันว่าจะนำเงินที่ได้ไปจ่ายหนี้ที่ค้างหรือเก็บไว้ซื้อของจำเป็นรอบหน้า คุณเห็นว่าทั้งสองทางช่วยบ้านคนละแบบ',
    when: { all: [ages(13, 16), farmHome, { flag: 'fmRicePlan' }] }, weight: 2, once: true,
    choices: [
      { id: 'fm-harvest-plan-a', label: 'แบ่งเงินไปจ่ายหนี้ก่อน', effects: [home('debt', -2), home('money', -1), self('wellbeing', 1)], setFlags: ['fmHarvestUsedForDebt'] },
      { id: 'fm-harvest-plan-b', label: 'เก็บเงินไว้ซื้อของก่อนรอบปลูกหน้า', effects: [home('money', 2), self('wellbeing', 1)], setFlags: ['fmHarvestReserve'] },
    ],
  },
  // Source: FM07.
  {
    id: 'fm-rising-water', stage: 'childhood', title: 'น้ำขึ้นหลังฝนตก',
    body: 'หลังฝนตกต่อเนื่อง ผู้ใหญ่เริ่มติดตามระดับน้ำและเตรียมของที่อาจต้องยกขึ้นที่สูง คุณยังเด็ก ผู้ใหญ่จึงเป็นคนเลือกว่าจะจัดของในบ้านก่อนหรือช่วยกันดูแลพื้นที่ทำกิน',
    when: ages(8, 12), weight: 2, once: true,
    choices: [
      { id: 'fm-rising-water-a', label: 'ยกของจำเป็นขึ้นไว้ก่อน', effects: [self('careBurden', 1), self('wellbeing', 1)], setFlags: ['fmPreparedFlood'] },
      { id: 'fm-rising-water-b', label: 'ขอแรงญาติมาช่วยขนของ', effects: [home('money', -1), self('relationships', 2)], setFlags: ['fmPreparedFlood'] },
      { id: 'fm-rising-water-c', label: 'ช่วยผู้ใหญ่ย้ายอุปกรณ์ทำนา', requires: { household: 'ทำนา' }, effects: [self('diligence', 1), self('careBurden', 1)], setFlags: ['fmPreparedFlood'] },
    ],
  },
  // Sources: FM03, FM04.
  {
    id: 'fm-parent-moves', stage: 'childhood', title: 'ผู้ใหญ่ไปทำงานไกลบ้าน',
    body: 'ผู้ใหญ่คนหนึ่งได้รับงานที่อยู่ไกลบ้านและต้องคิดเรื่องค่าเดินทางกับคนที่จะดูแลคุณ คุณยังเล็ก ผู้ใหญ่เป็นคนตกลงกันว่าจะลองไปทำงานก่อนหรือรอหางานใกล้บ้าน',
    when: ages(3, 7), weight: 2, weightMods: [{ when: { householdDebt: '>=', value: 20 }, mult: 1.35 }], once: true,
    choices: [
      { id: 'fm-parent-moves-a', label: 'ลองไปทำงานไกลบ้านและส่งเงินกลับมา', effects: [home('money', 2), self('relationships', -1)], setFlags: ['fmParentAway'] },
      { id: 'fm-parent-moves-b', label: 'รอหางานใกล้บ้าน แม้รายรับอาจช้าลง', effects: [home('money', -1), self('relationships', 1)], setFlags: ['fmParentNearby'] },
    ],
  },
  // Sources: FM03, FM04.
  {
    id: 'fm-message-home', stage: 'teen', title: 'ข่าวจากคนที่ไปทำงาน',
    body: 'คนในบ้านที่ไปทำงานต่างถิ่นโทรมาถามข่าวและบอกว่ารายรับรอบนี้ไม่แน่นอน ผู้ใหญ่ต้องเลือกระหว่างส่งเงินที่บ้านต้องใช้ทันทีหรือเก็บบางส่วนไว้เป็นทุนเดินทางกลับ',
    when: { all: [ages(13, 14), { flag: 'fmParentAway' }] }, weight: 2, once: true,
    choices: [
      { id: 'fm-message-home-a', label: 'ส่งเงินมาให้จ่ายของจำเป็นก่อน', effects: [home('money', 2), self('relationships', 1)], setFlags: ['fmRemittanceHelp'] },
      { id: 'fm-message-home-b', label: 'เก็บเงินไว้เป็นค่าเดินทางกลับบ้าน', effects: [self('relationships', 2), self('wellbeing', 1)], setFlags: ['fmReturnTripFund'] },
    ],
  },
  // Sources: FM08, FM09.
  {
    id: 'fm-school-budget', stage: 'childhood', title: 'ของที่ต้องใช้ไปโรงเรียน',
    body: 'เปิดเทอมแล้วมีรายการค่าอาหาร ค่าเดินทาง และอุปกรณ์เรียนให้ผู้ใหญ่ช่วยกันดู คุณเห็นว่าถ้าซื้อครบตอนนี้ เงินที่เหลือใช้ในบ้านจะน้อยลง',
    when: ages(6, 10), weight: 2, weightMods: [{ when: { householdMoney: '<', value: 20 }, mult: 1.5 }], once: true,
    choices: [
      { id: 'fm-school-budget-a', label: 'ซื้อของเรียนให้ครบก่อน', effects: [home('money', -2), self('knowledge', 2)] },
      { id: 'fm-school-budget-b', label: 'ใช้ของเดิมบางชิ้นแล้วเก็บเงินไว้ค่าเดินทาง', effects: [home('money', -1), self('wellbeing', 1)] },
      { id: 'fm-school-budget-c', label: 'ขอให้ผู้ใหญ่ถามเรื่องทุนช่วยค่าเดินทาง', requires: { household: 'รับจ้าง' }, effects: [self('knowledge', 2), self('relationships', 1)], setFlags: ['fmAskedSchoolSupport'] },
    ],
  },
  // Sources: FM08, FM09.
  {
    id: 'fm-school-route', stage: 'childhood', title: 'ทางไปโรงเรียนไกลขึ้น',
    body: 'พอโรงเรียนช่วงชั้นต่อไปอยู่ไกลกว่าเดิม ผู้ใหญ่ต้องชั่งใจเรื่องค่ารถกับเวลาที่คุณต้องออกจากบ้าน คุณยังเรียนต่อได้ แต่บ้านต้องแบ่งเงินและเวลามารองรับ',
    when: ages(11, 12), weight: 2, once: true,
    choices: [
      { id: 'fm-school-route-a', label: 'จ่ายค่าเดินทางเพื่อไปโรงเรียนเดิม', effects: [home('money', -2), self('knowledge', 2)], setFlags: ['fmLongSchoolRoute'] },
      { id: 'fm-school-route-b', label: 'ขอญาติช่วยเรื่องรถบางวัน', requires: { household: 'ทำนา' }, effects: [self('relationships', 2), self('careBurden', 1)], setFlags: ['fmFamilySchoolRide'] },
    ],
  },
  // Sources: FM03, FM04.
  {
    id: 'fm-grandparent-care', stage: 'childhood', title: 'อยู่กับตายายช่วงหนึ่ง',
    body: 'ช่วงที่ผู้ใหญ่ต้องไปทำงานไกล คุณได้อยู่กับตายายที่ช่วยดูแลเรื่องกินอยู่และไปโรงเรียน คนในบ้านต้องคุยกันว่าจะช่วยค่าใช้จ่ายและแบ่งเวลาเยี่ยมกันอย่างไร',
    when: { all: [ages(0, 5), { relativeAlive: 'grandmother' }] }, weight: 2, once: true,
    choices: [
      { id: 'fm-grandparent-care-a', label: 'ผู้ใหญ่ส่งเงินช่วยค่าใช้จ่ายเป็นระยะ', effects: [home('money', -1), self('relationships', 2)], setFlags: ['fmGrandparentCare'] },
      { id: 'fm-grandparent-care-b', label: 'ญาติช่วยกันแบ่งของใช้และเวลาไปเยี่ยม', effects: [self('relationships', 2), self('careBurden', 1)], setFlags: ['fmGrandparentCare'] },
    ],
  },
  // Source: FM09.
  {
    id: 'fm-next-study-step', stage: 'teen', title: 'คุยเรื่องเรียนต่อ',
    body: 'ใกล้จบช่วงมัธยมต้น ผู้ใหญ่ชวนคุยเรื่องเรียนต่อ ค่าเดินทาง และงานที่บ้านต้องทำ คุณอยากเรียนต่อ แต่ก็เห็นว่าคนในบ้านกำลังวางแผนค่าใช้จ่ายกันอยู่',
    when: ages(15, 17), weight: 3, weightMods: [{ when: { householdMoney: '<', value: 20 }, mult: 1.25 }], once: true,
    choices: [
      { id: 'fm-next-study-step-a', label: 'สมัครเรียนต่อและช่วยกันหาทุน', effects: [home('money', -1), self('knowledge', 3)], setFlags: ['fmPlansFurtherStudy'] },
      { id: 'fm-next-study-step-b', label: 'เรียนใกล้บ้านและช่วยงานหลังเลิกเรียน', effects: [home('money', 1), self('knowledge', 1), self('careBurden', 1)], setFlags: ['fmPlansLocalStudy'] },
      { id: 'fm-next-study-step-c', label: 'ถามญาติที่ทำงานต่างถิ่นเรื่องที่พัก', requires: { flag: 'fmParentAway' }, effects: [self('knowledge', 2), self('relationships', 1)], setFlags: ['fmAskedMigrantRelative'] },
    ],
  },
]
