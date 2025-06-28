import Image from 'next/image'
import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { useState, useEffect } from 'react'
import { ToastType } from '@/app/types'
import { actionCompleted } from 'pubnub-demo-integration'

export default function ProfileScreen ({
  profileScreenVisible,
  setProfileScreenVisible,
  name,
  profileUrl,
  logout,
  changeName,
  showUserMessage,
  changeUserNameScreenVisible
}) {
  useEffect(() => {
    if (!profileScreenVisible) return
    actionCompleted({
      action: 'Open your Profile Settings',
      blockDuplicateCalls: false,
      debug: false
    })
  }, [profileScreenVisible])

  return (
    <div
      className={`${
        !profileScreenVisible && 'hidden'
      } flex flex-col h-full p-3 rounded-l-lg bg-sky-950 select-none fixed right-0 w-96 z-20`}
    >
      <div
        className={`${roboto.className} ${
          changeUserNameScreenVisible && 'opacity-40'
        } text-sm font-medium flex flex-row text-white py-3 items-center`}
      >
        <div
          className='flex cursor-pointer'
          onClick={e => setProfileScreenVisible(false)}
        >
          <Image
            src='/icons/close-rooms.svg'
            alt='Close Rooms'
            className='p-3'
            width={36}
            height={36}
            priority
          />
        </div>
        Profile
      </div>

      <div
        className={`flex flex-col ${
          changeUserNameScreenVisible && 'opacity-40'
        }`}
      >
        <div
          className={`${roboto.className} text-sm font-medium flex flex flex-row text-white p-3 justify-between items-center`}
        >
          Settings
        </div>

        <div className='flex justify-center pb-6'>
          <Avatar
            avatarUrl={profileUrl}
            width={88}
            height={88}
            editIcon={true}
            editActionHandler={() => {
              showUserMessage(
                'Demo Limitation',
                'Though supported by the Chat SDK, this demo does not support changing your user avatar, unless you use the "User Management" feature of BizOps Workspace',
                'https://www.pubnub.com/docs/bizops-workspace/user-management',
                ToastType.INFO
              )
            }}
          />
        </div>
        <div className='flex flex-row justify-between items-center py-4 px-4'>
          <div className='flex flex-col'>
            <div className='text-lg text-white'>Name</div>
            <div className='text-lg text-white font-semibold'>{name}</div>
          </div>
          <div
            className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
            onClick={e => changeName()}
          >
            Change
          </div>
        </div>

        <div className='border border-navy600'></div>

        <div className='flex flex-row py-6 px-4'>
          <div className='flex flex-col'>
            <div className='text-lg text-white pb-2'>Notifications</div>
            <div className='text-base text-white'>
              Get notified about new messages and mentions from chats
            </div>
          </div>
          <div
            className='h-6 relative inline-block'
            onClick={() =>
              showUserMessage(
                'Demo Limitation:',
                'Although not supported by this demo, you use the Chat SDK to alert your users with built-in or custom events',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events',
                ToastType.INFO
              )
            }
          >
            {/* Checkbox is currently disabled with no handlers */}
            <input type='checkbox' className="checked:before:bg-neutral-400 checked:after:translate-x-0" defaultChecked={false} onChange={e => {}} />
          </div>
        </div>
        <div className='border border-navy600'></div>

        <div className='flex flex-row py-6 px-4'>
          <div className='flex flex-col'>
            <div className='text-lg text-white pb-2'>Read receipts</div>
            <div className='text-base text-white'>
              Receive receipts when messages are sent and read
            </div>
          </div>
          <div
            className='h-6 relative inline-block'
            onClick={() =>
              showUserMessage(
                'Demo Limitation:',
                'Though supported by the Chat SDK, this demo does not support disabling read receipts',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/read-receipts',
                ToastType.INFO
              )
            }
          >
            {/* Checkbox is currently disabled with no handlers */}
            <input
              type='checkbox'
              className='before:bg-sky-600 after:translate-x-4'
              onChange={() => {}}
            />
          </div>
        </div>

        <div className='border border-navy600'></div>

        <div
          className={`${roboto.className} flex flex-row justify-center items-center my-6 text-white font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer border border-[#938F99] rounded-lg bg-sky-950`}
          onClick={e => logout()}
        >
          <Image
            src='/icons/logout.svg'
            alt='Logout'
            className='p-3'
            width={36}
            height={36}
            priority
          />
          Log out
        </div>
      </div>
    </div>
  )
}
