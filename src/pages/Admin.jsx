import React from 'react'
import PageHeader from '../layout/PageHeader'
import { useNavigate } from 'react-router-dom'
import { MdAdminPanelSettings } from 'react-icons/md'

const Admin = () => {
  const navigate = useNavigate()
  return (
    <div>
      <PageHeader text={`admin page`} />

      <section className='admin-dash'>
        <div
          onClick={() => navigate('/admin-manage-users')}
          className='admin-box'
        >
          <div>
            <MdAdminPanelSettings className='admin-icon' />
          </div>
          <h3>manage users</h3>
        </div>
      </section>
    </div>
  )
}

export default Admin
