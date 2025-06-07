// https://firebase.google.com/docs/auth/web/manage-users?_gl=1*rtlsx3*_up*MQ..*_ga*NTAzNjc5NTM0LjE3MTg0NjQ4NzY.*_ga_CW55HF8NVT*MTcxODQ2NDg3Ni4xLjAuMTcxODQ2NDg3Ni4wLjAuMA..

// import { db } from '../firebase.config'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import PageHeader from '../layout/PageHeader'
const auth = getAuth()

const useCheckAdmin = () => {
  const [token, setToken] = useState(null)
  const [claims, setClaims] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          setToken(idTokenResult)
          setClaims(idTokenResult.claims.auth)
          user.getIdToken(true)
        })
        // ...
      } else {
        // User is signed out
        // ...
      }
    })
    return () => {}
  }, [])

  return { token, claims }
}

export default useCheckAdmin
