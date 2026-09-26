"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redrawNoteEditor = exports.midiNoteToRectangle = exports.NOTE_ROW_HEIGHT = exports.PIANO_KEY_WIDTH = exports.TIMELINE_HEIGHT = void 0;
const utils_1 = require("../../utils");
const GenericCanvasDrawer_1 = require("./GenericCanvasDrawer");
const utils_2 = require("./utils");
const utils_midi_notes_1 = require("./utils_midi_notes");
exports.TIMELINE_HEIGHT = 24;
exports.PIANO_KEY_WIDTH = 52;
exports.NOTE_ROW_HEIGHT = 28;
const rowToY = (row) => exports.TIMELINE_HEIGHT + row * exports.NOTE_ROW_HEIGHT;
const drawMidiKeysGrid = (props) => {
    const { ctx, allMidiKeys, width } = props;
    allMidiKeys.forEach((_midiKey, rowIndex) => {
        const y = rowToY(rowIndex);
        ctx.fillStyle = GenericCanvasDrawer_1.PRIMARY_GRID_COLOR;
        ctx.fillRect(exports.PIANO_KEY_WIDTH, y, width, 1);
    });
};
const drawMidiNotes = (props, args) => {
    const { midiNotes, selectedMidiNotes, mouseSelection, transformMidiNote } = args;
    midiNotes.forEach(note => {
        const isSelected = (0, utils_midi_notes_1.midiNotesIncludes)(selectedMidiNotes, note);
        const draggableNote = mouseSelection?.mode == 'drag' && isSelected ? transformMidiNote(note, mouseSelection.rect.x1 - mouseSelection.rect.x0, mouseSelection.rect.y1 - mouseSelection.rect.y0) : note;
        drawMidiNote(props, { note: draggableNote, fillColor: isSelected ? GenericCanvasDrawer_1.SELECTED_COLOR : GenericCanvasDrawer_1.ITEM_COLOR });
    });
};
const midiNoteToRectangle = (midiNote, ticksScroll, pixelsPerBeat, allMidiKeys) => {
    const rowIndex = (allMidiKeys || []).indexOf(midiNote.midi);
    const x = (0, utils_2.ticksOffsetToPixels)(midiNote.ticks, ticksScroll, pixelsPerBeat, exports.PIANO_KEY_WIDTH);
    const y = rowToY(rowIndex);
    const w = (0, utils_2.ticksDurationToPixels)(midiNote.durationTicks, pixelsPerBeat) - 1;
    const h = exports.NOTE_ROW_HEIGHT - 1;
    return {
        x0: x,
        y0: y,
        x1: x + w,
        y1: y + h
    };
};
exports.midiNoteToRectangle = midiNoteToRectangle;
const drawMidiNote = (props, args) => {
    const { ctx, allMidiKeys, pixelsPerBeat, ticksScroll } = props;
    const { note, fillColor, strokeColor } = args;
    const rowIndex = allMidiKeys.indexOf(note.midi);
    const x = (0, utils_2.ticksOffsetToPixels)(note.ticks, ticksScroll, pixelsPerBeat, exports.PIANO_KEY_WIDTH);
    const y = rowToY(rowIndex);
    const w = (0, utils_2.ticksDurationToPixels)(note.durationTicks, pixelsPerBeat) - 1;
    const h = exports.NOTE_ROW_HEIGHT - 1;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.roundRect(x, y + 1, w, h, 3);
    ctx.fill();
    ctx.strokeStyle = strokeColor || '#00000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y + 1, w, h, 3);
    ctx.stroke();
};
const drawGhostNote = (props, note) => drawMidiNote(props, {
    note,
    fillColor: 'rgba(58, 212, 0, 0.2)',
    strokeColor: 'rgba(58, 212, 0, 0.5)'
});
const drawPianoKeyboard = (props) => {
    const { ctx, height, allMidiKeys } = props;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, exports.TIMELINE_HEIGHT, exports.PIANO_KEY_WIDTH, height - exports.TIMELINE_HEIGHT);
    allMidiKeys.forEach((midiKey, rowIndex) => {
        const y = rowToY(rowIndex);
        ctx.fillStyle = '#d8d8d8';
        ctx.beginPath();
        ctx.roundRect(3, y + 2, exports.PIANO_KEY_WIDTH - 7, exports.NOTE_ROW_HEIGHT - 4, 2);
        ctx.fill();
        ctx.fillStyle = '#555';
        ctx.font = `bold ${Math.min(10, exports.NOTE_ROW_HEIGHT - 10)}px monospace`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText((0, utils_1.humanizeMidiKey)(midiKey), exports.PIANO_KEY_WIDTH - 8, y + exports.NOTE_ROW_HEIGHT / 2);
    });
};
const redrawNoteEditor = (props) => {
    const { canvas, pattern, sortedMidiKeys, selectedNotes, ghostNote, mouseSelection, currentMidiTick, transformMidiNote, ticksScroll, pixelsPerBeat } = props;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    const { width: cssWidth, height: cssHeight } = (0, utils_2.setupCanvasDPR)(canvas, ctx);
    const drawerFunctionProps = {
        ...props,
        ...{
            width: cssWidth,
            height: cssHeight,
            ctx,
            ppq: utils_2.PPQ,
            allMidiKeys: sortedMidiKeys,
            baseXOffset: exports.PIANO_KEY_WIDTH,
            baseYOffset: exports.TIMELINE_HEIGHT
        }
    };
    // Background
    ctx.fillStyle = '#222';
    ctx.fillRect((0, utils_2.ticksOffsetToPixels)(pattern.ticks, ticksScroll, pixelsPerBeat, exports.PIANO_KEY_WIDTH), 0, (0, utils_2.ticksDurationToPixels)(pattern.durationTicks, pixelsPerBeat), cssHeight);
    drawMidiKeysGrid(drawerFunctionProps);
    (0, GenericCanvasDrawer_1.drawBeatsGrid)(drawerFunctionProps);
    (0, GenericCanvasDrawer_1.drawTimeline)(drawerFunctionProps);
    drawMidiNotes(drawerFunctionProps, {
        midiNotes: pattern.midi_notes,
        selectedMidiNotes: selectedNotes,
        mouseSelection,
        transformMidiNote
    });
    if (ghostNote)
        drawGhostNote(drawerFunctionProps, ghostNote);
    (0, GenericCanvasDrawer_1.drawCurrentTick)(drawerFunctionProps, currentMidiTick);
    if (mouseSelection?.mode == 'select') {
        (0, GenericCanvasDrawer_1.drawCurrentSelection)(drawerFunctionProps, mouseSelection.rect);
    }
    drawPianoKeyboard(drawerFunctionProps);
};
exports.redrawNoteEditor = redrawNoteEditor;
//# sourceMappingURL=NoteEditorCanvasDrawer.js.map