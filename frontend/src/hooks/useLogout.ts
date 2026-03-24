import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user_email')

    // Clear TanStack Query cache
    queryClient.clear()

    // Redirect to login
    navigate('/login')
  }, [queryClient, navigate])

  return logout
}
