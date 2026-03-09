const PLAYER_ID_KEY = "chromoscientia_player_id";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getPlayerId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PLAYER_ID_KEY);
}
