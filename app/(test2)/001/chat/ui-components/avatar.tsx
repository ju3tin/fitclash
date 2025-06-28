import Image from 'next/image'

export default function Avatar ({
  avatarUrl,
  present = -1,
  bubblePrecedent = '',
  width = 32,
  height = 32,
  editIcon = false,
  editActionHandler = () => {},
  border = false
}) {
  return (
    <div className='relative'>
      <Image
        src={avatarUrl ? avatarUrl : '/avatars/placeholder.png'}
        alt='User avatar'
        className={`rounded-full ${border && 'border-2 border-white'}`}
        width={width}
        height={height}
      />
      {/* Presence Indicator */}
      {present != -1 &&
        bubblePrecedent === '' &&
        (present > 0 ? (
          <div className='w-[12px] h-[12px] rounded-full border-2 border-white bg-success absolute left-[22px] top-[20px]'></div>
        ) : (
          <div className='w-[12px] h-[12px] rounded-full border-2 border-white bg-neutral300 absolute left-[22px] top-[20px]'></div>
        ))}
      {bubblePrecedent !== '' && (
        <div className='w-[22px] h-[20px] rounded-full text-xs border border-navy50 bg-neutral-100 absolute left-[18px] top-[16px]'>
          {bubblePrecedent}
        </div>
      )}
      {editIcon && (
        <div
          className={`w-[40px] h-[40px] rounded-full text-xs border-2 m-2 border-sky-950 bg-sky-950 cursor-pointer absolute -right-[15px] -bottom-[15px]`}
        >
          <div onClick={e => editActionHandler()}>
            <Image
              src={'/icons/edit.svg'}
              alt='Edit'
              className='rounded-full white p-1'
              width={40}
              height={40}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
