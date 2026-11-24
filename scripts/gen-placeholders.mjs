// Generates simple placeholder garment illustrations (SVG) for sample products.
// Replace with real product photos once the owner provides them.
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "public/placeholders";
mkdirSync(OUT, { recursive: true });

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s) => Math.max(0, Math.min(255, ((n >> s) & 255) + amt));
  return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, "0")}`;
};

const svg = (body, { w = 400, h = 500, bg } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${
    bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""
  }${body}</svg>`;

const shapes = {
  hoodie: (c, back) => {
    const d = shade(c, -28);
    return `<path d="M120 150 Q200 128 280 150 L332 192 L362 362 L326 372 L300 262 L302 404 Q200 420 98 404 L100 262 L74 372 L38 362 L68 192 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
<path d="M146 156 Q142 78 200 72 Q258 78 254 156 Q200 178 146 156 Z" fill="${shade(c, -10)}" stroke="${d}" stroke-width="3"/>
${back ? `<rect x="138" y="190" width="124" height="150" rx="10" fill="${shade(c, 14)}" stroke="${d}" stroke-width="2"/>` : `<path d="M200 166 L200 404" stroke="${d}" stroke-width="3"/><path d="M182 160 L178 230 M218 160 L222 230" stroke="${d}" stroke-width="2"/><path d="M130 330 L180 330 L180 380 M270 330 L220 330 L220 380" fill="none" stroke="${d}" stroke-width="2"/>`}
<path d="M98 398 Q200 414 302 398 L302 410 Q200 428 98 410 Z" fill="${d}"/>`;
  },
  jacket: (c, back) => {
    const d = shade(c, -30);
    return `<path d="M126 120 L170 104 L200 128 L230 104 L274 120 L334 168 L360 372 L324 380 L302 250 L304 402 L96 402 L98 250 L76 380 L40 372 L66 168 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
${back ? `<path d="M120 230 L280 230" stroke="${d}" stroke-width="2"/>` : `<path d="M170 104 L200 170 L230 104 M200 170 L200 402" fill="none" stroke="${d}" stroke-width="3"/><rect x="122" y="200" width="44" height="40" rx="4" fill="none" stroke="${d}" stroke-width="2"/><rect x="234" y="200" width="44" height="40" rx="4" fill="none" stroke="${d}" stroke-width="2"/>`}
<rect x="96" y="388" width="208" height="16" fill="${d}"/>`;
  },
  coat: (c, back) => {
    const d = shade(c, -30);
    return `<path d="M136 96 L176 82 L200 112 L224 82 L264 96 L322 140 L348 380 L314 388 L296 240 L306 470 L94 470 L104 240 L86 388 L52 380 L78 140 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
<path d="M160 80 Q200 40 240 80 L224 82 L200 112 L176 82 Z" fill="${shade(c, -12)}" stroke="${d}" stroke-width="3"/>
${back ? `<path d="M200 300 L200 470" stroke="${d}" stroke-width="2"/>` : `<path d="M200 112 L200 470" stroke="${d}" stroke-width="3"/>${[170, 230, 290, 350].map((y) => `<circle cx="214" cy="${y}" r="5" fill="${d}"/>`).join("")}`}`;
  },
  shirt: (c, back, plaid) => {
    const d = shade(c, -40);
    const pat = plaid
      ? `<defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${c}"/><rect width="40" height="12" fill="${d}" opacity=".55"/><rect width="12" height="40" fill="${d}" opacity=".55"/><path d="M0 26 H40 M26 0 V40" stroke="#ffffff" stroke-width="2" opacity=".5"/></pattern></defs>`
      : "";
    const fill = plaid ? "url(#p)" : c;
    return `${pat}<path d="M138 104 L176 92 L200 116 L224 92 L262 104 L330 150 L356 380 L322 388 L298 240 L300 420 L100 420 L102 240 L78 388 L44 380 L70 150 Z" fill="${fill}" stroke="${d}" stroke-width="3"/>
${back ? "" : `<path d="M176 92 L200 140 L224 92" fill="#fff" stroke="${d}" stroke-width="3"/><path d="M200 140 L200 420" stroke="${d}" stroke-width="2"/>${[170, 220, 270, 320, 370].map((y) => `<circle cx="200" cy="${y}" r="4" fill="#fff" stroke="${d}"/>`).join("")}`}`;
  },
  tee: (c, back) => {
    const d = shade(c, -26);
    return `<path d="M136 110 Q200 132 264 110 L340 150 L318 220 L290 206 L292 420 L108 420 L110 206 L82 220 L60 150 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
${back ? `<path d="M140 112 Q200 124 260 112" fill="none" stroke="${d}" stroke-width="3"/>` : `<path d="M166 116 Q200 150 234 116" fill="none" stroke="${d}" stroke-width="4"/>`}`;
  },
  pants: (c, back, jeans) => {
    const d = shade(c, -30);
    return `<path d="M134 70 L266 70 L284 466 L214 466 L200 190 L186 466 L116 466 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
<rect x="134" y="70" width="132" height="22" fill="${shade(c, -14)}" stroke="${d}" stroke-width="2"/>
${jeans ? `<path d="M140 92 Q160 140 196 140 M260 92 Q240 140 204 140" fill="none" stroke="#d9a441" stroke-width="2" stroke-dasharray="5 4"/><path d="M160 200 L150 466 M240 200 L250 466" stroke="${shade(c, 18)}" stroke-width="2"/>` : `<path d="M200 92 L200 190" stroke="${d}" stroke-width="2"/>`}
${back ? `<rect x="148" y="110" width="40" height="44" rx="4" fill="none" stroke="${d}" stroke-width="2"/><rect x="212" y="110" width="40" height="44" rx="4" fill="none" stroke="${d}" stroke-width="2"/>` : ""}`;
  },
  sneaker: (c, back, high) => {
    const d = shade(c, -36);
    const top = high ? 150 : 205;
    return `<path d="M70 300 L78 ${top + 30} Q90 ${top} 130 ${top} L170 ${top} Q190 ${top + 40} 230 250 L300 268 Q340 276 340 302 L340 318 L70 318 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
<rect x="62" y="314" width="290" height="26" rx="10" fill="#f6f4f0" stroke="${shade("#f6f4f0", -40)}" stroke-width="3"/>
${back ? "" : `<path d="M160 ${top + 30} L230 262 M150 ${top + 52} L210 270 M140 ${top + 74} L190 282" stroke="${d}" stroke-width="3"/>`}`;
  },
  boot: (c, back) => {
    const d = shade(c, -32);
    return `<path d="M110 300 L112 140 L190 140 L196 236 Q260 250 312 270 Q344 282 344 306 L344 318 L104 318 Z" fill="${c}" stroke="${d}" stroke-width="3"/>
<path d="M112 172 Q150 160 190 172 L190 230 Q150 218 112 230 Z" fill="${shade(c, -12)}"/>
<rect x="98" y="314" width="256" height="24" rx="8" fill="${shade(c, -55)}"/>
${back ? "" : `<path d="M190 150 Q206 140 214 150" fill="none" stroke="${d}" stroke-width="3"/>`}`;
  },
};

