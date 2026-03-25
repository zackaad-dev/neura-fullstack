const BASE = '/api/v1/auth'

export interface AuthResponse {
  token: string
  email: string
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Registration failed')
  }

  return res.json()
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Invalid credentials')
  }

  return res.json()
}
