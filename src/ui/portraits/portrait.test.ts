import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { balance } from '../../content/balance'
import { rollBirth } from '../../engine/game'
import type { Gender, Person } from '../../engine/types'
import { BODY_BY_AGE, LAYERS, TONES } from './sprites'
import { displayStageForAge, hairstyleOptions, personPortraitSvg, portraitAgeGroup, portraitPixelDimensions, selectPortraitLayers } from './portrait'

const genders: Gender[] = ['หญิง', 'ชาย', 'อื่น ๆ']
const fixture = (id: string, gender: Gender, householdIndex: number, flags: Record<string, boolean> = {}): Person => {
  const person = rollBirth(901, 2026).person
  return { ...person, id, gender, householdType: balance.householdTypes[householdIndex]!, flags: { ...person.flags, ...flags } }
}
const fixtures = [
  { id: 'infant', age: 1 }, { id: 'toddler', age: 4 }, { id: 'child', age: 10 },
  { id: 'teen', age: 16 }, { id: 'adult', age: 35 }, { id: 'elder', age: 70 },
] as const
const wardrobeTypes = [0, 1, 6, 2, 7, 3, 1, 4, 5, 1]

function pathStaysInsideGrid(path: string): boolean {
  const tokens = path.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g) ?? []
  let x = 0
  let y = 0
  let command = ''
  for (let index = 0; index < tokens.length;) {
    const token = tokens[index]!
    if (/^[A-Za-z]$/.test(token)) {
      command = token
      index++
      if (command.toLowerCase() === 'z') continue
    }
    if (command === 'M' || command === 'm') {
      const nx = Number(tokens[index++]!)
      const ny = Number(tokens[index++]!)
      x = command === 'm' ? x + nx : nx
      y = command === 'm' ? y + ny : ny
      command = command === 'm' ? 'l' : 'L'
    } else if (command === 'H' || command === 'h') {
      const nx = Number(tokens[index++]!)
      x = command === 'h' ? x + nx : nx
    } else if (command === 'V' || command === 'v') {
      const ny = Number(tokens[index++]!)
      y = command === 'v' ? y + ny : ny
    } else if (command === 'L' || command === 'l') {
      const nx = Number(tokens[index++]!)
      const ny = Number(tokens[index++]!)
      x = command === 'l' ? x + nx : nx
      y = command === 'l' ? y + ny : ny
    } else {
      return false
    }
    if (x < 0 || x > 16 || y < 0 || y > 22) return false
  }
  return true
}

function luminance(hex: string): number {
  const values = hex.slice(1).match(/.{2}/g)!.map(value => Number.parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * values[0]! + 0.7152 * values[1]! + 0.0722 * values[2]!
}
function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high! + 0.05) / (low! + 0.05)
}

describe('sprite system and life controls', () => {
  it('uses child display labels and child sprites for every age from zero through fourteen', () => {
    for (let age = 0; age <= 14; age++) {
      expect(displayStageForAge(age)).toBe('childhood')
      expect(['infant', 'toddler', 'child']).toContain(portraitAgeGroup(age))
      for (const gender of genders) {
        const portrait = personPortraitSvg(fixture(`young-${age}-${gender}`, gender, 0), 110, age)
        expect(portrait).not.toContain('M8 12h1v4H8z')
      }
    }
    expect(portraitAgeGroup(0)).toBe('infant')
    expect(portraitAgeGroup(3)).toBe('toddler')
    expect(portraitAgeGroup(6)).toBe('child')
  })

  it('keeps skin and hairstyle identity deterministic and provides eight styles per gender', () => {
    for (const gender of genders) {
      expect(hairstyleOptions(gender).length).toBeGreaterThanOrEqual(8)
      expect(hairstyleOptions(gender).every(layer => LAYERS[layer])).toBe(true)
    }
    expect(Object.keys(TONES)).toHaveLength(6)
    const person = fixture('stable-person', genders[0]!, 0)
    expect(personPortraitSvg(person, 110, 10)).toBe(personPortraitSvg(person, 110, 10))
    expect(personPortraitSvg(person, 110, 10)).not.toBe(personPortraitSvg(person, 110, 70))
  })

  it('has complete age layers and at least the required number of distinct age, gender and outfit sprites', () => {
    const combinations = new Set<string>()
    for (const stage of fixtures) {
      expect(BODY_BY_AGE[stage.id]).toBeDefined()
      for (const gender of genders) {
        for (const [index, household] of wardrobeTypes.entries()) {
          const person = fixture(`${stage.id}-${gender}-${index}`, gender, household, {
            school: index === 1,
            factoryWork: index === 2,
            constructionWork: index === 5,
          })
          const layers = selectPortraitLayers(person, stage.age)
          expect(layers.length).toBeGreaterThan(0)
          expect(layers.every(layer => LAYERS[layer])).toBe(true)
          expect(new Set(layers).size).toBe(layers.length)
          combinations.add(personPortraitSvg(person, 66, stage.age))
        }
      }
    }
    expect(combinations.size).toBeGreaterThanOrEqual(100)
  })

  it('keeps all sprite paths inside the canvas and defines the intended layer order', () => {
    const paths = [...Object.values(LAYERS).flat(), ...Object.values(BODY_BY_AGE).flat()]
    expect(paths.length).toBeGreaterThan(0)
    expect(paths.every(([, path]) => pathStaysInsideGrid(path))).toBe(true)
    const person = fixture('layer-order', 'หญิง', 0)
    const layers = selectPortraitLayers(person, 70)
    const hairLayer = layers.find(layer => hairstyleOptions(person.gender).includes(layer))!
    expect(layers.indexOf('ow')).toBeLessThan(layers.indexOf(hairLayer))
    if (layers.includes('cane')) expect(layers.indexOf('cane')).toBe(layers.length - 1)
  })

  it('uses integer pixel dimensions and centers portraits in life and memorial containers', () => {
    for (const size of [72, 110, 176, 200]) {
      const dimensions = portraitPixelDimensions(size)
      expect(Number.parseInt(dimensions.width)).toBeGreaterThan(0)
      expect(Number.parseInt(dimensions.height) / 22).toBe(Number.parseInt(dimensions.width) / 16)
    }
    const css = readFileSync(new URL('../app-theme.css', import.meta.url), 'utf8')
    expect(css).toMatch(/\.life-screen \.profile > \.portrait[^}]*margin-inline:\s*auto/)
    expect(css).toMatch(/\.memorial-art > \.portrait[^}]*margin-inline:\s*auto/)
    const portraitCss = readFileSync(new URL('./Portrait.vue', import.meta.url), 'utf8')
    expect(portraitCss).toContain('image-rendering:pixelated')
  })

  it('keeps the time controls legible and fits their hit targets in a 380px layout', () => {
    const cream = '#f6efe0'
    const navy = '#0f1a2e'
    const gold = '#e6b23d'
    for (const [foreground, background] of [[cream, '#1a2b48'], [cream, '#263c5e'], [navy, gold], [navy, '#f4d58a'], ['#d4deeb', '#26364f']]) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5)
    }
    const css = readFileSync(new URL('../life-spacing.css', import.meta.url), 'utf8')
    expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))')
    expect(css).toContain('min-height: 46px')
    expect(css).not.toContain('overflow-x: auto')
    const app = readFileSync(new URL('../App.vue', import.meta.url), 'utf8')
    const controls = app.slice(app.indexOf('class="life-time-controls"'), app.indexOf('</div>', app.indexOf('class="life-time-controls"')))
    expect(controls).toContain('v-for="seconds in yearDurations"')
    expect(controls).not.toContain('auto-policy')
  })
})
