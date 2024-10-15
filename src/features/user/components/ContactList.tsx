import { useEffect } from "react";
import AvatarUI from "@/features/user/components/AvatarUI";
import { useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useUserStore } from "@/features/user/user.store";
import { fetchContactList } from "@/features/user/user.action";
import { createChat } from "@/features/chat/chat.action";

export default function ContactList() {
  const auth = useFirebaseAuth();
  const router = useRouter();
  const state = useUserStore(state => state.contacts);

  const handleOnChat = async (user: UserDoc) => {
    if (!auth.user) {
      return toast.error("You are not logged in");
    }

    const chatId = await createChat({
      targetUID: user.uid,
      fromUID: auth.user.uid,
      type: "private",
    });

    const url = new URL(window.location.href);
    url.searchParams.set("type", "private");
    url.searchParams.set("chatId", chatId);
    url.searchParams.set("sidebarTab", "chat");
    return await router.push(url.toString());
  };

  useEffect(() => {
    if (auth.user?.uid) {
      void fetchContactList(auth.user.uid);
    }
  }, [auth.user?.uid]);

  return (
    <div className="relative h-full rounded py-3 overflow-hidden">
      <h1 className="text-xl font-bold px-3 text-accent-foreground">
        Contacts
      </h1>
      <div className="flex flex-col gap-2 px-3 py-2 w-full">
        {state.list.map(user => (
          <button
            onClick={() => handleOnChat(user)}
            key={user.uid}
            className="flex items-center hover:bg-muted-darker rounded-lg px-3 py-2"
          >
            <AvatarUI
              pictureUrl={user.photoURL?.toString() ?? undefined}
              fallbackText={user.displayName ?? "X"}
            />
            <p className="ml-2">{user.displayName}</p>
          </button>
        ))}
      </div>
      {/*<div className="absolute bottom-0 bg-muted-darker w-full">*/}
      {/*  <div className="flex items-center rounded-lg px-5 py-2">*/}
      {/*    <AvatarUI*/}
      {/*      pictureUrl={auth.user?.photoURL?.toString() ?? undefined}*/}
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
