<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from './store'
import { ui } from '../content/ui'
import { balance } from '../content/balance'
import { annualVignette } from '../content/annualVignette'
import Portrait from './portraits/Portrait.vue'
import HomeWorldCounters from './HomeWorldCounters.vue'
import HomeDecor from './HomeDecor.vue'
import IsanMap from './IsanMap.vue'
import BirthProfile from './BirthProfile.vue'
import BirthplaceRoll from './BirthplaceRoll.vue'
import { evaluateCondition } from '../engine/conditions'
import type { RelativeRole } from '../engine/types'
import { bindScreenNavigation } from './navigation'
import { occupationLabel } from './profile'
import SpriteGallery from './portraits/SpriteGallery.vue'
import { displayStageForAge } from './portraits/portrait'
import './collection-theme.css'

const store = useGameStore()
const { game, screen, roll, collection, deathRecords, person, card, counters, recentBirth, candleCount, worldLabel, worldDescription, cohort, playbackSpeed, playbackRunning, autoMode, autoPolicy } = storeToRefs(store)
const unbindNavigation = bindScreenNavigation(screen, target => {
  if (target === 'birthplace') return Boolean(roll.value)
  if (target === 'reveal') return Boolean(roll.value)
  if (target === 'life') return Boolean(game.value && game.value.status !== 'dead')
  if (target === 'memorial') return Boolean(game.value?.status === 'dead')
  return true
})
onUnmounted(unbindNavigation)
const age = computed(() => game.value && person.value ? game.value.year - person.value.birthYear : 0)
const playbackSpeeds = [1, 2, 4, 8, 12, 16]
const profileOccupation = computed(() => person.value ? occupationLabel(age.value, person.value.occupation, person.value.householdType, balance.annual.workMinAge, ui.notYetWorking) : '')
const displayStage = computed(() => person.value ? ui.stage[displayStageForAge(age.value)] : '')
const memorialAge = computed(() => person.value && game.value ? person.value.deathAge ?? game.value.year - person.value.birthYear : 0)
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
const mortalityFilter = ref<'manual'|'auto'|'mixed'|'all'>('manual')
const mortalityLives = computed(() => deathRecords.value.filter(life => {
  const total = (life.manualDecisions ?? 0) + (life.autoDecisions ?? 0)
  const manualShare = total === 0 ? 1 : (life.manualDecisions ?? 0) / total
  if (mortalityFilter.value === 'manual') return manualShare >= 0.5
  if (mortalityFilter.value === 'auto') return manualShare < 0.5
  if (mortalityFilter.value === 'mixed') return (life.manualDecisions ?? 0) > 0 && (life.autoDecisions ?? 0) > 0
  return true
}))
const causeStats = computed(() => {
  const counts = new Map<string, { count: number; ageTotal: number }>()
  for (const life of mortalityLives.value) {
    const cause = life.deathCause ?? 'unknown'
    const current = counts.get(cause) ?? { count: 0, ageTotal: 0 }
    current.count += 1
    current.ageTotal += life.deathAge ?? 0
    counts.set(cause, current)
  }
  return [...counts.entries()].map(([cause, value]) => ({ cause, ...value, averageAge: value.count ? Math.round(value.ageTotal / value.count) : 0 })).sort((a,b) => b.count - a.count)
})
const memorialManualShare = computed(() => {
  const manual = person.value?.manualDecisions ?? 0
  const total = manual + (person.value?.autoDecisions ?? 0)
  return total === 0 ? 100 : Math.round(manual / total * 100)
})
const deathCauseLabel = (cause: string) => ui.deathCauseLabels[cause as keyof typeof ui.deathCauseLabels] ?? ui.deathCauseLabels.unknown
const deathFactorLabel = (factor: string) => ui.deathFactorLabels[factor as keyof typeof ui.deathFactorLabels] ?? factor
</script>

