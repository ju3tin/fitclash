import Avatar from './avatar'
import Image from 'next/image'
import { roboto } from '@/app/fonts'

export default function MentionSuggestions ({
  suggestedUsers,
  suggestedChannels,
  pickSuggestedUser,
  pickSuggestedChannel
}) {
  return (
    <div className='flex w-full px-7 flex-row bg-white'>
      {suggestedUsers.map((user, index) => {
        return (
          <div
            key={index}
            className={`${roboto.className} flex text-sm m-1 rounded-lg border px-2 py-1 line-clamp-1 text-nowrap cursor-pointer border-neutral-300 bg-neutral-50 text-neutral-900`}
            onClick={() => {
              pickSuggestedUser(user)
            }}
          >
            {user.name}
          </div>
        )
      })}
      {suggestedChannels.map((channel, index) => {
        return (
          <div
            key={index}
            className={`${roboto.className} flex text-sm m-1 rounded-lg border px-2 py-1 line-clamp-1 text-nowrap cursor-pointer border-neutral-300 bg-neutral-50 text-neutral-900`}
            onClick={() => {
              pickSuggestedChannel(channel)
            }}
          >
            {channel.name}
          </div>
        )
      })}
    </div>
  )
}
