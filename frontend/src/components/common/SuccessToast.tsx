import { useEffect } from 'react';
import { CheckCircle2, X, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { clearSuccess } from '../../features/ui/uiSlice';


export default function SuccessToast() {
  const dispatch = useAppDispatch();
  const { successMessage } = useAppSelector((s) => s.ui);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => dispatch(clearSuccess()), 4500);
    return () => clearTimeout(t);
  }, [successMessage, dispatch]);

  if (!successMessage) return null;

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50 animate-bounce-in max-w-sm w-[calc(100vw-2rem)] md:w-auto">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-elevated border border-emerald-200/50"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{successMessage}</p>
          <p className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" />
            AI-First CRM
          </p>
        </div>
        <button
          onClick={() => dispatch(clearSuccess())}
          className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
