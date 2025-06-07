import { collection, query, where, getDocs } from 'firebase/firestore'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'

import NavBar from './layout/NavBar'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Admin from './pages/Admin'
import EmailSignin from './pages/EmailSignin'
import NewSignup from './pages/NewSignup'
import ProfilePage from './pages/ProfilePage'
import AdminManageUsers from './pages/AdminManageUsers'
import PrivateRouteLoggedIn from './components/PrivateRouteLoggedIn'

function App() {
  return (
    <div className='App'>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/email-signin' element={<EmailSignin />} />
          <Route path='/new-signup' element={<NewSignup />} />
          <Route path='/admin-manage-users' element={<AdminManageUsers />} />

          {/* Private Routes must be admin */}
          <Route element={<PrivateRoute />}>
            <Route path='/admin' element={<Admin />} />
          </Route>

          {/* Private Routes must be logged in */}
          <Route element={<PrivateRouteLoggedIn />}>
            <Route path='/me' element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
