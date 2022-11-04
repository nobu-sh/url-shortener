import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { WaitUntilReady } from '../components/WaitUntilReady'
import {
  readyState, userState, 
} from '../state'

import './Dashboard.scss'

const Dashboard: React.FC = () => {
  const user = useRecoilValue(userState)

  return (
    <WaitUntilReady
      className='Dashboard'
      beforeRender={() => {
        if (!user) return '/auth'
      }}
    >
      <div className="Clamp">
        <Nav />
        <input type="text" />
      </div>
    </WaitUntilReady>
  )
}

const Nav: React.FC = () => {
  const user = useRecoilValue(userState)

  return (
    <div className="Nav">
      <h5>Dashboard</h5>
      <div className="User">
        <p className="Name">{user.username}</p>
        <p className="Div">|</p>
        <p className={`Role ${user.role} Small`}>{user.role}</p>
      </div>
    </div>
  )
}

export default Dashboard
