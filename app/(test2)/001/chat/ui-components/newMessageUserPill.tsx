import Avatar from './avatar'
import Image from 'next/image'
import { roboto } from '@/app/fonts'

export default function NewMessageUserPill ({
  user,
  removePillAction,
  isMe = false
}) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base m-1 rounded-lg border px-2 py-1 border-neutral-300 bg-neutral-50 text-neutral-900`}
    >
      <div className=''>{user.name}</div>
      {!isMe && (
        <div
          className='cursor-pointer'
          onClick={() => removePillAction(user.id)}
        >
          <Image
            src='/icons/close.svg'
            alt='Remove'
            className='ml-2'
            width={24}
            height={24}
            priority
          />
        </div>
      )}
    </div>
  )
}
