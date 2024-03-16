import Link from "next/link";

interface Chat {
  id: number;
  latestMessage: string;
  user: {
    name: string;
    avatar: string;
  };
}
export default function ChatList() {
  const chatList: Chat[] = [];

  return (
    <div>
      <Link
        href="/"
        className="flex gap-5 px-5 bg-slate-100 py-2 rounded-md my-1 hover:bg-slate-200"
      >
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-house" />
          <h5 className="font-bold">Home</h5>
        </div>
      </Link>
      {chatList.map((chat) => (
        <Link
          href="/groups/global"
          key={chat.id}
          className="flex gap-5 px-5 bg-slate-100 py-2 rounded-md my-1 hover:bg-slate-200"
        >
          <h5 className="font-bold">{chat.user.name}</h5>
        </Link>
      ))}
    </div>
  );
}
