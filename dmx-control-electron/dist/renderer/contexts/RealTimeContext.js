"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeContextProvider = exports.useRealTimeContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
//import useWebSocket, { ReadyState } from "react-use-websocket"
const DmxButtonsContext_1 = require("./DmxButtonsContext");
const LostConnectionOverlay_1 = __importDefault(require("../components/LostConnectionOverlay/LostConnectionOverlay"));
//const WS_URL = import.meta.env.VITE_WS_URL || `ws://127.0.0.1:8080`
const RealTimeContext = (0, react_1.createContext)(null);
const useRealTimeContext = () => {
    const realTimeContext = (0, react_1.useContext)(RealTimeContext);
    if (!realTimeContext) {
        throw new Error("useRealTimeContext has to be used within <RealTimeContext.Provider>");
    }
    return realTimeContext;
};
exports.useRealTimeContext = useRealTimeContext;
const RealTimeContextProvider = ({ children }) => {
    const { setCurrentProgramId, syncPrograms, programs } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const midiCurrentTickRef = (0, react_1.useRef)(0);
    const [lastReceivedMidiKey, setLastReceivedMidiKey] = (0, react_1.useState)(undefined);
    const [enttecOpenUSBState, setEnttecOpenUSBState] = (0, react_1.useState)('Not connected');
    const [dmxHexSignal, setDmxHexSignal] = (0, react_1.useState)("");
    const [debugIncomingWsPayloads, setDebugIncomingWsPayloads] = (0, react_1.useState)([]);
    const [debugOutgoingWsPayloads, setDebugOutgoingWsPayloads] = (0, react_1.useState)([]);
    const debug = false;
    // const { lastMessage, readyState, sendMessage } = useWebSocket(WS_URL, {
    //       shouldReconnect: () => true,
    //       queryParams: { },
    //       share: true,
    //       onError: (error) => {
    //         console.error('WebSocket connection error:', error)
    //       }
    // })
    const lastMessage = null;
    const readyState = "open";
    const sendMessage = (d) => new Promise((_, reject) => reject());
    (0, react_1.useEffect)(() => {
        if (!!lastReceivedMidiKey) {
            const intervalId = setTimeout(() => setLastReceivedMidiKey(undefined), 3000);
            return () => clearInterval(intervalId);
        }
    }, [lastReceivedMidiKey]);
    (0, react_1.useEffect)(() => {
        if (lastMessage !== null) {
            const jsonMessage = JSON.parse(lastMessage.data);
            if (debug) {
                setDebugIncomingWsPayloads(p => [...[jsonMessage], ...p]);
            }
            if (jsonMessage.channel === 'dmx') {
                const { enttecOpenDMXUSB: { state: state }, dmxHexSignal: dmxHexSignal, midiCurrentTick: midiCurrentTick } = jsonMessage.data;
                setEnttecOpenUSBState(state);
                setDmxHexSignal(dmxHexSignal);
                midiCurrentTickRef.current = midiCurrentTick;
            }
            else if (jsonMessage.channel === 'control') {
                if (jsonMessage.action == 'change_program') {
                    setCurrentProgramId(jsonMessage.data.program_id);
                    syncPrograms();
                }
            }
            else if (jsonMessage.channel === 'midi_input') {
                if (jsonMessage.action == 'note_on') {
                    const message = jsonMessage.data;
                    setLastReceivedMidiKey({
                        midi: message.midi,
                        at: Date.now()
                    });
                }
            }
            else {
                console.log("Received unknown WS message", jsonMessage);
            }
        }
    }, [lastMessage, programs]);
    const sendOutgoingMessage = (payload) => {
        if (debug) {
            setDebugOutgoingWsPayloads(p => [...[payload], ...p]);
        }
        sendMessage(JSON.stringify(payload));
    };
    const sendCurrentTickToServer = (midiCurrentTick) => {
        const payload = {
            channel: 'dmx-midi-control',
            data: {
                midiCurrentTick
            }
        };
        sendOutgoingMessage(payload);
    };
    return ((0, jsx_runtime_1.jsxs)(RealTimeContext.Provider, { value: {
            lastReceivedMidiKey,
            setLastReceivedMidiKey,
            midiCurrentTickRef,
            sendCurrentTickToServer,
            dmxHexSignal,
            webSocketReadyState: readyState,
            enttecOpenUSBState,
            debug,
            debugIncomingWsPayloads,
            debugOutgoingWsPayloads,
        }, children: [readyState != "open" && (0, jsx_runtime_1.jsx)(LostConnectionOverlay_1.default, {}), children] }));
};
exports.RealTimeContextProvider = RealTimeContextProvider;
//# sourceMappingURL=RealTimeContext.js.map