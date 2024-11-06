const { execSync } = require('child_process');
const path = require('path');

async function migrate() {
  try {
    const rootDir = path.join(__dirname, '..');
    process.chdir(rootDir);

    console.log('Starting database migration...');
    
    execSync('npx sequelize db:migrate', { stdio: 'inherit' });
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
