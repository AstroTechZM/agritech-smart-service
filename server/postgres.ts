import 'dotenv/config';
import { Pool, type PoolConfig } from 'pg';
import {
  USERS,
  FARMERS,
  VOUCHERS,
  TRANSACTIONS,
  PAYMENTS,
  DELIVERY_RECORDS,
  DEPOT_STOCK,
  SHIPMENTS,
  REDEMPTIONS,
  ADMIN_STATS
} from './data';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  throw new Error('Missing DATABASE_URL for Postgres adapter');
}

const poolConfig: PoolConfig = {
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
};



export const pool = new Pool(poolConfig);

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      district TEXT,
      nrc TEXT,
      cell_number TEXT,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS farmers (
      farmer_id TEXT PRIMARY KEY,
      user_id TEXT,
      first_name TEXT,
      last_name TEXT,
      district TEXT,
      nrc TEXT,
      phone TEXT,
      farm_size REAL,
      gps_coordinates TEXT,
      fisp_eligible BOOLEAN,
      photo TEXT,
      signature TEXT,
      date_registered TEXT
    );

    CREATE TABLE IF NOT EXISTS vouchers (
      voucher_id TEXT PRIMARY KEY,
      farmer_id TEXT,
      status TEXT,
      input_type TEXT,
      amount REAL,
      pin_code TEXT,
      expiry_date TEXT,
      redeemed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id TEXT PRIMARY KEY,
      user_id TEXT,
      amount REAL,
      payment_method TEXT,
      status TEXT,
      reference TEXT,
      description TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      payment_id TEXT PRIMARY KEY,
      name TEXT,
      nrc TEXT,
      qty INTEGER,
      amount REAL,
      method TEXT,
      status TEXT,
      district TEXT,
      created_at TEXT,
      processed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS delivery_records (
      delivery_id TEXT PRIMARY KEY,
      farmer_id TEXT,
      depot_id TEXT,
      crop_type TEXT,
      weight REAL,
      grade TEXT,
      recorded_at TEXT
    );

    CREATE TABLE IF NOT EXISTS depot_stock (
      stock_id TEXT PRIMARY KEY,
      depot_id TEXT,
      product_type TEXT,
      quantity INTEGER,
      unit_price REAL,
      unit TEXT DEFAULT 'Bags'
    );

    CREATE TABLE IF NOT EXISTS shipments (
      shipment_id TEXT PRIMARY KEY,
      status TEXT,
      origin TEXT,
      destination TEXT,
      load INTEGER,
      departure TEXT,
      eta TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_stats (
      stats_id TEXT PRIMARY KEY,
      totalFarmers INTEGER,
      activeVouchers INTEGER,
      pendingPayments INTEGER,
      logisticsInTransit INTEGER,
      fraudAlerts TEXT
    );

    CREATE TABLE IF NOT EXISTS production_insights (
      insight_id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      category TEXT,
      priority TEXT,
      validUntil TEXT,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS redemptions (
      redemption_id TEXT PRIMARY KEY,
      voucher_id TEXT,
      farmer_id TEXT,
      item TEXT,
      amount REAL,
      status TEXT,
      date TEXT
    );
  `);

  // Schema Migrations for existing DB instances (Render)
  await pool.query(`ALTER TABLE farmers ADD COLUMN IF NOT EXISTS photo TEXT`);
  await pool.query(`ALTER TABLE farmers ADD COLUMN IF NOT EXISTS signature TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`);
  await pool.query(`UPDATE users SET password = 'secure123' WHERE password IS NULL`);
};

const seedIfEmpty = async () => {
  const { rows: usersCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM users`);
  if (usersCount[0].cnt === 0) {
    const insert = `INSERT INTO users (user_id, name, email, role, district, nrc, cell_number, password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const u of USERS) {
        await client.query(insert, [u.id, u.name, u.email, u.role, u.district ?? null, u.nrc ?? null, u.cell_number ?? null, 'secure123']);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: farmersCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM farmers`);
  if (farmersCount[0].cnt === 0) {
    const insert = `INSERT INTO farmers (farmer_id, user_id, first_name, last_name, district, nrc, phone, farm_size, gps_coordinates, fisp_eligible, date_registered) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const f of FARMERS) {
        await client.query(insert, [f.farmer_id, String(f.user_id), f.first_name, f.last_name, f.district, f.nrc, f.phone, f.farm_size, f.gps_coordinates, f.fisp_eligible, f.date_registered]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  // Seed vouchers, transactions, payments, depot_stock, shipments, redemptions, admin_stats, production_insights similarly
  const { rows: vouchersCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM vouchers`);
  if (vouchersCount[0].cnt === 0) {
    const insert = `INSERT INTO vouchers (voucher_id, farmer_id, status, input_type, amount, pin_code, expiry_date, redeemed_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const v of VOUCHERS) {
        await client.query(insert, [v.voucher_id, v.farmer_id, v.status, v.input_type, v.amount, v.pin_code, v.expiry_date, v.redeemed_at ?? null]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: txCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM transactions`);
  if (txCount[0].cnt === 0) {
    const insert = `INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const t of TRANSACTIONS) {
        await client.query(insert, [t.transaction_id, String(t.user_id), t.amount, t.payment_method, t.status, t.reference, t.description, t.date]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: paymentsCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM payments`);
  if (paymentsCount[0].cnt === 0) {
    const insert = `INSERT INTO payments (payment_id, name, nrc, qty, amount, method, status, district, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const p of PAYMENTS) {
        await client.query(insert, [p.payment_id, p.name, p.nrc, p.qty, p.amount, p.method, p.status, p.district, new Date().toISOString()]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: depotCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM depot_stock`);
  if (depotCount[0].cnt === 0) {
    const insert = `INSERT INTO depot_stock (stock_id, depot_id, product_type, quantity, unit_price) VALUES ($1,$2,$3,$4,$5)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const d of DEPOT_STOCK) {
        await client.query(insert, [String(d.stock_id), d.depot_id, d.product_type, d.quantity, d.unit_price, 'Bags']); // Default to 'Bags'
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: shipCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM shipments`);
  if (shipCount[0].cnt === 0) {
    const insert = `INSERT INTO shipments (shipment_id, status, origin, destination, load, departure, eta) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const s of SHIPMENTS) {
        await client.query(insert, [s.shipment_id, s.status, s.origin, s.destination, s.load, s.departure, s.eta]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: redCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM redemptions`);
  if (redCount[0].cnt === 0) {
    const insert = `INSERT INTO redemptions (redemption_id, voucher_id, farmer_id, item, amount, status, date) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const r of REDEMPTIONS) {
        await client.query(insert, [r.redemption_id, r.voucher_id, r.farmer_id, r.item, r.amount, r.status, r.date]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: deliveryCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM delivery_records`);
  if (deliveryCount[0].cnt === 0) {
    const insert = `INSERT INTO delivery_records (delivery_id, farmer_id, depot_id, crop_type, weight, grade, recorded_at) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const dr of DELIVERY_RECORDS) {
        await client.query(insert, [dr.delivery_id, dr.farmer_id, dr.depot_id, dr.crop_type, dr.weight, dr.grade, dr.recorded_at]);
      }
      await client.query('COMMIT');
    } finally { client.release(); }
  }

  const { rows: statsCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM admin_stats`);
  // We will now calculate admin stats dynamically, so no need to seed admin_stats table directly.
  // The admin_stats table itself might be removed in a future migration if not used for other purposes.
  // For now, we'll keep it but ensure getAdminStats calculates values.

  const { rows: insightsCount } = await pool.query(`SELECT COUNT(*)::int as cnt FROM production_insights`);
  if (insightsCount[0].cnt === 0) {
    await pool.query(`INSERT INTO production_insights (insight_id, title, content, category, priority, validUntil, tags) VALUES ($1,$2,$3,$4,$5,$6,$7)`, ['INS-001', 'Maize Fertilizer Alert', 'Apply basal fertilizer within 2 weeks of planting.', 'FERTILIZER', 'HIGH', '2026-07-01', JSON.stringify(['maize', 'fertilizer'])]);
  }
};

// New function to get farm production records by joining farmers and delivery_records
export const getFarmProductionRecords = async () => {
  const res = await pool.query(`
    SELECT
      f.farmer_id AS id,
      f.farmer_id,
      f.first_name,
      f.last_name,
      f.farm_size AS area,
      dr.crop_type AS crop,
      dr.weight AS yield,
      dr.recorded_at AS harvestDate
    FROM farmers f
    LEFT JOIN delivery_records dr ON f.farmer_id = dr.farmer_id
    ORDER BY dr.recorded_at DESC NULLS LAST
  `);
  return res.rows.map(row => ({
    ...row,
    season: '2026 Season', // Placeholder, needs to be derived from date or added to schema
    status: row.yield ? 'HARVESTED' : 'PENDING', // Derived status
    notes: row.yield ? 'Harvest recorded at collection point' : 'No harvest recorded yet' // Derived notes
  }));
};

// Dynamically calculate admin stats
export const getAdminStats = async () => {
  const totalFarmers = (await pool.query(`SELECT COUNT(*)::int FROM farmers`)).rows[0].count;
  const activeVouchers = (await pool.query(`SELECT COUNT(*)::int FROM vouchers WHERE status = 'PENDING'`)).rows[0].count;
  const pendingPayments = (await pool.query(`SELECT COUNT(*)::int FROM payments WHERE status = 'PENDING'`)).rows[0].count;
  const logisticsInTransit = (await pool.query(`SELECT COUNT(*)::int FROM shipments WHERE status = 'IN_TRANSIT'`)).rows[0].count;
  // Fraud alerts would need a dedicated table or more complex logic
  const fraudAlerts = []; // For now, no dynamic fraud alerts

  return {
    totalFarmers,
    activeVouchers,
    pendingPayments,
    logisticsInTransit,
    fraudAlerts,
    updatedAt: new Date().toISOString()
  };
};

// Initialize DB immediately
createTables().then(seedIfEmpty).catch((err) => {
  console.error('Postgres init error:', err);
});

// Exported API functions (minimal parity with sqlite adapter)
export const findUserByIdentifier = async (identifier: string) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1 OR nrc = $1 OR role = $1 LIMIT 1`, [identifier]);
  return res.rows[0];
};

export const getUsers = async () => (await pool.query(`SELECT * FROM users`)).rows;

export const updateUser = async (user: any) => {
  await pool.query(`UPDATE users SET name=$1, email=$2, district=$3, nrc=$4, cell_number=$5 WHERE user_id=$6`, [user.name, user.email, user.district ?? null, user.nrc ?? null, user.cell_number ?? null, user.user_id]);
  return (await pool.query(`SELECT * FROM users WHERE user_id = $1`, [user.user_id])).rows[0];
};

export const getFarmers = async () => (await pool.query(`SELECT * FROM farmers`)).rows;

export const createFarmer = async (payload: any) => {
  const farmer_id = `F-${Date.now()}`;
  await pool.query(`INSERT INTO farmers (farmer_id, user_id, first_name, last_name, district, nrc, phone, farm_size, gps_coordinates, fisp_eligible, photo, signature, date_registered) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [
    farmer_id, 
    String(payload.user_id || ''), 
    payload.first_name || payload.firstName || 'Unknown', 
    payload.last_name || payload.lastName || 'Farmer', 
    payload.district || 'Unknown', 
    payload.nrc, 
    payload.phone || payload.cell_number || '0000000000', 
    payload.farm_size || payload.farmSize || 0, 
    payload.gps_coordinates || payload.gpsCoordinates || '0,0', 
    payload.fisp_eligible ? true : false,
    payload.photo || null,
    payload.signature || null,
    new Date().toISOString().split('T')[0]
  ]);
  return (await pool.query(`SELECT * FROM farmers WHERE farmer_id = $1`, [farmer_id])).rows[0];
};

