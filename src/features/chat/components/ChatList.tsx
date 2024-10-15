import { useEffect } from "react";
import { useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { onSnapshot } from "@firebase/firestore";
import { fetchChatHistory, setChatHistory } from "@/features/chat/chat.action";
import { getQueryFetchChatHistory } from "@/features/chat/chat.def";
import { useChatStore } from "@/features/chat/chat.store";
import { ChatHistory } from "@/features/chat/chat.type";
import { ChatPageProps } from "@/pages";
import { ChatHistoryItem } from "@/features/chat/components/ChatHistoryCard";

export default function ChatList({ query }: ChatPageProps) {
  const auth = useFirebaseAuth();
  const router = useRouter();
  const state = useChatStore(state => state.history);

  const openChatBox = async (chat: ChatHistory) => {
    if (!auth.user) {
      return toast.error("You are not logged in");
    }

    const url = new URL(window.location.href);
    url.searchParams.set("chatId", chat.data().chatId);
    url.searchParams.set("type", "private");

    return await router.push(url.toString());
  };

  useEffect(() => {
    (async () => {
      if (auth.user?.uid) {
        void fetchChatHistory(auth.user.uid);

        const query = await getQueryFetchChatHistory(auth.user.uid);
        onSnapshot(query, setChatHistory);
      }
    })();
  }, [auth.user?.uid]);

  return (
    <div className="relative h-full rounded py-3">
      <h1 className="text-xl font-bold px-3 text-accent-foreground">Chats</h1>
      <div className="flex flex-col gap-2 px-3 py-2 w-full">
        {state.list.map(chat => (
          <ChatHistoryItem
            key={chat.data().chatId}
            chat={chat}
            onClick={() => openChatBox(chat)}
            activeChat={query.chatId === chat.data().chatId}
          />
        ))}
      </div>
      {/*<div className="absolute bottom-0 bg-muted-darker w-full">*/}
      {/*  <div className="flex items-center px-5 py-2">*/}
      {/*    <AvatarUI*/}
      {/*      pictureUrl={auth.user?.photoURL ?? undefined}*/}
      {/*      fallbackText={auth.user?.displayName ?? "X"}*/}
      {/*    />*/}
      {/*    <p className="ml-2 text-accent-foreground">*/}
      {/*      {auth.user?.displayName}*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
