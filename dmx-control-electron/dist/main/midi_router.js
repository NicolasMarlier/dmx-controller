"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidiRouter = exports.MIDI_MODES = void 0;
const midi_1 = __importDefault(require("midi"));
const events_1 = require("events");
const range = (start, end) => {
    if (start === end)
        return [start];
    return [start, ...range(start + 1, end)];
};
// https://midi.org/expanded-midi-1-0-messages-list
exports.MIDI_MODES = {
    NOTE_OFF: range(128, 143),
    NOTE_ON: range(144, 159),
    PROGRAM_CHANGE: 192,
    MIDI_CLOCK: 248,
    MIDI_START: 250,
    MIDI_CONTINUE: 251,
    MIDI_STOP: 252,
    MIDI_ACTIVE_SENSING: 254,
};
class MidiRouter extends events_1.EventEmitter {
    scanDevicesInterval;
    monitor;
    inputs = new Map();
    timer;
    constructor(options = {}) {
        super();
        this.scanDevicesInterval = options.scanDevicesInterval ?? 1000;
        this.monitor = new midi_1.default.Input();
    }
    startListenning() {
        this.scanMidiDevices();
        this.timer = setInterval(() => this.scanMidiDevices(), this.scanDevicesInterval);
    }
    stopListenning() {
        if (this.timer)
            clearInterval(this.timer);
        for (const { input } of this.inputs.values()) {
            input.closePort();
        }
        this.inputs.clear();
    }
    scanMidiDevices() {
        const portCount = this.monitor.getPortCount();
        const current = new Map();
        for (let i = 0; i < portCount; i++) {
            try {
                const name = this.monitor.getPortName(i);
                current.set(name, i);
                if (!this.inputs.has(name)) {
                    this.openPort(name, i);
                }
            }
            catch (e) {
                if (e instanceof RangeError) {
                    break;
                }
                else {
                    throw e;
                }
            }
        }
        for (const name of this.inputs.keys()) {
            if (!current.has(name)) {
                this.closePort(name);
            }
        }
    }
    openPort(name, port) {
        const input = new midi_1.default.Input();
        console.log(`Open Midi port ${port} for device ${name}`);
        input.on("message", (deltaTime, message) => {
            const [status, data1, data2] = message;
            if (!status) {
                return;
            }
            const msg = {
                device: name,
                deltaTime,
                status,
                data1,
                data2,
                raw: message,
                channel: status & 0x0f,
                type: status & 0xf0,
            };
            this.emit("message", msg);
            if (exports.MIDI_MODES.NOTE_ON.includes(msg.status)) {
                console.log('Note on', msg);
                this.emit("noteon", msg);
            }
            else if (exports.MIDI_MODES.NOTE_OFF.includes(msg.status)) {
                this.emit("noteoff", msg);
            }
            else if (msg.status === exports.MIDI_MODES.PROGRAM_CHANGE) {
                this.emit("programchange", msg);
            }
            else if (msg.status === exports.MIDI_MODES.MIDI_CLOCK) {
                this.emit("clock", msg);
            }
            else if (msg.status === exports.MIDI_MODES.MIDI_START) {
                this.emit("midistart", msg);
            }
            else if (msg.status === exports.MIDI_MODES.MIDI_STOP) {
                this.emit("midistop", msg);
            }
            else if (msg.status === exports.MIDI_MODES.MIDI_ACTIVE_SENSING) {
                // Nothing
            }
            else {
                console.log("Uncaught message", msg);
            }
        });
        input.openPort(port);
        input.ignoreTypes(false, false, false);
        this.inputs.set(name, { input, port });
        this.emit("connected", name);
    }
    closePort(name) {
        const entry = this.inputs.get(name);
        if (!entry)
            return;
        entry.input.closePort();
        this.inputs.delete(name);
        this.emit("disconnected", name);
    }
    onMessage(handler) {
        this.on("message", handler);
    }
}
exports.MidiRouter = MidiRouter;
//# sourceMappingURL=midi_router.js.map