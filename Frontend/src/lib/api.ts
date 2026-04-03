const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  public status: number;
  public data: unknown;
  
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('access_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Mock API Layer for Standalone Testing
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      // Simulate network latency for more realistic testing
      await new Promise(resolve => setTimeout(resolve, 500));

      if (endpoint.includes('/api/auth/login')) {
        return { 
          token: 'mock-jwt-token', 
          user: { 
            id: 'mock-user-123', 
            name: 'Talha', 
            email: 'talha@example.com',
            created_at: new Date().toISOString(),
            plan: 'Enterprise'
          }, 
          message: 'Login successful' 
        } as unknown as T;
      }
      if (endpoint.includes('/api/auth/profile')) {
        return { 
          id: 'mock-user-123', 
          name: 'Talha', 
          email: 'talha@example.com', 
          created_at: new Date().toISOString(),
          plan: 'Enterprise' 
        } as unknown as T;
      }
      if (endpoint.includes('/api/auth/register')) {
        return { 
          message: 'Registration successful' 
        } as unknown as T;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(data?.message || data?.msg || 'An error occurred', response.status, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  },

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};
