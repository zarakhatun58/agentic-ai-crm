import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hook';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SuccessToast from './components/common/SuccessToast';
import LogInteraction from './pages/LogInteraction';
import InteractionHistory from './pages/InteractionHistory';
import { setActiveView } from './features/ui/uiSlice';

const viewConfig = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview",
  },
  log: {
    title: "Log HCP Interaction",
    subtitle: "...",
  },
  history: {
    title: "Interaction History",
    subtitle: "...",
  },
  chat: {
    title: "AI Assistant",
    subtitle: "Chat with the AI assistant",
  },
};

export default function App() {
  const dispatch = useAppDispatch();
  const { activeView } = useAppSelector((s) => s.ui);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    dispatch(setActiveView('log'));
  }, [dispatch]);

  const config = viewConfig[activeView];

  return (
    <div className="flex h-screen overflow-hidden bg-mesh" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 40%, #f0fdf4 100%)' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={config.title}
          subtitle={config.subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-hidden">
          {activeView === 'log'     && <LogInteraction />}
          {activeView === 'history' && <InteractionHistory />}
        </main>
      </div>

      <SuccessToast />
    </div>
  );
}
