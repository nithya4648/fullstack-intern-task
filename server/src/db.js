const path = require('path');
const knex = require('knex');

const db = knex({
  client: 'better-sqlite3',
  connection: { filename: path.join(__dirname, '..', 'data.sqlite') },
  useNullAsDefault: true,
});

async function init() {
  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (t) => {
      t.increments('id');
      t.string('name').notNullable();
      t.string('email').notNullable().unique();
      t.string('password_hash').notNullable();
      t.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
  if (!(await db.schema.hasTable('templates'))) {
    await db.schema.createTable('templates', (t) => {
      t.increments('id');
      t.string('name').notNullable();
      t.text('description').notNullable();
      t.string('thumbnail_url').notNullable();
      t.string('category').notNullable();
    });
  }
  if (!(await db.schema.hasTable('favorites'))) {
    await db.schema.createTable('favorites', (t) => {
      t.increments('id');
      t.integer('user_id').notNullable().references('users.id').onDelete('CASCADE');
      t.integer('template_id').notNullable().references('templates.id').onDelete('CASCADE');
      t.unique(['user_id', 'template_id']);
    });
  }
}

module.exports = { db, init };
