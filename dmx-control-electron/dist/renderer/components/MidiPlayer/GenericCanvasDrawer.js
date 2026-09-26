"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCurrentSelection = exports.drawTimeline = exports.drawBeatsGrid = exports.drawCurrentTick = exports.drawRoundedRect = exports.RECORDING_COLOR = exports.ITEM_COLOR = exports.SELECTED_COLOR = exports.SECONDARY_GRID_COLOR = exports.PRIMARY_GRID_COLOR = void 0;
const utils_1 = require("./utils");
exports.PRIMARY_GRID_COLOR = "#333";
exports.SECONDARY_GRID_COLOR = "#282828";
exports.SELECTED_COLOR = "#e8531a";
exports.ITEM_COLOR = "#3ad400";
exports.RECORDING_COLOR = "#9221e866";
const drawRoundedRect = (ctx, rect) => {
    ctx.beginPath();
    ctx.roundRect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0, 4);
    ctx.fill();
};
exports.drawRoundedRect = drawRoundedRect;
const drawCurrentTick = (props, currentMidiTick) => {
    const { ctx, ticksScroll, pixelsPerBeat, height, baseXOffset } = props;
    ctx.fillStyle = "#fff";
    ctx.fillRect((0, utils_1.ticksOffsetToPixels)(currentMidiTick, ticksScroll, pixelsPerBeat, baseXOffset || 0), 0, 1, height);
};
exports.drawCurrentTick = drawCurrentTick;
const primaryGridRatio = (tick, props) => {
    const { ppq, pixelsPerBeat } = props;
    if (pixelsPerBeat > 20)
        return tick % ppq == 0;
    else if (pixelsPerBeat > 10)
        return tick % (ppq * 4) == 0;
    else
        return tick % (ppq * 16) == 0;
};
const secondaryGridRatio = (tick, props) => {
    const { ppq, pixelsPerBeat } = props;
    if (pixelsPerBeat > 20)
        return tick % (ppq / 4) == 0;
    else if (pixelsPerBeat > 10)
        return tick % ppq == 0;
    else
        return tick % (ppq * 4) == 0;
};
const drawBeatsGrid = (props) => {
    const { ctx, ppq, height, ticksScroll, pixelsPerBeat, baseXOffset, baseYOffset } = props;
    for (let tick = 0; tick <= ppq * 60 * 10; tick += 1) {
        const isPrimary = primaryGridRatio(tick, props);
        const isSecondary = secondaryGridRatio(tick, props);
        if (isPrimary || isSecondary) {
            ctx.fillStyle = isPrimary ? exports.PRIMARY_GRID_COLOR : exports.SECONDARY_GRID_COLOR;
            ctx.fillRect((0, utils_1.ticksOffsetToPixels)(tick, ticksScroll, pixelsPerBeat, baseXOffset), (baseYOffset || 0) - (isPrimary ? 6 : 3), 1, height + (isPrimary ? 6 : 3));
        }
    }
};
exports.drawBeatsGrid = drawBeatsGrid;
const drawTimeline = (props) => {
    const { ctx, ppq, ticksScroll, pixelsPerBeat, baseXOffset, baseYOffset } = props;
    ctx.font = '10px monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff66";
    for (let tick = 0; tick <= ppq * 60 * 10; tick += 1) {
        if (primaryGridRatio(tick, props)) {
            ctx.fillText(`${tick / ppq + 1}`, (0, utils_1.ticksOffsetToPixels)(tick, ticksScroll, pixelsPerBeat, baseXOffset) + 3, (baseYOffset || 0) / 2);
        }
    }
    ctx.fillStyle = '#111';
};
exports.drawTimeline = drawTimeline;
const drawCurrentSelection = (props, mouseSelection) => {
    const { ctx } = props;
    ctx.strokeStyle = "#ffffff88";
    ctx.strokeRect(mouseSelection.x0, mouseSelection.y0, mouseSelection.x1 - mouseSelection.x0, mouseSelection.y1 - mouseSelection.y0);
};
exports.drawCurrentSelection = drawCurrentSelection;
//# sourceMappingURL=GenericCanvasDrawer.js.map