# AgriTech Smart Service - API Contract Document

This document serves as the formal API contract between the Frontend and Backend teams for the AgriTech Smart Service platform.

---

## 🔐 General Information

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** Bearer Token (JWT) - *Simulated in current implementation*

---

## 🚜 Farmer Registration Service

### 1. Register Farmer
Submits new farmer data, including KYC and farm details.

- **URL:** `/farmers/register`
- **Method:** `POST`
- **Body:**
```json
{
  "nrc": "string",
  "first_name": "string",
  "last_name": "string",
  "gender": "string",
  "district": "string",
  "pathway": "string",
  "fisp_eligible": "boolean"
}
```
- **Response (201 Created):**
```json
{
  "id": "FARMER-1715842800000",
  "nrc": "852016/10/1",
  "first_name": "Henry",
  "last_name": "Mate",
  "status": "VERIFIED",
  "memberSince": 2026
}
```

### 2. Fetch All Farmers
Fetches the list of all registered farmers (Agent/Admin view).

- **URL:** `/farmers`
- **Method:** `GET`
- **Response (200 OK):**
```json
[
  { "nrc": "852016/10/1", "first_name": "Henry", "last_name": "Mate", "gender": "Male" },
  { "nrc": "110928/65/1", "first_name": "Bwalya", "last_name": "Mwewa", "gender": "Female" }
]
```

---

## 📊 Admin & Operations Service

### 1. Fetch Dashboard Stats
Retrieves KPIs and overview data for the Admin dashboard.

- **URL:** `/admin/stats`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "kpis": [
    { "label": "Registered Farmers", "value": "42,890", "trend": "+4%", "color": "primary" },
    { "label": "Fraud Alerts", "value": "12", "trend": "High Priority", "color": "error", "urgent": true }
  ],
  "wards": [
    { "label": "Kanyama Ward", "value": 92, "color": "bg-primary" }
  ],
  "fraudAlerts": [
    { "nrc": "491022/11/1", "dealer": "Kasama Agro", "reason": "double-dip", "time": "14:22" }
  ]
}
```

### 2. Fetch Payments
Retrieves all payment records across the district.

- **URL:** `/admin/payments`
- **Method:** `GET`
- **Response (200 OK):**
```json
[
  { 
    "name": "Kelvin Banda", 
    "nrc": "110928/65/1", 
    "qty": 25, 
    "amount": 7000, 
    "method": "Bank", 
    "status": "PENDING", 
    "district": "Choma" 
  }
]
```

### 3. Approve All Pending Payments
Triggers a bulk approval of all currently pending harvest payments.

- **URL:** `/admin/payments/approve-all`
- **Method:** `POST`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 5
}
```

---

## 🌾 Production & Logistics Service

### 1. Record Grain Intake
Records a new harvest delivery from a farmer at a depot.

- **URL:** `/production/intake`
- **Method:** `POST`
- **Body:**
```json
{
  "weight": 500,
  "nrc": "482910/11/1",
  "farmerName": "Loveness Phiri",
  "crop": "White Maize"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "totalBags": 142,
  "payment": {
    "name": "Loveness Phiri",
    "amount": 2800,
    "status": "PENDING"
  }
}
```

### 2. Fetch Daily Intake Totals
Returns cumulative intake stats for the current day.

- **URL:** `/production/intake`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "bags": 142,
  "tonnage": 7.1,
  "pendingVerifications": 8
}
```

---

## 💳 Wallet & Financials Service

### 1. Fetch Wallet Balance
Retrieves the current balance for the authenticated user.

- **URL:** `/wallet/balance`
- **Method:** `GET`
- **Response (200 OK):** `12500.50` (Number)

### 2. Fetch Transaction History
Retrieves all financial movements (payouts, deposits, withdrawals).

- **URL:** `/wallet/transactions`
- **Method:** `GET`
- **Response (200 OK):**
```json
[
  { 
    "id": "TX-9021", 
    "amount": 3360, 
    "type": "PAYOUT", 
    "source": "FRA Maize Sale", 
    "status": "COMPLETED", 
    "date": "2026-04-02" 
  }
]
```

### 3. Request Withdrawal
Initiates a withdrawal to a mobile money or bank account.

- **URL:** `/wallet/withdraw`
- **Method:** `POST`
- **Body:**
```json
{
  "amount": 500
}
```
- **Response (200 OK):**
```json
{
  "success": true
}
```

---

## 📦 Stock & Vouchers Service

### 1. Redeem Voucher
Redeems an input voucher using a secure PIN.

- **URL:** `/vouchers/redeem`
- **Method:** `POST`
- **Body:**
```json
{
  "pin": "829 401"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "redemption": {
    "id": "RED-1715842800000",
    "item": "D-Compound Fertilizer",
    "amount": "8 Bags",
    "status": "COMPLETED"
  }
}
```
