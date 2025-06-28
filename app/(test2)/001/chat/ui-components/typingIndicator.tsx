import Avatar from './avatar'
import { PresenceIcon } from '@/app/types'

export default function TypingIndicator ({ typers, users }) {
  return (
    users &&
    typers && (
      <div className='absolute items-center w-full bg-white h-12 max-h-12 bottom-[114px]'>
        <div className='flex flex-row items-center ml-7 mr-24 m-3 gap-3 text-base font-normal text-neutral-500'>
          <div className='flex flex-row -space-x-2.5'>
            {typers.map((typer, index) => (
              <Avatar
                key={index}
                present={
                  users[users.findIndex(user => user.id == typer)]?.active
                    ? PresenceIcon.ONLINE
                    : PresenceIcon.OFFLINE
                }
                border={true}
                avatarUrl={
                  users[users.findIndex(user => user.id == typer)]?.profileUrl
                }
              />
            ))}
          </div>

          <div className='line-clamp-1 flex flex-row w-full gap-1'>
            {typers.map((typer, index) => (
              <div className='' key={index}>
                {users[users.findIndex(user => user.id == typer)]?.name}
                {index < typers.length - 1 ? ', ' : ''}
              </div>
            ))}
            {typers.length == 0
              ? ''
              : typers.length == 1
              ? ' is typing...'
              : ' are typing...'}
          </div>
        </div>
      </div>
    )
  )
}
