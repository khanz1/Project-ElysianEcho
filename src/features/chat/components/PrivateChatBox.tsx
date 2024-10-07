import React, { useEffect, useRef, useState } from "react";
import { useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { ChatMessage } from "@/features/chat/actions/message.action";
import { cn } from "@/lib/utils";
import { deleteDoc, onSnapshot } from "@firebase/firestore";
import { getMessagesQuery } from "@/features/chat/defs/docs-ref";
import { ChatPageProps } from "@/pages";
import { ChatInputForm } from "@/features/chat/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { wait } from "@/utils/time.helpers";
import {
  fetchPrivateMessages,
  proceedPrivateMessages,
} from "@/features/chat/chat.action";
import { useChatStore } from "@/features/chat/chat.store";
import { toast } from "sonner";
import { MessageBubble } from "@/features/chat/components/ChatBubble";

export const PrivateChatBox = ({ query }: ChatPageProps) => {
  const auth = useFirebaseAuth();
  const bottomElRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [existingChat, setExistingChat] = useState<ChatMessage | null>(null);

  const messages = useChatStore(state => state.messages);
  useEffect(() => {
    fetchPrivateMessages({ chatId: query.chatId, type: "private" }).finally(
      async () => {
        await wait(800);
        bottomElRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    );

    const unsub = onSnapshot(
      getMessagesQuery(query.chatId, "private"),
      async doc => {
        if (!doc.empty) {
          await proceedPrivateMessages(query.chatId, doc);
          await wait(800);
          bottomElRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      },
    );

    return () => {
      unsub();
    };
  }, [query.chatId]);

  useEffect(() => {
    // Function to handle keydown event
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("Esc key was pressed", formMode);
      if (event.key === "Escape" && formMode === "edit") {
        setFormMode("add");
        setExistingChat(null);
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on a component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formMode]);

  const handleOnCopyTextMessage = async (chat: ChatMessage) => {
    await navigator.clipboard.writeText(chat.data().message);
    toast.info("Message copied");
  };

  const handleOnDelete = async (chat: ChatMessage) => {
    await deleteDoc(chat.ref);
  };

  const enterEditMode = () => {
    setFormMode("edit");
    console.log("");
  };

  return (
    <section className="bg-neutral-950 h-full rounded overflow-hidden">
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 px-3 py-3 pb-16">
          {messages.list.map((chat, idx) => {
            const isSender = auth.user?.uid === chat.data().senderUID;
            return (
              <div
                key={idx}
                className={cn(!isSender && "flex gap-3 items-center")}
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <MessageBubble chat={chat} isSender={isSender} />
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-32">
                    {/*<ContextMenuItem>Reply</ContextMenuItem>*/}
                    {chat.data().type === "text" && (
                      <ContextMenuItem
                        onClick={() => handleOnCopyTextMessage(chat)}
                      >
                        Copy
                      </ContextMenuItem>
                    )}
                    {isSender && chat.data().type === "text" && (
                      <ContextMenuItem
                        onClick={async () => {
                          setExistingChat(chat);
                          enterEditMode();

                          await wait(200);
                          inputRef.current?.focus();
                        }}
                      >
                        Edit
                      </ContextMenuItem>
                    )}
                    {isSender && (
                      <ContextMenuItem onClick={() => handleOnDelete(chat)}>
                        Delete
                      </ContextMenuItem>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            );
          })}
          <div ref={bottomElRef} />
        </div>
      </ScrollArea>

      <div
        id="chat-box"
        className="absolute bottom-0 bg-neutral-900 py-3 w-full px-3"
      >
        {formMode === "edit" && (
          <div className="px-10 py-2">
            <div className="flex bg-neutral-800 rounded-xl overflow-hidden w-full">
              <div className="w-2 bg-sky-600" />
              <div className="px-3 py-2">
                <p className="text-neutral-100">
                  {existingChat?.data().senderUID === auth.user?.uid
                    ? "You"
                    : existingChat?.data().senderUID}
                </p>
                <p>{existingChat?.data().message}</p>
              </div>
            </div>
          </div>
        )}
        <ChatInputForm
          query={query}
          ref={inputRef}
          formMode={formMode}
          chat={existingChat}
          setFormMode={setFormMode}
          setExistingChat={setExistingChat}
        />
      </div>
    </section>
  );
};
