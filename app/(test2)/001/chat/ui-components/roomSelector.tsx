import Image from 'next/image'
import { roboto } from '@/app/fonts'

export default function RoomSelector ({
  roomSelectorVisible,
  setRoomSelectorVisible
}) {
  return (
    <div
      className={`${
        !roomSelectorVisible && 'hidden'
      } flex flex-col h-full flex-wrap p-3 rounded-r-lg bg-sky-950 select-none fixed w-80 z-20`}
    >
      <div
        className={`${roboto.className} text-sm font-medium flex flex flex-row text-white p-3 justify-between items-center`}
      >
        Rooms
        <div
          className='flex cursor-pointer'
          onClick={e => setRoomSelectorVisible(false)}
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
      </div>

      <div
        className={`${roboto.className} text-sm font-medium flex flex flex-row text-white p-3 justify-between items-center`}
      >
        Change room
      </div>

      <div
        className={`${roboto.className} text-sm font-medium flex flex-row justify-between text-white p-3 w-full items-center rounded-md bg-sky-900`}
      >
        <div className='flex items-center'>
          <div className='flex justify-center w-12 h-12 rounded-full bg-navy50 mr-3'>
            <Image
              src='/pn-logo-red-tint.png'
              alt='PubNub Logo'
              className='flex self-center'
              width={23.81}
              height={17.07}
              priority
            />
          </div>
          PubNub
        </div>
        <div className='flex justify-self-end'>
          <Image
            src='/icons/check.svg'
            alt='Selected'
            className='p-3'
            width={48}
            height={48}
            priority
          />
        </div>
      </div>
    </div>
  )
}
