import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { rollBirth } from '../engine/game'
import { ui } from '../content/ui'
import BirthProfile from './BirthProfile.vue'

describe('birth profile', () => {
  it('renders the name, portrait, and every birth roll item without interaction', async () => {
    const roll = rollBirth(24801)
    const html = await renderToString(createSSRApp(BirthProfile, { roll }))

    expect(html).toContain('data-testid="birth-profile"')
    expect(html).toContain('<svg')
    expect(html).toContain(roll.person.name)
    const storyHtml = html.match(/<div class="birth-story-paragraphs">([\s\S]*?)<\/div>/)?.[1] ?? ''
    expect(storyHtml.match(/<p>/g)).toHaveLength(3)
    expect(html).toContain('ประวัติ')
    expect(html).toContain('หมู่บ้านสมมติ')
    expect(html).not.toContain(ui.birthplaceCaption)
    for (const item of roll.reveals) expect(html).toContain(item.value)
    expect(html).toContain('เพศ')
    expect(html).toContain('ปีเกิด')
    expect(html).toContain('ลำดับพี่น้อง')
    expect(html).toContain('ครอบครัว')
    expect(html).toContain(ui.startLife)
  })
})
