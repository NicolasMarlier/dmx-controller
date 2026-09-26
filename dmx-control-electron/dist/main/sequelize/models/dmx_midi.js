"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxMidi = void 0;
const core_1 = require("@sequelize/core");
class DmxMidi extends core_1.Model {
    static initModel(sequelize) {
        DmxMidi.init({
            id: {
                type: core_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: core_1.DataTypes.UUIDV4,
            },
            program_id: {
                type: core_1.DataTypes.INTEGER,
                allowNull: false,
            },
            midi_patterns: {
                type: core_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
        }, {
            sequelize,
            tableName: "dmx_midis",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
        return DmxMidi;
    }
}
exports.DmxMidi = DmxMidi;
//# sourceMappingURL=dmx_midi.js.map