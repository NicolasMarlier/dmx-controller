"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMidiRouter = void 0;
const dmx_loop_1 = require("../dmx_loop");
const midi_router_1 = require("../midi_router");
const initMidiRouter = () => {
    const midi_router = new midi_router_1.MidiRouter();
    midi_router.on('programchange', (e) => {
        const programId = e.data1 + 1;
        dmx_loop_1.DmxLoop.getInstance().switchProgram(programId);
    });
    midi_router.on('noteon', (e) => {
        const midiKey = e.data1;
        const data = {
            midi: midiKey
        };
        dmx_loop_1.DmxLoop.getInstance().triggerDmxButtonsByMidiKey(midiKey);
        // wsSendToAll(JSON.stringify({
        //     channel: 'midi_input',
        //     action: 'note_on',
        //     data
        // }))
    });
    midi_router.on('clock', () => {
        dmx_loop_1.DmxLoop.getInstance().dmxMidiHandler.receiveClock();
    });
    midi_router.on('midistart', () => dmx_loop_1.DmxLoop.getInstance().dmxMidiHandler.play());
    midi_router.on('midistop', () => {
        dmx_loop_1.DmxLoop.getInstance().dmxMidiHandler.stop();
    });
    midi_router.startListenning();
};
exports.initMidiRouter = initMidiRouter;
//# sourceMappingURL=midi_router.js.map