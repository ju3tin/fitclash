import Avatar from './avatar'
import Image from 'next/image'
import UnreadIndicator from './unreadIndicator'
import { useState } from 'react'
import ToolTip from './toolTip'

export default function ChatMenuItem ({
  avatarUrl,
  text,
  present,
  avatarBubblePrecedent = '',
  count = '',
  markAsRead = false,
  markAsReadAction = e => {},
  setActiveChannel = () => {}
}) {
  const [showToolTip, setShowToolTip] = useState(false)

  const handleMouseEnter = e => {
    setShowToolTip(true)
  }
  const handleMouseLeave = e => {
    setShowToolTip(false)
  }

  return (
    <div
      className='flex flex-col cursor-pointer'
      onClick={() => {
        setActiveChannel()
      }}
    >
      <div className='flex flex-row justify-between items-center w-full pl-4'>
        <div className='flex flex-row py-2 gap-3 h-12 text-sm items-center text-neutral900'>
          <Avatar
            present={present}
            bubblePrecedent={avatarBubblePrecedent}
            avatarUrl={avatarUrl}
          />
          {text}
        </div>
        <div className='flex flex-row items-center'>
          <UnreadIndicator count={count} />
          {markAsRead && (
            <div
              className={`cursor-pointer w-4 h-4 m-3 fill-current ${
                showToolTip ? 'text-sky-700' : 'text-sky-900'
              }`}
              onClick={e => markAsReadAction(e)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className='relative'>
                <ToolTip
                  className={`${
                    showToolTip ? 'block' : 'hidden'
                  }  bottom-[0px]`}
                  tip='Read'
                  messageActionsTip={false}
                />
              </div>
              <svg viewBox='0 0 18 14'>
                <path d='M5.79508 10.8749L1.62508 6.70492L0.205078 8.11492L5.79508 13.7049L17.7951 1.70492L16.3851 0.294922L5.79508 10.8749Z' />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
