"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSequelize = void 0;
const core_1 = require("@sequelize/core");
const sqlite3_1 = require("@sequelize/sqlite3");
const dmx_button_1 = require("./models/dmx_button");
const dmx_midi_1 = require("./models/dmx_midi");
const program_1 = require("./models/program");
const initSequelize = () => {
    const sequelize = new core_1.Sequelize({
        dialect: sqlite3_1.SqliteDialect,
        storage: 'main.sqlite'
    });
    program_1.Program.initModel(sequelize);
    dmx_button_1.DmxButton.initModel(sequelize);
    dmx_midi_1.DmxMidi.initModel(sequelize);
    program_1.Program.hasMany(dmx_button_1.DmxButton, { foreignKey: 'program_id' });
    dmx_button_1.DmxButton.belongsTo(program_1.Program, { foreignKey: 'program_id' });
    program_1.Program.hasOne(dmx_button_1.DmxButton, { foreignKey: 'program_id' });
    dmx_midi_1.DmxMidi.belongsTo(program_1.Program, { foreignKey: 'program_id' });
    return sequelize;
};
exports.initSequelize = initSequelize;
//# sourceMappingURL=init_sequelize.js.map