import { ChatHistory } from "@/features/chat/chat.type";
import { cn } from "@/lib/utils";
import AvatarUI from "@/features/user/components/AvatarUI";
import { getTimeMessage } from "@/utils/time.formatter";

export interface ChatHistoryItemProps {
  chat: ChatHistory;
  onClick: () => void;
  activeChat: boolean;
}

export const ChatHistoryItem = (props: ChatHistoryItemProps) => {
  const chat = props.chat.data();
  const user = props.chat.user.data();

  return (
    <button
      onClick={props.onClick}
      className={cn(
        "flex w-full rounded-md items-center hover:bg-muted-darker py-2 px-3",
        props.activeChat && "bg-muted-darker",
      )}
    >
      <AvatarUI
        pictureUrl={user.photoURL ?? undefined}
        fallbackText={user.displayName ?? "X"}
      />
      <div className="w-full flex flex-col items-start pl-3 min-w-0">
        <div className="flex justify-between items-center w-full">
          <div className="text-accent-foreground">{user.displayName}</div>
          <p className="text-sm text-muted-foreground uppercase text-right">
            {getTimeMessage(chat.lastMessageTime?.toDate())}
          </p>
        </div>
        <p className="text-sm text-muted-foreground truncate w-full text-left">
          {chat.lastMessage}
        </p>
      </div>
    </button>
  );
};
