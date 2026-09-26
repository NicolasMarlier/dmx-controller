"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeWave = void 0;
const sampleSignal = (signal, blockSize = 10) => {
    const samples = Math.ceil(signal.length / blockSize);
    const dataArray = new Uint8Array(samples);
    signal.forEach((dataPoint, i) => {
        dataArray[Math.round(i / blockSize)] = Math.max(dataArray[Math.round(i / blockSize)], Math.round(Math.abs(dataPoint) * 255));
    });
    return dataArray;
};
const computeWave = async (audioUrl, bpm, ppq) => {
    const audioCtx = new window.AudioContext();
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    // audioBuffer.sampleRate is 44_100 or 48_000 (Hz), ie signal per second
    // 1 second = SAMPLE_RATE datapoints
    // BPM beats = 60 seconds
    // 1 beat = PPQ ticks
    // 1 tick = 60  * SAMPLE_RATE / (PPQ * BPM) datapoints
    const dataPointsPerTick = 60 * audioBuffer.sampleRate / (ppq * bpm);
    const channelDataLeft = audioBuffer.getChannelData(0);
    const channelDataRight = audioBuffer.getChannelData(1);
    const channelData = channelDataLeft.map((e, i) => (e + channelDataRight[i]) / 2);
    return sampleSignal(channelData, dataPointsPerTick);
};
exports.computeWave = computeWave;
//# sourceMappingURL=utils_audio.js.map