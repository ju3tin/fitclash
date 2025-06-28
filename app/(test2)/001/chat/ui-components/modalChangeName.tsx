import Image from 'next/image'
import { useState, useEffect } from 'react'
import { roboto } from '@/app/fonts'
import { ChatNameModals, ToastType } from '@/app/types'

export default function ModalChangeName ({
  name,
  activeChannel,
  modalType,
  saveAction,
  showUserMessage,
  changeNameModalVisible,
  setChangeNameModalVisible
}) {
  const [newChatName, setNewChatName] = useState('')

  useEffect(() => {
    if (!activeChannel || modalType == ChatNameModals.USER) return
    setNewChatName(activeChannel.name)
  }, [activeChannel, modalType])

  useEffect(() => {
    if (!name || modalType == ChatNameModals.CHANNEL) return
    setNewChatName(name)
  }, [modalType, name])

  return (
    <div
      className={`${
        !changeNameModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
      {/* Example Modal */}
      <div className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl bg-white border border-neutral-300'>
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              setChangeNameModalVisible(false)
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
        <div className='flex flex-col px-12 pb-12 gap-5'>
          <div className='flex font-semibold text-lg justify-center text-neutral-900 mb-2'>
            {modalType == ChatNameModals.USER
              ? 'Change your name'
              : 'Change chat name'}
          </div>
          <div className='flex font-normal text-base justify-center text-neutral-600'>
            {modalType == ChatNameModals.USER
              ? 'The Chat SDK uses Metadata to store context about your user, such as their name or alias'
              : 'The Chat SDK uses Metadata to store context about your chat, such as a human readable name'}
          </div>

          <div className='flex flex-col gap-1 my-4'>
            <div className='flex font-normal text-sm text-neutral-900'>
              Name
            </div>
            <div className='flex'>
              {' '}
              <input
                className='flex w-full rounded-md bg-white border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-600'
                placeholder='New chat name'
                value={newChatName}
                onChange={e => {
                  setNewChatName(e.target.value)
                }}
              />
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-navy700 font-normal text-base w-1/3 h-12 cursor-pointer border border-neutral-300 rounded-lg bg-white`}
              onClick={e => {
                setChangeNameModalVisible(false)
              }}
            >
              Cancel
            </div>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-neutral-50 font-normal text-base w-1/3 h-12 cursor-pointer shadow-sm rounded-lg bg-navy900`}
              onClick={() => {
                if (activeChannel?.type === 'public') {
                  {
                    showUserMessage(
                      'Demo Limitation',
                      'Though supported by the Chat SDK, this demo does not support changing public channel names.  Please try changing a private group name instead',
                      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/updates#update-channel-details',
                      ToastType.ERROR
                    )
                  }
                } else {
                  if (newChatName && newChatName.length > 0) {
                    saveAction(newChatName)
                    setChangeNameModalVisible(false)
                  }
                }
              }}
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
