"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Home, MessageSquare, History, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    if (isActive && path !== "/") {
      return "flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/70 text-[#A63C3C] shadow-sm font-semibold transition-colors border border-white/50";
    }
    return "flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100";
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get initials from the user's name
  const initials = user?.nome
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fundo-login.jpg"
          alt="Fundo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>


      <aside className="w-20 lg:w-64 shrink-0 flex flex-col justify-between h-full py-8 border-r border-white/40 bg-white/40 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all z-20">
        <div className="flex flex-col gap-10 px-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start lg:px-4 hover:opacity-80 transition-opacity">
            <div className="hidden lg:block">
              <Image src="/logo.png" width={120} height={50} alt="Logo ViajaAí" className="object-contain" />
            </div>
            <div className="flex lg:hidden w-12 h-12 bg-[#0F2942] rounded-xl items-center justify-center shadow-lg transition-transform active:scale-95">
              <Compass className="text-white" size={26} strokeWidth={2} />
            </div>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
              <Home size={22} strokeWidth={1.5} />
              <span className="hidden lg:block font-medium">Início</span>
            </Link>

            <Link href="/explorar" className={getLinkStyle("/explorar")}>
              <Compass size={22} strokeWidth={pathname === "/explorar" ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Explorar</span>
            </Link>

            <Link href="/chat" className={getLinkStyle("/chat")}>
              <MessageSquare size={22} strokeWidth={pathname.startsWith("/chat") ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Novo Roteiro</span>
            </Link>

            <Link href="/historico" className={getLinkStyle("/historico")}>
              <History size={22} strokeWidth={pathname === "/historico" ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Histórico</span>
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <Link href="/configuracoes" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
            <Settings size={22} strokeWidth={1.5} />
            <span className="hidden lg:block font-medium">Configurações</span>
          </Link>

          {user && (
            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/50 border border-white/60">
              <div className="w-9 h-9 shrink-0 rounded-full bg-[#0F2942] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-[#0F2942] truncate">{user.nome}</span>
                <span className="text-xs text-gray-500 truncate">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sair"
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Mobile logout button */}
          {user && (
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex lg:hidden items-center justify-center p-3 rounded-2xl text-[#0F2942] hover:bg-red-50 hover:text-red-500 transition-colors opacity-70 hover:opacity-100"
            >
              <LogOut size={22} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}