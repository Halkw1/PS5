const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/db.sqlite',
  },
  useNullAsDefault: true,
});

module.exports = knex;
