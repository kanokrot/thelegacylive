import type { Card, Condition, Effect } from '../engine/types'

const ages = (min: number, max?: number): Condition => {
  const conditions: Condition[] = [{ age: '>=', value: min }]
  if (max !== undefined) conditions.push({ age: '<=', value: max })
  return { all: conditions }
}
const self = (key: 'health' | 'wellbeing' | 'knowledge' | 'relationships' | 'careBurden' | 'diligence', delta: number): Effect => ({ target: 'self', key, delta })
const personalDebt = (delta: number): Effect => ({ target: 'self', key: 'personalDebt', delta })
const household = (key: 'money' | 'debt', delta: number): Effect => ({ target: 'household', key, delta })
const relative = (role: string, key: 'health', delta: number): Effect => ({ target: { relativeRole: role }, key, delta })

// These cards adapt the event bank stories into playable choices. Local details remain illustrative and should be reviewed with contributors.
export const isanEventBankCards: Card[] = [
  {
    id: 'ex-05-sugarcane-homework', stage: 'childhood', title: 'เขม่าอ้อยกับสมุดการบ้าน',
    body: 'ช่วงเปิดหีบอ้อย รถสิบล้อจอดคอยริมถนนสายหลัก เขม่าอ้อยดำเกาะเต็มชานบ้าน พ่อแม่ทำงานข้ามคืนจนตาแดง ครูทวงสมุดการบ้านประดิษฐ์ที่ต้องส่งพรุ่งนี้ แต่พ่อขอให้ช่วยดันอ้อยขึ้นรถกระบะก่อน เพราะคิวโรงงานจะตัดตอนเที่ยงคืน',
    when: { all: [ages(8, 12), { household: 'ไร่อ้อย' }, { birthOrder: '<=', value: 2 }, { siblingCount: '<=', value: 2 }] }, weight: 2, once: true,
    choices: [
      { id: 'ex-05-sugarcane-homework-a', label: 'ช่วยขนอ้อยให้เสร็จ แล้วตื่นตีห้าทำสมุดการบ้าน', effects: [self('diligence', 2), self('careBurden', 2), self('wellbeing', -1)], setFlags: ['ex05HomeFirst'] },
      { id: 'ex-05-sugarcane-homework-b', label: 'ขอทำงานประดิษฐ์ให้เสร็จก่อนตามที่ครูสั่ง', effects: [self('knowledge', 2), household('money', -1), self('relationships', -1)], setFlags: ['ex05StudyFirst'] },
      { id: 'ex-05-sugarcane-homework-c', label: 'ตื่นไปช่วยตัดอ้อย แล้วขอลาครึ่งวัน', effects: [self('diligence', 2), self('careBurden', 1), self('knowledge', -1)], setFlags: ['ex05HomeFirst'] },
    ],
  },
  {
    id: 'ex-06-baac-harvest-letter', stage: ['youngAdult', 'midLife'], title: 'จดหมายแจ้งยอด ธ.ก.ส. หลังฤดูเก็บเกี่ยว',
    body: 'เสียงรถเกี่ยวข้าวเพิ่งดับ ข้าวเปลือกตากอยู่เต็มลานวัด แต่ราคาข้าวต่ำกว่าที่คำนวณไว้ ขณะที่ค่าปุ๋ยกับค่าน้ำมันสูงขึ้น ใบแจ้งยอด ธ.ก.ส. วางอยู่บนสำรับข้าวเย็น และพ่อเฒ่าปวดเข่าจนต้องใช้น้ำมันนวดทุกคืน',
    when: { all: [ages(35, 59), { household: 'ทำนา' }, { householdDebt: '>=', value: 1 }, { relativeAlive: 'grandfather' }] }, weight: 2, once: true,
    choices: [
      { id: 'ex-06-baac-harvest-letter-a', label: 'นำเงินขายข้าวไปจ่ายดอกเบี้ยและต้นบางส่วนตามกำหนด', effects: [household('money', -2), household('debt', -2), relative('grandfather', 'health', -1)], setFlags: ['ex06PaidBaac'] },
      { id: 'ex-06-baac-harvest-letter-b', label: 'ขอผ่อนผันหนี้แล้วพาพ่อเฒ่าไปโรงพยาบาลศูนย์', effects: [household('debt', 2), relative('grandfather', 'health', 3), self('relationships', 1)], setFlags: ['ex06PrioritizedCare'] },
      { id: 'ex-06-baac-harvest-letter-c', label: 'ยืมเงินนอกระบบจ่าย ธ.ก.ส. และพาพ่อเฒ่าไปหาหมอ', effects: [household('debt', -1), personalDebt(3), relative('grandfather', 'health', 2), self('relationships', -1)], setFlags: ['ex06LayeredDebt'] },
    ],
  },
  {
    id: 'ex-07-land-under-the-house', stage: 'elder', title: 'วงใต้ถุนบ้านกับที่นาแปลงเก่า',
    body: 'หลังงานบุญกฐิน ลูก ๆ ที่ทำงานต่างจังหวัดกับลูกที่อยู่บ้านทำนามานั่งคุยกันใต้ถุนบ้าน ที่นาติดถนนมีคนมาขอเช่าทำลานอ้อย ส่วนที่นาปลายน้ำท่วมทุกปี ลูกที่ดูแลพ่อแม่อยากทำนาต่อ ขณะที่ลูกคนโตที่ส่งเงินกลับบ้านอยากแบ่งขายเพื่อนำเงินไปตั้งตัว',
    when: { all: [ages(60), { householdLandRai: '>=', value: 1 }, { children: '>=', value: 2 }] }, weight: 2, once: true,
    choices: [
      { id: 'ex-07-land-under-the-house-a', label: 'แบ่งที่ดินเท่า ๆ กันแล้วจับฉลากเลือกแปลง', effects: [self('relationships', -1), self('wellbeing', -1)], setFlags: ['ex07EqualLandShare'] },
      { id: 'ex-07-land-under-the-house-b', label: 'ให้ที่ทำกินหลักกับลูกที่ดูแลบ้าน แล้วชดเชยคนอื่นตามที่มี', effects: [self('relationships', -2), self('careBurden', 1)], setFlags: ['ex07CaregiverLand'] },
      { id: 'ex-07-land-under-the-house-c', label: 'ชะลอการโอนและทำข้อตกลงใช้ที่ดินร่วมกัน', effects: [self('relationships', 1), self('wellbeing', 1)], setFlags: ['ex07SharedLandUse'] },
    ],
  },
]

