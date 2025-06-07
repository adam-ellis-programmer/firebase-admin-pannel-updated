import { getFunctions, httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import AdminAlert from '../../alerts/AdminAlert'

const UpdatUserProfile = () => {
  const [btnLoader, setBtnLoader] = useState({
    btnName: '',
    showBtnAlert: false,
    btnDisabled: false,
  })
  const { btnName, showBtnAlert, btnDisabled } = btnLoader
  const [alert, setAlert] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertText, setAlertText] = useState('')

  const [userEmailUpdate, setUserEmailUpdate] = useState('')
  const [updateData, setUpdateData] = useState({
    email: '',
    name: '',
    phone: '',
    emailVerified: false,
    disabled: false,
    uid: '',
  })

  const { email, name, phone, emailVerified, disabled, uid } = updateData

  const handleGetUserUpdate = (e) => {
    console.log('clicked')
    e.preventDefault()
    handleBtnLoader('get-user', true, true)
    console.log(userEmailUpdate)

    const functions = getFunctions()
    const getUser = httpsCallable(functions, 'getUser')

    getUser({ email: userEmailUpdate })
      .then((result) => {
        console.log(result)
        const user = result.data.user
        // populate fields with fresh data
        if (user) {
          setUpdateData((prevState) => ({
            ...prevState,
            email: user.email,
            name: user.displayName,
            phone: `+44 ${user?.phoneNumber?.slice(3) ?? ''}`,
            emailVerified: user.emailVerified,
            disabled: user.disabled,
            uid: user.uid,
          }))
        }
        handleBtnLoader('get-user', false, false)
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code
        const message = error.message
        const details = error.details
        console.log(message)
        setAlert(true)
        setAlertText(message)
        resetAlertState(2000)
        handleBtnLoader('get-user', false, false)
      })
  }

  const handleUpdateChanges = (e) => {
    const { id, value, type, checked } = e.target
    setUpdateData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    handleBtnLoader('update-user', true, true)

    const functions = getFunctions()
    const updateUserProfile = httpsCallable(functions, 'updateUserProfile')
    updateUserProfile(updateData)
      .then((data) => {
        setAlert(true)
        setAlertSuccess(true)
        setAlertText('successfully updaated user')
        resetAlertState(2000)
        resetState()
        handleBtnLoader('update-user', false, false)
        console.log(data)
      })

      .catch((error) => {
        const code = error.code
        const message = error.message
        const details = error.details
        // ...
        console.log(message)
        setAlert(true)
        setAlertText(message)
        resetAlertState(2000)
        handleBtnLoader('update-user', false, false)
      })
  }

  function resetAlertState(time) {
    setTimeout(() => {
      setAlert(false)
      setAlertText('')
      setAlertSuccess(false)
    }, time)
  }

  function resetState() {
    setUpdateData((prevState) => ({
      ...prevState,
      email: '',
      name: '',
      phone: '',
      emailVerified: false,
      disabled: false,
      uid: '',
    }))
    setUserEmailUpdate('')
  }

  function handleBtnLoader(name, alert, btnDisabled) {
    setBtnLoader((prevState) => ({
      ...prevState,
      btnName: name,
      showBtnAlert: alert,
      btnDisabled,
    }))
  }
  return (
    <>
      <form onSubmit={handleGetUserUpdate}>
        {alert && <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />}
        <div className="admin-form-group">
          <input
            onChange={(e) => setUserEmailUpdate(e.target.value)}
            className="admin-input"
            type="text"
            placeholder="enter email"
            value={userEmailUpdate}
          />
        </div>

        <div className="admin-btn-container">
          <button disabled={btnDisabled} className="admin-submit-btn">
            {showBtnAlert && btnName === 'get-user' ? 'getting user...' : 'get user'}
          </button>
        </div>
      </form>

      <form onSubmit={handleUpdate} className="update-user-profile-form">
        <div className="admin-form-group">
          <input
            id="email"
            onChange={handleUpdateChanges}
            className="admin-input"
            type="text"
            placeholder="email"
            value={email}
          />
        </div>
        <div className="admin-form-group">
          <input
            id="name"
            onChange={handleUpdateChanges}
            className="admin-input"
            type="text"
            placeholder="display name"
            value={name}
          />
        </div>
        <div className="admin-form-group">
          <input
            id="phone"
            onChange={handleUpdateChanges}
            className="admin-input"
            type="text"
            placeholder="phone"
            value={phone}
          />
        </div>
        <div className="admin-form-group">
          <label htmlFor="emailVerified" className="admin-check-label">
            <input
              className="admin-checkbox"
              id="emailVerified"
              type="checkbox"
              name="emailVerified"
              onChange={handleUpdateChanges}
              value={emailVerified}
              checked={emailVerified}
            />
            <span>email verified</span>
          </label>
        </div>

        <div className="admin-form-group">
          <label htmlFor="disabled" className="admin-check-label">
            <input
              className="admin-checkbox"
              id="disabled"
              type="checkbox"
              name="disabled"
              onChange={handleUpdateChanges}
              value={disabled}
              checked={disabled}
            />
            <span>disabled</span>
          </label>
        </div>

        <div className="admin-btn-container">
          <button disabled={btnDisabled} className="admin-submit-btn">
            {showBtnAlert && btnName === 'update-user'
              ? 'updating user...'
              : 'update user'}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdatUserProfile
