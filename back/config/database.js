const { Sequelize } = require('sequelize');

// Prefer Postgres when DATABASE_URL is provided (Docker/dev/prod)
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else if (process.env.NODE_ENV === 'production') {
  // Explicit fallback for production without DATABASE_URL (uncommon)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Local development: SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
  });
}

module.exports = { sequelize };

