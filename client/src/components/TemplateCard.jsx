export default function TemplateCard({ template, isFavorite, onToggle, busy }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
      <img src={template.thumbnail_url} alt={template.name} loading="lazy" className="h-44 w-full object-cover bg-slate-200" />
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{template.category}</span>
        <h3 className="mt-1 text-lg font-semibold text-slate-800">{template.name}</h3>
        <p className="mt-1 text-sm text-slate-600 flex-1">{template.description}</p>
        <button
          onClick={() => onToggle(template)}
          disabled={busy}
          className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition disabled:opacity-60 ${
            isFavorite
              ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isFavorite ? '♥ Favorited (click to remove)' : '♡ Favorite'}
        </button>
      </div>
    </div>
  );
}
