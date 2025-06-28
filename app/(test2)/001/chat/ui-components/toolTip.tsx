import Image from 'next/image'

export default function ToolTip ({ className, tip, messageActionsTip = true }) {
  return (
    <div
      className={`${className} absolute w-full ${
        messageActionsTip ? 'right-[0px]' : 'right-[5px]'
      } bottom-[${messageActionsTip ? '50px' : '0px'}]`}
    >
      <div
        className={`flex flex-col ${
          messageActionsTip ? 'items-center' : 'items-end'
        }`}
      >
        <div className='text-neutral-50 bg-navy900 px-2 py-2 min-w-16 text-xs text-center'>
          {tip}
        </div>
        <Image
          src='/icons/caret.svg'
          alt='Caret'
          className='p-0 rotate-180'
          width={12}
          height={7}
          priority
        />
      </div>
    </div>
  )
}
