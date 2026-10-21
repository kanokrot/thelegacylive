<script setup lang="ts">
import { computed } from 'vue'
import { personPortraitSvg, portraitPixelDimensions } from './portrait'
import type { Person } from '../../engine/types'
const props = defineProps<{ person: Person; age?: number; size?: number }>()
const size=computed(()=>props.size ?? 110)
const markup=computed(()=>personPortraitSvg(props.person,size.value,props.age))
const paths=computed(()=>[...markup.value.matchAll(/<path fill="([^"]+)"(?: fill-opacity="([^"]+)")? d="([^"]+)"\/>/g)].map((match,index)=>({key:index,fill:match[1]!,opacity:match[2],d:match[3]!})))
const dimensions=computed(()=>portraitPixelDimensions(size.value))
</script>
<template><span class="portrait" :style="dimensions"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" width="100%" height="100%" shape-rendering="crispEdges"><path v-for="path in paths" :key="path.key" :fill="path.fill" :fill-opacity="path.opacity" :d="path.d" /></svg></span></template>
<style scoped>.portrait{display:flex;align-items:end;justify-content:center;overflow:hidden;image-rendering:pixelated;flex:0 0 auto}.portrait :deep(svg){display:block;width:100%;height:100%;image-rendering:pixelated}</style>
