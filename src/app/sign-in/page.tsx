import Image from "next/image";

export default function SignInPage() {
  return (
    <main className="min-h-screen dark:bg-neutral-900">
      <div className="flex items-center flex-col justify-center h-full">
        <h1 className="text-neutral-200 text-xl">Elysian Echo</h1>
        <div className="flex gap-10">
          <Image
            src="/images/man-in-the-bar-with-laptop.jpg"
            alt="Man in the bar with laptop"
            width={250}
            height={300}
          />
          <button className="rounded bg-neutral-500 px-5 py-2 hover:bg-neutral-600 text-neutral-300">
            button google
          </button>
        </div>
      </div>
    </main>
  );
}
