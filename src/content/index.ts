import { balance } from './balance'
import type { Card, Condition, RegionProfile } from '../engine/types'

export { balance }

// TODO(verify): review names, spelling, era and province pairings with Thai readers.
export const givenNames = {
  female: ['สมศรี', 'มาลี', 'บุญมี', 'ดวงใจ', 'อรทัย', 'สุภาพร', 'จันทร์เพ็ญ', 'กมลวรรณ', 'พิมพ์ชนก', 'ขวัญฤดี'],
  male: ['สมชาย', 'บุญส่ง', 'ประเสริฐ', 'วิทยา', 'สุรชัย', 'สมบัติ', 'กิตติ', 'ธนกร', 'ปรีชา', 'ชัยวัฒน์'],
  other: ['มณี', 'แสงดาว', 'สายฝน', 'ใจดี'],
}
// TODO(verify): era groupings are illustrative, not a measured name-frequency table.
export const givenNamesByEra = {
  earlier: { female:['สมศรี','มาลี','บุญมี','ดวงใจ','อรทัย'], male:['สมชาย','บุญส่ง','ประเสริฐ','วิทยา','สมบัติ'], other:givenNames.other },
  middle: { female:['สุภาพร','จันทร์เพ็ญ','กมลวรรณ','ขวัญฤดี','สายฝน'], male:['สุรชัย','ปรีชา','ชัยวัฒน์','กิตติ','ธนกร'], other:givenNames.other },
  recent: { female:['พิมพ์ชนก','ขวัญฤดี','อรทัย','มณี','แสงดาว'], male:['ธนกร','กิตติ','ชัยวัฒน์','วิทยา','ใจดี'], other:givenNames.other },
}
export const surnames = ['นาดี', 'แสนสุข', 'บุญช่วย', 'คำแพง', 'ศรีสวัสดิ์', 'แก้วคำ', 'วงศ์สว่าง', 'ใจมั่น', 'พูนผล', 'อินทร์ทอง']
export const birthRevealLabels = ['เพศ','ปีเกิด','จังหวัด','ครอบครัว','พี่น้อง','สุขภาพแรกเกิด','พรสวรรค์','ความขยัน','นิสัยใจคอ','ชื่อ'] as const
export const occupations = { farmWork:'ช่วยงานนา', urbanWork:'งานรับจ้างในเมือง', migrantRelative:'แรงงานย้ายถิ่น' }
export const provinces = ['กาฬสินธุ์', 'ขอนแก่น', 'ชัยภูมิ', 'นครพนม', 'นครราชสีมา', 'บึงกาฬ', 'บุรีรัมย์', 'มหาสารคาม', 'มุกดาหาร', 'ยโสธร', 'ร้อยเอ็ด', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อำนาจเจริญ', 'อุดรธานี', 'อุบลราชธานี']
export const regions: RegionProfile[] = provinces.map((name, i) => ({ id: `isan-${i}`, name, schoolAccess: balance.access.school, hospitalAccess: balance.access.hospital, jobAccess: balance.access.jobs }))

const stages = ['childhood', 'teen', 'youngAdult', 'midLife', 'elder'] as const
const labels = [
  ['เสียงในเรือนยามเช้า', 'คนในบ้านเริ่มวันด้วยงานหลายอย่าง คุณยังเล็กเกินกว่าจะเข้าใจทั้งหมด แต่จำจังหวะชีวิตนั้นได้'],
  ['งานเล็ก ๆ ในบ้าน', 'มีงานพอดีกับวัยให้ช่วยทำ ผู้ใหญ่คอยบอกและปรับตามวันที่คุณเหนื่อย'],
  ['เพื่อนบ้านแวะมา', 'การทักทายสั้น ๆ กลายเป็นความช่วยเหลือในวันที่ต้องการแรงอีกคน'],
  ['ฤดูข้าว', 'ฝนและจังหวะน้ำกำหนดงานในนา ครอบครัววางแผนตามสิ่งที่ควบคุมได้'],
  ['ทางไปโรงเรียน', 'ระยะทางทำให้ต้องตื่นเช้าและจัดเวลาให้ทันทั้งการเรียนกับงานที่บ้าน'],
  ['การบ้านหลังเลิกเรียน', 'คุณหาเวลาทำการบ้านหลังช่วยงานเสร็จ บางวันต้องขอให้ผู้ใหญ่ช่วยดูแลน้องแทน'],
  ['หนังสือเล่มเก่า', 'หนังสือที่ส่งต่อกันมามีรอยจดจากคนก่อน คุณลองอ่านส่วนที่ยังไม่คุ้น'],
  ['วันกีฬาโรงเรียน', 'เพื่อนชวนเข้าร่วมกิจกรรม คุณคิดถึงทั้งความสนุกและเวลาที่ต้องใช้ซ้อม'],
  ['ฝนมาช้า', 'ครอบครัวติดตามฝนและเตรียมงานเท่าที่ทำได้ การตัดสินใจวันนี้มีผลต่อฤดูถัดไป'],
  ['ลงแขกเกี่ยวข้าว', 'ญาติและเพื่อนบ้านช่วยกันในช่วงงานมาก วันทำงานยาวขึ้นแต่มีคนแบ่งเบา'],
  ['ตลาดนัดประจำสัปดาห์', 'ของจากหลายหมู่บ้านมารวมกัน คุณช่วยเลือกซื้อของจำเป็นตามเงินที่มี'],
  ['งานซ่อมหลังคา', 'หลังคาบางส่วนรั่วเมื่อฝนหนัก ครอบครัววางแผนซ่อมโดยเลือกวัสดุตามงบ'],
  ['ข่าวสอบเข้า', 'ครูแจ้งกำหนดสอบและเอกสารที่ต้องเตรียม การเดินทางไปสนามสอบมีค่าใช้จ่าย'],
  ['คำชวนจากครู', 'ครูเห็นความตั้งใจของคุณและแนะนำให้ลองสมัครกิจกรรมที่ช่วยต่อยอดการเรียน'],
  ['เพื่อนย้ายโรงเรียน', 'ครอบครัวเพื่อนย้ายไปทำงานที่อื่น คุณช่วยกันเก็บความทรงจำก่อนแยกย้าย'],
  ['ค่าเดินทางเพิ่มขึ้น', 'ราคาค่าเดินทางทำให้การไปเรียนหรือทำงานต้องวางแผนใหม่ คุณลองหาทางประหยัด'],
  ['งานรับจ้างช่วงปิดเทอม', 'มีงานระยะสั้นให้ลองทำ ผู้จ้างอธิบายเวลาและค่าตอบแทนก่อนเริ่ม'],
  ['เงินก้อนแรก', 'คุณได้รับเงินจากงานที่ทำเอง และคิดว่าจะเก็บไว้ใช้เรื่องใดก่อน'],
  ['สมัครงานหลายแห่ง', 'การหางานใช้เวลาและค่าเดินทาง คุณจดข้อมูลแต่ละที่เพื่อเปรียบเทียบ'],
  ['ที่พักใกล้ที่ทำงาน', 'ห้องพักที่เดินทางสะดวกมีค่าใช้จ่ายสูงกว่า คุณคุยกับเพื่อนเรื่องการอยู่ร่วมกัน'],
  ['โทรกลับบ้าน', 'บทสนทนาสั้น ๆ ช่วยให้รู้ข่าวจากที่บ้าน แม้จะยังกลับไปหาได้ไม่บ่อย'],
  ['เพื่อนร่วมงานใหม่', 'คนทำงานมาจากหลายพื้นที่ ต่างคนต่างช่วยกันเรียนรู้งานและกฎของที่ทำงาน'],
  ['เวลาพักไม่ตรงกัน', 'ตารางงานทำให้เวลาของคนในบ้านหรือคนรักไม่ตรงกัน คุณชวนกันหาช่วงเวลาที่พอได้พบ'],
  ['รายได้รอบนี้', 'รายรับเข้ามาแล้ว แต่ยังมีค่าเดินทางและค่าใช้จ่ายที่บ้านรออยู่'],
  ['ส่งเงินกลับบ้าน', 'ครอบครัวแจ้งค่าใช้จ่ายจำเป็น คุณเลือกจำนวนที่ส่งโดยเหลือพอสำหรับตัวเอง'],
  ['เรียนรู้งานใหม่', 'หัวหน้างานเสนอให้ฝึกหน้าที่อีกอย่าง การเรียนรู้เพิ่มอาจเปิดทางเลือกใหม่'],
  ['พักจากงานหนัก', 'ความเหนื่อยสะสมจนเริ่มกระทบการนอน คุณลองจัดเวลาพักให้เป็นกิจวัตร'],
  ['กลับบ้านช่วงเทศกาล', 'การเดินทางกลับบ้านใช้เวลาและเงิน แต่เป็นโอกาสได้พบญาติหลายคน'],
  ['ลูกเริ่มเข้าโรงเรียน', 'คุณกับคนในบ้านคุยกันเรื่องค่าใช้จ่ายและการเดินทางของลูกในแต่ละวัน'],
  ['แบ่งเวลาดูแลผู้ใหญ่', 'ผู้ใหญ่ในบ้านเริ่มต้องการความช่วยเหลือมากขึ้น พี่น้องคุยกันว่าจะช่วยกันอย่างไร'],
  ['ซ่อมเครื่องมือทำกิน', 'เครื่องมือชิ้นสำคัญเริ่มใช้ไม่ถนัด การซ่อมทันทีหรือรอมีค่าใช้จ่ายต่างกัน'],
  ['งานประเพณีในชุมชน', 'ชุมชนเตรียมงานตามกำลังของแต่ละบ้าน คุณพิจารณาว่าจะช่วยแรงหรือช่วยของ'],
  ['ตรวจสุขภาพประจำปี', 'การตรวจช่วยให้รู้ข้อมูลสุขภาพ แต่การเดินทางและเวลารอคิวต้องเตรียมไว้'],
  ['คุยเรื่องอนาคต', 'คนใกล้ชวนคุยถึงสิ่งที่อยากทำต่อ คุณลองแยกเป้าหมายระยะสั้นกับระยะยาว'],
  ['ซ่อมบ้านก่อนฤดูฝน', 'ช่างและวัสดุมีราคาแตกต่างกัน ครอบครัวขอความเห็นจากคนที่เคยซ่อมมาก่อน'],
  ['เปลี่ยนหน้าที่ในงาน', 'ประสบการณ์ทำให้คุณได้รับหน้าที่เพิ่ม คุณชั่งใจเรื่องค่าตอบแทนกับเวลาที่ต้องใช้'],
  ['ดูแลสวนผักหลังบ้าน', 'ผักบางส่วนใช้ทำอาหารได้และช่วยลดรายจ่าย คุณแบ่งเวลารดน้ำตามสภาพอากาศ'],
  ['พบปะเพื่อนเก่า', 'คนที่เคยเรียนด้วยกันกลับมาเยี่ยม คุณแลกเปลี่ยนข่าวคราวและช่วยกันเท่าที่ทำได้'],
  ['วางแผนวัยเกษียณ', 'คุณเริ่มคิดถึงค่าใช้จ่ายในอนาคตและคนที่จะช่วยดูแลเมื่อทำงานได้น้อยลง'],
  ['ส่งต่อประสบการณ์', 'คนรุ่นน้องถามถึงงานที่คุณทำ คุณแบ่งปันสิ่งที่เรียนรู้จากทั้งวันที่ดีและวันที่ยาก'],
]
const storyClosers = ['คนในบ้านคุยกันถึงสิ่งที่พอทำได้ตามเวลาและกำลังที่มี','คุณค่อย ๆ เรียนรู้ว่าการวางแผนช่วยให้รับมือกับสิ่งที่ควบคุมไม่ได้','ทางเลือกของแต่ละคนขึ้นกับระยะทาง รายได้ และความช่วยเหลือรอบตัว','เรื่องเล็กที่ทำร่วมกันกลายเป็นส่วนหนึ่งของความสัมพันธ์ในบ้าน']
const closeStory = (id:string) => storyClosers[[...id].reduce((sum,char)=>sum+char.charCodeAt(0),0)%storyClosers.length]!
const ageWindow = (range:readonly [number,number]):Condition => ({all:[{age:'>=',value:range[0]},{age:'<=',value:range[1]}]})
const effect: Card['choices'][number]['effects'][number] = { target: 'self', key: 'wellbeing', delta: balance.eventDeltas.wellbeing['2']! }
const genericCards: Card[] = Array.from({ length: balance.cards.genericCount }, (_, i) => {
  const [title, body] = labels[i % labels.length]!
  const stage = stages[Math.floor(i / 8)]!
  return {
    id: `isan-life-${String(i + 1).padStart(2, '0')}`, stage, title, body: `${body}. ${closeStory(`isan-life-${i}`)}.`,
    weight: balance.cards.routineWeights[i % balance.cards.routineWeights.length]!, once: i < balance.cards.initialOnceCount,
    choices: [
      { id: `stay-${i}`, label: 'อยู่ช่วยจัดการที่บ้าน', effects: [effect, { target: 'household', key: 'money', delta: -1 }, { target: 'self', key: 'relationships', delta: 1 }] },
      { id: `try-${i}`, label: 'ลองเลือกทางที่สนใจ', effects: [{ target: 'self', key: 'knowledge', delta: 2 }, { target: 'self', key: 'wellbeing', delta: -1 }, { target: 'self', key: 'relationships', delta: -1 }] },
    ],
  }
})

const milestone = (id: string, stage: Card['stage'], title: string, body: string, choiceA: string, choiceB: string, effectsA: Card['choices'][number]['effects'], effectsB: Card['choices'][number]['effects'], opts: Partial<Card> = {}): Card => ({ id, stage, title, body: `${body}. ${closeStory(id)}.`, weight: balance.cards.milestoneWeight, once: true, ...opts, choices: [{ id: `${id}-a`, label: choiceA, effects: effectsA }, { id: `${id}-b`, label: choiceB, effects: effectsB }] })
const S = (key: 'health'|'wellbeing'|'knowledge'|'relationships'|'careBurden'|'aptitude'|'diligence'|'temperament', delta: number) => ({ target: 'self' as const, key, delta: balance.eventDeltas[key][String(delta)]! })
const H = (key: 'money'|'debt', delta: number) => ({ target: 'household' as const, key, delta: balance.eventDeltas[key][String(delta)]! })
const R = (relativeRole: string, key: 'health'|'relationships', delta: number) => ({ target: { relativeRole }, key, delta: balance.eventDeltas[key][String(delta)]! })
const extra: Card[] = [
  milestone('birth-health', 'childhood', 'วันแรกของชีวิต', 'คนในบ้านช่วยกันดูแลคุณในช่วงแรก ผู้ใหญ่สังเกตอาการและหาความช่วยเหลือตามที่เข้าถึงได้', 'พาไปสถานพยาบาล', 'ขอแรงญาติช่วยดูแล', [S('health', 5), H('money', -3)], [S('relationships', 2), S('health', 1)], {when:ageWindow(balance.milestoneAges.earlyHealth)}),
  milestone('who-raises', 'childhood', 'ใครช่วยเลี้ยงดู', 'งานและการเดินทางของผู้ใหญ่ทำให้การดูแลเป็นเรื่องที่หลายคนช่วยกัน', 'อยู่กับยายช่วงกลางวัน', 'ไปกับแม่ตามงาน', [S('relationships', 3), S('careBurden', -1)], [S('relationships', 1), S('knowledge', 1)]),
  milestone('child-farm-work', 'childhood', 'ช่วยงานนา', 'ช่วงฤดูทำนามีงานเล็ก ๆ ให้ช่วยตามกำลังและเวลาเรียน', 'ช่วยเก็บของหลังเลิกเรียน', 'ช่วยตามเวลาว่าง', [S('diligence', 2), S('careBurden', 1)], [S('wellbeing', 1)], {when:ageWindow(balance.milestoneAges.farmWork)}),
  milestone('school-start', 'childhood', 'เริ่มเข้าโรงเรียน', 'โรงเรียนอยู่ห่างจากบ้านพอให้ต้องวางแผนการเดินทางและค่าใช้จ่าย', 'เดินทางไปเรียน', 'เรียนใกล้บ้านและแบ่งเวลาช่วยงาน', [S('knowledge', 5), H('money', -2)], [S('knowledge', 2), S('careBurden', 2)], {when:ageWindow(balance.milestoneAges.schoolStart)}),
  milestone('grade-six', 'childhood', 'หลังจบ ป.6', 'การเรียนต่อ ม.1 ต้องคุยกันเรื่องระยะทาง ค่าเดินทาง และภาระของบ้าน', 'เรียนต่อ ม.1', 'ทำงานและเรียนตามโอกาส', [S('knowledge', 5), H('money', -3)], [H('money', 3), S('knowledge', 1)], {when:ageWindow(balance.milestoneAges.gradeSix)}),
  milestone('grade-nine', 'teen', 'หลังจบ ม.3', 'ผลการเรียนเปิดทางเลือก แต่ค่าใช้จ่ายและแรงงานในบ้านก็เป็นเรื่องจริงที่ต้องนับรวม', 'เรียนต่อ ม.4', 'ออกไปทำงานและส่งเงินกลับ', [S('knowledge', 5), H('money', -4)], [H('money', 4), S('relationships', -1)], {when:ageWindow(balance.milestoneAges.gradeNine)}),
  milestone('grade-twelve', 'teen', 'หลังจบ ม.6', 'คุณตัดสินใจว่าจะเรียนต่อหรือเริ่มทำงาน โดยมองทั้งโอกาสและภาระที่บ้าน', 'สมัครเรียนต่อ', 'เริ่มทำงานก่อน', [S('knowledge', 6), H('money', -5)], [H('money', 5), S('wellbeing', 1)], {when:ageWindow(balance.milestoneAges.gradeTwelve)}),
  milestone('migration-first', 'teen', 'งานไกลบ้าน', 'มีคนชวนไปทำงานกรุงเทพฯ หรือเขตอุตสาหกรรม ค่าเดินทางและการแยกจากบ้านต้องคิดไว้', 'ไปทำงานโรงงานในกรุงเทพฯ และส่งเงินกลับบ้าน', 'รอหางานใกล้บ้าน', [H('money', 4), S('relationships', -2)], [H('money', 1), S('relationships', 1)], {when:ageWindow(balance.milestoneAges.migration)}),
  milestone('baht-fund', 'youngAdult', 'เงินกู้กองทุนหมู่บ้าน', 'รายจ่ายก้อนหนึ่งมาถึงในช่วงที่เงินสดไม่พอ คุณชั่งน้ำหนักเงื่อนไขและความจำเป็น', 'กู้จากกองทุนหมู่บ้าน', 'ลดรายจ่ายและรอ', [H('money', 6), H('debt', 7)], [S('wellbeing', -1), H('debt', 0)]),
  milestone('baac', 'youngAdult', 'สินเชื่อเพื่อการเกษตร', 'ค่าเมล็ดพันธุ์และอุปกรณ์ต้องจ่ายก่อนเห็นผลผลิต การกู้มีทั้งโอกาสและภาระชำระคืน', 'ยื่นกู้ ธ.ก.ส.', 'เริ่มจากพื้นที่และของที่มี', [H('money', 7), H('debt', 8)], [H('money', -1), S('wellbeing', -1)]),
  milestone('informal-debt', 'midLife', 'ขอยืมคนรู้จัก', 'รายจ่ายฉุกเฉินเกิดขึ้นก่อนรายรับรอบถัดไป คุณขอความช่วยเหลือจากคนใกล้ตัว', 'ยืมเงินไว้ก่อน', 'คุยขอเลื่อนรายจ่าย', [H('money', 5), H('debt', 8)], [S('relationships', -1), H('debt', 0)]),
  milestone('love', 'youngAdult', 'คนที่อยากใช้ชีวิตด้วย', 'ความสัมพันธ์เติบโตจากการใช้เวลาและพูดคุยถึงความคาดหวังของแต่ละคน', 'ค่อย ๆ สร้างความสัมพันธ์', 'ให้เวลากับงานและตัวเองก่อน', [S('relationships', 4), S('wellbeing', 2)], [S('knowledge', 1), S('wellbeing', 1)]),
  milestone('marriage', 'youngAdult', 'ตกลงสร้างครอบครัว', 'คุณและคนรักคุยกันเรื่องงาน ที่อยู่ และวิธีแบ่งภาระในชีวิตประจำวัน', 'จัดพิธีพอเหมาะกับกำลัง', 'ใช้ชีวิตร่วมกันแบบเรียบง่าย', [H('money', -3), S('relationships', 3)], [S('relationships', 2)]),
  milestone('children', 'youngAdult', 'มีลูกคนแรก', 'สมาชิกใหม่ทำให้มีทั้งความสุขและงานดูแลเพิ่มขึ้น เครือญาติช่วยกันตามความพร้อม', 'เลี้ยงดูใกล้ชิด', 'ให้ผู้ใหญ่ช่วยดูแลระหว่างทำงาน', [S('relationships', 4), S('careBurden', 5)], [S('relationships', 2), H('money', 2)]),
  milestone('grandparent-care', 'midLife', 'ฝากลูกไว้กับยาย', 'งานต่างจังหวัดช่วยให้มีรายได้ แต่ลูกต้องอยู่กับยายและมีค่าเดินทางกลับบ้าน', 'ไปทำงานฝั่งตะวันออกและส่งเงิน', 'หางานที่กลับบ้านได้บ่อย', [H('money', 5), S('relationships', -2)], [H('money', 2), S('relationships', 1)]),
  // TODO(verify): verify the current and historical conscription rules and how deferments are represented.
  milestone('conscription', 'youngAdult', 'จับสลากเกณฑ์ทหาร', 'ชายไทยถึงวัยเข้ารับการตรวจเลือก คุณเตรียมตัวตามขั้นตอนและวางแผนเรื่องงานระหว่างนั้น', 'ไปตรวจเลือกตามหมายเรียก', 'สอบถามช่องทางการศึกษาและการผ่อนผัน', [S('wellbeing', -2), S('relationships', 1)], [S('knowledge', 1), H('money', -1)], { when: { all: [{ age: '>=', value: balance.milestoneAges.conscription }, { gender: 'ชาย' }] } }),
  milestone('illness-care', 'midLife', 'เจ็บป่วยและค่าใช้จ่าย', 'อาการป่วยรบกวนงาน คุณคิดถึงระยะทางไปสถานพยาบาลและรายได้ที่อาจหายไป', 'เดินทางไปรักษา', 'ขอคำแนะนำและนัดติดตามอาการ', [S('health', 7), H('money', -5)], [S('health', 2), H('money', -1)]),
  milestone('parent-care', 'midLife', 'ดูแลแม่ที่อายุมากขึ้น', 'แม่เริ่มต้องการความช่วยเหลือในชีวิตประจำวัน พี่น้องคุยกันเรื่องเวลาและค่าใช้จ่าย', 'แบ่งเวลาดูแลด้วยตัวเอง', 'ช่วยค่าเดินทางและค่าดูแล', [S('careBurden', 5), S('relationships', 3), R('mother','health',2)], [H('money', -3), S('careBurden', 1), R('mother','health',1)], {when:{relativeAlive:'mother'}}),
  milestone('land-dispute', 'midLife', 'ข้อตกลงเรื่องที่ดิน', 'ญาติแต่ละคนมีความทรงจำและความจำเป็นต่างกัน การคุยโดยมีเอกสารช่วยให้เห็นตรงกัน', 'นัดคุยพร้อมเอกสาร', 'ขอคนกลางในชุมชนช่วย', [S('relationships', 1), S('wellbeing', -1)], [S('relationships', 2), H('money', -1)]),
  milestone('inheritance', 'elder', 'แบ่งทรัพย์สินในครอบครัว', 'เรื่องที่ดินและของใช้มีความหมายไม่เท่ากันสำหรับทุกคน คุณพยายามหาข้อตกลงที่ยอมรับได้', 'แบ่งกันตามที่ตกลงร่วมกัน', 'ยกสิทธิ์ให้คนที่ดูแลบ้าน', [S('relationships', 2), S('wellbeing', 1)], [S('relationships', -1), S('wellbeing', 1)]),
  milestone('elder-days', 'elder', 'วันวัยสูงอายุ', 'กิจวัตรเปลี่ยนไป คุณมองหาสิ่งที่ทำได้ด้วยตัวเองและรักษาความสัมพันธ์กับคนรอบข้าง', 'ร่วมกิจกรรมกับคนในชุมชน', 'ใช้เวลากับคนในบ้าน', [S('wellbeing', 3), S('relationships', 2)], [S('wellbeing', 2), S('careBurden', -1)]),
  // TODO(verify): check historical framing and avoid implying uniform household impacts.
  milestone('financial-crisis-1997', ['childhood','teen','youngAdult','midLife','elder'], 'วิกฤตเศรษฐกิจ พ.ศ. 2540', 'ข่าวเรื่องงานและรายได้ที่ลดลงเดินทางมาถึงครอบครัว ผลกระทบแตกต่างกันไปตามอาชีพและพื้นที่', 'ปรับแผนรายจ่าย', 'ช่วยกันหางานเพิ่ม', [S('wellbeing', 1), H('money', -1)], [S('careBurden', 1), H('money', 2)], { pinnedYear: 1997 }),
  milestone('floods-2011', ['childhood','teen','youngAdult','midLife','elder'], 'น้ำท่วม พ.ศ. 2554', 'น้ำท่วมกระทบการเดินทางและสถานที่ทำงานในหลายพื้นที่ หากโรงงานหยุดงาน ครอบครัวต้องวางแผนรายได้และการเดินทางกลับบ้าน', 'กลับอีสานและช่วยครอบครัวทำนา', 'หางานต่อในพื้นที่อื่น', [H('money', -2), S('relationships', 3)], [H('money', 1), S('relationships', -1)], { pinnedYear: 2011 }),
  milestone('covid-2020', ['childhood','teen','youngAdult','midLife','elder'], 'การระบาด พ.ศ. 2563', 'การเดินทางและงานหลายอย่างเปลี่ยนไป คุณปรับตัวตามข้อมูลและความช่วยเหลือที่เข้าถึงได้', 'ลดการเดินทางและดูแลคนในบ้าน', 'หาช่องทางทำงานที่ยังทำได้', [S('health', 2), S('relationships', 2)], [H('money', 2), S('wellbeing', -1)], { pinnedYear: 2020 }),
  milestone('projected-2030', ['childhood','teen','youngAdult','midLife','elder'], 'ปีข้างหน้าที่คาดเดาไม่ได้', 'เหตุการณ์นี้เป็นภาพสมมติสำหรับปีหลัง พ.ศ. 2569 ไม่มีการอ้างว่าเป็นเหตุการณ์จริง', 'วางแผนจากสิ่งที่รู้', 'ขอคำแนะนำจากคนรอบตัว', [S('wellbeing', 1), S('knowledge', 1)], [S('relationships', 1)], { pinnedYear: 2030 }),
  { id:'heat-wave-auto',stage:['childhood','teen','youngAdult','midLife','elder'],title:'วันที่อากาศร้อนจัด',body:'อากาศร้อนทำให้งานกลางแจ้งเหนื่อยขึ้น คุณพักและดื่มน้ำตามที่มี. ในช่วงนี้การพักเป็นส่วนหนึ่งของการดูแลสุขภาพ',weight:balance.cards.milestoneWeight,once:false,auto:true,effects:[S('health',-1)],choices:[] },
]
const addModifiers = (cardId: string, choiceIndex: number, modifiers: NonNullable<Card['choices'][number]['modifiers']>) => {
  const choice=extra.find(card=>card.id===cardId)?.choices[choiceIndex]
  if(choice)choice.modifiers=modifiers
}
const distanceCost=balance.access.distanceCost
for(const id of ['school-start','grade-six','grade-nine','grade-twelve']) addModifiers(id,0,[
  {when:{regionAccess:'school',op:'<',value:balance.access.lowSchoolThreshold},effects:[H('money',-distanceCost)]},
  {when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('money',-balance.choiceCost)]},
  {when:{birthOrder:'>=',value:3},effects:[H('money',-balance.birthOrderCost)]},
  {when:{gender:'หญิง'},effects:[S('relationships',-1)]},
])
addModifiers('migration-first',0,[
  {when:{regionAccess:'jobs',op:'<',value:balance.access.lowJobThreshold},effects:[H('money',-distanceCost)]},
  {when:{gender:'หญิง'},effects:[S('careBurden',balance.genderCareCost)]},
  {when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('money',-balance.choiceCost)]},
])
addModifiers('parent-care',0,[{when:{gender:'หญิง'},effects:[S('careBurden',balance.genderCareCost)]}])
for(const id of ['birth-health','illness-care'])addModifiers(id,0,[{when:{regionAccess:'hospital',op:'<',value:balance.access.lowSchoolThreshold},effects:[H('money',-distanceCost)]}])
extra.find(card=>card.id==='migration-first')!.choices[0]!.setFlags=['migrated']
extra.find(card=>card.id==='love')!.choices[0]!.setFlags=['partnered']
extra.find(card=>card.id==='marriage')!.choices[0]!.setFlags=['partnered']
extra.find(card=>card.id==='children')!.choices[0]!.setFlags=['hasChild']
extra.find(card=>card.id==='grandparent-care')!.choices[0]!.setFlags=['migrated-east','hasChild','grandparentCares']
extra.find(card=>card.id==='floods-2011')!.choices[0]!.setFlags=['returnedHome']
// The generic cards supplement milestones so each stage has regular, grounded turns.
export const cards = [...extra, ...genericCards]
