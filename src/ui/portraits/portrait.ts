import { balance } from '../../content/balance'
import { portraitSvg, TONES, type Palette } from './sprites'
import type { Gender, Person, Stage } from '../../engine/types'

export type PortraitAgeGroup = 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'elder'

function hash(text: string): number {
  let value = 2166136261
  for (const character of text) value = Math.imul(value ^ character.charCodeAt(0), 16777619)
  return value >>> 0
}

export function portraitAgeGroup(age: number): PortraitAgeGroup {
  if (age < 3) return 'infant'
  if (age < 6) return 'toddler'
  if (age < 15) return 'child'
  if (age < 20) return 'teen'
  if (age < 60) return 'adult'
  return 'elder'
}

/** The status badge follows the displayed age even if an older save has a stale stage field. */
export function displayStageForAge(age: number): Stage {
  if (age < 15) return 'childhood'
  if (age < 20) return 'teen'
  if (age <= balance.stages.youngAdult) return 'youngAdult'
  if (age <= balance.stages.midLife) return 'midLife'
  return 'elder'
}

export function pixelScaleForSize(size: number): number {
  return Math.max(1, Math.floor(size / 22))
}

export function portraitPixelDimensions(size: number): { width: string; height: string } {
  const scale = pixelScaleForSize(size)
  return { width: `${16 * scale}px`, height: `${22 * scale}px` }
}

const HAIR_BY_GENDER: Record<Gender, readonly string[]> = {
  'หญิง': ['hshort', 'hside', 'hbo', 'hl', 'hb', 'hpon', 'hcurl', 'hbraid'],
  'ชาย': ['hc', 'hp', 'hfringe', 'hcurl', 'hunder', 'hbuzz', 'hwave', 'hl'],
  'อื่น ๆ': ['hshort', 'hside', 'hbo', 'hl', 'hb', 'hpon', 'hcurl', 'hbraid', 'hc', 'hp', 'hfringe', 'hunder'],
}

export function hairstyleOptions(gender: Gender): readonly string[] {
  return HAIR_BY_GENDER[gender]
}

const types = balance.householdTypes
const isType = (person: Person, indexes: number[]) => indexes.some(index => person.householdType === types[index])

export function selectPortraitLayers(person: Person, age: number): string[] {
  const group = portraitAgeGroup(age)
  const identity = hash(person.id)
  const accessoryRoll = hash(`${person.id}:accessories`) % 100
  const layers: string[] = []

  if (group === 'infant') {
    layers.push('swaddle')
  } else if (group === 'toddler') {
    layers.push('romper')
  } else if (group === 'child' || group === 'teen') {
    layers.push(person.flags.school ? person.gender === 'หญิง' ? 'osf' : 'osm' : 'oc')
    if (accessoryRoll < 45) layers.push('bag')
  } else if (person.flags.thaiChinese) {
    layers.push('oc', 'ap', 'shopJacket', 'scarf')
  } else if (isType(person, [0])) {
    layers.push('ow', 'kr', 'ht')
  } else if (isType(person, [4])) {
    layers.push('ofishing', 'kr')
  } else if (isType(person, [7])) {
    layers.push('oc', 'ap', 'shopJacket')
  } else if (isType(person, [2])) {
    layers.push('oc', 'ap')
  } else if (isType(person, [3, 8])) {
    layers.push(person.gender === 'หญิง' ? 'ol' : 'os')
  } else if (person.flags.constructionWork || person.occupation.includes('construction')) {
    layers.push('oconstruction', 'hardhat', 'bag')
  } else if (isType(person, [6]) || person.flags.factoryWork || person.occupation.includes('factory')) {
    layers.push('ofactory')
  } else if (isType(person, [1])) {
    layers.push(person.flags.constructionWork ? 'oconstruction' : 'ow')
    if (person.flags.constructionWork) layers.push('hardhat')
  } else if (isType(person, [5])) {
    layers.push('oc', 'scarf')
  } else {
    layers.push('oc')
  }

  const hairStyles = HAIR_BY_GENDER[person.gender]
  if (group !== 'infant') layers.push(hairStyles[identity % hairStyles.length]!)
  if (group === 'infant') layers.push('babyCap')
  if (group === 'elder') layers.push('wr')
  if (group !== 'infant' && accessoryRoll >= 46 && accessoryRoll < 62) layers.push('gl')
  if (group === 'elder' && accessoryRoll < 35) layers.push('cane')
  return layers
}

function outfitPalette(person: Person, age: number, identity: number): Palette {
  const group = portraitAgeGroup(age)
  const wardrobe = hash(`${person.id}:${group}:${person.householdType}:${person.occupation}`)
  const tone = TONES[`s${identity % 6}`]!
  const naturalHair = ['#28221f', '#392a25', '#49352d', '#241f1c', '#514039', '#302a28', '#3c2d26', '#252423'][identity % 8]!
  const tops = ['#53745e', '#496878', '#8b584c', '#b18b55', '#625a75', '#647b83', '#75624f', '#4d6854']
  const bottoms = ['#394c55', '#51433c', '#4a5947', '#5b4d60', '#3e464e', '#68563f']
  const accessories = ['#bb8a48', '#627b69', '#a65e5b', '#647e8d', '#9b7854']
  return {
    ...tone,
    hair: group === 'elder' ? '#969895' : naturalHair,
    top: tops[wardrobe % tops.length]!,
    btm: bottoms[Math.floor(wardrobe / 7) % bottoms.length]!,
    acc: accessories[Math.floor(wardrobe / 13) % accessories.length]!,
    tie: '#9f4e4a',
  }
}

export function personPortraitSvg(person: Person, size = 110, age?: number): string {
  const currentAge = age ?? (person.stage === 'elder' ? 70 : person.stage === 'midLife' ? 45 : person.stage === 'youngAdult' ? 27 : person.stage === 'teen' ? 16 : 10)
  const group = portraitAgeGroup(currentAge)
  const identity = hash(person.id)
  const palette = outfitPalette(person, currentAge, identity)
  return portraitSvg(selectPortraitLayers(person, currentAge), palette, pixelScaleForSize(size), group)
}

// TODO(verify): have people in Isan review locally specific work clothes and accessories before adding traditional garments.
