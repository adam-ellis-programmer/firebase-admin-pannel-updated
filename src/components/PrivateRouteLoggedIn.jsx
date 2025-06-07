import { Navigate, Outlet } from 'react-router-dom'
import useLoggedInOnly from '../hooks/useIsLoggedInOnly'

const PrivateRouteLoggedIn = () => {
  const { loggedIn, checkingStatus } = useLoggedInOnly()

  if (checkingStatus) return <div>loading...</div>

  return loggedIn ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRouteLoggedIn
