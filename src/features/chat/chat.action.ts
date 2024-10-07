import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  getChatDocRef,
  getChatMessageCollectionRef,
  getQueryFetchChatHistory,
} from "@/features/chat/chat.def";
import {
  ChatDoc,
  ChatHistory,
  ChatHistoryDoc,
  ChatType,
  CreateMessageParams,
  GetMessagesParams,
  UpdateMessageParams,
} from "@/features/chat/chat.type";
import { useChatStore } from "@/features/chat/chat.store";
import { getMessagesQuery } from "@/features/chat/defs/docs-ref";
import {
  ChatMessage,
  ChatMessageDoc,
} from "@/features/chat/actions/message.action";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { FirebaseError } from "@firebase/app";
import { User } from "@/lib/firebase/firebase.type";
import { getStorage, ref, uploadBytes } from "@firebase/storage";
import { generateFileName, generateFileURL } from "@/utils/storage.helpers";
import {
  fetchUserByRef,
  fetchUserByUID,
  fetchUserChatHistoryRef,
} from "@/features/user/user.action";
import { objectifyChatParticipants } from "@/features/chat/chat.helper";

export const setChatHistory = async (
  history: QuerySnapshot<ChatHistoryDoc>,
) => {
  const chatHistory: ChatHistory[] = [];

  for (const doc of history.docs) {
    const user = await fetchUserByUID(doc.data().chatWithUserUID);
    const data = Object.assign(doc, { user });
    chatHistory.push(data);
  }

  useChatStore.setState({ history: { list: chatHistory, isLoading: false } });
};

export const fetchChatHistory = async (uid: string) => {
  useChatStore.setState({ history: { list: [], isLoading: true } });
  const query = await getQueryFetchChatHistory(uid);

  const chatHistoryData = await getDocs(query);
  await setChatHistory(chatHistoryData);
};

export const getChatParticipants = async (chatId: string) => {
  const chatDocRef = getChatDocRef(chatId, "private");
  const chat = await getDoc(chatDocRef.withConverter(assignTypes<ChatDoc>()));
  const data = chat.data();

  if (!chat.exists() || !data) {
    throw new FirebaseError("not-found", "Chat not found");
  }

  const participants: User[] = [];
  for (const participantRef of data.participants) {
    const user = await fetchUserByRef(participantRef);
    if (user) {
      participants.push(user);
    }
  }

  return participants;
};

export const proceedPrivateMessages = async (
  chatId: string,
  privateMessages: QuerySnapshot<ChatMessageDoc>,
) => {
  const userDocsList = await getChatParticipants(chatId);
  const userList = objectifyChatParticipants(userDocsList);

  const messages: ChatMessage[] = [];

  privateMessages.forEach(doc => {
    const senderUID = doc.data().senderUID;
    const sender = userList[senderUID];

    messages.push(Object.assign(doc, { sender }));
  });

  useChatStore.setState({ messages: { list: messages, isLoading: false } });
};

export const fetchPrivateMessages = async (params: GetMessagesParams) => {
  useChatStore.setState({ messages: { list: [], isLoading: true } });
  const messagesQuery = getMessagesQuery(params.chatId, params.type);
  const messagesCollection = await getDocs(messagesQuery);

  await proceedPrivateMessages(params.chatId, messagesCollection);
};

export const getChat = async (chatId: string, type: ChatType) => {
  const chatDocRef = getChatDocRef(chatId, type);
  const chat = await getDoc(chatDocRef.withConverter(assignTypes<ChatDoc>()));

  if (!chat.exists()) {
    throw new FirebaseError("not-found", "Chat not found");
  }

  return chat;
};

export const updateMessage = async (props: UpdateMessageParams) => {
  // const user = await fetchUserByUID(props.senderUID);
  // const chatMessageCollectionRef = getChatMessageCollectionRef(
  //   props.chatId,
  //   "private",
  // );
  //
  // // 3. gets the data of the chat
  // const chat = await getChat(props.chatId, "private");
  //
  // const [user1Ref, user2Ref] = chat.data().participants;
  // const [chatHistoryUser1, chatHistoryUser2] = await Promise.all([
  //   fetchUserChatHistoryRef(user1Ref, props.chatId),
  //   fetchUserChatHistoryRef(user2Ref, props.chatId),
  // ]);
  // const [user1, user2] = await Promise.all([
  //   fetchUserByRef(user1Ref),
  //   fetchUserByRef(user2Ref),
  // ]);
  //
  // const chatDocRef = getChatDocRef(props.chatId, "private");
  //
  // const message = {
  //   type: "text",
  //   message: props.message,
  //   sender: user.ref,
  //   senderUID: props.senderUID,
  //   isEdited: false,
  //   editedAt: null,
  //   isDeleted: false,
  //   deletedAt: null,
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now(),
  // };
  //
  // // 1. updating messages
  // // 1.1 in messages collection -> private/chatId/messages
  // await updateDoc(chatMessageCollectionRef, message);
};

