const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('neura_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (
    res.status === 401 &&
    !window.location.pathname.includes('/login') &&
    !window.location.pathname.includes('/register')
  ) {
    localStorage.removeItem('neura_token')
    localStorage.removeItem('neura_email')
    window.location.href = '/login'
    throw new Error('Please log in again')
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid email or password')
    }
    const error = await res.json().catch(() => ({ message: 'Unexpected error' }))
    throw new Error(error.message ?? `HTTP Error ${res.status}`)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T, B extends Record<string, unknown>>(path: string, body: B) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T, B extends Record<string, unknown>>(path: string, body: B) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T, B extends Record<string, unknown>>(path: string, body: B) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
