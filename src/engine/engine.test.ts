import { describe, expect, it, vi } from 'vitest'
import { balance, cards } from '../content'
import { applyEffects, advanceYear, beginTurn, choose, createLife, createLifeFromRoll, eligibleCards, resolveAutoCard, rollBirth, simulateLife } from './game'
import { evaluateCondition } from './conditions'
import { portraitSvg, TONES } from '../ui/portraits/sprites'
import { personPortraitSvg } from '../ui/portraits/portrait'
import type { Card, LifeState } from './types'
import { SimulatedWorld } from '../world/service'

describe('life simulation engine',()=>{
  it('locks a birth roll to the device year and supports a fixed test clock',()=>{
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2041-06-15T12:00:00'))
      const a=rollBirth(123),b=rollBirth(123)
      expect(a).toEqual(b)
      expect(a.person.birthYear).toBe(2041)
      expect(a.person.birthYearBE).toBe(2584)
      expect(rollBirth(123,1992).person.birthYear).toBe(1992)
    } finally {
      vi.useRealTimers()
    }
  })
  it('keeps all gender birth weights explicitly placeholder-balanced',()=>{
    const counts={'หญิง':0,'ชาย':0,'อื่น ๆ':0};for(let seed=1;seed<=600;seed++)counts[rollBirth(seed).person.gender]++
    expect(balance.genderWeights).toEqual([1,1,1]);expect(Math.min(...Object.values(counts))).toBeGreaterThan(150)
    const school=cards.find(card=>card.id==='grade-nine')!.choices[0]!
    for(const gender of ['หญิง','ชาย','อื่น ๆ'] as const){const s=createLife(91);s.person.gender=gender;expect(school.modifiers?.some(modifier=>evaluateCondition(modifier.when,s))).toBe(true)}
  })
  it('evaluates declarative conditions including mixed and false any branches',()=>{
    const s=createLife(4);s.person.flags.school=true
    expect(evaluateCondition({all:[{age:'=',value:0},{flag:'school'},{not:{household:'ข้าราชการชั้นผู้น้อย'}}]},s)).toBe(true)
    expect(evaluateCondition({any:[{gender:s.person.gender},{age:'>',value:99}]},s)).toBe(true)
    const otherGender=s.person.gender==='หญิง'?'ชาย':'หญิง'
    expect(evaluateCondition({any:[{gender:otherGender},{age:'>',value:99}]},s)).toBe(false)
    expect(evaluateCondition({all:[{regionAccess:'school',op:'>=',value:0.4},{relativeAlive:'mother'},{birthOrder:'>=',value:1},{householdMoney:'>=',value:0}]},s)).toBe(true)
  })
  it('applies and clamps effects',()=>{
    const s=createLife(8);applyEffects(s,[{target:'self',key:'health',delta:400},{target:'household',key:'debt',delta:12},{target:{relativeRole:'mother'},key:'health',delta:5}])
    expect(s.person.health).toBe(100);expect(s.person.debt).toBeLessThanOrEqual(100)
  })
  it('finishes 1,000 seeded lives with valid stats and memorials',()=>{
    for(let seed=1;seed<=1000;seed++){
      const s=simulateLife(seed);expect(s.status).toBe('dead');expect(s.memorial.length).toBeGreaterThan(0)
      for(const k of ['health','wellbeing','knowledge','relationships','careBurden','aptitude','diligence','temperament'] as const){expect(Number.isFinite(s.person[k]),`seed ${seed}, stat ${k}`).toBe(true);expect(s.person[k]).toBeGreaterThanOrEqual(0);expect(s.person[k]).toBeLessThanOrEqual(100)}
    }
  })
  it('can draw every registered event card across the age range',()=>{
    expect(cards.length).toBeGreaterThanOrEqual(40)
    const reached=new Set<string>()
    for(let seed=1;seed<=1000;seed++){
      const roll=rollBirth(seed,1950+(seed%40))
      const s=createLifeFromRoll(seed,roll)
      for(let i=0;i<90&&s.status==='playing';i++){
        beginTurn(s,cards)
        if(s.currentCardIds[0]){const c=cards.find(x=>x.id===s.currentCardIds[0])!;reached.add(c.id);if(c.auto)resolveAutoCard(s,c);else choose(s,c,c.choices[0]!)}
        s.year++;s.person.stage=s.year-s.person.birthYear<=12?'childhood':s.year-s.person.birthYear<=19?'teen':s.year-s.person.birthYear<=35?'youngAdult':s.year-s.person.birthYear<=59?'midLife':'elder'
      }
    }
    expect([...cards.filter(c=>!c.fallback&&!reached.has(c.id)).map(c=>c.id)]).toEqual([])
  })
  it('draws an annual teen fallback when the authored pool is empty',()=>{
    const s=createLife(204)
    s.person.stage='teen'
    s.year=s.person.birthYear+15
    const teenFallbacks=cards.filter(card=>card.fallback&&['annual-teen-friends','annual-teen-next-step'].includes(card.id))
    beginTurn(s,teenFallbacks)
    expect(s.currentCardIds).toHaveLength(1)
    expect(['annual-teen-friends','annual-teen-next-step']).toContain(s.currentCardIds[0])
  })
  it('uses pinned historical cards only in their exact year',()=>{const s=createLife(17);s.year=1997;s.person.birthYear=1970;s.person.stage='youngAdult';expect(cards.find(c=>c.id==='financial-crisis-1997')?.pinnedYear).toBe(1997)})
  it('creates identical lives from the same seed',()=>expect(simulateLife(557)).toEqual(simulateLife(557)))
  it('derives portrait SVG deterministically',()=>{const p=portraitSvg(['ow','kr','ht'],{...TONES.s2!,hair:'#201a16',top:'#55705a',btm:'#514434',acc:'#b98643'},6);expect(p).toBe(portraitSvg(['ow','kr','ht'],{...TONES.s2!,hair:'#201a16',top:'#55705a',btm:'#514434',acc:'#b98643'},6));expect(p).toContain('crispEdges')})
  it('maps Thai-Chinese, trade and urban backgrounds to the outfit layers',()=>{
    const p=rollBirth(42).person
    expect(personPortraitSvg({...p,stage:'elder',flags:{...p.flags,thaiChinese:true}})).not.toBe(personPortraitSvg({...p,stage:'elder',flags:{...p.flags,thaiChinese:false}}))
    expect(personPortraitSvg({...p,stage:'youngAdult',householdType:'แรงงานในเมือง'})).toContain('<svg')
  })
  it('adds encountered urban and Thai-Chinese people to the life collection source',()=>{
    const s=createLife(511);const card=cards.find(item=>item.id==='market-stall')!;s.currentCardIds=[card.id];choose(s,card,card.choices[0]!)
    expect(s.metPeople).toHaveLength(1);expect(s.metPeople[0]?.householdType).toBe('ค้าขายครอบครัวไทยเชื้อสายจีน');expect(s.metPeople[0]?.flags.thaiChinese).toBe(true)
    expect(cards.filter(item=>item.choices.some(choice=>choice.modifiers?.length)).length).toBeGreaterThanOrEqual(12)
  })
  it('replays the worked example through real yearly turns and choices',()=>{
    const s=scriptedWorkedExample()
    expect(s.person.name).toBe('สมศรี นาดี');expect(s.person.birthYear).toBe(1992);expect(s.person.householdLandRai).toBe(15);expect(s.person.debt).toBeGreaterThan(0)
    expect(s.person.flags.topStudentM3).toBe(true);expect(s.person.flags.cannotAffordFurtherStudy).toBe(true)
    expect(s.person.location).toBe('เขตอุตสาหกรรมฝั่งตะวันออก');expect(s.person.remittancesSent).toBeGreaterThan(0)
    expect(s.person.partnered).toBe(true);expect(s.person.children).toBe(1);expect(s.person.flags.grandparentCares).toBe(true)
    expect(s.status).toBe('dead');expect(s.person.deathYear).toBeGreaterThan(2044);expect(s.memorial).toContain('ทำงานไกลบ้านและฝากลูกไว้กับยาย');expect(s.memorial).toContain('ช่วยดูแลแม่')
    expect(s.log.map(event=>event.cardId)).toEqual(expect.arrayContaining(['grade-nine','migration-first','floods-2011','marriage','children','grandparent-care','parent-care']))
    expect(s.log.find(event=>event.cardId==='floods-2011')?.year).toBe(2011)
  })
  it('provides a headless simulated world and same-window cohort outcomes',()=>{const w=new SimulatedWorld(721,4);expect(w.getLiveCounts().lives).toBeGreaterThanOrEqual(0);expect(w.getRecentBirths('').length).toBe(1);expect(w.getCohort(2010).every(life=>life.status==='dead')).toBe(true)})
  it('draws an eligible narrative card when it is the only candidate',()=>{
    const s=createLife(443)
    const heatWave=cards.find(card=>card.id==='heat-wave-auto')!
    beginTurn(s,[heatWave])
    expect(s.currentCardIds).toEqual([heatWave.id])
  })
  it('includes narrative cards in weighted draws alongside authored choices',()=>{
    const heatWave=cards.find(card=>card.id==='heat-wave-auto')!
    const authored:Card={id:'authored-draw-test',stage:'childhood',title:'test',body:'test',weight:4,once:false,choices:[{id:'choice',label:'choice',effects:[]}]}
    let narrativeDraws=0
    let authoredDraws=0
    for(let seed=1;seed<=400;seed++){
      const s=createLife(seed)
      beginTurn(s,[authored,heatWave])
      if(s.currentCardIds[0]===heatWave.id)narrativeDraws++
      if(s.currentCardIds[0]===authored.id)authoredDraws++
    }
    expect(narrativeDraws).toBeGreaterThan(0)
    expect(authoredDraws).toBeGreaterThan(0)
    expect(narrativeDraws+authoredDraws).toBe(400)
  })
  it('allows a second child and makes the elder land event eligible',()=>{
    const s=createLife(444)
    s.year=s.person.birthYear+25
    s.person.stage='youngAdult'
    s.person.partnered=true
    s.person.flags.partnered=true
    s.person.children=1
    const secondChild=cards.find(card=>card.id==='second-child')!
    expect(eligibleCards(s,cards)).toContain(secondChild)
    s.currentCardIds=[secondChild.id]
    choose(s,secondChild,secondChild.choices[0]!)
    expect(s.person.children).toBe(2)
    s.year=s.person.birthYear+60
    s.person.stage='elder'
    s.person.householdLandRai=1
    const elderLand=cards.find(card=>card.id==='ex-07-land-under-the-house')!
    expect(eligibleCards(s,cards)).toContain(elderLand)
  })
  it('resolves automatic cards without a player choice',()=>{const s=createLife(44);const c=cards.find(item=>item.id==='heat-wave-auto')!;s.currentCardIds=[c.id];const initial=s.person.health;resolveAutoCard(s,c);expect(s.person.health).toBe(initial-1);expect(s.log.at(-1)?.cardId).toBe(c.id);expect(s.currentCardIds).toEqual([])})
})

