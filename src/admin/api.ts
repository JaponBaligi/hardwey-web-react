const API_BASE = '/api';

let csrfToken: string | null = null;

export async function ensureCsrf(): Promise<string> {
  if (csrfToken) return csrfToken;
  const res = await fetch(`${API_BASE}/csrf`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to get CSRF token');
  const data = await res.json();
  csrfToken = data.csrfToken as string;
  return csrfToken;
}

function withCsrf(headers: Record<string, string> = {}) {
  return { ...headers, 'x-csrf-token': csrfToken || '' };
}

export async function login(username: string, password: string) {
  await ensureCsrf();
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...withCsrf() },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Login failed');
  }
}

export async function refresh() {
  await ensureCsrf();
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: withCsrf()
  });
  if (!res.ok) throw new Error('Refresh failed');
}

export async function logout() {
  await ensureCsrf();
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include', headers: withCsrf() });
}

export async function getMe(): Promise<{ authenticated: boolean; user?: { id: number; username: string } }> {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  if (!res.ok) return { authenticated: false };
  return res.json();
}

export async function fetchAllContent(): Promise<{ content: Record<string, unknown> }> {
  const res = await fetch(`${API_BASE}/content`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load content');
  return res.json();
}

export async function fetchSection(section: string): Promise<{ section: string; data: any }> {
  const res = await fetch(`${API_BASE}/content/${encodeURIComponent(section)}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load section');
  return res.json();
}

export async function updateSection(section: string, data: any) {
  await ensureCsrf();
  const res = await fetch(`${API_BASE}/content/${encodeURIComponent(section)}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...withCsrf() },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Update failed');
  }
}

export async function uploadImage(file: File): Promise<{ ok: boolean; url: string }> {
  await ensureCsrf();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: withCsrf(),
    body: form
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Upload failed');
  }
  return res.json();
}

export async function deleteSection(section: string) {
  await ensureCsrf();
  const res = await fetch(`${API_BASE}/content/${encodeURIComponent(section)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: withCsrf(),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Delete failed');
  }
}


