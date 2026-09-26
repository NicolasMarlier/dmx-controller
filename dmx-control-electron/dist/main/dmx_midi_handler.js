"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxMidiHandler = void 0;
// PPQ: Pulses per quarter note
// ie: There are (PPQ) ticks in 1 beat
// ie: A beat last (PPQ ticks)
const PPQ = 480;
// 24 PPQM per clock event
// https://en.wikipedia.org/wiki/MIDI_beat_clock
//
// So at 480 PPQ that means we receive 20 CLOCK events per beat,
// ie 20 CLOCK events per second at 60 BPM
const CLOCK_PPQM = 24;
class DmxMidiHandler {
    isPlaying;
    currentTick;
    midiNotes;
    onMidiKey;
    constructor(params) {
        this.isPlaying = false;
        this.currentTick = 0;
        this.midiNotes = [];
        this.onMidiKey = params.onMidiKey || (() => { });
    }
    setMidiNotes(midiNotes) {
        this.midiNotes = midiNotes;
    }
    setMidiPatterns(midiPatterns) {
        this.midiNotes = midiPatterns.map(midiPattern => {
            if (!midiPattern.loop_until_tick)
                return midiPattern.midi_notes;
            const loopUntilTick = midiPattern.loop_until_tick;
            let loopedMidiNotes = [];
            for (let i = midiPattern.ticks; i < loopUntilTick; i += midiPattern.durationTicks) {
                loopedMidiNotes = loopedMidiNotes.concat(midiPattern
                    .midi_notes
                    .map(n => ({
                    ...n,
                    ...{
                        ticks: n.ticks + i - midiPattern.ticks
                    }
                }))
                    .filter(n => n.ticks < loopUntilTick));
            }
            return loopedMidiNotes;
        }).flat();
    }
    play = () => {
        this.currentTick = -PPQ / CLOCK_PPQM;
        this.isPlaying = true;
    };
    stop = (options) => {
        this.isPlaying = false;
        if (!!options?.reset) {
            this.currentTick = 0;
        }
    };
    receiveClock = () => {
        if (!this.isPlaying) {
            return false;
        }
        this.updateCurrentTickManually(this.nextTick());
    };
    updateCurrentTickManually = (newCurrentTick) => {
        this.emitNotes(this.currentTick, newCurrentTick);
        this.currentTick = newCurrentTick;
    };
    nextTick = () => this.currentTick + PPQ / CLOCK_PPQM;
    emitNotes = (fromTick, toTick) => {
        this.midiNotes
            .filter((midiNote) => midiNote.ticks >= fromTick && midiNote.ticks < toTick)
            .forEach((midiNote) => this.onMidiKey(midiNote.midi));
    };
}
exports.DmxMidiHandler = DmxMidiHandler;
//# sourceMappingURL=dmx_midi_handler.js.map