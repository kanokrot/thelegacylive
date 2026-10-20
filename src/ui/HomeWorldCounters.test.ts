import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { WORLD_IDENTITY } from '../content/world'
import HomeWorldCounters from './HomeWorldCounters.vue'

describe('home world counters', () => {
  it('renders the simulated-world identity beside the live counters', async () => {
    const html = await renderToString(createSSRApp(HomeWorldCounters, {
      lives: 128,
      birthsToday: 6,
      recentProvince: 'ขอนแก่น',
    }))

    expect(html).toContain('data-testid="home-world-counters"')
    expect(html).toContain(`<strong class="world-identity-label">${WORLD_IDENTITY.label}</strong>`)
    expect(html).toContain(WORLD_IDENTITY.description)
    expect(html).toContain('128')
  })
})
