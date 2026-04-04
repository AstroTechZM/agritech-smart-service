export type UserRole = 'FARMER' | 'AGRO_DEALER' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location?: string;
  avatar?: string;
  nrc?: string;
  email?: string;
}

export interface Voucher {
  id: string;
  type: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'PENDING';
  amount: string;
  date: string;
  pin?: string;
  expiryDate?: string;
  redemptionStatus?: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'STABLE' | 'LOW' | 'RESTOCKING';
  lastUpdated: string;
}

export interface DeliveryRecord {
  id: string;
  farmerName: string;
  nrc: string;
  cropType: string;
  weight: number;
  date: string;
  depot: string;
  moisture?: number;
  grade?: string;
  prn?: string;
}

export interface DispatchRecord {
  id: string;
  depotName: string;
  truckReg: string;
  bagCount: number;
  dispatcherName: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
}

export interface PaymentRecord {
  id: string;
  farmerName: string;
  nrc: string;
  quantity: number;
  amount: number;
  method: 'MoMo' | 'Bank';
  status: 'APPROVED' | 'PENDING' | 'CANCELLED';
  date: string;
}

export interface FraudAlert {
  id: string;
  nrc: string;
  dealer?: string;
  type: 'double-dip' | 'GPS mismatch' | 'volume anomaly';
  timestamp: string;
  status: 'under review' | 'resolved';
  reason?: string;
}
