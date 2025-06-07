import { getFunctions, httpsCallable } from 'firebase/functions'
import React from 'react'
import { useState, useEffect } from 'react'
import AdminAlert from '../../alerts/AdminAlert'

const ChangeUserPassword = () => {
  // const [showAlert, setShowAlert] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false)

  const [alert, setAlert] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    email: '',
  })

  const { password, email } = formData
  const onChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setBtnLoader(true)
    const functions = getFunctions()
    const updateUserPassword = httpsCallable(functions, 'updateUserPassword')
    updateUserPassword({ email, password })
      .then((result) => {
        // Read result of the Cloud Function.
        // console.log(result)
        // console.log('success')
        setAlert(true)
        setAlertText('password changed')
        setAlertSuccess(true)
        resetAlert(2000)
        setBtnLoader(false)
        resetState()
      })
      .catch((error) => {
        setBtnLoader(false)
        // Getting the Error details.
        const code = error.code
        const message = error.message
        const details = error.details
        setAlert(true)
        setAlertText(message)
        console.log(message)
        resetAlert(2000)
        resetState()
      })
  }

  function resetAlert(delay) {
    setTimeout(() => {
      setAlert(false)
      setAlertText('')
      setAlertSuccess(false)
    }, delay)
  }

  function resetState() {
    setFormData((prevState) => ({
      ...prevState,
      password: '',
      email: '',
    }))
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {alert && <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />}
        <div className="admin-form-group">
          <input
            id="email"
            onChange={onChange}
            className="admin-input change-pw-input"
            type="text"
            placeholder="enter email"
            value={email}
          />
        </div>
        <div className="admin-form-group">
          <input
            id="password"
            onChange={onChange}
            className="admin-input change-pw-input"
            type="text"
            placeholder="new password"
            value={password}
          />
        </div>

        <div className="admin-btn-container">
          <button className="admin-submit-btn">
            {btnLoader ? 'changing password...' : 'change password'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangeUserPassword
