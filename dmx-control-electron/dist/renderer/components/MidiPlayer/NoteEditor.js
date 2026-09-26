"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./NoteEditor.scss");
const react_1 = require("react");
const NoteEditorCanvasDrawer_1 = require("./NoteEditorCanvasDrawer");
const utils_1 = require("./utils");
const utils_midi_notes_1 = require("./utils_midi_notes");
const DmxMidiContext_1 = require("../../contexts/DmxMidiContext");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const CanvasMouseHandler_1 = __importDefault(require("./CanvasMouseHandler"));
const DEFAULT_PIXELS_PER_BEAT = 80;
const NoteEditor = (props) => {
    const { pattern } = props;
    const { updateSelectedMidiPatternNotes, allMidiKeys, activeEditor, } = (0, DmxMidiContext_1.useDmxMidiContext)();
    const { midiCurrentTickRef } = (0, RealTimeContext_1.useRealTimeContext)();
    const isFocused = activeEditor == 'PatternEditor';
    const canvasRef = (0, react_1.useRef)(null);
    const ghostNoteRef = (0, react_1.useRef)(undefined);
    // Mirror all values accessed in event handlers into refs so they stay fresh
    const patternRef = (0, react_1.useRef)(pattern);
    patternRef.current = pattern;
    const selectedNotesRef = (0, react_1.useRef)([]);
    const ticksScrollRef = (0, react_1.useRef)(0);
    const pixelsPerBeatRef = (0, react_1.useRef)(DEFAULT_PIXELS_PER_BEAT);
    const onUpdateNotesRef = (0, react_1.useRef)(updateSelectedMidiPatternNotes);
    onUpdateNotesRef.current = updateSelectedMidiPatternNotes;
    // Mirror controlled prop into a ref so keyboard handler (registered once) stays fresh
    const isFocusedRef = (0, react_1.useRef)(isFocused);
    isFocusedRef.current = isFocused;
    const sortedMidiKeys = (0, utils_midi_notes_1.buildRowKeys)(allMidiKeys);
    const sortedMidiKeysRef = (0, react_1.useRef)(sortedMidiKeys);
    sortedMidiKeysRef.current = sortedMidiKeys;
    const mouseSelectionRef = (0, react_1.useRef)(null);
    const canvasHeight = NoteEditorCanvasDrawer_1.TIMELINE_HEIGHT + NoteEditorCanvasDrawer_1.NOTE_ROW_HEIGHT * sortedMidiKeys.length;
    // Drag state stored in refs — no re-registration needed
    const selectionRectRef = (0, react_1.useRef)(null);
    const dragDeltaRef = (0, react_1.useRef)({ ticks: 0, row: 0 });
    (0, react_1.useEffect)(() => {
        selectedNotesRef.current = [];
        ticksScrollRef.current = pattern.ticks;
        dragDeltaRef.current = { ticks: 0, row: 0 };
        selectionRectRef.current = null;
    }, [pattern.ticks]);
    // ── Coordinate helpers ────────────────────────────────────────────────────────
    const yToRowIndex = (y) => Math.floor((y - NoteEditorCanvasDrawer_1.TIMELINE_HEIGHT) / NoteEditorCanvasDrawer_1.NOTE_ROW_HEIGHT);
    const yToMidiKey = (y) => sortedMidiKeysRef.current[yToRowIndex(y)];
    // ── Event handlers ────────────────────────────────────────────────────────────
    const midiNotesInRect = (rect) => patternRef.current.midi_notes
        .filter(n => (0, utils_1.doRectanglesIntersect)(rect, (0, NoteEditorCanvasDrawer_1.midiNoteToRectangle)(n, ticksScrollRef.current, pixelsPerBeatRef.current, sortedMidiKeysRef.current)));
    const transformMidiNote = (midiNote, x, y) => {
        const draggedTicks = (0, utils_1.xToTicks)({
            x: x,
            ticksScroll: 0, // We want ticks offset
            pixelsPerBeat: pixelsPerBeatRef.current,
            magnet: true,
            magnetMode: 'line'
        });
        const dragDeltaRow = Math.round(y / NoteEditorCanvasDrawer_1.NOTE_ROW_HEIGHT);
        return {
            ticks: midiNote.ticks + draggedTicks,
            midi: sortedMidiKeysRef.current[sortedMidiKeysRef.current.indexOf(midiNote.midi) + dragDeltaRow],
            durationTicks: midiNote.durationTicks,
        };
    };
    const onKeyDown = (e) => {
        if (!isFocusedRef.current)
            return;
        if (e.target.localName == 'input')
            return;
        if (e.key === 'Backspace' && selectedNotesRef.current.length > 0) {
            e.preventDefault();
            const toRemove = new Set(selectedNotesRef.current.map(n => `${n.ticks}:${n.midi}`));
            onUpdateNotesRef.current(patternRef.current.midi_notes.filter(n => !toRemove.has(`${n.ticks}:${n.midi}`)));
            selectedNotesRef.current = [];
        }
        if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            selectedNotesRef.current = [...patternRef.current.midi_notes];
        }
    };
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);
    const mainLoop = () => {
        if (!canvasRef.current)
            return;
        (0, NoteEditorCanvasDrawer_1.redrawNoteEditor)({
            canvas: canvasRef.current,
            pattern: patternRef.current,
            sortedMidiKeys: sortedMidiKeysRef.current,
            ticksScroll: ticksScrollRef.current,
            pixelsPerBeat: pixelsPerBeatRef.current,
            selectedNotes: selectedNotesRef.current,
            ghostNote: ghostNoteRef.current,
            currentMidiTick: midiCurrentTickRef.current,
            mouseSelection: mouseSelectionRef.current,
            dragDeltaTicks: dragDeltaRef.current.ticks,
            dragDeltaRow: dragDeltaRef.current.row,
            transformMidiNote,
        });
    };
    (0, react_1.useEffect)(() => {
        const interval = setInterval(mainLoop, 20);
        return () => clearInterval(interval);
    }, []);
    const updateSelectedMidiNote = (updatedMidiNotes) => {
        if ((0, utils_midi_notes_1.midiNotesArrayEqual)(selectedNotesRef.current, updatedMidiNotes))
            return;
        const newNotes = [
            ...patternRef.current.midi_notes.filter(n => !(0, utils_midi_notes_1.midiNotesIncludes)(selectedNotesRef.current, n)),
            ...updatedMidiNotes
        ];
        selectedNotesRef.current = updatedMidiNotes;
        patternRef.current.midi_notes = newNotes;
        updateSelectedMidiPatternNotes(newNotes);
    };
    const midiNoteFromXY = (x, y) => {
        const midiKey = yToMidiKey(y);
        const tick = (0, utils_1.xToTicks)({
            x,
            ticksScroll: ticksScrollRef.current,
            pixelsPerBeat: pixelsPerBeatRef.current,
            magnet: true,
            x0: NoteEditorCanvasDrawer_1.PIANO_KEY_WIDTH
        });
        if (!midiKey)
            return undefined;
        if (tick < patternRef.current.ticks)
            return undefined;
        if (tick >= patternRef.current.ticks + patternRef.current.durationTicks)
            return undefined;
        return {
            ticks: tick,
            durationTicks: utils_1.PPQ / 4,
            midi: midiKey,
        };
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `note-editor${isFocused ? ' note-editor--focused' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "note-editor-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "note-editor-title", children: "Editor" }), (0, jsx_runtime_1.jsx)("span", { className: "note-editor-hint", children: "click to add \u00B7 drag to select \u00B7 drag note to move \u00B7 \u232B delete" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "note-editor-canvas-scroll", children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, className: "note-editor-canvas", style: { height: `${canvasHeight}px` } }), (0, jsx_runtime_1.jsx)(CanvasMouseHandler_1.default, { canvasRef: canvasRef, ticksScrollRef: ticksScrollRef, pixelsPerBeatRef: pixelsPerBeatRef, selectionRef: mouseSelectionRef, timelineHeight: NoteEditorCanvasDrawer_1.TIMELINE_HEIGHT, itemsInRect: midiNotesInRect, x0: NoteEditorCanvasDrawer_1.PIANO_KEY_WIDTH, selectedItemsRef: selectedNotesRef, transformItem: transformMidiNote, updateSelectedItems: updateSelectedMidiNote, itemFromXY: midiNoteFromXY, ghostItemRef: ghostNoteRef, editorMode: 'PatternEditor' })] })] }));
};
exports.default = NoteEditor;
//# sourceMappingURL=NoteEditor.js.map