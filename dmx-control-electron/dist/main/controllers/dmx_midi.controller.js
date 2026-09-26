"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxMidiController = void 0;
const program_1 = require("../sequelize/models/program");
const dmx_loop_1 = require("../dmx_loop");
const application_controller_1 = require("./application.controller");
const getDmxMidi = async (program_id) => {
    const program = await program_1.Program.findByPk(program_id);
    if (!program) {
        throw new application_controller_1.NotFoundError("Program not found");
    }
    const dmxMidi = await program.getOrInitDmxMidi();
    return dmxMidi;
};
class DmxMidiController {
    static get = (program_id) => (0, application_controller_1.handleErrors)(async () => getDmxMidi(program_id));
    static update = async (program_id, params) => (0, application_controller_1.handleErrors)(async () => {
        const dmxMidi = await getDmxMidi(program_id);
        const midi_patterns = params.midi_patterns;
        await dmxMidi.update({
            midi_patterns: midi_patterns
        });
        dmx_loop_1.DmxLoop.getInstance().reloadMidi();
        return dmxMidi;
    });
}
exports.DmxMidiController = DmxMidiController;
//# sourceMappingURL=dmx_midi.controller.js.map