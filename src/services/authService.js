/**
* Auth service tích hợp backend QLMV (Bearer token)
*/

import api from './api';

const BASE_URL = 'http://localhost:8080';

export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  const token = data?.result?.token;
  const usernameResp = data?.result?.username;
  const roles = data?.result?.roles || [];
  localStorage.setItem('qlmv_token', token);
  localStorage.setItem('qlmv_user', JSON.stringify({ username: usernameResp, roles }));
  return data?.result;
};

export const getAuthToken = () => localStorage.getItem('qlmv_token');

export const getMyInfo = async () => {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/users/my-info`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  const data = await res.json();
  return data?.result;
};

export const refreshToken = async () => {
  const oldToken = getAuthToken();
  const res = await api.post('/auth/refresh', { token: oldToken });
  const newToken = res?.data?.result?.token;
  if (!newToken) throw new Error('No new token');
  localStorage.setItem('qlmv_token', newToken);
  return newToken;
};

export const logout = async () => {
  const token = localStorage.getItem('qlmv_token');
  try {
    await api.post('/auth/logout', { token });
  } catch (_) {}
  localStorage.removeItem('qlmv_token');
  localStorage.removeItem('qlmv_user');
};


