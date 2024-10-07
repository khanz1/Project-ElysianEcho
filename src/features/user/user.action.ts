import {
  addDoc,
  collection,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  getQueryGetUserByUID,
  getQueryUserByUID,
  userCollectionRef,
} from "@/features/user/user.def";
import { useUserStore } from "@/features/user/user.store";
import { FirebaseError } from "@firebase/app";
import { UserDoc } from "@/features/user/user.type";
import { assignTypes } from "@/lib/firebase/firebase";
import { UserCredential } from "@firebase/auth";

export const fetchContactList = async (uid: string) => {
  useUserStore.setState(state => {
    state.contacts.isLoading = true;
  });
  const { docs } = await getDocs(getQueryGetUserByUID(uid));

  useUserStore.setState({
    contacts: {
      list: docs.map(doc => doc.data()),
      isLoading: false,
    },
  });
};

export const setLinkedAccountsLoading = (
  providerId: string,
  isLoading: boolean,
) => {
  useUserStore.setState(state => {
    const account = state.linkedAccounts.find(
      account => account.providerId === providerId,
    );
    if (account) {
      account.isLoading = isLoading;
    }
  });
};

export const createUser = async ({ user, providerId }: UserCredential) => {
  const docRef = await addDoc(userCollectionRef, {
    email: user.email,
    uid: user.uid,
    providerId: providerId,
    photoURL: user.photoURL,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    accountVisibility: "public",
    chats: [],
  } satisfies UserDoc);

  // get the data from creation
  const doc = await getDoc(docRef.withConverter(assignTypes<UserDoc>()));
  if (doc.exists()) {
    return doc;
  } else {
    throw new FirebaseError("not-found", "User not found");
  }
};

export const fetchUserByUID = async (uid: string) => {
  const query = getQueryUserByUID(uid);
  const snapshot = await getDocs(query);

  if (snapshot.empty) {
    throw new FirebaseError("not-found", "User not found");
  }

  return snapshot.docs[0];
};

export const updateUserByUID = async (user: QueryDocumentSnapshot<UserDoc>) => {
  const dataToUpdate: Partial<UserDoc> = {};
  for (const [key, value] of Object.entries(user)) {
    if (!value) {
      dataToUpdate[key as keyof UserDoc] = user.data()[key as keyof UserDoc];
    }
  }

  if (Object.keys(dataToUpdate).length > 0) {
    await updateDoc(user.ref, dataToUpdate);
  }
};

export const fetchUserChatHistoryRef = async (
  userRef: DocumentReference<UserDoc>,
  chatId: string,
) => {
  const q = query(collection(userRef, "chats"), where("chatId", "==", chatId));
  const docs = await getDocs(q);

  if (docs.empty) {
    return await addDoc(collection(userRef, "chats"), {});
  }

  return docs.docs[0].ref;
};

export const fetchUserByRef = async (ref: DocumentReference<UserDoc>) => {
  const doc = await getDoc(ref.withConverter(assignTypes<UserDoc>()));
  if (!doc.exists()) {
    throw new FirebaseError("not-found", "User not found");
  }

  return doc;
};

export const createOrUpdateUserByUID = async (auth: UserCredential) => {
  const user = await fetchUserByUID(auth.user.uid);

  if (user.exists()) {
    await updateUserByUID(user);
    return user;
  }

  return await createUser(auth);
};
