'use client';

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ParamTableProps {
  params: Param[];
}

export default function ParamTable({ params }: ParamTableProps) {
  return (
    <div className="border border-[#D4C5B0] rounded-lg overflow-hidden my-4 overflow-x-auto" role="table" aria-label="API Parameters">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
            <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Parameter
            </th>
            <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Type
            </th>
            <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ fontFamily: 'Georgia, serif' }}>
              Required
            </th>
            <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr
              key={param.name}
              className={`border-b border-[#D4C5B0]/50 last:border-b-0 ${
                index % 2 === 1 ? 'bg-[#FAF8F5]' : 'bg-white'
              } hover:bg-[#F5F0E8]/50 transition-colors duration-150`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <code className="font-mono text-[13px] text-[#2C2416] font-medium">
                    {param.name}
                  </code>
                  {param.required && (
                    <span className="sm:hidden flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#EF4444]" title="Required" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#2563EB]/8 text-[#2563EB] border border-[#2563EB]/15">
                  {param.type}
                </span>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                {param.required ? (
                  <span className="inline-flex items-center gap-1.5 text-[#EF4444] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    Required
                  </span>
                ) : (
                  <span className="text-[#8B7E6E] text-xs">Optional</span>
                )}
              </td>
              <td className="px-4 py-3 text-[#6B5D4F] text-[13px] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {param.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
