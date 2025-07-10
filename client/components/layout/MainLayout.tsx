import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Plus,
  Users,
  Home,
  Bookmark,
  Settings,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/groups", label: "My Groups", icon: Users },
    { href: "/saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-community-blue flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-community-blue bg-clip-text text-transparent">
              Community
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups, posts, people..."
                className="pl-10 bg-secondary/50 border-secondary"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-community-orange rounded-full border-2 border-background"></span>
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card hidden lg:block">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              My Groups
            </h3>
            <div className="space-y-1">
              {/* This will be dynamic later */}
              <Link
                to="/group/1"
                className="flex items-center space-x-2 px-2 py-1 rounded text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <div className="h-6 w-6 rounded bg-community-green"></div>
                <span>React Developers</span>
              </Link>
              <Link
                to="/group/2"
                className="flex items-center space-x-2 px-2 py-1 rounded text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <div className="h-6 w-6 rounded bg-community-purple"></div>
                <span>Design Systems</span>
              </Link>
              <Link
                to="/group/3"
                className="flex items-center space-x-2 px-2 py-1 rounded text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <div className="h-6 w-6 rounded bg-community-orange"></div>
                <span>Remote Workers</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
