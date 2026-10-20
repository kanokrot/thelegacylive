<script setup lang="ts">
import { computed } from 'vue'
import { personPortraitSvg } from './portrait'
import type { Person } from '../../engine/types'
const props = withDefaults(defineProps<{ person: Person; size?: number }>(), { size: 110 })
const markup=computed(()=>personPortraitSvg(props.person,props.size))
const paths=computed(()=>[...markup.value.matchAll(/<path fill="([^"]+)"(?: fill-opacity="([^"]+)")? d="([^"]+)"\/>/g)].map((match,index)=>({key:index,fill:match[1]!,opacity:match[2],d:match[3]!})))
const dimensions=computed(()=>({width:`${Math.floor(props.size/22)*16}px`,height:`${Math.floor(props.size/22)*22}px`}))
</script>
<template><span class="portrait" :style="dimensions"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" width="100%" height="100%" shape-rendering="crispEdges"><path v-for="path in paths" :key="path.key" :fill="path.fill" :fill-opacity="path.opacity" :d="path.d" /></svg></span></template>
<style scoped>.portrait{display:inline-flex;align-items:end;justify-content:center;overflow:hidden}.portrait :deep(svg){display:block;max-width:100%;height:auto;image-rendering:pixelated}</style>
