import 'dotenv/config';
import express from 'express';
import { json } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../auth';
import { ProductionService } from './production.service';
import storage from './postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'fra-super-secret-key';

// ----------------------------------------------------
// Zod Validation Schemas
// ----------------------------------------------------
const LoginSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  password: z.string().min(4, 'Password must be at least 4 characters')
});

const FarmerRegisterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  nrc: z.string().regex(/^\d{6}\/\d{2}\/\d{1}$/, 'Invalid NRC format (correct: 123456/10/1)'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters').optional().nullable(),
  farmSize: z.number().positive('Farm size must be a positive number'),
  gpsCoordinates: z.string().optional(),
  user_id: z.string().optional(),
  fisp_eligible: z.boolean().optional(),
  photo: z.string().optional().nullable(),
  signature: z.string().optional().nullable()
});

const WithdrawSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be positive')
});

const RedeemVoucherSchema = z.object({
  pin_code: z.string().min(4, 'PIN code must be at least 4 characters')
});

const UpdateProfileSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  district: z.string().nullable().optional(),
  nrc: z.string().regex(/^\d{6}\/\d{2}\/\d{1}$/, 'Invalid NRC format').nullable().optional(),
  cell_number: z.string().nullable().optional()
});

const GrainIntakeSchema = z.object({
  weight: z.number().positive('Weight must be positive'),
  nrc: z.string().regex(/^\d{6}\/\d{2}\/\d{1}$/, 'Invalid NRC format'),
  farmerName: z.string().min(2, 'Farmer name is required'),
  crop: z.string().min(1, 'Crop type is required')
});

// Middleware helper
const validateBody = (schema: z.ZodSchema) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }
  req.body = result.data;
  next();
};

const {
  findUserByIdentifier,
  verifyPassword,
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

app.post('/api/v1/auth/login', validateBody(LoginSchema), async (req, res) => {
  const { identifier, password } = req.body;
  const user = await findUserByIdentifier(identifier);

  if (!user) {
    return res.status(401).json({ message: 'Invalid identifier or password' });
  }

  // Verify hashed password matches
  if (!verifyPassword(password, user.password)) {
    return res.status(401).json({ message: 'Invalid identifier or password' });
  }

  const token = jwt.sign(
    { id: user.user_id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Strip password for security
  const { password: _, ...userWithoutPassword } = user;

  return res.json({ user: userWithoutPassword, token });
});

app.get('/api/v1/farmers', authenticate, async (_req, res) => {
  res.json(await getFarmers());
});

app.post('/api/v1/farmers/register', authenticate, validateBody(FarmerRegisterSchema), async (req, res) => {
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

app.post('/api/v1/wallet/withdraw', validateBody(WithdrawSchema), async (req, res) => {
  const { user_id, amount } = req.body;

  // Ledger Check: Enforce sufficient balance before transaction to prevent negative balance overdrafts
  const currentBalance = await getWalletBalance(user_id);
  if (amount > currentBalance) {
    return res.status(400).json({ message: `Insufficient funds. Your current balance is ZMW ${currentBalance.toFixed(2)}.` });
  }

  // Simulate Airtel Money / MTN MoMo payment gateway connection and handshake
  const momoGateway = {
    provider: amount % 2 === 0 ? 'MTN Mobile Money' : 'Airtel Money',
    handshake: 'SUCCESS',
    externalReference: `ZMW-MOMO-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  const transaction = await addTransaction({
    transaction_id: makeId('TX'),
    user_id,
    amount: -Math.abs(amount),
    payment_method: momoGateway.provider,
    status: 'COMPLETED',
    reference: momoGateway.externalReference,
    description: `Mobile Money Payout via ${momoGateway.provider}`,
    date: new Date().toISOString()
  });

  return res.status(201).json({
    success: true,
    gateway: momoGateway.provider,
    externalRef: momoGateway.externalReference,
    transaction
  });
});

app.get('/api/v1/vouchers', async (_req, res) => {
  res.json(await getVouchers());
});

app.post('/api/v1/vouchers/redeem', validateBody(RedeemVoucherSchema), async (req, res) => {
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

app.put('/api/v1/profile', validateBody(UpdateProfileSchema), async (req, res) => {
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

app.post('/api/v1/production/intake', validateBody(GrainIntakeSchema), async (req, res) => {
  const { weight, nrc, farmerName, crop } = req.body;

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