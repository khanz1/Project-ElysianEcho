import { collection, doc, limit, orderBy, query } from "@firebase/firestore";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { ChatType } from "@/features/chat/api/private-message";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { ChatMessageDoc } from "@/features/chat/actions/message.action";

export const getChatDocRef = (chatId: string, chatType: ChatType) => {
  return doc(db, chatType, chatId).withConverter(assignTypes<ChatMessageDoc>());
};

export const getMessageCollectionRef = (chatId: string, chatType: ChatType) => {
  return collection(getChatDocRef(chatId, chatType), "messages");
};

export const getMessagesQuery = (chatId: string, chatType: ChatType) => {
  return query(
    getMessageCollectionRef(chatId, chatType),
    orderBy("createdAt", "asc"),
    limit(50),
  ).withConverter(assignTypes<ChatMessageDoc>());
};

export const userCollectionRefBase = collection(db, "users");
export const userCollectionRef =
  userCollectionRefBase.withConverter(assignTypes<UserDoc>());
