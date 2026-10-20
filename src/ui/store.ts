import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { cards, occupations } from '../content'
import { createLife, rollBirth, beginTurn, advanceYear, choose, resolveAutoCard, stageFor } from '../engine/game'
import { world } from '../world/service'
import { WORLD_IDENTITY } from '../content/world'
import type { BirthRoll, LifeState } from '../engine/types'

const SAVE='chiwit-save-v2', COLLECTION='chiwit-collection-v1'
export const useGameStore=defineStore('life',()=>{
  const game=ref<LifeState|null>(null), screen=ref<'home'|'reveal'|'life'|'memorial'|'collection'>('home'), roll=ref<BirthRoll|null>(null), revealIndex=ref(0), collection=ref<LifeState['person'][]>([]), candleCount=ref(0), worldPulse=ref(0)
  const person=computed(()=>game.value?.person??null), card=computed(()=>game.value?cards.find(c=>c.id===game.value!.currentCardIds[0]):undefined), counters=computed(()=>{void worldPulse.value;return world.getLiveCounts()}), recentBirth=computed(()=>{void worldPulse.value;return world.getRecentBirths('')[0]}), cohort=computed(()=>person.value?world.getCohort(person.value.birthYear):[])
  window.setInterval(()=>worldPulse.value++,15000)
  try { collection.value=JSON.parse(localStorage.getItem(COLLECTION)??'[]') as LifeState['person'][];candleCount.value=Number(localStorage.getItem('chiwit-candles')??0) } catch { collection.value=[] }
  function remember(p:LifeState['person']) { if(!collection.value.some(x=>x.id===p.id))collection.value.push(p);for(const r of p.relatives)if(!collection.value.some(x=>x.id===r.id))collection.value.push({ ...p,id:r.id,name:r.name,gender:r.gender,health:r.health,relationships:r.relationship,alive:r.alive,birthYear:p.birthYear-r.age,occupation:r.migrated?occupations.migrantRelative:p.householdType,stage:stageFor(r.age) }) }
  function newLife(seed=Math.floor(Math.random()*0xffffffff)) { roll.value=rollBirth(seed);game.value=null;localStorage.removeItem(SAVE);revealIndex.value=0;screen.value='reveal' }
  function nextReveal() { if(!roll.value)return;revealIndex.value++;if(revealIndex.value>=roll.value.reveals.length){game.value=createLife(Number.parseInt(roll.value.person.id.split('-')[1]!,36));remember(roll.value.person);beginTurn(game.value,cards);screen.value='life'} }
  function pick(choiceId:string) { if(!game.value||!card.value)return;const choice=card.value.choices.find(c=>c.id===choiceId);if(choice)choose(game.value,card.value,choice) }
  function continueAuto() { if(game.value&&card.value?.auto)resolveAutoCard(game.value,card.value) }
  function nextYear() { if(!game.value)return;advanceYear(game.value,cards);if(game.value.status==='dead'){remember(game.value.person);world.publishLife(game.value.memorial);screen.value='memorial'} }
  function lightCandle() { candleCount.value++;localStorage.setItem('chiwit-candles',String(candleCount.value)) }
  function resume() { try { const parsed=JSON.parse(localStorage.getItem(SAVE)??'null') as LifeState|null;if(parsed){game.value=parsed;screen.value=parsed.status==='dead'?'memorial':'life';return true} } catch { return false } return false }
  watch(game,v=>{if(v)localStorage.setItem(SAVE,JSON.stringify(v))},{deep:true});watch(collection,v=>localStorage.setItem(COLLECTION,JSON.stringify(v)),{deep:true})
  resume()
  return {game,screen,roll,revealIndex,collection,candleCount,person,card,counters,recentBirth,cohort,worldLabel:WORLD_IDENTITY.label,worldDescription:WORLD_IDENTITY.description,newLife,nextReveal,pick,continueAuto,nextYear,lightCandle,resume}
})
