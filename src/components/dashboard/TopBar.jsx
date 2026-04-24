"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = {
  organization: [
    { href: "/dashboard", label: "Overview", icon: "🏠" },
    { href: "/dashboard/tasks", label: "Tasks", icon: "📋" },
    { href: "/dashboard/events", label: "Events", icon: "🎪" },
    { href: "/dashboard/members", label: "Members", icon: "💠" },
    { href: "/dashboard/feedback", label: "Feedback", icon: "📨" },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: "🏠" },
    { href: "/dashboard/tasks", label: "Tasks", icon: "📋" },
    { href: "/dashboard/events", label: "Events", icon: "🎪" },
    { href: "/dashboard/members", label: "Members", icon: "💠" },
    { href: "/dashboard/feedback", label: "Feedback", icon: "📨" },
  ],
  member: [
    { href: "/dashboard", label: "Overview", icon: "🏠" },
    { href: "/dashboard/tasks", label: "Tasks", icon: "📋" },
    { href: "/dashboard/events", label: "Events", icon: "🎪" },
    { href: "/dashboard/feedback", label: "Feedback", icon: "📨" },
  ],
};

export default function TopBar({ user }) {
  const pathname = usePathname();
  const items = navItems[user.role] || [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
            {user.role} workspace
          </span>
        </div>
      </div>
    </header>
  );
}
