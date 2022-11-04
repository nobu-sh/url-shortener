import React from 'react'
import {
  AuthPage,
  AuthButton,
  useCheckboxComponent,
  usePasswordComponent, useInputComponent, InputComponent, PasswordComponent, CheckboxComponent, 
} from '../../components/AuthPage'
import {
  passwordValidator, usernameValidator, 
} from '../../utils'

import {
  Link,
} from 'react-router-dom'
import {
  useRecoilState,
} from 'recoil'
import {
  setStoredToken, userState, 
} from '../../state'
import {
  Request,
} from '../../utils'
import {
  ResponseBoilerPlate, UserSignInResponse, 
} from '../../types'
import { AxiosError } from 'axios'

import "./Auth.scss"

const Auth: React.FC = () => {
  const [, setUser] = useRecoilState(userState)

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

  // Extended Login State
  const extendedState = useCheckboxComponent()
  const [
    [extended],
  ] = extendedState

  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)

  function disable(): boolean {
    if (
      usernameError
      || passwordError
      || !username.length
      || !password.length
    ) return true

    return false
  }

  function signIn() {
    if (busy) return
    setBusy(true)

    if (disable()) return setBusy(false)

    Request.post<UserSignInResponse>('/auth/signin', {
      username,
      password,
      extended,
    })
      .then(({ data: { data } }) => {
        setStoredToken(data.accessToken)
        setUser(data)
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
    <AuthPage
      className='Auth'
      title={(<>Log in to your account</>)}
      description={(<>Welcome back! Please enter your details<br />or create a new account.</>)}
      error={error}
    >
      <InputComponent
        state={usernameState}
        disable={busy}
        placeholder='Enter your username'
        validator={usernameValidator}
        autofill="username"
      >Username</InputComponent>
      <PasswordComponent
        state={passwordState}
        disable={busy}
        placeholder='Enter your password'
        validator={passwordValidator}
        autofill="current-password"
      >Password</PasswordComponent>
      <CheckboxComponent
        state={extendedState}
        disable={busy}
      >Extended Login <span>(30 Days)</span></CheckboxComponent>
      <div className="LoginOrSignUp">
        <AuthButton busy={busy} disable={disable()} onInteract={signIn}>Sign In</AuthButton>
        <p className='SignUp'>or <Link to="/auth/signup">Sign Up</Link></p>
      </div>
    </AuthPage>
  )
}

export default Auth
