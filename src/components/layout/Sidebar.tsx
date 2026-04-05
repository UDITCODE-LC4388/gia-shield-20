import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Network,
  Map,
  Settings2,
  FileCheck,
  ScrollText,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Beneficiary Verification", path: "/verification", icon: UserCheck },
  { label: "Fraud Network", path: "/network", icon: Network },
  { label: "District Heatmap", path: "/heatmap", icon: Map },
  { label: "Scheme Optimizer", path: "/optimizer", icon: Settings2 },
  { label: "Audit Certificates", path: "/certificates", icon: FileCheck },
  { label: "System Logs", path: "/logs", icon: ScrollText },
];

export function Sidebar() {
  const location = useLocation();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <aside className="w-60 bg-card border-r border-border fixed top-16 left-0 bottom-0 flex flex-col z-40">
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors cursor-pointer
                ${active
                  ? "border-l-[3px] border-saffron bg-gov-off-white text-navy font-medium"
                  : "border-l-[3px] border-transparent text-gov-text-body hover:bg-gov-off-white hover:text-navy"
                }`}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-gov-text-body">
          <span className="w-2 h-2 rounded-full bg-gov-success" />
          <span>Secure Session</span>
          <span className="ml-auto font-mono text-[11px]">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
      </div>
    </aside>
  );
}
