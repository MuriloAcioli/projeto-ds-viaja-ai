export function ChatLoading() {
  return (
    <div className="self-start max-w-[85%]">
      <div className="p-4 rounded-2xl border border-[#EACFC4] bg-white flex gap-2 items-center rounded-tl-sm">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
