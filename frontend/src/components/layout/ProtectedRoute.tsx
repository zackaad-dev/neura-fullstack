import { Outlet } from 'react-router-dom'
import ForbiddenPage from '../../pages/ForbiddenPage'

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
