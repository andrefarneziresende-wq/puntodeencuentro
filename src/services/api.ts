/**
 * API Service
 * 
 * Handles all HTTP requests to the backend.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Error en la solicitud.' };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: 'Error de conexión. Verifica tu internet.' };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async healthCheck() {
    return this.request<{ status: string }>('/health');
  }

  // Testimonies endpoints
  async getTestimonies() {
    return this.request<{ testimonies: any[] }>('/testimonies');
  }

  async getHighlightedTestimonies() {
    return this.request<{ testimonies: any[] }>('/testimonies/highlighted');
  }

  async getTestimony(id: string) {
    return this.request<{ testimony: any }>(`/testimonies/${id}`);
  }

  async createTestimony(data: { title: string; content: string; groupName?: string }) {
    return this.request<{ testimony: any }>('/testimonies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleFavorite(id: string) {
    return this.request<{ testimony: any }>(`/testimonies/${id}/favorite`, {
      method: 'POST',
    });
  }

  async toggleHighlight(id: string, highlighted: boolean) {
    return this.request<{ testimony: any }>(`/testimonies/${id}/highlight`, {
      method: 'POST',
      body: JSON.stringify({ highlighted }),
    });
  }

  async deleteTestimony(id: string) {
    return this.request<{ message: string }>(`/testimonies/${id}`, {
      method: 'DELETE',
    });
  }

  // Groups endpoints
  async getGroups() {
    return this.request<{ groups: any[] }>('/groups');
  }

  async getGroup(id: string) {
    return this.request<{ group: any }>(`/groups/${id}`);
  }

  // Members endpoints
  async getMembers() {
    return this.request<{ members: any[] }>('/members');
  }

  async getIntegrantes() {
    return this.request<{ integrantes: any[] }>('/integrantes');
  }

  async getIntegrante(id: string) {
    return this.request<{ integrante: any }>(`/integrantes/${id}`);
  }

  async getMember(id: string) {
    return this.request<{ member: any }>(`/members/${id}`);
  }

  // Ministries endpoints
  async getMinistries() {
    return this.request<{ ministries: any[] }>('/ministries');
  }

  async getMinistry(id: string) {
    return this.request<{ ministry: any }>(`/ministries/${id}`);
  }

  // Withdrawals endpoints
  async getWithdrawals() {
    return this.request<{ withdrawals: any[] }>('/withdrawals');
  }

  async getWithdrawal(id: string) {
    return this.request<{ withdrawal: any }>(`/withdrawals/${id}`);
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request<{ stats: any }>('/dashboard/stats');
  }
}

export const api = new ApiService();
