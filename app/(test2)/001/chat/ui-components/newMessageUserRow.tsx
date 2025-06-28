import Avatar from './avatar'
import Image from 'next/image'
import { roboto } from '@/app/fonts'
import { User } from '@pubnub/chat'

export default function NewMessageUserRow ({ user, present, clickAction }) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base mx-4 my-2 gap-2 w-full items-center text-neutral-900 cursor-pointer`}
      onClick={() => clickAction(user)}
    >
      <Avatar
        present={present}
        avatarUrl={
          user.profileUrl ? user.profileUrl : '/avatars/placeholder.png'
        }
      />
      <div className=''>{user.name}</div>
    </div>
  )
}
