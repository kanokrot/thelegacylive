<script setup lang="ts">
import { balance } from '../content/balance'
import { ui } from '../content/ui'
import { WORLD_IDENTITY } from '../content/world'

defineProps<{
  lives: number
  birthsToday: number
  recentProvince?: string
}>()

const accessText = (value: number) => `${Math.round(value * 100)}%`
</script>

<template>
  <aside class="world panel" data-testid="home-world-counters">
    <div class="world-title">
      <span class="world-dot" />
      <div>
        <strong class="world-identity-label">{{ WORLD_IDENTITY.label }}</strong>
        <h2>{{ ui.worldHeading }}</h2>
      </div>
    </div>
    <p class="world-caption">{{ WORLD_IDENTITY.description }}</p>
    <div class="counter-grid">
      <div class="counter"><strong>{{ lives.toLocaleString('th-TH') }}</strong><span>{{ ui.lives }}</span></div>
      <div class="counter"><strong>~{{ birthsToday }}</strong><span>{{ ui.births }}</span></div>
    </div>
    <p class="recent">{{ ui.recently }}<b>{{ recentProvince }}</b></p>
    <p class="access-note">{{ ui.school }} {{ accessText(balance.access.school) }} · {{ ui.hospital }} {{ accessText(balance.access.hospital) }} · {{ ui.jobs }} {{ accessText(balance.access.jobs) }}</p>
    <span class="world-ticket-edge" />
  </aside>
</template>
