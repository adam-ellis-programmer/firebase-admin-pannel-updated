import React from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const TestUserSignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleClick = async () => {
    try {
      setLoading(true)
      const auth = getAuth()
      const user = await signInWithEmailAndPassword(
        auth,
        'mac-test@gmail.com',
        '111111'
      )
      navigate('/')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className='test-btn-wrap'>
      <button type='button' className='test-btn' onClick={handleClick}>
        {loading ? (
          <div className='test-btn-inner-wrap'>
            <p> checking </p>
            <div className='loader'></div>
          </div>
        ) : (
          'Test Drive App'
        )}
      </button>
    </div>
  )
}

export default TestUserSignIn
