import express from 'express';
import { json } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from '../auth';
import { ProductionService } from './production.service';
import storage from './postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'fra-super-secret-key';

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
  getInventory, // This will now fetch unit from DB
  getFarmProductionRecords, // New function
  updateUser,
  getDailyIntakeSummary
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

  const token = jwt.sign(
    { id: user.user_id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({ user, token });
});

app.get('/api/v1/farmers', authenticate, async (_req, res) => {
  res.json(await getFarmers());
});

app.post('/api/v1/farmers/register', authenticate, async (req, res) => {
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
  res.json(await getAdminStats()); // Now dynamically calculated
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
  res.json(await getFarmProductionRecords()); // Now uses data from DB
});

app.get('/api/v1/production/insights', async (_req, res) => {
  res.json(await getProductionInsights());
});

app.get('/api/v1/production/intake', async (_req, res) => {
  res.json(await getDailyIntakeSummary());
});

app.post('/api/v1/production/intake', async (req, res) => {
  const { weight, nrc, farmerName, crop } = req.body;
  if (!weight || !nrc || !farmerName) {
    return res.status(400).json({ message: 'Missing intake data' });
  }

  try {
    const result = await ProductionService.recordGrainIntake({ weight, nrc, farmerName, crop });
    const dailyStats = await getDailyIntakeSummary();

    return res.status(201).json({ success: true, payment: result.payment, totalBags: dailyStats.bags });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to record intake' });
  }
});

app.get('/api/v1/inventory', async (_req, res) => {
  const inventory = await getInventory() as Array<any>;
  res.json(inventory.map(item => ({
    name: item.product_type || 'Unknown Item',
    qty: item.quantity ?? 0,
    unit: item.unit || 'Bags', // Fetch unit from DB
    status: item.quantity >= 100 ? 'STABLE' : 'LOW', // Status derived, or could be a DB column
    ...item // Include all other fields
  })));
});

// Global Error Handler Refinement
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const port = Number(process.env.PORT || 4000);
// Bound explicitly to '0.0.0.0' interface for external visibility on Render virtualization network
app.listen(port, '0.0.0.0', () => {
  console.log(`FRA backend server listening on port ${port}`);
});