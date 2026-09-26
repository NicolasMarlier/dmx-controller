"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLoopForPatterns = exports.nextFreeTick = exports.insertPatternsAtTick = exports.addNoteAtTick = exports.insertNotesAtTick = exports.magnettedTick = exports.midiNotesIncludes = exports.buildRowKeys = exports.PPQ = exports.midiNotesArrayEqual = exports.midiNoteEqual = void 0;
const midiNoteEqual = (a, b) => a.midi == b.midi && a.ticks == b.ticks;
exports.midiNoteEqual = midiNoteEqual;
const midiNotesArrayEqual = (a, b) => {
    if (a.length != b.length)
        return false;
    const sortedA = a.toSorted((mp1, mp2) => mp2.ticks - mp1.ticks);
    const sortedB = b.toSorted((mp1, mp2) => mp2.ticks - mp1.ticks);
    return sortedA.every((mn, i) => (0, exports.midiNoteEqual)(mn, sortedB[i]));
};
exports.midiNotesArrayEqual = midiNotesArrayEqual;
exports.PPQ = 480;
const buildRowKeys = (rawKeys, minRows = 6) => {
    const valid = [...new Set(rawKeys.filter((k) => typeof k === 'number' && !isNaN(k)))];
    if (valid.length === 0)
        return [48, 45, 43, 39, 38, 36];
    const sorted = valid.sort((a, b) => a - b);
    const result = [...sorted];
    while (result.length < minRows) {
        const lo = result[0];
        const hi = result[result.length - 1];
        if (lo > 0)
            result.unshift(lo - 1);
        if (result.length >= minRows)
            break;
        if (hi < 127)
            result.push(hi + 1);
    }
    return result.sort((a, b) => b - a);
};
exports.buildRowKeys = buildRowKeys;
const midiNotesIncludes = (a, midiNote) => a.some(mn => (0, exports.midiNoteEqual)(mn, midiNote));
exports.midiNotesIncludes = midiNotesIncludes;
const subtract = (a, b) => a.filter((mn) => !(0, exports.midiNotesIncludes)(b, mn));
const union = (a, b) => [...subtract(a, b), ...b];
const outer_join = (a, b) => union(subtract(a, b), subtract(b, a));
const magnettedTick = (tick, beatMagnet = 0.25) => exports.PPQ * Math.floor((tick / exports.PPQ) / beatMagnet) * beatMagnet;
exports.magnettedTick = magnettedTick;
const insertNotesAtTick = (props) => {
    const { midiNotes, midiNotesToInsert, tick, options } = props;
    if (midiNotesToInsert.length == 0)
        return midiNotes;
    const initialTick = midiNotesToInsert.reduce((minTick, { ticks }) => Math.min(ticks, minTick), midiNotesToInsert[0].ticks);
    const newMidiNotes = midiNotesToInsert.map(n => ({
        ticks: n.ticks + tick - initialTick,
        midi: n.midi,
        durationTicks: n.durationTicks
    }));
    if (options?.remove_if_exist) {
        return outer_join(midiNotes, newMidiNotes);
    }
    return union(midiNotes, newMidiNotes);
};
exports.insertNotesAtTick = insertNotesAtTick;
const addNoteAtTick = (props) => (0, exports.insertNotesAtTick)({
    ...props,
    ...{
        midiNotesToInsert: [{
                ticks: 0,
                durationTicks: props.ppq / 4,
                midi: props.midiKey
            }]
    }
});
exports.addNoteAtTick = addNoteAtTick;
const insertPatternsAtTick = (props) => {
    const { midiPatterns, midiPatternsToInsert, tick } = props;
    if (midiPatternsToInsert.length == 0)
        return midiPatterns;
    const initialTick = midiPatternsToInsert.reduce((minTick, { ticks }) => Math.min(ticks, minTick), midiPatternsToInsert[0].ticks);
    const newMidiPatterns = midiPatternsToInsert.map(p => ({
        ticks: p.ticks + tick - initialTick,
        durationTicks: p.durationTicks,
        midi_notes: p.midi_notes.map(n => ({
            ticks: n.ticks + tick - initialTick,
            durationTicks: n.durationTicks,
            midi: n.midi
        }))
    }));
    return [...midiPatterns, ...newMidiPatterns].toSorted((a, b) => a.ticks - b.ticks);
};
exports.insertPatternsAtTick = insertPatternsAtTick;
const MAX_TICK = 5 * 60 * 120 * 480;
const nextFreeTick = (midiPatterns, tick) => midiPatterns
    .filter(p => p.ticks + p.durationTicks > tick)
    .reduce((freeTick, pattern) => Math.max(tick, Math.min(pattern.ticks, freeTick)), MAX_TICK);
exports.nextFreeTick = nextFreeTick;
const toggleLoopForPatterns = (midiPatterns, selectedMidiPatterns) => {
    const shouldToggleOn = !selectedMidiPatterns.some(p => p.loop_until_tick);
    return midiPatterns.map(p => {
        const isSelected = selectedMidiPatterns.some(({ ticks }) => p.ticks == ticks);
        if (isSelected) {
            return {
                ...p,
                ...{
                    loop_until_tick: shouldToggleOn ? (0, exports.nextFreeTick)(midiPatterns, p.ticks + p.durationTicks) : undefined
                }
            };
        }
        else {
            return p;
        }
    });
};
exports.toggleLoopForPatterns = toggleLoopForPatterns;
//# sourceMappingURL=utils_midi_notes.js.map