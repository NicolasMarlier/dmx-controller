"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_midi_notes_1 = require("./utils_midi_notes");
const MAX_TICK = 5 * 60 * 120 * 480;
const pattern = (ticks, durationTicks = 50) => ({ ticks, durationTicks, midi_notes: [] });
(0, vitest_1.describe)('nextFreeTick', () => {
    (0, vitest_1.it)('returns MAX_TICK when patterns array is empty', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([], 100)).toBe(MAX_TICK);
    });
    (0, vitest_1.it)('returns MAX_TICK when all patterns start at or before tick', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([pattern(0), pattern(100), pattern(200)], 300)).toBe(MAX_TICK);
    });
    (0, vitest_1.it)('returns the tick of the single pattern after tick', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([pattern(200)], 100)).toBe(200);
    });
    (0, vitest_1.it)('returns the nearest pattern tick when multiple patterns follow', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([pattern(300), pattern(150), pattern(200)], 100)).toBe(150);
    });
    (0, vitest_1.it)('handles patterns both before and after tick', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([pattern(100), pattern(200), pattern(300)], 150)).toBe(200);
    });
    (0, vitest_1.it)('handles tick in the middle of a pattern', () => {
        (0, vitest_1.expect)((0, utils_midi_notes_1.nextFreeTick)([pattern(50)], 75)).toBe(75);
    });
});
//# sourceMappingURL=utils_midi_notes.test.js.map