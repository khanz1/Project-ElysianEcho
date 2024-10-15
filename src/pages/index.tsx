import { GetServerSideProps } from "next";
import React from "react";
import ChatList from "@/features/chat/components/ChatList";
import { PrivateChatBox } from "@/features/chat/components/PrivateChatBox";
import ContactList from "@/features/user/components/ContactList";
import { ChatType } from "@/features/chat/chat.type";

export const getServerSideProps: GetServerSideProps = async context => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};

export interface ChatPageProps {
  query: {
    chatId: string;
    type: ChatType;
    tab?: string;
    sidebarTab: "chat" | "contacts";
  };
}

export default function ChatPage({ query }: ChatPageProps) {
  return (
    <main className="h-screen">
      <div className="grid grid-cols-12 h-full">
        <div className="hidden sm:block sm:col-span-6 md:col-span-5 lg:col-span-3 border-r-2 border-muted-darker bg-background">
          {query.sidebarTab === "chat" ? (
            <ChatList query={query} />
          ) : (
            <ContactList />
          )}
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-7 lg:col-span-9 bg-background relative">
          {query.type === "private" ? (
            <PrivateChatBox query={query} />
          ) : (
            <div className="h-full w-full flex justify-center items-center">
              <h1>Chat first</h1>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
