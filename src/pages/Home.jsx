import React from 'react'
import PageHeader from '../layout/PageHeader'
import img from '../imgs/firebase logo-1.png'
import useCheckLogin from '../hooks/useCheckLogin'
const Home = () => {
  const { loggedIn, user } = useCheckLogin()
  // console.log(loggedIn)
  return (
    <section>
      <div className="home-page-header-div">
        <PageHeader text={`welcome to firebase admin SDK app`} />
      </div>

      <div className="home-image-container">
        <img src={img} alt="" className="home-logo-img" />
      </div>

      <div className="user-info-div">
        <p className="user-info-home-p">
          {loggedIn && (
            <>
              Welcome <span>{user?.displayName}</span>, you are now logged in.
            </>
          )}
        </p>
      </div>
    </section>
  )
}

export default Home
