import { UserRole, User, FarmProduction, AgronomyInsight, Transaction } from '../types';

export const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.FARMER]: { id: '1', name: 'Mumba Chileshe', role: UserRole.FARMER, avatar: 'https://picsum.photos/seed/farmer/200', nrc: '102934/11/1' },
  [UserRole.AGRO_DEALER]: { id: '2', name: 'Chanda Mwila', role: UserRole.AGRO_DEALER, avatar: 'https://picsum.photos/seed/dealer/200', email: 'chanda@agrigrow.zm' },
  [UserRole.AGENT]: { id: '3', name: 'John Doe', role: UserRole.AGENT, avatar: 'https://picsum.photos/seed/clerk/200', nrc: '482910/11/1' },
  [UserRole.ADMIN]: { id: '4', name: 'Mubita Mwanawasa', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin1/200', email: 'admin@agriculture.gov.zm' },
};

// Store newly registered farmers during the session
export const REGISTERED_FARMERS: any[] = [];

export const MOCK_USER: User = {
  id: '1',
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  cell_num: 260971234567,
  nrc: '123456781',
  nrc_number: 123456781,
  role: UserRole.FARMER,
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
};

export const MOCK_DELIVERIES = [
  { id: 'DEL-1042', date: '02 Apr 2026', produceType: 'White Maize', weight: '2,500 kg', grade: 'A', moisture: '12.5%', amount: 'ZMW 12,500', paymentStatus: 'PROCESSING', depot: 'Kasama Hub' },
  { id: 'DEL-0988', date: '15 Mar 2026', produceType: 'Soybeans', weight: '850 kg', grade: 'B', moisture: '11.0%', amount: 'ZMW 6,800', paymentStatus: 'PAID', depot: 'Kasama District Depot' },
  { id: 'DEL-0821', date: '10 May 2025', produceType: 'White Maize', weight: '3,200 kg', grade: 'A', moisture: '12.8%', amount: 'ZMW 16,000', paymentStatus: 'PAID', depot: 'Kasama District Depot' },
  { id: 'DEL-0750', date: '28 Apr 2025', produceType: 'Groundnuts', weight: '400 kg', grade: 'A', moisture: '8.2%', amount: 'ZMW 4,000', paymentStatus: 'PAID', depot: 'Mongu Hub' },
];

export const MOCK_SHIPMENTS = [
  { id: 'TRK-202', from: 'Central Depot', to: 'Kasama Hub', status: 'IN TRANSIT', eta: '2h 15m', cargo: '400 Bags Urea', agent: 'James Phiri', bags: 400, dispatched: '08:30 AM', vehicle: 'Scania R450 (ABZ 1234)' },
  { id: 'TRK-105', from: 'Lusaka Plant', to: 'Choma Depot', status: 'LOADING', eta: 'Tomorrow', cargo: 'Maize Seeds', agent: 'Sarah Banda', bags: 1200, dispatched: 'Pending', vehicle: 'Volvo FH16 (BCA 9876)' },
  { id: 'TRK-309', from: 'Southern Hub', to: 'Farmer Group A', status: 'DELIVERED', eta: 'Completed', cargo: 'D-Compound', agent: 'Michael Zulu', bags: 250, dispatched: 'Yesterday, 14:00', vehicle: 'Isuzu FTR (XYZ 4567)' },
];

export const MOCK_FARM_PRODUCTION: FarmProduction[] = [
  { id: 'FP-2025-01', farmerId: '1', season: '2025-2026', crop: 'White Maize', area: 2.5, yield: 6250, harvestDate: '2026-05-15', status: 'GROWING', notes: 'Expected high yield if rain continues.' },
  { id: 'FP-2024-01', farmerId: '1', season: '2024-2025', crop: 'White Maize', area: 2.0, yield: 4800, harvestDate: '2025-05-10', status: 'SOLD', notes: 'Sold to local market.' },
  { id: 'FP-2024-02', farmerId: '1', season: '2024-2025', crop: 'Soybeans', area: 1.0, yield: 1800, harvestDate: '2025-04-20', status: 'SOLD' },
  { id: 'FP-2023-01', farmerId: '1', season: '2023-2024', crop: 'White Maize', area: 1.5, yield: 3200, harvestDate: '2024-05-12', status: 'SOLD' },
];

export const MOCK_AGRONOMY_INSIGHTS: AgronomyInsight[] = [
  { 
    id: 'INS-001', 
    title: 'Optimal Planting Window: Maize', 
    content: 'Current soil moisture levels in Eastern Province are optimal for early planting. If your land is prepared, consider starting sowing this week for better root establishment.', 
    category: 'PLANTING', 
    priority: 'HIGH', 
    validUntil: '2026-11-30', 
    tags: ['Maize', 'Planting'] 
  },
  { 
    id: 'INS-002', 
    title: 'Fall Armyworm Warning', 
    content: 'Isolated sightings of Fall Armyworm reported in neighboring districts. Scout your fields twice weekly and ensure you have access to pheromone traps or recommended insecticides.', 
    category: 'PEST_CONTROL', 
    priority: 'MEDIUM', 
    validUntil: '2026-12-15', 
    tags: ['Pests', 'Warning'] 
  },
  { 
    id: 'INS-003', 
    title: 'Top Dressing Fertilizer Guide', 
    content: 'For crops at the 4-6 leaf stage, Urea application is now recommended. Ensure soil is moist before application for maximum nitrate uptake.', 
    category: 'FERTILIZER', 
    priority: 'MEDIUM', 
    validUntil: '2026-12-30', 
    tags: ['Fertilizer', 'Urea'] 
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9021', farmerId: '1', amount: 3360, type: 'PAYOUT', source: 'FRA Maize Sale', status: 'COMPLETED', date: '02 Apr 2026' },
  { id: 'TX-8910', farmerId: '1', amount: 1500, type: 'WITHDRAWAL', source: 'Airtel Money', status: 'COMPLETED', date: '01 Apr 2026' },
  { id: 'TX-8805', farmerId: '1', amount: 7200, type: 'PAYOUT', source: 'FRA Maize Sale', status: 'COMPLETED', date: '28 Mar 2026' },
  { id: 'TX-8700', farmerId: '1', amount: 2000, type: 'WITHDRAWAL', source: 'MTN Mobile Money', status: 'COMPLETED', date: '25 Mar 2026' },
  { id: 'TX-8650', farmerId: '1', amount: 4850.00, type: 'DEPOSIT', source: 'FISP Refund', status: 'COMPLETED', date: '20 Mar 2026' },
  { id: 'TX-8500', farmerId: '1', amount: 1200, type: 'WITHDRAWAL', source: 'MTN Mobile Money', status: 'PENDING', date: 'Today, 10:15' },
];
