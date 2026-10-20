import { describe, expect, it } from 'vitest'
import { cards } from '../content'
import { applyEffects, beginTurn, choose, createLife, resolveAutoCard, rollBirth, simulateLife } from './game'
import { evaluateCondition } from './conditions'
import { portraitSvg } from '../ui/portraits/sprites'
import { TONES } from '../ui/portraits/sprites'
import { personPortraitSvg } from '../ui/portraits/portrait'
import type { LifeState } from './types'
import { buildMemorial } from '../content/chronicle'
import { SimulatedWorld } from '../world/service'

describe('life simulation engine',()=>{
  it('keeps birth rolls deterministic and weighted toward recent decades',()=>{
    const a=rollBirth(123),b=rollBirth(123);expect(a).toEqual(b);expect(a.person.birthYear).toBeGreaterThanOrEqual(1950);expect(a.person.birthYear).toBeLessThanOrEqual(2026)
    let recent=0;for(let seed=1;seed<=1000;seed++)if(rollBirth(seed).person.birthYear>=2000)recent++
    expect(recent).toBeGreaterThan(350)
  })
  it('evaluates declarative conditions',()=>{
    const s=createLife(4); s.person.flags.school=true
    expect(evaluateCondition({all:[{age:'=',value:0},{flag:'school'},{not:{household:'ข้าราชการชั้นผู้น้อย'}}]},s)).toBe(true)
    expect(evaluateCondition({any:[{gender:'หญิง'},{age:'>=',value:0}]},s)).toBe(true)
    expect(evaluateCondition({all:[{regionAccess:'school',op:'>=',value:0.4},{relativeAlive:'mother'},{birthOrder:'>=',value:1},{householdMoney:'>=',value:0}]},s)).toBe(true)
  })
  it('applies and clamps effects',()=>{
    const s=createLife(8); applyEffects(s,[{target:'self',key:'health',delta:400},{target:'household',key:'debt',delta:12},{target:{relativeRole:'mother'},key:'health',delta:5}])
    expect(s.person.health).toBe(100); expect(s.person.debt).toBeLessThanOrEqual(100)
  })
  it('finishes 1,000 seeded lives with valid stats and memorials',()=>{
    for(let seed=1;seed<=1000;seed++){
      const s=simulateLife(seed); expect(s.status).toBe('dead'); expect(s.memorial.length).toBeGreaterThan(0)
      for(const k of ['health','wellbeing','knowledge','relationships','careBurden','aptitude','diligence','temperament'] as const){ expect(s.person[k]).toBeGreaterThanOrEqual(0); expect(s.person[k]).toBeLessThanOrEqual(100) }
    }
  })
  it('can draw every registered event card across the age range',()=>{
    expect(cards.length).toBeGreaterThanOrEqual(40)
    const reached=new Set<string>()
    for(let seed=1;seed<=1000;seed++){
      const s=createLife(seed)
      for(let i=0;i<90&&s.status==='playing';i++){
        beginTurn(s,cards)
        if(s.currentCardIds[0]){const c=cards.find(x=>x.id===s.currentCardIds[0])!;reached.add(c.id);if(c.auto)resolveAutoCard(s,c);else choose(s,c,c.choices[0]!)}
        s.year++;s.person.stage=s.year-s.person.birthYear<=12?'childhood':s.year-s.person.birthYear<=19?'teen':s.year-s.person.birthYear<=35?'youngAdult':s.year-s.person.birthYear<=59?'midLife':'elder'
      }
    }
    expect([...cards.filter(c=>!reached.has(c.id)).map(c=>c.id)]).toEqual([])
  })
  it('uses pinned historical cards only in their exact year',()=>{const s=createLife(17);s.year=1997;s.person.birthYear=1970;s.person.stage='youngAdult';expect(cards.find(c=>c.id==='financial-crisis-1997')?.pinnedYear).toBe(1997)})
  it('creates identical lives from the same seed',()=>expect(simulateLife(557)).toEqual(simulateLife(557)))
  it('derives portrait SVG deterministically',()=>{const p=portraitSvg(['ow','kr','ht'],{...TONES.s2!,hair:'#201a16',top:'#55705a',btm:'#514434',acc:'#b98643'},6);expect(p).toBe(portraitSvg(['ow','kr','ht'],{...TONES.s2!,hair:'#201a16',top:'#55705a',btm:'#514434',acc:'#b98643'},6));expect(p).toContain('crispEdges')})
  it('derives each person portrait from the person and age stage',()=>{const person=rollBirth(42).person;expect(personPortraitSvg(person)).toBe(personPortraitSvg(person));expect(personPortraitSvg({...person,stage:'elder'})).not.toBe(personPortraitSvg(person))})
  it('replays the worked example as one complete life',()=>{const s=scriptedWorkedExample();expect(s.person.name).toBe('สมศรี นาดี');expect(s.person.birthYear).toBe(1992);expect(s.person.deathYear!-s.person.birthYear).toBe(78);expect(s.person.householdLandRai).toBe(15);expect(s.person.debt).toBeGreaterThan(0);expect(s.memorial).toContain('ทำงานไกลบ้าน');expect(s.memorial).toContain('ดูแลแม่')})
  it('provides a headless simulated world and same-window cohort outcomes',()=>{const w=new SimulatedWorld(721,4);expect(w.getLiveCounts().lives).toBeGreaterThanOrEqual(0);expect(w.getRecentBirths('').length).toBe(1);expect(w.getCohort(2010).every(life=>life.status==='dead')).toBe(true)})
  it('resolves automatic cards without a player choice',()=>{const s=createLife(44);const c=cards.find(item=>item.id==='heat-wave-auto')!;s.currentCardIds=[c.id];const initial=s.person.health;resolveAutoCard(s,c);expect(s.person.health).toBe(initial-1);expect(s.log.at(-1)?.cardId).toBe(c.id);expect(s.currentCardIds).toEqual([])})
})

