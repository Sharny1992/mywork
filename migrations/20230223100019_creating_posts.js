/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('posts', function (table) {
      table.increments('id');
      table.integer('userid').notNullable();
      table.string('content', 255).notNullable();
      table.string('titlenews', 255).notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
