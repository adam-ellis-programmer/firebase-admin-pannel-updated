import { FaGoogle, FaUserPlus, FaKey } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../layout/PageHeader'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import SigninWithGoogle from '../components/signin/SigninWithGoogle'

const Signin = () => {
  const provider = new GoogleAuthProvider()
  const navigate = useNavigate()

  const handleLogin = () => {
    console.log('loggedin...')

    // firebase service as the first param (auth) then a callback to see if user is logged in 
    const auth = getAuth()
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        navigate('/')
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <div className="page-container">
      <PageHeader text={`sign in to our app`} />

      <section className="sign-in-section">
        <div onClick={() => navigate('/email-signin')} className="sign-in-box">
          <FaKey className="sign-in-icon" icon="fa-solid fa-key" />
        </div>
        {/* <div onClick={handleLogin} className="sign-in-box">
          <FaGoogle className="sign-in-icon" icon="fa-brands fa-google" />
        </div> */}
        <SigninWithGoogle />
        
        <div onClick={() => navigate('/new-signup')} className="sign-in-box">
          <FaUserPlus className="sign-in-icon" icon="fa-regular fa-user-plus" />
        </div>
      </section>
    </div>
  )
}

export default Signin
