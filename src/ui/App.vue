<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from './store'
import { ui } from '../content/ui'
import { balance } from '../content/balance'
import Portrait from './portraits/Portrait.vue'
import HomeWorldCounters from './HomeWorldCounters.vue'
import { evaluateCondition } from '../engine/conditions'
import type { RelativeRole } from '../engine/types'

const store = useGameStore()
const { game, screen, roll, revealIndex, collection, person, card, counters, recentBirth, candleCount, worldLabel, worldDescription, cohort } = storeToRefs(store)
const revealed = computed(() => roll.value?.reveals.slice(0, revealIndex.value + 1) ?? [])
const finalReveal = computed(() => Boolean(roll.value && revealIndex.value === roll.value.reveals.length - 1))
const age = computed(() => game.value && person.value ? game.value.year - person.value.birthYear : 0)
const currentChoices = computed(() => game.value && card.value ? card.value.choices.filter(choice => evaluateCondition(choice.requires, game.value!)) : [])
const choiceEffects = (choice: (typeof currentChoices.value)[number]) => {
  if (!game.value) return []
  const base = choice.effects.map(effect => ({ effect, context: '' }))
  const contextual = (choice.modifiers ?? []).filter(modifier => evaluateCondition(modifier.when, game.value!)).flatMap(modifier => modifier.effects.map(effect => ({ effect, context: modifier.narration })))
  return [...base, ...contextual].map(({ effect, context }) => {
    const key = ui.effects[effect.key as keyof typeof ui.effects] ?? effect.key
    const target = effect.target === 'self' ? ui.effectTargets.self : effect.target === 'household' ? ui.effectTargets.household : ui.relativeRoles[effect.target.relativeRole as RelativeRole] ?? effect.target.relativeRole
    return `${context ? `${context} · ` : ''}${target}: ${key} ${effect.delta > 0 ? '+' : ''}${effect.delta}`
  })
}
const yearResolved = computed(() => Boolean(game.value?.log.some(event => event.year === game.value?.year)))
const buddhistYear = (year: number | undefined) => year === undefined ? '' : year + balance.yearOffsetBE
const rarity = (i: number) => i % 23 === 0 ? ui.special : i % 7 === 0 ? ui.rare : ui.common
const roleLabel = (role: RelativeRole) => ui.relativeRoles[role]
</script>

