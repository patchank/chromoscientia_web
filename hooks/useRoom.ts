"use client";

import { useEffect, useState } from "react";
import { subscribeRoom, type RoomSnapshot } from "@/lib/room";

export function useRoom(roomCode: string | null) {
  const [room, setRoom] = useState<RoomSnapshot | null>(null);
  const [loading, setLoading] = useState(!!roomCode);

  useEffect(() => {
    if (!roomCode) {
      setRoom(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeRoom(roomCode, (data) => {
      setRoom(data);
      setLoading(false);
    });
    return unsub;
  }, [roomCode]);

  return { room, loading };
}
