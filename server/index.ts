import express from 'express';
import { json } from 'express';
import { ADMIN_STATS, DAILY_INTAKE } from './data';
import * as sqlite from './db';

const loadStorage = async () => {
  if (process.env.DATABASE_URL) {
    return await import('./postgres');
  }
  return sqlite;
};

const storage: any = await loadStorage();

const {
  findUserByIdentifier,
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
  getInventory,
  updateUser
} = storage;

const app = (express as any)();
app.use(json());

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// Root Health Check Route for Render Deployment Health Monitor
app.get('/', (_req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'FRA Backend Platform',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/ping', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { identifier } = req.body;
  const user = await findUserByIdentifier(identifier);

  if (!user) {
    return res.status(401).json({ message: 'Invalid identifier' });
  }

  return res.json({ user, token: `token-${makeId('AUTH')}` });
});

app.get('/api/v1/farmers', async (_req, res) => {
  res.json(await getFarmers());
});

app.post('/api/v1/farmers/register', async (req, res) => {
  const newFarmer = await createFarmer(req.body);
  return res.status(201).json(newFarmer);
});

app.get('/api/v1/wallet/balance', async (_req, res) => {
  const balance = await getWalletBalance();
  res.json({ balance });
});

app.get('/api/v1/wallet/transactions', async (_req, res) => {
  res.json(await getTransactions());
});

app.post('/api/v1/wallet/withdraw', async (req, res) => {
  const { user_id, amount } = req.body;
  if (!user_id || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal request' });
  }

  const transaction = await addTransaction({
    transaction_id: makeId('TX'),
    user_id,
    amount: -Math.abs(amount),
    payment_method: 'Mobile Money',
    status: 'COMPLETED',
    reference: `WD-${Date.now()}`,
    description: 'Withdrawal to Mobile Money',
    date: new Date().toISOString()
  });

  return res.status(201).json({ success: true, transaction });
});

app.get('/api/v1/vouchers', async (_req, res) => {
  res.json(await getVouchers());
});

app.post('/api/v1/vouchers/redeem', async (req, res) => {
  const { pin_code } = req.body;
  const result = await redeemVoucher(pin_code);

  if (!result) {
    return res.status(404).json({ message: 'Voucher not found' });
  }

  if ((result as any).alreadyRedeemed) {
    return res.status(400).json({ message: 'Voucher already redeemed' });
  }

  return res.json({ success: true, voucher: result });
});

app.get('/api/v1/redemptions', async (_req, res) => {
  res.json(await getRedemptions());
});

app.get('/api/v1/admin/stats', async (_req, res) => {
  const stats = await getAdminStats();
  if (!stats) {
    return res.status(404).json({ message: 'Admin stats not found' });
  }
  res.json(stats);
});

app.get('/api/v1/admin/payments', async (_req, res) => {
  res.json(await getPayments());
});

app.post('/api/v1/admin/payments/approve-all', async (_req, res) => {
  const approvedCount = await approveAllPendingPayments();
  return res.json({ success: true, approvedCount });
});

app.get('/api/v1/admin/shipments', async (_req, res) => {
  res.json(await getShipments());
});

app.put('/api/v1/profile', async (req, res) => {
  const payload = req.body;
  const updated = await updateUser(payload);
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({ success: true, user: updated });
});

app.get('/api/v1/production/deliveries', async (_req, res) => {
  res.json(await getDeliveryRecords());
});

app.get('/api/v1/production/records', async (_req, res) => {
  const farmers = await getFarmers() as Array<any>;
  res.json(farmers.map((farmer) => ({
    id: farmer.farmer_id,
    farmerId: farmer.farmer_id,
    season: '2026 Season',
    crop: 'Maize',
    area: farmer.farm_size,
    yield: farmer.farm_size * 600,
    harvestDate: '2026-05-01',
    status: 'HARVESTED',
    notes: 'Harvest recorded at collection point'
  })));
});

app.get('/api/v1/production/insights', async (_req, res) => {
  res.json(await getProductionInsights());
});

app.get('/api/v1/production/intake', (_req, res) => {
  res.json(DAILY_INTAKE);
});

app.post('/api/v1/production/intake', async (req, res) => {
  const { weight, nrc, farmerName, crop } = req.body;
  if (!weight || !nrc || !farmerName) {
    return res.status(400).json({ message: 'Missing intake data' });
  }

  DAILY_INTAKE.bags += Math.ceil(weight / 50);
  const pricePerKg = crop?.toLowerCase().includes('maize') ? 5.6 : 8.0;
  const amount = Math.round(weight * pricePerKg);

  const payment = await addTransaction({
    transaction_id: makeId('TX'),
    user_id: 'ADMIN-1',
    amount,
    payment_method: 'Mobile Money',
    status: 'PENDING',
    reference: `PAY-${Date.now()}`,
    description: `Automated payment for ${farmerName}`,
    date: new Date().toISOString()
  });

  return res.status(201).json({ success: true, payment, totalBags: DAILY_INTAKE.bags });
});

app.get('/api/v1/inventory', async (_req, res) => {
  const inventory = await getInventory() as Array<any>;
  const normalizedStock = inventory.map(item => ({
    name: item.product_type || item.type || 'Unknown Item',
    qty: item.quantity ?? 0,
    unit: 'Bags',
    status: item.status || (item.quantity >= 100 ? 'STABLE' : 'LOW'),
    ...item
  }));
  res.json(normalizedStock);
});

const port = Number(process.env.PORT || 4000);
// Bound explicitly to '0.0.0.0' interface for external visibility on Render virtualization network
app.listen(port, '0.0.0.0', () => {
  console.log(`FRA backend server listening on port ${port}`);
});