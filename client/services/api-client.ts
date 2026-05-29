// client/services/api-client.ts

// In production, set VITE_API_BASE_URL to your deployed backend URL.
// Example: https://backend.example.com/api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

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
    // If 401 Unauthorized, clear token and user, then redirect to login
    if (response.status === 401) {
      localStorage.removeItem('agritech_token');
      localStorage.removeItem('agritech_user_v2');
      window.location.href = '/#/login';
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