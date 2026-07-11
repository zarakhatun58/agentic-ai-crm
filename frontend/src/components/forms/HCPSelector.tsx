import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Building2, Stethoscope, CheckCircle2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hook';
import { setFormField } from '../../features/interaction/interactionSlice';
import type { HCP } from '../../types';
import { getInitials } from '../../utils/formatters';

const tierColors: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  B: 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
  C: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

const tierBg: Record<string, string> = {
  A: 'from-emerald-500 to-teal-500',
  B: 'from-teal-500 to-cyan-500',
  C: 'from-slate-400 to-slate-500',
};

export default function HCPSelector() {
  const dispatch = useAppDispatch();
  const { hcps } = useAppSelector((s:any) => s.hcp);
  const { form } = useAppSelector((s:any) => s.interaction);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = hcps.find((h:any) => h.id === form.hcp_id);

  const filtered = query
    ? hcps.filter(
        (h:any) =>
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.specialty?.toLowerCase().includes(query.toLowerCase()) ||
          h.institution?.toLowerCase().includes(query.toLowerCase())
      )
    : hcps;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function selectHCP(hcp: HCP) {
    dispatch(setFormField({ field: 'hcp_id', value: hcp.id }));
    setOpen(false);
    setQuery('');
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(setFormField({ field: 'hcp_id', value: '' }));
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`input-field text-left flex items-center gap-2.5 cursor-pointer ${
          !selected ? 'text-slate-400' : 'text-slate-900'
        }`}
      >
        {selected ? (
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${tierBg[selected.tier ?? 'B']} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
            {getInitials(selected.name)}
          </div>
        ) : (
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
        <span className="flex-1 truncate text-sm font-medium">
          {selected ? selected.name : 'Search or select HCP...'}
        </span>
        {selected && (
          <button onClick={clear} className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <X className="w-3 h-3" />
          </button>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Selected HCP card */}
      {selected && (
        <div className="mt-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tierBg[selected.tier ?? 'B']} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
            {getInitials(selected.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">{selected.name}</p>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {selected.specialty && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Stethoscope className="w-3 h-3 text-teal-500" />
                  {selected.specialty}
                </span>
              )}
              {selected.institution && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">{selected.institution}</span>
                </span>
              )}
            </div>
          </div>
          {selected.tier && (
            <span className={`badge ${tierColors[selected.tier] ?? 'bg-slate-100 text-slate-600'} flex-shrink-0 text-[10px] font-bold`}>
              Tier {selected.tier}
            </span>
          )}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-elevated animate-slide-up overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, specialty, institution..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No HCPs match your search</p>
              </div>
            ) : (
              filtered.map((hcp:any) => {
                const isSelected = hcp.id === form.hcp_id;
                return (
                  <button
                    key={hcp.id}
                    onClick={() => selectHCP(hcp)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected ? 'bg-teal-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tierBg[hcp.tier ?? 'B']} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(hcp.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-teal-700' : 'text-slate-900'}`}>{hcp.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {[hcp.specialty, hcp.institution].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />}
                    {hcp.tier && !isSelected && (
                      <span className={`badge ${tierColors[hcp.tier] ?? 'bg-slate-100'} flex-shrink-0 text-[10px]`}>
                        T{hcp.tier}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
