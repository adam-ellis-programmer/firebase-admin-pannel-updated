import NewSignUpPublic from '../components/forms/NewSignUpPublic'
import PageHeader from '../layout/PageHeader'

const NewSignup = () => {
  return (
    <div>
      {/* <PageHeader text={`register to use our app`} /> */}
      <section className="sign-up-in-section">
        <div className="page-form-container">
          <NewSignUpPublic />
        </div>
      </section>
    </div>
  )
}

export default NewSignup
