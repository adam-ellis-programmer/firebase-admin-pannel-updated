import React from 'react'
import PageHeader from '../layout/PageHeader'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  return (
    <div>
      <PageHeader text={`admin page`} />

      <section className="admin-dash">
        <div onClick={() => navigate('/admin-manage-users')} className="admin-box">
          <h3>manage users</h3>
        </div>

        <div className="admin-box">
          <h3>blank box</h3>
        </div>

        <div className="admin-box">
          <h3>blank box</h3>
        </div>
      </section>
    </div>
  )
}

export default Admin
