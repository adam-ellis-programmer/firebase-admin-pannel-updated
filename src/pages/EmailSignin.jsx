import React from 'react'
import NewSignUpPublic from '../components/forms/NewSignUpPublic'
import EmailSignInFrom from '../components/forms/EmailSignInFrom'
const EmailSignin = () => {
  return (
    <div>
      <section className="page-header">
        {/* <h3>signin with email and password</h3> */}
      </section>
      <section className="sign-up-in-section">
        <div className="page-form-container">
          <EmailSignInFrom />
        </div>
      </section>

      {/* <section>sign in to use our servives ....</section> */}
    </div>
  )
}

export default EmailSignin
