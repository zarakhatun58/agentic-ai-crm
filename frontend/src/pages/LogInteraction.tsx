import { useEffect } from 'react';
import {
  Calendar, Clock, Users, MessageSquare, Target, ArrowRight,
  LayoutGrid, MessagesSquare, Loader2, RotateCcw, Save,
  Sparkles, Edit3, ChevronDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { fetchHCPs } from '../features/hcp/hcpSlice';
import {
  fetchInteractions, setFormField, resetForm, saveInteraction
} from '../features/interaction/interactionSlice';

import HCPSelector from '../components/forms/HCPSelector';
import SentimentSelector from '../components/common/SentimentSelector';
import ChatPanel from '../components/chat/ChatPanel';
import { setLogMode, showSuccess } from '../features/ui/uiSlice';

const INTERACTION_TYPES = ['Meeting', 'Call', 'Email', 'Conference', 'Dinner Program', 'Virtual'];

const sectionIcon = (color: string, icon: React.ReactNode) => (
  <span className={`section-icon ${color}`}>{icon}</span>
);

export default function LogInteraction() {
  const dispatch = useAppDispatch();
  const { form, saving, error, editingId, aiSuggestedFollowUps } = useAppSelector((s) => s.interaction);
  const { logMode } = useAppSelector((s) => s.ui);

  useEffect(() => {
    dispatch(fetchHCPs());
  }, [dispatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(saveInteraction());
    if (saveInteraction.fulfilled.match(result)) {
      dispatch(fetchInteractions());
      dispatch(showSuccess(editingId ? 'Interaction updated!' : 'Interaction logged successfully!'));
    }
  }

  function applyFollowUp(text: string) {
    const current = form.follow_up_actions;
    dispatch(setFormField({ field: 'follow_up_actions', value: current ? `${current}\n- ${text}` : `- ${text}` }));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Mode toggle bar ────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
        <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
          {(['form', 'chat'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch(setLogMode(mode))}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${logMode === mode
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {mode === 'form' ? <LayoutGrid className="w-3.5 h-3.5" /> : <MessagesSquare className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{mode === 'form' ? 'Structured Form' : 'AI Chat'}</span>
              <span className="sm:hidden">{mode === 'form' ? 'Form' : 'Chat'}</span>
            </button>
          ))}
        </div>

        {editingId && (
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
            <Edit3 className="w-3 h-3" />
            Editing
          </span>
        )}

        <div className="ml-auto hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LangGraph Agent Active
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Form (visible on form mode, or always on desktop when sidebar shown) */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col min-h-0 transition-all duration-300 ${logMode === 'chat'
              ? 'w-0 opacity-0 overflow-hidden pointer-events-none'
              : 'flex-1 opacity-100'
            }`}
        >
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">

            {/* Section: Interaction Details */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 to-white flex items-center gap-2.5">
                <span className="section-icon bg-teal-100">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                </span>
                <h3 className="section-title">Interaction Details</h3>
              </div>

              <div className="p-5 space-y-4">
                {/* HCP */}
                <div>
                  <label className="label">HCP Name</label>
                  <HCPSelector />
                </div>

                {/* Type + Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <div className="relative">
                      <select
                        value={form.interaction_type}
                        onChange={(e) => dispatch(setFormField({ field: 'interaction_type', value: e.target.value }))}
                        className="select-field pr-9"
                      >
                        {INTERACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label flex items-center gap-1"><Calendar className="w-3 h-3" />Date</label>
                    <input type="date" value={form.interaction_date}
                      onChange={(e) => dispatch(setFormField({ field: 'interaction_date', value: e.target.value }))}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="label flex items-center gap-1"><Clock className="w-3 h-3" />Time</label>
                    <input type="time" value={form.interaction_time}
                      onChange={(e) => dispatch(setFormField({ field: 'interaction_time', value: e.target.value }))}
                      className="input-field" />
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <label className="label flex items-center gap-1"><Users className="w-3 h-3" />Attendees</label>
                  <input type="text" value={form.attendees}
                    onChange={(e) => dispatch(setFormField({ field: 'attendees', value: e.target.value }))}
                    placeholder="Enter names, comma-separated..."
                    className="input-field" />
                </div>

                {/* Topics */}
                <div>
                  <label className="label">Topics Discussed</label>
                  <textarea value={form.topics_discussed}
                    onChange={(e) => dispatch(setFormField({ field: 'topics_discussed', value: e.target.value }))}
                    placeholder="Key discussion points, products mentioned, questions raised..."
                    rows={3} className="textarea-field" />
                </div>
              </div>
            </div>

            {/* Section: Materials & Samples */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-cyan-50/60 to-white">
                <h3 className="section-title">
                  {sectionIcon('bg-cyan-100', <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>)}
                  Materials Shared / Samples Distributed
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* <div>
                  <label className="label">Materials Shared</label>
                  <MaterialsPanel />
                </div>
                <div>
                  <label className="label">Samples Distributed</label>
                  <SamplesPanel />
                </div> */}
              </div>
            </div>

            {/* Section: Sentiment & Outcomes */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white">
                <h3 className="section-title">
                  {sectionIcon('bg-emerald-100', <Target className="w-4 h-4 text-emerald-600" />)}
                  Sentiment & Outcomes
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="label">Observed / Inferred HCP Sentiment</label>
                  <SentimentSelector />
                </div>
                <div>
                  <label className="label">Outcomes</label>
                  <textarea value={form.outcomes}
                    onChange={(e) => dispatch(setFormField({ field: 'outcomes', value: e.target.value }))}
                    placeholder="Key agreements, decisions, or prescribing commitments..."
                    rows={3} className="textarea-field" />
                </div>
                <div>
                  <label className="label">Follow-up Actions</label>
                  <textarea value={form.follow_up_actions}
                    onChange={(e) => dispatch(setFormField({ field: 'follow_up_actions', value: e.target.value }))}
                    placeholder="Next steps, tasks, scheduled activities..."
                    rows={3} className="textarea-field" />
                  {form.ai_summary && (
                    <div className="rounded-2xl border border-blue-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                        <p className="text-white text-sm font-semibold">
                          🤖 AI Summary
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                          {form.ai_summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Suggested Follow-ups */}
                {aiSuggestedFollowUps.length > 0 && (
                  <div className="rounded-2xl border border-teal-200 overflow-hidden">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                      <p className="text-xs font-bold text-white">AI Suggested Follow-ups</p>
                    </div>
                    <div className="p-3 bg-teal-50 space-y-1.5">
                      {aiSuggestedFollowUps.map((fu: any, i: any) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applyFollowUp(fu)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-left transition-all group shadow-sm"
                        >
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors">
                            <ArrowRight className="w-3 h-3 text-teal-600 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-xs font-medium text-slate-700 group-hover:text-teal-800">{fu}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 px-4 md:px-6 py-4 flex items-center gap-3">
            {error && <p className="text-sm text-rose-600 flex-1 truncate">{error}</p>}
            <div className="flex items-center gap-3 ml-auto">
              <button type="button" onClick={() => dispatch(resetForm())} className="btn-secondary py-2.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button type="submit" disabled={saving} className="btn-primary py-2.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? 'Saving...' : editingId ? 'Update' : 'Log Interaction'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Chat — full screen on mobile chat mode, always visible on desktop form mode */}
        {logMode === 'chat' && (
          <div className="flex-1 p-3 md:p-4 min-h-0">
            <ChatPanel />
          </div>
        )}

        {/* Desktop: always-visible chat sidebar */}
        {logMode === 'form' && (
          <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 flex-col border-l border-slate-200/80 bg-slate-50/50">
            <div className="flex-1 p-4 min-h-0 flex flex-col">
              <ChatPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
