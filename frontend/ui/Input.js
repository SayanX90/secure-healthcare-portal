export default function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        className="min-h-[48px] h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
        {...props}
      />
    </label>
  );
}
