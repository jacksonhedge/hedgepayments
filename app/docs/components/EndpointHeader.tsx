'use client';

import MethodBadge from './MethodBadge';

interface EndpointHeaderProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

export default function EndpointHeader({ method, path, description }: EndpointHeaderProps) {
  return (
    <div className="border-b border-[#D4C5B0] pb-4 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <MethodBadge method={method} />
        <code className="font-mono text-[15px] text-[#2C2416] tracking-tight">
          {path}
        </code>
      </div>
      <p className="text-[#6B5D4F] text-sm leading-relaxed mt-2" style={{ fontFamily: 'Georgia, serif' }}>
        {description}
      </p>
    </div>
  );
}
