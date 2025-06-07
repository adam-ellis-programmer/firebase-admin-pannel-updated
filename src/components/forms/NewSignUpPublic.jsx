import { useState, useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'
import SectionHeader from '../../layout/SectionHeader'
import FormLinkToBtn from '../buttons/FormLinkToBtn'

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import UserAlert from '../../alerts/UserAlert'

const NewSignUpPublic = () => {
  const [file, setFile] = useState('')
  const [alertMsg, setAlertMsg] = useState('')
  const [alert, setAlert] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { name, email, password, confirmPassword } = formData

  const onChange = (e) => {
    const { id } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    console.log(selectedFile)
  }

  const uploadProfilePicture = (uid, file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()
      const storageRef = ref(storage, `/profile-images/${uid}/profile-photo`)

      const uploadTask = uploadBytesResumable(storageRef, file)

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
          console.error('Upload failed', error)
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

  // TODO UPLOAD IMAGE FOR PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault()
    let profilePicture =
      'https://firebasestorage.googleapis.com/v0/b/test-project-e2c7b.appspot.com/o/utils%2F5907.jpg?alt=media&token=9037aa68-b90a-491b-aaf9-28c7ecdafc0e'
    if (name === '' || email === '') {
      setAlertMsg('please include a name and email')
      setAlert(true)
      resetAlert(2000)
      return
    }

    if (password === '' || confirmPassword === '') {
      setAlertMsg('please include a password')
      setAlert(true)
      resetAlert(2000)
      return
    }
    if (password !== confirmPassword) {
      setAlertMsg('passwords do not match')
      setAlert(true)
      resetAlert(2000)
      return
    }

    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user
      const userId = auth && auth?.currentUser?.uid

      console.log('updated profile url --1: ', profilePicture)
      console.log(userId)

      if (file) {
        profilePicture = await uploadProfilePicture(userId, file)
      }

      console.log('updated profile url-2: ', profilePicture)
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profilePicture,
      })

      console.log('updated profile url -3: ', profilePicture)

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      delete formDataCopy.confirmPassword
      formDataCopy.timeStamp = serverTimestamp()

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
      // const url = await uploadProfilePicture()
      // only need two objects here for setDoc
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      await setDoc(doc(db, 'stats', user.uid), stats)
      // await setDoc(doc(db, 'stats', user.uid), {})
    } catch (error) {
      console.log(error)
      // setAlertMsg('')
      // setAlert(true)
      // resetAlert(2000)
    }
  }
  function resetAlert(delay) {
    setTimeout(() => {
      setAlertMsg('false')
      setAlert(false)
    }, delay)
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <SectionHeader text={`signup to use our services`} />
      <div className="form-control">
        {alert && <UserAlert text={alertMsg} />}
        <label className="form-label" htmlFor="name">
          name
        </label>
        <input
          onChange={onChange}
          id="name"
          type="text"
          className="form-input"
          placeholder="name"
          value={name}
        />
      </div>

      <div className="form-control">
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

      <div className="form-control">
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

      <div className="form-control">
        <label className="form-label" htmlFor="confirmPassword">
          confirm password
        </label>
        <input
          onChange={onChange}
          id="confirmPassword"
          type="text"
          className="form-input"
          placeholder="confirmPassword"
          value={confirmPassword}
        />
      </div>
      <input
        onChange={handleFileChange}
        className="file-input signup-img-input"
        type="file"
        name=""
        id=""
      />
      <FormLinkToBtn link={`/email-signin`} text={`signin`} />

      <div className="form-btn-container">
        <button className="signup-btn">signup</button>
      </div>
    </form>
  )
}

export default NewSignUpPublic
