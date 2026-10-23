// Layered chibi pixel sprites, 16x22 grid. Layer ids:
// Body and clothing are vector layers on a shared 16x22 pixel grid.
// TODO(verify): local review needed before adding named regional garments.
export const LAYERS: Record<string, [string, string][]> = {
 "bd": [
  ["sk", "M5 2h6v1H5zM4 3h8v1H4zM3 4h10v5H3zM4 9h8v1H4zM5 10h6v1H5zM7 11h2v1H7z"],
  ["sl", "M4 5h1v2H4z"],
  ["sh", "M12 5h1v4h-1zM5 10h6v1H5zM7 11h2v1H7z"],
  ["ck", "M4 8h1v1H4zM11 8h1v1h-1z"],
  ["ee", "M5 6h2v2H5zM9 6h2v2H9z"],
  ["ew", "M5 6h1v1H5zM9 6h1v1H9z"],
  ["lp", "M7 9h2v1H7z"]
 ],
 "swaddle": [["ac", "M4 12h8v1H4zM3 13h10v5H3zM4 18h8v3H4zM2 15h2v3H2zM12 15h2v3h-2z"]],
 "babyCap": [["hr", "M4 2h8v1H4zM3 3h10v2H3zM4 5h8v1H4z"], ["ac", "M7 2h2v1H7z"]],
 "romper": [["tp", "M4 12h8v5H4zM2 13h2v4H2zM12 13h2v4h-2z"], ["bt", "M4 17h8v2H4zM5 19h2v2H5zM9 19h2v2H9z"]],
 "ofactory": [["tp", "M4 12h8v5H4zM2 13h2v4H2zM12 13h2v4h-2z"], ["ac", "M5 13h2v2H5zM9 13h2v2H9z"], ["bt", "M4 17h8v1H4zM5 18h2v3H5zM9 18h2v3H9z"]],
 "ofishing": [["tp", "M4 12h8v5H4zM2 13h2v4H2zM12 13h2v4h-2z"], ["ac", "M4 15h8v1H4z"], ["bt", "M4 17h8v1H4zM5 18h2v3H5zM9 18h2v3H9z"]],
 "oconstruction": [["tp", "M4 12h8v6H4zM2 13h2v4H2zM12 13h2v4h-2z"], ["ac", "M4 13h8v2H4z"], ["bt", "M4 18h8v1H4zM5 19h2v2H5zM9 19h2v2H9z"]],
 "hardhat": [["st", "M4 2h8v2H4zM3 4h10v1H3z"]],
 "bag": [["ac", "M12 13h2v6h-2zM13 14h1v4h-1z"]],
 "scarf": [["ac", "M3 12h10v2H3zM11 14h2v4h-2z"]],
 "shopJacket": [["ac", "M3 12h2v5H3zM11 12h2v5h-2zM6 12h1v5H6zM9 12h1v5H9z"]],
 "cane": [["ca", "M14 13h1v8h-1zM13 12h2v1h-2z"]],
 "ow": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v4H2zM12 13h2v4h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M4 17h8v1H4zM5 18h2v3H5zM9 18h2v3H9z"
  ],
  [
   "ee",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "oc": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M4 17h8v1H4zM5 18h2v3H5zM9 18h2v3H9z"
  ],
  [
   "ac",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "osm": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M4 17h8v2H4z"
  ],
  [
   "ee",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "osf": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M3 17h10v2H3z"
  ],
  [
   "ee",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "op": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M4 17h8v1H4zM3 18h10v3H3z"
  ],
  [
   "ac",
   "M3 19h10v1H3z"
  ],
  [
   "ee",
   "M5 21h2v1H5zM9 21h2v1H9z"
  ]
 ],
 "ox": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v4H2zM12 13h2v4h-2zM6 11h4v1H6z"
  ],
  [
   "ac",
   "M7 13h1v1H7zM7 15h1v1H7z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M3 17h10v1H3zM4 18h3v3H4zM9 18h3v3H9z"
  ],
  [
   "ee",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "ok": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2zM6 11h4v1H6zM4 17h8v3H4z"
  ],
  [
   "ac",
   "M4 12h8v1H4zM7 13h1v1H7zM7 15h1v1H7zM4 19h8v1H4z"
  ],
  [
   "ee",
   "M5 21h2v1H5zM9 21h2v1H9z"
  ]
 ],
 "os": [
  [
   "tp",
   "M4 12h8v6H4zM2 13h2v4H2zM12 13h2v4h-2z"
  ],
  [
   "wh",
   "M7 12h2v3H7z"
  ],
  [
   "ti",
   "M8 12h1v4H8z"
  ],
  [
   "sd",
   "M4 17h8v1H4z"
  ],
  [
   "bt",
   "M4 18h8v1H4zM5 19h2v2H5zM9 19h2v2H9z"
  ],
  [
   "ee",
   "M4 21h3v1H4zM9 21h3v1H9z"
  ]
 ],
 "ol": [
  [
   "tp",
   "M4 12h8v5H4zM2 13h2v3H2zM12 13h2v3h-2z"
  ],
  [
   "sd",
   "M4 16h8v1H4z"
  ],
  [
   "bt",
   "M4 17h8v3H4z"
  ],
  [
   "ac",
   "M4 17h8v1H4z"
  ],
  [
   "ee",
   "M5 21h2v1H5zM9 21h2v1H9z"
  ]
 ],
 "ap": [
  [
   "ti",
   "M5 12h1v1H5zM10 12h1v1h-1zM4 13h8v7H4z"
  ],
  [
   "sd",
   "M6 16h4v2H6z"
  ]
 ],
 "kr": [
  [
   "ac",
   "M4 17h8v1H4zM11 18h1v3h-1z"
  ]
 ],
 "sw": [
  [
   "ac",
   "M3 12h10v1H3zM3 13h2v4H3zM11 13h2v4h-2z"
  ]
 ],
 "hc": [
  [
   "hr",
   "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h1v2H3zM12 5h1v2h-1z"
  ]
 ],
 "hp": [
  [
   "hr",
   "M4 1h8v1H4zM3 2h10v3H3zM3 5h2v1H3zM11 5h2v2h-2z"
  ]
 ],
 "hb": [
  [
   "hr",
   "M6 0h4v1H6zM5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h1v3H3zM12 5h1v3h-1z"
  ]
 ],
 "hl": [
  [
   "hr",
   "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM2 5h2v8H2zM12 5h2v8h-2z"
  ]
 ],
 "hbo": [
  [
   "hr",
   "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM2 5h2v5H2zM12 5h2v5h-2z"
  ]
 ],
 "hshort": [["hr", "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h2v2H3zM11 5h2v2h-2z"]],
 "hside": [["hr", "M4 1h8v1H4zM3 2h10v2H3zM3 4h5v2H3zM11 4h2v3h-2z"]],
 "hfringe": [["hr", "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM4 5h2v2H4zM7 5h2v2H7zM11 5h1v2h-1z"]],
 "hcurl": [["hr", "M5 1h2v2H5zM9 1h2v2H9zM3 3h3v2H3zM7 2h2v3H7zM10 3h3v2h-3zM3 5h2v3H3zM11 5h2v3h-2z"]],
 "hunder": [["hr", "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h2v1H3zM11 5h2v1h-2zM5 6h6v1H5z"]],
 "hbuzz": [["hr", "M5 2h6v1H5zM4 3h8v2H4zM4 5h2v1H4zM10 5h2v1h-2z"]],
 "hwave": [["hr", "M5 1h6v1H5zM4 2h3v1H4zM8 2h4v1H8zM3 3h10v2H3zM3 5h2v2H3zM11 5h2v2h-2z"]],
 "hpon": [["hr", "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h2v5H3zM11 5h2v3h-2zM12 7h2v4h-2z"]],
 "hbraid": [["hr", "M5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM2 5h2v4H2zM12 5h2v4h-2zM3 9h1v3H3zM12 9h1v3h-1z"]],
 "hbun": [["hr", "M6 0h4v1H6zM5 1h6v1H5zM4 2h8v1H4zM3 3h10v2H3zM3 5h2v3H3zM11 5h2v3h-2z"]],
 "ht": [
  [
   "st",
   "M1 4h14v1H1zM4 1h8v3H4z"
  ],
  [
   "ac",
   "M4 3h8v1H4z"
  ]
 ],
 "wr": [
  [
   "sh",
   "M4 5h2v1H4zM10 5h2v1h-2zM3 8h1v1H3zM12 8h1v1h-1z"
  ]
 ],
 "gl": [
  [
   "fr",
   "M4 5h3v1H4zM9 5h3v1H9zM4 6h1v2H4zM6 6h1v2H6zM9 6h1v2H9zM11 6h1v2h-1zM4 8h3v1H4zM9 8h3v1H9zM7 6h2v1H7z"
  ]
 ]
};

