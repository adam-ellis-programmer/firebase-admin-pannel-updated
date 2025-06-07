import React from 'react'

const AdminAlert = ({ alertText, alertSuccess }) => {
  // console.log('is success: ', alertSuccess)
  return (
    <div className={`admin-alert ${alertSuccess && 'admin-alert-success'}`}>
      <h3>{alertText}</h3>
    </div>
  )
}

export default AdminAlert
