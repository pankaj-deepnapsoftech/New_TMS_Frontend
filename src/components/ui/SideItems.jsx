// eslint-disable-next-line no-unused-vars
export function SidebarItem({ icon: Icon, label, active, expanded, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer  transition-colors select-none
      ${active ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}
      title={!expanded ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {expanded && <span className="text-sm font-medium truncate">{label}</span>}
    </button>
  );
}
