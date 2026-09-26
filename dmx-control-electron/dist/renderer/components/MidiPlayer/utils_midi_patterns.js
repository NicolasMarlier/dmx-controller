"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = exports.midiPatternArrayEqual = exports.midiPatternEqual = exports.isSelected = exports.midiPatternsInclude = exports.splitPatternsAtTick = void 0;
const utils_midi_notes_1 = require("./utils_midi_notes");
const splitPatternsAtTick = (midiPatterns, tick) => {
    let newPatterns = [];
    midiPatterns.forEach((pattern) => {
        if (pattern.ticks < tick
            && (pattern.ticks + pattern.durationTicks) > tick) {
            newPatterns = [...newPatterns, ...[
                    {
                        ticks: pattern.ticks,
                        durationTicks: tick - pattern.ticks,
                        midi_notes: pattern.midi_notes.filter((n) => n.ticks < tick)
                    },
                    {
                        ticks: tick,
                        durationTicks: pattern.ticks + pattern.durationTicks - tick,
                        midi_notes: pattern.midi_notes.filter((n) => n.ticks >= tick)
                    }
                ]];
        }
        else {
            newPatterns = [...newPatterns, ...[pattern]];
        }
    });
    return newPatterns;
};
exports.splitPatternsAtTick = splitPatternsAtTick;
const midiPatternsInclude = (midiPatterns, midiPattern) => midiPatterns.some(p => p.ticks == midiPattern.ticks);
exports.midiPatternsInclude = midiPatternsInclude;
const isSelected = (midiPattern, selectedMidiPatterns) => (0, exports.midiPatternsInclude)(selectedMidiPatterns, midiPattern);
exports.isSelected = isSelected;
const midiPatternEqual = (a, b) => {
    if (a.ticks != b.ticks)
        return false;
    if (a.durationTicks != b.durationTicks)
        return false;
    if (a.loop_until_tick != b.loop_until_tick)
        return false;
    return (0, utils_midi_notes_1.midiNotesArrayEqual)(a.midi_notes, b.midi_notes);
};
exports.midiPatternEqual = midiPatternEqual;
const midiPatternArrayEqual = (a, b) => {
    if (a.length != b.length)
        return false;
    const sortedA = a.toSorted((mp1, mp2) => mp2.ticks - mp1.ticks);
    const sortedB = b.toSorted((mp1, mp2) => mp2.ticks - mp1.ticks);
    return sortedA.every((mp, i) => (0, exports.midiPatternEqual)(mp, sortedB[i]));
};
exports.midiPatternArrayEqual = midiPatternArrayEqual;
const sum = (midiPatterns) => {
    const ticks = midiPatterns.reduce((min, p) => Math.min(p.ticks, min), midiPatterns[0].ticks);
    const untilTick = midiPatterns.reduce((max, p) => Math.max(p.ticks + p.durationTicks, max), 0);
    return {
        ticks: ticks,
        durationTicks: untilTick - ticks,
        midi_notes: midiPatterns.flatMap(p => p.midi_notes)
    };
};
exports.sum = sum;
//# sourceMappingURL=utils_midi_patterns.js.map