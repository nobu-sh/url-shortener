import React, { useEffect } from 'react'
import Router from '../router'
import {
  useRecoilState, 
} from 'recoil'
import {
  initState, inviteState, readyState, getStoredToken, deleteStoredToken, userState, 
} from '../state'
import { Request } from '../utils'
import {
  AuthResponse, UserInfoResponse, 
} from '../types'
import { AxiosError } from 'axios'

// Global Stylesheet
import "scss/global.scss"

import "./App.scss"

export default function App() {
  fetchNeededData()

  return (
    <div id='App'>
      <Router />
    </div>
  )
}

const fetchNeededData = () => {
  const [, setInit] = useRecoilState(initState)
  const [, setInvite] = useRecoilState(inviteState)
  const [, setReady] = useRecoilState(readyState)
  const [, setUser] = useRecoilState(userState)

  useEffect(() => {
    (async () => {
      const { data: { data } } = await Request.get<AuthResponse>('/auth')
      setInit(data.setup)
      setInvite(data.inviteOnly)

      if (!getStoredToken()) return setReady(true)

      Request.get<UserInfoResponse>('/auth/userinfo')
        .then(({ data: { data } }) => {
          setUser({
            ...data,
            accessToken: getStoredToken(),
          })
          setReady(true)
        })
        .catch((error: AxiosError) => {
          if (error.response?.status && error.response.status !== 500)
            deleteStoredToken()

          setReady(true)
        })

    })().catch(console.error)
  }, [])
}
