"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

const actionColors = {
  created: "bg-green-50 text-green-700 border-green-100",
  updated: "bg-blue-50 text-blue-700 border-blue-100",
  deleted: "bg-red-50 text-red-700 border-red-100",
  assigned: "bg-yellow-50 text-yellow-700 border-yellow-100",
  status_changed: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const statCards = [
  { key: "tasks", label: "Total Tasks", icon: "✅", color: "bg-indigo-600" },
  { key: "events", label: "Events", icon: "📅", color: "bg-sky-600" },
  { key: "members", label: "Members", icon: "👥", color: "bg-emerald-600" },
  { key: "complaints", label: "Complaints", icon: "📬", color: "bg-orange-600" },
];

export default function DashboardOverview({ user }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setActivity(d.recentActivity || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const roleMessages = {
    organization: "Manage your entire organization from here.",
    admin: "Manage tasks and coordinate your team.",
    member: "View your assignments and stay updated.",
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 font-medium">{roleMessages[user.role]}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ key, label, icon, color }) => (
          <div key={key} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl shadow-lg shadow-black/5`}
              >
                {icon}
              </div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                {key}
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">
              {loading ? (
                <div className="h-10 w-16 bg-slate-100 rounded animate-pulse" />
              ) : (
                stats?.[key] ?? 0
              )}
            </div>
            <div className="text-slate-500 text-sm font-bold">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Last 10 Actions</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-900 font-black text-lg">System idling...</p>
            <p className="text-slate-500 text-sm mt-2">
              Action logs will be synchronized here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <span
                  className={`badge border ${actionColors[item.action] || "bg-slate-100 text-slate-500 border-slate-200"} flex-shrink-0`}
                >
                  {item.action.replace("_", " ")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 text-sm">
                    <span className="text-slate-900 font-black">
                      {item.userName || "System"}
                    </span>{" "}
                    <span className="font-medium">
                      {item.action === "status_changed" && item.fieldChanged
                        ? `updated ${item.fieldChanged} from "${item.oldValue}" to "${item.newValue}"`
                        : item.action === "created"
                          ? `provisioned a new task entity`
                          : item.action === "assigned"
                            ? `assigned task ownership`
                            : `modified system data`}
                    </span>
                  </p>
                </div>
                <span className="text-slate-400 text-xs font-bold font-mono">
                  {format(new Date(item.createdAt), "HH:mm")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Info Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 flex items-center gap-6 shadow-2xl shadow-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
          {user.role === "organization" ? "🏢" : user.role === "admin" ? "🛡️" : "👤"}
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-lg">
            Authorized as{" "}
            <span className="text-indigo-400 capitalize">{user.role}</span>
          </p>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {user.role === "organization"
              ? "Full system oversight and tenant management enabled."
              : user.role === "admin"
                ? "Tactical project coordination and team management mode."
                : "Standard execution environment and personal task access."}
          </p>
        </div>
      </div>
    </div>
  );
}
