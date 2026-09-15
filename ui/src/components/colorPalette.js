export const COLOR_PALETTE = [
  { id: "branco", label: "Branco", value: "#FFFFFF", gradient: false },
  { id: "lilas", label: "Lilás", value: "#E9D5FF", gradient: false },
  { id: "rosa", label: "Rosa", value: "#FBCFE8", gradient: false },
  { id: "menta", label: "Menta", value: "#BBF7D0", gradient: false },
  { id: "ceu", label: "Céu", value: "#BFDBFE", gradient: false },
  {
    id: "g-roxo-rosa",
    label: "Roxo → Rosa",
    value: "linear-gradient(135deg, #C4B5FD, #F9A8D4)",
    gradient: true,
  },
  {
    id: "g-roxo-azul",
    label: "Roxo → Azul",
    value: "linear-gradient(135deg, #A78BFA, #93C5FD)",
    gradient: true,
  },
];

export const DEFAULT_COLOR = "#FFFFFF";

export function isGradient(value) {
  return typeof value === "string" && value.startsWith("linear-gradient");
}

export function gradientSwatchBackground(value) {
  return isGradient(value) ? value : undefined;
}

export function solidSwatchBackground(value) {
  return isGradient(value) ? undefined : value;
}

export function extractGradientStops(value) {
  const match = value && value.match(/linear-gradient\(135deg,\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)/);
  if (!match) return null;
  return { cor1: match[1], cor2: match[2] };
}

export function buildGradient(cor1, cor2) {
  const c1 = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cor1) ? cor1 : "#C4B5FD";
  const c2 = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cor2) ? cor2 : "#F9A8D4";
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

export function colorFallback(value, fallback = "#7c3aed") {
  if (isGradient(value)) {
    const stops = extractGradientStops(value);
    return stops ? stops.cor1 : fallback;
  }
  return value && typeof value === "string" ? value : fallback;
}