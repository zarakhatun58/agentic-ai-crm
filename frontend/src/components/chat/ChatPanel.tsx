import { useRef, useEffect, useState, type KeyboardEvent } from 'react';
import { Send, Bot, User, Wrench, RefreshCw, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { setInputText, sendAgentMessage, clearChat } from '../../features/chat/chatSlice';
import { setForm, setAiSuggestedFollowUps } from '../../features/interaction/interactionSlice';

import { setLogMode } from '../../features/ui/uiSlice';

const suggestions = [
  'Met Dr. Smith, discussed OncoBoost Phase III, positive',
  'Called Dr. Patel re CardioShield dosing, neutral',
  'Suggest follow-ups for Dr. Chen meeting',
  'Analyze Northeast territory sentiment trends',
];

export default function ChatPanel() {
  const dispatch = useAppDispatch();
  const { messages, inputText, isThinking } = useAppSelector((s) => s.agent);
  const { form } = useAppSelector((s) => s.interaction);
  const { hcps } = useAppSelector((s) => s.hcp);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [followUps, setFollowUps] = useState<string[]>([]);

 useEffect(() => {
  const container = messagesRef.current;

  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  });
}, [messages, isThinking, aiSummary, followUps]);

  function handleSend() {
    const msg = inputText.trim();

    if (!msg || isThinking) return;

    dispatch(
      sendAgentMessage({
        message: msg,
        context: {
          current_hcp_id: form.hcp_id || null,
          current_form: form,
          hcps: hcps.map((h) => ({
            id: h.id,
            name: h.name,
            specialty: h.specialty,
          })),
        },
      })
    ).then((action) => {
      if (sendAgentMessage.fulfilled.match(action)) {
        const payload = action.payload;
        if (payload.form_data) {
          dispatch(
            setForm({
              ...payload.form_data,
              ai_summary: payload.ai_summary ?? "",
            })
          );
          dispatch(setLogMode("form"));
        }
        if (payload.ai_summary) {
          setAiSummary(payload.ai_summary);
        }

        // ----------------------------
        // Suggested Follow-ups
        // ----------------------------
        if (payload.suggested_follow_ups) {
          setFollowUps(payload.suggested_follow_ups);

          dispatch(
            setAiSuggestedFollowUps(
              payload.suggested_follow_ups
            )
          );
        }
      }
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full max-h-full rounded-2xl overflow-hidden border border-teal-100 shadow-card-hover">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-teal-700/30"
        style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #0891b2 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-teal-900" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <Zap className="w-2.5 h-2.5 text-teal-300" />
              <p className="text-[10px] text-teal-300 font-medium">gemma2-9b-it · LangGraph</p>
            </div>
          </div>
        </div>
        <button onClick={() => dispatch(clearChat())} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all" title="Clear chat">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesRef}
  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-3 bg-gradient-to-b from-slate-50/80 to-white">
        {messages.map((msg) => {
          if (msg.role === 'tool') {
            return (
              <div key={msg.id} className="flex items-start gap-2 animate-fade-in">
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center mt-0.5">
                  <Wrench className="w-3 h-3 text-amber-600" />
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs">
                  <p className="font-bold text-amber-700 mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    Tool: {msg.toolName}
                  </p>
                  <pre className="text-amber-800 font-mono break-all whitespace-pre-wrap text-[10px] leading-relaxed max-h-24 overflow-y-auto">
                    {typeof msg.toolResult === 'object' ? JSON.stringify(msg.toolResult, null, 2) : String(msg.toolResult)}
                  </pre>
                </div>
              </div>
            );
          }

          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex items-end gap-2 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${isUser
                ? 'bg-gradient-to-br from-teal-500 to-teal-700'
                : 'bg-gradient-to-br from-slate-700 to-slate-900'
                }`}>
                {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${isUser
                ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-br-sm'
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <span className="typing-dot bg-teal-500" />
                <span className="typing-dot bg-teal-500" />
                <span className="typing-dot bg-teal-500" />
              </div>
            </div>
          </div>
        )}
        {aiSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <h3 className="font-semibold text-blue-700 mb-2">
              🤖 AI Summary
            </h3>

            <p className="text-sm text-slate-700">
              {aiSummary}
            </p>
          </div>
        )}
        {followUps.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-3">
            <h3 className="font-semibold text-green-700 mb-2">
              ✅ Suggested Follow-ups
            </h3>

            <ul className="list-disc ml-5 space-y-1">
              {followUps.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div ref={messagesRef} />
      </div>

      {/* Suggestions (fresh chat only) */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 bg-white border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" />
            Try asking
          </p>
          <div className="grid grid-cols-1 gap-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { dispatch(setInputText(s)); inputRef.current?.focus(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 hover:border-teal-300 hover:from-teal-100 hover:to-cyan-100 transition-all text-left group"
              >
                <ArrowRight className="w-3 h-3 text-teal-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                <span className="text-xs text-teal-700 font-medium truncate">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 p-3 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border-2 border-slate-200 focus-within:border-teal-400 focus-within:bg-white focus-within:shadow-sm px-3.5 py-2.5 transition-all">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => dispatch(setInputText(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Describe interaction or ask anything..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none max-h-28 leading-relaxed"
            style={{ minHeight: '22px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isThinking}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center text-white shadow-sm hover:from-teal-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
