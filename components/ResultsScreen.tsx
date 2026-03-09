"use client";

import { useMemo, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { acknowledgeResults } from "@/lib/room";
import { contrastColor, toCssHex } from "@/lib/colorContrast";
import { useFooterBackground } from "@/lib/FooterContext";
import { LeaveGameButton } from "@/components/LeaveGameButton";
import type { GameSnapshot, RoomSnapshot } from "@/lib/room";

export function ResultsScreen({
  roomCode,
  game,
  room,
  onAcknowledge,
}: {
  roomCode: string;
  game: GameSnapshot;
  room: RoomSnapshot;
  onAcknowledge?: () => void | Promise<void>;
}) {
  const refColor = game.referenceColor;
  const bgHex = useMemo(() => toCssHex(refColor), [refColor]);
  const textColor = useMemo(() => contrastColor(refColor), [refColor]);
  const { setBackground } = useFooterBackground();
  useEffect(() => {
    setBackground(bgHex);
    return () => setBackground(null);
  }, [bgHex, setBackground]);

  const guesses = game.guesses ?? {};
  const describerId = game.playerOrder?.[game.turnIndex];
  const describerName = describerId ? room.playerNames[describerId] ?? "Describer" : "Describer";
  const entries = game.playerOrder
    .filter((id) => id !== describerId)
    .map((id) => ({
      id,
      name: room.playerNames[id] ?? "?",
      ...guesses[id],
    }))
    .filter((e) => e.color);

  async function handleOk() {
    if (onAcknowledge) {
      await onAcknowledge();
    } else {
      await acknowledgeResults(roomCode);
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col p-6 pt-10 transition-colors duration-150"
      style={{ backgroundColor: bgHex, color: textColor }}
    >
      <LeaveGameButton roomCode={roomCode} backgroundColor={bgHex} />
      <div className="w-full flex justify-center">
        <Logo className="mb-8" />
      </div>
      <h1 className="text-xl font-bold mb-3">Results</h1>
      {game.description ? (
        <p className="mb-8 italic opacity-90">
          &ldquo;{game.description}&rdquo;
        </p>
      ) : null}
      {game.describerBonus != null && game.describerBonus > 0 && (
        <p className="text-sm mb-8 opacity-90">
          +{game.describerBonus} pts → {describerName} (close guess)
        </p>
      )}
      <p className="text-sm font-medium mb-2">Guesses</p>
      <ul className="space-y-3 mb-8">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 shrink-0"
              style={{ backgroundColor: e.color, borderColor: textColor }}
            />
            <span>{e.name}</span>
            {e.distance != null && (
              <span className="text-sm opacity-90">
                ΔE {e.distance.toFixed(1)}
                {e.points != null && e.points > 0 && ` · +${e.points} pts`}
              </span>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleOk}
        className="w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: textColor,
          color: bgHex,
        }}
      >
        OK
      </button>
    </main>
  );
}
