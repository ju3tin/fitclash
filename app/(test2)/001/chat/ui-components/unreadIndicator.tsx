export default function UnreadIndicator ({ count }) {
  return (
    count != null &&
    count != '' && (
      <div className='flex rounded-[10px] px-2 py-0.5 bg-cherryDark text-red-100 text-xs'>
        {count}
      </div>
    )
  )
}
