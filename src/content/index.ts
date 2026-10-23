import { balance } from './balance'
import type { Card, Condition, RegionProfile } from '../engine/types'
import { isanFamilyMoneyCards } from './isanFamilyMoneyCards'
import { isanHouseholdThreadCards } from './isanHouseholdThreadCards'
import { isanCultureCards } from './isanCultureCards'
import { annualFallbackCards, isanEventBankCards } from './isanEventBankCards'
import healthZoneData from './data/isan-health-zones.json'

export { balance }
export { isanHouseholds2023, isanHouseholds2023Source } from './data/isan-households-2023'

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
export const occupations = { farmWork:'ช่วยงานในไร่นาของครอบครัว', urbanWork:'งานรับจ้างในเมือง', migrantRelative:'แรงงานย้ายถิ่น' }
export const provinces = ['กาฬสินธุ์', 'ขอนแก่น', 'ชัยภูมิ', 'นครพนม', 'นครราชสีมา', 'บึงกาฬ', 'บุรีรัมย์', 'มหาสารคาม', 'มุกดาหาร', 'ยโสธร', 'ร้อยเอ็ด', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อำนาจเจริญ', 'อุดรธานี', 'อุบลราชธานี']
const healthZoneByProvince = new Map(Object.entries(healthZoneData.zones).flatMap(([zone, names]) => names.map(name => [name, Number(zone)] as const)))
export const regions: RegionProfile[] = provinces.map((name, i) => ({ id: `isan-${i}`, name, schoolAccess: balance.access.school, hospitalAccess: balance.access.hospital, jobAccess: balance.access.jobs, healthZone: healthZoneByProvince.get(name) }))

const ageWindow = (range:readonly [number,number]):Condition => ({all:[{age:'>=',value:range[0]},{age:'<=',value:range[1]}]})
const S = (key: 'health'|'wellbeing'|'knowledge'|'relationships'|'careBurden'|'aptitude'|'diligence'|'temperament', delta: number) => ({ target: 'self' as const, key, delta: balance.eventDeltas[key][String(delta)]! })
const H = (key: 'money'|'debt', delta: number) => ({ target: 'household' as const, key, delta: balance.eventDeltas[key][String(delta)]! })
const R = (relativeRole: string, key: 'health'|'relationships', delta: number) => ({ target: { relativeRole }, key, delta: balance.eventDeltas[key][String(delta)]! })
/*
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
*/
const routine = (id: string, stage: Card['stage'], title: string, body: string, a: string, b: string, ea: Card['choices'][number]['effects'], eb: Card['choices'][number]['effects'], opts: Partial<Card> = {}): Card => ({ id, stage, title, body, weight: balance.cards.routineWeight, once: true, ...opts, choices: [{ id: `${id}-a`, label: a, effects: ea }, { id: `${id}-b`, label: b, effects: eb }] })
// Authored recurring situations: each card describes a distinct decision, not a generated title/choice template.
const routineCards: Card[] = [
  routine('rain-delay','childhood','ฝนยังไม่มาตามนัด','ผู้ใหญ่คุยกันว่าจะหว่านซ่อมบางส่วนหรือเก็บเมล็ดไว้รอจังหวะที่เหมาะกว่า','ช่วยเตรียมแปลงเท่าที่ทำได้','เก็บเมล็ดพันธุ์ไว้ก่อน',[S('diligence',2),S('careBurden',1)],[S('wellbeing',1),H('money',-1)]),
  routine('school-library','childhood','มุมหนังสือในโรงเรียน','ครูเปิดห้องสมุดหลังเลิกเรียน แต่รถรับส่งกลับบ้านออกก่อนเวลา','อยู่ทำรายงานกับเพื่อน','กลับบ้านตามเวลารถ',[S('knowledge',3),S('relationships',1)],[S('knowledge',1),S('careBurden',-1)],{when:ageWindow(balance.routineAges.library)}),
  routine('younger-sibling','childhood','น้องมีไข้ในวันที่ต้องสอบ','คนในบ้านต้องแบ่งเวลาเฝ้าน้องกับพาคุณไปโรงเรียน','ไปสอบแล้วให้ญาติช่วยดูน้อง','อยู่เฝ้าน้องและเลื่อนสอบ',[S('knowledge',2),S('relationships',-1),H('money',-1)],[S('relationships',2),S('wellbeing',-1)],{when:ageWindow(balance.routineAges.siblingExam)}),
  routine('school-uniform','childhood','เครื่องแบบที่ยังใส่ได้','ชุดนักเรียนตัวเดิมเริ่มคับ ครอบครัวดูเงินที่เหลือก่อนเปิดเทอม','ซื้อชุดใหม่ให้พอดีตัว','ซ่อมหรือรับชุดต่อจากญาติ',[H('money',-3),S('wellbeing',1)],[H('money',-1),S('relationships',1)]),
  routine('exam-trip','teen','วันสอบไกลบ้าน','สนามสอบอยู่อีกอำเภอ คุณต้องเลือกว่าจะเดินทางไปสอบหรือรับงานที่มีค่าจ้างแน่นอน','ไปสอบตามกำหนด','รับงานที่มีค่าจ้างแน่นอน',[H('money',-3),S('knowledge',4)],[H('money',2),S('knowledge',-1)],{when:ageWindow(balance.routineAges.examTrip)}),
  routine('teacher-reference','teen','ครูเขียนจดหมายแนะนำ','มีทุนหรือโครงการให้สมัคร แต่เอกสารและการเดินทางต้องจัดการเอง','ให้ครูช่วยตรวจใบสมัคร','สมัครตามเอกสารที่มี',[S('knowledge',3),H('money',-1)],[S('wellbeing',1),S('relationships',1)]),
  routine('factory-interview','teen','นัดสัมภาษณ์งานโรงงาน','บริษัทนัดสัมภาษณ์พร้อมกันหลายคน คุณชั่งใจเรื่องค่าเดินทางและการเริ่มงานเร็ว','เดินทางไปสัมภาษณ์','รับงานใกล้บ้านก่อน',[H('money',-2),S('knowledge',2)],[H('money',1),S('wellbeing',-1)],{when:ageWindow(balance.routineAges.factoryInterview)}),
  routine('village-transport','youngAdult','รถเที่ยวสุดท้าย','รถกลับหมู่บ้านมีรอบจำกัด การทำงานกะดึกเพิ่มรายได้แต่ทำให้กลับบ้านยาก','รับกะกลางวัน','รับกะกลางคืน',[H('money',-1),S('health',1),S('relationships',1)],[H('money',3),S('health',-2)]),
  routine('first-pay','youngAdult','เงินเดือนงวดแรก','หลังหักค่าห้องและค่าเดินทาง คุณแบ่งเงินระหว่างเก็บสำรองกับส่งให้บ้าน','กันเงินฉุกเฉินไว้ก่อน','ส่งเงินให้บ้านมากขึ้น',[S('wellbeing',2),H('money',-1)],[H('money',2),S('relationships',2)]),
  routine('market-stall','youngAdult','แผงขายของหน้าตลาด','ญาติชวนลองขายอาหารช่วงเช้า มีต้นทุนวัตถุดิบและโอกาสได้ลูกค้าประจำ','ช่วยตั้งแผงวันหยุด','พักวันหยุดและเก็บเงินไว้',[H('money',-2),S('aptitude',2),S('relationships',1)],[S('wellbeing',1),S('knowledge',1)]),
  routine('workplace-course','youngAdult','อบรมทักษะหลังเลิกงาน','ที่ทำงานมีอบรมเพิ่มทักษะโดยไม่คิดค่าเรียน แต่ต้องสละเวลาพักหลายสัปดาห์','สมัครอบรม','ใช้เวลาพักหลังเลิกงาน',[S('knowledge',4),S('wellbeing',-2)],[S('health',1),S('wellbeing',1)]),
  routine('roommate-rent','youngAdult','ค่าเช่าห้องปรับขึ้น','เจ้าของห้องแจ้งค่าเช่าใหม่ คุณเลือกหาห้องร่วมกับคนอื่นหรือเดินทางไกลขึ้น','แชร์ห้องกับเพื่อน','ย้ายไปห้องที่ไกลกว่า',[H('money',1),S('relationships',1)],[H('money',-2),S('wellbeing',-1)]),
  routine('community-fund','youngAdult','กองทุนช่วยงานศพ','เพื่อนบ้านชวนร่วมกองทุนที่ช่วยสมาชิกยามจำเป็น การจ่ายวันนี้กระทบเงินใช้จ่าย','ร่วมกองทุนตามกำลัง','เก็บเงินไว้ใช้เอง',[H('money',-1),S('relationships',2)],[H('money',1),S('wellbeing',-1)]),
  routine('childcare-shift','midLife','เวลางานชนกับเวลารับลูก','โรงเรียนเลิกก่อนกะงานจบ คุณคุยกับญาติและหัวหน้างานเพื่อจัดตารางใหม่','ขอลดกะเพื่อไปรับลูก','รักษากะงานเดิมและขอญาติช่วย',[H('money',-2),S('relationships',2),S('careBurden',1)],[H('money',1),S('wellbeing',-1)]),
  routine('repair-pump','midLife','ปั๊มน้ำเสียก่อนปลูก','การซ่อมอาจทันรอบเพาะปลูกแต่ต้องจ่ายก่อน หรือรอใช้เครื่องมือร่วมกับเพื่อนบ้าน','ซ่อมทันที','รอใช้เครื่องมือร่วมกัน',[H('money',-3),S('wellbeing',1)],[H('money',1),S('relationships',2)]),
  routine('care-rotation','midLife','จัดเวรดูแลผู้ใหญ่','พี่น้องอยู่คนละที่ คุณชวนคุยเรื่องตารางดูแลและค่าเดินทาง','ทำตารางร่วมกัน','ช่วยค่าเดินทางแทน',[S('relationships',3),S('careBurden',-1)],[H('money',1),S('careBurden',2)]),
  routine('local-election-day','midLife','วันช่วยงานชุมชน','ชุมชนขอแรงจัดสถานที่ คุณมีงานรับจ้างที่เสียรายได้หากหยุด','ช่วยช่วงเช้า','รับงานตามปกติ',[S('relationships',2),H('money',-1)],[H('money',2),S('wellbeing',-1)]),
  routine('clinic-queue','elder','คิวตรวจที่โรงพยาบาล','ญาติชวนไปตรวจตามนัด การเดินทางใช้เวลาทั้งวันและต้องมีคนพาไป','ไปตามนัด','เลื่อนนัดเพื่อเก็บเงิน',[S('health',3),H('money',-2),S('careBurden',1)],[H('money',-1),S('relationships',-1)]),
  routine('teach-grandchild','elder','หลานถามเรื่องงานเก่า','หลานอยากรู้ว่าครอบครัวเคยย้ายถิ่นและทำงานอย่างไร คุณเลือกเล่าเรื่องหรือพักผ่อน','เล่าให้ฟัง','พักในวันที่เหนื่อย',[S('relationships',2),S('wellbeing',2)],[S('health',1),S('wellbeing',1)]),
  routine('home-modification','elder','ปรับบ้านให้เดินสะดวก','ขั้นบันไดเริ่มลำบาก ครอบครัวคุยกันว่าจะปรับบ้านหรือจัดคนช่วยดูแล','ปรับทางเดินและราวจับ','จัดเวรคนในบ้านช่วยดูแล',[H('money',-3),S('health',2)],[S('relationships',2),S('careBurden',1)]),
]
routineCards.find(card=>card.id==='market-stall')!.choices[0]!.setFlags=['metThaiChineseShopkeeper']
routineCards.find(card=>card.id==='childcare-shift')!.choices[0]!.setFlags=['metUrbanCoworker']

const milestone = (id: string, stage: Card['stage'], title: string, body: string, choiceA: string, choiceB: string, effectsA: Card['choices'][number]['effects'], effectsB: Card['choices'][number]['effects'], opts: Partial<Card> = {}): Card => ({ id, stage, title, body, weight: balance.cards.milestoneWeight, once: true, ...opts, choices: [{ id: `${id}-a`, label: choiceA, effects: effectsA }, { id: `${id}-b`, label: choiceB, effects: effectsB }] })
const extra: Card[] = [
  milestone('birth-health', 'childhood', 'วันแรกของชีวิต', 'คุณเพิ่งเกิดที่โรงพยาบาลอำเภอ คนในบ้านช่วยกันดูแลและตัดสินใจว่าจะพาคุณไปตรวจอาการเพิ่มเติมหรือขอแรงญาติมาช่วย', 'พาไปตรวจอาการเพิ่มเติม', 'ขอแรงญาติมาช่วยดูแล', [S('health', 5), H('money', -3)], [S('relationships', 2), S('health', 1)], {when:ageWindow([0,0]), opening:true}),
  milestone('who-raises', 'childhood', 'ใครช่วยเลี้ยงดู', 'งานและการเดินทางของผู้ใหญ่ทำให้การดูแลเป็นเรื่องที่หลายคนช่วยกัน', 'อยู่กับยายช่วงกลางวัน', 'ไปกับแม่ตามงาน', [S('relationships', 3), S('careBurden', -1)], [S('relationships', 1), S('knowledge', 1)]),
  milestone('child-farm-work', ['childhood','teen'], 'ช่วงเกี่ยวข้าวกับวันเรียน', 'ตอนอายุ 12–13 งานในนาบางวันชนกับเวลาเรียนหรืออ่านหนังสือ คุณกับผู้ใหญ่คุยกันว่าจะช่วยกันอย่างไร', 'ช่วยงานที่พอทำไหวแล้วแบ่งเวลาอ่านหนังสือ', 'ขอให้ผู้ใหญ่จัดงานนาโดยไม่ชนวันเรียน', [S('diligence', 2), S('careBurden', 1)], [S('knowledge', 1), S('wellbeing', 1)], {when:{all:[ageWindow(balance.milestoneAges.farmWork),{household:'ทำนา'}]}}),
  milestone('school-start', 'childhood', 'เริ่มเข้าโรงเรียน', 'โรงเรียนอยู่ห่างจากบ้านพอให้ต้องวางแผนการเดินทางและค่าใช้จ่าย', 'เดินทางไปเรียน', 'เรียนใกล้บ้านและแบ่งเวลาช่วยงาน', [S('knowledge', 5), H('money', -2)], [S('knowledge', 2), S('careBurden', 2)], {when:ageWindow(balance.milestoneAges.schoolStart)}),
  milestone('grade-six', 'childhood', 'หลังจบ ป.6', 'การเรียนต่อ ม.1 ต้องคุยกันเรื่องระยะทาง ค่าเดินทาง และภาระของบ้าน', 'เรียนต่อ ม.1', 'ทำงานและเรียนตามโอกาส', [S('knowledge', 5), H('money', -3)], [H('money', 3), S('knowledge', 1)], {when:ageWindow(balance.milestoneAges.gradeSix)}),
  milestone('grade-nine', 'teen', 'หลังจบ ม.3', 'คุณทำคะแนนได้ดี แต่ค่าเรียนของคุณกับพี่ชายเกินกำลังที่บ้านจะจ่ายพร้อมกัน จึงต้องเลือกระหว่างเรียนต่อกับเริ่มทำงาน', 'เรียนต่อ ม.4', 'เริ่มทำงานและส่งเงินกลับบ้าน', [S('knowledge', 5), H('money', -4)], [H('money', 4), S('relationships', -1)], {when:ageWindow(balance.milestoneAges.gradeNine)}),
  milestone('grade-twelve', 'teen', 'หลังจบ ม.6', 'คุณตัดสินใจว่าจะเรียนต่อหรือเริ่มทำงาน โดยมองทั้งโอกาสและภาระที่บ้าน', 'สมัครเรียนต่อ', 'เริ่มทำงานก่อน', [S('knowledge', 6), H('money', -5)], [H('money', 5), S('wellbeing', 1)], {when:ageWindow(balance.milestoneAges.gradeTwelve)}),
  milestone('migration-first', 'teen', 'งานไกลบ้าน', 'มีคนชวนไปทำงานกรุงเทพฯ หรือเขตอุตสาหกรรม ค่าเดินทางและการแยกจากบ้านต้องคิดไว้', 'ไปทำงานโรงงานในกรุงเทพฯ และส่งเงินกลับบ้าน', 'รอหางานใกล้บ้าน', [H('money', 4), S('relationships', -2)], [H('money', 1), S('relationships', 1)], {when:ageWindow(balance.milestoneAges.migration)}),
  milestone('baht-fund', 'youngAdult', 'เงินกู้กองทุนหมู่บ้าน', 'รายจ่ายก้อนหนึ่งมาถึงในช่วงที่เงินสดไม่พอ คุณชั่งน้ำหนักเงื่อนไขและความจำเป็น', 'กู้จากกองทุนหมู่บ้าน', 'ลดรายจ่ายและรอ', [H('money', 6), H('debt', 7)], [S('wellbeing', -1), H('debt', 0)]),
  milestone('baac', 'youngAdult', 'สินเชื่อเพื่อการเกษตร', 'ค่าเมล็ดพันธุ์และอุปกรณ์ต้องจ่ายก่อนเห็นผลผลิต การกู้มีทั้งโอกาสและภาระชำระคืน', 'ยื่นกู้ ธ.ก.ส.', 'เริ่มจากพื้นที่และของที่มี', [H('money', 7), H('debt', 8)], [H('money', -1), S('wellbeing', -1)]),
  milestone('informal-debt', 'midLife', 'ขอยืมคนรู้จัก', 'รายจ่ายฉุกเฉินเกิดขึ้นก่อนรายรับรอบถัดไป คุณขอความช่วยเหลือจากคนใกล้ตัว', 'ยืมเงินไว้ก่อน', 'คุยขอเลื่อนรายจ่าย', [H('money', 5), H('debt', 8)], [S('relationships', -1), H('debt', 0)]),
  milestone('love', 'youngAdult', 'คนที่อยากใช้ชีวิตด้วย', 'ความสัมพันธ์เติบโตจากการใช้เวลาและพูดคุยถึงความคาดหวังของแต่ละคน', 'ค่อย ๆ สร้างความสัมพันธ์', 'ให้เวลากับงานและตัวเองก่อน', [S('relationships', 4), S('wellbeing', 2)], [S('knowledge', 1), S('wellbeing', 1)]),
  milestone('marriage', 'youngAdult', 'ตกลงสร้างครอบครัว', 'คุณและคนรักคุยกันเรื่องงาน ที่อยู่ และวิธีแบ่งภาระในชีวิตประจำวัน', 'จัดพิธีพอเหมาะกับกำลัง', 'ใช้ชีวิตร่วมกันแบบเรียบง่าย', [H('money', -3), S('relationships', 3)], [S('relationships', 2)]),
  milestone('children', 'youngAdult', 'มีลูกคนแรก', 'สมาชิกใหม่ทำให้มีทั้งความสุขและงานดูแลเพิ่มขึ้น เครือญาติช่วยกันตามความพร้อม', 'เลี้ยงดูใกล้ชิด', 'ให้ผู้ใหญ่ช่วยดูแลระหว่างทำงาน', [S('relationships', 4), S('careBurden', 5)], [S('relationships', 2), H('money', 2)]),
  milestone('second-child', 'youngAdult', 'ลูกคนที่สองกับค่าใช้จ่ายของบ้าน', 'บ้านเริ่มตั้งหลักได้แล้ว ญาติผู้ใหญ่ถามว่าจะมีลูกอีกคนไหม ส่วนคุณกับคู่ก็นั่งชั่งว่ารายได้กับค่าเลี้ยงดูจะพอหรือเปล่า', 'มีลูกอีกคน', 'รอก่อน ให้ตั้งตัวให้มั่นคงกว่านี้', [H('money', -2), S('relationships', 1)], [H('money', 1)], {when:{all:[{flag:'partnered'},{children:'=',value:1}]},once:true}),
  milestone('grandparent-care', ['youngAdult','midLife'], 'ฝากลูกไว้กับยาย', 'งานต่างจังหวัดช่วยให้มีรายได้ แต่ลูกต้องอยู่กับยายและมีค่าเดินทางกลับบ้าน', 'ไปทำงานฝั่งตะวันออกและส่งเงิน', 'หางานที่กลับบ้านได้บ่อย', [H('money', 5), S('relationships', -2)], [H('money', 2), S('relationships', 1)]),
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
  milestone('projected-2030', ['childhood','teen','youngAdult','midLife','elder'], 'ปีข้างหน้าที่คาดเดาไม่ได้', 'เหตุการณ์นี้เป็นภาพสมมุติสำหรับปีหลัง พ.ศ. 2569 ไม่มีการอ้างว่าเป็นเหตุการณ์จริง', 'วางแผนจากสิ่งที่รู้', 'ขอคำแนะนำจากคนรอบตัว', [S('wellbeing', 1), S('knowledge', 1)], [S('relationships', 1)], { pinnedYear: 2030 }),
  { id:'heat-wave-auto',stage:['childhood','teen','youngAdult','midLife','elder'],title:'วันที่อากาศร้อนจัด',body:'อากาศร้อนทำให้งานกลางแจ้งเหนื่อยขึ้น คุณพักและดื่มน้ำตามที่มี ในช่วงนี้การพักเป็นส่วนหนึ่งของการดูแลสุขภาพ',weight:balance.cards.lowWeight,once:true,auto:true,effects:[S('health',-1)],choices:[] },
]
const addModifiers = (cardId: string, choiceIndex: number, modifiers: NonNullable<Card['choices'][number]['modifiers']>) => {
  const choice=[...extra,...routineCards].find(card=>card.id===cardId)?.choices[choiceIndex]
  if(choice)choice.modifiers=modifiers
}
const distanceCost=balance.access.distanceCost
for(const id of ['school-start','grade-six','grade-nine','grade-twelve']) addModifiers(id,0,[
  {when:{regionAccess:'school',op:'<',value:balance.access.lowSchoolThreshold},effects:[H('money',-distanceCost)],narration:'โรงเรียนที่เข้าถึงได้อยู่ไกล จึงมีค่าเดินทางเพิ่ม'},
  {when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('money',-balance.choiceCost)],narration:'เงินสำรองในบ้านมีจำกัด ต้องแบ่งค่าเรียนจากเงินก้อนเดิม'},
  {when:{birthOrder:'>=',value:3},effects:[H('money',-balance.birthOrderCost)],narration:'มีพี่น้องหลายคน ค่าใช้จ่ายเพื่อเรียนต้องแบ่งกัน'},
  ...genderModifiers('การเรียนต่อมีค่าใช้จ่ายและแรงกดดันในบ้านต่างกัน',S('relationships',-1),H('money',-1),S('relationships',-1)),
])
addModifiers('migration-first',0,[
  {when:{regionAccess:'jobs',op:'<',value:balance.access.lowJobThreshold},effects:[H('money',-distanceCost)],narration:'งานใกล้บ้านมีน้อย ค่าเดินทางไปเริ่มงานไกลจึงสูงขึ้น'},
  ...genderModifiers('การย้ายงานทำให้ภาระที่บ้านและความคาดหวังเปลี่ยนไป',S('careBurden',balance.genderExpectationCosts.female),S('relationships',-1),S('careBurden',balance.genderExpectationCosts.other)),
  {when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('money',-balance.choiceCost)],narration:'ครอบครัวมีเงินสำรองน้อย จึงออกค่าเดินทางล่วงหน้าได้ยาก'},
])
addModifiers('parent-care',0,genderModifiers('สมาชิกครอบครัวถูกคาดหวังให้รับภาระดูแลไม่เท่ากัน',S('careBurden',balance.genderExpectationCosts.female),S('careBurden',balance.genderExpectationCosts.male),S('careBurden',balance.genderExpectationCosts.other)))
for(const id of ['birth-health','illness-care'])addModifiers(id,0,[{when:{regionAccess:'hospital',op:'<',value:balance.access.lowHospitalThreshold},effects:[H('money',-distanceCost)],narration:'สถานพยาบาลอยู่ไกล มีค่าเดินทางและเวลาที่ต้องจัดเพิ่ม'}])
for(const id of ['baht-fund','baac','informal-debt']) addModifiers(id,0,[{when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('debt',2)],narration:'เงินสำรองน้อย การกู้เพิ่มจึงมีภาระชำระมากขึ้น'}])
addModifiers('floods-2011',0,[{when:{regionAccess:'jobs',op:'<',value:balance.access.lowJobThreshold},effects:[H('money',-distanceCost)],narration:'การหางานทดแทนในพื้นที่มีตัวเลือกจำกัดและต้องเดินทาง'}])
addModifiers('childcare-shift',0,genderModifiers('ตารางงานและความคาดหวังเรื่องการรับส่งลูกกระทบคนในบ้านต่างกัน',S('careBurden',2),S('relationships',-1),S('careBurden',2)))
addModifiers('market-stall',0,[{when:{householdMoney:'<',value:balance.lowWealthThreshold},effects:[H('money',-2)],narration:'เงินทุนตั้งแผงต้องมาจากเงินสำรองของบ้าน'}])
addModifiers('clinic-queue',0,[{when:{regionAccess:'hospital',op:'<',value:balance.access.lowSchoolThreshold},effects:[H('money',-distanceCost)],narration:'การเดินทางไปตรวจสุขภาพใช้เงินและเวลามากขึ้น'}])
extra.find(card=>card.id==='migration-first')!.choices[0]!.setFlags=['migrated']
extra.find(card=>card.id==='grade-nine')!.choices[1]!.setFlags=['topStudentM3','cannotAffordFurtherStudy']
extra.find(card=>card.id==='grade-twelve')!.choices.forEach(choice=>{choice.setFlags=['completedM6']})
extra.find(card=>card.id==='love')!.choices[0]!.setFlags=['partnered']
extra.find(card=>card.id==='marriage')!.choices[0]!.setFlags=['partnered']
extra.find(card=>card.id==='children')!.choices[0]!.setFlags=['hasChild']
extra.find(card=>card.id==='children')!.choices[1]!.setFlags=['hasChild']
extra.find(card=>card.id==='second-child')!.choices[0]!.setFlags=['hasChild']
extra.find(card=>card.id==='grandparent-care')!.choices[0]!.setFlags=['migrated-east','grandparentCares']
extra.find(card=>card.id==='floods-2011')!.choices[0]!.setFlags=['returnedHome']
// Every gender receives an explicit, visible modifier; values are tunable placeholders.
function genderModifiers(reason: string, female: Card['choices'][number]['effects'][number], male: Card['choices'][number]['effects'][number], other: Card['choices'][number]['effects'][number]): NonNullable<Card['choices'][number]['modifiers']> {
  return [
    {when:{gender:'หญิง'},effects:[female],narration:`${reason}: ตามบริบทของผู้หญิง`},
    {when:{gender:'ชาย'},effects:[male],narration:`${reason}: ตามบริบทของผู้ชาย`},
    {when:{gender:'อื่น ๆ'},effects:[other],narration:`${reason}: ตามบริบทของผู้มีเพศอื่น ๆ`},
  ]
}
export const cards = [...extra, ...routineCards, ...isanFamilyMoneyCards, ...isanHouseholdThreadCards, ...isanCultureCards, ...isanEventBankCards, ...annualFallbackCards]
