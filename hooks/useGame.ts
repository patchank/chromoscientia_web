"use client";

import { useEffect, useState } from "react";
import { subscribeGame, type GameSnapshot } from "@/lib/room";
import { getOrCreatePlayerId } from "@/lib/playerId";

export function useGame(roomCode: string | null) {
  const [game, setGame] = useState<GameSnapshot | null>(null);
  const [loading, setLoading] = useState(!!roomCode);
  const playerId = getOrCreatePlayerId();

  useEffect(() => {
    if (!roomCode) {
      setGame(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeGame(roomCode, (data) => {
      setGame(data);
      setLoading(false);
    });
    return unsub;
  }, [roomCode]);

  const isHost =
    roomCode && game === null
      ? false
      : !!roomCode && !!game && false; // will be set from room.hostId in component
  const isDescriber =
    !!game && playerId === game.playerOrder[game.turnIndex];
  const currentDescriberId = game?.playerOrder[game.turnIndex] ?? null;

  return {
    game,
    loading,
    playerId,
    isDescriber,
    currentDescriberId,
  };
}
