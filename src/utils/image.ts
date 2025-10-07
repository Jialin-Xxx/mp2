import { Character } from "../types";

const houseColor: Record<string, string> = {
  gryffindor: "#b03030",
  slytherin:  "#1f7a3a",
  ravenclaw:  "#1b4f9c",
  hufflepuff: "#c1a11e",
};

function initials(name?: string) {
  const parts = (name ?? "Unknown").trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? "").join("") || "HP";
}

function placeholderSVG(name: string, house?: string) {
  const bg = houseColor[(house ?? "").toLowerCase()] ?? "#303446";
  const text = initials(name);
  // 纯 SVG，无外链字体，保证不联网也能渲染
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${bg}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f1320" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="300" cy="300" r="130" fill="rgba(255,255,255,0.08)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="160" font-family="system-ui, -apple-system, Segoe UI, Roboto"
        fill="rgba(255,255,255,0.92)">${text}</text>
</svg>`;
}

export function characterImageURL(c: Character) {
  if (c.image && c.image.trim() !== "") return c.image;
  const svg = placeholderSVG(c.name, c.house);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
