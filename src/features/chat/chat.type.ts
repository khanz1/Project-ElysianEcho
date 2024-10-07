import { DocumentReference, Timestamp } from "firebase/firestore";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { QueryDocumentSnapshot } from "@firebase/firestore";

// Document Definition
export type ChatHistoryDoc = {
  chatId: string; // Unique identifier for the chat
  chatWithUserUID: string; // UID of the user the chat is with
  lastMessage: string; // The content of the last message
  lastMessageTime: Timestamp; // Timestamp of the last message in ISO string format
};

export type ChatDoc = {
  createdAt: Timestamp;
  lastMessage: Message;
  participants: DocumentReference<UserDoc>[];
  updatedAt: Timestamp | null;
};

// Application Definition
export type ChatHistory = QueryDocumentSnapshot<ChatHistoryDoc> & {
  user: QueryDocumentSnapshot<UserDoc>;
};

// Others Definition
export interface CreateTextMessageParams {
  type: "text";
  chatId: string;
  message: string;
  senderUID: string;
}

export type UpdateMessageParams = CreateTextMessageParams;

export interface CreateFileMessageParams {
  type: "file";
  chatId: string;
  file: File;
  senderUID: string;
}
export type CreateMessageParams =
  | CreateTextMessageParams
  | CreateFileMessageParams;

export type Message = {
  message: string;
  sender: DocumentReference;
  senderUID: string;
  sentTime: Timestamp | null;
};

export type Chat = {
  createdAt: Timestamp;
  lastMessage: Message;
  participants: DocumentReference[];
  updatedAt: Timestamp | null;
};

type ChatMessage = {
  message: string;
  sender: DocumentReference; // Firestore DocumentReference for the sender
  senderUID: string; // UID of the sender
  createdAt: Timestamp; // Firestore Timestamp for the message creation time
  updatedAt: Timestamp; // Firestore Timestamp for when the message was last updated
};

export interface GetMessagesParams {
  chatId: string;
  type: ChatType;
}

export type ChatType = "private" | "group" | "world";
