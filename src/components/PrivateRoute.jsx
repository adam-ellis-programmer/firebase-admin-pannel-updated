import { Navigate, Outlet } from 'react-router-dom'
import useCheckLogin from '../hooks/useCheckLogin'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus, isAdmin } = useCheckLogin()

  if (checkingStatus) {
    return <h2>Loading...</h2>
  }

  return loggedIn && isAdmin ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoute
