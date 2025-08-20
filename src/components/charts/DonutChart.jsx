import { useMemo } from "react";

export function Donut({ percent = 72, label = '', value = '', color = '#3b82f6' }) {
  const bg = useMemo(
    () => ({
      background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
    }),
    [percent, color],
  );
  return (
    <div className="relative w-36 h-36">
      <div className="absolute inset-0 rounded-full" style={bg} />
      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold leading-tight">{value}</div>
          <div className="text-xs text-gray-500 -mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}