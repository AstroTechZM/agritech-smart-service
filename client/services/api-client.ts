// client/services/api-client.ts
import usersData from '@/data/users.json';
import deliveriesData from '@/data/deliveries.json';
import shipmentsData from '@/data/shipments.json';
import productionData from '@/data/production.json';
import insightsData from '@/data/insights.json';
import transactionsData from '@/data/transactions.json';
import vouchersData from '@/data/vouchers.json';
import paymentsData from '@/data/payments.json';
import stockData from '@/data/stock.json';
import redemptionsData from '@/data/redemptions.json';
import dailyIntakeData from '@/data/dailyIntake.json';
import adminStatsData from '@/data/adminStats.json';

// In production, set VITE_API_BASE_URL to your deployed backend URL.
// Example: https://backend.example.com/api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
const ENABLE_MOCK_API = (import.meta.env as Record<string, string | undefined>).VITE_ENABLE_MOCK_API !== 'false';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const users = usersData as Record<string, {
  id: string;
  name?: string;
  email?: string;
  nrc?: string;
  role?: string;
}>;

const normalizeIdentifier = (value: string) => value.trim().replace(/\s+/g, '').toLowerCase();

const getMockFarmers = () =>
  Object.values(usersData as Record<string, unknown>).filter((user) => {
    if (!user || typeof user !== 'object') return false;
    const record = user as { role?: string; nrc?: string };
    return record.role === 'FARMER' || Boolean(record.nrc);
  });

const findMockUser = (identifier: string) => {
  const normalized = normalizeIdentifier(identifier);
  return Object.values(users).find((user) => {
    const emailMatches = user.email?.toLowerCase() === identifier.trim().toLowerCase();
    const nrcMatches = user.nrc ? normalizeIdentifier(user.nrc) === normalized : false;
    return emailMatches || nrcMatches;
  });
};

const getMockResponse = (method: HttpMethod, path: string, data?: unknown): unknown => {
  if (method === 'GET' && path === '/ping') return { status: 'ok', timestamp: new Date().toISOString() };

  if (method === 'POST' && path === '/auth/login') {
    const identifier = typeof data === 'object' && data !== null && 'identifier' in data
      ? String((data as { identifier: unknown }).identifier)
      : '';
    const user = findMockUser(identifier);
    if (!user) throw new Error('Invalid identifier');
    return { token: `mock-token-${Date.now()}`, user: clone(user) };
  }

  if (method === 'POST' && path === '/auth/logout') return { success: true };
  if (method === 'GET' && path === '/farmers') return clone(getMockFarmers());
  if (method === 'POST' && path === '/farmers/register') return { id: `F-${Date.now()}`, ...(data as object) };

  if (method === 'GET' && path === '/wallet/balance') return { balance: 4850 };
  if (method === 'GET' && path === '/wallet/transactions') return clone(transactionsData);
  if (method === 'POST' && path === '/wallet/withdraw') {
    const amount = typeof data === 'object' && data !== null && 'amount' in data
      ? Number((data as { amount: unknown }).amount)
      : 0;
    return {
      success: true,
      transaction: {
        id: `TX-${Date.now()}`,
        amount: -Math.abs(amount),
        type: 'WITHDRAWAL',
        status: 'PENDING',
        source: 'Mobile Money',
        date: new Date().toISOString(),
      },
    };
  }

  if (method === 'GET' && path === '/vouchers') return clone(vouchersData);
  if (method === 'POST' && path === '/vouchers/redeem') return { success: true, voucher: null };
  if (method === 'GET' && path === '/redemptions') return clone(redemptionsData);
  if (method === 'GET' && path === '/inventory') return clone(stockData);

  if (method === 'GET' && path === '/admin/stats') return clone(adminStatsData);
  if (method === 'GET' && path === '/admin/payments') return clone(paymentsData);
  if (method === 'POST' && path === '/admin/payments/approve-all') {
    const pendingCount = (paymentsData as Array<{ status?: string }>).filter((payment) => payment.status === 'PENDING').length;
    return { success: true, approvedCount: pendingCount };
  }
  if (method === 'GET' && path === '/admin/shipments') return clone(shipmentsData);

  if (method === 'GET' && path === '/production/deliveries') return clone(deliveriesData);
  if (method === 'GET' && path === '/production/records') return clone(productionData);
  if (method === 'GET' && path === '/production/insights') return clone(insightsData);
  if (method === 'GET' && path === '/production/intake') return clone(dailyIntakeData);
  if (method === 'POST' && path === '/production/intake') return { success: true, payment: data, totalBags: 1 };

  if (method === 'GET' && path === '/farmer/deliveries') return clone(deliveriesData);
  if (method === 'GET' && path.startsWith('/farmer/deliveries/')) {
    const id = path.split('/').pop();
    return clone((deliveriesData as Array<{ id: string }>).find((delivery) => delivery.id === id) ?? null);
  }

  if (method === 'GET' && path === '/user/profile') return clone(users.FARMER);
  if (method === 'PUT' && (path === '/user/profile' || path === '/profile')) return clone(data);

  throw new Error(`No mock API handler for ${method} ${path}`);
};

// Reads the JWT token from localStorage and returns an Authorization header.
// Returns an empty object if no token exists (unauthenticated requests).
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('agritech_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    // If 401 Unauthorized, clear token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('agritech_token');
      window.location.href = '/login';
    }
    throw new Error(
      (body && (body.message || body.error)) ||
        `${response.status} ${response.statusText}`
    );
  }

  return body as T;
}

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    if (ENABLE_MOCK_API) return getMockResponse('GET', path) as T;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return parseResponse<T>(response);
  },

  post: async <T>(path: string, data?: unknown): Promise<T> => {
    if (ENABLE_MOCK_API) return getMockResponse('POST', path, data) as T;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: typeof data !== 'undefined' ? JSON.stringify(data) : undefined,
    });
    return parseResponse<T>(response);
  },

  put: async <T>(path: string, data: unknown): Promise<T> => {
    if (ENABLE_MOCK_API) return getMockResponse('PUT', path, data) as T;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return parseResponse<T>(response);
  },

  delete: async <T>(path: string): Promise<T> => {
    if (ENABLE_MOCK_API) return getMockResponse('DELETE', path) as T;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return parseResponse<T>(response);
  },
};
