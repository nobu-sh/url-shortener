import React from 'react'
import { useHistory } from 'react-router-dom'

import './404.scss'

const FourOFour: React.FC = () => {
  const his = useHistory()

  return (
    <div className="FourOFour">
      <h1 className='Large'>404</h1>
      <p>The item you're looking for could<br />not be located! <span className='back' onClick={his.goBack}>go back.</span></p>
    </div>
  )
}

export default FourOFour
