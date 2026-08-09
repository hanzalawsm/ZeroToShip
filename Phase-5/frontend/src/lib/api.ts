import {
  TokenResponse,
  UserProfileResponse,
  UserProfileUpdate,
  ProviderResponse,
  BookingCreate,
  BookingResponse,
  OrchestrateResponse
} from './types';

const API_URL = 'http://127.0.0.1:8000';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string):Promise<TokenResponse> {
    const res = await this.request<TokenResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.access_token);
    }
    return res;
  }

  async register(name: string, email: string, password: string): Promise<any> {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // User Profile
  async getProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>('/users/me');
  }

  async updateProfile(data: UserProfileUpdate): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Providers
  async getProviders(params?: Record<string, string>): Promise<ProviderResponse[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<ProviderResponse[]>(`/providers${query}`);
  }

  // Bookings
  async createBooking(data: BookingCreate): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getBookings(): Promise<BookingResponse[]> {
    return this.request<BookingResponse[]>('/bookings/me');
  }

  async cancelBooking(bookingId: number): Promise<any> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE'
    });
  }

  // Orchestrator
  async orchestrate(prompt: string): Promise<OrchestrateResponse> {
    return this.request<OrchestrateResponse>('/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }
}

export const api = new ApiClient();