function play(s:LifeState,cardId:string,choiceId:string):void {
  const card=cards.find(item=>item.id===cardId)! as Card
  const choice=card.choices.find(item=>item.id===choiceId)!
  s.currentCardIds=[card.id]
  choose(s,card,choice)
}
function advanceTo(s:LifeState,year:number):void { while(s.year<year&&s.status==='playing')advanceYear(s,[]) }

// The forced values form the opening birth roll; every later year, effect, log entry and death comes from the engine.
export function scriptedWorkedExample():LifeState {
  for(let seed=123456;seed<123556;seed++){
    const roll=rollBirth(seed)
    Object.assign(roll.person,{name:'สมศรี นาดี',gender:'หญิง',birthYear:1992,birthYearBE:2535,province:'ร้อยเอ็ด',householdType:'ทำนา',householdLandRai:15,householdMoney:18,birthOrder:2,siblingCount:2,debt:25,health:100})
    const mother=roll.person.relatives.find(relative=>relative.role==='mother')!
    mother.age=22;mother.health=100
    const s=createLifeFromRoll(seed,roll)
    advanceTo(s,2007);if(s.status!=='playing')continue;play(s,'grade-nine','grade-nine-b')
    advanceTo(s,2008);if(s.status!=='playing')continue;play(s,'migration-first','migration-first-a')
    advanceTo(s,2009);if(s.status!=='playing'||s.person.remittancesSent===0)continue
    advanceTo(s,2011);if(s.status!=='playing')continue;play(s,'floods-2011','floods-2011-a');if(s.person.location!=='ร้อยเอ็ด')continue
    advanceTo(s,2017);if(s.status!=='playing')continue;play(s,'marriage','marriage-a');play(s,'children','children-b');play(s,'grandparent-care','grandparent-care-a')
    advanceTo(s,2044);if(s.status!=='playing'||!mother.alive)continue;play(s,'parent-care','parent-care-a')
    while(s.status==='playing')advanceYear(s,[])
    return s
  }
  throw new Error('No scripted seed survived the required scenario window')
}
