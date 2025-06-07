import { useState, useEffect } from 'react'
import SectionHeader from '../../layout/SectionHeader'
import AdminUserCard from '../AdminUserCard'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { db } from '../../firebase.config'
import UserLoader from '../../layout/loaders/UserLoader'

/**
 * **** leave for reference ******* 
 * const UserLoader = () => {
  const skeletons = [];

  for (let i = 0; i < 5; i++) {
    skeletons.push(
      <div key={i} className="user-card skeleton">
        return <>{skeletons}</>;
 */

const ViewAllUsers = () => {
  const [regUsers, setRegUsers] = useState(null)
  useEffect(() => {
    const functions = getFunctions()
    const getAllUsers = httpsCallable(functions, 'getAllUsers')
    getAllUsers().then((result) => {
      // Read result of the Cloud Function.
      const data = result.data.users
      setRegUsers(data)
    })
  }, [regUsers])

  if (!regUsers) {
    return <UserLoader />
  }
  return (
    <div className="view-users-div">
      <div className="view-users-count">{regUsers.length}</div>
      <SectionHeader text={`view all users`} />
      {regUsers && regUsers.map((user) => <AdminUserCard key={user.uid} user={user} />)}
    </div>
  )
}

export default ViewAllUsers
