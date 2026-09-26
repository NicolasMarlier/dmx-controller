"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./TrackEditor.scss");
const react_1 = require("react");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const utils_audio_1 = require("./utils_audio");
const TrackEditorCanvasDrawer_1 = require("./TrackEditorCanvasDrawer");
const Draggable_1 = __importDefault(require("../DesignSystem/Draggable/Draggable"));
const utils_midi_notes_1 = require("./utils_midi_notes");
const utils_1 = require("./utils");
const CanvasMouseHandler_1 = __importDefault(require("./CanvasMouseHandler"));
const DmxMidiContext_1 = require("../../contexts/DmxMidiContext");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const utils_midi_patterns_1 = require("./utils_midi_patterns");
const BEATS_OFFSET = 2;
const BASE_PIXELS_PER_BEAT = 40;
const MidiPlayer = (props) => {
    const { program } = props;
    const { midiPatterns, updateProgramDmxMidiAndSync, allMidiKeys, activeEditor, isRecording, setSelectedMidiPatterns, } = (0, DmxMidiContext_1.useDmxMidiContext)();
    const { audioUrl, uploadProgramAudioAndSync } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const allMidiKeysRef = (0, react_1.useRef)(allMidiKeys);
    allMidiKeysRef.current = allMidiKeys;
    const midiPatternsRef = (0, react_1.useRef)(midiPatterns);
    midiPatternsRef.current = midiPatterns;
    const selectedMidiPatternsRef = (0, react_1.useRef)([]);
    selectedMidiPatternsRef.current = midiPatterns.filter(p => (0, utils_midi_patterns_1.isSelected)(p, selectedMidiPatternsRef.current));
    const { midiCurrentTickRef, lastReceivedMidiKey, sendCurrentTickToServer } = (0, RealTimeContext_1.useRealTimeContext)();
    const canvasRef = (0, react_1.useRef)(null);
    const mouseSelectionRef = (0, react_1.useRef)(null);
    const ticksScrollRef = (0, react_1.useRef)(0);
    const pixelsPerBeatRef = (0, react_1.useRef)(BASE_PIXELS_PER_BEAT);
    const [audioWaveData, setAudioWaveData] = (0, react_1.useState)(new Uint8Array());
    const audioWaveDataRef = (0, react_1.useRef)(audioWaveData);
    audioWaveDataRef.current = audioWaveData;
    const recordingPatternRef = (0, react_1.useRef)(null);
    const ghostMidiPatternRef = (0, react_1.useRef)(undefined);
    const updateProgramDmxMidiAndSyncRef = (0, react_1.useRef)(updateProgramDmxMidiAndSync);
    updateProgramDmxMidiAndSyncRef.current = updateProgramDmxMidiAndSync;
    const splitAtCurrentTick = () => {
        updateProgramDmxMidiAndSyncRef.current((0, utils_midi_patterns_1.splitPatternsAtTick)(midiPatternsRef.current, midiCurrentTickRef.current));
        selectedMidiPatternsRef.current = [];
    };
    const activeEditorRef = (0, react_1.useRef)(null);
    activeEditorRef.current = activeEditor;
    const clipboard = (0, react_1.useRef)([]);
    const deleteSelectedMidiPatterns = () => {
        updateProgramDmxMidiAndSyncRef.current(midiPatternsRef.current.filter(midiPattern => !(0, utils_midi_patterns_1.isSelected)(midiPattern, selectedMidiPatternsRef.current)));
    };
    const copySelectedMidiPatterns = () => {
        clipboard.current = selectedMidiPatternsRef.current;
    };
    const pasteSelectedMidiPatterns = () => {
        updateProgramDmxMidiAndSyncRef.current((0, utils_midi_notes_1.insertPatternsAtTick)({
            midiPatterns: midiPatternsRef.current,
            midiPatternsToInsert: clipboard.current,
            tick: midiCurrentTickRef.current,
            ppq: utils_1.PPQ
        }));
    };
    const joinSelection = () => {
        updateProgramDmxMidiAndSyncRef.current([
            ...midiPatternsRef.current.filter(midiPattern => !(0, utils_midi_patterns_1.isSelected)(midiPattern, selectedMidiPatternsRef.current)),
            ...[(0, utils_midi_patterns_1.sum)(selectedMidiPatternsRef.current)]
        ]);
    };
    const toggleLoop = () => {
        if (!selectedMidiPatternsRef.current)
            return;
        updateProgramDmxMidiAndSyncRef.current((0, utils_midi_notes_1.toggleLoopForPatterns)(midiPatternsRef.current, selectedMidiPatternsRef.current));
    };
    const onKeyDown = (e) => {
        if (activeEditorRef.current !== 'TrackEditor')
            return;
        if (e.target.localName == 'input')
            return;
        let shouldPreventDefault = true;
        if (e.key == 'Backspace')
            deleteSelectedMidiPatterns();
        else if (e.key == 'c' && e.metaKey)
            copySelectedMidiPatterns();
        else if (e.key == 'v' && e.metaKey)
            pasteSelectedMidiPatterns();
        else if (e.key == 'a' && e.metaKey)
            selectAll();
        else if (e.key == 't')
            splitAtCurrentTick();
        else if (e.key == 'j')
            joinSelection();
        else if (e.key == 'l')
            toggleLoop();
        else if (e.key == 'Enter') {
            midiCurrentTickRef.current = 0;
            ticksScrollRef.current = 0;
            sendCurrentTickToServer(0);
        }
        else if (e.key == 'ArrowLeft') {
            const targetTick = Math.max(0, (0, utils_midi_notes_1.magnettedTick)(midiCurrentTickRef.current, 1) - utils_1.PPQ);
            midiCurrentTickRef.current = targetTick;
            ticksScrollRef.current = targetTick - BEATS_OFFSET * utils_1.PPQ;
        }
        else if (e.key == 'ArrowRight') {
            const targetTick = ((0, utils_midi_notes_1.magnettedTick)(midiCurrentTickRef.current, 1) + utils_1.PPQ);
            midiCurrentTickRef.current = targetTick;
            ticksScrollRef.current = targetTick - BEATS_OFFSET * utils_1.PPQ;
        }
        else {
            shouldPreventDefault = false;
        }
        if (shouldPreventDefault)
            e.preventDefault();
    };
    const selectAll = () => {
        selectedMidiPatternsRef.current = midiPatternsRef.current;
    };
    const onDropAudioFile = (file) => {
        uploadProgramAudioAndSync(file);
    };
    const persistRecordingPattern = () => {
        if (!recordingPatternRef.current)
            return;
        if (recordingPatternRef.current.midi_notes.length == 0)
            return;
        updateProgramDmxMidiAndSyncRef.current([...midiPatternsRef.current, ...[recordingPatternRef.current]]);
        recordingPatternRef.current = null;
    };
    (0, react_1.useEffect)(() => {
        if (isRecording) {
            if (!recordingPatternRef.current) {
                const duration = (0, utils_midi_notes_1.nextFreeTick)(midiPatternsRef.current, midiCurrentTickRef.current) - midiCurrentTickRef.current;
                if (duration > 0) {
                    recordingPatternRef.current = {
                        ticks: (0, utils_midi_notes_1.magnettedTick)(midiCurrentTickRef.current),
                        durationTicks: duration,
                        midi_notes: []
                    };
                }
            }
            else {
                //TODO: Handle case when we are after durationTicks, send to server and 
            }
        }
        else {
            if (recordingPatternRef.current) {
                persistRecordingPattern();
            }
        }
    }, [isRecording]);
    (0, react_1.useEffect)(() => {
        if (!!lastReceivedMidiKey && isRecording && recordingPatternRef.current) {
            recordingPatternRef.current = {
                ...recordingPatternRef.current,
                ...{
                    midi_notes: (0, utils_midi_notes_1.addNoteAtTick)({
                        tick: (0, utils_midi_notes_1.magnettedTick)(midiCurrentTickRef.current),
                        midiKey: lastReceivedMidiKey.midi,
                        midiNotes: recordingPatternRef.current.midi_notes || [],
                        ppq: utils_1.PPQ
                    })
                }
            };
        }
    }, [lastReceivedMidiKey, isRecording]);
    (0, react_1.useEffect)(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!audioUrl) {
            setAudioWaveData(new Uint8Array());
            return;
        }
        let cancelled = false;
        (0, utils_audio_1.computeWave)(audioUrl, program.bpm, utils_1.PPQ).then(waveData => { if (!cancelled)
            setAudioWaveData(waveData); });
        return () => { cancelled = true; };
    }, [audioUrl]);
    const redrawMidiCanvas = () => {
        if (!canvasRef.current)
            return;
        (0, TrackEditorCanvasDrawer_1.redrawFullCanvas)({
            canvas: canvasRef.current,
            midiPatterns: midiPatternsRef.current,
            selectedMidiPatterns: selectedMidiPatternsRef.current,
            recordingMidiPattern: recordingPatternRef.current,
            ppq: utils_1.PPQ,
            currentMidiTick: midiCurrentTickRef.current,
            ticksScroll: ticksScrollRef.current,
            pixelsPerBeat: pixelsPerBeatRef.current,
            audioWaveData: audioWaveDataRef.current,
            allMidiKeys: allMidiKeysRef.current,
            mouseSelection: mouseSelectionRef.current,
            ghostMidiPattern: ghostMidiPatternRef.current,
            transformMidiPattern,
        });
    };
    const mainLoop = () => {
        // TODO: find a way to handle follow-scroll
        // if(midiCurrentTickRef.current != serverMidiCurrentTickRef.current) {
        //     midiCurrentTickRef.current = serverMidiCurrentTickRef.current
        //     ticksScrollRef.current = serverMidiCurrentTickRef.current - BEATS_OFFSET * PPQ
        // }
        redrawMidiCanvas();
    };
    (0, react_1.useEffect)(() => {
        const interval = setInterval(mainLoop, 20);
        return () => clearInterval(interval);
    }, []);
    const itemsInRect = (rect) => midiPatternsRef.current
        .filter(p => (0, utils_1.doRectanglesIntersect)(rect, (0, utils_1.midiPatternToRectangle)(p, canvasRef.current?.getBoundingClientRect().height || 1, ticksScrollRef.current, pixelsPerBeatRef.current)));
    const transformMidiPattern = (midiPattern, x, _y) => {
        const deltaTick = (0, utils_1.xToTicks)({
            x,
            ticksScroll: 0, // We want delta tick
            pixelsPerBeat: pixelsPerBeatRef.current,
            magnet: true,
            magnetBeats: 1
        });
        return {
            ...midiPattern,
            ...{
                ticks: midiPattern.ticks + deltaTick,
                midi_notes: midiPattern.midi_notes.map(n => ({ ...n, ...{ ticks: n.ticks + deltaTick } }))
            }
        };
    };
    const patternFromXY = (x, y) => {
        if (y < 20 || y > 50)
            return undefined;
        return undefined;
        return {
            ticks: (0, utils_1.xToTicks)({
                x,
                ticksScroll: ticksScrollRef.current,
                pixelsPerBeat: pixelsPerBeatRef.current,
                magnet: true,
                magnetBeats: 1
            }),
            durationTicks: utils_1.PPQ,
            midi_notes: []
        };
    };
    const updateSelectedMidiPatterns = (updatedMidiPatterns) => {
        if ((0, utils_midi_patterns_1.midiPatternArrayEqual)(selectedMidiPatternsRef.current, updatedMidiPatterns))
            return;
        const newPatterns = [
            ...midiPatternsRef.current.filter(p => !(0, utils_midi_patterns_1.midiPatternsInclude)(selectedMidiPatternsRef.current, p)),
            ...updatedMidiPatterns
        ];
        selectedMidiPatternsRef.current = updatedMidiPatterns;
        midiPatternsRef.current = newPatterns;
        updateProgramDmxMidiAndSyncRef.current(newPatterns);
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "midi-container", children: (0, jsx_runtime_1.jsxs)(Draggable_1.default, { onDropFile: onDropAudioFile, className: `midi-canvas-container${activeEditor === 'TrackEditor' ? ' midi-canvas-container--focused' : ''}`, children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, id: "midi-canvas", width: "300", height: "30" }), (0, jsx_runtime_1.jsx)(CanvasMouseHandler_1.default, { canvasRef: canvasRef, ticksScrollRef: ticksScrollRef, pixelsPerBeatRef: pixelsPerBeatRef, selectionRef: mouseSelectionRef, selectedItemsRef: selectedMidiPatternsRef, onSelectedItemsChange: () => setSelectedMidiPatterns(selectedMidiPatternsRef.current), itemsInRect: itemsInRect, timelineHeight: 20, transformItem: transformMidiPattern, updateSelectedItems: updateSelectedMidiPatterns, itemFromXY: patternFromXY, ghostItemRef: ghostMidiPatternRef, isItemInSelection: (item, selected) => (0, utils_midi_patterns_1.midiPatternsInclude)(selected, item) })] }) }) }));
};
exports.default = MidiPlayer;
//# sourceMappingURL=TrackEditor.js.map