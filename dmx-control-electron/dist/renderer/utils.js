"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanizeMidiKey = exports.MUSIC_KEYS = void 0;
exports.MUSIC_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', "A", 'A#', 'B'];
const humanizeMidiKey = (midiKey) => {
    const musicKey = exports.MUSIC_KEYS[midiKey % exports.MUSIC_KEYS.length];
    const midiLevel = Math.floor(midiKey / exports.MUSIC_KEYS.length) - 2;
    return [musicKey, midiLevel].join('');
};
exports.humanizeMidiKey = humanizeMidiKey;
//# sourceMappingURL=utils.js.map