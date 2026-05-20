# AgriTech Smart Service — Role-Based Project TO-DO List
**Team Collaboration Guide**: Frontend (Edward) | Backend (Team)

This document groups development tasks by system actors (Farmer, Agro-Dealer, Depot Agent, and Admin Tiers). Use this checklist to coordinate development between the **Frontend** and the **Backend**.

---

## 🧑‍🌾 1. Farmer Role Workspace

### 1.1 Registration (Self-Service - Pathway A)
Farmers input details, capture a photo, sign, and match against ZIAMIS to register instantly.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Frontend Tasks (You)**:
    *   *Done*: Form steps, capture tools, and API submission in [Registration.tsx (Self)](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/auth/Registration.tsx).
*   **Backend Tasks (Team)**:
    *   *Done*: Implements `/farmers/register` API and saves details to DB.

### 1.2 Login (NRC + PIN)
Farmers log into their portals using their unique NRC card number and the security PIN they set up.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Frontend Tasks (You)**:
    *   *Done*: Login input screen handling NRC formatted numbers.
    *   *Code Reference*: [Login.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/auth/Login.tsx).
*   **Backend Tasks (Team)**:
    *   *Done*: Compares credential inputs using secure password hashing verification.
    *   *Code Reference*: [server/index.ts#L123](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/index.ts#L123) | [postgres.ts#L365](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts#L365).

### 1.3 Farmer Profile Details & Settings Update
Farmers review registration details and update cell numbers, emails, or districts.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Frontend Tasks (You)**:
    *   *Done*: Forms inside account settings update profile and push payload back.
    *   *Code Reference*: [Dashboard.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/dashboard/Dashboard.tsx).
*   **Backend Tasks (Team)**:
    *   *Done*: Exposes `PUT /api/v1/profile` and commits changes to users tables.
    *   *Code Reference*: [server/index.ts#L241](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/index.ts#L241) | [postgres.ts#L372](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts#L372).

### 1.4 Applying for FISP Eligibility
Farmers who are marked ineligible or unregistered can submit an application for subsidy consideration.
*   **Status**: `[ ] Missing`
*   **Frontend Tasks (You)**:
    *   [ ] Add an "Apply for FISP" card inside [Vouchers.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/farmer/vouchers/Vouchers.tsx) for ineligible farmers.
    *   [ ] Build a modal form prompting the farmer for land lease documents, crops, and acreage proof.
*   **Backend Tasks (Team)**:
    *   [ ] Add a table `fisp_applications` in [postgres.ts](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts).
    *   [ ] Expose `POST /api/v1/farmers/fisp-apply` to save requests as `'PENDING_REVIEW'`.

### 1.5 FISP Co-Payment (ZMW 400 deposit)
Farmer initiates deposit payment to unlock their active voucher subsidy.
*   **Status**: `[ ] Missing`
*   **Frontend Tasks (You)**:
    *   [ ] Show a "Deposit Co-Payment (ZMW 400)" button in [Wallet.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/farmer/wallet/Wallet.tsx) when voucher status is `'PENDING_COPAYMENT'`.
*   **Backend Tasks (Team)**:
    *   [ ] Add `payment_status` columns to `vouchers` database table.
    *   [ ] Expose `POST /api/v1/vouchers/:id/pay-copayment` simulating Mobile Money deduction.

### 1.6 Agro-Dealer Stock Finder
Farmer checks input stock (D-Compound, seeds) at accredited dealers on a map before leaving the farm.
*   **Status**: `[ ] Mocked (Frontend static data only)`
*   **Frontend Tasks (You)**:
    *   [ ] Query the backend API in the Map Modal inside [Vouchers.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/farmer/vouchers/Vouchers.tsx#L203-L320) instead of using local mock arrays.
*   **Backend Tasks (Team)**:
    *   [ ] Build `agro_dealers` and `dealer_stock` tables in [postgres.ts](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts).
    *   [ ] Expose route `GET /api/v1/dealers/stock` filtering by active district.

### 1.7 Real-Time Production & Harvest History Logging
Farmers view historical delivery records, crop types, moisture test logs, and tonnage over current/past seasons.
*   **Status**: `[x] Partially Wired (Moisture/Grade are missing)`
*   **Frontend Tasks (You)**:
    *   [ ] Display moisture level and grade results in the harvest history rows in [FarmProduction.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/farmer/production/FarmProduction.tsx).
*   **Backend Tasks (Team)**:
    *   [ ] Update `GET /api/v1/production/deliveries` to fetch moisture and grade columns from DB.

### 1.8 Digital Wallet Payouts & Mobile Money Cash-Out
Farmers check their balance and withdraw sales proceeds directly to MTN MoMo or Airtel Money.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Frontend Tasks (You)**:
    *   *Done*: Renders wallet card and initiates withdrawals.
    *   *Code Reference*: [Wallet.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/farmer/wallet/Wallet.tsx).
*   **Backend Tasks (Team)**:
    *   *Done*: Performs ledger checks and simulated mobile gateway transactions.

---

## 🏪 2. Agro-Dealer Role Workspace

### 2.1 e-Voucher Redemption
Agro-dealers enter a farmer's PIN and NRC to redeem seeds and fertilizer.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Frontend Tasks (You)**:
    *   *Done*: Redemption layout matches inputs and triggers backend authentication.
    *   *Code Reference*: [RedemptionPortal.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/agent/redemption/RedemptionPortal.tsx).
*   **Backend Tasks (Team)**:
    *   *Done*: Authenticates PIN, marks voucher `REDEEMED`, and creates redemption logs.

### 2.2 Input Stock Level Tracking
Dealers update local stock levels so farmers check availability online.
*   **Status**: `[ ] Missing (Stock is mocked)`
*   **Frontend Tasks (You)**:
    *   [ ] Create a "Manage Input Stock" panel in the Agro-Dealer Dashboard interface.
    *   [ ] Provide form fields for dealers to log seed and fertilizer bag quantities.
*   **Backend Tasks (Team)**:
    *   [ ] Expose `POST /api/v1/dealers/stock/update` to decrement/increment product records.

### 2.3 Post-Redemption Payout Claims
Dealers view generated invoice totals and submit formal payout claims to the Ministry of Agriculture.
*   **Status**: `[ ] Missing`
*   **Frontend Tasks (You)**:
    *   [ ] Add an "Invoices & Claims" tab displaying total voucher values redeemed.
    *   [ ] Add a "Submit Payout Claim" button to submit invoices for approval.
*   **Backend Tasks (Team)**:
    *   [ ] Create table `dealer_claims` (status: `PENDING`, `APPROVED`).
    *   [ ] Expose `GET /api/v1/dealers/claims` and `POST /api/v1/dealers/claims/submit`.

---

## 👮 3. Depot Agent (Depot Clerk / Officer) Role Workspace

### 3.1 Assisted Farmer Onboarding
Officer registers new farmers who lack smartphones, verifying identity in the field.
*   **Status**: `[x] Fully Implemented & Wired`
*   **Code Reference**: [Registration.tsx (Agent)](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/agent/registration/Registration.tsx).

### 3.2 Crop Quality Testing & Intake Weighing
depot agent inspects grain quality, runs moisture test ($\le 12.5\%$), grades, weighs, and records.
*   **Status**: `[x] Partially Wired (Moisture/Grade are mocked)`
*   **Frontend Tasks (You)**:
    *   [ ] Update form payload in [GrainRecording.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/dashboard/components/GrainRecording.tsx) to send values from the moisture slider and grade selection.
*   **Backend Tasks (Team)**:
    *   [ ] Add columns `moisture` and `grade` to `delivery_records` table in [postgres.ts](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts).
    *   [ ] In [production.service.ts](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/production.service.ts), throw an error if `moisture > 12.5`. Scale payment pricing based on grade.

### 3.3 CDR / Purchase Receipt Note (PRN) Issuance
Clerk prints a digital receipt for the farmer's records.
*   **Status**: `[x] Partially Wired (Receipt visual only, not fetchable)`
*   **Frontend Tasks (You)**:
    *   *Done*: Prints local card format. Needs to pull official ticket details from backend.
*   **Backend Tasks (Team)**:
    *   [ ] Return generated delivery reference numbers and official weights on `POST /api/v1/production/intake` success payload.

### 3.4 Depot Inventory & Dispatch Coordination
Agent monitors depot stock levels and logs truck registration plate numbers for evacuation.
*   **Status**: `[x] Partially Wired (Logistics exist but dispatch is mocked)`
*   **Frontend Tasks (You)**:
    *   [ ] Build a "Dispatch Grain" form prompting for truck plate numbers, driver licenses, and bag counts.
*   **Backend Tasks (Team)**:
    *   [ ] Expose `POST /api/v1/logistics/dispatch` to create transit shipments.

---

## 🏢 4. Admin Hierarchy Workspaces

### 👑 Tier A: National Admin (Super Admin)
*Super Admin controls operations at a national scale.*
*   **Status**: `[x] Partially Wired (System dashboards live; audit feeds are mocked)`
*   **Frontend Tasks (You)**:
    *   [ ] Wire the "Fraud Hotspots" feeds in [AdminDashboard.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/dashboard/AdminDashboard.tsx#L313) to read actual anomalies from stats endpoints.
    *   [ ] Provide controls for bulk payment releases and general settings configuration.
*   **Backend Tasks (Team)**:
    *   [ ] Implement logic in `getAdminStats()` to identify anomalous registers (e.g. duplicate NRCs, volume spikes).
    *   [ ] Expose bulk payment processing endpoints.

### 🗺️ Tier B: Provincial Admin
*Provincial coordinator monitors regional metrics across multiple districts.*
*   **Status**: `[ ] Missing`
*   **Frontend Tasks (You)**:
    *   [ ] Add a province filtering selector to the [AdminDashboard.tsx](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/client/pages/shared/dashboard/AdminDashboard.tsx).
    *   [ ] Render regional capacity charts showing performance comparisons between Southern, Eastern, or Central provinces.
*   **Backend Tasks (Team)**:
    *   [ ] Add `province` filters to analytics and statistical DB queries in [postgres.ts](file:///c:/FOR%20EDWARD/SNAPFING/agritech-smart-service/server/postgres.ts).

### 🏷️ Tier C: District Admin (DACO)
*DACO handles registrations, verifies applications, and reviews local transactions.*
*   **Status**: `[ ] Missing`
*   **Frontend Tasks (You)**:
    *   [ ] Build the District Approvals table, displaying registration requests for Pathway B (unverified ZIAMIS accounts).
    *   [ ] Render driver dispatch and waybill receipts for local depot networks.
*   **Backend Tasks (Team)**:
    *   [ ] Secure `/api/v1/admin/` endpoints to enforce scope filters so DACOs can only see data belonging to their `district_id`.
