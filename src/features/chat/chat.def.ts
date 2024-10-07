import { collection, doc, orderBy, query } from "@firebase/firestore";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { ChatHistoryDoc } from "@/features/chat/chat.type";
import { getUserDocRefByUID } from "@/features/user/user.api";
import { ChatType } from "@/features/chat/api/private-message";
import { ChatMessageDoc } from "@/features/chat/actions/message.action";

export const getQueryFetchChatHistory = async (uid: string) => {
  const user = await getUserDocRefByUID(uid);

  return query(
    collection(user, "chats").withConverter(assignTypes<ChatHistoryDoc>()),
    orderBy("lastMessageTime", "desc"),
  );
};

export const getChatDocRef = (chatId: string, chatType: ChatType) => {
  return doc(db, chatType, chatId).withConverter(assignTypes<ChatMessageDoc>());
};

export const getChatMessageCollectionRef = (
  chatId: string,
  chatType: ChatType,
) => {
  return collection(getChatDocRef(chatId, chatType), "messages");
};
