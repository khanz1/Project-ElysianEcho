import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import {
  collection,
  DocumentReference,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
} from "@firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import {
  getUserByUID,
  getUserListByUIDs,
} from "@/features/auth/actions/user.action";
import { UserChat, UserDoc } from "@/lib/firebase/firebase.type";
import { serializeDocs } from "@/utils/serialize";

// Document Definition
export interface ChatMessageDoc {
  type: "text" | "file";
  fileURL: string;
  message: string;
  senderUID: string;
  isEdited: boolean;
  editedAt: Timestamp | null;
  isDeleted: boolean;
  deletedAt: Timestamp | null;
  sender: DocumentReference<UserDoc>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Application Definition
export type ChatMessage = QueryDocumentSnapshot<ChatMessageDoc> & {
  sender: QueryDocumentSnapshot<UserDoc>;
};

export interface BaseChatMessage {
  type: "text" | "file";
  fileURL: string;
  message: string;
  senderUID: string;
}
export interface SerializedChatMessageDoc extends BaseChatMessage {
  sender: UserDoc;
  updatedAt: string;
  createdAt: string;
}

// Define a type for a User reference
type UserRef = DocumentReference;

// Define a type for the LastMessage
interface LastMessage {
  message: string | null;
  senderUID: string;
  sender: UserDoc;
  sentTime: string;
}
export type ChatType = "private" | "group";
export type SidebarType = "chat" | "contact";

export const messagesQuery = query(
  collection(db, "world"),
  orderBy("createdAt", "asc"),
);

export const getChatHistory = createAsyncThunk(
  "chat/getChatHistory",
  async (uid: string, { dispatch }) => {
    const userActions = await dispatch(getUserByUID(uid));
    const chatList = unwrapResult(userActions)?.chats;

    if (!chatList) {
      return [];
    }

    const actionUserList = await dispatch(
      getUserListByUIDs(chatList.map(chat => chat.chatWithUserUID)),
    );
    const userList = unwrapResult(actionUserList);

    const chatWithUserMap = userList.reduce(
      (acc, user) => {
        acc[user.uid] = user;
        return acc;
      },
      {} as Record<string, UserDoc>,
    );

    return serializeDocs(
      chatList.map(chat => {
        return {
          ...chat,
          user: chatWithUserMap[chat.chatWithUserUID],
        };
      }),
    ) as UserChat[];
  },
);
