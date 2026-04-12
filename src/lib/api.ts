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
const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB per chunk

export const mediaAPI = {
  upload: async (
    file: File,
    category: string,
    token: string,
    onProgress?: (percent: number) => void
  ) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Small files (< 4MB): direct upload for speed
    if (totalChunks <= 1) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Erreur upload' }));
        throw new Error(err.message);
      }
      onProgress?.(100);
      return res.json();
    }

    // Large files: chunked upload
    let result = null;
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', String(i));
      formData.append('totalChunks', String(totalChunks));
      formData.append('originalName', file.name);
      formData.append('mimeType', file.type);
      formData.append('totalSize', String(file.size));
      formData.append('category', category);

      const res = await fetch(`${API_URL}/media/upload/chunk`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Erreur upload' }));
        throw new Error(err.message);
      }

      const data = await res.json();
      onProgress?.(Math.round(((i + 1) / totalChunks) * 100));

      if (data.done) {
        result = data.media;
      }
    }

    return result;
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

// Portfolio
export const portfolioAPI = {
  // Public
  getPublic: () => fetchAPI('/portfolio/public'),

  // Categories (admin)
  getCategories: (token: string) => fetchAPI('/portfolio/categories', { token }),
  createCategory: (data: Record<string, unknown>, token: string) =>
    fetchAPI('/portfolio/categories', { method: 'POST', body: JSON.stringify(data), token }),
  updateCategory: (id: string, data: Record<string, unknown>, token: string) =>
    fetchAPI(`/portfolio/categories/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  deleteCategory: (id: string, token: string) =>
    fetchAPI(`/portfolio/categories/${id}`, { method: 'DELETE', token }),

  // Grids (admin)
  getGrids: (categoryId: string, token: string) =>
    fetchAPI(`/portfolio/grids?categoryId=${categoryId}`, { token }),
  createGrid: (data: Record<string, unknown>, token: string) =>
    fetchAPI('/portfolio/grids', { method: 'POST', body: JSON.stringify(data), token }),
  updateGrid: (id: string, data: Record<string, unknown>, token: string) =>
    fetchAPI(`/portfolio/grids/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  deleteGrid: (id: string, token: string) =>
    fetchAPI(`/portfolio/grids/${id}`, { method: 'DELETE', token }),

  // Grid items (admin)
  addItem: (gridId: string, data: Record<string, unknown>, token: string) =>
    fetchAPI(`/portfolio/grids/${gridId}/items`, { method: 'POST', body: JSON.stringify(data), token }),
  updateItems: (gridId: string, items: unknown[], token: string) =>
    fetchAPI(`/portfolio/grids/${gridId}/items`, { method: 'PUT', body: JSON.stringify({ items }), token }),
  deleteItem: (gridId: string, itemId: string, token: string) =>
    fetchAPI(`/portfolio/grids/${gridId}/items`, { method: 'DELETE', body: JSON.stringify({ itemId }), token }),
};

// Users
export const usersAPI = {
  getAll: (token: string) => fetchAPI('/users', { token }),
  updateRole: (id: string, role: string, token: string) =>
    fetchAPI(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }), token }),
  delete: (id: string, token: string) =>
    fetchAPI(`/users/${id}`, { method: 'DELETE', token }),
};
