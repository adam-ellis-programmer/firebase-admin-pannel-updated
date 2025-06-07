import React from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
const TestUserSignIn = () => {
  const navigate = useNavigate()
  const handleClick = async () => {
    try {
      const auth = getAuth()
      const user = await signInWithEmailAndPassword(
        auth,
        'mac-test@gmail.com',
        '111111'
      )
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='test-btn-wrap'>
      <button type='button' className='test-btn' onClick={handleClick}>
        Test Drive App
      </button>
    </div>
  )
}

export default TestUserSignIn
