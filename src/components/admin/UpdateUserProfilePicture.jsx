import React from 'react'
import SectionHeader from '../../layout/SectionHeader'
import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'
import AdminAlert from '../../alerts/AdminAlert'
const UpdateUserProfilePicture = () => {
  const [btnLoader, setBtnLoader] = useState(false)
  const [email, setEmail] = useState('')
  const [file, setFile] = useState()
  const [alert, setAlert] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertText, setAlertText] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    setFile(file)
  }

  // prettier-ignore
  const uploadFileImage = (file, userId) => {
    const storage = getStorage()
    const storageRef = ref(storage, `profile-images/${userId}/profile-photo`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
          reject(error)
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const onSubmit = async (e) => {
    const functions = getFunctions()
    e.preventDefault()
    setBtnLoader(true)
    let url = ''
    let userUID = ''
    try {
      const getUser = httpsCallable(functions, 'getUser')
      const res = await getUser({ email })
      // console.log(res.data.user.uid)
      userUID = res.data.user.uid

      if (file) {
        url = await uploadFileImage(file, userUID)
      } else {
        console.log('please select an image')
      }

      const updateUserProfilePicture = httpsCallable(
        functions,
        'updateUserProfilePicture'
      )

      const updatedIMG = await updateUserProfilePicture({
        uid: userUID,
        profilePicture: url,
      })

      alertState('success updated image', true)
      resetAlertState(2000)
      setBtnLoader(false)
    } catch (error) {
      setBtnLoader(false)
      const code = error.code
      const message = error.message
      const details = error.details
      console.log(message)
      alertState(message)
      resetAlertState(2000)
    }
  }

  function resetAlertState(time) {
    setEmail('')

    setTimeout(() => {
      setAlert(false)
      setAlertText('')
      setAlertSuccess(false)
    }, time)
  }

  function alertState(text, success = false) {
    setAlert(true)
    setAlertSuccess(success)
    setAlertText(text)
  }

  return (
    <div>
      <SectionHeader text={`update a users profile picture`} />

      <form onSubmit={onSubmit}>
        {alert && <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />}
        <div className="admin-form-group"></div>
        <div className="admin-form-group">
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
            type="text"
            placeholder="Enter email"
            value={email}
          />
        </div>

        <div className="admin-btn-container">
          <input className="file-input" onChange={handleFileChange} type="file" />
        </div>
        <div className="admin-btn-container">
          <button className="admin-submit-btn">
            {btnLoader ? 'updating picture...' : 'update picture'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateUserProfilePicture
