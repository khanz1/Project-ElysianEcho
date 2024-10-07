import { UserChat } from "@/lib/firebase/firebase.type";
import React from "react";
import { linkedAccounts } from "@/features/user/user.constant";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

interface LoadingState {
  isLoading: boolean;
}

interface ContactsState extends LoadingState {
  list: UserDoc[];
}

export interface LinkedAccount<T extends string = string> {
  providerId: T;
  providerName: string;
  isLoading: boolean;
  icon: React.ReactElement;
}

export type AuthState = {
  contacts: ContactsState;
  linkedAccounts: LinkedAccount[];
};

export type ProviderIDs = (typeof linkedAccounts)[number]["providerId"];

type UserAccountVisibility = "public" | "private";

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
