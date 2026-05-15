'use client';

interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const methodStyles: Record<string, string> = {
  GET: 'bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/25',
  POST: 'bg-[#4CAF50]/15 text-[#4CAF50] border-[#4CAF50]/25',
  PUT: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/25',
  DELETE: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/25',
};

export default function MethodBadge({ method }: MethodBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider border ${
        methodStyles[method] || methodStyles.GET
      }`}
    >
      {method.toUpperCase()}
    </span>
  );
}