<template>
  <main class="shell" :class="{ 'home-shell': screen === 'home' || screen === 'birthplace', 'birth-shell': screen === 'reveal', 'life-shell': screen === 'life', 'memorial-shell': screen === 'memorial', 'collection-shell': screen === 'collection', 'sprite-shell': screen === 'sprites' }" :inert="screen === 'birthplace'">
    <header class="masthead">
      <button v-if="screen !== 'mortality'" class="brand" @click="screen = 'home'"><span class="mark">ช</span><span><small>{{ ui.subtitle }}</small><strong>{{ ui.title }}</strong></span></button>
      <nav><button :aria-current="screen === 'home' ? 'page' : undefined" @click="screen = 'home'">{{ ui.home }}</button><button :aria-current="screen === 'collection' ? 'page' : undefined" @click="screen = 'collection'">{{ ui.collection }}</button><button :aria-current="screen === 'mortality' ? 'page' : undefined" @click="screen = 'mortality'">{{ ui.mortalityTitle }}</button></nav>
    </header>

    <section v-if="screen === 'home' || screen === 'birthplace'" class="home-page">
      <HomeDecor />
      <div class="home-stripe" aria-hidden="true" />
      <div class="home-grid">
        <article class="hero home-hero">
          <h1><span>{{ ui.homeHeadline }}</span><span class="home-headline-accent">{{ ui.homeHeadlineAccent }}</span></h1>
          <p class="intro">{{ ui.pitch }}</p>
          <div class="home-actions">
            <button class="primary" @click="store.newLife()">{{ ui.born }}</button>
            <button v-if="game" class="secondary" @click="screen = game.status === 'dead' ? 'memorial' : 'life'">{{ ui.resume }}</button>
          </div>
        </article>
        <section class="map-stage">
          <IsanMap :active-province="recentBirth?.province" />
        </section>
        <aside class="home-world-column"><HomeWorldCounters :lives="counters.lives" :births-today="counters.birthsToday" :recent-province="recentBirth?.province" /></aside>
      </div>
    </section>

    <BirthProfile v-else-if="screen === 'reveal' && roll" :roll="roll" @start="store.startLife()" />

    <section v-else-if="screen === 'life' && game && person" class="life-screen">
      <div class="life-stripe" aria-hidden="true" />
      <div class="yearbar"><span class="stage-pill">{{ displayStage }}</span><strong>{{ ui.year }} {{ buddhistYear(game.year) }}</strong><span class="age-readout">{{ age }} {{ ui.yearsOld }}</span><span class="place">{{ person.province }}</span></div>
      <div class="life-time-controls" role="group" :aria-label="ui.timeControls">
        <button :aria-pressed="!playbackRunning" @click="store.pausePlayback()">❚❚ {{ ui.pause }}</button>
        <button v-for="speed in playbackSpeeds" :key="speed" :aria-pressed="playbackRunning && playbackSpeed === speed" @click="store.setPlaybackSpeed(speed)">{{ speed }}×</button>
        <button class="auto-mode" :aria-pressed="autoMode" :title="ui.autoModeHint" @click="store.setAutoMode(!autoMode)">{{ ui.autoMode }}</button>
        <label class="auto-policy" :title="ui.autoPolicyHint"><span>นโยบาย</span><select v-model="autoPolicy" :aria-label="ui.autoPolicyHint" @change="store.setAutoPolicy(autoPolicy)"><option v-for="(label, policy) in ui.autoPolicies" :key="policy" :value="policy">{{ label }}</option></select></label>
        <button class="next-decision" :disabled="Boolean(card)" @click="store.nextDecision()">{{ ui.nextDecision }} »</button>
      </div>
      <div class="life-layout">
        <aside class="sidebar">
          <section class="panel profile">
            <Portrait :person="person" :age="age" :size="176" /><h2>{{ person.name }}</h2><p>{{ age }} {{ ui.yearsOld }} · {{ profileOccupation }}</p><p>{{ ui.place }}: {{ person.location }}<span v-if="age > balance.stages.childhood"> · {{ ui.partnerStatus }}: {{ person.partnered ? ui.married : ui.notMarried }} · {{ ui.childCount }} {{ person.children }}</span></p>
            <dl><div v-for="(label, key) in ui.stats" :key="key" class="life-stat-row"><dt>{{ label }}</dt><dd><span class="meter"><i :style="{ width: `${person[key]}%` }" /></span><b>{{ Math.round(person[key]) }}</b></dd></div></dl>
            <details class="profile-stat-help"><summary>{{ ui.statHelp }}</summary><p>{{ ui.statHelpIntro }}</p><ul><li v-for="(meaning, key) in ui.statMeanings" :key="key"><b>{{ ui.stats[key] }}</b> {{ meaning }}</li></ul></details>
            <div class="profile-home-map"><IsanMap :active-province="person.province" /></div>
          </section>
          <section class="panel household">
            <h2>{{ ui.family }}</h2><p>{{ person.householdType }}<span v-if="person.householdLandRai"> · {{ person.householdLandRai }} {{ ui.rai }}</span></p>
            <div class="economy"><span>{{ ui.householdMoney }} <b>{{ Math.round(person.householdMoney) }}</b></span><span>{{ ui.personalMoney }} <b>{{ Math.round(person.money) }}</b></span><span>{{ ui.householdDebt }} <b>{{ Math.round(person.debt) }}</b></span><span>{{ ui.personalDebt }} <b>{{ Math.round(person.personalDebt) }}</b></span><span>{{ ui.remittances }} <b>{{ Math.round(person.remittancesSent) }}</b></span></div>
            <h3>{{ ui.relatives }}</h3>
            <ul><li v-for="relative in person.relatives" :key="relative.id"><span :class="{ dead: !relative.alive }">{{ roleLabel(relative.role) }} · {{ relative.name }}</span><small>{{ relative.alive ? `${relative.age} ${ui.yearsOld}${relative.migrated ? ` · ${ui.relativeMigrated}` : ''} · ${relative.married ? ui.married : ui.notMarried}` : ui.relativeDead }}</small></li></ul>
          </section>
        </aside>
        <div class="story-column">
          <article v-if="card" class="story panel"><p class="eyebrow">{{ ui.year }} {{ buddhistYear(game.year) }} · {{ ui.stage[person.stage] }}</p><h2>{{ card.title }}</h2><p v-if="game.year > balance.yearMax" class="projected">{{ ui.projectedNotice }}</p><p>{{ card.body }}</p><div v-if="card.auto" class="choices"><button @click="store.continueAuto()"><span>{{ ui.continue }}</span><span>→</span></button></div><div v-else class="choices"><button v-for="choice in currentChoices" :key="choice.id" @click="store.pick(choice.id)"><span>{{ choice.label }}<span v-if="choiceEffects(choice).length" class="choice-effects"><small v-for="(effect, i) in choiceEffects(choice)" :key="i" class="choice-effect">{{ effect }}</small></span></span><span>↗</span></button></div></article>
          <article v-else class="story quiet panel"><p>{{ yearResolved ? ui.yearResolved : annualVignette(game) }}</p></article>
          <section class="panel log"><h2>{{ ui.timeline }}</h2><p v-if="!game.log.length" class="empty">{{ ui.noTimeline }}</p><ol><li v-for="(event, i) in [...game.log].reverse().slice(0, 16)" :key="i"><time>{{ buddhistYear(event.year) }}</time><span><b>{{ event.title }}</b>{{ event.text }}</span></li></ol></section>
          <div class="world-strip"><span class="world-dot" /><strong>{{ worldLabel }}</strong><span>{{ counters.lives }} {{ ui.worldLives }}</span><small class="world-strip-description">{{ worldDescription }}</small><small>{{ recentBirth?.name }} {{ ui.recently }}{{ recentBirth?.province }}</small></div>
        </div>
      </div>
    </section>

    <section v-else-if="screen === 'memorial' && game && person" class="memorial panel">
      <p class="eyebrow">{{ ui.death }}</p><div class="memorial-art"><svg class="landscape" viewBox="0 0 180 90" preserveAspectRatio="none" shape-rendering="crispEdges"><rect width="180" height="90" fill="#e7eee3" /><rect x="130" y="12" width="18" height="18" fill="#e8c98d" /><rect x="136" y="6" width="6" height="6" fill="#e8c98d" /><rect x="124" y="18" width="6" height="6" fill="#e8c98d" /><rect x="28" y="34" width="24" height="8" fill="#c7d6c0" /><rect x="18" y="42" width="48" height="8" fill="#c7d6c0" /><rect y="53" width="180" height="37" fill="#9eaf8b" /><rect y="63" width="180" height="27" fill="#829970" /><rect x="8" y="59" width="34" height="3" fill="#d0d7a5" /><rect x="49" y="68" width="43" height="3" fill="#d0d7a5" /><rect x="102" y="59" width="54" height="3" fill="#d0d7a5" /><rect x="118" y="78" width="62" height="3" fill="#d0d7a5" /><rect x="0" y="84" width="180" height="6" fill="#718763" /></svg><Portrait :person="person" :age="memorialAge" :size="200" /></div>
      <h1>{{ person.name }}</h1><p class="dates">{{ ui.year }} {{ person.birthYearBE }} — {{ buddhistYear(person.deathYear) }} · {{ person.province }}</p><p class="memorial-copy">{{ game.memorial }}</p>
      <p class="memorial-death-cause">{{ deathCauseLabel(person.deathCause ?? 'unknown') }}</p><ul v-if="person.deathCause !== 'other' && person.deathFactors?.length" class="death-factors"><li v-for="factor in person.deathFactors" :key="factor">{{ deathFactorLabel(factor) }}</li></ul>
      <p class="memorial-decision-mode">{{ memorialManualShare >= 50 ? ui.playerDecisionMode : ui.autoDecisionMode }}</p><p class="mortality-disclaimer">{{ ui.mortalityDisclaimer }}</p>
      <section v-if="cohort.length" class="cohort"><h2>{{ ui.cohortTitle }}</h2><article v-for="life in cohort" :key="life.person.id" class="cohort-row"><Portrait :person="life.person" :size="72" /><span><b>{{ life.person.name }}</b><small>{{ ui.year }} {{ buddhistYear(life.person.birthYear) }} — {{ buddhistYear(life.person.deathYear) }}</small><small>{{ life.memorial }}</small></span></article></section>
      <button class="candle" @click="store.lightCandle()">🕯 {{ ui.candle }}</button><p class="muted">{{ ui.candles }}: {{ candleCount }}</p><button class="primary" @click="store.newLife()">{{ ui.newLife }}</button>
    </section>

    <section v-else-if="screen === 'collection'" class="collection-page">
      <div class="collection-stripe" aria-hidden="true" />
      <div class="collection-head"><div><p class="eyebrow">{{ ui.collectionEyebrow }}</p><h1>{{ ui.collectionTitle }}</h1><p>{{ ui.collectionIntro }}</p></div><span>{{ collection.length }} {{ ui.peopleSuffix }}</span></div>
      <div class="collection-grid"><article v-for="(item, i) in collection" :key="item.id" class="person-card panel"><Portrait :person="item" :size="126" /><div><span class="rarity">{{ rarity(i) }}</span><h2>{{ item.name }}</h2><p>{{ item.province }} · {{ ui.stage[item.stage] }}</p></div></article><template v-if="collection.length < balance.collection.maxEntries"><article v-for="i in balance.collection.lockedSlots" :key="`locked-${i}`" class="person-card locked panel"><div class="silhouette">?</div><div><span class="rarity">{{ ui.locked }}</span><h2>{{ ui.locked }}</h2><p>{{ ui.unlockHint }}</p></div></article></template></div>
    </section>
    <section v-else-if="screen === 'mortality'" class="mortality-page panel">
      <p class="eyebrow">{{ ui.mortalityTitle }}</p><h1>{{ ui.mortalityTitle }}</h1><p class="mortality-disclaimer">{{ ui.mortalityDisclaimer }}</p>
      <label class="mortality-filter">{{ ui.mortalityTitle }}<select v-model="mortalityFilter"><option v-for="(label, key) in ui.mortalityFilters" :key="key" :value="key">{{ label }}</option></select></label>
      <p>{{ mortalityLives.length }} ชีวิต</p><div class="mortality-table"><div class="mortality-row mortality-head"><b>สาเหตุ</b><b>จำนวนชีวิต</b><b>อายุเฉลี่ยเมื่อเสียชีวิต</b></div><div v-for="row in causeStats" :key="row.cause" class="mortality-row"><span>{{ deathCauseLabel(row.cause) }}</span><span>{{ row.count }}</span><span>{{ row.averageAge }} {{ ui.yearsOld }}</span></div></div>
    </section>
    <SpriteGallery v-else-if="screen === 'sprites'" />
    <Teleport to="body">
      <BirthplaceRoll v-if="screen === 'birthplace' && roll" :province="roll.person.province" @finished="store.finishBirthplaceRoll()" />
    </Teleport>
    <footer><span v-if="screen === 'home' || screen === 'birthplace'">{{ ui.mapAttribution }}</span><span v-else>{{ worldDescription }}</span></footer>
  </main>
</template>
