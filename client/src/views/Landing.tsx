import React from 'react'
import { useHistory } from 'react-router-dom'
import RTE from 'react-typing-effect'
import { useRecoilValue } from 'recoil'
import {
  initState, readyState, userState, 
} from '../state'

import "./Landing.scss"

const Landing: React.FC = () => {
  const ready = useRecoilValue(readyState)
  const init = useRecoilValue(initState)
  const user = useRecoilValue(userState)
  const history = useHistory()

  return (
    <div id='Landing'>
      <div className="container">
        <div className="loginsection">
          <div className="button" onClick={(e) => {
            e.preventDefault()
            if (!ready) return
            if (user) return history.push('/dashboard')
            else if (init) return history.push('/init')
            else return history.push('/auth')
          }}>
            <p>Creator Dashboard</p>
          </div>
        </div>
        <header>
          <TextTyper />
          <h5>shorten and customize your urls</h5>
        </header>
        <div className="banner">
          <h3>When the url is so fucking long the auto mod bot mutes you for raid spam in a Discord guild... <img src="/despair_emoji.webp"/></h3>
        </div>
        <DiscordWindow>
          <Message 
            className='msg_link' 
            name="You" 
            icon='https://cdn.discordapp.com/embed/avatars/5.png'
            message='http://www.reallylong.link/rll/n7VSK9kJcZigOTWCUNHDvvIuTsdJYzqfpNMfZlkCAsCfctTC59NJHZc_jnBNQCIWoLAh1v0CRYYYCcD7IbmV7UppQvjMxWXRWHwXacw/e14GmqGrFU_Zst26kAefJ/gxBjIvPuiUxygr1yv6vEpFeBK4KyKaOZy3tqeAaRrSNoLpl6dfNQcbNSaD8rA/Bs9D4v31KqlVEChGQlP5iyAzl7sVSriYjVkHDqPEF4RsQKsBLypAeICZip2wPLig0s90f/5PgqsIUkOI9zpKxJB6xedyu/yt8sIXmjJuzIzYcJk3iER5YW/j/dOIoXTAG/zH8fq2N_hP1xy1s7aLPy1VRDRA3rDsku5N5hGbH76WfyPBCJlVgEPVP_TWxHQlp7pbCTyfdj_8XledVOY79q/ErArzuyLOacLRpLWGO8bsHI77IVib/02kKiEvMgA08TrubesAO6aDeX9A/pW60ZD0ffy/zy_SBFm0rDc01eg5lFMOpN/src_V85zJv9GVl7T_ajkz6qqOMSkO5kXwFkgK98dmmNhKtlIiABYfXppsNgGIuEvhxU4CJfeZo4sSIRHOKX_uBBnT7RUcVJZo5MGmFW4BmmoSht58UyFVpduCtPXL5Ug/7FMfUT4VgjEaxOlllDyrm6/1dcJse80AmjnC1weovED1qsz20j2HUYt1D9fNgbhfwHuaTOG8Z7iuRyPejCHguHpcMnX52YRNHYfSElByBgnhSo4DC8Yx3NuoVUz_dftdIGo5eQuMss4wtkhI/'
          />
          <Message 
            // className='' 
            name="AutoMod" 
            icon='https://cdn.discordapp.com/embed/avatars/0.png'
            message='You are muted spammer!!!'
            bot={true}
          />
        </DiscordWindow>
        <div className="banner">
          <h3>Shorten your urls so they look better and can fit in places that they normally wouldn't... <img src="/happy_pepe.webp"/></h3>
        </div>
        <DiscordWindow>
          <Message 
            className='msg_link' 
            name="You" 
            icon='https://cdn.discordapp.com/embed/avatars/5.png'
            message='https://r.nobu.sh/song_of_week'
          />
          <Message 
            // className='' 
            name="AutoMod" 
            icon='https://cdn.discordapp.com/embed/avatars/0.png'
            message={'OMG you use Nobu\'s shortener!! I simp 😳😳😳'}
            bot={true}
          />
        </DiscordWindow>
      </div>
    </div>
  )
}

interface MProps {
  name: string
  icon: string
  message: string
  bot?: boolean
  className?: string
}
const Message: React.FC<MProps> = ({
  name, icon, message, className, bot,
}) => (
  <div className="message">
    <div className="pfp">
      <img src={icon}/>
    </div>
    <div className="msg">
      <div className="name">
        <p className='n'>{name}</p>
        {
          bot ? <div className="bot"><p>BOT</p></div> : ''
        }
        <p className='d'>Today at {new Date().getHours()}:{new Date().getMinutes()}</p>
      </div>
      <p className={`m ${className ?? ''}`}>{message}</p>
    </div>
  </div>
)

const DiscordWindow: React.FC<{ className?: string }> = ({ children, className }) => (
  <div className={`discord ${className ?? ''}`}>
    <div className="type">
      <div className="file">
        <p>+</p>
      </div>
      <div className="enter">
        <p>enter</p>
      </div>
    </div>
    <div className="messagearea">
      {children}
    </div>
  </div>
)

const TextTyper: React.FC = () => (
  <RTE
    staticText='no'
    className='TyperRoot'
    text={["very-long-url.com", "テクノロジー.みんな", "kaufen.immobilien", "大的.移动", "/path/to/something", "بارد.شبكة"]}
    speed={80}
    eraseSpeed={100}
    typingDelay={1000}
    eraseDelay={3000}
    displayTextRenderer={(text) => {
      return (
        <h1>
          <span>{text}</span>
        </h1>
      )
    }}
  >
  </RTE>
)

export default Landing
