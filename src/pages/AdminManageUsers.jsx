import { useState } from 'react'
import PageHeader from '../layout/PageHeader'
import SectionHeader from '../layout/SectionHeader'
import AdminUserCard from '../components/AdminUserCard'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
// https://firebase.google.com/docs/functions/callable?_gl=1*1pjafs7*_up*MQ..*_ga*MTYxMzI1NTMyNC4xNzE4NjYwMDI3*_ga_CW55HF8NVT*MTcxODY2MDAyNy4xLjAuMTcxODY2MDAyNy4wLjAuMA..&gen=1st#web_7
import { getFunctions, httpsCallable } from 'firebase/functions'
import DeleteUser from '../components/admin/DeleteUser'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import UpdatUserProfile from '../components/admin/UpdatUserProfile'
import ViewAllUsers from '../components/admin/ViewAllUsers'
import { fetchUserFemale } from '../utils'
import CreateNewUser from '../components/admin/CreateNewUser'
import UpdateUserProfilePicture from '../components/admin/UpdateUserProfilePicture'
import AdminAlert from '../alerts/AdminAlert'
import ChangeUserPassword from '../components/admin/ ChangeUserPassword'

import useCheckAdmin from '../hooks/useCheckAdmin'
const AdminManageUsers = () => {
  const [btnLoader, setBtnLoader] = useState({
    btnName: '',
    showBtnAlert: false,
    btnDisabled: false,
  })
  const { btnName, showBtnAlert, btnDisabled } = btnLoader

  const [alertType, setAlertType] = useState('')
  const [alert, setAlert] = useState(false)

  const { token, claims } = useCheckAdmin()
  const [disabled, setDisabled] = useState(true)

  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [userUid, setUserUid] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [checkAll, setCheckAll] = useState(false)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [btnLoaderName, setbtnLoaderName] = useState('')
  const [hasAtLeastOneChecked, setHasAtLeastOneChecked] = useState(false)

  const [createNewUserData, setCreateNewUserData] = useState({
    newName: '',
    newEmail: '',
    newPhone: '',
    newPassword: '',
  })

  const handleNewUserChange = (e) => {
    const { id, value } = e.target
    setCreateNewUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const { newName, newEmail, newPhone, newPassword } = createNewUserData

  const [adminCheckData, setAdminCheckData] = useState({
    admin: false,
    manager: false,
    premium: false,
    sales: false,
  })

  const { admin, manager, premium, sales, ceo } = adminCheckData

  const handleGetUser = async (e) => {
    console.log('ran...!!!!')
    e.preventDefault()

    try {
      setButtonLoader(true)
      setbtnLoaderName('get-user')
      const functions = getFunctions()
      const getUser = httpsCallable(functions, 'getUser')
      const res = await getUser({ email: userEmail })
      console.log('RES===>', res)
      const user = res.data.user
      console.log(user)
      setUserUid(user.uid)
      const claims = user?.customClaims?.auth
      console.log('CLAIMS====>', claims)

      // Check if claims exist and are valid
      if (claims && typeof claims === 'object') {
        // Set the admin check data with the claims
        setAdminCheckData((prevState) => ({
          ...prevState,
          admin: claims?.admin || false,
          premium: claims?.premium || false,
          manager: claims?.manager || false,
          sales: claims?.sales || false,
        }))

        // Check if all values are false
        const allFalse = Object.values(claims).every((value) => value === false)

        setAlertText(
          allFalse
            ? 'all access is unchecked'
            : 'success - see check boxes below'
        )
      } else {
        // Handle case where claims don't exist or are invalid
        setAdminCheckData((prevState) => ({
          ...prevState,
          admin: false,
          premium: false,
          manager: false,
          sales: false,
        }))

        setAlertText(
          'User does not have any valid claims yet. Please add some.'
        )
      }

      setAlertType('get-user')
      setAlert(true)
      resetAlertState(2000)
      setAlertSuccess(true)
      setDisabled(false)
      setButtonLoader(false)
    } catch (error) {
      // get custom info from the error.details obj
      const code = error.code
      const message = error.message
      const details = error.details
      setButtonLoader(false)

      setAlertType('get-user')
      setAlert(true)
      setAlertText(message)
      resetAlertState(2000)
    }
  }
  // handle checked changes in admin page
  const handleCheckedChanges = (e) => {
    const { id, checked } = e.target
    setAdminCheckData((prevState) => {
      // create copy of data
      const updatedData = {
        ...prevState,
        [id]: checked,
      }
      const anyTrue = Object.values(updatedData).some((value) => value === true)
      //  any values are true
      // when we click on the check boxes then set all checkbox to false
      setCheckAll(anyTrue === true && false) // onchange check if any are true and turn false
      // onchange check if any are tru and turn off
      console.log(anyTrue)

      return updatedData
    })
  }
  const handleUpdateClaims = async (e) => {
    setButtonLoader(true)
    setbtnLoaderName('update-claims')
    e.preventDefault()
    try {
      const data = { ...adminCheckData }
      const functions = getFunctions()
      const updateUserClaims = httpsCallable(functions, 'updateUserClaims')
      const res = await updateUserClaims({
        uid: userUid,
        admin: data.admin,
        premium: data.premium,
        manager: data.manager,
        sales: data.sales,
      })

      setAlertType('update-claims')
      setAlert(true)
      setAlertSuccess(true)
      setAlertText('success user updated')
      resetAlertState(2000)
      resetCheckBoxes()
      setUserEmail('')
      setCheckAll(false)
      setDisabled(true)
      setButtonLoader(false)
      console.log(res)
    } catch (error) {
      // Getting the Error details.
      const code = error.code
      const message = error.message
      const details = error.details

      setAlertType('update-claims')
      setAlert(true)
      setAlertText(message)
      resetAlertState(2000)
      setButtonLoader(false)
    }
  }

  // The reason you're seeing data: null in your console log is likely because the data object returned by setCustomUserClaims might not contain all the custom claims due to Firebase security configurations.

  // ** CHECK OBJ SOME AND SET CHECK ALL TO FALSE ***
  const handleSetAll = () => {
    console.log('object')
    setAdminCheckData((prevState) => ({
      ...prevState,
      admin: true,
      premium: true,
      manager: true,
      sales: true,
    }))
    setCheckAll(true)
  }

  function resetAlertState(time) {
    setTimeout(() => {
      setAlert(false)
      setAlertText('')
      setAlertType('')
    }, time)
  }

  function resetCheckBoxes() {
    setAdminCheckData((prevState) => ({
      // ** for UI VISUAL Purpouses only  **
      ...prevState,
      admin: false,
      premium: false,
      manager: false,
      sales: false,
    }))
  }
  // console.log(claims && claims.manager)

  // function checkCheckedValues() {
  //   const any = Object.values(adminCheckData).some((v) => v === true)
  //   console.log(any)
  //   return any
  // }

  // if (claims && claims.manager === false) {
  //   return <h4>not allowed</h4>
  // }
  return (
    <div className='page-container'>
      <PageHeader text={`Admin Dashboard - Manage Users`} />
      <section className='admin-manage-section'>
        <div className='admin-col'>
          <SectionHeader text={`create new user`} />
          <CreateNewUser />
          <UpdateUserProfilePicture />
        </div>
        <div className='admin-col'>
          <SectionHeader text={`manage user access status`} />
          <form onSubmit={handleGetUser}>
            {alert && alertType === 'get-user' && (
              <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />
            )}
            <div className='admin-form-group'>
              <input
                onChange={(e) => setUserEmail(e.target.value)}
                className='admin-input'
                type='text'
                placeholder='enter email'
                value={userEmail}
              />
            </div>

            <div className='admin-btn-container'>
              <button className='admin-submit-btn'>
                {buttonLoader && btnLoaderName === 'get-user'
                  ? 'getting user...'
                  : 'get user'}
              </button>
            </div>
          </form>
          {/* === */}
          <form onSubmit={handleUpdateClaims} className='claims-form-admin'>
            {alert && alertType === 'update-claims' && (
              <AdminAlert alertText={alertText} alertSuccess={alertSuccess} />
            )}
            <div className='admin-form-group check-all-div'>
              {/* MAKE RADIO BUTTONS */}
              {/* MAKE RADIO BUTTONS */}
              {/* MAKE RADIO BUTTONS */}
              {/* MAKE RADIO BUTTONS */}
              <label htmlFor='check all' className='admin-check-label'>
                <input
                  onChange={handleSetAll}
                  className='admin-checkbox'
                  id='check all'
                  type='checkbox'
                  name='check all'
                  checked={checkAll}
                />
                <span>check all</span>
              </label>
            </div>
            <div className='admin-form-group'>
              <label htmlFor='admin' className='admin-check-label'>
                <input
                  className='admin-checkbox'
                  id='admin'
                  type='checkbox'
                  name='admin'
                  onChange={handleCheckedChanges}
                  value={admin}
                  checked={admin}
                />
                <span>admin</span>
              </label>
            </div>

            <div className='admin-form-group'>
              <label htmlFor='manager' className='admin-check-label'>
                <input
                  className='admin-checkbox'
                  id='manager'
                  type='checkbox'
                  name='manager'
                  onChange={handleCheckedChanges}
                  value={manager}
                  checked={manager}
                />
                <span>manager</span>
              </label>
            </div>

            <div className='admin-form-group'>
              <label htmlFor='premium' className='admin-check-label'>
                <input
                  className='admin-checkbox'
                  id='premium'
                  type='checkbox'
                  name='premium'
                  onChange={handleCheckedChanges}
                  value={premium}
                  checked={premium}
                />
                <span>premium</span>
              </label>
            </div>

            <div className='admin-form-group'>
              <label htmlFor='sales' className='admin-check-label'>
                <input
                  className='admin-checkbox'
                  id='sales'
                  type='checkbox'
                  name='sales'
                  onChange={handleCheckedChanges}
                  value={sales}
                  checked={sales}
                />
                <span>sales</span>
              </label>
            </div>
            <div className='admin-btn-container'>
              <button
                disabled={disabled}
                // onClick={handleUpdateClaims}
                className='admin-submit-btn'
              >
                {buttonLoader && btnLoaderName === 'update-claims'
                  ? 'updating user...'
                  : 'update claims'}
              </button>
            </div>
          </form>

          <SectionHeader text={`change user password`} />

          <ChangeUserPassword />
        </div>
        <div className='admin-col'>
          <SectionHeader text={`delete user`} />

          <DeleteUser />

          <SectionHeader text={`update user`} />
          <UpdatUserProfile />
        </div>
        <div className='admin-col'>
          <div className='users-container'>
            <ViewAllUsers />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminManageUsers
