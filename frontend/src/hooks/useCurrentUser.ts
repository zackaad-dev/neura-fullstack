import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import type { UserResponse } from '../api/users'

export const userKeys = {
  current: ['user', 'me'] as const,
}

export function useCurrentUser() {
  return useQuery<UserResponse>({
    queryKey: userKeys.current,
    queryFn: usersApi.getMe,
  })
}