// Scripted narrative fixture for the requested example life; the fixture can be replayed without UI input.
export function scriptedWorkedExample(): LifeState {
  const s=createLife(2535);Object.assign(s.person,{name:'สมศรี นาดี',gender:'หญิง',birthYear:1992,province:'ร้อยเอ็ด',householdType:'ทำนา',householdLandRai:15,householdMoney:18,birthOrder:2,siblingCount:2,debt:25,partnered:true,children:1,migrated:true,location:'เขตอุตสาหกรรมฝั่งตะวันออก'});s.person.flags['เรียนดี ม.3']=true;s.person.flags['ทำงานโรงงานกรุงเทพฯ']=true;s.person.flags['กลับบ้านช่วงน้ำท่วม 2554']=true;s.person.flags['ดูแลแม่']=true
  const scripted=[{year:2007,cardId:'grade-nine',text:'เรียนต่อ ม.4 ไม่ไหว ครอบครัวช่วยได้คนเดียว'},{year:2008,cardId:'migration-first',text:'ไปทำงานโรงงานที่กรุงเทพฯ และส่งเงินกลับบ้าน'},{year:2011,cardId:'floods-2011',text:'โรงงานปิดช่วงน้ำท่วม พ.ศ. 2554 จึงกลับมาทำนา'},{year:2018,cardId:'grandparent-care',text:'แต่งงานและมีลูกสาว ฝากยายช่วยเลี้ยงระหว่างทำงานฝั่งตะวันออก'},{year:2044,cardId:'parent-care',text:'กลับมาดูแลแม่เมื่ออายุมากขึ้น'}]
  scripted.forEach(event=>s.log.push({...event,title:'ช่วงหนึ่งของชีวิต'}));s.year=2070;s.person.deathYear=2070;s.person.alive=false;s.status='dead';s.memorial=buildMemorial(s.person,s.year,s.log);return s
}
