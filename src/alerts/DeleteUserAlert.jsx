import React from 'react'


const DeleteUserAlert = ({ handleDelete, setShowConfirm, setEmail }) => {
  const handleBack = () => {
    setShowConfirm(false)
    setEmail('')
  }
  return (
    <div className="delete-user-alert">
      <h3>delete confirmation?</h3>
      <div className="delete-btns-container">
        <button onClick={handleBack} className="delete-user-btn">
          back
        </button>
        <button onClick={handleDelete} className="delete-user-btn">
          delete
        </button>
      </div>
    </div>
  )
}

export default DeleteUserAlert
