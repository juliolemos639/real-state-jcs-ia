"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, MessageSquare, PanelLeftClose, PanelLeft, FilterIcon, SettingsIcon, PenOffIcon, LogInIcon, LampDeskIcon, Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { AvatarProfile } from "./avatar-profile";

const STORAGE_KEY = "sidebar-collapsed";

const navItems = [
  { href: "/", label: "Imóveis", icon: Home },
  { href: "/filters", label: "Filtros", icon: FilterIcon },
  { href: "/enquiries", label: "Consultas", icon: MessageSquare },
  { href: "/login", label: "Login/Cadastro", icon: LogInIcon },
  // { href: "/manut", label: "Exclusivo JCS", icon: LampDeskIcon },
] as const;

const navAdminItems = [
  { href: "/properties/new", label: "Adicionar", icon: PlusCircle },
] as const;


export function SiteSidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === "false");
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border",
          collapsed ? "justify-center gap-1 px-2" : "justify-between px-3"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold overflow-hidden transition-opacity",
            collapsed ? "flex-none" : "min-w-0 flex-1"
          )}
        >
          {collapsed ? (
            <span className="text-lg font-bold text-sidebar-primary">J</span>
          ) : (
            <span className="truncate text-lg">JCS Imóveis</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3 relative">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}

        {/* <Separator /> */}
        {/* Administração */}
        {isAdmin && <Separator />}
        {isAdmin && navAdminItems.map(({ href, label, icon: Icon }) => {
          const isActiveAdmin =
            href === "/properties/new" ? pathname === "/properties/new" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActiveAdmin
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}

        <div className="flex absolute bottom-5 left-1/2 transform -translate-x-1/2 items-center justify-center">
          <AvatarProfile />
        </div>
      </nav>
    </aside>
  );
}
