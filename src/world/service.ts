import { advanceYear, beginTurn, choose, createLife, resolveAutoCard, simulateLife } from '../engine/game'
import { cards } from '../content'
import { mulberry32 } from '../engine/rng'
import type { LifeState } from '../engine/types'
import { balance } from '../content/balance'

export interface WorldService {
  getLiveCounts(): { lives: number; birthsToday: number }
  getRecentBirths(region: string): Array<{ name: string; province: string; year: number }>
  getCohort(birthWindow: number): LifeState[]
  publishLife(summary: string): void
}
export class SimulatedWorld implements WorldService {
  private seed: number
  private lives: LifeState[]
  private cohortLives: LifeState[]
  private memorials: string[] = []
  private worldYear=new Date().getFullYear()
  private lastTick=Math.floor(Date.now()/balance.world.liveCountWindowMs)
  private lastBirthWindow=-1
  private latestBirth:{name:string;province:string;year:number}|null=null
  constructor(seed: number = balance.world.seed, count: number = balance.world.sampleLives) {
    this.seed=seed
    this.cohortLives=Array.from({length:count},(_,i)=>simulateLife(seed+i*7919))
    this.lives=Array.from({length:count},(_,i)=>{
      const state=createLife(seed+i*104729+17011)
      let guard=0
      while(state.status==='playing'&&state.year<this.worldYear&&guard++<balance.maxAge){
        beginTurn(state,cards)
        if(state.currentCardIds[0]){const card=cards.find(item=>item.id===state.currentCardIds[0]);const choice=card?.choices[0];if(card?.auto)resolveAutoCard(state,card);else if(card&&choice)choose(state,card,choice)}
        advanceYear(state,cards)
      }
      return state
    })
  }
  private advanceWorld():void {
    const tick=Math.floor(Date.now()/balance.world.liveCountWindowMs)
    const steps=Math.min(balance.world.maxCatchupSteps,Math.max(0,tick-this.lastTick))
    for(let step=0;step<steps;step++){
      this.worldYear++
      for(const state of this.lives){
        if(state.status==='dead')continue
        while(state.currentCardIds.length){const card=cards.find(item=>item.id===state.currentCardIds[0]);if(!card)break;const choice=card.choices[0];if(card.auto)resolveAutoCard(state,card);else if(choice)choose(state,card,choice);else break}
        advanceYear(state,cards)
        if(state.person.deathYear!==undefined&&!this.cohortLives.some(life=>life.person.id===state.person.id))this.cohortLives.push(state)
      }
    }
    this.lastTick=tick
  }
  getLiveCounts() { this.advanceWorld();const rng=mulberry32(this.seed+Math.floor(Date.now()/balance.world.liveCountWindowMs)); return {lives:this.lives.filter(x=>x.status==='playing').length,birthsToday:intNoise(rng,balance.world.birthsLow,balance.world.birthsHigh)} }
  getRecentBirths(region:string) {
    const window=Math.floor(Date.now()/balance.world.birthWindowMs)
    if(window!==this.lastBirthWindow){
      const seed=this.seed+window;const state=createLife(seed);state.person.birthYear=this.worldYear;state.person.birthYearBE=this.worldYear+balance.yearOffsetBE;state.year=this.worldYear;state.region.name=region||state.person.province;state.person.province=state.region.name
      this.lives.push(state);if(this.lives.length>balance.world.populationLimit)this.lives=this.lives.filter(life=>life.status==='playing').concat(this.lives.filter(life=>life.status==='dead').slice(-balance.world.sampleLives))
      this.latestBirth={name:state.person.name,province:state.person.province,year:this.worldYear};this.lastBirthWindow=window
    }
    return this.latestBirth?[this.latestBirth]:[]
  }
  getCohort(birthWindow:number) { return this.cohortLives.filter(x=>Math.floor(x.person.birthYear/5)===Math.floor(birthWindow/5)).slice(0,8) }
  publishLife(summary:string) { this.memorials.unshift(summary); this.memorials=this.memorials.slice(0,50) }
}
function intNoise(rng:()=>number,min:number,max:number){return min+Math.floor(rng()*(max-min+1))}
export const world: WorldService = new SimulatedWorld()
