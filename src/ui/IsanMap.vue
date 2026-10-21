<script setup lang="ts">
import { computed } from 'vue'
import mapData from '../content/data/isan-provinces.json'
import { isanProvincesByIso } from '../content/geography'
import { ui } from '../content/ui'

const props = defineProps<{ activeProvince?: string }>()

type Position = [number, number]
type PolygonCoordinates = Position[][]
type Geometry =
  | { type: 'Polygon'; coordinates: PolygonCoordinates }
  | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] }
type ProvinceFeature = { properties: { shapeISO: keyof typeof isanProvincesByIso }; geometry: Geometry }
type FeatureCollection = { features: ProvinceFeature[] }
type Ring = Position[]

const viewWidth = 720
const viewHeight = 620
const padding = 22
const features = (mapData as unknown as FeatureCollection).features
const ringsFor = (feature: ProvinceFeature): Ring[] => feature.geometry.type === 'Polygon'
  ? feature.geometry.coordinates
  : feature.geometry.coordinates.flat()
const allPositions = features.flatMap(feature => ringsFor(feature).flat())
const longitudes = allPositions.map(([lon]) => lon)
const latitudes = allPositions.map(([, lat]) => lat)
const minLon = Math.min(...longitudes)
const maxLon = Math.max(...longitudes)
const minLat = Math.min(...latitudes)
const maxLat = Math.max(...latitudes)
const projectedMinX = minLon
const projectedMaxX = maxLon
const mapScale = Math.min(
  (viewWidth - padding * 2) / (projectedMaxX - projectedMinX),
  (viewHeight - padding * 2) / (maxLat - minLat),
)
const usedWidth = (projectedMaxX - projectedMinX) * mapScale
const usedHeight = (maxLat - minLat) * mapScale
const offsetX = (viewWidth - usedWidth) / 2
const offsetY = (viewHeight - usedHeight) / 2

function project(lon: number, lat: number) {
  return {
    x: offsetX + (lon - projectedMinX) * mapScale,
    y: offsetY + (maxLat - lat) * mapScale,
  }
}

function pathForRings(rings: Ring[]) {
  return rings.map(ring => ring.map(([lon, lat], index) => {
    const point = project(lon, lat)
    return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`
  }).join(' ') + ' Z').join(' ')
}

function ringArea(ring: Ring) {
  let area = 0
  for (let index = 0; index < ring.length; index++) {
    const [x1, y1] = ring[index]!
    const [x2, y2] = ring[(index + 1) % ring.length]!
    area += x1 * y2 - x2 * y1
  }
  return area / 2
}

function ringCentroid(ring: Ring): Position {
  let x = 0
  let y = 0
  let areaFactor = 0
  for (let index = 0; index < ring.length; index++) {
    const [x1, y1] = ring[index]!
    const [x2, y2] = ring[(index + 1) % ring.length]!
    const cross = x1 * y2 - x2 * y1
    areaFactor += cross
    x += (x1 + x2) * cross
    y += (y1 + y2) * cross
  }
  return areaFactor === 0 ? ring[0]! : [x / (3 * areaFactor), y / (3 * areaFactor)]
}

const provinceShapes = features.map(feature => ({
  code: feature.properties.shapeISO,
  name: isanProvincesByIso[feature.properties.shapeISO],
  path: pathForRings(ringsFor(feature)),
  labelPoint: project(...ringCentroid(ringsFor(feature).reduce((largest, ring) => Math.abs(ringArea(ring)) > Math.abs(ringArea(largest)) ? ring : largest))),
}))
const regionOutline = provinceShapes.map(province => province.path).join(' ')
const activeProvinceShape = computed(() => provinceShapes.find(province => province.name === props.activeProvince))
</script>

<template>
  <div class="isan-map-wrap">
    <svg class="isan-map-art" viewBox="0 0 720 620" role="img" :aria-label="ui.isanMapIllustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="isan-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#16263f" />
          <stop offset="1" stop-color="#16263f" />
        </linearGradient>
        <radialGradient id="isan-active-glow">
          <stop offset="0" stop-color="#e6b23d" stop-opacity=".42" />
          <stop offset="1" stop-color="#e6b23d" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g class="isan-province-shapes">
        <path
          v-for="province in provinceShapes"
          :key="province.code"
          :d="province.path"
          :class="{ 'province-active': province.name === props.activeProvince }"
          :aria-label="province.name"
        />
        <circle v-if="activeProvinceShape" :cx="activeProvinceShape.labelPoint.x" :cy="activeProvinceShape.labelPoint.y" r="100" class="province-active-glow" />
      </g>
      <path :d="regionOutline" class="isan-region-outline" />
      <text
        v-if="activeProvinceShape"
        :key="`label-${activeProvinceShape.code}`"
        :x="activeProvinceShape.labelPoint.x"
        :y="activeProvinceShape.labelPoint.y"
        class="isan-province-label"
        text-anchor="middle"
        dominant-baseline="central"
      >{{ activeProvinceShape.name }}</text>
    </svg>
    <p class="map-attribution">{{ ui.mapAttribution }}</p>
  </div>
</template>

<style>
.isan-map-wrap{position:absolute;inset:0;z-index:0;pointer-events:none}
.isan-map-wrap .isan-map-art{position:absolute;z-index:0;inset:0;width:100%;height:100%;overflow:visible}
.isan-province-shapes path{fill:url(#isan-land);stroke:#c9657f;stroke-opacity:.4;stroke-width:1.25;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.isan-province-shapes path.province-active{fill:#e6b23d;fill-opacity:.3;stroke:#e6b23d;stroke-opacity:1;stroke-width:2.5}
.province-active-glow{fill:url(#isan-active-glow);pointer-events:none}
.isan-province-label{fill:#f6efe0;stroke:#0f1a2e;stroke-width:4px;paint-order:stroke;stroke-linejoin:round;font:600 18px var(--font-main)}
.isan-region-outline{fill:none;stroke:#c9657f;stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke;opacity:.7;filter:none}
.map-attribution{position:absolute;right:12px;bottom:2px;margin:0;color:#9fb0c8;font-size:12px;text-align:right}
</style>
