/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('comment', function (table) {
      table.increments('id');
      table.integer('newsid').notNullable();
      table.string('comment', 255).notNullable();
      table.string('email', 255).notNullable();
      table.date('date').notNullable();
  })   
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
