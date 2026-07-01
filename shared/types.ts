export enum UserRole {
  FARMER = 'FARMER',
  AGENT = 'AGENT',
  AGRO_DEALER = 'AGRO_DEALER',
  ADMIN = 'ADMIN'
}

export interface User {
  user_id: string; // Database PK (string UUID/identifier)
  id?: string;     // Legacy frontend identifier
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  district?: string;
  nrc?: string;
  cell_number?: string;
  cell_num?: number; // Legacy compatibility
}

export interface Farmer {
  farmer_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  district: string;
  nrc: string;
  phone: string;
  farm_size: number;
  gps_coordinates?: string;
  fisp_eligible: boolean;
  photo?: string | null;
  signature?: string | null;
  date_registered: string;
}

export interface Farm {
  farm_id: string;
  farmer_id: string;
  farm_size: number;
  location?: string;
  gps_coordinates?: string;
}

export interface AgroDealer {
  dealer_id: string;
  user_id: string;
  business_id: string;
  location?: string;
  is_verified: boolean;
}

export interface Agent {
  agent_id: string;
  user_id: string;
  depot_id: string;
  is_online: boolean;
}

export interface Admin {
  admin_id: string;
  user_id: string;
  scope?: string;
  scope_id?: string;
}

export interface Depot {
  depot_id: string;
  depot_name: string;
  location?: string;
  grain_stock: number;
  capacity_threshold: number;
  district_id: string;
}

export interface DepotStock {
  stock_id: string;
  depot_id: string;
  product_type: string;
  quantity: number;
  unit_price: number;
  unit?: string;
}

export interface Dispatch {
  dispatch_id: string;
  depot_id: string;
  dispatcher_id: string;
  receiver_id?: string;
  bag_count: number;
  truck_reg?: string;
  status: 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
}

export interface Wallet {
  wallet_id: string;
  user_id: string;
  balance: number;
  bank_account?: string;
  cell_number?: string;
  cell_num?: number;
}

export interface Voucher {
  voucher_id: string;
  farmer_id: string;
  status: 'PENDING' | 'REDEEMED' | 'EXPIRED';
  input_type: string;
  amount: number;
  pin_code: string;
  expiry_date: string;
  redeemed_at?: string | null;
}

export interface Transaction {
  transaction_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PENDING';
  reference: string;
  description: string;
  date: string;
}

export interface PaymentRecord {
  payment_id: string;
  name: string;
  nrc: string;
  qty: number;
  amount: number;
  method: string;
  status: 'APPROVED' | 'PENDING' | 'CANCELLED';
  district: string;
  created_at?: string;
  processed_at?: string;
}

export interface DeliveryRecord {
  delivery_id: string;
  farmer_id: string;
  depot_id?: string;
  crop_type: string;
  weight: number;
  grade?: string;
  recorded_at: string;
}

export interface AgroDealerStock {
  stock_id: string;
  dealer_id: string;
  quantity: number;
  unit_price: number;
  product_type: string;
  last_updated: string;
}

export interface AnalyticsReport {
  report_id: string;
  redemption_rate?: number;
  district_id?: string;
  fraud_flags?: number;
  stock_summary?: string;
  generated_at: string;
}

export interface FarmProduction {
  id: string;
  farmerId: string;
  season: string;
  crop: string;
  area: number;
  yield: number;
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

export interface Shipment {
  shipment_id: string;
  status: string;
  origin: string;
  destination: string;
  load: number;
  departure: string;
  eta: string;
}
