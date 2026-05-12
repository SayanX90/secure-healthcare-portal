import { Search } from "lucide-react";

// UI component for filtering dashboard actions.
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search for complaints, products, or actions..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all hover:shadow-md"
      />
    </div>
  );
}
