import React from 'react'

import { Request } from '../../utils'
import { AxiosError } from 'axios'
import { ResponseBoilerPlate } from '../../types'
import {
  AuthPage, AuthButton, usePasswordComponent, useInputComponent, InputComponent, PasswordComponent, 
} from '../../components/AuthPage'
import {
  passwordValidator, usernameValidator, 
} from '../../utils'

import "./Init.scss"
import { useRecoilState } from 'recoil'
import { initState } from '../../state'
import { useHistory } from 'react-router-dom'
import { WaitUntilReady } from '../../components/WaitUntilReady'

const Init: React.FC = () => {
  const history = useHistory()
  const [init, setInit] = useRecoilState(initState)

  // Username State
  const usernameState = useInputComponent()
  const [
    [username],
    [usernameError],
  ] = usernameState

  // Password State
  const passwordState = usePasswordComponent()
  const [
    [password],
    [passwordError],
  ] = passwordState

  // Password 2 State
  const password2State = usePasswordComponent()
  const [
    [password2],
  ] = password2State

  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)

  function disable(): boolean {
    if (
      usernameError
      || passwordError
      || password !== password2
      || !username.length
      || !password.length
    ) return true

    return false
  }

  function createAccount() {
    if (busy) return
    setBusy(true)

    if (disable()) return setBusy(false)

    Request.post('/auth/init', {
      username,
      password,
    })
      .then(() => {
        setInit(false)
        history.push('/auth')
      })
      .catch((err: AxiosError<ResponseBoilerPlate<{ notice?: string }>>) => {
        if (err.response?.data?.data?.notice)
          setError(err.response.data.data.notice)
        else
          setError(`Server error occurred`)

        setBusy(false)
      })

  }

  return (
    <WaitUntilReady
      beforeRender={() => {
        console.log(init)
        if (!init) return '/auth'
      }}
    >
      <AuthPage
        className='Init'
        title={(<>Setup root user account</>)}
        description={(<>First time setup, you need to create a root account.</>)}
        error={error}
      >
        <InputComponent
          state={usernameState}
          disable={busy}
          placeholder='Enter a username'
          autofill="username"
          validator={usernameValidator}
          onSubmit={createAccount}
        >Username</InputComponent>
        <PasswordComponent
          state={passwordState}
          disable={busy}
          placeholder='Enter a password'
          autofill="new-password"
          validator={passwordValidator}
          onSubmit={createAccount}
        >Password</PasswordComponent>
        <PasswordComponent
          state={password2State}
          disable={busy}
          placeholder='Enter password again'
          autofill="current-password"
          validator={(value) => {
            if (value !== password) return 'Passwords do not match'

            return undefined
          }}
          onSubmit={createAccount}
        >Re-enter Password</PasswordComponent>
        <AuthButton busy={busy} disable={disable()} onInteract={createAccount}>Create Account</AuthButton>
      </AuthPage>
    </WaitUntilReady>
  )
}

export default Init
