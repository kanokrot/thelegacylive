<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { birthStoryContent, buildBirthStory } from '../content/birthStory'
import { ui } from '../content/ui'
import type { BirthRoll } from '../engine/types'
import { PROVINCE_STATS, REGION_REFERENCE } from '../content/data/provinceStats'
import Portrait from './portraits/Portrait.vue'
import IsanMap from './IsanMap.vue'

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
    <div class="birth-card-layout">
      <aside class="birth-card-aside">
        <div class="birth-portrait-card">
          <Portrait :person="person" :size="156" />
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
          <h1 ref="profileTitle" tabindex="-1">{{ birthStoryContent.title }}</h1>
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
          <h2>{{ birthStoryContent.incomeTitle }}</h2>
          <div class="birth-income-values">
            <p><span>{{ birthStoryContent.median }}</span><strong>{{ money(provinceStat.householdIncomeMonthly.medianTotal) }}</strong></p>
            <p><span>{{ birthStoryContent.mean }}</span><strong>{{ money(provinceStat.householdIncomeMonthly.meanTotal) }}</strong></p>
            <p><span>{{ birthStoryContent.regionalMean }}</span><strong>{{ money(regionalIncome) }}</strong></p>
          </div>
          <small>{{ birthStoryContent.source }}</small>
        </article>

        <div class="birth-traits">
          <div v-for="trait in traits" :key="trait.label" class="birth-trait-row">
            <div><span>{{ trait.label }}</span><strong>{{ trait.value }}/100</strong></div>
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
