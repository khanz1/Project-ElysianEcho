import { chatDateFormatter } from "../helpers/date-formatter";
import ChatList from "@/components/ChatList";
import { IconSend } from "@tabler/icons-react";

const chats = [
  {
    id: 1,
    message: "how are you today?",
    createdAt: new Date().toISOString(),
    sender: true,
  },
  {
    id: 2,
    message: "I'm fine, thank you",
    createdAt: new Date().toISOString(),
    sender: false,
  },
];

export default function ChatPage() {
  return (
    <main className="h-screen overflow-y-auto">
      <div className="flex justify-center items-center h-full">
        <div className="flex border-2 border-solid h-5/6 w-5/6 border-slate-100 rounded-xl overflow-hidden">
          <div className="relative w-2/6 border-r-2 border-solid p-2">
            <ChatList />
          </div>
          <div className="w-4/6 bg-slate-100">
            <div className="relative h-full">
              <img
                src="https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg"
                alt="background"
                className="absolute inset-0 w-full h-full object-cover opacity-5"
              />
              <section className="px-5 flex flex-col gap-3 py-5 relative overflow-y-auto h-full h-5/6">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${
                      chat.sender ? "justify-start" : "justify-end"
                    }`}
                  >
                    <span className="rounded-lg bg-slate-200 border-1 border-slate-500 border-solid px-3 py-1">
                      <div className="flex items-end gap-5">
                        <p>{chat.message}</p>
                        <span className="text-xs text-slate-400">
                          {chatDateFormatter(new Date(chat.createdAt))}
                        </span>
                      </div>
                    </span>
                  </div>
                ))}
              </section>
            </div>
            <div className="w-full sticky bottom-0">
              <form className="flex gap-3 px-5 py-2 bg-slate-200">
                <input className="w-full rounded-full p-2 active:ring-emerald-600 ring-2" />
                <button className="rounded-full bg-emerald-400 text-slate-50 p-2 hover:bg-emerald-300">
                  <IconSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
