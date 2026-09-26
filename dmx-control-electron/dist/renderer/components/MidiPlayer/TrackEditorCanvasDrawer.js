"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redrawFullCanvas = void 0;
const GenericCanvasDrawer_1 = require("./GenericCanvasDrawer");
const utils_1 = require("./utils");
const drawAudioWave = (props, audioWaveData) => {
    const { ctx, ticksScroll, pixelsPerBeat, width, height } = props;
    ctx.fillStyle = "#000000aa";
    ctx.beginPath();
    ctx.roundRect(0, 3 * height / 5, width, 2 * height / 5, 4);
    ctx.fill();
    ctx.fillStyle = "#ffffff06";
    audioWaveData.forEach((dataPoint, ticks) => {
        const dataPointHeight = dataPoint * height * 2 / (255 * 5);
        ctx.fillRect((0, utils_1.ticksOffsetToPixels)(ticks, ticksScroll, pixelsPerBeat), height * 4 / 5 - dataPointHeight / 2, 1, dataPointHeight);
    });
};
const drawMidiPattern = (props, params) => {
    const { ctx, height, ticksScroll, pixelsPerBeat, allMidiKeys } = props;
    const { midiPattern, currentMidiTick } = params;
    const rect = (0, utils_1.midiPatternToRectangle)(midiPattern, height, ticksScroll, pixelsPerBeat);
    (0, GenericCanvasDrawer_1.drawRoundedRect)(ctx, rect);
    midiPattern.midi_notes.forEach((midiNote) => {
        ctx.fillStyle = "#00000055";
        // Highlight when played
        if (currentMidiTick >= midiNote.ticks && currentMidiTick < midiNote.ticks + midiNote.durationTicks) {
            ctx.fillStyle = "#ffffffcc";
        }
        ctx.fillRect((0, utils_1.ticksOffsetToPixels)(midiNote.ticks, ticksScroll, pixelsPerBeat) + 1, (0, utils_1.midiKeyToPixelsOffset)(midiNote.midi, height, allMidiKeys), (0, utils_1.ticksDurationToPixels)(midiNote.durationTicks, pixelsPerBeat) - 1, (0, utils_1.midiKeyToPixelsHeight)(height));
    });
};
const drawMidiPatterns = (props, params) => {
    const { ctx } = props;
    const { midiPatterns, selectedMidiPatterns, currentMidiTick, mouseSelection, transformMidiPattern } = params;
    midiPatterns.forEach((midiPattern) => {
        const isSelected = selectedMidiPatterns.find((n) => n.ticks == midiPattern.ticks);
        ctx.fillStyle = isSelected ? GenericCanvasDrawer_1.SELECTED_COLOR : GenericCanvasDrawer_1.ITEM_COLOR;
        const draggableMidiPattern = mouseSelection?.mode == 'drag' && isSelected ? transformMidiPattern(midiPattern, mouseSelection.rect.x1 - mouseSelection.rect.x0, mouseSelection.rect.y1 - mouseSelection.rect.y0) : midiPattern;
        drawMidiPattern(props, { midiPattern: draggableMidiPattern, currentMidiTick });
        if (midiPattern.loop_until_tick) {
            const loopUntilTick = midiPattern.loop_until_tick;
            for (let i = midiPattern.ticks + midiPattern.durationTicks; i < loopUntilTick; i += midiPattern.durationTicks) {
                const loopedPattern = {
                    ticks: i,
                    durationTicks: Math.min(midiPattern.durationTicks, loopUntilTick - i),
                    midi_notes: midiPattern
                        .midi_notes
                        .map(n => ({ ...n, ...{ ticks: n.ticks + i - midiPattern.ticks } }))
                        .filter(n => n.ticks < loopUntilTick)
                };
                ctx.fillStyle = isSelected ? GenericCanvasDrawer_1.SELECTED_COLOR + "33" : GenericCanvasDrawer_1.ITEM_COLOR + "33";
                drawMidiPattern(props, { midiPattern: loopedPattern, currentMidiTick });
            }
        }
    });
};
const drawRecordingMidiPattern = (props, args) => {
    const { ctx } = props;
    const { recordingMidiPattern: midiPattern, currentMidiTick } = args;
    ctx.fillStyle = GenericCanvasDrawer_1.RECORDING_COLOR;
    drawMidiPattern(props, { midiPattern, currentMidiTick });
};
const drawGhostMidiPattern = (props, ghostMidiPattern) => {
    drawMidiPattern(props, { midiPattern: ghostMidiPattern, currentMidiTick: -1 });
};
const redrawFullCanvas = (props) => {
    const { canvas, midiPatterns, recordingMidiPattern, audioWaveData, ghostMidiPattern, selectedMidiPatterns, currentMidiTick, mouseSelection, transformMidiPattern } = props;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const { width, height } = (0, utils_1.setupCanvasDPR)(canvas, ctx, -2);
    const drawerFunctionProps = {
        ...props,
        ...{
            width,
            height,
            ctx,
            baseYOffset: height / 5
        }
    };
    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height / 5);
    (0, GenericCanvasDrawer_1.drawBeatsGrid)(drawerFunctionProps);
    // Top part
    (0, GenericCanvasDrawer_1.drawTimeline)(drawerFunctionProps);
    // Middle part
    drawMidiPatterns(drawerFunctionProps, { midiPatterns, selectedMidiPatterns, currentMidiTick, mouseSelection, transformMidiPattern });
    if (recordingMidiPattern)
        drawRecordingMidiPattern(drawerFunctionProps, { recordingMidiPattern, currentMidiTick });
    if (ghostMidiPattern) {
        drawGhostMidiPattern(drawerFunctionProps, ghostMidiPattern);
    }
    // Bottom part
    drawAudioWave(drawerFunctionProps, audioWaveData);
    // Overlay
    (0, GenericCanvasDrawer_1.drawCurrentTick)(drawerFunctionProps, currentMidiTick);
    if (mouseSelection?.mode == 'select') {
        (0, GenericCanvasDrawer_1.drawCurrentSelection)(drawerFunctionProps, mouseSelection.rect);
    }
};
exports.redrawFullCanvas = redrawFullCanvas;
//# sourceMappingURL=TrackEditorCanvasDrawer.js.map