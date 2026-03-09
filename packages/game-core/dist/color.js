"use strict";
/**
 * Color utilities: random hex, hex to Lab, Delta E, and scoring.
 * Uses Delta E 2000 for perceptual distance.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomHex = randomHex;
exports.hexToLab = hexToLab;
exports.deltaE = deltaE;
exports.rankGuessesAndAssignPoints = rankGuessesAndAssignPoints;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const convert = require("color-convert");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DeltaE = require("delta-e");
/**
 * Normalize hex string to 6-char lowercase without #.
 */
function normalizeHex(hex) {
    let h = hex.replace(/^#/, "").toLowerCase();
    if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    return h;
}
/**
 * Generate a random color in #000000–#FFFFFF.
 */
function randomHex() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
/**
 * Convert hex to Lab. Returns object in delta-e format { L, A, B }.
 */
function hexToLab(hex) {
    const h = normalizeHex(hex);
    const [L, a, b] = convert.hex.lab.raw(h);
    return { L, A: a, B: b };
}
/**
 * Delta E 2000 between two hex colors.
 */
function deltaE(hex1, hex2) {
    const lab1 = hexToLab(hex1);
    const lab2 = hexToLab(hex2);
    return DeltaE.getDeltaE00(lab1, lab2);
}
const DEFAULT_GUESS_SCORING = {
    pointsFirst: 5,
    pointsSecond: 3,
    pointsThird: 1,
    minPlayersForSecond: 4,
    minPlayersForThird: 6,
};
/**
 * Rank guesses by distance to reference, assign points by rank.
 * Defaults: 1st = 5 pts, 2nd = 3 pts (if 4+ players), 3rd = 1 pt (if 6+ players).
 */
function rankGuessesAndAssignPoints(referenceHex, guesses, playerCount, options) {
    const opts = { ...DEFAULT_GUESS_SCORING, ...options };
    const refLab = hexToLab(referenceHex);
    const entries = Object.entries(guesses)
        .filter(([, g]) => g && g.color)
        .map(([playerId, g]) => ({
        playerId,
        color: g.color,
        distance: DeltaE.getDeltaE00(refLab, hexToLab(g.color)),
    }))
        .sort((a, b) => a.distance - b.distance);
    const result = [];
    for (let i = 0; i < entries.length; i++) {
        let points = 0;
        if (i === 0)
            points = opts.pointsFirst;
        else if (i === 1 && playerCount >= opts.minPlayersForSecond)
            points = opts.pointsSecond;
        else if (i === 2 && playerCount >= opts.minPlayersForThird)
            points = opts.pointsThird;
        result.push({
            playerId: entries[i].playerId,
            color: entries[i].color,
            distance: entries[i].distance,
            points,
        });
    }
    return result;
}
