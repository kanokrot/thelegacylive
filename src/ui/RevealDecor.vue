<template>
  <div class="reveal-decor" aria-hidden="true">
    <svg class="reveal-decor-stripe" viewBox="0 0 192 12" preserveAspectRatio="none" shape-rendering="crispEdges">
      <defs>
        <pattern id="reveal-six-color-stripe" width="192" height="12" patternUnits="userSpaceOnUse">
          <rect x="0" width="32" height="12" fill="#d62f2a" />
          <rect x="32" width="32" height="12" fill="#f2c40c" />
          <rect x="64" width="32" height="12" fill="#1e88e5" />
          <rect x="96" width="32" height="12" fill="#f6efe0" />
          <rect x="128" width="32" height="12" fill="#2e9e4f" />
          <rect x="160" width="32" height="12" fill="#f57c1f" />
        </pattern>
        <g id="reveal-pixel-tower">
          <rect x="6" y="0" width="2" height="1" fill="#e6b23d" />
          <rect x="5" y="1" width="4" height="1" fill="#e8c98a" />
          <rect x="4" y="2" width="6" height="1" fill="#c9a468" />
          <rect x="3" y="3" width="8" height="1" fill="#e8c98a" />
          <rect x="2" y="4" width="10" height="1" fill="#c9a468" />
          <rect x="1" y="5" width="12" height="1" fill="#e8c98a" />
          <rect y="6" width="14" height="12" fill="#e8c98a" />
          <rect x="1" y="7" width="12" height="1" fill="#c9a468" />
          <rect x="3" y="9" width="2" height="2" fill="#e6b23d" />
          <rect x="9" y="9" width="2" height="2" fill="#e6b23d" />
          <rect x="2" y="12" width="2" height="1" fill="#d6246e" />
          <rect x="6" y="12" width="2" height="1" fill="#d6246e" />
          <rect x="10" y="12" width="2" height="1" fill="#d6246e" />
          <rect x="6" y="14" width="2" height="4" fill="#9b6a2f" />
        </g>
      </defs>
      <rect width="100%" height="12" fill="url(#reveal-six-color-stripe)" />
    </svg>

    <svg class="reveal-decor-skyline" viewBox="0 0 1440 180" preserveAspectRatio="none" shape-rendering="crispEdges">
      <g class="reveal-tower reveal-tower-one" transform="translate(54 28) scale(8)"><use href="#reveal-pixel-tower" /></g>
      <g class="reveal-tower reveal-tower-two" transform="translate(326 28) scale(8)"><rect x="6" y="-1" width="2" height="1" fill="#e6b23d" /><use href="#reveal-pixel-tower" /></g>
      <g class="reveal-tower reveal-tower-three" transform="translate(614 28) scale(8)"><use href="#reveal-pixel-tower" /></g>
      <g class="reveal-tower reveal-tower-four" transform="translate(906 28) scale(8)"><rect x="5" y="-1" width="4" height="1" fill="#f4d58a" /><use href="#reveal-pixel-tower" /></g>
      <g class="reveal-tower reveal-tower-five" transform="translate(1210 28) scale(8)"><use href="#reveal-pixel-tower" /></g>
      <rect x="0" y="172" width="1440" height="4" fill="#c9a468" />
      <rect x="0" y="176" width="1440" height="2" fill="#d6246e" />
      <rect x="90" y="146" width="6" height="6" fill="#e6b23d" />
      <rect x="342" y="139" width="6" height="6" fill="#1e88e5" />
      <rect x="578" y="148" width="6" height="6" fill="#2e9e4f" />
      <rect x="856" y="137" width="6" height="6" fill="#f57c1f" />
      <rect x="1120" y="145" width="6" height="6" fill="#f6efe0" />
      <rect x="204" y="42" width="6" height="6" fill="#e6b23d" />
      <rect x="724" y="67" width="6" height="6" fill="#e6b23d" />
      <rect x="1034" y="35" width="6" height="6" fill="#e6b23d" />
      <rect x="1332" y="78" width="6" height="6" fill="#e6b23d" />
    </svg>
  </div>
</template>
