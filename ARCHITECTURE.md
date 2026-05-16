# FRA Digital Platform - Architecture Overview

## System Components

### 1. Frontend (React + Vite)
- **Port:** 3000
- **Entry:** `src/main.tsx`
- **Build:** `npm run build` → `dist/`
- **Tech:** React 19, TypeScript, React Router, Tailwind CSS

### 2. Backend (Express)
- **Port:** 4000
- **Entry:** `server/index.ts`
- **Start:** `npm run dev:server`
- **Tech:** Express.js, TypeScript, in-memory data

### 3. Data Layer
- Currently: In-memory mock data (`server/data.ts`)
- Future: PostgreSQL or MongoDB

---

## API Architecture

```
Frontend (React)
     ↓
API Client (src/services/api-client.ts)
     ↓
REST Endpoints (Express)
     ↓
Mock Data (server/data.ts)
```

### Service Layer Modules
Each domain has its own API wrapper:

- `wallet.api.ts` - Financial operations
- `stock.api.ts` - Vouchers and inventory
- `registration.api.ts` - Farmer onboarding
- `production.api.ts` - Grain intake and logistics
- `admin.api.ts` - Admin operations

---

## Core Features

### ✅ Implemented
- [x] User authentication (local mock)
- [x] Role-based routing (FARMER, AGENT, ADMIN, AGRO_DEALER)
- [x] Wallet balance and transactions
- [x] Voucher redemption workflow
- [x] Farmer registration (frontend UI)
- [x] Grain intake recording with automated payments
- [x] Production and delivery tracking
- [x] Admin dashboard with statistics

### 🚧 Partially Implemented
- [ ] Logistics real-time tracking
- [ ] Payment gateway integration
- [ ] Mobile money API integration
- [ ] Notifications (SMS/Email)

### ❌ Not Yet Implemented
- [ ] Database persistence
- [ ] JWT authentication
- [ ] GIS/map integration
- [ ] USSD support
- [ ] AI fraud detection
- [ ] Mobile app (React Native)
- [ ] Offline sync capability

---

## Database Schema (Future)

```sql
-- Users
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role ENUM('FARMER', 'AGENT', 'ADMIN', 'AGRO_DEALER'),
  created_at TIMESTAMP
);

-- Farmers & Farms
CREATE TABLE farmers (
  farmer_id INT PRIMARY KEY,
  user_id INT,
  nrc VARCHAR(20),
  district VARCHAR(100),
  farm_size DECIMAL,
  gps_coordinates VARCHAR(100),
  fisp_eligible BOOLEAN
);

-- Wallets & Transactions
CREATE TABLE wallets (
  wallet_id INT PRIMARY KEY,
  user_id INT,
  balance DECIMAL
);

CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY,
  wallet_id INT,
  amount DECIMAL,
  type ENUM('CREDIT', 'DEBIT'),
  description VARCHAR(255),
  created_at TIMESTAMP
);

-- Vouchers
CREATE TABLE vouchers (
  voucher_id INT PRIMARY KEY,
  farmer_id INT,
  status ENUM('PENDING', 'REDEEMED', 'EXPIRED'),
  pin_code VARCHAR(10),
  amount DECIMAL,
  expiry_date DATE
);

-- Production & Logistics
CREATE TABLE deliveries (
  delivery_id INT PRIMARY KEY,
  farmer_id INT,
  weight DECIMAL,
  crop_type VARCHAR(100),
  grade CHAR(1),
  recorded_at TIMESTAMP
);

CREATE TABLE shipments (
  shipment_id INT PRIMARY KEY,
  status ENUM('PENDING', 'IN_TRANSIT', 'DELIVERED'),
  origin VARCHAR(255),
  destination VARCHAR(255),
  departure TIMESTAMP,
  eta TIMESTAMP
);
```

---

## Environment Variables

`.env.development`:
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

`.env.production`:
```
VITE_API_BASE_URL=https://api.fra.gov.zm/api/v1
```

---

## Deployment Diagram

```
┌─────────────────┐
│  Vite Frontend  │
│  (React SPA)    │  → HTTP requests
│ Port 3000       │
└────────┬────────┘
         ↓
    ┌────────────┐
    │ CDN/Static │
    │  Hosting   │
    │(GitHub     │
    │ Pages)     │
    └────────────┘

┌──────────────────┐
│ Express Backend  │
│ (REST API)       │  ← Data operations
│ Port 4000        │
└────────┬─────────┘
         ↓
    ┌─────────────┐
    │ PostgreSQL  │
    │ Database    │
    │             │
    └─────────────┘
```

---

## Integration Roadmap

### Phase 1: Database (Priority: HIGH)
- [ ] Set up PostgreSQL/MongoDB
- [ ] Create schema with relationships
- [ ] Add data validation

### Phase 2: Auth & Security (Priority: HIGH)
- [ ] Implement JWT tokens
- [ ] Add password hashing (bcrypt)
- [ ] Session management
- [ ] Rate limiting

### Phase 3: Payment Gateway (Priority: HIGH)
- [ ] Stripe sandbox integration
- [ ] MTN MoMo API integration
- [ ] Payment reconciliation

### Phase 4: Notifications (Priority: MEDIUM)
- [ ] SMS alerts via Twilio
- [ ] Email notifications via SendGrid
- [ ] In-app notifications

### Phase 5: Advanced Features (Priority: LOW)
- [ ] GIS mapping (Mapbox)
- [ ] AI fraud detection
- [ ] USSD support
- [ ] Mobile app (React Native)

---

## Testing

### Unit Tests
```bash
# Setup Jest & React Testing Library
npm install --save-dev jest @testing-library/react
```

### API Testing
```bash
# Quick endpoint test
curl http://localhost:4000/api/v1/ping
```

### E2E Tests
```bash
# Setup Cypress or Playwright
npm install --save-dev cypress
```

---

## Performance Considerations

- Frontend bundle: ~200KB gzipped (Vite optimized)
- API response time: <100ms per endpoint
- In-memory data: Suitable for prototyping, not production
- Future: Add Redis caching for frequently accessed data

---

## Security Notes

⚠️ **Development Only:**
- CORS allows all origins
- No authentication tokens required
- In-memory data (lost on restart)

✅ **For Production:**
- Enable HTTPS only
- Restrict CORS to known domains
- Implement JWT authentication
- Add rate limiting and DDoS protection
- Encrypt sensitive data at rest and in transit
- Audit API access logs

---

## Support & Contribution

This is an open-source FRA digital platform. Contributors should:
1. Follow TypeScript best practices
2. Add tests for new features
3. Document API changes
4. Keep `ARCHITECTURE.md` up to date

---

Last Updated: 16 May 2026
