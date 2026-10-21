<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { birthStoryContent, buildBirthStory } from '../content/birthStory'
import { ui } from '../content/ui'
import type { BirthRoll } from '../engine/types'
import { PROVINCE_STATS, REGION_REFERENCE } from '../content/data/provinceStats'
import Portrait from './portraits/Portrait.vue'
import IsanMap from './IsanMap.vue'
import RevealDecor from './RevealDecor.vue'

const props = defineProps<{ roll: BirthRoll }>()
defineEmits<{ start: [] }>()
const profileTitle = ref<HTMLElement | null>(null)
const storyDate = new Date()
const provinceStat = computed(() => PROVINCE_STATS.find(stat => stat.nameTh === props.roll.person.province))
const story = computed(() => buildBirthStory(props.roll.person, storyDate))
const regionalIncome = REGION_REFERENCE.region.householdIncomeMonthly.meanTotal
const money = (amount: number) => `${amount.toLocaleString('th-TH')} บาท`
const person = computed(() => props.roll.person)
const rollItems = computed(() => props.roll.reveals)
const chips = computed(() => [
  { label: birthStoryContent.gender, value: rollItems.value[0]?.value ?? '' },
  { label: birthStoryContent.birthYear, value: rollItems.value[1]?.value ?? '' },
  { label: birthStoryContent.birthOrder, value: rollItems.value[4]?.value ?? '' },
  { label: birthStoryContent.family, value: rollItems.value[3]?.value ?? '' },
])
const traits = computed(() => [
  { label: birthStoryContent.traits[0], value: person.value.health, rollLabel: rollItems.value[5]?.label },
  { label: birthStoryContent.traits[1], value: person.value.aptitude, rollLabel: rollItems.value[6]?.label },
  { label: birthStoryContent.traits[2], value: person.value.diligence, rollLabel: rollItems.value[7]?.label },
  { label: birthStoryContent.traits[3], value: person.value.temperament, rollLabel: rollItems.value[8]?.label },
])

onMounted(() => profileTitle.value?.focus())
</script>

<template>
  <section class="birth-profile panel" data-testid="birth-profile">
    <RevealDecor />
    <div class="birth-card-layout">
      <aside class="birth-card-aside">
        <div class="birth-portrait-card">
          <Portrait :person="person" :age="0" :size="156" />
          <div>
            <span class="birth-name-label">{{ rollItems[9]?.label }}</span>
            <h2>{{ person.name }}</h2>
          </div>
        </div>
        <div class="birth-province-card">
          <span class="birth-province-caption">{{ birthStoryContent.provinceMap }}</span>
          <strong>{{ person.province }}</strong>
          <div class="birth-province-map"><IsanMap :active-province="person.province" /></div>
          <span class="birth-province-map-label">{{ rollItems[2]?.label }}</span>
        </div>
      </aside>

      <div class="birth-card-details">
        <article class="birth-story-card">
          <h1 ref="profileTitle" tabindex="-1"><svg class="reveal-icon" viewBox="0 0 7 7" width="21" height="21" aria-hidden="true" shape-rendering="crispEdges"><path fill="var(--pink)" d="M3 1H1V0H0V3H1V4H2V5H3V6H4V5H5V4H6V3H7V0H6V1H4V0H3Z" /></svg>{{ birthStoryContent.title }}</h1>
          <div class="birth-story-paragraphs">
            <p v-for="paragraph in story.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </article>

        <div class="birth-story-chips">
          <div v-for="chip in chips" :key="chip.label" class="birth-story-chip">
            <span>{{ chip.label }}</span><strong>{{ chip.value }}</strong>
          </div>
        </div>

        <article v-if="provinceStat" class="birth-province-income">
          <h2><svg class="reveal-icon" viewBox="0 0 7 7" width="21" height="21" aria-hidden="true" shape-rendering="crispEdges"><path fill="var(--gold)" d="M2 0H5V1H6V2H7V5H6V6H5V7H2V6H1V5H0V2H1V1H2Z" /><path fill="var(--navy)" d="M3 1H4V3H5V4H3V5H4V6H2V5H1V4H3V3H2V2H3Z" /></svg>{{ birthStoryContent.incomeTitle }}</h2>
          <div class="birth-income-values">
            <p><span>{{ birthStoryContent.median }}</span><strong>{{ money(provinceStat.householdIncomeMonthly.medianTotal) }}</strong></p>
            <p><span>{{ birthStoryContent.mean }}</span><strong>{{ money(provinceStat.householdIncomeMonthly.meanTotal) }}</strong></p>
            <p><span>{{ birthStoryContent.regionalMean }}</span><strong>{{ money(regionalIncome) }}</strong></p>
          </div>
          <small>{{ birthStoryContent.source }}</small>
        </article>

        <div class="birth-traits">
          <div v-for="(trait, index) in traits" :key="trait.label" class="birth-trait-row">
            <div><span class="birth-trait-label"><svg class="reveal-icon" viewBox="0 0 7 7" width="21" height="21" aria-hidden="true" shape-rendering="crispEdges"><path v-if="index === 0" fill="var(--pink)" d="M3 1H1V0H0V3H1V4H2V5H3V6H4V5H5V4H6V3H7V0H6V1H4V0H3Z" /><path v-else-if="index === 1" fill="var(--gold-light)" d="M3 0H4V2H6V3H4V4H6V5H4V7H3V5H1V4H3V3H1V2H3Z" /><path v-else-if="index === 2" fill="var(--orange)" d="M4 0H6V2H5V3H7V4H5V5H4V7H2V5H3V4H1V3H3V2H4Z" /><path v-else fill="var(--blue)" d="M1 0H6V1H7V6H6V7H1V6H0V1H1ZM2 2H3V3H2ZM4 2H5V3H4ZM2 5H5V6H2Z" /></svg>{{ trait.label }}</span><strong>{{ trait.value }}/100</strong></div>
            <div class="birth-trait-meter" role="meter" :aria-label="trait.label" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="trait.value">
              <i :style="{ width: `${trait.value}%` }" />
            </div>
          </div>
        </div>
        <button class="primary" @click="$emit('start')">{{ ui.startLife }}</button>
      </div>
    </div>
  </section>
</template>
