"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, HelpCircle, CreditCard, Search } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio Analytics", href: "/portfolio", icon: BarChart3 },
    { name: "Deep Analytics", href: "/analyze", icon: Search },
  ];

  const bottomItems = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help & Support", href: "#", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-[#003366] text-white flex flex-col shadow-lg h-screen">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          IDBI FinHealth
        </h1>
        <p className="text-xs text-blue-200 mt-1">MSME Intelligence Platform</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-4">Main Menu</p>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div>
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-4">System</p>
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-white/10 text-xs text-blue-200 bg-[#002244]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <p>System Operational</p>
        </div>
        <p className="mt-1 opacity-60">v2.0.0 • Enterprise Edition</p>
      </div>
    </div>
  );
}