const products = {
  "hoodie-stone": ["hoodie", "#d9d5cf"],
  "hoodie-black": ["hoodie", "#2b2b2b"],
  "jacket-denim": ["jacket", "#9cb3c9"],
  "jacket-olive": ["jacket", "#7a7a5c"],
  "coat-sand": ["coat", "#cdb994"],
  "coat-charcoal": ["coat", "#4a4a4a"],
  "shirt-plaid": ["shirt", "#b8323a", true],
  "shirt-white": ["shirt", "#f1f0ec"],
  "tee-cream": ["tee", "#ece6da"],
  "tee-black": ["tee", "#1f1f1f"],
  "pants-black": ["pants", "#232323"],
  "jeans-light": ["pants", "#a9bfd3", true],
  "sneaker-black": ["sneaker", "#202020", true],
  "sneaker-red": ["sneaker", "#c0353b", true],
  "sneaker-navy": ["sneaker", "#273a69"],
  "boot-cream": ["boot", "#d8d3c6"],
};

for (const [name, [kind, color, flag]] of Object.entries(products)) {
  writeFileSync(`${OUT}/${name}-1.svg`, svg(shapes[kind](color, false, flag)));
  writeFileSync(`${OUT}/${name}-2.svg`, svg(shapes[kind](color, true, flag)));
  // Close-up: same illustration zoomed in.
  writeFileSync(
    `${OUT}/${name}-3.svg`,
    svg(`<g transform="translate(-200 -150) scale(2)">${shapes[kind](color, false, flag)}</g>`),
  );
}

// Editorial "look" figures (head + top + bottom) on a warm backdrop.
const look = (id, bg, skin, hair, top, topColor, bottom, bottomColor, w = 400, h = 500, s = 1) => {
  const fig = `<g transform="translate(${w / 2 - 200 * s} ${h - 500 * s}) scale(${s})">
<g transform="translate(70 250) scale(.65)">${shapes[bottom](bottomColor, false, bottom === "pants" && bottomColor.startsWith("#a"))}</g>
<g transform="translate(60 60) scale(.7)">${shapes[top](topColor, false)}</g>
<ellipse cx="200" cy="62" rx="26" ry="32" fill="${skin}"/>
<path d="M172 58 Q170 22 200 22 Q232 22 228 58 Q222 40 200 40 Q180 40 172 58 Z" fill="${hair}"/>
</g>`;
  writeFileSync(
    `${OUT}/${id}.svg`,
    svg(
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(bg, 10)}"/><stop offset="1" stop-color="${shade(bg, -18)}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><ellipse cx="${w / 2}" cy="${h - 12}" rx="120" ry="10" fill="#000" opacity=".08"/>${fig}`,
      { w, h },
    ),
  );
};

look("look-1", "#cfc6ba", "#c69c7d", "#3a2a20", "jacket", "#b9a27a", "pants", "#b9a27a");
look("look-2", "#c9c7c3", "#d2a988", "#1d1d1d", "hoodie", "#9a9a9a", "pants", "#2a2a2a");
look("look-3", "#d6cfc4", "#a87a5b", "#141414", "coat", "#4a4a4a", "pants", "#a9bfd3");
look("look-4", "#cbc3b6", "#c99f80", "#5a3d2b", "shirt", "#b8323a", "pants", "#232323");
look("hero-1", "#c4b8a8", "#c69c7d", "#3a2a20", "hoodie", "#c2ab86", "pants", "#8f7f66", 800, 640, 1.25);
look("hero-2", "#bfc3c6", "#d2a988", "#1d1d1d", "coat", "#3b3b3b", "pants", "#2a2a2a", 800, 640, 1.25);

console.info("placeholders written to", OUT);
