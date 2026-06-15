import { Sidebar } from "@/components/ui/sidebar";
import { RequireAuth } from "@/components/auth/require_auth";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="relative flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-hidden p-3 lg:p-6 z-10">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
