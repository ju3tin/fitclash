import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ToastType } from '@/app/types'

export default function UserMessage ({
  userMsgShown,
  title = 'Please Note:',
  message,
  href = '',
  type = ToastType.INFO,
  closeToastAction
}) {
  return (
    <div
      className={`${
        userMsgShown ? 'flex' : 'hidden'
      } absolute flex-row justify-start left-5 bottom-5 p-4 rounded-lg shadow-lg ${
        type == ToastType.INFO && 'bg-statusIndicatorInfo100'
      } ${type == ToastType.CHECK && 'bg-statusIndicatorSuccess100'} ${
        type == ToastType.ERROR && 'bg-red-100'
      } w-2/6 z-40`}
    >
      <div className='flex place-self-start min-w-[24px]'>
        {type === ToastType.INFO && (
          <Image
            src='/icons/toast_info.svg'
            alt='Info'
            className=''
            width={24}
            height={24}
            priority
          />
        )}
        {type === ToastType.CHECK && (
          <Image
            src='/icons/toast_check.svg'
            alt='Check'
            className=''
            width={24}
            height={24}
            priority
          />
        )}
        {type === ToastType.ERROR && (
          <Image
            src='/icons/toast_error.svg'
            alt='Error'
            className=''
            width={24}
            height={24}
            priority
          />
        )}
      </div>
      <div className='flex flex-col gap-1 px-4 py-1'>
        <div className='flex font-normal text-base text-neutral-900'>
          {title || 'Please Note: '}
        </div>
        <div className='flex font-normal text-sm text-neutral-700'>
          {message}
        </div>
        {href != '' && (
          <div className='flex font-medium my-2.5 text-base text-sky-700'>
            <a href={href} target='_new'>
              Learn More...
            </a>
            <Image
              src='/icons/arrow_forward.svg'
              alt='Info'
              width={16}
              height={16}
            />
          </div>
        )}
      </div>
      <div
        className='absolute right-0 top-0 cursor-pointer'
        onClick={() => closeToastAction()}
      >
        <Image
          src='/icons/close.svg'
          alt='Error'
          className='m-3'
          width={24}
          height={24}
        />
      </div>
    </div>
  )
}