export const getWalletBalance = async (userId?: string) => {
  if (userId) {
    const res = await pool.query(`SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id = $1`, [userId]);
    return Number(res.rows[0].balance);
  }
  const res = await pool.query(`SELECT COALESCE(SUM(amount),0) AS balance FROM transactions`);
  return Number(res.rows[0].balance);
};

export const getTransactions = async () => (await pool.query(`SELECT * FROM transactions ORDER BY date DESC`)).rows;

export const addTransaction = async (transaction: any) => {
  await pool.query(`INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [transaction.transaction_id, transaction.user_id, transaction.amount, transaction.payment_method, transaction.status, transaction.reference, transaction.description, transaction.date]);
  return transaction;
};

export const getVouchers = async () => (await pool.query(`SELECT * FROM vouchers`)).rows;

export const redeemVoucher = async (pin_code: string) => {
  const voucher = (await pool.query(`SELECT * FROM vouchers WHERE pin_code = $1 OR voucher_id = $1`, [pin_code])).rows[0];
  if (!voucher) return null;
  if (voucher.status === 'REDEEMED') return { alreadyRedeemed: true, voucher };
  await pool.query(`UPDATE vouchers SET status = 'REDEEMED', redeemed_at = $1 WHERE voucher_id = $2`, [new Date().toISOString(), voucher.voucher_id]);
  return (await pool.query(`SELECT * FROM vouchers WHERE voucher_id = $1`, [voucher.voucher_id])).rows[0];
};

export const getRedemptions = async () => (await pool.query(`SELECT * FROM redemptions`)).rows;

export const getPayments = async () => (await pool.query(`SELECT * FROM payments`)).rows;

export const approveAllPendingPayments = async () => {
  const pending = (await pool.query(`SELECT * FROM payments WHERE status = 'PENDING'`)).rows;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const payment of pending) {
      await client.query(`UPDATE payments SET status = 'APPROVED', processed_at = $1 WHERE payment_id = $2`, [new Date().toISOString(), payment.payment_id]);
      await client.query(`INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [`TX-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, 'ADMIN-1', payment.amount, payment.method, 'COMPLETED', `APP-${Date.now()}`, `Approved payment for ${payment.name}`, new Date().toISOString()]);
    }
    await client.query('COMMIT');
  } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  return pending.length;
};

export const getShipments = async () => (await pool.query(`SELECT * FROM shipments`)).rows;

export const getProductionInsights = async () => (await pool.query(`SELECT * FROM production_insights ORDER BY insight_id`)).rows.map((r: any) => ({ ...r, tags: JSON.parse(r.tags || '[]') }));

export const getDeliveryRecords = async () => (await pool.query(`SELECT * FROM delivery_records`)).rows;

export const getInventory = async () => (await pool.query(`SELECT * FROM depot_stock`)).rows;

export const getDailyIntakeSummary = async () => {
  const res = await pool.query(`SELECT COALESCE(SUM(weight), 0) AS total_weight, COUNT(*)::int AS count_today FROM delivery_records`);
  const totalWeight = Number(res.rows[0].total_weight);
  const countToday = res.rows[0].count_today;
  return {
    bags: 824 + Math.ceil(totalWeight / 50),
    intakeToday: 32 + countToday,
    averageGrade: 'A',
    updatedAt: new Date().toISOString()
  };
};

export default {
  findUserByIdentifier,
  getUsers,
  updateUser,
  getFarmers,
  createFarmer,
  getWalletBalance,
  getTransactions,
  addTransaction,
  getVouchers,
  redeemVoucher,
  getRedemptions,
  getPayments,
  approveAllPendingPayments,
  getShipments,
  getAdminStats,
  getProductionInsights,
  getDeliveryRecords,
  getInventory, // Keep this as it's used by index.ts
  getDailyIntakeSummary, // Keep this as it's used by index.ts
  getFarmProductionRecords // Add new function
};
