"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/** Returns a random hex with 100% saturation (for guess screen initial value). */
export function randomFullSaturationHex(): string {
  const h = Math.floor(Math.random() * 360);
  const l = Math.floor(Math.random() * 101);
  return hslToHex(h, 100, l);
}

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h_ = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h_ = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h_ = ((b - r) / d + 2) / 6;
        break;
      default:
        h_ = ((r - g) / d + 4) / 6;
    }
  }
  return [h_ * 360, s * 100, l * 100];
}

export interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(50);
  const areaRef = useRef<HTMLDivElement>(null);
  const isInternal = useRef(false);

  useEffect(() => {
    if (value && !isInternal.current) {
      const [h, s, l] = hexToHsl(value);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
    isInternal.current = false;
  }, [value]);

  const updateHex = useCallback(
    (h: number, s: number, l: number) => {
      isInternal.current = true;
      onChange(hslToHex(h, s, l));
    },
    [onChange]
  );

  const handleAreaMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const h = Math.max(0, Math.min(360, x * 360));
      const l = Math.max(0, Math.min(100, (1 - y) * 100));
      setHue(h);
      setLightness(l);
      updateHex(h, saturation, l);
    },
    [saturation, updateHex]
  );

  const handleAreaPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleAreaMove(e.clientX, e.clientY);
  };

  const handleAreaPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1 && e.pointerType !== "touch") return;
    handleAreaMove(e.clientX, e.clientY);
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = Number(e.target.value);
    setSaturation(s);
    updateHex(hue, s, lightness);
  };

  const currentHex = hslToHex(hue, saturation, lightness);

  return (
    <div className="w-full space-y-4">
      <p className="text-sm text-gray-500">
        Drag: left/right = Hue, up/down = Lightness. Bar below = Saturation.
      </p>
      <div
        ref={areaRef}
        className="w-full aspect-square max-w-sm mx-auto rounded-xl border-2 border-gray-300 dark:border-gray-600 cursor-crosshair touch-none select-none relative overflow-hidden"
        style={{ backgroundColor: currentHex }}
        onPointerDown={handleAreaPointerDown}
        onPointerMove={handleAreaPointerMove}
      >
        <div
          className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg pointer-events-none ring-2 ring-black/20"
          style={{
            left: `${(hue / 360) * 100}%`,
            top: `${(1 - lightness / 100) * 100}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "transparent",
          }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Saturation</label>
        <input
          type="range"
          min="0"
          max="100"
          value={saturation}
          onChange={handleSaturationChange}
          className="w-full h-3 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600"
        />
      </div>
    </div>
  );
}
