import { useState, useEffect } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import SectionHeader from '../../layout/SectionHeader'
import FormLinkToBtn from '../buttons/FormLinkToBtn'
import UserAlert from '../../alerts/UserAlert'
const EmailSignInFrom = () => {
  const navigate = useNavigate()
  const [alertMsg, setAlertMsg] = useState('')
  const [alert, setAlert] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const onChange = (e) => {
    const { id } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }))
  }

  // after sign in set the localStorage for the url
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const user = await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
      // console.log('USER-img-url', user.user.photoURL)
    } catch (error) {
      setAlert(true)
      resetAlerts(2000)
      console.log(error)
      // const errorCode = error.code
      // const errorMessage = error.message
    }
  }

  function resetAlerts(delay) {
    setTimeout(() => {
      setAlert(false)
    }, delay)
  }
  return (
    <form onSubmit={handleSubmit} action="" className="form signin-form">
      <SectionHeader text={`signin to use our services`} />

      <div className="form-control signin-form-control">
        {alert && <UserAlert text={`invalid credentials `} />}
        <label className="form-label" htmlFor="email">
          email
        </label>
        <input
          onChange={onChange}
          id="email"
          type="text"
          className="form-input"
          placeholder="email"
          value={email}
        />
      </div>

      <div className="form-control signin-form-control">
        <label className="form-label" htmlFor="password">
          password
        </label>

        <input
          onChange={onChange}
          id="password"
          type="text"
          className="form-input"
          placeholder="password"
          value={password}
        />
      </div>
      <div className="form-sub-container">
        <button className="reset-password-btn">reset passord</button>
        <FormLinkToBtn link={`/new-signup`} text={`register`} />
      </div>
      <div className="form-btn-container">
        <button className="signup-btn">signin</button>
      </div>
      <img
        className="sign-in-img"
        src="https://firebasestorage.googleapis.com/v0/b/test-project-e2c7b.appspot.com/o/utils%2F5907.jpg?alt=media&token=9037aa68-b90a-491b-aaf9-28c7ecdafc0e"
        alt=""
      />
    </form>
  )
}

export default EmailSignInFrom
