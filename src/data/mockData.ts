import { UserRole, User, FarmProduction, AgronomyInsight, Transaction } from '../types';
import usersData from './users.json';
import deliveriesData from './deliveries.json';
import shipmentsData from './shipments.json';
import productionData from './production.json';
import insightsData from './insights.json';
import transactionsData from './transactions.json';
import vouchersData from './vouchers.json';

export const MOCK_USERS: Record<UserRole, User> = usersData as unknown as Record<UserRole, User>;

// Store newly registered farmers during the session
export const REGISTERED_FARMERS: any[] = [];

export const MOCK_USER: User = MOCK_USERS[UserRole.FARMER];

export const MOCK_DELIVERIES = deliveriesData;

export const MOCK_SHIPMENTS = shipmentsData;

export const MOCK_FARM_PRODUCTION: FarmProduction[] = productionData as FarmProduction[];

export const MOCK_AGRONOMY_INSIGHTS: AgronomyInsight[] = insightsData as AgronomyInsight[];

export const MOCK_TRANSACTIONS: Transaction[] = transactionsData as Transaction[];

export const MOCK_VOUCHERS = vouchersData;
