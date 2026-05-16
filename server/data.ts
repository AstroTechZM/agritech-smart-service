export type UserRole = 'FARMER' | 'AGENT' | 'AGRO_DEALER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  nrc?: string;
  cell_number?: string;
}

export interface Farmer {
  farmer_id: string;
  user_id: string | number;
  first_name: string;
  last_name: string;
  district: string;
  nrc: string;
  phone: string;
  farm_size: number;
  gps_coordinates: string;
  fisp_eligible: boolean;
  date_registered: string;
}

export interface Voucher {
  voucher_id: string;
  farmer_id: string;
  status: 'PENDING' | 'REDEEMED' | 'EXPIRED';
  input_type: string;
  amount: number;
  pin_code: string;
  expiry_date: string;
  redeemed_at?: string;
}

export interface Transaction {
  transaction_id: string;
  user_id: string | number;
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
}

export interface DeliveryRecord {
  delivery_id: string;
  farmer_id: string;
  depot_id: string;
  crop_type: string;
  weight: number;
  grade: string;
  recorded_at: string;
}

export interface DepotStock {
  stock_id: string;
  depot_id: string;
  product_type: string;
  quantity: number;
  unit_price: number;
}

export const USERS: User[] = [
  {
    id: 'ADMIN-1',
    name: 'FRA Administrator',
    email: 'admin@fra.gov.zm',
    role: 'ADMIN',
    district: 'Lusaka'
  },
  {
    id: 'AGENT-1',
    name: 'Field Agent Mary',
    email: 'mary.agent@fra.gov.zm',
    role: 'AGENT',
    district: 'Choma'
  },
  {
    id: 'AGRO-1',
    name: 'Agro Dealer Ezra',
    email: 'ezra.dealer@fra.gov.zm',
    role: 'AGRO_DEALER',
    district: 'Mumbwa'
  },
  {
    id: 'FARMER-1',
    name: 'Henry Mate',
    email: 'henry.mate@example.zm',
    role: 'FARMER',
    district: 'Choma',
    nrc: '852016/10/1',
    cell_number: '0965123456'
  }
];

export const FARMERS: Farmer[] = [
  {
    farmer_id: 'F-001',
    user_id: 1,
    first_name: 'Henry',
    last_name: 'Mate',
    district: 'Choma',
    nrc: '852016/10/1',
    phone: '0965123456',
    farm_size: 5,
    gps_coordinates: '-15.8000,28.6000',
    fisp_eligible: true,
    date_registered: '2025-07-18'
  },
  {
    farmer_id: 'F-002',
    user_id: 2,
    first_name: 'Bwalya',
    last_name: 'Mwewa',
    district: 'Lusaka',
    nrc: '110928/65/1',
    phone: '0976123456',
    farm_size: 2.4,
    gps_coordinates: '-15.3875,28.3228',
    fisp_eligible: false,
    date_registered: '2025-08-02'
  }
];

export const VOUCHERS: Voucher[] = [
  {
    voucher_id: 'V-100',
    farmer_id: 'F-001',
    status: 'PENDING',
    input_type: 'Fertilizer',
    amount: 250,
    pin_code: '7531',
    expiry_date: '2026-12-31'
  },
  {
    voucher_id: 'V-101',
    farmer_id: 'F-002',
    status: 'PENDING',
    input_type: 'Maize Seed',
    amount: 180,
    pin_code: '2684',
    expiry_date: '2026-12-31'
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    transaction_id: 'TX-001',
    user_id: 1,
    amount: 4850,
    payment_method: 'Mobile Money',
    status: 'COMPLETED',
    reference: 'FRA-PAY-1001',
    description: 'Initial wallet balance',
    date: '2026-05-10T11:00:00Z'
  },
  {
    transaction_id: 'TX-002',
    user_id: 1,
    amount: -1200,
    payment_method: 'Withdrawal',
    status: 'COMPLETED',
    reference: 'FRA-WD-1001',
    description: 'Mobile money withdrawal',
    date: '2026-05-12T08:30:00Z'
  }
];

export const PAYMENTS: PaymentRecord[] = [
  {
    payment_id: 'P-001',
    name: 'Loveness Phiri',
    nrc: '482910/11/1',
    qty: 12,
    amount: 3360,
    method: 'MoMo',
    status: 'APPROVED',
    district: 'Lusaka'
  },
  {
    payment_id: 'P-002',
    name: 'Kelvin Banda',
    nrc: '110928/65/1',
    qty: 25,
    amount: 7000,
    method: 'Bank',
    status: 'PENDING',
    district: 'Choma'
  },
  {
    payment_id: 'P-003',
    name: 'Mutale Kapwepwe',
    nrc: '338102/52/1',
    qty: 8,
    amount: 2240,
    method: 'MoMo',
    status: 'CANCELLED',
    district: 'Lusaka'
  },
  {
    payment_id: 'P-004',
    name: 'John Doe',
    nrc: '123456/78/1',
    qty: 15,
    amount: 4200,
    method: 'Bank',
    status: 'PENDING',
    district: 'Kasama'
  }
];

export const DELIVERY_RECORDS: DeliveryRecord[] = [
  {
    delivery_id: 'D-001',
    farmer_id: 'F-001',
    depot_id: 'DEPOT-1',
    crop_type: 'Maize',
    weight: 3200,
    grade: 'A',
    recorded_at: '2026-05-14T09:30:00Z'
  }
];

export const DEPOT_STOCK: DepotStock[] = [
  {
    stock_id: 'S-001',
    depot_id: 'DEPOT-1',
    product_type: 'Fertilizer',
    quantity: 320,
    unit_price: 102
  }
];

export const DAILY_INTAKE = {
  bags: 824,
  intakeToday: 32,
  averageGrade: 'A',
  updatedAt: '2026-05-15T12:00:00Z'
};

export const ADMIN_STATS = {
  totalFarmers: 1024,
  activeVouchers: 182,
  pendingPayments: 24,
  logisticsInTransit: 6,
  fraudAlerts: [
    {
      dealer: 'Kabwe Agro Hub',
      reason: 'Duplicate voucher attempt',
      time: '3 mins ago',
    },
    {
      dealer: 'Mufulira Depot',
      reason: 'Suspicious farm grade report',
      time: '12 mins ago',
    },
    {
      dealer: 'Choma Collection',
      reason: 'Unverified farmer registration',
      time: '25 mins ago',
    }
  ]
};

export const SHIPMENTS = [
  {
    shipment_id: 'SH-100',
    status: 'IN_TRANSIT',
    origin: 'Choma Collection Point',
    destination: 'Lusaka Storage Facility',
    load: 1800,
    departure: '2026-05-15T07:00:00Z',
    eta: '2026-05-16T11:00:00Z'
  }
];

export const REDEMPTIONS = [
  {
    redemption_id: 'R-100',
    voucher_id: 'V-100',
    farmer_id: 'F-001',
    item: 'Fertilizer',
    amount: 250,
    status: 'COMPLETED',
    date: '2026-05-13T10:00:00Z'
  }
];