export type SpriteAgeGroup = 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'elder'
export const BODY_BY_AGE: Record<SpriteAgeGroup, [string, string][]> = {
  infant: [['sk', 'M2 13h2v4H2zM12 13h2v4h-2zM5 18h2v2H5zM9 18h2v2H9z']],
  toddler: [['sk', 'M2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z']],
  child: [['sk', 'M2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z']],
  teen: [['sk', 'M2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z']],
  adult: [['sk', 'M2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z']],
  elder: [['sk', 'M2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z']],
}

export interface Palette { skin: string; shade: string; lip: string; hair: string; top: string; btm: string; acc: string; tie?: string }

// Skin tone presets (skin, shade, lip). Tune freely.
export const TONES: Record<string, Pick<Palette, 'skin' | 'shade' | 'lip'>> = {
  s0: { skin: '#E4C7AD', shade: '#C9A990', lip: '#A86E62' },
  s1: { skin: '#D7B29A', shade: '#B9957F', lip: '#9E655B' },
  s2: { skin: '#C89F86', shade: '#AA806A', lip: '#965E55' },
  s3: { skin: '#B88A70', shade: '#9B7059', lip: '#88554C' },
  s4: { skin: '#A6765F', shade: '#895F4D', lip: '#794B45' },
  s5: { skin: '#8D634E', shade: '#73503F', lip: '#68423D' },
};

