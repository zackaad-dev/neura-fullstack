import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { clearToken } from '../lib/auth'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearToken()
    queryClient.clear()
    navigate('/login')
  }, [queryClient, navigate])

  return logout
}
