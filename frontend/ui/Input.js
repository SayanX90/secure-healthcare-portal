import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        ref={ref}
        className={
          "min-h-[48px] h-11 w-full rounded-lg border bg-white px-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 shadow-sm " +
          (error
            ? "border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10")
        }
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>
      )}
    </label>
  );
});

export default Input;
