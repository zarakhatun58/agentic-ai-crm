import { Bell, Search, User, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Top gradient accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      <div className="flex items-center justify-between px-4 md:px-6 py-3.5">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">{title}</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="btn-ghost hidden md:flex text-slate-500 hover:text-teal-600">
            <Search className="w-4 h-4" />
          </button>

          <button className="btn-ghost text-slate-500 hover:text-teal-600 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full ring-1 ring-white" />
          </button>

          <div className="ml-1 flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">Alex Rivera</p>
              <p className="text-[10px] text-slate-400">Field Rep · Northeast</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
