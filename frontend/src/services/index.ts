import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (userData: { 
    name?: string; 
    email?: string; 
    password?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  }) => {
    const { data } = await api.put('/auth/profile', userData);
    return data;
  },

  getAllUsers: async () => {
    const { data } = await api.get('/auth/users');
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
  },
};

export const productService = {
  getAll: async (params?: Record<string, string | number>) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  createReview: async (id: string, review: { rating: number; comment: string }) => {
    const { data } = await api.post(`/products/${id}/reviews`, review);
    return data;
  },
};

export const orderService = {
  create: async (orderData: Record<string, unknown>) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get('/orders/myorders');
    return data;
  },

  getAllOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },

  updateToPaid: async (id: string, paymentResult: Record<string, string>) => {
    const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
    return data;
  },

  updateToDelivered: async (id: string) => {
    const { data } = await api.put(`/orders/${id}/deliver`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
};

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  create: async (categoryData: Record<string, string>) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  update: async (id: string, categoryData: Record<string, string>) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};
