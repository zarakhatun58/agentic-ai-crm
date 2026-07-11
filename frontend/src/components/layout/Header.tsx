import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Search,
  User,
  Menu,
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setActiveView } from "../../features/ui/uiSlice";
import { setSearchQuery } from "../../features/hcp/hcpSlice";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    icon: Calendar,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    title: "Follow-up due today",
    desc: "Dr. Sarah Chen — Product discussion meeting",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Interaction logged successfully",
    desc: "Call with Dr. Michael Rodriguez completed",
    time: "5h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: AlertCircle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Sentiment needs review",
    desc: "Recent interaction flagged as negative",
    time: "1d ago",
    unread: false,
  },
  {
    id: "n4",
    icon: Clock,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    title: "Weekly summary ready",
    desc: "12 interactions recorded this week",
    time: "2d ago",
    unread: false,
  },
];

export default function Header({
  title,
  subtitle,
  onMenuClick,
}: HeaderProps) {
  const dispatch = useAppDispatch();

  const { activeView } = useAppSelector((state) => state.ui);
  const { searchQuery } = useAppSelector((state) => state.hcp);

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setNotifOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const handleSearchFocus = () => {
    setSearchOpen(true);

    if (activeView !== "history") {
      dispatch(setActiveView("history"));
    }
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(""));
  };

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );

    dispatch(setActiveView("history"));
    setNotifOpen(false);
  };

  const handleViewAllNotifications = () => {
    dispatch(setActiveView("history"));
    setNotifOpen(false);
  };

  const handleViewProfile = () => {
    setProfileOpen(false);

    alert("Profile page coming soon.");
  };

  const handleSettings = () => {
    setProfileOpen(false);

    alert("Settings page coming soon.");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm relative z-30">
      <div className="h-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      <div className="flex items-center justify-between px-4 md:px-6 py-3.5 gap-3">
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">
                {title}
              </h1>

              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </div>

            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div
          ref={searchRef}
          className="hidden md:block relative flex-1 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

          <input
            value={searchQuery}
            onChange={(event) =>
              dispatch(setSearchQuery(event.target.value))
            }
            onFocus={handleSearchFocus}
            placeholder="Search interactions, HCPs, topics..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 focus:bg-white transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* MOBILE SEARCH */}
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label="Toggle search"
            className="md:hidden btn-ghost text-slate-500 hover:text-teal-600"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* NOTIFICATION */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((value) => !value);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              className="btn-ghost text-slate-500 hover:text-teal-600 relative"
            >
              <Bell className="w-4 h-4" />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-teal-600" />

                      <span className="text-sm font-bold">
                        Notifications
                      </span>

                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className="text-xs font-semibold text-teal-600 disabled:text-slate-300"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;

                      return (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                          className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl ${notification.iconBg} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon
                              className={`w-4 h-4 ${notification.iconColor}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800">
                                {notification.title}
                              </p>

                              {notification.unread && (
                                <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1" />
                              )}
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">
                              {notification.desc}
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleViewAllNotifications}
                    className="w-full px-4 py-3 text-xs font-semibold text-teal-600 hover:bg-teal-50 flex items-center justify-center gap-1.5"
                  >
                    View all notifications
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((value) => !value);
                setNotifOpen(false);
              }}
              className="ml-1 flex items-center gap-2.5 pl-3 border-l border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800">
                  Alex Rivera
                </p>

                <p className="text-[10px] text-slate-400">
                  Field Rep · Northeast
                </p>
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-5 bg-gradient-to-br from-teal-600 to-teal-700">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Alex Rivera
                        </p>

                        <p className="text-xs text-teal-100">
                          Field Sales Representative
                        </p>

                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-white">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 space-y-2.5 border-b">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      alex.rivera@lifecsync.com
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      (555) 123-4567
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Northeast Territory
                    </div>
                  </div>

                  <div className="py-1.5">
                    <button
                      type="button"
                      onClick={handleViewProfile}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleSettings}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100"
          >
            <div className="px-4 py-3 relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  dispatch(setSearchQuery(event.target.value))
                }
                onFocus={handleSearchFocus}
                placeholder="Search interactions, HCPs, topics..."
                autoFocus
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}