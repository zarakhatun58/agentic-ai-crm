import { SmilePlus, Meh, Frown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { setFormField } from '../../features/interaction/interactionSlice';

const sentiments = [
  {
    value: 'positive',
    label: 'Positive',
    icon: SmilePlus,
    active: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 ring-2 ring-emerald-200 text-emerald-700',
    inactive: 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50',
    iconActive: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    icon: Meh,
    active: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-300 ring-2 ring-sky-200 text-sky-700',
    inactive: 'bg-white border-slate-200 text-slate-500 hover:border-sky-200 hover:bg-sky-50/50',
    iconActive: 'text-sky-600',
    dot: 'bg-sky-500',
  },
  {
    value: 'negative',
    label: 'Negative',
    icon: Frown,
    active: 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-300 ring-2 ring-rose-200 text-rose-700',
    inactive: 'bg-white border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50/50',
    iconActive: 'text-rose-600',
    dot: 'bg-rose-500',
  },
] as const;

export default function SentimentSelector() {
  const dispatch = useAppDispatch();
  const sentiment = useAppSelector((s:any) => s.interaction.form.sentiment);

  return (
    <div className="flex gap-2 flex-wrap">
      {sentiments.map(({ value, label, icon: Icon, active, inactive, iconActive, dot }) => {
        const selected = sentiment === value;
        return (
          <label
            key={value}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-semibold flex-1 min-w-[100px] ${
              selected ? active : inactive
            }`}
          >
            <input
              type="radio"
              name="sentiment"
              value={value}
              checked={selected}
              onChange={() => dispatch(setFormField({ field: 'sentiment', value }))}
              className="sr-only"
            />
            <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              selected ? 'bg-white shadow-sm' : 'bg-slate-50'
            }`}>
              <Icon className={`w-4 h-4 ${selected ? iconActive : 'text-slate-400'}`} />
              {selected && <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${dot} border-2 border-white`} />}
            </div>
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}
