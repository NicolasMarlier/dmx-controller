"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmxButton = void 0;
const core_1 = require("@sequelize/core");
class DmxButton extends core_1.Model {
    static initModel(sequelize) {
        DmxButton.init({
            id: {
                type: core_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: core_1.DataTypes.UUIDV4,
            },
            program_id: {
                type: core_1.DataTypes.INTEGER,
                allowNull: true,
            },
            color: {
                type: core_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "#ffffff",
            },
            duration_ms: {
                type: core_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500,
            },
            red_channels: {
                type: core_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [1, 5, 7],
            },
            nature: {
                type: core_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Set'
            },
            triggering_midi_key: {
                type: core_1.DataTypes.INTEGER,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: "dmx_buttons",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
        return DmxButton;
    }
}
exports.DmxButton = DmxButton;
//# sourceMappingURL=dmx_button.js.map