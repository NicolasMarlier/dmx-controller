"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SmallButton_1 = __importDefault(require("../DesignSystem/SmallButton/SmallButton"));
const Icons_1 = require("../DesignSystem/Icons");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const utils_1 = require("./utils");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const AudioPlayer = () => {
    const { program, audioUrl } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const { midiCurrentTickRef, sendCurrentTickToServer } = (0, RealTimeContext_1.useRealTimeContext)();
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!audioRef.current)
            return;
        audioRef.current.pause();
        setIsPlaying(false);
        if (!audioUrl)
            audioRef.current.src = '';
    }, [audioUrl]);
    const pause = () => {
        if (!audioRef.current)
            return;
        audioRef.current.pause();
        setIsPlaying(false);
    };
    const play = () => {
        if (!audioRef.current)
            return;
        if (program) {
            audioRef.current.currentTime = (0, utils_1.tickToTime)(midiCurrentTickRef.current, program.bpm);
        }
        audioRef.current.play();
        setIsPlaying(true);
    };
    const onRewindButton = () => {
        if (!audioRef.current)
            return;
        audioRef.current.currentTime = 0;
        sendCurrentTickToServer(0);
    };
    (0, react_1.useEffect)(() => {
        if (isPlaying && program) {
            const audioInterval = setInterval(() => {
                if (audioRef.current) {
                    sendCurrentTickToServer((0, utils_1.timeToTick)(audioRef.current.currentTime, program.bpm));
                }
            }, 30);
            return () => clearInterval(audioInterval);
        }
    }, [isPlaying]);
    const onKeyDown = (e) => {
        if (e.key == ' ')
            (isPlaying ? pause : play)();
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isPlaying]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("audio", { ref: audioRef, src: audioUrl }), (0, jsx_runtime_1.jsx)(SmallButton_1.default, { value: isPlaying, onClick: () => { (isPlaying ? pause : play)(); }, children: isPlaying ? (0, jsx_runtime_1.jsx)(Icons_1.PauseIcon, {}) : (0, jsx_runtime_1.jsx)(Icons_1.PlayIcon, {}) }), (0, jsx_runtime_1.jsx)(SmallButton_1.default, { value: false, onClick: onRewindButton, disabled: isPlaying, children: (0, jsx_runtime_1.jsx)(Icons_1.BackToStartIcon, {}) })] });
};
exports.default = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map