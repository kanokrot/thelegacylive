<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '../content/ui'
import type { BirthRoll } from '../engine/types'
import Portrait from './portraits/Portrait.vue'

const props = defineProps<{ roll: BirthRoll }>()
defineEmits<{ start: [] }>()

const profileItems = computed(() => props.roll.reveals.slice(0, -1).map((item, index) => ({
  ...item,
  traitValue: index >= 5 ? [
    props.roll.person.health,
    props.roll.person.aptitude,
    props.roll.person.diligence,
    props.roll.person.temperament,
  ][index - 5] : undefined,
})))
</script>

<template>
  <section class="birth-profile panel" data-testid="birth-profile">
    <div class="birth-profile-heading">
      <Portrait :person="roll.person" :size="150" />
      <div>
        <span class="birth-name-label">{{ roll.reveals[roll.reveals.length - 1]?.label }}</span>
        <h1>{{ roll.person.name }}</h1>
        <p>{{ roll.person.province }}</p>
      </div>
    </div>
    <div class="birth-facts">
      <article v-for="item in profileItems" :key="item.label" class="birth-fact" :class="{ 'birth-trait': item.traitValue !== undefined }">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <div v-if="item.traitValue !== undefined" class="birth-trait-meter" role="meter" :aria-label="item.label" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="item.traitValue">
          <i :style="{ width: `${item.traitValue}%` }" />
        </div>
      </article>
    </div>
    <button class="primary" @click="$emit('start')">{{ ui.startLife }}</button>
  </section>
</template>
