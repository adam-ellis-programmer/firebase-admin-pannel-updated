import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useLoggedInOnly = () => {
  const auth = getAuth()
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCheckingStatus(false)
        setLoggedIn(true)
        const checkAdmin = await user.getIdTokenResult()
        const claims = checkAdmin?.claims
      } else {
        // Reset states when the user logs out
        setLoggedIn(false)
      }

      setCheckingStatus(false)
    })

    return () => unsubscribe()
  }, [auth])

  return { loggedIn, checkingStatus }
}

export default useLoggedInOnly
