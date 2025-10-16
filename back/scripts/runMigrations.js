require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log,
});

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsPath).sort();

    console.log('🔄 Executando migrations...');

    for (const file of files) {
      if (file.endsWith('.js')) {
        // Pular migration do PostgreSQL em ambiente SQLite
        if (file.includes('init-ia-core')) {
          console.log(`\n⏭️  Pulando: ${file} (PostgreSQL apenas)`);
          continue;
        }

        console.log(`\n📄 Executando: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        await migration.up(sequelize.getQueryInterface(), Sequelize);
      }
    }

    console.log('\n✅ Todas as migrations foram executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

runMigrations();
