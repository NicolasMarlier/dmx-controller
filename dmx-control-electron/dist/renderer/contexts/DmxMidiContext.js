"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxMidiContextProvider = exports.useDmxMidiContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DmxButtonsContext_1 = require("./DmxButtonsContext");
const ApiClient_1 = require("../ApiClient");
const DmxMidiContext = (0, react_1.createContext)(null);
const useDmxMidiContext = () => {
    const dmxMidiContext = (0, react_1.useContext)(DmxMidiContext);
    if (!dmxMidiContext) {
        throw new Error("useDmxMidiContext has to be used within <RealTimeContext.Provider>");
    }
    return dmxMidiContext;
};
exports.useDmxMidiContext = useDmxMidiContext;
const DmxMidiContextProvider = ({ children }) => {
    const { currentProgramId, dmxButtons } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const [selectedMidiPatterns, setSelectedMidiPatterns] = (0, react_1.useState)([]);
    const [midiPatterns, setMidiPatterns] = (0, react_1.useState)([]);
    const fetchDmxMidi = () => {
        if (!currentProgramId)
            return;
        (0, ApiClient_1.getProgramDmxMidi)(currentProgramId).then((dmxMidi) => {
            setMidiPatterns(dmxMidi.midi_patterns);
            setSelectedMidiPatterns(prev => prev.map(sp => dmxMidi.midi_patterns.find(p => p.ticks === sp.ticks) ?? sp));
        });
    };
    const updateProgramDmxMidiAndSync = (midiPatterns) => {
        if (!currentProgramId)
            return;
        (0, ApiClient_1.updateProgramDmxMidi)(currentProgramId, { midi_patterns: midiPatterns }).then(fetchDmxMidi);
    };
    const updateSelectedMidiPatternNotes = (updatedNotes) => {
        if (selectedMidiPatterns.length != 1)
            return;
        const newPatterns = midiPatterns.map(p => p.ticks === selectedMidiPatterns[0].ticks ? { ...p, midi_notes: updatedNotes } : p);
        updateProgramDmxMidiAndSync(newPatterns);
    };
    const allMidiKeys = (dmxButtons.flatMap(({ triggering_midi_key }) => triggering_midi_key) || []).toSorted();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)('TrackEditor');
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(fetchDmxMidi, [currentProgramId]);
    (0, react_1.useEffect)(() => setIsRecording(false), [currentProgramId]);
    return ((0, jsx_runtime_1.jsx)(DmxMidiContext.Provider, { value: {
            midiPatterns,
            selectedMidiPatterns,
            setSelectedMidiPatterns,
            updateProgramDmxMidiAndSync,
            updateSelectedMidiPatternNotes,
            allMidiKeys,
            activeEditor,
            setActiveEditor,
            isRecording,
            setIsRecording,
        }, children: children }));
};
exports.DmxMidiContextProvider = DmxMidiContextProvider;
//# sourceMappingURL=DmxMidiContext.js.map