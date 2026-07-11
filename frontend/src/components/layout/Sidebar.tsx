import { ClipboardList, History, Activity, ChevronLeft, ChevronRight, Users, X, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { setActiveView, toggleSidebar } from '../../features/ui/uiSlice';
import type { ActiveView } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const nav: Array<{ id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = [
  { id: 'log',     label: 'Log Interaction',    icon: ClipboardList, desc: 'Record field activity' },
  { id: 'history', label: 'Interaction History', icon: History,       desc: 'View all interactions' },
];

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { activeView, sidebarCollapsed } = useAppSelector((s) => s.ui);

  function handleNav(id: ActiveView) {
    dispatch(setActiveView(id));
    onMobileClose();
  }

  const content = (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #020617 0%, #0f172a 60%, #042f2e 100%)' }}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-glow-teal">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-tight">LifeSync CRM</p>
            <p className="text-xs text-teal-400 font-medium">HCP Module</p>
          </div>
        )}
        {/* Mobile close */}
        <button onClick={onMobileClose} className="lg:hidden ml-auto text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-5 space-y-1">
        {!sidebarCollapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold text-teal-500/70 uppercase tracking-[0.15em]">
            Field Activities
          </p>
        )}

        {nav.map(({ id, label, icon: Icon, desc }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              title={sidebarCollapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 text-left">
                  <p className={`text-sm font-semibold truncate ${active ? 'text-white' : ''}`}>{label}</p>
                  {!active && <p className="text-xs text-slate-500 group-hover:text-slate-400 truncate">{desc}</p>}
                </div>
              )}
              {active && !sidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-200 flex-shrink-0" />
              )}
            </button>
          );
        })}

        {!sidebarCollapsed && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 mb-2 text-[10px] font-bold text-teal-500/70 uppercase tracking-[0.15em]">
                Management
              </p>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/8 transition-all group">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold truncate">HCP Directory</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 truncate">Manage contacts</p>
              </div>
            </button>
          </>
        )}
      </nav>

      {/* AI Badge */}
      {!sidebarCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-r from-teal-900/60 to-cyan-900/40 border border-teal-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-bold text-teal-300">AI Powered</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Groq gemma2-9b-it + LangGraph agent with 5 specialized tools
          </p>
        </div>
      )}

      {/* Footer: user + collapse */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 truncate">Northeast Territory</p>
            </div>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all text-xs font-medium"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 shadow-sidebar ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}>
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onMobileClose} />
          <aside className="relative w-72 flex flex-col animate-slide-in-left shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
