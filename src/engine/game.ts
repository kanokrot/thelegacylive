import { balance as b } from '../content/balance'
import { birthRevealLabels, cards as defaultCards, givenNames, givenNamesByEra, occupations, provinces, regions, surnames } from '../content'
import { ui } from '../content/ui'
import { evaluateCondition } from './conditions'
import { mulberry32 } from './rng'
import { buildMemorial } from '../content/chronicle'
import type { AutoPolicy, BirthRoll, Card, Choice, DeathCause, LifeState, Person, Relative, Stage } from './types'
import { chooseDeathCause, mortalityDraw } from './mortality'

const int = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const pick = <T>(rng: () => number, list: readonly T[]): T => list[Math.floor(rng() * list.length)]!
const clamp = (n: number) => Math.max(b.minStat, Math.min(b.maxStat, n))
export function stageFor(age: number): Stage { return age <= b.stages.childhood ? 'childhood' : age <= b.stages.teen ? 'teen' : age <= b.stages.youngAdult ? 'youngAdult' : age <= b.stages.midLife ? 'midLife' : 'elder' }
function weightedPick<T>(rng:()=>number,items:readonly T[],weights:readonly number[]):T {const total=weights.reduce((a,x)=>a+x,0);let n=rng()*total;return items[items.findIndex((_,i)=>(n-=weights[i]??0)<0)]??items[items.length-1]!}
function relative(id: string, role: Relative['role'], name: string, age: number, gender: Person['gender'], rng: () => number): Relative { return { id, role, name, age, gender, health: int(rng,b.relativeHealth[0],b.relativeHealth[1]), relationship: int(rng,b.relativeRelationship[0],b.relativeRelationship[1]), alive: true, migrated: false, married: false } }
export function rollBirth(seed = Math.floor(Math.random()*0xffffffff), currentYear = new Date().getFullYear()): BirthRoll {
  const rng=mulberry32(seed); const gender=weightedPick(rng,['หญิง','ชาย','อื่น ๆ'] as const,b.genderWeights); const year=currentYear; const province=weightedPick(rng,provinces,b.provinceWeights); const householdType=weightedPick(rng,b.householdTypes,b.householdWeights); const siblings=int(rng,b.siblingCount[0],b.siblingCount[1]); const birthOrder=int(rng,1,siblings+1)
  const era=year<b.nameEraBreaks[0]?'earlier':year<b.nameEraBreaks[1]?'middle':'recent'; const namePools=givenNamesByEra[era]; const usedNames=new Set<string>(); const uniqueGiven=(pool:readonly string[],fallback:readonly string[]=pool)=>{const available=pool.filter(candidate=>!usedNames.has(candidate));const spare=fallback.filter(candidate=>!usedNames.has(candidate));const base=pick(rng,available.length?available:spare.length?spare:pool);let candidate=base;let suffix=2;while(usedNames.has(candidate))candidate=`${base} ${suffix++}`;usedNames.add(candidate);return candidate}; const familyName=pick(rng,surnames); const namePool=namePools[gender==='หญิง'?'female':gender==='ชาย'?'male':'other']; const given=uniqueGiven(namePool, givenNames[gender==='หญิง'?'female':gender==='ชาย'?'male':'other']); const name=`${given} ${familyName}`
  const stat=(key: keyof typeof b.stats) => int(rng,b.stats[key][0],b.stats[key][1])
  const personId=`life-${seed.toString(36)}`
  const people: Relative[]=[relative(`${personId}:mother`,'mother',`${uniqueGiven(namePools.female,givenNames.female)} ${familyName}`,int(rng,b.relativeLife.parentMother[0],b.relativeLife.parentMother[1]),'หญิง',rng),relative(`${personId}:father`,'father',`${uniqueGiven(namePools.male,givenNames.male)} ${familyName}`,int(rng,b.relativeLife.parentFather[0],b.relativeLife.parentFather[1]),'ชาย',rng),relative(`${personId}:grandmother`,'grandmother',`${uniqueGiven(givenNamesByEra.earlier.female,givenNames.female)} ${familyName}`,int(rng,b.relativeLife.grandmother[0],b.relativeLife.grandmother[1]),'หญิง',rng),relative(`${personId}:grandfather`,'grandfather',`${uniqueGiven(givenNamesByEra.earlier.male,givenNames.male)} ${familyName}`,int(rng,b.relativeLife.grandfather[0],b.relativeLife.grandfather[1]),'ชาย',rng),relative(`${personId}:aunt`,'aunt',`${uniqueGiven(namePools.female,givenNames.female)} ${familyName}`,int(rng,b.relativeLife.extendedAge[0],b.relativeLife.extendedAge[1]),'หญิง',rng),relative(`${personId}:uncle`,'uncle',`${uniqueGiven(namePools.male,givenNames.male)} ${familyName}`,int(rng,b.relativeLife.extendedAge[0],b.relativeLife.extendedAge[1]),'ชาย',rng)]
  people.slice(0,4).forEach(r=>r.married=true)
  const siblingGap=int(rng,1,Math.max(1,b.relativeLife.siblingAge[1]))
  for(let i=1;i<=siblings;i++){const order=i>=birthOrder?i+1:i;const age=(birthOrder-order)*siblingGap;const siblingGender=pick(rng,['หญิง','ชาย'] as const);const siblingPool=siblingGender==='หญิง'?namePools.female:namePools.male;const siblingFallback=siblingGender==='หญิง'?givenNames.female:givenNames.male;people.push(relative(`${personId}:sibling-${i}`,'sibling',`${uniqueGiven(siblingPool,siblingFallback)} ${familyName}`,age,siblingGender,rng))}
  const person: Person={id:personId,name,gender,birthYear:year,birthYearBE:year+b.yearOffsetBE,province,householdType,householdLandRai:householdType==='ทำนา'||householdType==='ไร่อ้อย'?int(rng,b.rai[0],b.rai[1]):0,householdMoney:int(rng,b.startingHouseholdMoney[0],b.startingHouseholdMoney[1]),occupation:'',location:province,migrated:false,partnered:false,children:0,remittancesSent:0,birthOrder,siblingCount:siblings,health:stat('health'),wellbeing:stat('wellbeing'),knowledge:stat('knowledge'),relationships:stat('relationships'),careBurden:stat('careBurden'),aptitude:stat('aptitude'),diligence:stat('diligence'),temperament:stat('temperament'),money:int(rng,b.startingMoney[0],b.startingMoney[1]),debt:int(rng,b.startingDebt[0],b.startingDebt[1]),personalDebt:int(rng,b.startingPersonalDebt[0],b.startingPersonalDebt[1]),flags:householdType==='ค้าขายครอบครัวไทยเชื้อสายจีน'?{thaiChinese:true}:{},affinities:Object.fromEntries(people.map(r=>[r.id,int(rng,b.affinityRange[0],b.affinityRange[1])])),relatives:people,stage:'childhood',alive:true}
  const region=regions[provinces.indexOf(province)]!
  return {person,region,reveals:birthRevealLabels.map((label,i)=>({label,value:[gender,`พ.ศ. ${year+b.yearOffsetBE}`,province,`${householdType}${person.householdLandRai?` · ${person.householdLandRai} ไร่`:''}`,`คนที่ ${birthOrder} จาก ${siblings+1} คน`,`${person.health}/100`,`${person.aptitude}/100`,`${person.diligence}/100`,`${person.temperament}/100`,name][i]!}))}
}
export function createLife(seed: number): LifeState {
  return createLifeFromRoll(seed,rollBirth(seed))
}
/** Creates a life from a resolved birth roll; also supports authored scenario fixtures. */
export function createLifeFromRoll(seed: number, roll: BirthRoll): LifeState {
  const p=roll.person
  return {person:p,year:p.birthYear,region:roll.region,seed,rngCounter:0,playedCards:[],currentCardIds:[],metPeople:[],log:[],status:'playing',memorial:''}
}
function random(s: LifeState): () => number { const r=mulberry32((s.seed+s.rngCounter*0x9e3779b9)>>>0); s.rngCounter++; return r }
function setStage(s: LifeState): void { s.person.stage=stageFor(s.year-s.person.birthYear) }
export function eligibleCards(s: LifeState,cards: Card[]=defaultCards): Card[] {
  return cards.filter(c=>(Array.isArray(c.stage)?c.stage.includes(s.person.stage):c.stage===s.person.stage)&&(!c.once||!s.playedCards.includes(c.id))&&evaluateCondition(c.when,s)&&(!c.pinnedYear||c.pinnedYear===s.year))
}
export function cardWeightForState(card: Card,s: LifeState): number {
  return (card.weightMods ?? []).reduce((weight,modifier)=>evaluateCondition(modifier.when,s)?weight*modifier.mult:weight,card.weight)
}
export function beginTurn(s: LifeState,cards: Card[]=defaultCards): void {
  if(s.status!=='playing'||s.currentCardIds.length) return
  const eligible=eligibleCards(s,cards)
  const authored=eligible.filter(card=>!card.fallback&&!card.auto&&card.choices.some(choice=>evaluateCondition(choice.requires,s)))
  let pool=authored.length?authored:eligible.filter(card=>card.fallback)
  if(!pool.length)return
  if(!authored.length&&pool.length>1){
    const previous=s.log.at(-1)?.cardId
    const alternatives=pool.filter(card=>card.id!==previous)
    if(alternatives.length)pool=alternatives
  }
  const rng=random(s)
  const draw=():Card=>{let roll=rng()*pool.reduce((n,c)=>n+cardWeightForState(c,s),0);const index=pool.findIndex(c=>(roll-=cardWeightForState(c,s))<0);return pool.splice(Math.max(0,index),1)[0]!}
  s.currentCardIds=[draw().id]
}
function finish(s: LifeState, cause: DeathCause = 'other', factors: string[] = []): void {
  const p=s.person; p.alive=false;p.deathYear=s.year;p.deathAge=Math.max(0,s.year-p.birthYear);p.deathCause=cause;p.deathFactors=factors.slice(0,3);s.status='dead'
  s.memorial=buildMemorial(p,s.year,s.log)
}
function annual(s: LifeState): void {
  const p=s.person, rng=random(s); s.year++; const age=s.year-p.birthYear; setStage(s)
  p.relatives.forEach(r=>{if(r.alive){r.age++;if(r.age<0)return;if(r.age>b.relativeLife.deathAge || rng()<Math.max(b.annual.relativeDeathBase,(r.age-b.annual.relativeAgeGate)*b.annual.relativeDeathPerYear)) r.alive=false; if(!r.migrated&&age>b.annual.migrationMinAge&&rng()<b.relativeLife.migrationChance)r.migrated=true; if(!r.married&&r.age>=b.relativeLife.marriageAge&&rng()<b.relativeLife.marriageChance)r.married=true}})
  const farmHousehold=p.householdType==='ทำนา'||p.householdType==='ไร่อ้อย'
  p.health=clamp(p.health-b.annual.healthDecay-rng()*b.annual.healthVariation+(farmHousehold&&age<b.annual.harvestAgeLimit?b.annual.farmHealth:0)); p.money=clamp(p.money+rng()*b.annual.moneyRange-b.annual.moneyRange/2); p.householdMoney=clamp(p.householdMoney+b.annual.householdIncome+(p.householdType==='ทำนา'?p.householdLandRai*b.annual.riceIncomePerRai:0)+(p.migrated?b.annual.migrantRemittance:0)); if(p.migrated)p.remittancesSent+=b.annual.migrantRemittance; p.debt=clamp(p.debt*(1+b.annual.debtInterest));p.personalDebt=clamp(p.personalDebt*(1+b.annual.debtInterest))
  const mortality=mortalityDraw(s)
  if(rng()<mortality.probability) finish(s,chooseDeathCause(rng,mortality.causes),mortality.factors)
  if(age===b.childFarmWorkAge&&(p.householdType==='ทำนา'||p.householdType==='ไร่อ้อย'))p.occupation=occupations.farmWork
  if(age>=b.annual.workMinAge&&p.occupation==='')p.occupation=p.householdType
  if(p.flags.migrated&&!p.migrated){p.migrated=true;p.location=b.migrationDestinations.bangkok;p.occupation=occupations.urbanWork}
}
export function advanceYear(s: LifeState,cards: Card[]=defaultCards): void { if(s.status!=='playing'||s.currentCardIds.length)return; annual(s); if(s.status==='playing')beginTurn(s,cards) }
export function applyEffects(s: LifeState,effects: Choice['effects']): void {
  const rng=random(s); const p=s.person
  for(const e of effects){if(e.chance!==undefined&&rng()>=e.chance)continue
    if(e.target==='self'){const k=e.key as keyof Person;if(typeof p[k]==='number') (p[k] as number)=clamp((p[k] as number)+e.delta)}
    else if(e.target==='household'){if(e.key==='money')p.householdMoney=clamp(p.householdMoney+e.delta);if(e.key==='debt')p.debt=clamp(p.debt+e.delta)}
    else if(typeof e.target==='object'){const role=(e.target as {relativeRole:string}).relativeRole;const r=p.relatives.find(x=>x.role===role);if(r&&e.key==='health')r.health=clamp(r.health+e.delta);if(r&&e.key==='relationships')r.relationship=clamp(r.relationship+e.delta)}
  }
}
export function choose(s: LifeState,card: Card,choice: Choice,mode: 'manual'|'auto' = 'manual'): void {
  if(!s.currentCardIds.includes(card.id))throw new Error(ui.gameErrors.inactiveCard)
  if(!evaluateCondition(choice.requires,s))throw new Error(ui.gameErrors.unavailableChoice)
  const modifierEffects=choice.modifiers?.filter(m=>evaluateCondition(m.when,s)).flatMap(m=>m.effects)??[]
  applyEffects(s,[...choice.effects,...modifierEffects]); choice.setFlags?.forEach(flag=>{s.person.flags[flag]=true;if(flag==='migrated'||flag==='migrated-east'){s.person.migrated=true;s.person.location=flag==='migrated-east'?b.migrationDestinations.east:b.migrationDestinations.bangkok;s.person.occupation=occupations.urbanWork}if(flag==='returnedHome'){s.person.migrated=false;s.person.flags.migrated=false;s.person.location=s.person.province;s.person.occupation=occupations.farmWork}if(flag==='partnered')s.person.partnered=true;if(flag==='hasChild')s.person.children++;if(flag==='metUrbanCoworker'||flag==='metThaiChineseShopkeeper')addMetPerson(s,flag)})
  if(mode==='auto')s.person.autoDecisions=(s.person.autoDecisions??0)+1
  else s.person.manualDecisions=(s.person.manualDecisions??0)+1
  s.log.push({year:s.year,title:card.title,text:choice.label,cardId:card.id}); if(card.once&&!s.playedCards.includes(card.id))s.playedCards.push(card.id)
  s.currentCardIds.shift()
}
export function chooseAuto(s: LifeState,card: Card,policy: AutoPolicy = 'neutral'): Choice | undefined {
  const choices=card.choices.filter(choice=>evaluateCondition(choice.requires,s))
  if(!choices.length)return undefined
  let candidates=choices
  if(policy==='preserveMoney'){
    const score=(choice:Choice)=>choice.effects.reduce((sum,effect)=>sum+(effect.key==='money'?effect.delta:effect.key==='debt'||effect.key==='personalDebt'?-effect.delta:0),0)
    const best=Math.max(...choices.map(score));candidates=choices.filter(choice=>score(choice)===best)
  } else if(policy==='prioritizeStudy'){
    const score=(choice:Choice)=>choice.effects.reduce((sum,effect)=>sum+(effect.key==='knowledge'?effect.delta:0),0)
    const best=Math.max(...choices.map(score));candidates=choices.filter(choice=>score(choice)===best)
  } else if(policy==='returnHome'){
    const home=choices.filter(choice=>choice.setFlags?.includes('returnedHome'))
    if(home.length)candidates=home
  }
  const selected=candidates[Math.floor(random(s)()*candidates.length)]!
  choose(s,card,selected,'auto')
  return selected
}
function addMetPerson(s: LifeState, flag: string): void {
  if(s.metPeople.some(person=>person.id.endsWith(flag)))return
  const person=rollBirth((s.seed^flag.length^s.year)>>>0).person
  person.id=`${s.person.id}:met:${flag}`
  person.householdType=flag==='metThaiChineseShopkeeper'?'ค้าขายครอบครัวไทยเชื้อสายจีน':'แรงงานในเมือง'
  person.flags={...person.flags,thaiChinese:flag==='metThaiChineseShopkeeper'}
  person.occupation=flag==='metThaiChineseShopkeeper'?'ค้าขายเล็ก ๆ':occupations.urbanWork
  s.metPeople.push(person)
}
export function resolveAutoCard(s:LifeState,card:Card):void {
  if(!card.auto||card.choices.length||!s.currentCardIds.includes(card.id))throw new Error(ui.gameErrors.notAuto)
  if(card.effects)applyEffects(s,card.effects)
  s.log.push({year:s.year,title:card.title,text:card.body,cardId:card.id})
  if(card.once&&!s.playedCards.includes(card.id))s.playedCards.push(card.id)
  s.currentCardIds.shift()
}
export function simulateLife(seed:number,cards:Card[]=defaultCards,options:{decisionMode?:'manual'|'auto';autoPolicy?:AutoPolicy}={}):LifeState {
  const s=createLife(seed); let guard=0
  while(s.status==='playing'&&guard++<b.maxAge.value+1){beginTurn(s,cards);if(s.currentCardIds.length){const c=cards.find(x=>x.id===s.currentCardIds[0])!;const ch=c.choices.find(x=>evaluateCondition(x.requires,s))??c.choices[0];if(c.auto)resolveAutoCard(s,c);else if(options.decisionMode==='auto')chooseAuto(s,c,options.autoPolicy);else if(ch)choose(s,c,ch)}advanceYear(s,cards)}
  if(s.status==='playing')finish(s)
  return s
}
