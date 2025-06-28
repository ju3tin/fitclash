import Image from 'next/image'
import { roboto } from '@/app/fonts'

export default function PinnedMessagePill ({}) {
  return (
    <div
      className={`${roboto.className} flex flex-row items-center justify-between rounded ml-4 px-2 gap-0.5 border border-navy50 bg-sky-50`}
    >
      <div className='text-xs font-normal text-sky-900'>Pinned message</div>
      <Image
        src='/icons/pin.svg'
        alt='Remove'
        className='ml-1'
        width={12}
        height={12}
        priority
      />
    </div>
  )
}
