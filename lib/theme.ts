/**
 * Shared theme colors for the app. Update here to change globally.
 */
export const DARK_BG = "#0A0015";
export const TEXT_LIGHT = "#E9E0F0";
export const ACCENT = "#E9FEFF";
/** Text color for buttons with ACCENT background (for contrast). */
export const ACCENT_BUTTON_TEXT = "#000d15";
export const WARNING = "#FBBF24";
export const ERROR = "#F87171";

/** Style object for dark full-screen backgrounds (e.g. loading/fallback screens). */
export const darkScreenStyle = {
  backgroundColor: DARK_BG,
  color: TEXT_LIGHT,
} as const;
