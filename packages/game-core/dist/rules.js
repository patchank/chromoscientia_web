"use strict";
/**
 * Pure game rules. No Firebase, no platform APIs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTAL_ROUNDS = exports.MAX_PLAYERS = exports.MIN_PLAYERS = void 0;
exports.getCurrentDescriberId = getCurrentDescriberId;
exports.isDescriber = isDescriber;
exports.allNonDescriberPlayersHaveGuessed = allNonDescriberPlayersHaveGuessed;
exports.getNextTurnState = getNextTurnState;
exports.shuffle = shuffle;
exports.MIN_PLAYERS = 3;
exports.MAX_PLAYERS = 8;
exports.TOTAL_ROUNDS = 3;
/**
 * Current describer's player id (from playerOrder[turnIndex]).
 */
function getCurrentDescriberId(game) {
    const order = game.playerOrder;
    const idx = game.turnIndex;
    if (idx < 0 || idx >= order.length)
        return order[0] ?? "";
    return order[idx];
}
/**
 * True if the given player is the current describer (and thus should see Describe screen).
 */
function isDescriber(game, playerId) {
    return getCurrentDescriberId(game) === playerId;
}
/**
 * True when every player except the current describer has submitted a guess.
 */
function allNonDescriberPlayersHaveGuessed(game) {
    const describerId = getCurrentDescriberId(game);
    const order = game.playerOrder;
    const guessers = order.filter((id) => id !== describerId);
    const guesses = game.guesses ?? {};
    return guessers.every((id) => guesses[id]?.color != null);
}
/**
 * Compute the next turn/round state after leaderboard.
 * If game has more turns: next turnIndex (and possibly next round). Else game over.
 */
function getNextTurnState(game) {
    const order = game.playerOrder;
    let turnIndex = game.turnIndex + 1;
    let roundIndex = game.roundIndex;
    if (turnIndex >= order.length) {
        turnIndex = 0;
        roundIndex += 1;
    }
    const gameOver = roundIndex >= exports.TOTAL_ROUNDS;
    return {
        gameOver,
        roundIndex: gameOver ? game.roundIndex : roundIndex,
        turnIndex: gameOver ? game.turnIndex : turnIndex,
    };
}
/**
 * Shuffle array (Fisher–Yates). Used for initial playerOrder.
 */
function shuffle(array) {
    const out = [...array];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}
