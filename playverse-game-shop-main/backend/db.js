const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/db.sqlite',  // arquivo do banco dentro da pasta data
  },
  useNullAsDefault: true,
});

module.exports = knex;
