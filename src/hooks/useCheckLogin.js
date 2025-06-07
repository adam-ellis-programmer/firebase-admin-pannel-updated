import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useCheckLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [user, setUser] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        setLoggedIn(true)

        const checkAdmin = await user.getIdTokenResult()
        const claims = checkAdmin?.claims

        // chek for admin only
        if (claims?.auth?.admin === true) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } else {
        // Reset states when the user logs out
        setUser(null)
        setLoggedIn(false)
        setIsAdmin(false)
      }

      setCheckingStatus(false)
    })

    return () => unsubscribe()
  }, [auth])

  return {
    loggedIn,
    isAdmin,
    checkingStatus,
    // if no user we set null
    user,
  }
}

export default useCheckLogin
