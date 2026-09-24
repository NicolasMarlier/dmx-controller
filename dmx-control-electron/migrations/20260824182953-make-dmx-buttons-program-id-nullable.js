'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Raw SQL on purpose. queryInterface.changeColumn cannot do this on Postgres:
  // in changeColumnQuery, the DROP NOT NULL branch is guarded by
  // `else if (!definition.includes('REFERENCES'))`, so passing `references`
  // alongside allowNull:true silently skips it and emits only ADD FOREIGN KEY.
  // The first version of this migration did exactly that -- it left the column
  // NOT NULL and added a second, identical foreign key. Hence the cleanup below.
  async up (queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "dmx_buttons"
        DROP CONSTRAINT IF EXISTS "dmx_buttons_program_id_fkey1";
      ALTER TABLE "dmx_buttons"
        ALTER COLUMN "program_id" DROP NOT NULL;
    `);
  },

  // Only reversible while no button is unbound; a NULL program_id makes this
  // fail, which is the honest outcome.
  async down (queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "dmx_buttons"
        ALTER COLUMN "program_id" SET NOT NULL;
    `);
  }
};
