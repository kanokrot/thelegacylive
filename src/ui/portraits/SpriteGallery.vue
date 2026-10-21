<script setup lang="ts">
import { balance } from '../../content/balance'
import { rollBirth } from '../../engine/game'
import type { Gender, Person } from '../../engine/types'
import Portrait from './Portrait.vue'

const genders: Gender[] = ['หญิง', 'ชาย', 'อื่น ๆ']
const ageGroups = [
  { id: 'infant', label: 'ทารก', age: 1 },
  { id: 'toddler', label: 'เด็กเล็ก', age: 4 },
  { id: 'child', label: 'เด็ก', age: 10 },
  { id: 'teen', label: 'วัยรุ่น', age: 16 },
  { id: 'adult', label: 'วัยทำงาน', age: 35 },
  { id: 'elder', label: 'ผู้สูงอายุ', age: 70 },
] as const
const outfits = [
  { id: 'farmer', label: 'เกษตรกร', household: 0 },
  { id: 'student', label: 'นักเรียน', household: 1 },
  { id: 'factory', label: 'โรงงาน', household: 6 },
  { id: 'trader', label: 'ค้าขาย', household: 2 },
  { id: 'family-shop', label: 'ร้านครอบครัว', household: 7 },
  { id: 'official', label: 'ราชการ', household: 3 },
  { id: 'construction', label: 'ก่อสร้าง', household: 1 },
  { id: 'fishing', label: 'ประมง', household: 4 },
  { id: 'craft', label: 'งานฝีมือ', household: 5 },
  { id: 'casual', label: 'ทั่วไป', household: 1 },
] as const

function samplePerson(ageId: string, genderIndex: number, age: number, gender: Gender, outfit: typeof outfits[number]): Person {
  const seed = 701_000 + ageGroups.findIndex(group => group.id === ageId) * 31 + genderIndex
  const person = rollBirth(seed, 2026).person
  return {
    ...person,
    id: `sprite-gallery-${ageId}-${genderIndex}`,
    birthYear: 2026 - age,
    gender,
    householdType: balance.householdTypes[outfit.household]!,
    occupation: outfit.id,
    flags: {
      ...person.flags,
      school: outfit.id === 'student',
      factoryWork: outfit.id === 'factory',
      constructionWork: outfit.id === 'construction',
    },
  }
}
</script>

<template>
  <section class="sprite-gallery panel">
    <header><p class="eyebrow">DEV</p><h1>ตรวจสไปรต์</h1><p>แต่ละแถวเปลี่ยนเพศและช่วงวัย แต่คงตัวตนเดิมไว้ขณะเทียบชุด</p></header>
    <div class="sprite-table-wrap">
      <table>
        <thead><tr><th>ช่วงวัย / เพศ</th><th v-for="outfit in outfits" :key="outfit.id">{{ outfit.label }}</th></tr></thead>
        <tbody>
          <template v-for="(group, groupIndex) in ageGroups" :key="group.id">
            <tr v-for="(gender, genderIndex) in genders" :key="`${group.id}-${gender}`">
              <th><b>{{ group.label }}</b><small>{{ gender }} · {{ group.age }} ปี</small></th>
              <td v-for="outfit in outfits" :key="outfit.id"><Portrait :person="samplePerson(group.id, genderIndex, group.age, gender, outfit)" :age="group.age" :size="66" /></td>
            </tr>
            <tr v-if="groupIndex < ageGroups.length - 1" class="sprite-divider"><td :colspan="outfits.length + 1" /></tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.sprite-gallery { width: min(100%, 1500px); margin: 24px auto 48px; padding: clamp(16px, 3vw, 32px); }
.sprite-gallery header { margin-bottom: 18px; }
.sprite-gallery h1 { margin: 0 0 6px; color: var(--gold); }
.sprite-gallery header p:last-child { margin: 0; color: var(--muted); }
.sprite-table-wrap { overflow: auto; max-width: 100%; }
table { width: 100%; min-width: 940px; border-collapse: collapse; }
th, td { min-width: 82px; padding: 8px 6px; border-bottom: 1px solid var(--line); text-align: center; vertical-align: middle; }
thead th { position: sticky; top: 0; z-index: 1; background: var(--paper); color: var(--gold); font-size: 14px; }
tbody th { min-width: 110px; text-align: left; color: var(--ink); }
tbody th b, tbody th small { display: block; }
tbody th small { color: var(--muted); font-weight: 400; }
td :deep(.portrait) { margin-inline: auto; }
.sprite-divider td { height: 8px; padding: 0; border: 0; }
@media (max-width: 600px) { table { min-width: 860px; } th, td { min-width: 74px; padding: 7px 4px; } }
</style>
