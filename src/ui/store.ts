import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { cards, occupations } from '../content'
import { balance } from '../content/balance'
import { createLifeFromRoll, rollBirth, beginTurn, advanceYear, choose, resolveAutoCard, stageFor } from '../engine/game'
import { world } from '../world/service'
import { WORLD_IDENTITY } from '../content/world'
import type { BirthRoll, LifeState } from '../engine/types'

const SAVE='chiwit-save-v2', BIRTH_SAVE='chiwit-pending-birth-v1', COLLECTION='chiwit-collection-v1'
export const useGameStore=defineStore('life',()=>{
  const game=ref<LifeState|null>(null), screen=ref<'home'|'birthplace'|'reveal'|'life'|'memorial'|'collection'>('home'), roll=ref<BirthRoll|null>(null), collection=ref<LifeState['person'][]>([]), candleCount=ref(0), worldPulse=ref(0)
  const person=computed(()=>game.value?.person??null), card=computed(()=>game.value?cards.find(c=>c.id===game.value!.currentCardIds[0]):undefined), counters=computed(()=>{void worldPulse.value;return world.getLiveCounts()}), recentBirth=computed(()=>{void worldPulse.value;return world.getRecentBirths('')[0]}), cohort=computed(()=>person.value?world.getCohort(person.value.birthYear):[])
  window.setInterval(()=>worldPulse.value++,15000)
  try { collection.value=JSON.parse(localStorage.getItem(COLLECTION)??'[]') as LifeState['person'][];candleCount.value=Number(localStorage.getItem('chiwit-candles')??0);const savedBirth=localStorage.getItem(BIRTH_SAVE);if(savedBirth){roll.value=JSON.parse(savedBirth) as BirthRoll;roll.value.person.birthYearBE??=roll.value.person.birthYear+balance.yearOffsetBE;screen.value='birthplace'} } catch { collection.value=[] }
  function remember(p:LifeState['person']) { if(!collection.value.some(x=>x.id===p.id))collection.value.push(p);for(const r of p.relatives)if(!collection.value.some(x=>x.id===r.id))collection.value.push({ ...p,id:r.id,name:r.name,gender:r.gender,health:r.health,relationships:r.relationship,alive:r.alive,birthYear:p.birthYear-r.age,birthYearBE:p.birthYearBE-r.age,occupation:r.migrated?occupations.migrantRelative:p.householdType,stage:stageFor(r.age) }) }
  function newLife(seed=Math.floor(Math.random()*0xffffffff)) { roll.value=rollBirth(seed);localStorage.setItem(BIRTH_SAVE,JSON.stringify(roll.value));game.value=null;localStorage.removeItem(SAVE);screen.value='birthplace' }
  function finishBirthplaceRoll() { if(roll.value&&screen.value==='birthplace')screen.value='reveal' }
  function startLife() { if(!roll.value)return;const bornRoll=roll.value;game.value=createLifeFromRoll(Number.parseInt(bornRoll.person.id.split('-')[1]!,36),bornRoll);localStorage.removeItem(BIRTH_SAVE);remember(bornRoll.person);beginTurn(game.value,cards);screen.value='life' }
  function pick(choiceId:string) { if(!game.value||!card.value)return;const choice=card.value.choices.find(c=>c.id===choiceId);if(choice){choose(game.value,card.value,choice);for(const met of game.value.metPeople)if(!collection.value.some(person=>person.id===met.id))collection.value.push(met)} }
  function continueAuto() { if(game.value&&card.value?.auto)resolveAutoCard(game.value,card.value) }
  function nextYear() { if(!game.value)return;advanceYear(game.value,cards);if(game.value.status==='dead'){remember(game.value.person);world.publishLife(game.value.memorial);screen.value='memorial'} }
  function lightCandle() { candleCount.value++;localStorage.setItem('chiwit-candles',String(candleCount.value)) }
  function resume() { try { const parsed=JSON.parse(localStorage.getItem(SAVE)??'null') as LifeState|null;if(parsed){parsed.person.remittancesSent??=0;parsed.person.birthYearBE??=parsed.person.birthYear+balance.yearOffsetBE;parsed.metPeople??=[];game.value=parsed;screen.value=parsed.status==='dead'?'memorial':'life';return true} } catch { return false } return false }
  watch(game,v=>{if(v)localStorage.setItem(SAVE,JSON.stringify(v))},{deep:true});watch(collection,v=>localStorage.setItem(COLLECTION,JSON.stringify(v)),{deep:true})
  resume()
  return {game,screen,roll,collection,candleCount,person,card,counters,recentBirth,cohort,worldLabel:WORLD_IDENTITY.label,worldDescription:WORLD_IDENTITY.description,newLife,finishBirthplaceRoll,startLife,pick,continueAuto,nextYear,lightCandle,resume}
})
