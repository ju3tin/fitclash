import Image from 'next/image'
import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { Membership, User } from '@pubnub/chat'
import { useState, useEffect } from 'react'
import { ToastType } from '@/app/types'
import { actionCompleted } from 'pubnub-demo-integration'

export default function ChatSettingsScreen ({
  chatSettingsScreenVisible,
  setChatSettingsScreenVisible,
  changeChatNameScreenVisible,
  manageMembersModalVisible,
  isDirectChat,
  activeChannel,
  activeChannelUsers,
  buttonAction,
  changeChatNameAction = () => {},
  manageMembershipsAction = () => {},
  showUserMessage
}) {
  const MAX_AVATARS_SHOWN = 13

  useEffect(() => {
    if (!chatSettingsScreenVisible) return
    actionCompleted({
      action: 'Open the Chat Settings',
      blockDuplicateCalls: false,
      debug: false
    })
  }, [chatSettingsScreenVisible])

  return (
    <div
      className={`${
        !chatSettingsScreenVisible && 'hidden'
      } flex flex-col h-full flex-wrap h-16 p-3 rounded-l-lg bg-sky-950 select-none fixed right-0 w-96 z-20`}
    >
      <div
        className={`${roboto.className} ${
          (changeChatNameScreenVisible || manageMembersModalVisible) &&
          'opacity-40'
        }  text-sm font-medium flex flex flex-row text-white py-3 items-center`}
      >
        <div
          className={`flex cursor-pointer`}
          onClick={e => setChatSettingsScreenVisible(false)}
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
        Chat settings
      </div>

      <div
        className={`${
          (changeChatNameScreenVisible || manageMembersModalVisible) &&
          'opacity-40'
        } `}
      >
        <div
          className={`${roboto.className} text-sm font-medium flex flex flex-row text-white p-4 justify-between items-center`}
        >
          Settings
        </div>

        <div className='flex flex-col'>
          {/* Avatar(s) */}
          <div className='flex justify-center pb-6'>
            <div className='flex flex-row -space-x-2.5'>
              {activeChannelUsers?.map(
                (member, index) =>
                  index < MAX_AVATARS_SHOWN && (
                    <Avatar
                      key={index}
                      avatarUrl={member.profileUrl}
                      width={88}
                      height={88}
                    />
                  )
              )}
            </div>
          </div>

          {/* Chat members for 1:1 chats, or Chat name for Group chats */}
          {isDirectChat ? (
            <div className='flex flex-row justify-between items-center py-4 px-4'>
              <div className='flex flex-col'>
                <div className='text-lg text-white'>Chat members</div>
                {activeChannelUsers?.map((member, index) => (
                  <div className='text-lg text-white font-semibold' key={index}>
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-row justify-between items-center py-4 px-4'>
              <div className='flex flex-col'>
                <div className='text-lg text-white font-normal'>Chat name</div>
                <div className='text-lg text-white font-semibold'>
                  {activeChannel?.name}
                </div>
              </div>
              <div
                className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
                onClick={e => changeChatNameAction()}
              >
                Change
              </div>
            </div>
          )}

          <div className='border border-navy600'></div>

          {!isDirectChat && (
            <div>
              {' '}
              <div className='flex flex-row justify-between items-center py-6 px-4'>
                <div className='text-lg text-white'>Members</div>
                <div
                  className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
                  onClick={e => manageMembershipsAction()}
                >
                  Manage
                </div>
              </div>
              <div className='border border-navy600'></div>
            </div>
          )}

          <div className='flex flex-row py-6 px-4'>
            <div className='flex flex-col'>
              <div className='text-lg text-white pb-2'>Mute chat</div>
              <div className='text-base text-white'>
                Get notified about new messages and mentions from chats
              </div>
            </div>
            <div
              className='h-6 relative inline-block'
              onClick={() => {
                showUserMessage(
                  'Demo Limitation:',
                  'Though supported by the Chat SDK, this demo does not yet support custom events or notifications',
                  'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events',
                  ToastType.INFO
                )
              }}
            >
              {/* Checkbox is currently disabled with no handlers */}
              <input
                type='checkbox'
                defaultChecked={false}
                className="checked:before:bg-neutral-400 checked:after:translate-x-0"
                onChange={e => {}}
              />
            </div>
          </div>
          <div className='border border-navy600'></div>

          {isDirectChat ? (
            <div
              className={`${roboto.className} flex flex-row justify-center my-6 items-center text-white font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer border border-[#938F99] rounded-lg bg-sky-950`}
              onClick={e => buttonAction()}
            >
              <Image
                src='/icons/logout.svg'
                alt='Leave Conversation'
                className='p-2'
                width={36}
                height={36}
                priority
              />
              Leave this 1:1 chat
            </div>
          ) : (
            activeChannel?.type !==
              'public' /* To simplify the logic of the demo, do not allow to leave from public channels */ && (
              <div
                className={`${roboto.className} flex flex-row justify-center my-6 items-center text-white font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer border border-[#938F99] rounded-lg bg-sky-950`}
                onClick={e => buttonAction()}
              >
                <Image
                  src='/icons/logout.svg'
                  alt='Logout'
                  className='p-3'
                  width={36}
                  height={36}
                  priority
                />
                Leave conversation
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
