import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "@firebase/firestore";

type UserAccountVisibility = "public" | "private";

export interface UserChat {
  chatId: string;
  chatWithUserUID: string;
  user: UserDoc;
  lastMessage: Timestamp;
  lastMessageTime: Timestamp;
}

export interface UserDoc extends DocumentData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string | null;
  phoneNumber: string | null;
  accountVisibility: UserAccountVisibility;
  chats: UserChat[];
}

export type User = QueryDocumentSnapshot<UserDoc>;

// Utility type to transform Timestamp to string recursively
type TransformTimestampToString<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? string
    : T[K] extends Array<infer U>
      ? Array<TransformTimestampToString<U>>
      : T[K] extends object
        ? TransformTimestampToString<T[K]>
        : T[K];
};

export type SerializeUserDoc = TransformTimestampToString<UserDoc>;
