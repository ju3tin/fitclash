import Image from 'next/image'
import Avatar from './avatar'
import UnreadIndicator from './unreadIndicator'
import { MessageDraft, User, Channel } from '@pubnub/chat'
import QuotedMessage from './quotedMessage'
import MentionSuggestions from './mentionSuggestions'
import { useState, useEffect, useRef } from 'react'
import { ToastType } from '@/app/types'
import { actionCompleted } from 'pubnub-demo-integration'

export default function MessageInput ({
  activeChannel,
  replyInThread,
  quotedMessage,
  quotedMessageSender,
  setQuotedMessage = any => {},
  creatingNewMessage = false,
  showUserMessage = (a, b, c, d) => {},
  plusAction = () => {},
  setShowEmojiPicker = any => {},
  setEmojiPickerTargetsInput = any => {},
  selectedEmoji = '',
  setSelectedEmoji = a => {}
}) {
  const [text, setText] = useState('')
  const [newMessageDraft, setNewMessageDraft] = useState<MessageDraft>()
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
  const [nameOccurrenceIndex, setNameOccurrenceIndex] = useState<number>(-1)
  const [suggestedChannels, setSuggestedChannels] = useState<Channel[]>([])
  const [channelOccurrenceIndex, setChannelOccurrenceIndex] =
    useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasAttachment, setHasAttachment] = useState(false)

  async function handleSend (event: React.SyntheticEvent) {
    event.preventDefault()
    if (!text || !newMessageDraft || !activeChannel) return
    if (replyInThread) {
      //  This demo only supports text replies in the thread UI
      await activeChannel.sendText(text, { storeInHistory: true })
      setText('')
    } else {
      if (quotedMessage) {
        newMessageDraft.addQuote(quotedMessage)
      }
      await newMessageDraft.send({ storeInHistory: true })
      setNewMessageDraft(
        activeChannel?.createMessageDraft({
          userSuggestionSource: 'channel',
          isTypingIndicatorTriggered: activeChannel.type !== 'public',
          userLimit: 6,
          channelLimit: 6
        })
      )
      setHasAttachment(false)
      setQuotedMessage(false)
      setText('')

      actionCompleted({
        action: 'Send a Chat Message',
        blockDuplicateCalls: false,
        debug: false
      })
    }
  }

  async function handleTyping (e) {
    if (activeChannel.type !== 'public') {
      activeChannel.startTyping()
    }
    setText(e.target.value)
    const response = await newMessageDraft?.onChange(e.target.value)
    if ((response?.users.suggestedUsers.length ?? 0) > 0) {
      setSuggestedUsers(response!.users.suggestedUsers)
      setNameOccurrenceIndex(response!.users.nameOccurrenceIndex)
    } else {
      setSuggestedUsers([])
      setNameOccurrenceIndex(-1)
    }
    if ((response?.channels.suggestedChannels.length ?? 0) > 0) {
      setSuggestedChannels(response!.channels.suggestedChannels)
      setChannelOccurrenceIndex(response!.channels.channelOccurrenceIndex)
    } else {
      setSuggestedChannels([])
      setChannelOccurrenceIndex(-1)
    }
  }

  async function addAttachment () {
    if (!newMessageDraft) return
    if (hasAttachment)
    {
      newMessageDraft.files = undefined
    }
    else
    {
      showUserMessage(
        'Demo Limitation',
        'This demo will add a hardcoded attachment to your message',
        'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/files',
        ToastType.INFO
      )
      var myImageFile = new File([base64ToBlob()], "pn-logo.png", {
        type: "image/png"
      });
      newMessageDraft.files = [myImageFile]
    }
    setHasAttachment(!hasAttachment)
  }

  async function addEmoji () {
    setEmojiPickerTargetsInput(true)
    setShowEmojiPicker(true)
  }

  function pickSuggestedUser (user: User) {
    if (!newMessageDraft) return
    newMessageDraft.addMentionedUser(user, nameOccurrenceIndex)
    setText(newMessageDraft.value)
    setSuggestedUsers([])
    setNameOccurrenceIndex(-1)
    actionCompleted({
      action: '@Mention another User',
      blockDuplicateCalls: false,
      debug: false
    })
    inputRef.current?.focus()
  }

  function pickSuggestedChannel (channel: Channel) {
    if (!newMessageDraft) return
    newMessageDraft.addReferencedChannel(channel, channelOccurrenceIndex)
    setText(newMessageDraft.value)
    setSuggestedChannels([])
    setChannelOccurrenceIndex(-1)
    actionCompleted({
      action: '#Reference a Channel',
      blockDuplicateCalls: false,
      debug: false
    })
    inputRef.current?.focus()
  }

  function base64ToBlob() {
    const base64String = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAxHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBDsMgDLvzij0B4gDJc+jaSfvBnr8AaddWs0Rq7MglCdvn/QqPDkocOFcpWko0sLJSMyJxoo2aIo86ALfsftHDYZBJ+HVK8f5dT0fA/DRj+RQkTzeWq6Hs+XIL8h+hv4iMrB6kHgSaRvKANseKRaWeR1i2eIXME3pBHdlHyP3O1ba3ZhNBtCEhWgXKfAD64YBmhK0S1BojxHiGDn0f1Rbyb087whfjwFkntSqe5wAAAYNpQ0NQSUNDIHByb2ZpbGUAAHicfZE9SMNAHMVf00pFKg52EFHIUJ3soiIdaxWKUCHUCq06mFz6BU0MSYqLo+BacPBjserg4qyrg6sgCH6AODs4KbpIif9LCi1iPDjux7t7j7t3gNCsMc0KJQFNt81sOiXmCyti+BUhjCKMBIIys4xZScrAd3zdI8DXuzjP8j/35+hXixYDAiJxkhmmTbxOPLNpG5z3iaOsIqvE58QTJl2Q+JHrisdvnMsuCzwzauayc8RRYrHcxUoXs4qpEU8Tx1RNp3wh77HKeYuzVquz9j35CyNFfXmJ6zRHkMYCFiFBhII6qqjBRpxWnRQLWdpP+fiHXb9ELoVcVTByzGMDGmTXD/4Hv7u1SlOTXlIkBfS8OM7HGBDeBVoNx/k+dpzWCRB8Bq70jn+jCSQ+SW90tNgRMLANXFx3NGUPuNwBhp4M2ZRdKUhTKJWA9zP6pgIweAv0rXq9tfdx+gDkqKvMDXBwCIyXKXvN59293b39e6bd3w+VXHK0W3gRAQAAEINpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkNBQTMwMEE2NzcyMTFFREEwN0FGNjlFNkE3RkVFNEMiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjQ2ZjY2OTMtZjE4OC00NTYzLTkwZGItNDQ1NTA5MDkwZDRlIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6NjVFNjM5MDY4NkNGMTFEQkE2RTJEODg3Q0VBQ0I0MDciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MTQzNzc1NDUxOTg0MTgiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zNiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA0OjI5VDA4OjU5OjA1KzAxOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowNDoyOVQwODo1OTowNSswMTowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjczMjUxM2YzLThmZTEtNDEzMi05ZmUzLTQ3NWE5ZjU5OTVkMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA0LTIzVDIyOjM5OjE0KzAxOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNlYmJhNjEzLTg3ZDAtNDI5ZC1hODUxLWFjZWMxYmVmZjJiNyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA0LTIzVDIyOjQ0OjE3KzAxOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFmMmM5ODFhLWYyODEtNGQzMC1iZmZjLTIwODM2NmU3ZjE0NyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA0LTI5VDA4OjU5OjA1KzAxOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHhtcE1NOkRlcml2ZWRGcm9tCiAgICBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUzZDFlZTJmLWMwODYtNDc4MC04YjhjLTQ0N2Q3YWNkNWIxZCIKICAgIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTNkMWVlMmYtYzA4Ni00NzgwLThiOGMtNDQ3ZDdhY2Q1YjFkIi8+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+UE4gTG9nbyAtIFJlZDwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+DJuRCwAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+gEHQc7BSinF/8AAAOzSURBVGje7ZlNTBxVHMB/b2dmd5llZnfpysdSugiLVuu2lcSk8SNK0kQlpomVeqhepDWNBw9qJcZ48ODB2ESKetHEz1O9mBgNVmMTg/agJh6k0SUGokJcoEBhF9hdhp3xYMM6LPuBCrI67/bey/zn//t/vf+bEZZlWVTxcFHlwwFwABwAB8AB+H8DyKU2jcVFlsfHSU9MkP0tgTE9TS6ZxDItJJ+K0tCAJ9yEr60NLRpFSFLpt1kW2bk50olJMokE2clJVhIJcrOzmJksCIGk1eKJRFCv60C/cR/e0K6SIsX6VsJcWeHyVxeZO/8p6Q8+AtOsyBLuu26jpe80/r17C/ZMw+DnN98iNXie3KX4JuLDReCpx2l5+CEUTasMYCEeZ7T7/rKCNwRzCVrefoNr7ri9wJPD+28pEgMSrt1hhE/FnJnFmprZ0DjXD/RvCCGXM4IIBQmeOol+80Fqws24A36ELJNLp8lMTTE79CVzL7x01dQW472n8Ax+iN4RLc7f3MDuMy/ii0TwhEK4FGVtb2V+nstDQ0w9+QyYf9h25YuLTJx7n2sfPbn5JNaOPUDriV7qOjupaWxA8npxyTKKpqFFo7T2PkL49VfyD+RMJs4OYJUIPbkjSujQIWqammzKA7gDAZqPHKFx4Ixt/Ur/a+TS6b9QhUT5UG08fBj1eM/aPPPJ56RGR4s/sJorK7O+qwuhevMLmSzZ2bktKqNCUH/UnjfJ4eHixcgsDyCrKjX33WPnTi9v3TlQ295umy//8GOJclqZTCUcXgdubh2AW9cRvpq8x4cv/X3HrssPNrg8/nMnsRBIba35XI7/tOELd3Qr8Wd1raU0VlUBWBbm2C95hwQ0hBDVA7CayWAt5auEu/MgVBNAZnraNvfGbqqudjoVH7Gf4LHYDgGoIAxy2Swz77xra9D8B/ZXmO5bDJCNj7AwMoJpGEVDZ+zlfoyvv1tbq+t7Ak8wWDLht+VCA5C9MMTohSFEKIjafTee1giSqrK6kCT9/TCZwc9sBpUP7KP5wWM740ZmM9rMFZbeO8dSKWGxG2h/9SyKrpctudsGoB7vYVf3vSS/+ZbUx4OYY78WKOO+81bqeo5S39WF7PMVxqksU/dc39pcqq2tSDktFkN6/tl8afb7N38j0x87QfTp01d1tTDmFzAWU5iGgUtRUHQ/br++My/1hQVJ4A4GcAcDzmcVB6AowDb0L44H/ksABVVI8nptXxg8e/bsaADh/KV0ABwAB8ABcAAcgH9x/A4ZBjuXYiUKvAAAAABJRU5ErkJggg=="
    const byteCharacters = atob(base64String);
    const byteArrays : number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: "image/png" });
}
  useEffect(() => {
    if (!activeChannel) return
    setNewMessageDraft(
      activeChannel.createMessageDraft({
        userSuggestionSource: 'channel',
        isTypingIndicatorTriggered: activeChannel.type !== 'public',
        userLimit: 6,
        channelLimit: 6
      })
    )
  }, [activeChannel])

  useEffect(() => {
    if (!selectedEmoji) return
    if (selectedEmoji === '') return
    setText(text + selectedEmoji)
    newMessageDraft?.onChange(text + selectedEmoji)
    setSelectedEmoji('')
  }, [newMessageDraft, selectedEmoji, setSelectedEmoji, text])

  return (
    <div
      className={`flex flex-col w-full items-center border-y border-r border-navy200 select-none ${
        quotedMessage ? 'h-[170px]' : ''
      } pr-6`}
    >
      {((suggestedUsers && suggestedUsers.length > 0) ||
        (suggestedChannels && suggestedChannels.length > 0)) && (
        <MentionSuggestions
          suggestedUsers={suggestedUsers}
          suggestedChannels={suggestedChannels}
          pickSuggestedUser={user => {
            pickSuggestedUser(user)
          }}
          pickSuggestedChannel={channel => {
            pickSuggestedChannel(channel)
          }}
        />
      )}
      {/* The sections around here hard-code the height of the message input Div, which will vary depending on whether there is a quoted message displayed or not.  Without a quoted message it is 114px, but with a quoted message it is 170px */}
      {quotedMessage && (
        <div className='flex flex-row w-full h-[100px]'>
          <QuotedMessage
            originalMessage={null}
            quotedMessage={quotedMessage}
            quotedMessageSender={quotedMessageSender}
            setQuotedMessage={setQuotedMessage}
            displayedWithMesageInput={true}
          />
        </div>
      )}
      <div
        className={`flex flex-row w-full items-center ${
          quotedMessage ? 'h-[70px]' : 'h-[114px] -mt-[1px]'
        }`}
      >
        <form className={`flex grow`} onSubmit={e => handleSend(e)}>
          <input
            className={`flex grow rounded-md border border-neutral-300 h-[50px] mr-1 ${
              quotedMessage ? '' : 'my-8'
            } ml-6 px-6 text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-500`}
            ref={inputRef}
            placeholder='Type message'
            value={text}
            onChange={e => {
              handleTyping(e)
            }}
          />
        </form>
        {!replyInThread && (
          <div
            className='cursor-pointer hover:bg-neutral-100 hover:rounded-md'
            onClick={e => handleSend(e)}
          >
            <Image
              src='/icons/send.svg'
              alt='Send'
              className='m-3 cursor-pointer'
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {!replyInThread && (
          <div
            className='cursor-pointer hover:bg-neutral-100 hover:rounded-md'
            onClick={() => {
              addEmoji()
            }}
          >
            <Image
              src='/icons/smile.svg'
              alt='Smile'
              className='m-3 cursor-pointer'
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {!replyInThread && (
          <div
            className='cursor-pointer hover:bg-neutral-100 hover:rounded-md relative'
            onClick={() => {
              addAttachment()
            }}
          >
            {hasAttachment && (
              <div className='absolute right-0 top-0'>              
              <UnreadIndicator count={1}/>
            </div>)}
            <Image
              src='/icons/attachment.svg'
              alt='Attachment'
              className='m-3 cursor-pointer'
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {replyInThread && (
          <div
            className='cursor-pointer hover:bg-neutral-100 hover:rounded-md'
            onClick={e => handleSend(e)}
          >
            <Image
              src='/icons/plus.svg'
              alt='Plus'
              className='m-3'
              width={14}
              height={14}
              priority
            />
          </div>
        )}
      </div>
    </div>
  )
}