<template>
  <main class="shell">
    <header class="masthead">
      <button class="brand" @click="screen = 'home'"><span class="mark">ช</span><span><small>{{ ui.subtitle }}</small><strong>{{ ui.title }}</strong></span></button>
      <nav><button @click="screen = 'home'">{{ ui.home }}</button><button @click="screen = 'collection'">{{ ui.collection }}</button></nav>
      <span v-if="game" class="saved">{{ ui.save }}</span>
    </header>

    <section v-if="screen === 'home'" class="home-grid">
      <article class="hero panel">
        <p class="eyebrow">{{ ui.homeEyebrow }}</p><h1>{{ ui.title }}</h1><p class="intro">{{ ui.pitch }}</p>
        <button class="primary" @click="store.newLife()">{{ ui.born }}</button>
        <button v-if="game" class="secondary" @click="screen = game.status === 'dead' ? 'memorial' : 'life'">{{ ui.resume }}</button>
      </article>
      <HomeWorldCounters :lives="counters.lives" :births-today="counters.birthsToday" :recent-province="recentBirth?.province" />
      <p class="footnote">{{ ui.accessPlaceholder }}</p>
    </section>

    <section v-else-if="screen === 'reveal' && roll" class="reveal panel">
      <p class="eyebrow">{{ ui.reveal }} · {{ revealIndex + 1 }}/{{ roll.reveals.length }}</p>
      <div class="reveal-person"><Portrait v-if="finalReveal" :person="roll.person" :size="150" /><div v-else class="portrait-placeholder">?</div><div><h1>{{ finalReveal ? roll.person.name : ui.newborn }}</h1><p>{{ revealIndex >= 2 ? roll.person.province : ui.birthPlaceUnknown }}</p></div></div>
      <div class="reveals"><p v-for="item in revealed" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></p></div>
      <button class="primary" @click="store.nextReveal()">{{ revealIndex + 1 === roll.reveals.length ? ui.startLife : ui.nextReveal }}</button>
    </section>

    <section v-else-if="screen === 'life' && game && person" class="life-screen">
      <div class="yearbar"><span class="stage-pill">{{ ui.stage[person.stage] }}</span><strong>{{ ui.year }} {{ buddhistYear(game.year) }}</strong><span class="place">{{ person.province }}</span></div>
      <div class="life-layout">
        <aside class="sidebar">
          <section class="panel profile">
            <Portrait :person="person" :size="176" /><h2>{{ person.name }}</h2><p>{{ age }} {{ ui.yearsOld }} · {{ person.occupation || person.householdType }}</p><p>{{ ui.place }}: {{ person.location }} · {{ ui.partnerStatus }}: {{ person.partnered ? ui.married : ui.notMarried }} · {{ ui.childCount }} {{ person.children }}</p>
            <dl><template v-for="(label, key) in ui.stats" :key="key"><dt>{{ label }}</dt><dd><span class="meter"><i :style="{ width: `${person[key]}%` }" /></span><b>{{ Math.round(person[key]) }}</b></dd></template></dl>
          </section>
          <section class="panel household">
            <h2>{{ ui.family }}</h2><p>{{ person.householdType }}<span v-if="person.householdLandRai"> · {{ person.householdLandRai }} {{ ui.rai }}</span></p>
            <div class="economy"><span>{{ ui.householdMoney }} <b>{{ Math.round(person.householdMoney) }}</b></span><span>{{ ui.personalMoney }} <b>{{ Math.round(person.money) }}</b></span><span>{{ ui.householdDebt }} <b>{{ Math.round(person.debt) }}</b></span><span>{{ ui.personalDebt }} <b>{{ Math.round(person.personalDebt) }}</b></span><span>{{ ui.remittances }} <b>{{ Math.round(person.remittancesSent) }}</b></span></div>
            <h3>{{ ui.relatives }}</h3>
            <ul><li v-for="relative in person.relatives" :key="relative.id"><span :class="{ dead: !relative.alive }">{{ roleLabel(relative.role) }} · {{ relative.name }}</span><small>{{ relative.alive ? `${relative.age} ${ui.yearsOld}${relative.migrated ? ` · ${ui.relativeMigrated}` : ''} · ${relative.married ? ui.married : ui.notMarried}` : ui.relativeDead }}</small></li></ul>
          </section>
        </aside>
        <div class="story-column">
          <article v-if="card" class="story panel"><p class="eyebrow">{{ ui.year }} {{ buddhistYear(game.year) }} · {{ ui.stage[person.stage] }}</p><h2>{{ card.title }}</h2><p v-if="game.year > balance.yearMax" class="projected">{{ ui.projectedNotice }}</p><p>{{ card.body }}</p><div v-if="card.auto" class="choices"><button @click="store.continueAuto()"><span>{{ ui.continue }}</span><span>→</span></button></div><div v-else class="choices"><button v-for="choice in currentChoices" :key="choice.id" @click="store.pick(choice.id)"><span>{{ choice.label }}<small v-for="(effect, i) in choiceEffects(choice)" :key="i" class="choice-effect">{{ effect }}</small></span><span>↗</span></button></div></article>
          <article v-else class="story quiet panel"><p>{{ yearResolved ? ui.yearResolved : ui.quiet }}</p><button class="primary" @click="store.nextYear()">{{ ui.continue }}</button></article>
          <section class="panel log"><h2>{{ ui.timeline }}</h2><p v-if="!game.log.length" class="empty">{{ ui.noTimeline }}</p><ol><li v-for="(event, i) in [...game.log].reverse().slice(0, 16)" :key="i"><time>{{ buddhistYear(event.year) }}</time><span><b>{{ event.title }}</b>{{ event.text }}</span></li></ol></section>
          <div class="world-strip"><span class="world-dot" /><strong>{{ worldLabel }}</strong><span>{{ counters.lives }} {{ ui.worldLives }}</span><small class="world-strip-description">{{ worldDescription }}</small><small>{{ recentBirth?.name }} {{ ui.recently }}{{ recentBirth?.province }}</small></div>
        </div>
      </div>
    </section>

    <section v-else-if="screen === 'memorial' && game && person" class="memorial panel">
      <p class="eyebrow">{{ ui.death }}</p><div class="memorial-art"><svg class="landscape" viewBox="0 0 180 90" preserveAspectRatio="none" shape-rendering="crispEdges"><rect width="180" height="90" fill="#e7eee3" /><rect x="130" y="12" width="18" height="18" fill="#e8c98d" /><rect x="136" y="6" width="6" height="6" fill="#e8c98d" /><rect x="124" y="18" width="6" height="6" fill="#e8c98d" /><rect x="28" y="34" width="24" height="8" fill="#c7d6c0" /><rect x="18" y="42" width="48" height="8" fill="#c7d6c0" /><rect y="53" width="180" height="37" fill="#9eaf8b" /><rect y="63" width="180" height="27" fill="#829970" /><rect x="8" y="59" width="34" height="3" fill="#d0d7a5" /><rect x="49" y="68" width="43" height="3" fill="#d0d7a5" /><rect x="102" y="59" width="54" height="3" fill="#d0d7a5" /><rect x="118" y="78" width="62" height="3" fill="#d0d7a5" /><rect x="0" y="84" width="180" height="6" fill="#718763" /></svg><Portrait :person="person" :size="200" /></div>
      <h1>{{ person.name }}</h1><p class="dates">{{ ui.year }} {{ buddhistYear(person.birthYear) }} — {{ buddhistYear(person.deathYear) }} · {{ person.province }}</p><p class="memorial-copy">{{ game.memorial }}</p>
      <section v-if="cohort.length" class="cohort"><h2>{{ ui.cohortTitle }}</h2><article v-for="life in cohort" :key="life.person.id" class="cohort-row"><Portrait :person="life.person" :size="72" /><span><b>{{ life.person.name }}</b><small>{{ ui.year }} {{ buddhistYear(life.person.birthYear) }} — {{ buddhistYear(life.person.deathYear) }}</small><small>{{ life.memorial }}</small></span></article></section>
      <button class="candle" @click="store.lightCandle()">🕯 {{ ui.candle }}</button><p class="muted">{{ ui.candles }}: {{ candleCount }}</p><button class="primary" @click="store.newLife()">{{ ui.newLife }}</button>
    </section>

    <section v-else-if="screen === 'collection'" class="collection-page">
      <div class="collection-head"><div><p class="eyebrow">{{ ui.collectionEyebrow }}</p><h1>{{ ui.collectionTitle }}</h1><p>{{ ui.collectionIntro }}</p></div><span>{{ collection.length }} {{ ui.peopleSuffix }}</span></div>
      <div class="collection-grid"><article v-for="(item, i) in collection" :key="item.id" class="person-card panel"><Portrait :person="item" :size="126" /><div><span class="rarity">{{ rarity(i) }}</span><h2>{{ item.name }}</h2><p>{{ item.province }} · {{ ui.stage[item.stage] }}</p></div></article><template v-if="collection.length < balance.collection.maxEntries"><article v-for="i in balance.collection.lockedSlots" :key="`locked-${i}`" class="person-card locked panel"><div class="silhouette">?</div><div><span class="rarity">{{ ui.locked }}</span><h2>{{ ui.locked }}</h2><p>{{ ui.unlockHint }}</p></div></article></template></div>
    </section>
    <footer><span>{{ ui.footer }}</span><span>{{ worldDescription }}</span></footer>
  </main>
</template>
