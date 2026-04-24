"use client";

import { useRouter } from "next/navigation";

const roleColors = {
  organization: "bg-indigo-600",
  admin: "bg-sky-600",
  member: "bg-fuchsia-600",
};

export default function TopBar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bgColor = roleColors[user.role] || "bg-indigo-600";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-slate-700 font-medium text-base">
          Dashboard /{" "}
          <span className="text-slate-900 font-bold">{user.name.split(" ")[0]}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-slate-900 text-sm font-bold">{user.name}</p>
          <p className="text-slate-500 text-xs">{user.email}</p>
        </div>

        <div
          className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {initials}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm font-bold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
