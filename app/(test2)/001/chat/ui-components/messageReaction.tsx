export default function MessageReaction ({
  emoji,
  count,
  messageTimetoken,
  reactionClicked
}) {
  return (
    emoji != '' &&
    count > 0 && (
      <div
        className='flex flex-row items-center rounded-lg border border-[#E5E5E5] gap-1 bg-[#FAFAFA] whitespace-nowrap mx-0.5 px-1 cursor-pointer'
        onClick={() => reactionClicked(emoji, messageTimetoken)}
      >
        <div className='flex text-lg'>{emoji}</div>
        {count > 1 && <div className='flex text-xs'>{count}</div>}
      </div>
    )
  )
}
