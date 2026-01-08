const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Health & Status
  async getHealth() {
    return this.request('/health');
  }

  async getStatus() {
    return this.request('/status');
  }

  // Market Data
  async getMarketSummary() {
    return this.request('/market/summary');
  }

  async getPolymarketData() {
    return this.request('/market/polymarket');
  }

  async getPolymarketHot() {
    return this.request('/market/polymarket/hot');
  }

  async getPumpfunData() {
    return this.request('/market/pumpfun');
  }

  async getPumpfunHot() {
    return this.request('/market/pumpfun/hot');
  }

  async getTokenDetails(mint) {
    return this.request(`/market/pumpfun/token/${mint}`);
  }

  // Signals & Tweets
  async getSignals(limit = 20) {
    return this.request(`/signals?limit=${limit}`);
  }

  async getTweets(limit = 20, real = true) {
    return this.request(`/tweets?limit=${limit}&real=${real}`);
  }

  async getRealTweets(username = 'SignalsZara', limit = 10) {
    return this.request(`/tweets?limit=${limit}&real=true&username=${username}`);
  }

  // Chat with Zara
  async chat(message, sessionId) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId })
    });
  }

  async clearChat(sessionId) {
    return this.request(`/chat/${sessionId}`, {
      method: 'DELETE'
    });
  }

  // Admin
  async triggerUpdate() {
    return this.request('/admin/trigger-update', {
      method: 'POST'
    });
  }
}

export const api = new ApiService();
export default api;
