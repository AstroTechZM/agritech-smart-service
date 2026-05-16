import * as path from 'path';
import Database from 'better-sqlite3';
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

const dbPath = path.resolve('server', 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  district TEXT,
  nrc TEXT,
  cell_number TEXT
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
  fisp_eligible INTEGER,
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
  unit_price REAL
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

const seedTable = <T>(query: string, rows: T[]) => {
  const count = db.prepare(query).get().cnt as number;
  return count === 0;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  district?: string;
  nrc?: string;
  cell_number?: string;
};

if (seedTable('SELECT COUNT(*) AS cnt FROM users', USERS)) {
  const insert = db.prepare(`
    INSERT INTO users (user_id, name, email, role, district, nrc, cell_number)
    VALUES (@id, @name, @email, @role, @district, @nrc, @cell_number)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        district: row.district ?? null,
        nrc: row.nrc ?? null,
        cell_number: row.cell_number ?? null
      });
    }
  });
  insertMany(USERS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM farmers', FARMERS)) {
  const insert = db.prepare(`
    INSERT INTO farmers (farmer_id, user_id, first_name, last_name, district, nrc, phone, farm_size, gps_coordinates, fisp_eligible, date_registered)
    VALUES (@farmer_id, @user_id, @first_name, @last_name, @district, @nrc, @phone, @farm_size, @gps_coordinates, @fisp_eligible, @date_registered)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        farmer_id: row.farmer_id,
        user_id: String(row.user_id),
        first_name: row.first_name,
        last_name: row.last_name,
        district: row.district,
        nrc: row.nrc,
        phone: row.phone,
        farm_size: row.farm_size,
        gps_coordinates: row.gps_coordinates,
        fisp_eligible: row.fisp_eligible ? 1 : 0,
        date_registered: row.date_registered
      });
    }
  });
  insertMany(FARMERS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM vouchers', VOUCHERS)) {
  const insert = db.prepare(`
    INSERT INTO vouchers (voucher_id, farmer_id, status, input_type, amount, pin_code, expiry_date, redeemed_at)
    VALUES (@voucher_id, @farmer_id, @status, @input_type, @amount, @pin_code, @expiry_date, @redeemed_at)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        voucher_id: row.voucher_id,
        farmer_id: row.farmer_id,
        status: row.status,
        input_type: row.input_type,
        amount: row.amount,
        pin_code: row.pin_code,
        expiry_date: row.expiry_date,
        redeemed_at: row.redeemed_at ?? null
      });
    }
  });
  insertMany(VOUCHERS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM transactions', TRANSACTIONS)) {
  const insert = db.prepare(`
    INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date)
    VALUES (@transaction_id, @user_id, @amount, @payment_method, @status, @reference, @description, @date)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        transaction_id: row.transaction_id,
        user_id: String(row.user_id),
        amount: row.amount,
        payment_method: row.payment_method,
        status: row.status,
        reference: row.reference,
        description: row.description,
        date: row.date
      });
    }
  });
  insertMany(TRANSACTIONS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM payments', PAYMENTS)) {
  const insert = db.prepare(`
    INSERT INTO payments (payment_id, name, nrc, qty, amount, method, status, district, created_at)
    VALUES (@payment_id, @name, @nrc, @qty, @amount, @method, @status, @district, @created_at)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        payment_id: row.payment_id,
        name: row.name,
        nrc: row.nrc,
        qty: row.qty,
        amount: row.amount,
        method: row.method,
        status: row.status,
        district: row.district,
        created_at: new Date().toISOString()
      });
    }
  });
  insertMany(PAYMENTS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM delivery_records', DELIVERY_RECORDS)) {
  const insert = db.prepare(`
    INSERT INTO delivery_records (delivery_id, farmer_id, depot_id, crop_type, weight, grade, recorded_at)
    VALUES (@delivery_id, @farmer_id, @depot_id, @crop_type, @weight, @grade, @recorded_at)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        delivery_id: row.delivery_id,
        farmer_id: row.farmer_id,
        depot_id: row.depot_id,
        crop_type: row.crop_type,
        weight: row.weight,
        grade: row.grade,
        recorded_at: row.recorded_at
      });
    }
  });
  insertMany(DELIVERY_RECORDS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM depot_stock', DEPOT_STOCK)) {
  const insert = db.prepare(`
    INSERT INTO depot_stock (stock_id, depot_id, product_type, quantity, unit_price)
    VALUES (@stock_id, @depot_id, @product_type, @quantity, @unit_price)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run({
        stock_id: String(row.stock_id),
        depot_id: row.depot_id,
        product_type: row.product_type,
        quantity: row.quantity,
        unit_price: row.unit_price
      });
    }
  });
  insertMany(DEPOT_STOCK as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM shipments', SHIPMENTS)) {
  const insert = db.prepare(`
    INSERT INTO shipments (shipment_id, status, origin, destination, load, departure, eta)
    VALUES (@shipment_id, @status, @origin, @destination, @load, @departure, @eta)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run(row);
    }
  });
  insertMany(SHIPMENTS as unknown as any[]);
}

