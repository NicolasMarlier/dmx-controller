"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickToTime = exports.timeToTick = exports.computedSelectedNotes = exports.isMidiNoteInRectangle = exports.doRectanglesIntersect = exports.midiPatternToRectangle = exports.midiNoteToRectangle = exports.doSegmentsIntersect = exports.pixelsOffsetToMidiKey = exports.pixelsOffsetToMidiKeyIndex = exports.midiKeyToPixelsHeight = exports.midiKeyToPixelsOffset = exports.xToTicks = exports.ticksOffsetToPixels = exports.ticksDurationToPixels = exports.setupCanvasDPR = exports.PPQ = void 0;
exports.PPQ = 480;
const setupCanvasDPR = (canvas, ctx, heightAdjust = 0) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight + heightAdjust;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
    return { width, height };
};
exports.setupCanvasDPR = setupCanvasDPR;
const ticksDurationToPixels = (ticksDuration, pixelsPerBeat) => ticksDuration * pixelsPerBeat / exports.PPQ;
exports.ticksDurationToPixels = ticksDurationToPixels;
const ticksOffsetToPixels = (tick, ticksScroll, pixelsPerBeat, baseOffset = 0) => (0, exports.ticksDurationToPixels)(tick - ticksScroll, pixelsPerBeat) + baseOffset;
exports.ticksOffsetToPixels = ticksOffsetToPixels;
const xToTicks = (props) => {
    const { x, ticksScroll, pixelsPerBeat, x0, magnet, magnetMode, magnetBeats = 0.25 } = props;
    const aimedTick = ((x - (x0 || 0)) / pixelsPerBeat * exports.PPQ + ticksScroll);
    if (magnet) {
        if (magnetMode == 'line') {
            return exports.PPQ * Math.round((aimedTick / exports.PPQ) / magnetBeats) * magnetBeats;
        }
        return exports.PPQ * Math.floor((aimedTick / exports.PPQ) / magnetBeats) * magnetBeats;
    }
    return aimedTick;
};
exports.xToTicks = xToTicks;
const midiKeyToPixelsOffset = (midiKey, height, midiKeys) => {
    return midiKeys.toSorted().indexOf(midiKey) * (0, exports.midiKeyToPixelsHeight)(height)
        + height * 1 / 5;
};
exports.midiKeyToPixelsOffset = midiKeyToPixelsOffset;
const midiKeyToPixelsHeight = (height) => {
    return height * 2 / (5 * 6);
};
exports.midiKeyToPixelsHeight = midiKeyToPixelsHeight;
const pixelsOffsetToMidiKeyIndex = (y, height) => (Math.floor((y
    - height * 1 / 5) / (0, exports.midiKeyToPixelsHeight)(height)));
exports.pixelsOffsetToMidiKeyIndex = pixelsOffsetToMidiKeyIndex;
const pixelsOffsetToMidiKey = (y, height, midiKeys) => (midiKeys.toSorted()[(0, exports.pixelsOffsetToMidiKeyIndex)(y, height)]);
exports.pixelsOffsetToMidiKey = pixelsOffsetToMidiKey;
const sortSegment = ([a, b]) => (a > b ? [b, a] : [a, b]);
const doSegmentsIntersect = (segmentA, segmentB) => {
    if (sortSegment(segmentB)[0] < sortSegment(segmentA)[0]) {
        return (0, exports.doSegmentsIntersect)(segmentB, segmentA);
    }
    return sortSegment(segmentA)[0] < sortSegment(segmentB)[1] &&
        sortSegment(segmentA)[1] > sortSegment(segmentB)[0];
};
exports.doSegmentsIntersect = doSegmentsIntersect;
const midiNoteToRectangle = (midiNote, height, midiKeys, ticksScroll, pixelsPerBeat) => ({
    x0: (0, exports.ticksOffsetToPixels)(midiNote.ticks, ticksScroll, pixelsPerBeat),
    y0: (0, exports.midiKeyToPixelsOffset)(midiNote.midi, height, midiKeys),
    x1: (0, exports.ticksOffsetToPixels)(midiNote.ticks + midiNote.durationTicks, ticksScroll, pixelsPerBeat),
    y1: (0, exports.midiKeyToPixelsOffset)(midiNote.midi, height, midiKeys) + (0, exports.midiKeyToPixelsHeight)(height),
});
exports.midiNoteToRectangle = midiNoteToRectangle;
const midiPatternToRectangle = (midiPattern, height, ticksScroll, pixelsPerBeat) => ({
    x0: (0, exports.ticksOffsetToPixels)(midiPattern.ticks, ticksScroll, pixelsPerBeat),
    y0: height * 1 / 5,
    x1: (0, exports.ticksOffsetToPixels)(midiPattern.ticks + midiPattern.durationTicks, ticksScroll, pixelsPerBeat) - 1,
    y1: height * 3 / 5
});
exports.midiPatternToRectangle = midiPatternToRectangle;
const doRectanglesIntersect = (rectangleA, rectangleB) => ((0, exports.doSegmentsIntersect)([rectangleA.x0, rectangleA.x1], [rectangleB.x0, rectangleB.x1]) &&
    (0, exports.doSegmentsIntersect)([rectangleA.y0, rectangleA.y1], [rectangleB.y0, rectangleB.y1]));
exports.doRectanglesIntersect = doRectanglesIntersect;
const isMidiNoteInRectangle = (selection, midiNote, height, midiKeys, ticksScroll, pixelsPerBeat) => ((0, exports.doRectanglesIntersect)(selection, (0, exports.midiNoteToRectangle)(midiNote, height, midiKeys, ticksScroll, pixelsPerBeat)));
exports.isMidiNoteInRectangle = isMidiNoteInRectangle;
const computedSelectedNotes = (selection, midiNotes, height, midiKeys, ticksScroll, pixelsPerBeat) => (midiNotes.filter(midiNote => (0, exports.isMidiNoteInRectangle)(selection, midiNote, height, midiKeys, ticksScroll, pixelsPerBeat)));
exports.computedSelectedNotes = computedSelectedNotes;
const timeToTick = (timeInSeconds, bpm) => Math.round((timeInSeconds * bpm * exports.PPQ) / 60);
exports.timeToTick = timeToTick;
const tickToTime = (tick, bpm) => (60.0 * tick) / (bpm * exports.PPQ);
exports.tickToTime = tickToTime;
//# sourceMappingURL=utils.js.map