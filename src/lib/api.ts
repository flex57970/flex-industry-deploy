const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || 'Erreur serveur');
  }

  return res.json();
}

// Auth
export const authAPI = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: (token: string) => fetchAPI('/auth/me', { token }),
};

// Content
export const contentAPI = {
  getByPage: (page: string) => fetchAPI(`/content/page/${page}`),
  getAll: (token: string) => fetchAPI('/content', { token }),
  create: (data: Record<string, unknown>, token: string) =>
    fetchAPI('/content', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: string, data: Record<string, unknown>, token: string) =>
    fetchAPI(`/content/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchAPI(`/content/${id}`, { method: 'DELETE', token }),
};

// Media
export const mediaAPI = {
  upload: async (file: File, category: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur upload');
    return res.json();
  },
  getAll: (token: string, category?: string) =>
    fetchAPI(`/media${category ? `?category=${category}` : ''}`, { token }),
  delete: (id: string, token: string) =>
    fetchAPI(`/media/${id}`, { method: 'DELETE', token }),
};

// Contact
export const contactAPI = {
  send: (data: { name: string; email: string; phone?: string; company?: string; service: string; message: string }) =>
    fetchAPI('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// Users
export const usersAPI = {
  getAll: (token: string) => fetchAPI('/users', { token }),
  updateRole: (id: string, role: string, token: string) =>
    fetchAPI(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }), token }),
  delete: (id: string, token: string) =>
    fetchAPI(`/users/${id}`, { method: 'DELETE', token }),
};
