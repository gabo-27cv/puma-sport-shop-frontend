import api from '../api/axios';
import { adapter } from './adapter.service';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    // Tu backend devuelve "usuario" (no "user")
    return {
      user: adapter.adaptUser(response.data.usuario || response.data.user),
      token: response.data.token
    };
  },

  async register(userData) {
    try {
      console.log('📤 Enviando registro:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('📥 Respuesta registro:', response.data);
      
      // Tu backend devuelve "usuario" (no "user")
      return {
        user: adapter.adaptUser(response.data.usuario || response.data.user),
        token: response.data.token
      };
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error);
      throw error;
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/profile');
    // Tu backend devuelve "usuario" (no "user")
    return adapter.adaptUser(response.data.usuario || response.data.user);
  },

  logout() {
    localStorage.removeItem('token');
  }
};