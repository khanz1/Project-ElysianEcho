import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ChatHistory } from "@/features/chat/chat.type";
import { ChatMessage } from "@/features/chat/actions/message.action";

export type ChatState = {
  history: {
    list: ChatHistory[];
    isLoading: boolean;
  };
  messages: {
    list: ChatMessage[];
    isLoading: boolean;
  };
};

export const useChatStore = create<ChatState>()(
  immer(set => ({
    history: {
      list: [],
      isLoading: false,
    },
    messages: {
      list: [],
      isLoading: false,
    },
  })),
);
