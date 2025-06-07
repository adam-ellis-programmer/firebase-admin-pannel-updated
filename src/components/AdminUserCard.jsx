import React from 'react'

const AdminUserCard = ({ user }) => {
  const { displayName, email, disabled, customClaims, metadata } = user

  // console.log(customClaims && customClaims.auth.admin)

  return (
    <div className="user-card">
      <div>
        <img className="profile-pic " src={user.photoURL} alt="" />
      </div>
      <div className="small-text-div">
        <p className="small-card-p">{displayName}</p>
        <p className="small-card-p">{email}</p>
        <p className="small-card-p">{disabled ? 'disabled' : 'not disabled'}</p>
        {/* <p>signed up on {metadata.creationTime}</p> */}
        {/* <p>lastSignInTime {metadata.lastSignInTime}</p> */}
      </div>
    </div>
  )
}

export default AdminUserCard
