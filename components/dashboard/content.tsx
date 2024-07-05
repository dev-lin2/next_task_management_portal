"use client";

import useAuthStore from "@/src/stores/useAuthStore";
import Sidebar from "./sidebar";

interface ContentProps {
  children: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
  const token = useAuthStore((state) => state.token);
  return (
    <div className="flex flex-1 overflow-hidden">
      {token && <Sidebar />}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto bg-slate-900">{children}</div>
    </div>
  );
}
