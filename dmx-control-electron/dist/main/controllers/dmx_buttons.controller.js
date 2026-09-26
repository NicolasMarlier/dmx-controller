"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxButtonController = void 0;
const core_1 = require("@sequelize/core");
const dmx_button_1 = require("../sequelize/models/dmx_button");
const dmx_loop_1 = require("../dmx_loop");
const application_controller_1 = require("./application.controller");
const getButton = async (id) => {
    const button = await dmx_button_1.DmxButton.findByPk(id);
    if (!button) {
        throw new application_controller_1.NotFoundError("DmxButton not found");
    }
    return button;
};
class DmxButtonController {
    static list = async (program_id) => (0, application_controller_1.handleErrors)(() => dmx_button_1.DmxButton.findAll({
        where: { [core_1.Op.or]: [{ program_id }, { program_id: null }] },
        order: [["program_id", "DESC",], ["created_at", "ASC"]],
    }));
    static get = async (id) => (0, application_controller_1.handleErrors)(() => getButton(id));
    static create = async (params) => (0, application_controller_1.handleErrors)(async () => {
        const button = await dmx_button_1.DmxButton.create({
            program_id: params.program_id,
            color: params.color ?? "#fffff",
            duration_ms: params.duration_ms ?? 100,
            red_channels: params.red_channels ?? [],
            nature: params.nature ?? 'Boom',
            triggering_midi_key: params.triggering_midi_key ?? null,
        });
        dmx_loop_1.DmxLoop.getInstance().resyncDmxButtons();
        return button;
    });
    static play = async (id) => (0, application_controller_1.handleErrors)(async () => {
        const button = await getButton(id);
        dmx_loop_1.DmxLoop.getInstance().triggerDmxButton(button.id, { mock_midi_signal: true });
        return button;
    });
    static update = async (id, params) => (0, application_controller_1.handleErrors)(async () => {
        const button = await getButton(id);
        await button.update({
            program_id: 'program_id' in params ? params.program_id : button.program_id,
            color: params.color ?? button.color,
            duration_ms: params.duration_ms ?? button.duration_ms,
            red_channels: params.red_channels ?? button.red_channels,
            nature: params.nature ?? button.nature,
            triggering_midi_key: 'triggering_midi_key' in params
                ? params.triggering_midi_key
                : button.triggering_midi_key,
        });
        dmx_loop_1.DmxLoop.getInstance().resyncDmxButtons();
        return button;
    });
    static destroy = async (id) => (0, application_controller_1.handleErrors)(async () => {
        const button = await getButton(id);
        await button.destroy();
        return true;
    });
}
exports.DmxButtonController = DmxButtonController;
//# sourceMappingURL=dmx_buttons.controller.js.map