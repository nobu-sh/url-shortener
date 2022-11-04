import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { readyState } from '../state'

interface WURP {
  className?: string
  beforeRender?: () => void | string
}
export const WaitUntilReady: React.FC<WURP> = ({ children, className, beforeRender }) => {
  const ready = useRecoilValue(readyState)
  const history = useHistory()
  
  // We want to useMemo otherwise beforeRender will be called everytime this component rerenders
  // which is often because this is a parent component. beforeRender should only be called once
  // when the app is ready
  const b = React.useMemo(() => {
    if (!ready) return

    return beforeRender ? beforeRender() : undefined
  }, [ready])

  // We need to useEffect to handle the redirect so it occurs after render
  React.useEffect(() => {
    if (!ready) return
    if (b) return history.push(b)
  }, [ready, b])

  // If b or not ready return loading
  if (!ready || b) return <div className="Loading"><h1>[TEMP] LOADING...</h1></div>

  // Otherwise return expected component
  return <div className={className}>{children}</div>
}
