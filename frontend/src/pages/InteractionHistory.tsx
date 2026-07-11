import { useEffect, useState } from 'react';
import {
  Calendar, Search, Filter, Trash2, Edit2,
  Phone, Mail, Users, Video, Utensils,
  Loader2, SmilePlus, Meh, Frown, Clock,
  Stethoscope, ChevronRight, BarChart2, TrendingUp, Activity,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import {
  fetchInteractions,
  deleteInteraction,
  setEditingInteraction,
} from "../features/interaction/interactionSlice";
import type { Interaction } from '../types';
import { formatDate } from '../utils/formatters';
import { setActiveView, setLogMode, showSuccess } from '../features/ui/uiSlice';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Meeting: Users, Call: Phone, Email: Mail, Virtual: Video, 'Dinner Program': Utensils, Conference: Users,
};

const typeStyle: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  Call: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
  Email: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  Virtual: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200',
  'Dinner Program': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
  Conference: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
};

const typeIconBg: Record<string, string> = {
  Meeting: 'from-blue-500 to-blue-700',
  Call: 'from-violet-500 to-violet-700',
  Email: 'from-slate-500 to-slate-700',
  Virtual: 'from-cyan-500 to-cyan-700',
  'Dinner Program': 'from-orange-500 to-orange-700',
  Conference: 'from-indigo-500 to-indigo-700',
};

const sentimentConfig = {
  positive: { icon: SmilePlus, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Positive' },
  neutral: { icon: Meh, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500', label: 'Neutral' },
  negative: { icon: Frown, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', label: 'Negative' },
};

export default function InteractionHistory() {
  const dispatch = useAppDispatch();
  const { interactions, loading } = useAppSelector((s) => s.interaction);
    const { searchQuery } = useAppSelector((s) => s.ui);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchInteractions()); }, [dispatch]);

  const types = [
    "All",
    ...Array.from(new Set(interactions.map((i: any) => i.interaction_type))),
  ];

  const filtered = interactions.filter((i: any) => {
     
    const matchesType = filterType === 'All' || i.interaction_type === filterType;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q ||
      i.hcps?.name?.toLowerCase().includes(q) ||
      i.topics_discussed?.toLowerCase().includes(q) ||
      i.outcomes?.toLowerCase().includes(q) ||
      i.interaction_type.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  // Stats
  const total = interactions.length;
  const positive = interactions.filter((i: any) => i.sentiment === 'positive').length;
  const thisMonth = interactions.filter((i: any) => {
    const d = new Date(i.interaction_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  async function handleDelete(id: string) {
    await dispatch(deleteInteraction(id)).unwrap();
    setDeleteConfirm(null);
    dispatch(showSuccess('Interaction deleted'));
  }

  function handleEdit(i: Interaction) {
    dispatch(setEditingInteraction(i as any));
    dispatch(setLogMode('form'));
    dispatch(setActiveView('log'));
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center animate-pulse">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Stats bar ───────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-slate-200/80">
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto pb-1">
          {[
            { label: 'Total Interactions', value: total, icon: BarChart2, gradient: 'from-teal-500 to-teal-600' },
            { label: 'Positive Sentiment', value: positive, icon: SmilePlus, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'This Month', value: thisMonth, icon: TrendingUp, gradient: 'from-cyan-500 to-blue-500' },
          ].map(({ label, value, icon: Icon, gradient }) => (
            <div key={label} className="flex items-center gap-2.5 flex-shrink-0">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{label}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-wrap items-center gap-2 md:gap-3 px-4 md:px-6 py-3 bg-white/60 backdrop-blur-sm border-b border-slate-200/60">
        <div className="relative flex-1 min-w-[160px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search HCP, topics, outcomes..." className="input-field pl-9 py-2 text-xs" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {types.map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filterType === t
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-semibold text-slate-500 flex-shrink-0">
          {filtered.length} <span className="text-slate-400">results</span>
        </span>
      </div>

      {/* ── List ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-500">No interactions found</p>
            <p className="text-sm text-slate-400 mt-1">Adjust your search or filters, or log a new interaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((interaction: any) => {
              const TypeIcon =
                typeIcons[interaction.interaction_type] ?? Users;

              const sentiment =
                sentimentConfig[
                interaction.sentiment as keyof typeof sentimentConfig
                ] ?? sentimentConfig.neutral;

              const iconGradient =
                typeIconBg[interaction.interaction_type] ??
                "from-slate-500 to-slate-700";
              return (
                <div key={interaction.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden animate-fade-in"
                >
                  {/* Accent bar */}
                  <div className={`h-0.5 bg-gradient-to-r ${iconGradient}`} />

                  <div className="flex items-start gap-3 md:gap-4 p-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-sm mt-0.5`}>
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-sm md:text-base font-bold text-slate-900">
                          {interaction.hcp?.name ?? 'Unknown HCP'}
                        </span>
                        {interaction.hcp?.specialty && (
                          <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                            <Stethoscope className="w-3 h-3 text-teal-400" />
                            {interaction.hcp.specialty}
                          </span>
                        )}
                        <span className={`badge ${typeStyle[interaction.interaction_type] ?? 'bg-slate-100 text-slate-600'} text-[10px] font-bold`}>
                          {interaction.interaction_type}
                        </span>
                        <span className={`badge ${sentiment.badge} text-[10px] font-bold`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot} inline-block`} />
                          {sentiment.label}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(interaction.interaction_date)}
                        </span>
                        {interaction.interaction_time && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {interaction.interaction_time}
                          </span>
                        )}
                        {interaction.hcp?.institution && (
                          <span className="text-xs text-slate-400 hidden md:inline truncate max-w-[150px]">
                            {interaction.hcp.institution}
                          </span>
                        )}
                      </div>

                      {/* Topics */}
                      {interaction.topics_discussed && (
                        <p className="text-xs md:text-sm text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                          {interaction.topics_discussed}
                        </p>
                      )}

                      {/* Outcomes + Follow-up */}
                      {(interaction.outcomes || interaction.follow_up_actions) && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          {interaction.outcomes && (
                            <div className="flex items-start gap-1.5 flex-1 min-w-0 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
                              <ChevronRight className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600 line-clamp-1">
                                <span className="font-semibold text-emerald-700">Outcome: </span>
                                {interaction.outcomes}
                              </p>
                            </div>
                          )}
                          {interaction.follow_up_actions && (
                            <div className="flex items-start gap-1.5 flex-1 min-w-0 bg-teal-50 rounded-xl px-3 py-2 border border-teal-100">
                              <ChevronRight className="w-3 h-3 text-teal-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600 line-clamp-1">
                                <span className="font-semibold text-teal-700">Follow-up: </span>
                                {interaction.follow_up_actions}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Follow-up tags */}
                      {interaction.ai_suggested_follow_ups && interaction.ai_suggested_follow_ups.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {interaction.ai_suggested_follow_ups.slice(0, 2).map((fu: any, i: any) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-[10px] font-semibold border border-teal-200">
                              <span className="w-1 h-1 rounded-full bg-teal-500 inline-block" />
                              {fu}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          via {interaction.logged_via}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(interaction)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 text-xs font-semibold border border-teal-200 transition-colors">
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          {deleteConfirm === interaction.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(interaction.id)}
                                className="px-2.5 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                                Confirm
                              </button>
                              <button onClick={() => setDeleteConfirm(null)}
                                className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(interaction.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
