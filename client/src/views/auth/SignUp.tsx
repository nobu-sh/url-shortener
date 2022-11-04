import { AxiosError } from 'axios'
import React from 'react'
import {
  Link, useHistory, 
} from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import {
  AuthButton,
  AuthPage, InputComponent, PasswordComponent, useInputComponent, usePasswordComponent, 
} from '../../components/AuthPage'
import { WaitUntilReady } from '../../components/WaitUntilReady'
import {
  initState, inviteState, userState, 
} from '../../state'
import { ResponseBoilerPlate } from '../../types'
import {
  passwordValidator, Request, usernameValidator, 
} from '../../utils'

import './SignUp.scss'

export const SignUp: React.FC = () => {
  const inviteOnly = useRecoilValue(inviteState)
  const user = useRecoilValue(userState)
  const init = useRecoilValue(initState)
  const history = useHistory()

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

  // Invite key state
  const inviteKeyState = usePasswordComponent()
  const [
    [invite],
    [inviteError],
  ] = inviteKeyState

  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)

  function disable() {
    // Ensure disable if incorrect invite stuffs
    if (inviteOnly && !invite.length || inviteError) return true

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

    const body = inviteOnly 
      ? {
        username,
        password,
        key: invite,
      } 
      : {
        username,
        password,
      }

    Request.post('/auth/signup', body)
      .then(() => {
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
        if (init) return '/init'
        if (user) return '/dashboard'
      }}
    >
      <AuthPage
        className='SignUp'
        title={<>Create a new account</>}
        description={<>First time here? No problem, create a new<br />account below!</>}
        error={error}
      >
        <InputComponent
          state={usernameState}
          disable={busy}
          placeholder='Enter a username'
          validator={usernameValidator}
          autofill="username"
          onSubmit={createAccount}
        >Username</InputComponent>
        <PasswordComponent
          state={passwordState}
          disable={busy}
          placeholder='Enter a password'
          validator={passwordValidator}
          autofill="new-password"
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
        {
          inviteOnly
            ? <PasswordComponent
              state={inviteKeyState}
              disable={busy}
              placeholder='00000000-0000-0000-0000-000000000000'
              max={36}
              autofill="off"
              validator={(value) => {
                if (!value.length) return 'Invite key required'
                if (!/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value))
                  return 'Invalid key format'

                return undefined
              }}
              onSubmit={createAccount}
            >Invite Key</PasswordComponent>
            : ''
        }
        <div className="LoginOrSignUp">
          <AuthButton busy={busy} disable={disable()} onInteract={createAccount}>Create Account</AuthButton>
          <p className='SignUp'>or <Link to="/auth">Sign In</Link></p>
        </div>
      </AuthPage>
    </WaitUntilReady>
  )
}

export default SignUp
