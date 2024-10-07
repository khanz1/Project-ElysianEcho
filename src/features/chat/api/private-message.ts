import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { getUserDocRefByUID } from "@/features/user/user.api";
import { FirebaseError } from "@firebase/app";
import { db } from "@/lib/firebase/firebase";

export type ChatType = "private" | "group" | "world";

export const createChat = async ({
  targetUID,
  fromUID,
  type,
}: {
  targetUID: string;
  fromUID: string;
  type: ChatType;
}): Promise<string> => {
  const targetUserRef = await getUserDocRefByUID(targetUID);
  const fromUserRef = await getUserDocRefByUID(fromUID);

  if (type === "private") {
    const privateChatCollectionRef = collection(db, "private");
    const chat = await addDoc(privateChatCollectionRef, {
      participants: [targetUserRef, fromUserRef],
      lastMessage: {
        message: "Chat created",
        senderUID: fromUID,
        sender: fromUserRef,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      type,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // const chatId = chat.id;

    // const [targetChatRef, fromChatRef] = await Promise.all([
    //   getUserChatRef(targetUserRef, chatId),
    //   getUserChatRef(fromUserRef, chatId),
    // ]);

    // const [user1Ref, user2Ref] = data.participants;
    // const [chatHistoryUser1, chatHistoryUser2] = await Promise.all([
    //   getUserChatRef(user1Ref, chatId),
    //   getUserChatRef(user2Ref, chatId),
    // ]);

    // const user2 = await getUserByRef(user2Ref);

    // await updateDoc(targetChatRef, {
    //   chatId,
    //   lastMessage: message,
    //   lastMessageTime: serverTimestamp(),
    //   chatWithUserUID: targetUID,
    // });
    // await updateDoc(fromChatRef, {
    //   chatId,
    //   lastMessage: message,
    //   lastMessageTime: serverTimestamp(),
    //   chatWithUserUID: fromUID,
    // });

    return chat.id;
  }

  throw new FirebaseError("invalid-argument", "Not yet implemented");
};
