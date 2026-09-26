"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxButtonsContextProvider = exports.useDmxButtonsContext = exports.DmxButtonsContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ApiClient_1 = require("../ApiClient");
exports.DmxButtonsContext = (0, react_1.createContext)(null);
const useDmxButtonsContext = () => {
    const dmxButtonsContext = (0, react_1.useContext)(exports.DmxButtonsContext);
    if (!dmxButtonsContext) {
        throw new Error("useCurrentUser has to be used within <CurrentUserContext.Provider>");
    }
    return dmxButtonsContext;
};
exports.useDmxButtonsContext = useDmxButtonsContext;
const DmxButtonsContextProvider = ({ children }) => {
    // Use State to keep the values
    const [dmxButtons, setDmxButtons] = (0, react_1.useState)([]);
    const [programs, setPrograms] = (0, react_1.useState)([]);
    const [program, setProgram] = (0, react_1.useState)(undefined);
    const [currentProgramId, setCurrentProgramId] = (0, react_1.useState)(undefined);
    const fetchDmxButtons = () => program && (0, ApiClient_1.listDmxButtons)(program.id).then((dmxButtons) => setDmxButtons(dmxButtons));
    const syncPrograms = () => (0, ApiClient_1.listPrograms)().then(setPrograms);
    (0, react_1.useEffect)(() => {
        fetchDmxButtons();
    }, [program]);
    const [audioUrl, setAudioUrl] = (0, react_1.useState)(undefined);
    const syncProgramAudio = () => {
        if (!program) {
            setAudioUrl(undefined);
            return;
        }
        (0, ApiClient_1.getProgramAudio)(program.id).then((audioUrl) => setAudioUrl(audioUrl || undefined));
    };
    (0, react_1.useEffect)(syncProgramAudio, [program?.id]);
    // Free the previous blob once consumers switched to the new one
    (0, react_1.useEffect)(() => () => { if (audioUrl)
        URL.revokeObjectURL(audioUrl); }, [audioUrl]);
    const uploadProgramAudioAndSync = (file) => {
        program && (0, ApiClient_1.uploadProgramAudio)(program.id, file).then(syncProgramAudio);
    };
    (0, react_1.useEffect)(() => {
        if (currentProgramId) {
            setProgram(programs.find((p) => p.id == currentProgramId));
        }
        else if (programs.length > 0) {
            (0, ApiClient_1.selectProgram)(programs[0].id);
        }
    }, [programs, currentProgramId]);
    const availableTriggeringMidiKeys = () => [
        36,
        38,
        39,
        43,
        45,
        48,
        49,
        50,
        51,
        52,
        53,
        54
    ].filter(s => !dmxButtons.map(d => d.triggering_midi_key).includes(s))[0];
    const createDmxButtonAndSync = () => {
        program && (0, ApiClient_1.createDmxButton)({
            program_id: program.id,
            color: "#ffffff",
            duration_ms: 500,
            red_channels: [1, 4, 7, 10, 13, 16, 19, 22],
            nature: 'Boom',
            triggering_midi_key: availableTriggeringMidiKeys()
        }).then(fetchDmxButtons);
    };
    const updateDmxButtonAndSync = (id, params) => {
        (0, ApiClient_1.updateDmxButton)(id, params).then(fetchDmxButtons);
    };
    const deleteDmxButtonAndSync = (id) => {
        (0, ApiClient_1.deleteDmxButton)(id).then(fetchDmxButtons);
    };
    (0, react_1.useEffect)(() => { syncPrograms(); }, []);
    const ledBarConfigs = [
        {
            channel: 1,
            rgbDotsCount: 8,
            style: {
                transform: 'rotateY(110deg) rotateZ(11deg)',
                left: '-30%',
                bottom: '20%'
            }
        },
        {
            channel: 25,
            rgbDotsCount: 8,
            style: {
                transform: 'rotateY(110deg) rotateZ(-11deg)',
                right: '-30%',
                bottom: '20%'
            }
        },
        // {channel: 49, rgbDotsCount: 8},
        // {channel: 73, rgbDotsCount: 8},
        {
            channel: 97,
            rgbDotsCount: 16,
            style: {
                transform: 'rotate(90deg) scale(0.5)',
                top: '25%'
            }
        },
        {
            channel: 145, rgbDotsCount: 1,
            style: {
                transform: 'scale(0.5)',
                bottom: '-10%',
            }
        },
    ];
    const [selectedDmxButtonId, setSelectedDmxButtonId] = (0, react_1.useState)(undefined);
    // pass the value in provider and return
    return ((0, jsx_runtime_1.jsx)(exports.DmxButtonsContext.Provider, { value: {
            dmxButtons, selectedDmxButtonId, setSelectedDmxButtonId,
            program, programs, fetchPrograms: syncPrograms,
            syncPrograms,
            audioUrl, uploadProgramAudioAndSync,
            currentProgramId, setCurrentProgramId,
            ledBarConfigs,
            createDmxButtonAndSync, updateDmxButtonAndSync, deleteDmxButtonAndSync,
        }, children: children }));
};
exports.DmxButtonsContextProvider = DmxButtonsContextProvider;
//# sourceMappingURL=DmxButtonsContext.js.map