// Layered chibi pixel sprites, 16x22 grid. Layer ids:
// body: bd (always drawn first)
// outfits: ow farmer, oc casual, osm school boy, osf school girl, op pha-thung, ox samfoo, ok cheongsam, os suit, ol office woman
// extras: ap apron, kr waist cloth, sw shawl, ht straw hat, gl glasses, wr wrinkles
// hair: hc crop, hp side part, hb bun, hl long, hbo bob
export const LAYERS: Record<string, [string, string][]> = {
 "bd": [
  [
   "sk",
   "M5 2h6v1H5zM4 3h8v1H4zM3 4h10v5H3zM4 9h8v1H4zM5 10h6v1H5zM7 11h2v1H7zM2 13h2v5H2zM12 13h2v5h-2zM5 18h2v4H5zM9 18h2v4H9z"
  ],
  [
   "sh",
   "M5 10h6v1H5zM7 11h2v1H7z"
  ],
  [
   "ck",
   "M4 8h1v1H4zM11 8h1v1h-1z"
  ],
  [
   "ee",
   "M5 6h1v2H5zM10 6h1v2h-1z"
  ],
  [
   "lp",
   "M7 9h2v1H7z"
  ]
 ],
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

export interface Palette { skin: string; shade: string; lip: string; hair: string; top: string; btm: string; acc: string; tie?: string }

// Skin tone presets (skin, shade, lip). Tune freely.
export const TONES: Record<string, Pick<Palette, 'skin' | 'shade' | 'lip'>> = {
  s0: { skin: '#E3BC95', shade: '#C9A07A', lip: '#B26B5A' },
  s1: { skin: '#D2A073', shade: '#B88A5F', lip: '#A85F4B' },
  s2: { skin: '#C99466', shade: '#AE7C52', lip: '#9E5A47' },
  s3: { skin: '#BC8458', shade: '#A06E46', lip: '#9A5545' },
  s4: { skin: '#A86F48', shade: '#8E5A39', lip: '#8A4A3A' },
  s5: { skin: '#9A6540', shade: '#7F5233', lip: '#7A4638' },
};

const FILL: Record<string, (p: Palette) => string> = {
  sk: p => p.skin, sh: p => p.shade, ck: p => p.lip, lp: p => p.lip, ee: () => '#1a1410',
  hr: p => p.hair, tp: p => p.top, bt: p => p.btm, ac: p => p.acc, st: () => '#d9b25f',
  sd: () => '#000', fr: () => '#2a2420', ti: p => p.tie ?? '#b3262d', wh: () => '#f2efe6',
};
const OPACITY: Record<string, number> = { ck: 0.45, sd: 0.2 };

/** Compose a portrait. Order matters: outfit, extras, hair, hat/glasses/wrinkles last. */
export function portraitSvg(layerIds: string[], p: Palette, scale = 6): string {
  const paths = ['bd', ...layerIds].flatMap(id =>
    (LAYERS[id] ?? []).map(([c, d]) =>
      `<path fill="${FILL[c](p)}"${OPACITY[c] ? ` fill-opacity="${OPACITY[c]}"` : ''} d="${d}"/>`));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" width="${16 * scale}" height="${22 * scale}" shape-rendering="crispEdges">${paths.join('')}</svg>`;
}
