/**
 * Core User Models
 */
export enum UserRole {
  FARMER = 'FARMER',
  AGENT = 'AGENT',
  AGRO_DEALER = 'AGRO_DEALER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string; // Used by UI
  user_id?: number; // DB ID
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cell_num?: number;
  nrc?: string; // UI NRC string
  nrc_number?: number;
  role: UserRole;
  avatar: string;
}

export interface Farmer {
  farmer_id: number;
  user_id: number;
  location?: string; // Geometry representation
  date_registered: string;
  biometric_ref?: string;
  fisp_eligible: boolean;
  pathway?: string;
}

export interface Farm {
  farm_id: number;
  farmer_id: number;
  farm_size: number;
  location?: string; 
  gps_coordinates?: string;
}

export interface AgroDealer {
  dealer_id: number;
  user_id: number;
  business_id: number;
  location?: string;
  is_verified: boolean;
}

export interface Agent {
  agent_id: number;
  user_id: number;
  depot_id: number;
  is_online: boolean;
}

export interface Admin {
  admin_id: number;
  user_id: number;
  scope?: string;
  scope_id?: number;
}

/**
 * Logistics & Delivery Models
 */
export interface Depot {
  depot_id: number;
  depot_name: string;
  location?: string;
  grain_stock: number;
  capacity_threshold: number;
  district_id: number;
}

export interface FarmerDeliverRecord {
  record_id: number;
  farmer_id: number;
  depot_id: number;
  crop_type: string;
  weight: number;
  moisture_content?: number;
  grade?: string;
  recorded_at: string;
}

export interface DepotStock {
  stock_id: number;
  depot_id: number;
  quantity: number;
  unit_price?: number;
  type: string;
}

export interface Dispatch {
  dispatch_id: number;
  depot_id: number;
  dispatcher_id: number;
  receiver_id?: number;
  bag_count: number;
  truck_reg?: string;
  status: 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
}

/**
 * Financial & FISP Models
 */
export interface Wallet {
  wallet_id: number;
  user_id: number;
  balance: number;
  bank_account?: string;
  cell_number?: number;
}

export interface Voucher {
  voucher_id: number;
  status: 'PENDING' | 'REDEEMED' | 'EXPIRED';
  farmer_id: number;
  dealer_id?: number;
  pin_code?: number;
  amount: number;
  input_type?: string;
  expiry_date?: string;
  redeemed_at?: string;
}

export interface Payment {
  transaction_id: number;
  amount: number;
  payment_method: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  user_id: number;
  reference?: string;
  voucher_id?: number;
}

export interface AgroDealerStock {
  stock_id: number;
  dealer_id: number;
  quantity: number;
  unit_price: number;
  product_type: string;
  last_updated: string;
}

export interface AnalyticsReport {
  report_id: number;
  redemption_rate?: number;
  district_id?: number;
  fraud_flags?: number;
  stock_summary?: string;
  generated_at: string;
}

export interface FarmProduction {
  id: string;
  farmerId: string;
  season: string;
  crop: string;
  area: number; // in Hectares
  yield: number; // in KG
  harvestDate: string;
  status: 'PLANNING' | 'PLANTED' | 'GROWING' | 'HARVESTED' | 'SOLD';
  notes?: string;
}

export interface AgronomyInsight {
  id: string;
  title: string;
  content: string;
  category: 'PLANTING' | 'FERTILIZER' | 'PEST_CONTROL' | 'WEATHER' | 'MARKET';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  validUntil: string;
  tags: string[];
}

export interface Transaction {
  id: string;
  farmerId: string;
  amount: number;
  type: 'PAYOUT' | 'WITHDRAWAL' | 'DEPOSIT';
  source: string; // e.g., 'FRA Maize Sale', 'Airtel Money'
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
}
