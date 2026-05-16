// In production, set VITE_API_BASE_URL to your deployed backend URL.
// Example: https://backend.example.com/api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error((body && (body.message || body.error)) || `${response.status} ${response.statusText}`);
  }

  return body as T;
}

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return parseResponse<T>(response);
  },

  post: async <T>(path: string, data?: any): Promise<T> => {
    const url = `${API_BASE_URL}${path}`;
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    if (typeof data !== 'undefined') options.body = JSON.stringify(data);
    const response = await fetch(url, options);
    return parseResponse<T>(response);
  },

  put: async <T>(path: string, data: any): Promise<T> => {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseResponse<T>(response);
  }
};
