import { roboto } from '@/app/fonts'
import Avatar from './avatar'
import Message from './message'
import UnreadIndicator from './unreadIndicator'
import Image from 'next/image'
import { PresenceIcon } from '@/app/types'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Channel,
  User,
  Message as pnMessage,
  Membership,
  MixedTextTypedElement,
  TimetokenUtils
} from '@pubnub/chat'

export default function MessageList ({
  activeChannel,
  currentUser,
  groupUsers,
  groupMembership,
  messageActionHandler = (action, vars) => {},
  usersHaveChanged,
  updateUnreadMessagesCounts,
  setChatSettingsScreenVisible,
  quotedMessage,
  quotedMessageSender,
  activeChannelPinnedMessage,
  setActiveChannelPinnedMessage,
  setShowThread,
  showUserMessage
}) {
  const MAX_AVATARS_SHOWN = 9
  const [messages, setMessages] = useState<pnMessage[]>([])
  const [currentMembership, setCurrentMembership] = useState<Membership>()
  const [readReceipts, setReadReceipts] = useState()
  const [pinnedMessageTimetoken, setPinnedMessageTimetoken] = useState('') //  Keep track of if someone else has updated the pinned message
  const messageListRef = useRef<HTMLDivElement>(null)
  const [loadingMessage, setLoadingMessage] = useState('')

  function uniqueById (items) {
    const set = new Set()
    return items.filter(item => {
      const isDuplicate = set.has(item.timetoken)
      set.add(item.timetoken)
      return !isDuplicate
    })
  }

  useEffect(() => {
    //  UseEffect to handle initial configuration of the Message List including reading the historical messages
    setLoadingMessage('Fetching History from Server...')
    if (!activeChannel) return
    async function initMessageList () {
      setMessages([])
      if (groupMembership == null) {
        console.log('Error: groupMembership should not be null')
      }
      var localCurrentMembership = groupMembership
      setCurrentMembership(groupMembership)
      activeChannel
        .getHistory({ count: 20 })
        .then(async historicalMessagesObj => {
          //  Run through the historical messages and set the most recently received one (that we were not the sender of) as read
          if (historicalMessagesObj.messages) {
            if (historicalMessagesObj.messages.length == 0) {
              setLoadingMessage('No messages in this chat yet')
            } else {
              setMessages(messages => {
                return uniqueById([...historicalMessagesObj.messages]) //  Avoid race condition where message was being added twice
              })
              for (
                var i = historicalMessagesObj.messages.length - 1;
                i >= 0;
                i--
              ) {
                await localCurrentMembership?.setLastReadMessageTimetoken(
                  historicalMessagesObj.messages[i].timetoken
                )
                updateUnreadMessagesCounts()
                break
              }
            }
          }
        })
    }
    initMessageList()
  }, [activeChannel])

  useEffect(() => {
    //  UseEffect to stream Read Receipts
    if (!activeChannel) return
    if (activeChannel.type == 'public') return //  Read receipts are not supported on public channels

    activeChannel.streamReadReceipts(receipts => {
      setReadReceipts(receipts)
    })
  }, [activeChannel])

  useEffect(() => {
    activeChannel?.streamUpdates(async channelUpdate => {
      if (channelUpdate.custom) {
        const pinnedMessageTimetoken =
          channelUpdate.custom.pinnedMessageTimetoken
        if (!pinnedMessageTimetoken) {
          //  Message was unpinned
          setActiveChannelPinnedMessage(null)
        } else {
          channelUpdate.getMessage(pinnedMessageTimetoken).then(message => {
            setActiveChannelPinnedMessage(message)
          })
        }
      }
      else{
        setActiveChannelPinnedMessage(null)
      }
    })
  }, [activeChannel])

  useEffect(() => {
    //  UseEffect to receive new messages sent on the channel
    if (!activeChannel) return

    return activeChannel.connect(message => {
      currentMembership?.setLastReadMessageTimetoken(message.timetoken)
      setMessages(messages => {
        return uniqueById([...messages, message]) //  Avoid race condition where message was being added twice when the channel was launched with historical messages
      })
    })
  }, [activeChannel, currentMembership])

  useEffect(() => {
    //  UseEffect to receive updates to messages such as reactions.  This does NOT include new messages being received on the channel (which is handled by the connect elsewhere)
    if (!messages || messages.length == 0) return
    return pnMessage.streamUpdatesOn(messages, setMessages)
  }, [messages])

  useEffect(() => {
    if (groupUsers && groupUsers.length > 0) {
      return User.streamUpdatesOn(groupUsers, updatedUsers => {
        usersHaveChanged()
      })
    }
  }, [groupUsers])

  useEffect(() => {
    if (!messageListRef.current) return
    if (
      messageListRef.current.scrollTop != 0 &&
      messageListRef.current.scrollHeight - messageListRef.current.scrollTop >
        1115
    ) {
      return //  We aren't scrolled to the bottom
    }
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current?.scrollHeight
      }
    }, 10) //  Some weird timing issue
  }, [messages])

  if (!activeChannel)
    return (
      <div className='flex flex-col max-h-screen h-screen justify-center items-center w-full'>
        <div className='max-w-96 max-h-96 '>
          <Image
            src='/chat-logo.svg'
            alt='Chat Icon'
            className=''
            width={200}
            height={200}
            priority
          />
        </div>
        <div className='flex mb-5 animate-spin'>
          <Image
            src='/icons/loading.png'
            alt='Chat Icon'
            className=''
            width={50}
            height={50}
            priority
          />
        </div>
        <div className='text-2xl'>Loading...</div>
      </div>
    )

  return (
    <div className='flex flex-col max-h-screen'>
      <div
        id='chats-header'
        className='flex flex-row items-center h-16 min-h-16 border-y border-navy-200 select-none'
      >
        <div
          className={`${roboto.className} text-base font-medium flex flex-row grow justify-center items-center gap-3`}
        >
          {activeChannel.type == 'public' && (
            <div className='flex flex-row justify-center items-center gap-3'>
              <Avatar
                present={PresenceIcon.NOT_SHOWN}
                avatarUrl={activeChannel.custom.profileUrl}
              />
              {activeChannel.name}{' '}
              {activeChannel.type == 'public' && <div>(Public)</div>}
            </div>
          )}
          {activeChannel.type == 'direct' && (
            <div className='flex flex-row justify-center items-center gap-3'>
              <div className='flex flex-row -space-x-2.0'>
                {groupUsers?.map((member, index) => (
                  <Avatar
                    key={index}
                    avatarUrl={member.profileUrl}
                    present={
                      member.active ? PresenceIcon.ONLINE : PresenceIcon.OFFLINE
                    }
                  />
                ))}
              </div>
              1:1 between{' '}
              {groupUsers?.map(
                (member, index) =>
                  `${member.name}${
                    groupUsers.length - 1 != index ? ' and ' : ''
                  }`
              )}
            </div>
          )}
          {activeChannel.type == 'group' && (
            <div className='flex flex-row justify-center items-center gap-3'>
              <div className='flex flex-row -space-x-2.0'>
                {groupUsers?.map(
                  (member, index) =>
                    index < MAX_AVATARS_SHOWN && (
                      <Avatar
                        key={index}
                        avatarUrl={member.profileUrl}
                        present={
                          member.active
                            ? PresenceIcon.ONLINE
                            : PresenceIcon.OFFLINE
                        }
                      />
                    )
                )}
              </div>
              {activeChannel.name} (Private Group)
            </div>
          )}
        </div>

        <div className='flex flex-row'>
          {/* Icons on the top right of a chat screen */}
          <div className='flex flex-row'>
            {/* Pin with number of pinned messages */}
            <div className='flex justify-center items-center rounded min-w-6 px-2 my-2 border text-xs font-normal border-navy50 bg-neutral-100'>
              {activeChannelPinnedMessage ? '1' : '0'}
            </div>
            <div
              className={`p-3 py-3 ${
                activeChannelPinnedMessage &&
                'cursor-pointer hover:bg-neutral-100 hover:rounded-md'
              } `}
              onClick={() => {
                if (!activeChannelPinnedMessage) return
                if (messageListRef && messageListRef.current) {
                  messageListRef.current.scrollTop = 0
                }
              }}
            >
              <Image
                src='/icons/pin.svg'
                alt='Pin'
                className=''
                width={24}
                height={24}
                priority
              />
            </div>
          </div>
          <div
            className='p-3 py-3 cursor-pointer hover:bg-neutral-100 hover:rounded-md'
            onClick={() => setChatSettingsScreenVisible(true)}
          >
            <Image
              src='/icons/settings.svg'
              alt='Settings'
              className=''
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
      </div>

      {/* This section hard-codes the bottom of the message list to accommodate the height of the message input Div, whose height will vary depending on whether there is a quoted message displayed or not */}
      <div
        id='chats-bubbles'
        className={`flex flex-col overflow-y-auto pb-8 ${
          quotedMessage ? 'mb-[234px]' : 'mb-[178px]'
        }`}
        ref={messageListRef}
      >
        {messages && messages.length == 0 && (
          <div className='flex flex-col items-center justify-center w-full h-screen text-xl select-none gap-4'>
            <Image
              src='/chat-logo.svg'
              alt='Chat Icon'
              className=''
              width={100}
              height={100}
              priority
            />
            {loadingMessage}
          </div>
        )}
        {/* Show the pinned message first if there is one */}
        {activeChannelPinnedMessage && !activeChannelPinnedMessage.deleted && (
          <Message
            key={activeChannelPinnedMessage.timetoken}
            received={currentUser.id !== activeChannelPinnedMessage.userId}
            avatarUrl={
              activeChannelPinnedMessage.userId === currentUser.id
                ? currentUser.profileUrl
                : groupUsers?.find(
                    user => user.id === activeChannelPinnedMessage.userId
                  )?.profileUrl
            }
            isOnline={
              activeChannelPinnedMessage.userId === currentUser.id
                ? currentUser.active
                : groupUsers?.find(
                    user => user.id === activeChannelPinnedMessage.userId
                  )?.active
            }
            readReceipts={readReceipts}
            quotedMessageSender={
              activeChannelPinnedMessage.quotedMessage &&
              (activeChannelPinnedMessage.quotedMessage.userId ===
              currentUser.id
                ? currentUser.name
                : groupUsers?.find(
                    user =>
                      user.id ===
                      activeChannelPinnedMessage.quotedMessage.userId
                  )?.name)
            }
            showReadIndicator={activeChannel.type !== 'public'}
            sender={
              activeChannelPinnedMessage.userId === currentUser.id
                ? currentUser.name
                : groupUsers?.find(
                    user => user.id === activeChannelPinnedMessage.userId
                  )?.name
            }
            pinned={true}
            messageActionHandler={(action, vars) =>
              messageActionHandler(action, vars)
            }
            message={activeChannelPinnedMessage}
            currentUserId={currentUser.id}
            showUserMessage={showUserMessage}
          />
        )}

        {messages.map((message, index) => {
          return !message.deleted && (
            <Message
              key={message.timetoken}
              received={currentUser.id !== message.userId}
              avatarUrl={
                message.userId === currentUser.id
                  ? currentUser.profileUrl
                  : groupUsers?.find(user => user.id === message.userId)
                      ?.profileUrl
              }
              isOnline={
                message.userId === currentUser.id
                  ? currentUser.active
                  : groupUsers?.find(user => user.id === message.userId)?.active
              }
              readReceipts={readReceipts}
              quotedMessageSender={
                message.quotedMessage &&
                (message.quotedMessage.userId === currentUser.id
                  ? currentUser.name
                  : groupUsers?.find(
                      user => user.id === message.quotedMessage.userId
                    )?.name)
              }
              showReadIndicator={activeChannel.type !== 'public'}
              sender={
                message.userId === currentUser.id
                  ? currentUser.name
                  : groupUsers?.find(user => user.id === message.userId)?.name
              }
              pinned={false}
              messageActionHandler={(action, vars) =>
                messageActionHandler(action, vars)
              }
              message={message}
              currentUserId={currentUser.id}
              showUserMessage={showUserMessage}
            />
          )
        })}
      </div>
    </div>
  )
}
