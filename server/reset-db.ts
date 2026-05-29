import 'dotenv/config';
import { pool } from './postgres';

async function resetDatabase() {
  console.log('Dropping all tables...');
  await pool.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS farmers CASCADE;
    DROP TABLE IF EXISTS vouchers CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS delivery_records CASCADE;
    DROP TABLE IF EXISTS depot_stock CASCADE;
    DROP TABLE IF EXISTS shipments CASCADE;
    DROP TABLE IF EXISTS admin_stats CASCADE;
    DROP TABLE IF EXISTS production_insights CASCADE;
    DROP TABLE IF EXISTS redemptions CASCADE;
  `);
  console.log('All tables dropped successfully.');
  console.log('You can now run "npm run backend:migrate" to recreate the tables and populate them with the initial data.');
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error('Error resetting database:', err);
  process.exit(1);
});
