import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { cards, occupations } from '../content'
import { balance } from '../content/balance'
import { createLifeFromRoll, rollBirth, advanceYear, choose, chooseAuto, resolveAutoCard, stageFor } from '../engine/game'
import { normalizeDeathRecord } from '../engine/mortality'
import { world } from '../world/service'
import { WORLD_IDENTITY } from '../content/world'
import type { AutoPolicy, BirthRoll, LifeState } from '../engine/types'

const SAVE='chiwit-save-v2', BIRTH_SAVE='chiwit-pending-birth-v1', COLLECTION='chiwit-collection-v1'
export const useGameStore=defineStore('life',()=>{
  const game=ref<LifeState|null>(null), screen=ref<'home'|'birthplace'|'reveal'|'life'|'memorial'|'collection'|'sprites'>('home'), roll=ref<BirthRoll|null>(null), collection=ref<LifeState['person'][]>([]), candleCount=ref(0), worldPulse=ref(0), yearDurationSeconds=ref(30), yearProgress=ref(0), yearRemainingMs=ref(30_000), playbackRunning=ref(false), autoPolicy=ref<AutoPolicy>('neutral')
  const person=computed(()=>game.value?.person??null), card=computed(()=>game.value?cards.find(c=>c.id===game.value!.currentCardIds[0]):undefined), counters=computed(()=>{void worldPulse.value;return world.getLiveCounts()}), recentBirth=computed(()=>{void worldPulse.value;return world.getRecentBirths('')[0]}), cohort=computed(()=>person.value?world.getCohort(person.value.birthYear):[])
  window.setInterval(()=>worldPulse.value++,15000)
  try { collection.value=JSON.parse(localStorage.getItem(COLLECTION)??'[]') as LifeState['person'][];candleCount.value=Number(localStorage.getItem('chiwit-candles')??0);const savedBirth=localStorage.getItem(BIRTH_SAVE);if(savedBirth){roll.value=JSON.parse(savedBirth) as BirthRoll;roll.value.person.birthYearBE??=roll.value.person.birthYear+balance.yearOffsetBE;screen.value='birthplace'} } catch { collection.value=[] }
  function remember(p:LifeState['person']) { if(!collection.value.some(x=>x.id===p.id))collection.value.push(p);for(const r of p.relatives)if(r.age>=0&&!collection.value.some(x=>x.id===r.id))collection.value.push({ ...p,id:r.id,name:r.name,gender:r.gender,health:r.health,relationships:r.relationship,alive:r.alive,birthYear:p.birthYear-r.age,birthYearBE:p.birthYearBE-r.age,occupation:r.migrated?occupations.migrantRelative:p.householdType,stage:stageFor(r.age) }) }
  function newLife(seed=Math.floor(Math.random()*0xffffffff)) { roll.value=rollBirth(seed);localStorage.setItem(BIRTH_SAVE,JSON.stringify(roll.value));game.value=null;localStorage.removeItem(SAVE);screen.value='birthplace' }
  function finishBirthplaceRoll() { if(roll.value&&screen.value==='birthplace')screen.value='reveal' }
  function startLife() { if(!roll.value)return;const bornRoll=roll.value;game.value=createLifeFromRoll(Number.parseInt(bornRoll.person.id.split('-')[1]!,36),bornRoll);localStorage.removeItem(BIRTH_SAVE);remember(bornRoll.person);screen.value='life';playbackRunning.value=true;startYearClock(true) }
  function pick(choiceId:string) { if(!game.value||!card.value)return;const choice=card.value.choices.find(c=>c.id===choiceId);if(choice){choose(game.value,card.value,choice);for(const met of game.value.metPeople)if(!collection.value.some(person=>person.id===met.id))collection.value.push(met)} }
  function continueAuto() { if(game.value&&card.value?.auto)resolveAutoCard(game.value,card.value) }
  let yearTimer:number|undefined, progressTimer:number|undefined, yearStartedAt=0, elapsedBeforePause=0
  const yearDurationMs=()=>yearDurationSeconds.value*1000
  function clearYearTimers() {
    if(yearTimer!==undefined){window.clearTimeout(yearTimer);yearTimer=undefined}
    if(progressTimer!==undefined){window.clearInterval(progressTimer);progressTimer=undefined}
  }
  function updateYearClock() {
    if(!playbackRunning.value)return
    const elapsed=Math.min(yearDurationMs(),Math.max(0,Date.now()-yearStartedAt))
    yearProgress.value=elapsed/yearDurationMs()
    yearRemainingMs.value=Math.max(0,yearDurationMs()-elapsed)
  }
  function finishLife() {
    if(!game.value)return
    clearYearTimers()
    if(game.value.currentCardIds.length){
      let guard=0
      while(game.value.currentCardIds.length&&guard++<cards.length){
        const current=cards.find(item=>item.id===game.value!.currentCardIds[0])
        if(!current)break
        if(current.auto)resolveAutoCard(game.value,current)
        else if(!chooseAuto(game.value,current,autoPolicy.value)){
          game.value.currentCardIds.shift()
          if(current.once&&!game.value.playedCards.includes(current.id))game.value.playedCards.push(current.id)
          game.value.log.push({year:game.value.year,title:current.title,text:'เหตุการณ์นี้ไม่มีตัวเลือกที่ใช้ได้ในสถานการณ์นี้ จึงผ่านไปโดยไม่มีการตัดสินใจ',cardId:current.id})
        }
      }
      if(game.value.currentCardIds.length){
        playbackRunning.value=false
        return
      }
    }
    advanceYear(game.value,cards)
    if(game.value.status==='dead'){
      normalizeDeathRecord(game.value.person,game.value.person.deathYear??game.value.year)
      remember(game.value.person)
      world.publishLife(game.value.memorial)
      screen.value='memorial'
      pausePlayback()
      return
    }
    yearProgress.value=0
    elapsedBeforePause=0
    yearStartedAt=Date.now()
    yearRemainingMs.value=yearDurationMs()
    scheduleYearEnd()
  }
  function scheduleYearEnd() {
    clearYearTimers()
    if(!playbackRunning.value)return
    updateYearClock()
    yearTimer=window.setTimeout(()=>{yearTimer=undefined;updateYearClock();finishLife()},yearRemainingMs.value)
    progressTimer=window.setInterval(updateYearClock,100)
  }
  function startYearClock(reset:boolean) {
    if(!game.value||game.value.status!=='playing'||screen.value!=='life')return
    if(reset){elapsedBeforePause=0;yearProgress.value=0;yearRemainingMs.value=yearDurationMs()}
    yearStartedAt=Date.now()-elapsedBeforePause
    playbackRunning.value=true
    scheduleYearEnd()
  }
  function setYearDuration(seconds:number) {
    if(![15,30,60].includes(seconds))return
    updateYearClock()
    const progress=yearProgress.value
    yearDurationSeconds.value=seconds
    elapsedBeforePause=progress*yearDurationMs()
    yearRemainingMs.value=yearDurationMs()-elapsedBeforePause
    startYearClock(false)
  }
  function setAutoPolicy(policy:AutoPolicy) { autoPolicy.value=policy }
  function pausePlayback() {
    if(playbackRunning.value){updateYearClock();elapsedBeforePause=yearDurationMs()-yearRemainingMs.value}
    clearYearTimers();playbackRunning.value=false
  }
  watch(screen,value=>{if(value!=='life')pausePlayback();else if(game.value?.status==='playing')startYearClock(false)})
  function lightCandle() { candleCount.value++;localStorage.setItem('chiwit-candles',String(candleCount.value)) }
  function resume() { try { const parsed=JSON.parse(localStorage.getItem(SAVE)??'null') as LifeState|null;if(parsed){parsed.person.remittancesSent??=0;parsed.person.birthYearBE??=parsed.person.birthYear+balance.yearOffsetBE;parsed.metPeople??=[];if(parsed.year===parsed.person.birthYear)parsed.currentCardIds=[];if(parsed.status==='dead')normalizeDeathRecord(parsed.person,parsed.year);game.value=parsed;screen.value=parsed.status==='dead'?'memorial':'life';return true} } catch { return false } return false }
  watch(game,v=>{if(v)localStorage.setItem(SAVE,JSON.stringify(v))},{deep:true});watch(collection,v=>localStorage.setItem(COLLECTION,JSON.stringify(v)),{deep:true})
  resume()
  if(game.value?.status==='playing'&&screen.value==='life')startYearClock(true)
  return {game,screen,roll,collection,candleCount,person,card,counters,recentBirth,cohort,worldLabel:WORLD_IDENTITY.label,worldDescription:WORLD_IDENTITY.description,yearDurationSeconds,yearProgress,yearRemainingMs,playbackRunning,autoPolicy,newLife,finishBirthplaceRoll,startLife,pick,continueAuto,setYearDuration,setAutoPolicy,pausePlayback,lightCandle,resume}
})
