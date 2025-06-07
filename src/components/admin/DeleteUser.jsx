import { getFunctions, httpsCallable } from 'firebase/functions'
import { useState, useEffect } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase.config'
import DeleteUserAlert from '../../alerts/DeleteUserAlert'
import AdminAlert from '../../alerts/AdminAlert'
import { getStorage, ref, deleteObject } from 'firebase/storage'

const DeleteUser = () => {
  const [btnLoader, setBtnLoader] = useState(false)

  const [email, setEmail] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertText, setAlertText] = useState('')

  const handleDelete = async (e) => {
    e.preventDefault()
    setBtnLoader(true)
    try {
      const functions = getFunctions()

      // Get user for db delete
      const getUser = httpsCallable(functions, 'getUser')
      const userRes = await getUser({ email })
      const userID = userRes.data.user.uid

      const deleteUser = httpsCallable(functions, 'deleteUser')
      const res = await deleteUser({ email })
      console.log('userRes->', userRes.data.user.providerData[0].photoURL)

      await deleteDoc(doc(db, 'users', userID))
      await deleteDoc(doc(db, 'stats', userID))

      // await dellete image from fireStore -
      // loop this function for multi images

      // Delete the file
      if (
        userRes.data.user.providerData[0].photoURL !==
        'https://firebasestorage.googleapis.com/v0/b/test-project-e2c7b.appspot.com/o/utils%2F5907.jpg?alt=media&token=9037aa68-b90a-491b-aaf9-28c7ecdafc0e'
      ) {
        const storage = getStorage()
        const desertRef = ref(storage, `profile-images/${userID}/profile-photo`)
        const deletedImg = await deleteObject(desertRef)
        console.log('deleted image info: ', deletedImg)
      }

      setAlert(true)
      setShowConfirm(false)
      setAlertText('success user deleted')
      setAlertSuccess(true)
      reset(2000)
      setBtnLoader(false)

      console.log(res.data) // Success message
    } catch (error) {
      console.log(error)
      setBtnLoader(false)
      // Log the error details for debugging
      // console.error('Error code:', error.code)
      // console.error('Error message:', error.message)
      // console.error('Error details:', error.details)
      setAlert(true)
      setShowConfirm(false)
      setAlertText(error.message)
      reset(2000)

      // Display the custom error message to the user
      // alert(error.message) // This will display 'Oops, something went wrong'
    }
  }

  function reset(delay) {
    setTimeout(() => {
      setAlert(false)
      setAlertText('')
      setEmail('')
    }, delay)
  }

  const handleShowAlert = () => {
    if (email === '') {
      return
    }
    setShowConfirm(true)
  }

  return (
    <>
      {showConfirm && (
        <DeleteUserAlert
          handleDelete={handleDelete}
          setShowConfirm={setShowConfirm}
          setEmail={setEmail}
        />
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        {alert && <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />}
        <div className="admin-form-group">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
            type="text"
            placeholder="enter email"
            value={email}
          />
        </div>
      </form>

      <div className="admin-btn-container">
        <button onClick={handleShowAlert} className="admin-submit-btn">
          {btnLoader ? 'deleting user ...' : 'delete user'}
        </button>
      </div>
    </>
  )
}

export default DeleteUser
