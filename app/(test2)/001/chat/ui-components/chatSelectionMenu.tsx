'use client'

import Image from 'next/image'
import { useState } from 'react'
import ChatMenuHeader from './chatMenuHeader'
import ChatMenuItem from './chatMenuItem'
import { ChatHeaderActionIcon, PresenceIcon, ToastType, useBreakpoints, useMediaQuery } from '@/app/types'

export default function ChatSelectionMenu ({
  chatSelectionMenuMinimized,
  setChatSelectionMenuMinimized,
  chat,
  setCreatingNewMessage,
  setShowThread,
  unreadMessages,
  publicChannels,
  publicChannelsMemberships,
  privateGroups,
  privateGroupsUsers,
  privateGroupsMemberships,
  directChats,
  directChatsUsers,
  directChatsMemberships,
  activeChannel,
  setActiveChannel,
  setActiveChannelPinnedMessage,
  updateUnreadMessagesCounts,
  currentUserProfileUrl,
  showUserMessage
}) {
  const [unreadExpanded, setUnreadExpanded] = useState(true)
  const [publicExpanded, setPublicExpanded] = useState(true)
  const [groupsExpanded, setGroupsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const { isXs, isSm, isMd, isLg, active } = useBreakpoints();
  const [searchChannels, setSearchChannels] = useState('')

  function handleChatSearch (term: string) {
    setSearchChannels(term)
  }

  return (
    <div
      id='chats-menu'
      className={`flex flex-col ${!isLg && 
        chatSelectionMenuMinimized ? 'w-5 min-w-5' : 'lg:min-w-80 lg:w-80 min-w-60 w-60'
      } bg-navy50 py-0 overflow-y-auto overscroll-none mt-[64px] pb-6 select-none border-r border-navy-200`}
    >
      <div
        className={`${!isLg && 
          chatSelectionMenuMinimized ? 'flex flex-row' : 'hidden'
        } min-h-screen h-screen bg-sky-950`}
      >
        <div
          className='flex cursor-pointer'
          onClick={e => {setChatSelectionMenuMinimized(!chatSelectionMenuMinimized);setShowThread(false)}}
        >
          <Image
            src='/icons/close-rooms.svg'
            alt='Expand Chats'
            className='p-1 mb-7 rotate-180'
            width={36}
            height={36}
            priority
          />
    </div>
      </div>
      <div className={`flex flex-col ${!isLg && chatSelectionMenuMinimized ? 'hidden' : 'flex'}`}>
        <div className={`relative px-4 mt-5`}>
          <input
            id='chats-search-input'
            value={searchChannels}
            className='flex w-full rounded-md bg-navy50 border  border-neutral-400 py-[9px] pl-9 px-[13px] text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-500'
            placeholder='Search'
            onChange={e => {
              handleChatSearch(e.target.value)
            }}
          />
          <Image
            src='/icons/search.svg'
            alt='Search Icon'
            className='absolute left-6 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'
            width={20}
            height={20}
            priority
          />
        </div>

        {unreadMessages && unreadMessages.length > 0 && (
          <ChatMenuHeader
            text='UNREAD'
            actionIcon={ChatHeaderActionIcon.MARK_READ}
            expanded={unreadExpanded}
            expandCollapse={() => {
              setUnreadExpanded(!unreadExpanded)
            }}
            action={async () => {
              const markedAsRead = await chat.markAllMessagesAsRead()
              updateUnreadMessagesCounts()

              showUserMessage(
                'Success:',
                'All messsages have been marked as read, and sent receipts are updated accordingly',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/unread#mark-messages-as-read-all-channels',
                ToastType.CHECK
              )
            }}
          />
        )}
        {unreadExpanded && (
          <div>
            {unreadMessages?.map(
              (unreadMessage, index) =>
                unreadMessage.channel.id !== activeChannel?.id &&
                (
                  (unreadMessage.channel.type === 'direct' && directChats
                    ? directChatsUsers[
                        directChats.findIndex(
                          dmChannel => dmChannel.id == unreadMessage.channel.id
                        )
                      ]?.find(user => user.id !== chat.currentUser.id)?.name
                    : unreadMessage.channel.name) ?? ''
                )
                  .toLowerCase()
                  ?.indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      unreadMessage.channel.type === 'group'
                        ? currentUserProfileUrl
                          ? currentUserProfileUrl
                          : '/avatars/placeholder.png'
                        : unreadMessage.channel.type == 'public'
                        ? unreadMessage.channel.custom?.profileUrl
                          ? unreadMessage.channel.custom?.profileUrl
                          : '/avatars/placeholder.png'
                        : unreadMessage.channel.type == 'direct' && directChats
                        ? directChatsUsers[
                            directChats.findIndex(
                              dmChannel =>
                                dmChannel.id == unreadMessage.channel.id
                            )
                          ]?.find(user => user.id !== chat.currentUser.id)
                            ?.profileUrl
                          ? directChatsUsers[
                              directChats.findIndex(
                                dmChannel =>
                                  dmChannel.id == unreadMessage.channel.id
                              )
                            ]?.find(user => user.id !== chat.currentUser.id)
                              ?.profileUrl
                          : '/avatars/placeholder.png'
                        : '/avatars/placeholder.png'
                    }
                    avatarBubblePrecedent={
                      unreadMessage.channel.type === 'group' && privateGroups
                        ? privateGroupsUsers[
                            privateGroups.findIndex(
                              group => group.id == unreadMessage.channel.id
                            )
                          ]?.map(user => user.id !== chat.currentUser.id)
                          ? `+${
                              privateGroupsUsers[
                                privateGroups.findIndex(
                                  group => group.id == unreadMessage.channel.id
                                )
                              ]?.map(user => user.id !== chat.currentUser.id)
                                .length - 1
                            }`
                          : ''
                        : ''
                    }
                    text={
                      unreadMessage.channel.type === 'direct' && directChats
                        ? directChatsUsers[
                            directChats.findIndex(
                              dmChannel =>
                                dmChannel.id == unreadMessage.channel.id
                            )
                          ]?.find(user => user.id !== chat.currentUser.id)?.name
                        : unreadMessage.channel.name
                    }
                    present={PresenceIcon.NOT_SHOWN}
                    count={'' + unreadMessage.count}
                    markAsRead={true}
                    markAsReadAction={async e => {
                      e.stopPropagation()
                      if (
                        unreadMessage.channel.type === 'public' &&
                        publicChannelsMemberships &&
                        publicChannels
                      ) {
                        const index = publicChannelsMemberships.findIndex(
                          membership =>
                            membership.channel.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          const lastMessage = await publicChannels[
                            index
                          ]?.getHistory({ count: 1 })
                          if (lastMessage && lastMessage.messages) {
                            await publicChannelsMemberships[
                              index
                            ].setLastReadMessage(lastMessage.messages[0])
                            updateUnreadMessagesCounts()
                          }
                        }
                      } else if (
                        unreadMessage.channel.type === 'group' &&
                        privateGroupsMemberships &&
                        privateGroups
                      ) {
                        const index = privateGroupsMemberships.findIndex(
                          membership =>
                            membership.channel.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          const lastMessage = await privateGroups[
                            index
                          ]?.getHistory({ count: 1 })
                          if (lastMessage && lastMessage.messages) {
                            await privateGroupsMemberships[
                              index
                            ].setLastReadMessage(lastMessage.messages[0])
                            updateUnreadMessagesCounts()
                          }
                        }
                      } else if (
                        unreadMessage.channel.type === 'direct' &&
                        directChatsMemberships &&
                        directChats
                      ) {
                        const index = directChatsMemberships.findIndex(
                          membership =>
                            membership.channel.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          const lastMessage = await directChats[
                            index
                          ]?.getHistory({ count: 1 })
                          if (lastMessage && lastMessage.messages) {
                            await directChatsMemberships[
                              index
                            ].setLastReadMessage(lastMessage.messages[0])
                            updateUnreadMessagesCounts()
                          }
                        }
                      }
                    }}
                    setActiveChannel={() => {
                      setActiveChannelPinnedMessage(null)
                      setCreatingNewMessage(false)
                      if (
                        unreadMessage.channel.type === 'public' &&
                        publicChannels
                      ) {
                        const index = publicChannels.findIndex(
                          channel => channel.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          setActiveChannel(publicChannels[index])
                        }
                      } else if (
                        unreadMessage.channel.type === 'group' &&
                        privateGroups
                      ) {
                        const index = privateGroups.findIndex(
                          group => group.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          setActiveChannel(privateGroups[index])
                        }
                      } else if (
                        unreadMessage.channel.type === 'direct' &&
                        directChats
                      ) {
                        const index = directChats.findIndex(
                          dmChannel => dmChannel.id == unreadMessage.channel.id
                        )
                        if (index > -1) {
                          setActiveChannel(directChats[index])
                        }
                      }
                    }}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        {unreadMessages && unreadMessages.length > 0 && (
          <div className='w-full border border-navy200 mt-4'></div>
        )}

        <ChatMenuHeader
          text='PUBLIC CHANNELS'
          expanded={publicExpanded}
          expandCollapse={() => {
            setPublicExpanded(!publicExpanded)
          }}
          actionIcon={ChatHeaderActionIcon.NONE}
          action={() => {}}
        />
        {publicExpanded && (
          <div>
            {publicChannels?.map(
              (publicChannel, index) =>
                (publicChannel.name ?? '')
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      publicChannel.custom.profileUrl
                        ? publicChannel.custom.profileUrl
                        : '/avatars/placeholder.png'
                    }
                    text={publicChannel.name}
                    present={PresenceIcon.NOT_SHOWN}
                    setActiveChannel={() => {
                      setCreatingNewMessage(false)
                      setActiveChannelPinnedMessage(null)
                      setActiveChannel(publicChannels[index])
                    }}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        <div className='w-full border border-navy200 mt-4'></div>
        <ChatMenuHeader
          text='PRIVATE GROUPS'
          expanded={groupsExpanded}
          expandCollapse={() => setGroupsExpanded(!groupsExpanded)}
          actionIcon={ChatHeaderActionIcon.ADD}
          action={setCreatingNewMessage}
        />
        {groupsExpanded && (
          <div>
            {privateGroups?.map(
              (privateGroup, index) =>
                (privateGroup.name ?? '')
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      currentUserProfileUrl
                        ? currentUserProfileUrl
                        : '/avatars/placeholder.png'
                    }
                    text={privateGroup.name}
                    present={PresenceIcon.NOT_SHOWN}
                    avatarBubblePrecedent={
                      privateGroupsUsers[index]?.map(
                        user => user.id !== chat.currentUser.id
                      )
                        ? `+${
                            privateGroupsUsers[index]?.map(
                              user => user.id !== chat.currentUser.id
                            ).length - 1
                          }`
                        : ''
                    }
                    setActiveChannel={() => {
                      setCreatingNewMessage(false)
                      setActiveChannelPinnedMessage(null)
                      setActiveChannel(privateGroups[index])
                    }}
                  />
                )
            )}
          </div>
        )}

        <div className='w-full border border-navy200 mt-4'></div>
        <ChatMenuHeader
          text='DIRECT MESSAGES'
          expanded={directMessagesExpanded}
          expandCollapse={() =>
            setDirectMessagesExpanded(!directMessagesExpanded)
          }
          actionIcon={ChatHeaderActionIcon.ADD}
          action={setCreatingNewMessage}
        />
        {directMessagesExpanded && (
          <div>
            {directChats?.map(
              (directChat, index) =>
                (
                  directChatsUsers[index]?.find(
                    user => user.id !== chat.currentUser.id
                  )?.name ?? ''
                )
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      directChatsUsers[index]?.find(
                        user => user.id !== chat.currentUser.id
                      )?.profileUrl
                        ? directChatsUsers[index]?.find(
                            user => user.id !== chat.currentUser.id
                          )?.profileUrl
                        : '/avatars/placeholder.png'
                    }
                    text={
                      directChatsUsers[index]?.find(
                        user => user.id !== chat.currentUser.id
                      )?.name
                    }
                    present={
                      directChatsUsers[index]?.find(
                        user => user.id !== chat.currentUser.id
                      )?.active
                        ? PresenceIcon.ONLINE
                        : PresenceIcon.OFFLINE
                    }
                    setActiveChannel={() => {
                      setCreatingNewMessage(false)
                      setActiveChannelPinnedMessage(null)
                      setActiveChannel(directChats[index])
                    }}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
