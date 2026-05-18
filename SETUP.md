# FRA Digital Platform - Development Setup

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies
```bash
npm install
```

### Run Both Frontend & Backend

#### Option 1: Run in Two Terminal Windows

**Terminal 1 - Backend Server (port 4000)**
```bash
npm run dev:server
# Listens on http://localhost:4000
```

**Terminal 2 - Frontend Dev Server (port 3000)**
```bash
npm run dev
# Opens http://localhost:3000
```

#### Option 2: Run Sequentially (Development)
```bash
npm run build
npm start
```

---

## API Endpoints

All endpoints are prefixed with `http://localhost:4000/api/v1`

### Authentication
- `POST /auth/login` - Login user (email or NRC)

### Farmers & Registration
- `GET /farmers` - List all farmers
- `POST /farmers/register` - Register new farmer

### Wallet & Payments
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/transactions` - Get transaction history
- `POST /wallet/withdraw` - Process withdrawal

### Vouchers & FISP
- `GET /vouchers` - List vouchers
- `POST /vouchers/redeem` - Redeem voucher by PIN
- `GET /redemptions` - Redemption history

### Production & Logistics
- `GET /production/deliveries` - List deliveries
- `GET /production/records` - List farm production records
- `GET /production/insights` - Agronomy insights
- `GET /production/intake` - Daily grain intake summary
- `POST /production/intake` - Record grain intake (generates payment)

### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/payments` - Pending/approved payments
- `GET /admin/shipments` - Shipment tracking

---

## Login Credentials for Testing

### Admin
- Email: `admin@fra.gov.zm`
- Any password

### Field Agent
- Email: `mary.agent@fra.gov.zm`

### Farmer
- NRC: `852016/10/1`
- Email: `henry.mate@example.zm`

### Agro Dealer
- Email: `ezra.dealer@fra.gov.zm`

---

## Project Structure

```
src/
  services/      # API client modules (connected to backend)
  pages/         # Role-based page components
  context/       # React contexts (Farmer, Wallet)
  components/    # Shared UI components
  types.ts       # TypeScript interfaces
  
server/
  index.ts       # Express backend server
  data.ts        # In-memory database (mocked)
```

---

## Technologies Used

**Frontend:**
- React 19, TypeScript, Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Express.js for REST API
- CORS enabled for frontend calls

---

## Next Steps

1. **Service Layer Migration** - Continue moving domain logic from `postgres.ts` into dedicated services like `ProductionService`.
2. **Zod Validation** - Implement strict input validation for all API endpoints to ensure data integrity.
3. **Payment integration** - Add Stripe, MTN MoMo, or Airtel Money sandbox
4. **Notifications** - Add email/SMS alerts via Twilio or SendGrid
5. **Mobile app** - Build React Native or Flutter mobile client

---

## Troubleshooting

**"Cannot GET /api/v1/..."**
- Ensure backend is running: `npm run dev:server`

**CORS errors**
- Backend CORS is configured to allow all origins (for development)

**Port already in use**
- Frontend: Check `vite.config.ts`, change port 3000 to another
- Backend: Set `PORT=5000 npm run dev:server`

---

## Deployment

1. Build frontend: `npm run build` (creates `dist/` folder)
2. Deploy backend separately (e.g., to AWS, DigitalOcean, Heroku)
3. Update `VITE_API_BASE_URL` in `.env.production`

---

For questions or contributions, reach out to the FRA team.
