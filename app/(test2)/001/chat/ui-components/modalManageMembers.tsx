import Image from 'next/image'
import { useState } from 'react'
import { roboto } from '@/app/fonts'
import Avatar from './avatar'
import ManagedMember from './managedMember'
import {
  ChatEventTypes
} from '@/app/types'

export default function ModalManageMembers ({
  activeChannelUsers,
  currentUserId,
  activeChannel,
  saveAction,
  manageMembersModalVisible,
  setManageMembersModalVisible,
  sendChatEvent
}) {
  return (
    <div
      className={`${
        !manageMembersModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
      {/* Example Modal */}
      <div className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl bg-white border border-neutral-300'>
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              setManageMembersModalVisible(false)
            }}
          >
            <Image
              src='/icons/close.svg'
              alt='Close'
              className='m-3'
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
        <div className='flex flex-col px-12 pb-12 gap-3'>
          <div className='flex font-semibold text-lg justify-center text-neutral-900 mb-2'>
            View Members ({activeChannelUsers?.length})
          </div>
          <div className='flex font-normal text-base justify-center text-neutral-600'>
            A membership associates a user with a specific channel and is
            created / destroyed when a user joins or leaves a channel
            respectively.
          </div>

          <div className='flex flex-col my-2 max-h-[40vh] overflow-y-auto overscroll-none'>
            {activeChannelUsers?.map((user, index) => {
              return (
                <ManagedMember
                  key={index}
                  user={user}
                  name={`${user.name}`}
                  lastElement={index == activeChannelUsers?.length - 1}
                />
              )
            })}

          </div>
          <div className='flex flex-row justify-end'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-neutral-50 font-normal text-base w-1/3 h-12 cursor-pointer shadow-sm rounded-lg bg-navy900`}
              onClick={e => saveAction()}
            >
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