const annualFallback = (id: string, stage: Card['stage'], title: string, body: string, optionA: string, optionB: string, effectsA: Effect[], effectsB: Effect[]): Card => ({
  id, stage, title, body, weight: 1, once: false, fallback: true,
  choices: [
    { id: `${id}-a`, label: optionA, effects: effectsA },
    { id: `${id}-b`, label: optionB, effects: effectsB },
  ],
})

// Repeating everyday decisions fill years without a one-off authored event; age zero intentionally has no choice.
export const annualFallbackCards: Card[] = [
  annualFallback('annual-childhood-play', 'childhood', 'หลังเลิกเรียนจะทำอะไรดี', 'งานที่บ้านยังมีให้ช่วย เพื่อนก็ชวนไปเล่น เวลาช่วงเย็นมีไม่พอสำหรับทุกอย่าง', 'ช่วยงานที่บ้านก่อนแล้วค่อยไปหาเพื่อน', 'ขอเวลาไปเล่นกับเพื่อนแล้วกลับมาทำงานบ้าน', [self('diligence', 1), self('careBurden', 1)], [self('wellbeing', 1), self('relationships', 1)]),
  annualFallback('annual-childhood-study', 'childhood', 'แบ่งเวลาเรียนกับเวลาพัก', 'การบ้านยังเหลืออยู่ แต่วันนี้คุณเหนื่อยจากโรงเรียนและอยากพักสักหน่อย', 'ทำการบ้านให้เสร็จก่อน', 'พักก่อนแล้วค่อยกลับมาทำต่อ', [self('knowledge', 1), self('wellbeing', -1)], [self('wellbeing', 1), self('knowledge', -1)]),
  annualFallback('annual-teen-friends', 'teen', 'นัดกับเพื่อนหลังเลิกเรียน', 'เพื่อนชวนไปเจอกัน ขณะที่คนในบ้านก็ฝากงานไว้ก่อนมื้อเย็น', 'กลับไปช่วยที่บ้านตามที่รับปาก', 'ขอไปพบเพื่อนแล้วช่วยงานให้เสร็จทีหลัง', [self('diligence', 1), self('relationships', 1)], [self('wellbeing', 1), self('careBurden', 1)]),
  annualFallback('annual-teen-next-step', 'teen', 'เวลาว่างที่มีอยู่น้อย', 'ช่วงนี้ทั้งเรื่องเรียนและงานที่บ้านต้องการเวลา คุณต้องเลือกว่าจะให้เวลากับเรื่องไหนก่อน', 'ใช้เวลาทบทวนบทเรียน', 'แบ่งเวลาไปช่วยงานของครอบครัว', [self('knowledge', 1)], [self('relationships', 1), self('careBurden', 1)]),
  annualFallback('annual-youngadult-budget', 'youngAdult', 'จัดเงินของเดือนนี้', 'รายรับเข้ามาแล้ว แต่ยังมีทั้งค่าใช้จ่ายส่วนตัวและเรื่องที่บ้านอยากให้ช่วย', 'กันเงินสำรองของตัวเองก่อน', 'ส่งเงินไปช่วยค่าใช้จ่ายในบ้าน', [self('wellbeing', 1)], [household('money', 1), self('relationships', 1)]),
  annualFallback('annual-youngadult-direction', 'youngAdult', 'โอกาสที่เข้ามาไม่พร้อมกัน', 'มีทั้งงานที่คุ้นเคยและโอกาสลองทำอย่างอื่น คุณคิดถึงรายได้ ความมั่นคง และสิ่งที่อยากทำ', 'เลือกทางที่คุ้นเคยและมั่นคงกว่า', 'ลองทางใหม่ที่สนใจ', [self('wellbeing', 1), household('money', 1)], [self('knowledge', 1), self('wellbeing', -1)]),
  annualFallback('annual-midlife-work', 'midLife', 'งานเพิ่มกับเวลาของครอบครัว', 'มีงานเพิ่มเข้ามาในช่วงที่คนในบ้านต้องการเวลาและแรงช่วยเหลือจากคุณ', 'รับงานเพิ่มเพื่อให้มีเงินสำรอง', 'กันเวลาไว้ให้คนในบ้าน', [household('money', 1), self('careBurden', 1)], [self('relationships', 1), self('wellbeing', 1)]),
  annualFallback('annual-midlife-rest', 'midLife', 'ร่างกายเริ่มขอเวลาพัก', 'งานประจำวันยังต้องทำ แต่ช่วงนี้คุณรู้สึกเหนื่อยสะสมมากขึ้น', 'ทำต่อให้เสร็จตามแผน', 'พักบางส่วนแล้วค่อยกลับมาทำ', [self('diligence', 1), self('health', -1)], [self('health', 1), self('wellbeing', 1)]),
  annualFallback('annual-elder-family', 'elder', 'นัดพบคนในครอบครัว', 'คนในบ้านมีธุระหลายอย่างและอยากใช้เวลาร่วมกัน คุณเองก็ต้องเผื่อแรงไว้ดูแลสุขภาพ', 'ไปร่วมวงพูดคุยกับครอบครัว', 'พักอยู่บ้านแล้วค่อยนัดกันใหม่', [self('relationships', 1), self('wellbeing', 1)], [self('health', 1)]),
  annualFallback('annual-elder-help', 'elder', 'ช่วยเท่าที่แรงยังไหว', 'มีคนมาขอแรงเล็ก ๆ น้อย ๆ คุณอยากช่วยแต่ก็รู้ว่าต้องดูแลกำลังของตัวเองด้วย', 'ช่วยงานในส่วนที่ทำไหว', 'บอกขอพักแล้วให้คนอื่นช่วยแทน', [self('relationships', 1), self('careBurden', 1)], [self('health', 1), self('wellbeing', 1)]),
]