const mix = (a: string, b: string, t: number) => {
  const n = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16)
  return '#' + [0, 1, 2]
    .map(i => Math.round(n(a, i) + (n(b, i) - n(a, i)) * t).toString(16).padStart(2, '0'))
    .join('')
}

const FILL: Record<string, (p: Palette) => string> = {
  sk: p => p.skin, sh: p => p.shade, ck: p => p.lip, lp: p => p.lip, ee: () => '#1a1410',
  hr: p => p.hair, tp: p => p.top, bt: p => p.btm, ac: p => p.acc, st: () => '#d9b25f', ca: p => p.acc,
  sd: () => '#000', fr: () => '#2a2420', ti: p => p.tie ?? '#b3262d', wh: () => '#f2efe6',
  sl: p => mix(p.skin, '#fff1d6', 0.3), ew: () => '#f4f1e8',
};
const OPACITY: Record<string, number> = { ck: 0.45, sd: 0.2 };

const GRID_W = 16
const GRID_H = 22
const OUTLINE = '#2b1a14'

const lighten = (color: string) => mix(color, '#fff1d6', 0.25)
const darken = (color: string) => mix(color, '#2a1840', 0.3)

function pixels(d: string): Set<number> {
  const result = new Set<number>()
  for (const match of d.matchAll(/M(\d+) (\d+)h(\d+)v(\d+)/g)) {
    const [x, y, width, height] = match.slice(1).map(Number) as [number, number, number, number]
    for (let row = y; row < y + height; row++)
      for (let column = x; column < x + width; column++)
        if (column < GRID_W && row < GRID_H) result.add(row * GRID_W + column)
  }
  return result
}

const toPath = (set: Set<number>) =>
  [...set].map(key => `M${key % GRID_W} ${Math.floor(key / GRID_W)}h1v1h-1z`).join('')

function shadeOverlay(d: string, base: string, withLight: boolean): [string, string][] {
  const shape = pixels(d)
  const lit = new Set<number>()
  const dark = new Set<number>()
  for (const key of shape) {
    const x = key % GRID_W
    if (withLight && !shape.has(key - GRID_W) && x <= 8) lit.add(key)
    else if (!shape.has(key + GRID_W) || (!shape.has(key + 1) && x >= 8)) dark.add(key)
  }
  const overlays: [string, string][] = []
  if (lit.size) overlays.push([lighten(base), toPath(lit)])
  if (dark.size) overlays.push([darken(base), toPath(dark)])
  return overlays
}

function outlinePath(layers: [string, string][]): string {
  const filled = new Set<number>()
  for (const [color, path] of layers)
    if (!OPACITY[color]) for (const key of pixels(path)) filled.add(key)
  const outline = new Set<number>()
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const key = y * GRID_W + x
      if (filled.has(key)) continue
      if ((x > 0 && filled.has(key - 1)) || (x < GRID_W - 1 && filled.has(key + 1)) ||
          filled.has(key - GRID_W) || filled.has(key + GRID_W)) outline.add(key)
    }
  }
  return toPath(outline)
}

/** Compose a portrait with a generated silhouette outline and per-layer shading. */
export function portraitSvg(layerIds: string[], p: Palette, scale = 6, ageGroup: SpriteAgeGroup = 'adult'): string {
  const layers = [...LAYERS.bd!, ...BODY_BY_AGE[ageGroup], ...layerIds.flatMap(id => LAYERS[id] ?? [])]
  const paths: string[] = [`<path fill="${OUTLINE}" d="${outlinePath(layers)}"/>`]
  const add = (fill: string, d: string, opacity?: number) =>
    paths.push(`<path fill="${fill}"${opacity ? ` fill-opacity="${opacity}"` : ''} d="${d}"/>`)

  for (const [color, path] of layers) {
    add(FILL[color](p), path, OPACITY[color])
    if (color === 'hr') for (const [fill, overlay] of shadeOverlay(path, p.hair, true)) add(fill, overlay)
    if (color === 'tp') for (const [fill, overlay] of shadeOverlay(path, p.top, false)) add(fill, overlay)
    if (color === 'bt') for (const [fill, overlay] of shadeOverlay(path, p.btm, false)) add(fill, overlay)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" width="${16 * scale}" height="${22 * scale}" shape-rendering="crispEdges">${paths.join('')}</svg>`
}
