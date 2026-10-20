import { portraitSvg, TONES, type Palette } from './sprites'
import type { Person } from '../../engine/types'

function hash(text: string): number { let h=2166136261;for(const char of text)h=Math.imul(h^char.charCodeAt(0),16777619);return h>>>0 }
export function personPortraitSvg(person: Person, size=110): string {
  const p=person,h=hash(`${p.id}:${p.stage}:${p.gender}:${p.occupation}:${p.birthYear}:${p.province}`)
  const layers:string[]=[]
  if(p.stage==='childhood'||p.stage==='teen')layers.push(p.gender==='หญิง'?'osf':'osm')
  else if(p.flags.thaiChinese){layers.push(p.stage==='elder'?'ox':p.gender==='หญิง'?'ok':'ap')}
  else if(p.occupation.includes('ราชการ')||p.householdType==='ข้าราชการในเมือง')layers.push(p.gender==='หญิง'?'ol':'os')
  else if(p.householdType==='ค้าขายครอบครัวไทยเชื้อสายจีน'||p.householdType==='ค้าขายเล็ก ๆ'){layers.push('ap')}
  else if(p.householdType==='แรงงานในเมือง')layers.push(p.gender==='หญิง'?'ol':'os')
  else if(p.occupation.includes('นา')||p.householdType==='ทำนา'){layers.push('ow','kr');if(p.gender==='หญิง')layers.push('op')}
  else layers.push(p.gender==='หญิง'?'op':'oc')
  if(p.stage==='elder'&&p.flags.thaiChinese)layers.push('ox')
  layers.push(['hc','hp','hb','hl','hbo'][h%5]!)
  if(p.stage==='elder')layers.push('wr');if(h%4===0)layers.push('gl');if(p.householdType==='ทำนา'&&h%2===0)layers.push('ht')
  const tone=TONES[`s${(h>>>8)%6}`]!
  const palette:Palette={...tone,hair:p.stage==='elder'?'#8e8d7e':['#211b18','#38231b','#30241e','#161616'][h%4]!,top:['#6c8064','#aa6949','#637f92','#c29357','#726486'][h%5]!,btm:['#55433b','#314954','#716248','#453e53'][h%4]!,acc:['#c28b43','#6c7f66','#a55e51'][h%3]!}
  return portraitSvg(layers,palette,Math.max(1,Math.floor(size/22)))
}
