export default function Button({ children, loading = false, className = "", ...props }) {
  return (
    <button
      className={`focus-ring inline-flex min-h-[48px] h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