if (seedTable('SELECT COUNT(*) AS cnt FROM admin_stats', [{ stats_id: 'STATS-1' }])) {
  const insert = db.prepare(`
    INSERT INTO admin_stats (stats_id, totalFarmers, activeVouchers, pendingPayments, logisticsInTransit, fraudAlerts)
    VALUES (@stats_id, @totalFarmers, @activeVouchers, @pendingPayments, @logisticsInTransit, @fraudAlerts)
  `);
  insert.run({
    stats_id: 'STATS-1',
    totalFarmers: ADMIN_STATS.totalFarmers,
    activeVouchers: ADMIN_STATS.activeVouchers,
    pendingPayments: ADMIN_STATS.pendingPayments,
    logisticsInTransit: ADMIN_STATS.logisticsInTransit,
    fraudAlerts: JSON.stringify(ADMIN_STATS.fraudAlerts)
  });
}

if (seedTable('SELECT COUNT(*) AS cnt FROM production_insights', [{ insight_id: 'INS-001' }])) {
  const insert = db.prepare(`
    INSERT INTO production_insights (insight_id, title, content, category, priority, validUntil, tags)
    VALUES (@insight_id, @title, @content, @category, @priority, @validUntil, @tags)
  `);
  insert.run({
    insight_id: 'INS-001',
    title: 'Maize Fertilizer Alert',
    content: 'Apply basal fertilizer within 2 weeks of planting.',
    category: 'FERTILIZER',
    priority: 'HIGH',
    validUntil: '2026-07-01',
    tags: JSON.stringify(['maize', 'fertilizer'])
  });
}

if (seedTable('SELECT COUNT(*) AS cnt FROM redemptions', REDEMPTIONS)) {
  const insert = db.prepare(`
    INSERT INTO redemptions (redemption_id, voucher_id, farmer_id, item, amount, status, date)
    VALUES (@redemption_id, @voucher_id, @farmer_id, @item, @amount, @status, @date)
  `);
  const insertMany = db.transaction((rows: any[]) => {
    for (const row of rows) {
      insert.run(row);
    }
  });
  insertMany(REDEMPTIONS as unknown as any[]);
}

export const findUserByIdentifier = (identifier: string) =>
  db.prepare(`SELECT * FROM users WHERE email = ? OR nrc = ? OR role = ? LIMIT 1`).get(identifier, identifier, identifier);

export const getUsers = () => db.prepare(`SELECT * FROM users`).all();

export const updateUser = (user: any) => {
  const stmt = db.prepare(`
    UPDATE users SET name = @name, email = @email, district = @district, nrc = @nrc, cell_number = @cell_number
    WHERE user_id = @user_id
  `);
  stmt.run({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    district: user.district ?? null,
    nrc: user.nrc ?? null,
    cell_number: user.cell_number ?? null
  });
  return db.prepare(`SELECT * FROM users WHERE user_id = ?`).get(user.user_id);
};

export const getFarmers = () => db.prepare(`SELECT * FROM farmers`).all();

