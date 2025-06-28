import { Channel } from "@pubnub/chat";

export enum ChatNameModals {
  UNDEFINED = "undefined",
  USER = "user",
  CHANNEL = "channel",
}

export enum MessageActionsTypes {
  REPLY_IN_THREAD = "reply",
  QUOTE = "quote",
  PIN = "pin",
  COPY = "copy",
  SHOW_EMOJI = "show_emoji",
}

export enum ChatHeaderActionIcon {
  MARK_READ = 0,
  ADD = 1,
  NONE = 2,
}

export interface UnreadMessagesOnChannel {
  channel: Channel;
  count: number;
}

export enum ToastType {
  INFO = 0,
  CHECK = 1,
  ERROR = 2,
}

export enum PresenceIcon {
  NOT_SHOWN = -1,
  OFFLINE = 0,
  ONLINE = 1,
}

export enum ChatEventTypes {
  LEAVE = 0, //  Notify other members of a group that you are leaving that group
  JOINED = 3, //  Notify others in a group that you have joined as a new member (for public channels)
}

//  Credit: https://gist.github.com/gabrielmlinassi/234519eacaf73f75812b48ea3e94ee6e
//  Used to only minimze the chat selection pane if we are running on a small screen
import { useState, useEffect, useLayoutEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => window.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}


// -------------------------
// useBreakpoints

export function useBreakpoints() {
  const [isClient, setIsClient] = useState(false);

  const breakpoints = {
    isXs: useMediaQuery("(max-width: 640px)"),
    isSm: useMediaQuery("(min-width: 641px) and (max-width: 768px)"),
    isMd: useMediaQuery("(min-width: 769px) and (max-width: 1024px)"),
    isLg: useMediaQuery("(min-width: 1025px)"),
    active: "SSR",
  };
  
  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  if (isClient && breakpoints.isXs) breakpoints.active = "xs";
  if (isClient && breakpoints.isSm) breakpoints.active = "sm";
  if (isClient && breakpoints.isMd) breakpoints.active = "md";
  if (isClient && breakpoints.isLg) breakpoints.active = "lg";

  return breakpoints;
}


