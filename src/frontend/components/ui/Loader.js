export default function Loader({ text = "Loading" }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-5 py-3.5 text-sm font-semibold text-muted shadow-lg shadow-violet-100/50 backdrop-blur-sm">
        <span className="h-5 w-5 animate-spin rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 border-2 border-t-transparent border-transparent [background-clip:padding-box]" />
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{text}…</span>
      </div>
    </div>
  );
}
