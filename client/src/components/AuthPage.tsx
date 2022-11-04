import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import XCircle from '../assets/icons/XCircle'
import { WaitUntilReady } from './WaitUntilReady'
import {
  initState, readyState, userState, 
} from '../state'
import EyeOff from '../assets/icons/EyeOff'
import Eye from '../assets/icons/Eye'

import './AuthPage.scss'

interface AuthPageProps {
  className: string
  title: React.ReactNode
  description: React.ReactNode
  error?: string
}
export const AuthPage: React.FC<AuthPageProps> = ({
  className,
  title,
  description,
  children,
  error,
}) => {
  const history = useHistory()
  const init = useRecoilValue(initState)
  const user = useRecoilValue(userState)
  const ready = useRecoilValue(readyState)

  // We want to check these constantly on the auth pages to ensure we redirect when updated
  React.useEffect(() => {
    if (!ready) return
    if (init) return history.push('/init')
    if (user) return history.push('/dashboard')
    if (!history.location.pathname.toLowerCase().startsWith('/auth'))
      return history.push('/auth')
  }, [init, user, ready])

  return (
    <WaitUntilReady 
      className={`AuthPage ${className ?? ''}`}
      // We want to check these before render to avoid a "render flash"
      beforeRender={() => {
        if (init) return '/init'
        if (user) return '/dashboard'
        if (!history.location.pathname.toLowerCase().startsWith('/auth'))
          return '/auth'
      }}
    >
      <div className="ToHome" onClick={() => history.push('/')}>
        <XCircle />
      </div>
      <div className="AuthPanel">
        <div className="Logo">
          <img src="/favicon.png" />
          <h1>Link Shortener</h1>
        </div>
        <div className="Info">
          <h6>{title}</h6>
          <p>{description}</p>
        </div>
        <div className="FormBox">
          {children}
          {
            error ? <p className="gerror">⚠ {error}</p> : ''
          }
        </div>
      </div>
    </WaitUntilReady>
  )
}

/*
Username input for modal
*/

interface UseInputProps {
  className?: string
  disable?: boolean
  placeholder?: string
  disableError?: boolean
  autofill?: 'new-password' | 'current-password' | 'username' | 'on' | 'off'
  validator?: (i: string) => string | undefined
  state: UseInputTuple
  max?: number
}
export const InputComponent: React.FC<UseInputProps> = ({
  className,
  disable,
  state,
  placeholder,
  disableError,
  autofill,
  validator,
  children,
  max,
}) => {
  const [inputState, inputErrorState] = state
  const [input, setInput] = inputState
  const [inputError, setInputError] = inputErrorState

  return (
    <div className={`AuthPageInput ${className ?? ''}`}>
      <p>{children}</p>
      <input 
        type="text" 
        placeholder={placeholder}
        value={input}
        autoComplete={autofill}
        onChange={(e) => {
          if (validator) setInputError(validator(e.target.value))
          setInput(e.target.value)
        }}
        disabled={disable}
        maxLength={max}
      />
      {
        inputError && !disableError ? <p className="error">⚠ {inputError}</p> : ''
      }
    </div>
  )
}
type UseInputTuple = [
  [string, React.Dispatch<React.SetStateAction<string>>],
  [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]
]
export function useInputComponent(): UseInputTuple {
  const [input, setInput] = React.useState('')
  const [inputError, setInputError] = React.useState<string | undefined>(undefined)

  return [
    [input, setInput],
    [inputError, setInputError],
  ]
}

/*
Password input for modal
*/
interface UsePasswordProps {
  className?: string
  disable?: boolean
  disableError?: boolean
  placeholder?: string
  autofill?: 'new-password' | 'current-password' | 'username' | 'on' | 'off'
  validator?: (i: string) => string | undefined
  state: UsePasswordTuple
  max?: number
}
export const PasswordComponent: React.FC<UsePasswordProps> = ({
  className,
  disable,
  disableError,
  placeholder,
  autofill,
  validator,
  children,
  state,
  max,
}) => {
  const [passwordState, passwordErrorState] = state
  const [password, setPassword] = passwordState
  const [passwordError, setPasswordError] = passwordErrorState

  const [hide, setHide] = React.useState(true)

  return (
    <div className={`AuthPagePassword ${className ?? ''}`}>
      <p>{children}</p>
      <div className="RelativeZone">
        <input 
          type={hide ? 'password' : 'text'} 
          placeholder={placeholder} 
          value={password}
          autoComplete={autofill}
          onChange={(e) => {
            if (validator) setPasswordError(validator(e.target.value))
            setPassword(e.target.value)
          }}
          disabled={disable}
          maxLength={max}
        />
        <div className="Hide" onClick={() => setHide(!hide)}>
          {
            hide ? <EyeOff /> : <Eye />
          }
        </div>
      </div>
      {
        passwordError && !disableError ? <p className="error">⚠ {passwordError}</p> : ''
      }
    </div>
  )
}
type UsePasswordTuple = [
  [string, React.Dispatch<React.SetStateAction<string>>],
  [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]
]
export function usePasswordComponent(): UsePasswordTuple {
  const [password, setPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState<string | undefined>(undefined)

  return [
    [password, setPassword],
    [passwordError, setPasswordError],
  ]
}

/*
Checkbox component for modal
*/

interface UseCheckboxProps {
  className?: string
  disable?: boolean
  state: UseCheckboxTuple,
}
export const CheckboxComponent: React.FC<UseCheckboxProps> = ({
  className,
  disable,
  children,
  state,
}) => {
  const [checkState] = state
  const [check, setCheck] = checkState

  return (
    <div className={`AuthPageCheckbox ${className ?? ''}`}>
      <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} disabled={disable} />
      <p>{children}</p>
    </div>
  )
}
type UseCheckboxTuple = [
  [boolean, React.Dispatch<React.SetStateAction<boolean>>],
]
export function useCheckboxComponent(): UseCheckboxTuple {
  const [check, setCheck] = React.useState(false)

  return [
    [check, setCheck],
  ]
}

/*
Auth button to put at bottom of modal
*/

interface AuthButtonProps {
  className?: string
  busy?: boolean,
  disable?: boolean
  onInteract?: () => unknown
}
export const AuthButton: React.FC<AuthButtonProps> = ({
  className,
  busy,
  disable,
  onInteract,
  children,
}) => (
  <div
    className={`AuthPageButton ${
      className ?? ''
    } ${busy ? 'Busy' : ''} ${
      disable ? 'Disable' : ''
    }`}
    onClick={onInteract}
  >
    <p>{busy ? '◠' : children}</p>
  </div>
)
