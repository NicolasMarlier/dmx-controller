"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./App.scss");
const DmxScene_1 = __importDefault(require("./components/DmxScene/DmxScene"));
const DmxButtonDetails_1 = __importDefault(require("./components/DmxButtonDetails/DmxButtonDetails"));
const ProgramSelect_1 = __importDefault(require("./components/ProgramSelect/ProgramSelect"));
const DmxButtonsCollection_1 = __importDefault(require("./components/DmxButtonsCollection/DmxButtonsCollection"));
const TrackEditor_1 = __importDefault(require("./components/MidiPlayer/TrackEditor"));
const Statuses_1 = __importDefault(require("./components/Statuses/Statuses"));
const DmxButtonsContext_1 = require("./contexts/DmxButtonsContext");
const DebugConsole_1 = __importDefault(require("./components/DebugConsole/DebugConsole"));
const RealTimeContext_1 = require("./contexts/RealTimeContext");
const NoteEditor_1 = __importDefault(require("./components/MidiPlayer/NoteEditor"));
const DmxMidiContext_1 = require("./contexts/DmxMidiContext");
const SmallButton_1 = __importDefault(require("./components/DesignSystem/SmallButton/SmallButton"));
const Icons_1 = require("./components/DesignSystem/Icons");
const AudioPlayer_1 = __importDefault(require("./components/MidiPlayer/AudioPlayer"));
function App() {
    const { program } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const { selectedMidiPatterns, isRecording, setIsRecording } = (0, DmxMidiContext_1.useDmxMidiContext)();
    const { debug } = (0, RealTimeContext_1.useRealTimeContext)();
    return ((0, jsx_runtime_1.jsxs)("div", { id: "app", children: [debug && (0, jsx_runtime_1.jsx)(DebugConsole_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: 'section commands-bar', children: [(0, jsx_runtime_1.jsx)(ProgramSelect_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "small-buttons-bar", children: [(0, jsx_runtime_1.jsx)(SmallButton_1.default, { className: "red", value: isRecording, onClick: () => setIsRecording(!isRecording), children: (0, jsx_runtime_1.jsx)(Icons_1.RecordIcon, {}) }), (0, jsx_runtime_1.jsx)(AudioPlayer_1.default, {})] }), (0, jsx_runtime_1.jsx)(Statuses_1.default, {})] }), (0, jsx_runtime_1.jsxs)("div", { className: "section midi", children: [program ? (0, jsx_runtime_1.jsx)(TrackEditor_1.default, { program: program }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), selectedMidiPatterns.length == 1 && (0, jsx_runtime_1.jsx)(NoteEditor_1.default, { pattern: selectedMidiPatterns[0] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "section dmx", children: [(0, jsx_runtime_1.jsx)(DmxButtonDetails_1.default, {}), (0, jsx_runtime_1.jsx)(DmxButtonsCollection_1.default, {}), (0, jsx_runtime_1.jsx)(DmxScene_1.default, {})] })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map