const BASE_URL = 'http://localhost:8080';

let isRefreshing = false;
let pendingQueue = [];

function getToken() {
  return localStorage.getItem('qlmv_token');
}

function setToken(token) {
  if (token) localStorage.setItem('qlmv_token', token);
}

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

async function refreshToken() {
  const oldToken = getToken();
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ token: oldToken })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Refresh failed');
  const newToken = data?.result?.token;
  if (!newToken) throw new Error('No new token');
  setToken(newToken);
  return newToken;
}

async function apiRequest(method, path, { headers = {}, body, _retry } = {}) {
  const token = getToken();
  const mergedHeaders = {
    'Accept': 'application/json',
    ...headers
  };
  if (token) mergedHeaders['Authorization'] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) mergedHeaders['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: mergedHeaders,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });

  if (res.status === 401 && !_retry) {
    if (isRefreshing) {
      const newToken = await new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
      const retriedHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      return apiRequest(method, path, { headers: retriedHeaders, body, _retry: true });
    }
    isRefreshing = true;
    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);
      const retriedHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      return apiRequest(method, path, { headers: retriedHeaders, body, _retry: true });
    } catch (e) {
      processQueue(e, null);
      localStorage.removeItem('qlmv_token');
      localStorage.removeItem('qlmv_user');
      window.location.href = '/login';
      throw e;
    } finally {
      isRefreshing = false;
    }
  }

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export const api = {
  get: (path, config = {}) => apiRequest('GET', path, config),
  post: (path, data, config = {}) => apiRequest('POST', path, { ...config, body: data }),
  put: (path, data, config = {}) => apiRequest('PUT', path, { ...config, body: data }),
  patch: (path, data, config = {}) => apiRequest('PATCH', path, { ...config, body: data }),
  delete: (path, config = {}) => apiRequest('DELETE', path, config)
};

export default api;