export const createFarmer = (payload: any) => {
  const farmer_id = `F-${Date.now()}`;
  const stmt = db.prepare(`
    INSERT INTO farmers (farmer_id, user_id, first_name, last_name, district, nrc, phone, farm_size, gps_coordinates, fisp_eligible, date_registered)
    VALUES (@farmer_id, @user_id, @first_name, @last_name, @district, @nrc, @phone, @farm_size, @gps_coordinates, @fisp_eligible, @date_registered)
  `);
  stmt.run({
    farmer_id,
    user_id: String(payload.user_id || ''),
    first_name: payload.first_name || payload.firstName || 'Unknown',
    last_name: payload.last_name || payload.lastName || 'Farmer',
    district: payload.district || 'Unknown',
    nrc: payload.nrc,
    phone: payload.phone || payload.cell_number || '0000000000',
    farm_size: payload.farm_size || payload.farmSize || 0,
    gps_coordinates: payload.gps_coordinates || payload.gpsCoordinates || '0,0',
    fisp_eligible: payload.fisp_eligible ? 1 : 0,
    date_registered: new Date().toISOString().split('T')[0]
  });
  return db.prepare(`SELECT * FROM farmers WHERE farmer_id = ?`).get(farmer_id);
};

export const getWalletBalance = () =>
  db.prepare(`SELECT IFNULL(SUM(amount), 0) AS balance FROM transactions`).get().balance;

export const getTransactions = () => db.prepare(`SELECT * FROM transactions ORDER BY date DESC`).all();

export const addTransaction = (transaction: any) => {
  const stmt = db.prepare(`
    INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date)
    VALUES (@transaction_id, @user_id, @amount, @payment_method, @status, @reference, @description, @date)
  `);
  stmt.run(transaction);
  return transaction;
};

export const getVouchers = () => db.prepare(`SELECT * FROM vouchers`).all();

export const redeemVoucher = (pin_code: string) => {
  const voucher = db.prepare(`SELECT * FROM vouchers WHERE pin_code = ? OR voucher_id = ?`).get(pin_code, pin_code);
  if (!voucher) return null;
  if (voucher.status === 'REDEEMED') return { alreadyRedeemed: true, voucher };
  const stmt = db.prepare(`
    UPDATE vouchers SET status = 'REDEEMED', redeemed_at = ? WHERE voucher_id = ?
  `);
  stmt.run(new Date().toISOString(), voucher.voucher_id);
  return db.prepare(`SELECT * FROM vouchers WHERE voucher_id = ?`).get(voucher.voucher_id);
};

export const getRedemptions = () => db.prepare(`SELECT * FROM redemptions`).all();

export const getPayments = () => db.prepare(`SELECT * FROM payments`).all();

export const approveAllPendingPayments = () => {
  const pending = db.prepare(`SELECT * FROM payments WHERE status = 'PENDING'`).all();
  const update = db.prepare(`UPDATE payments SET status = 'APPROVED', processed_at = ? WHERE payment_id = ?`);
  const insert = db.prepare(`
    INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date)
    VALUES (@transaction_id, @user_id, @amount, @payment_method, @status, @reference, @description, @date)
  `);
  const now = new Date().toISOString();
  const tx = db.transaction((paymentRows: any[]) => {
    for (const payment of paymentRows) {
      update.run(now, payment.payment_id);
      insert.run({
        transaction_id: `TX-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        user_id: 'ADMIN-1',
        amount: payment.amount,
        payment_method: payment.method,
        status: 'COMPLETED',
        reference: `APP-${Date.now()}`,
        description: `Approved payment for ${payment.name}`,
        date: now
      });
    }
  });
  tx(pending);
  return pending.length;
};

export const getShipments = () => db.prepare(`SELECT * FROM shipments`).all();

export const getAdminStats = () => {
  const row = db.prepare(`SELECT * FROM admin_stats LIMIT 1`).get();
  return row
    ? {
        ...row,
        fraudAlerts: JSON.parse(row.fraudAlerts || '[]')
      }
    : null;
};

export const getProductionInsights = () =>
  db.prepare(`SELECT * FROM production_insights ORDER BY insight_id`).all().map((row: any) => ({
    ...row,
    tags: JSON.parse(row.tags || '[]')
  }));

export const getDeliveryRecords = () => db.prepare(`SELECT * FROM delivery_records`).all();

export const getInventory = () => db.prepare(`SELECT * FROM depot_stock`).all();
