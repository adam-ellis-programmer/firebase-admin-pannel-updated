import React from 'react'
import PageHeader from '../layout/PageHeader'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import SectionHeader from '../layout/SectionHeader'
import { FaBeer, FaBars, FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa'

const ProfilePage = () => {
  const [LoggedInUser, setLoggedInUser] = useState({})
  const [tokenRes, setTokenRes] = useState({})
  const { displayName, email, photoURL, phoneNumber, emailVerified } = LoggedInUser

  //  || {}
  const { claims } = tokenRes

  // console.log(claims && claims)
  // console.log(tokenRes)

  useEffect(() => {
    // getIdTokenResult === true instead of getIdTokenResult() rtns the same thing
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user)
        user.getIdTokenResult(true).then((data) => {
          setTokenRes(data)
        })
      } else {
        setLoggedInUser({})
        setTokenRes({})
      }
    })

    // user.getIdToken(true).then((token) => {
    //   user.getIdTokenResult().then((data) => setTokenRes(data))
    // })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  // console.log(photoURL && photoURL)

  // console.log(tokenRes)

  // prettier-ignore
  return (
    <div>
      <PageHeader text={`@me page`} />

      <div className="section-profile-grid">
        <div className="profile-box profile-top">
          <SectionHeader text={`user info`} />

          <div className="user-info-div">
            <img className="profile-page-img" src={photoURL} alt="" />
            <div className="user-stats-div">
              <p className="user-stats-p">name: </p>
              <p className="user-stats-p">{displayName}</p>
            </div>
            <div className="user-stats-div">
              <p className="user-stats-p">email: </p>
              <p className="user-stats-p">{email}</p>
            </div>

            <div className="user-stats-div">
              <p className="user-stats-p">phone: </p>{' '}
              <p className="user-stats-p">{phoneNumber && phoneNumber}</p>
            </div>

            <div className="user-stats-div">
              <p className="user-stats-p">verified: </p>{' '}
              <p className="user-stats-p">
                {emailVerified && emailVerified ? <FaCheckCircle className='user-chceck' /> : <FaRegTimesCircle className='user-cross' /> }
              </p>
            </div>

            <div className="user-stats-div">
              <p className="user-stats-p">reg date: </p>{' '}
              <p className="user-stats-p">
                {LoggedInUser && LoggedInUser.metadata?.creationTime.slice(4, 16)}
              </p>
            </div>
          </div>
        </div>
        <div className="profile-box">
          <SectionHeader text={`access privileges`} />
          <div className="user-stats-div">
            <p className="user-stats-p">admin: </p>{' '}
            <p className="user-stats-p">{claims && claims.auth?.admin ? <FaCheckCircle className='user-chceck' /> :  <FaRegTimesCircle className='user-cross' />    }</p>
          </div>
          <div className="user-stats-div">
            <p className="user-stats-p">premium: </p>{' '}
            <p className="user-stats-p">
              {claims && claims.auth?.premium ? <FaCheckCircle className='user-chceck' /> : <FaRegTimesCircle className='user-cross' />   }
            </p>
          </div>
          <div className="user-stats-div">
            <p className="user-stats-p">manager: </p>{' '}
            <p className="user-stats-p">
              {claims && claims.auth?.manager ? <FaCheckCircle className='user-chceck' /> : <FaRegTimesCircle className='user-cross' />   }
            </p>
          </div>
          <div className="user-stats-div">
            <p className="user-stats-p">sales: </p>{' '}
            <p className="user-stats-p">{claims && claims.auth?.sales ? <FaCheckCircle className='user-chceck' /> : <FaRegTimesCircle className='user-cross' />   }</p>
          </div>
        </div>
        <div className="profile-box">
          <SectionHeader text={`user stats`} />
          <div className="user-stats-div">
            <p className="user-stats-p">number Of orders:</p>
            <p className="user-stats-p">12</p>
          </div>

          <div className="user-stats-div">
            <p className="user-stats-p">amount spent:</p>
            <p className="user-stats-p">£4,998</p>
          </div>

          <div className="user-stats-div">
            <p className="user-stats-p">company:</p>
            <p className="user-stats-p">apple</p>
          </div>

          <div className="user-stats-div">
            <p className="user-stats-p">gold user:</p>
            <p className="user-stats-p"><FaCheckCircle className='user-chceck' /></p>
          </div>

          <div className="user-stats-div">
            <p className="user-stats-p">points</p>
            <p className="user-stats-p">1000</p>
          </div>
        </div>
        <div className="user-profile-btns-container">
          <button className="user-control-btn">delete profile</button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
