import { UserRole, User, FarmProduction, AgronomyInsight, Transaction } from '../types';
import usersData from './users.json';
import deliveriesData from './deliveries.json';
import shipmentsData from './shipments.json';
import productionData from './production.json';
import insightsData from './insights.json';
import transactionsData from './transactions.json';
import vouchersData from './vouchers.json';
import paymentsData from './payments.json';
import stockData from './stock.json';
import redemptionsData from './redemptions.json';
import dailyIntakeData from './dailyIntake.json';
import adminStatsData from './adminStats.json';

export const MOCK_USERS: Record<UserRole, User> = usersData as unknown as Record<UserRole, User>;

// Store newly registered farmers during the session
export const REGISTERED_FARMERS: any[] = [
  { nrc: '852016/10/1', first_name: 'Henry', last_name: 'Mate', gender: 'Male' },
  { nrc: '110928/65/1', first_name: 'Bwalya', last_name: 'Mwewa', gender: 'Female' },
  { nrc: '482910/11/1', first_name: 'John', last_name: 'Lungu', gender: 'Male' }
];

export const MOCK_USER: User = MOCK_USERS[UserRole.FARMER];

export const MOCK_DELIVERIES = deliveriesData;

export const MOCK_SHIPMENTS = shipmentsData;

export const MOCK_FARM_PRODUCTION: FarmProduction[] = productionData as FarmProduction[];

export const MOCK_AGRONOMY_INSIGHTS: AgronomyInsight[] = insightsData as AgronomyInsight[];

export const MOCK_TRANSACTIONS: Transaction[] = transactionsData as Transaction[];

export const MOCK_VOUCHERS = vouchersData;

export const MOCK_PAYMENTS = paymentsData;

export const MOCK_STOCK = stockData;

export const MOCK_REDEMPTIONS = redemptionsData;

export const MOCK_DAILY_INTAKE = dailyIntakeData;

export const MOCK_ADMIN_STATS = adminStatsData;
