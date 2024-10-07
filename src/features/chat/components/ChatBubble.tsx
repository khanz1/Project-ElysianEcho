import { ChatMessage } from "@/features/chat/actions/message.action";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getTimeMessage } from "@/utils/time.formatter";
import React from "react";

interface MessageBubbleProps {
  chat: ChatMessage;
  isSender: boolean;
}

export const MessageBubble = (props: MessageBubbleProps) => {
  const chat = props.chat.data();
  const isSender = props.isSender;
  return (
    <div
      className={cn(
        "flex flex-row",
        isSender ? "justify-end" : "hover:opacity-80",
      )}
    >
      <div
        className={cn(
          chat.type === "file" ? "p-1" : "px-2 py-1",
          "bg-neutral-800 rounded-xl flex max-w-2xl",
        )}
      >
        {chat.type === "file" ? (
          <div className="relative">
            <Image
              src={chat.fileURL}
              alt="file"
              width={250}
              height={250}
              className="rounded-lg"
            />
            <p className="px-2 text-sm rounded text-neutral-100 line-clamp-6 break-words">
              {chat.message}
            </p>

            <p className="absolute bottom-0 right-0 text-neutral-100 text-xxs self-end mx-3 my-1 uppercase">
              {getTimeMessage(chat.createdAt.toDate())}
            </p>
          </div>
        ) : (
          <>
            <p className="px-2 text-sm rounded text-neutral-100 line-clamp-6 break-words">
              {chat.message}
              {chat.isEdited && (
                <span className="text-xs px-2 text-gray-400">Edited</span>
              )}
            </p>
            <p className="text-neutral-100 text-xxs self-end uppercase">
              {getTimeMessage(chat.createdAt.toDate())}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
