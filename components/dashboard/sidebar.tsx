"use client";
import { Home, CheckSquare, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/src/stores/useAuthStore";

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const NavLink = ({ href, icon: Icon, children, onClick }: { href: string; icon: any; children: React.ReactNode; onClick?: () => void }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`flex items-center space-x-2 p-2 rounded ${isActive ? "bg-slate-700" : "hover:bg-slate-700"}`} onClick={onClick}>
        <Icon size={20} />
        <span>{children}</span>
      </Link>
    );
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      localStorage.removeItem("auth-storage");
      router.push("/login");
    }
  };

  return (
    <div className="w-60 bg-slate-800 sticky top-0 h-screen text-white flex flex-col border-r-2">
      <div className="flex-grow p-4 space-y-4">
        <NavLink href="/" icon={Home}>
          Dashboard
        </NavLink>
        <NavLink href="/tasks" icon={CheckSquare}>
          Tasks
        </NavLink>
      </div>
      <div className="p-4 mb-20 border-t border-slate-700">
        <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
