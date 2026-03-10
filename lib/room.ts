"use client";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  limit,
  Timestamp,
} from "firebase/firestore";
import { createRoomApi, NICKNAME_TAKEN_ERROR } from "@chromoscientia/shared";
import { getDb } from "./firebase";
import { getOrCreatePlayerId } from "./playerId";

/** Local type for the Firestore API we pass to createRoomApi (avoids depending on shared package exporting it). */
type FirestoreAdapter = Parameters<typeof createRoomApi>[2];

const firestoreAdapter = {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  limit,
  Timestamp,
} as FirestoreAdapter;

const roomApi = createRoomApi(getDb, getOrCreatePlayerId, firestoreAdapter);

export { NICKNAME_TAKEN_ERROR };
export type { RoomSnapshot, GameSnapshot } from "@chromoscientia/shared";

export const createRoom = roomApi.createRoom;
export const joinRoom = roomApi.joinRoom;
export const leaveRoom = roomApi.leaveRoom;
export const endGameForAll = roomApi.endGameForAll;
export const startGame = roomApi.startGame;
export const playAgain = roomApi.playAgain;
export const submitDescription = roomApi.submitDescription;
export const submitGuess = roomApi.submitGuess;
export const advanceToResults = roomApi.advanceToResults;
export const advanceToLeaderboard = roomApi.advanceToLeaderboard;
export const acknowledgeResults = roomApi.acknowledgeResults;
export const advanceTurnOrEnd = roomApi.advanceTurnOrEnd;
export const acknowledgeLeaderboard = roomApi.acknowledgeLeaderboard;
export const subscribeRoom = roomApi.subscribeRoom;
export const subscribeGame = roomApi.subscribeGame;

export {
  getCurrentDescriberId,
  isDescriber,
  allNonDescriberPlayersHaveGuessed,
  getNextTurnState,
  MIN_PLAYERS,
  MAX_PLAYERS,
  TOTAL_ROUNDS,
} from "@chromoscientia/game-core";
