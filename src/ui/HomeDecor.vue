<template>
  <div class="home-decor" aria-hidden="true">
    <div class="home-six-color-band" />
    <svg class="home-fabric" width="100%" height="100%">
      <defs>
        <pattern id="isan-fabric-pattern" patternUnits="userSpaceOnUse" width="120" height="120">
          <rect width="120" height="120" fill="#d62f2a" />
          <g fill="#f4d58a">
            <ellipse cx="60" cy="22" rx="8" ry="18" /><ellipse cx="60" cy="98" rx="8" ry="18" />
            <ellipse cx="22" cy="60" rx="18" ry="8" /><ellipse cx="98" cy="60" rx="18" ry="8" />
            <ellipse cx="33" cy="33" rx="7" ry="15" transform="rotate(-45 33 33)" /><ellipse cx="87" cy="33" rx="7" ry="15" transform="rotate(45 87 33)" />
            <ellipse cx="33" cy="87" rx="7" ry="15" transform="rotate(45 33 87)" /><ellipse cx="87" cy="87" rx="7" ry="15" transform="rotate(-45 87 87)" />
          </g>
          <g fill="#2e9e4f">
            <ellipse cx="20" cy="20" rx="11" ry="5" transform="rotate(-38 20 20)" /><ellipse cx="101" cy="19" rx="11" ry="5" transform="rotate(38 101 19)" />
            <ellipse cx="19" cy="101" rx="11" ry="5" transform="rotate(38 19 101)" /><ellipse cx="101" cy="101" rx="11" ry="5" transform="rotate(-38 101 101)" />
          </g>
          <g transform="translate(60 60)">
            <circle r="23" fill="#d6246e" /><circle r="17" fill="#f28aa9" /><circle r="10" fill="#fff" />
            <circle r="3" fill="#f4d58a" />
          </g>
          <g fill="#f57c1f"><circle cx="8" cy="60" r="5" /><circle cx="112" cy="60" r="5" /><circle cx="60" cy="8" r="5" /><circle cx="60" cy="112" r="5" /></g>
          <circle cx="8" cy="8" r="4" fill="#f4d58a" /><circle cx="112" cy="112" r="4" fill="#f4d58a" />
        </pattern>
        <g id="garland-block">
          <rect x="0" y="0" width="27" height="36" rx="7" fill="currentColor" />
          <circle cx="8" cy="10" r="3" fill="#fff" fill-opacity=".36" /><circle cx="18" cy="24" r="4" fill="#fff" fill-opacity=".28" />
        </g>
        <g id="garland-rose">
          <ellipse cx="7" cy="14" rx="8" ry="4" fill="#2e9e4f" transform="rotate(-35 7 14)" />
          <ellipse cx="37" cy="14" rx="8" ry="4" fill="#2e9e4f" transform="rotate(35 37 14)" />
          <circle cx="22" cy="13" r="12" fill="#d6246e" /><circle cx="16" cy="12" r="6" fill="#f28aa9" />
          <circle cx="27" cy="12" r="6" fill="#f4a5bc" /><circle cx="22" cy="18" r="6" fill="#fff" />
        </g>
      </defs>
      <rect width="100%" height="100%" fill="url(#isan-fabric-pattern)" />
      <rect width="100%" height="100%" fill="#0f1a2e" fill-opacity=".18" />
      <line x1="118" y1="0" x2="118" y2="100%" stroke="#f6efe0" stroke-width="2" stroke-dasharray="7 6" />
      <g class="home-garlands" transform="translate(126 16)">
        <path d="M13 12V245M54 52V285" stroke="#e6b23d" stroke-width="2" />
        <g transform="translate(0 15)">
          <use href="#garland-block" y="0" style="color:#1e88e5" /><use href="#garland-block" y="34" style="color:#e6b23d" />
          <use href="#garland-block" y="68" style="color:#d62f2a" /><use href="#garland-block" y="102" style="color:#f6efe0" />
          <use href="#garland-block" y="136" style="color:#e8457c" /><use href="#garland-block" y="170" style="color:#2e9e4f" />
          <use href="#garland-block" y="204" style="color:#f57c1f" />
        </g>
        <use href="#garland-rose" x="-9" y="248" />
        <g class="home-garland-second" transform="translate(41 40)">
          <use href="#garland-block" y="0" style="color:#1e88e5" /><use href="#garland-block" y="34" style="color:#e6b23d" />
          <use href="#garland-block" y="68" style="color:#d62f2a" /><use href="#garland-block" y="102" style="color:#f6efe0" />
          <use href="#garland-block" y="136" style="color:#e8457c" /><use href="#garland-block" y="170" style="color:#2e9e4f" />
          <use href="#garland-block" y="204" style="color:#f57c1f" />
        </g>
        <use href="#garland-rose" x="32" y="273" />
        <path d="M6 0Q33 13 60 0L52 22Q34 31 15 22Z" fill="#e8457c" />
      </g>
    </svg>
    <svg class="home-woven-fan" viewBox="0 0 300 420">
      <defs>
        <pattern id="woven-fan-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#e3c08a" />
          <path d="M0 0H10V10H20V20H30V30H0Z" fill="#d6246e" fill-opacity=".9" />
          <path d="M15 0V30M0 15H30" fill="none" stroke="#c9a468" stroke-width="2" />
        </pattern>
      </defs>
      <path d="M137 255L151 255L176 420L111 420Z" fill="#d9a727" stroke="#f6efe0" stroke-width="5" />
      <ellipse cx="145" cy="156" rx="140" ry="160" fill="url(#woven-fan-pattern)" stroke="#f6efe0" stroke-width="5" />
      <circle cx="145" cy="284" r="12" fill="#d9a727" stroke="#f6efe0" stroke-width="4" />
    </svg>
  </div>
</template>

<style>
.home-decor { position: fixed; inset: 0; z-index: 2; pointer-events: none; }
.home-six-color-band { position: absolute; top: 0; left: 120px; right: 0; height: 16px; background: repeating-linear-gradient(90deg,#d62f2a 0 32px,#e6b23d 32px 64px,#1e88e5 64px 96px,#f6efe0 96px 128px,#2e9e4f 128px 160px,#f57c1f 160px 192px); }
.home-fabric { position: absolute; inset: 0 auto 0 0; width: 120px; height: 100%; overflow: visible; }
.home-garlands { transform-origin: 0 0; }
.home-woven-fan { position: absolute; z-index: 1; left: 43%; bottom: -170px; width: 240px; height: 340px; overflow: visible; transform: rotate(-14deg); pointer-events: none; }
@media (max-width: 900px) {
  .home-fabric { display: none; }
  .home-six-color-band { left: 0; }
  .home-woven-fan, .home-garland-second { display: none; }
}
</style>
