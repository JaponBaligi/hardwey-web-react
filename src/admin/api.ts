const API_BASE = '/api';

// CSRF Token Management
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

// Error Handling Utilities
interface ApiError {
  error?: string;
  message?: string;
}

async function handleApiError(res: Response, defaultMessage: string): Promise<never> {
  if (res.status === 401) {
    throw new Error('401 Unauthorized - Please log in to the admin panel. Your session may have expired.');
  }
  
  let errorMessage = defaultMessage;
  try {
    const error: ApiError = await res.json();
    errorMessage = error.error || error.message || defaultMessage;
  } catch {
    // If JSON parsing fails, use status text or default
    errorMessage = res.statusText || defaultMessage;
  }
  
  throw new Error(errorMessage);
}

async function handleSectionError(res: Response): Promise<never> {
  if (res.status === 401) {
    throw new Error('401 Unauthorized - Please log in to the admin panel');
  }
  if (res.status === 404) {
    throw new Error('404 Not found - Section does not exist yet');
  }
  throw new Error(`Failed to load section: ${res.status} ${res.statusText}`);
}

// API Request Wrapper
interface RequestOptions extends RequestInit {
  requiresCsrf?: boolean;
  contentType?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresCsrf = false, contentType, ...fetchOptions } = options;
  
  const headers: Record<string, string> = { ...fetchOptions.headers as Record<string, string> };
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (requiresCsrf) {
    await ensureCsrf();
    Object.assign(headers, withCsrf());
  }
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    credentials: 'include',
    headers,
  });
  
  if (!res.ok) {
    throw await handleApiError(res, 'Request failed');
  }
  
  return res.json();
}

// Auth API
export async function login(username: string, password: string): Promise<void> {
  await apiRequest('/auth/login', {
    method: 'POST',
    requiresCsrf: true,
    contentType: 'application/json',
    body: JSON.stringify({ username, password }),
  });
}

export async function refresh(): Promise<void> {
  await apiRequest('/auth/refresh', {
    method: 'POST',
    requiresCsrf: true,
  });
}

export async function logout(): Promise<void> {
  await apiRequest('/auth/logout', {
    method: 'POST',
    requiresCsrf: true,
  });
}

export async function getMe(): Promise<{ authenticated: boolean; user?: { id: number; username: string } }> {
  try {
    return await apiRequest('/auth/me', { credentials: 'include' });
  } catch {
    return { authenticated: false };
  }
}

// Content API
export async function fetchAllContent(): Promise<{ content: Record<string, unknown> }> {
  return apiRequest('/content');
}

export async function fetchSection(section: string): Promise<{ section: string; data: any }> {
  const endpoint = `/content/${encodeURIComponent(section)}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { credentials: 'include' });
  
  if (!res.ok) {
    throw await handleSectionError(res);
  }
  
  return res.json();
}

export async function updateSection(section: string, data: any): Promise<void> {
  await apiRequest(`/content/${encodeURIComponent(section)}`, {
    method: 'PUT',
    requiresCsrf: true,
    contentType: 'application/json',
    body: JSON.stringify(data),
  });
}

export async function deleteSection(section: string): Promise<void> {
  await apiRequest(`/content/${encodeURIComponent(section)}`, {
    method: 'DELETE',
    requiresCsrf: true,
  });
}

export async function uploadImage(file: File): Promise<{ ok: boolean; url: string }> {
  const form = new FormData();
  form.append('file', file);
  
  return apiRequest('/uploads', {
    method: 'POST',
    requiresCsrf: true,
    body: form,
  });
}


