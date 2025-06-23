"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Zap,
  BarChart3,
  Calendar,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    description: "Overview and analytics",
  },
  {
    title: "Users",
    href: "/users",
    icon: UserCheck,
    badge: "248",
    description: "Manage team members",
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
    badge: "156",
    description: "Client relationships",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
    description: "Performance insights",
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    badge: "3",
    description: "Schedule and events",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    badge: null,
    description: "Generate reports",
  },
];

const bottomItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Get assistance",
  },
];

export function AppSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              WebAgent
            </span>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="ml-auto p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 space-y-2"
        >
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Search className="w-4 h-4 mr-2" />
            Quick Search
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            <Badge variant="destructive" className="ml-auto text-xs">
              3
            </Badge>
          </Button>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-4 py-2">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-blue-600 dark:text-blue-400" : ""
                      )}
                    />

                    {!isCollapsed && (
                      <>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs opacity-60">
                            {item.description}
                          </div>
                        </div>

                        {item.badge && (
                          <Badge
                            variant={isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <Separator className="my-4" />

        {/* Bottom Navigation */}
        <nav className="space-y-1">
          {bottomItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navigationItems.length + index) * 0.05 }}
              >
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-blue-600 dark:text-blue-400" : ""
                      )}
                    />

                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs opacity-60">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  John Doe
                </div>
                <div className="text-xs text-slate-500">Admin</div>
              </div>
            </div>
            <ModeToggle />
          </motion.div>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              JD
            </div>
            <ModeToggle />
          </div>
        )}
      </div>
    </motion.div>
  );
}
