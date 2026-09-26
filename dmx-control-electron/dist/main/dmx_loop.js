"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxLoop = exports.DMX_LOOP_EVENTS = void 0;
const events_1 = __importDefault(require("events"));
const utils_1 = require("./utils");
const DmxEffect_1 = __importDefault(require("./dmx/effects/DmxEffect"));
const utils_2 = require("./dmx/effects/utils");
const dmx_button_1 = require("./sequelize/models/dmx_button");
const DmxSet_1 = __importDefault(require("./dmx/effects/DmxSet"));
const DmxBoom_1 = __importDefault(require("./dmx/effects/DmxBoom"));
const DmxRun_1 = __importDefault(require("./dmx/effects/DmxRun"));
const DmxToggle_1 = __importDefault(require("./dmx/effects/DmxToggle"));
const program_1 = require("./sequelize/models/program");
const dmx_midi_handler_1 = require("./dmx_midi_handler");
const DmxInverseRun_1 = __importDefault(require("./dmx/effects/DmxInverseRun"));
const sequelize_1 = require("sequelize");
const LOOP_INTERVAL_MS = 20;
const DMX_EFFECTS = {
    'Set': DmxSet_1.default,
    'Boom': DmxBoom_1.default,
    'Run': DmxRun_1.default,
    'InverseRun': DmxInverseRun_1.default,
    'Toggle': DmxToggle_1.default,
};
exports.DMX_LOOP_EVENTS = {
    TICK: 'tick',
    PROGRAM_CHANGE: 'programchange',
    MIDI_NOTES_UPDATED: 'midinotesupdated',
    MOCK_MIDI_INPUT: 'mockmidiinput'
};
class DmxLoop extends events_1.default {
    static instance;
    interval;
    onLoop;
    dmxButtons;
    dmx_buttons_triggered;
    current_program_id;
    dmx_hex_signal = (0, utils_1.emptyDmxHexString)();
    dmxMidiHandler;
    constructor(current_program_id, dmxButtons) {
        super();
        this.dmxButtons = dmxButtons;
        this.dmx_buttons_triggered = {};
        this.current_program_id = current_program_id;
        this.dmxMidiHandler = new dmx_midi_handler_1.DmxMidiHandler({
            onMidiKey: (midiKey) => {
                this.triggerDmxButtonsByMidiKey(midiKey, { mock_midi_signal: true });
            }
        });
        this.switchToFirstProgram();
    }
    switchToFirstProgram = async () => {
        const program = await program_1.Program.findOne();
        program && this.switchProgram(program.id);
    };
    static getInstance() {
        if (!DmxLoop.instance) {
            DmxLoop.instance = new DmxLoop(undefined, []);
        }
        return DmxLoop.instance;
    }
    resyncDmxButtons = async () => {
        this.dmxButtons = await dmx_button_1.DmxButton.findAll({ where: { [sequelize_1.Op.or]: [{ program_id: this.current_program_id }, { program_id: null }] }, });
    };
    areDmxButtonChannelsBlack = (dmxButton) => dmxButton.red_channels.every((redChannel) => ((0, utils_2.getDmxSignalAt)(this.dmx_hex_signal, redChannel + 0) == 0 &&
        (0, utils_2.getDmxSignalAt)(this.dmx_hex_signal, redChannel + 1) == 0 &&
        (0, utils_2.getDmxSignalAt)(this.dmx_hex_signal, redChannel + 2) == 0));
    nextDmxButtonTrigger = (dmxButton) => {
        // Only toggles ever go down, all the other effects always run forward
        if (dmxButton?.nature != 'Toggle')
            return { at: Date.now(), state: 'up' };
        const previousTrigger = this.dmx_buttons_triggered[dmxButton.id];
        if (!previousTrigger)
            return {
                at: Date.now(),
                state: this.areDmxButtonChannelsBlack(dmxButton) ? 'up' : 'down'
            };
        // Triggered again while still fading: reverse it, back-dating the trigger so it resumes
        // from the current brightness instead of jumping back to the start
        const previousCompleteness = DmxEffect_1.default.computeCompleteness(dmxButton.duration_ms, previousTrigger.at);
        return {
            at: Date.now() - (1 - previousCompleteness) * dmxButton.duration_ms,
            state: previousTrigger.state == 'up' ? 'down' : 'up'
        };
    };
    triggerDmxButton = (dmxButtonId, options) => {
        const dmxButton = this.dmxButtons.find((dmxButton) => dmxButton.id == dmxButtonId);
        this.dmx_buttons_triggered[dmxButtonId] = this.nextDmxButtonTrigger(dmxButton);
        if (dmxButton?.triggering_midi_key && options?.mock_midi_signal) {
            this.emit(exports.DMX_LOOP_EVENTS.MOCK_MIDI_INPUT, dmxButton.triggering_midi_key);
        }
    };
    triggerDmxButtonsByMidiKey = (midiKey, options) => {
        this.dmxButtons.filter((dmxButton) => dmxButton.triggering_midi_key == midiKey).forEach((dmxButton) => {
            this.triggerDmxButton(dmxButton.id, options);
        });
    };
    detriggerDmxButton = (dmxButtonId) => {
        delete this.dmx_buttons_triggered[dmxButtonId];
    };
    switchProgram = async (program_id) => {
        const program = await program_1.Program.findByPk(program_id);
        this.current_program_id = program?.id;
        this.resyncDmxButtons();
        this.reloadMidi();
        this.emit(exports.DMX_LOOP_EVENTS.PROGRAM_CHANGE, this.current_program_id);
    };
    reloadMidi = async () => {
        const program = await program_1.Program.findByPk(this.current_program_id);
        const dmxMidi = await program?.getOrInitDmxMidi();
        this.dmxMidiHandler.setMidiPatterns(dmxMidi?.midi_patterns || []);
    };
    applyDmxButtonToDmxSignal = (dmxButton, dmxHexSignal) => {
        const trigger = this.dmx_buttons_triggered[dmxButton.id];
        if (!trigger)
            return dmxHexSignal;
        const dmxEffect = DMX_EFFECTS[dmxButton.nature];
        const completeness = dmxEffect.computeCompleteness(dmxButton.duration_ms, trigger.at);
        const newDmxHexSignal = dmxEffect.transformDmxHexSignal(dmxHexSignal, completeness, dmxButton, trigger);
        if (completeness >= 1) {
            this.detriggerDmxButton(dmxButton.id);
        }
        return newDmxHexSignal;
    };
    applyAllDmxButtonsToDmxSignal = () => {
        return this.dmxButtons.reduce((currentDmxHexSignal, dmxButton) => this.applyDmxButtonToDmxSignal(dmxButton, currentDmxHexSignal), this.dmx_hex_signal);
    };
    start = () => {
        this.interval = setInterval(() => {
            this.dmx_hex_signal = this.applyAllDmxButtonsToDmxSignal();
            this.emit(exports.DMX_LOOP_EVENTS.TICK, this.dmx_hex_signal);
        }, LOOP_INTERVAL_MS);
    };
    stop = () => clearInterval(this.interval);
}
exports.DmxLoop = DmxLoop;
//# sourceMappingURL=dmx_loop.js.map