export const createMessage = async (props: CreateMessageParams) => {
  const user = await fetchUserByUID(props.senderUID);
  const chatMessageCollectionRef = getChatMessageCollectionRef(
    props.chatId,
    "private",
  );

  // 3. gets the data of the chat
  const chat = await getChat(props.chatId, "private");

  const [user1Ref, user2Ref] = chat.data().participants;
  const [chatHistoryUser1, chatHistoryUser2] = await Promise.all([
    fetchUserChatHistoryRef(user1Ref, props.chatId),
    fetchUserChatHistoryRef(user2Ref, props.chatId),
  ]);
  const [user1, user2] = await Promise.all([
    fetchUserByRef(user1Ref),
    fetchUserByRef(user2Ref),
  ]);

  const chatDocRef = getChatDocRef(props.chatId, "private");

  if (props.type === "text") {
    const message = {
      type: "text",
      message: props.message,
      sender: user.ref,
      senderUID: props.senderUID,
      isEdited: false,
      editedAt: null,
      isDeleted: false,
      deletedAt: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    // 1. updating messages
    // 1.1 in messages collection -> private/chatId/messages
    await addDoc(chatMessageCollectionRef, message);

    // 2. updating chat
    // 2.1 in a chat collection → private/chatId
    await updateDoc(chatDocRef, {
      lastMessage: message,
      updatedAt: Timestamp.now(),
    });

    if (user1.data().uid === props.senderUID) {
      await updateDoc(chatHistoryUser1, {
        chatId: props.chatId,
        lastMessage: props.message,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: user2.data().uid,
      });
      await updateDoc(chatHistoryUser2, {
        chatId: props.chatId,
        lastMessage: props.message,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: props.senderUID,
      });
    } else {
      await updateDoc(chatHistoryUser2, {
        chatId: props.chatId,
        lastMessage: props.message,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: user1.data().uid,
      });
      await updateDoc(chatHistoryUser1, {
        chatId: props.chatId,
        lastMessage: props.message,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: props.senderUID,
      });
    }
  } else if (props.type === "file") {
    const storage = getStorage();
    const fileName = `images/${generateFileName(props.file.name)}`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, props.file);
    const fileURL = generateFileURL(snapshot);

    await addDoc(chatMessageCollectionRef, {
      type: "file",
      fileURL,
      sender: user.ref,
      senderUID: props.senderUID,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // 2. updating chat
    // 2.1 in a chat collection → private/chatId
    await updateDoc(chatDocRef, {
      lastMessage: {
        type: "file",
        fileURL,
        senderUID: props.senderUID,
        sender: user.ref,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    });

    if (user1.data().uid === props.senderUID) {
      await updateDoc(chatHistoryUser1, {
        type: "file",
        chatId: props.chatId,
        fileURL,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: user2.data().uid,
      });
      await updateDoc(chatHistoryUser2, {
        type: "file",
        chatId: props.chatId,
        fileURL,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: props.senderUID,
      });
    } else {
      await updateDoc(chatHistoryUser2, {
        type: "file",
        chatId: props.chatId,
        fileURL,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: user1.data().uid,
      });
      await updateDoc(chatHistoryUser1, {
        type: "file",
        chatId: props.chatId,
        fileURL,
        lastMessageTime: Timestamp.now(),
        chatWithUserUID: props.senderUID,
      });
    }
  }
};

export interface CreateChatParams {
  targetUID: string;
  fromUID: string;
  type: ChatType;
}

export const fetchIsUserHasChatHistory = async (
  sender: User,
  targetUID: string,
) => {
  const snapshot = await getDocs(
    query(
      collection(sender.ref, "chats"),
      where("chatWithUserUID", "==", targetUID),
    ).withConverter(assignTypes<ChatHistoryDoc>()),
  );
  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0];
};

export const createChat = async (props: CreateChatParams) => {
  const receiverUser = await fetchUserByUID(props.targetUID);
  const senderUser = await fetchUserByUID(props.fromUID);

  if (props.type === "private") {
    const privateChatCollectionRef = collection(db, "private");

    const chatHistory = await fetchIsUserHasChatHistory(
      senderUser,
      props.targetUID,
    );

    if (chatHistory) {
      return chatHistory.data().chatId;
    }

    const chat = await addDoc(privateChatCollectionRef, {
      participants: [receiverUser.ref, senderUser.ref],
      lastMessage: {
        message: "Chat created",
        senderUID: props.fromUID,
        sender: senderUser.ref,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      type: props.type,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await addDoc(collection(receiverUser.ref, "chats"), {
      chatId: chat.id,
      type: "initial",
      lastMessage: null,
      lastMessageTime: Timestamp.now(),
      chatWithUserUID: senderUser.data().uid,
    });
    await addDoc(collection(senderUser.ref, "chats"), {
      chatId: chat.id,
      type: "initial",
      lastMessage: null,
      lastMessageTime: Timestamp.now(),
      chatWithUserUID: receiverUser.data().uid,
    });

    return chat.id;
  }

  throw new FirebaseError("invalid-argument", "Not yet implemented");
};
