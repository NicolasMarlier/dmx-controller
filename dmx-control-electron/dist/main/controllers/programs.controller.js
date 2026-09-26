"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsController = void 0;
const program_1 = require("../sequelize/models/program");
const application_controller_1 = require("./application.controller");
const dmx_midi_1 = require("../sequelize/models/dmx_midi");
const dmx_loop_1 = require("../dmx_loop");
const getProgram = async (id) => {
    const program = await program_1.Program.findByPk(id);
    if (!program) {
        throw new application_controller_1.NotFoundError("Program not found");
    }
    return program;
};
class ProgramsController {
    static list = async () => (0, application_controller_1.handleErrors)(async () => {
        const programs = await program_1.Program.findAll({ order: [['id', 'ASC']] });
        return programs;
    });
    static create = async (params) => (0, application_controller_1.handleErrors)(async () => {
        const program = await program_1.Program
            .create(params);
        await dmx_midi_1.DmxMidi
            .create({
            program_id: program.id,
            midi_patterns: []
        });
        return {
            status: 'ok',
            program: program
        };
    });
    static select = async (id) => (0, application_controller_1.handleErrors)(async () => {
        const program = await getProgram(id);
        await dmx_loop_1.DmxLoop.getInstance().switchProgram(program.id);
        return { status: 'ok' };
    });
    static update = async (id, params) => (0, application_controller_1.handleErrors)(async () => {
        const program = await getProgram(id);
        program.update(params);
        return { status: 'ok' };
    });
    static destroy = async (id) => (0, application_controller_1.handleErrors)(async () => {
        const program = await getProgram(id);
        await program.destroy();
        return { success: true };
    });
}
exports.ProgramsController = ProgramsController;
//# sourceMappingURL=programs.controller.js.map