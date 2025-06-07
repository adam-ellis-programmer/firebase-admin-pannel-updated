import { FaGoogle, FaUserPlus, FaKey } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../layout/PageHeader'
import { setDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db } from '../../firebase.config'

const SigninWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log('loggedin...')

    try {
      const auth = getAuth()
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      console.log(user.uid)
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        console.log('Document data:', docSnap.data())
        const userData = {
          name: user.displayName,
          email: user.email,
        }
        userData.timeStamp = serverTimestamp()

        console.log(userData)
        const stats = {
          company: '',
          name: user.displayName,
          email: user.email,
          amountSpent: 0,
          numberOfOrders: 0,
          rating: 0,
          points: 0,
          goldCustomer: false,
          timestamp: serverTimestamp(),
        }
        // only need two objects here
        await setDoc(doc(db, 'users', user.uid), userData)
        await setDoc(doc(db, 'stats', user.uid), stats)
        // await setDoc(doc(db, 'stats', user.uid), {})
      } else {
        // docSnap.data() will be undefined in this case
        console.log('documents found and logged in')
      }

      navigate('/')
    } catch (error) {
      console.log(error)
      // Handle Errors 
      const errorCode = error.code
      const errorMessage = error.message

      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    }
  }
  return (
    <div onClick={handleLogin} className="sign-in-box">
      <FaGoogle className="sign-in-icon" icon="fa-brands fa-google" />
    </div>
  )
}

export default SigninWithGoogle
