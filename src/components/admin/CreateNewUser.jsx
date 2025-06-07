import { getFunctions, httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import { db } from '../../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import AdminAlert from '../../alerts/AdminAlert'

const CreateNewUser = () => {
  const [btnLoader, setBtnLoader] = useState(false)

  const [file, setFile] = useState(null)
  const [alert, setAlert] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [createNewUserData, setCreateNewUserData] = useState({
    newName: '',
    newEmail: '',
    newPhone: '+44 ',
    newPassword: '',
  })

  const uploadProfilePicture = (file, userUid) => {
    const storage = getStorage()
    const storageRef = ref(storage, `profile-images/${userUid}/profile-photo`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
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
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        }
      )
    })
  }

  // promis resolve pauses the surrounding async function
  // while it finishes getting a response
  const onCreateNewUser = async (e) => {
    e.preventDefault()
    setBtnLoader(true)
    try {
      const { newName, newEmail, newPhone, newPassword } = createNewUserData

      // Upload the profile picture and get the URL first
      let profilePicture =
        'https://firebasestorage.googleapis.com/v0/b/test-project-e2c7b.appspot.com/o/utils%2F5907.jpg?alt=media&token=9037aa68-b90a-491b-aaf9-28c7ecdafc0e'

      // Call the Cloud Function to create the user with profile picture URL
      const functions = getFunctions()
      const makeNewUserAsAdmin = httpsCallable(functions, 'makeNewUserAsAdmin')
      const res = await makeNewUserAsAdmin({
        email: newEmail,
        phoneNumber: newPhone,
        password: newPassword,
        name: newName,
        profilePicture: profilePicture,
      })

      const newUserUid = res.data.newUser.uid
      // console.log(newUserUid)
      // console.log(res)
      try {
        if (file) {
          profilePicture = await uploadProfilePicture(file, newUserUid)
        }
      } catch (error) {
        console.error('Error uploading profile picture with real UID:', error)
      }

      // updated file as admin -- as admin
      const updateUserProfilePicture = httpsCallable(
        functions,
        'updateUserProfilePicture'
      )
      // updated file as admin -- as admin
      file &&
        updateUserProfilePicture({
          uid: newUserUid,
          profilePicture,
        }).then((result) => {
          // Read result of the Cloud Function.
          console.log(result)
        })
      // Update user data with the profile picture URL in Firestore
      const userData = {
        name: res.data.newUser.displayName,
        email: res.data.newUser.email,
        profilePicture,
        timestamp: serverTimestamp(),
      }

      const stats = {
        company: '',
        name: res.data.newUser.displayName,
        email: res.data.newUser.email,
        amountSpent: 0,
        numberOfOrders: 0,
        rating: 0,
        points: 0,
        goldCustomer: false,
        timestamp: serverTimestamp(),
      }

      await setDoc(doc(db, 'stats', newUserUid), stats)
      await setDoc(doc(db, 'users', newUserUid), userData)

      console.log(userData)

      setAlert(true)
      setAlertText('success user created')
      setAlertSuccess(true)
      resetAlertState(2000)
      setBtnLoader(false)
      resetState()
    } catch (error) {
      console.log(error)
      const msg = {
        error,
        msg: 'Please include all fields',
      }
      setAlert(true)
      setAlertText(msg.msg)
      console.log(msg.msg)
      resetAlertState(2000)
      setBtnLoader(false)
    }
  }

  const handleNewUserChange = (e) => {
    const { id, value } = e.target
    setCreateNewUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    console.log(selectedFile)
  }

  const { newName, newEmail, newPhone, newPassword } = createNewUserData

  function resetAlertState(time) {
    setTimeout(() => {
      setAlert(false)
      setAlertText('')
    }, time)
  }

  function resetState() {
    setCreateNewUserData((prevState) => ({
      ...prevState,
      newName: '',
      newEmail: '',
      newPhone: '+44 ',
      newPassword: '',
    }))
  }
  return (
    <form onSubmit={onCreateNewUser}>
      {alert && <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />}
      <div className="admin-form-group">
        <input
          id="newName"
          onChange={handleNewUserChange}
          className="admin-input"
          type="text"
          placeholder="Enter name"
          value={newName}
        />
      </div>
      <div className="admin-form-group">
        <input
          id="newEmail"
          onChange={handleNewUserChange}
          className="admin-input"
          type="text"
          placeholder="Enter email"
          value={newEmail}
        />
      </div>
      <div className="admin-form-group">
        <input
          id="newPhone"
          onChange={handleNewUserChange}
          className="admin-input"
          type="text"
          placeholder="Enter phone"
          value={newPhone}
        />
      </div>
      <div className="admin-form-group">
        <input
          id="newPassword"
          onChange={handleNewUserChange}
          className="admin-input"
          type="text"
          placeholder="Enter password"
          value={newPassword}
        />
      </div>

      <div className="admin-btn-container">
        <input className="file-input" onChange={handleFileChange} type="file" />
      </div>
      <div className="admin-btn-container">
        <button className="admin-submit-btn">
          {btnLoader ? 'creating user...' : 'create user'}
        </button>
      </div>
    </form>
  )
}

export default CreateNewUser
