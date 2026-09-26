"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const core_1 = require("@sequelize/core");
const dmx_midi_1 = require("./dmx_midi");
class Program extends core_1.Model {
    async getOrInitDmxMidi() {
        return await dmx_midi_1.DmxMidi.findOne({
            where: { program_id: this.id }
        }) || await dmx_midi_1.DmxMidi.create({
            program_id: this.id,
            midi_patterns: []
        });
    }
    static initModel(sequelize) {
        Program.init({
            id: {
                type: core_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new core_1.DataTypes.STRING(128),
                allowNull: false,
            },
            bpm: {
                type: core_1.DataTypes.INTEGER.UNSIGNED,
                defaultValue: 85,
                allowNull: false,
            },
            audio_filename: {
                type: new core_1.DataTypes.STRING(256),
                allowNull: true,
            }
        }, {
            tableName: 'programs',
            sequelize,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
        return Program;
    }
}
exports.Program = Program;
//# sourceMappingURL=program.js.map