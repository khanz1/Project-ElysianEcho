import { DocumentReference, Timestamp } from "firebase/firestore";
import { UserDoc } from "@/lib/firebase/firebase.type";

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

export type ChatHistory = {
  chatId: string; // Unique identifier for the chat
  chatWithUserUID: string; // UID of the user the chat is with
  lastMessage: string; // The content of the last message
  lastMessageTime: string; // Timestamp of the last message in ISO string format
  user: UserDoc; // The user information
};
