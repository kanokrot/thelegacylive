<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { provinces } from '../content'
import { ui } from '../content/ui'
import IsanMap from './IsanMap.vue'

const props = defineProps<{ province: string }>()
const emit = defineEmits<{ finished: [] }>()
const dialog = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const rollingProvinces = provinces.filter(name => name !== props.province)
const displayedProvince = ref(rollingProvinces[0] ?? props.province)
const stopped = ref(false)

let timer: number | undefined
let active = true

const delays = [
  ...Array.from({ length: 8 }, () => 50),
  ...Array.from({ length: 8 }, () => 65),
  ...Array.from({ length: 6 }, () => 85),
  ...Array.from({ length: 5 }, () => 115),
  ...Array.from({ length: 3 }, () => 165),
]

function trapDialogFocus(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const focusable = [...dialog.value.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.getClientRects().length > 0)
  if (!focusable.length) {
    event.preventDefault()
    heading.value?.focus()
    return
  }
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function keepFocusInDialog(event: FocusEvent) {
  if (dialog.value && !dialog.value.contains(event.target as Node)) heading.value?.focus()
}

onMounted(() => {
  document.addEventListener('keydown', trapDialogFocus, true)
  document.addEventListener('focusin', keepFocusInDialog, true)
  heading.value?.focus()
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    displayedProvince.value = props.province
    emit('finished')
    return
  }

  let index = 0
  let step = 0
  const tick = () => {
    if (!active) return
    if (step === delays.length) {
      displayedProvince.value = props.province
      stopped.value = true
      timer = window.setTimeout(() => {
        if (active) emit('finished')
      }, 800)
      return
    }
    index = (index + 1) % rollingProvinces.length
    displayedProvince.value = rollingProvinces[index]!
    timer = window.setTimeout(tick, delays[step]!)
    step++
  }
  timer = window.setTimeout(tick, delays[0]!)
})

onUnmounted(() => {
  active = false
  if (timer !== undefined) window.clearTimeout(timer)
  document.removeEventListener('keydown', trapDialogFocus, true)
  document.removeEventListener('focusin', keepFocusInDialog, true)
})
</script>

<template>
  <div class="birthplace-backdrop">
    <section
      ref="dialog"
      class="birthplace-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="birthplace-dialog-title"
      aria-describedby="birthplace-reel-caption"
      tabindex="-1"
    >
      <div class="birthplace-map" :aria-label="ui.isanMapIllustration">
        <IsanMap :active-province="displayedProvince" />
      </div>
      <div class="birthplace-result">
        <p class="birthplace-eyebrow">{{ ui.birthplaceEyebrow }}</p>
        <h2 id="birthplace-dialog-title" ref="heading" tabindex="-1">{{ ui.birthplaceDialogTitle }}</h2>
        <div class="province-reel" :class="{ 'is-stopped': stopped }" :aria-live="stopped ? 'polite' : 'off'" aria-atomic="true">
          <strong :key="displayedProvince" class="reel-current">{{ displayedProvince }}</strong>
        </div>
        <p id="birthplace-reel-caption" class="reel-caption">{{ ui.birthplaceCaption }}</p>
      </div>
    </section>
  </div>
</template>
