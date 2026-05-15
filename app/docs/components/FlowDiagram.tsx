'use client';

interface StateNode {
  label: string;
  color: 'amber' | 'blue' | 'blue-dark' | 'green' | 'red';
}

const colorMap = {
  amber: {
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/40',
    text: 'text-[#B45309]',
    dot: 'bg-[#F59E0B]',
  },
  blue: {
    bg: 'bg-[#2563EB]/10',
    border: 'border-[#2563EB]/40',
    text: 'text-[#2563EB]',
    dot: 'bg-[#2563EB]',
  },
  'blue-dark': {
    bg: 'bg-[#1E40AF]/10',
    border: 'border-[#1E40AF]/40',
    text: 'text-[#1E40AF]',
    dot: 'bg-[#1E40AF]',
  },
  green: {
    bg: 'bg-[#4CAF50]/10',
    border: 'border-[#4CAF50]/40',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#4CAF50]',
  },
  red: {
    bg: 'bg-[#EF4444]/10',
    border: 'border-[#EF4444]/40',
    text: 'text-[#EF4444]',
    dot: 'bg-[#EF4444]',
  },
};

function StateBox({ label, color }: StateNode) {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-lg px-4 py-2.5 flex items-center gap-2 min-w-[120px] justify-center`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
      <span className={`${c.text} text-xs font-semibold font-mono tracking-wide uppercase`}>
        {label}
      </span>
    </div>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center text-[#D4C5B0] ${className}`}>
      {/* Horizontal arrow for desktop */}
      <svg className="hidden md:block" width="32" height="12" viewBox="0 0 32 12" fill="none">
        <path d="M0 6H28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 1L30 6L24 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Vertical arrow for mobile */}
      <svg className="block md:hidden" width="12" height="32" viewBox="0 0 12 32" fill="none">
        <path d="M6 0V28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 24L6 30L11 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function BranchArrow({ direction }: { direction: 'down-right' | 'down-left' }) {
  return (
    <div className="flex items-center justify-center text-[#D4C5B0]">
      <svg className="hidden md:block" width="24" height="32" viewBox="0 0 24 32" fill="none">
        {direction === 'down-right' ? (
          <>
            <path d="M2 0V16C2 22 8 24 12 24H20" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 20L22 24L16 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="M22 0V16C22 22 16 24 12 24H4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 20L2 24L8 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      {/* Mobile: just a down arrow */}
      <svg className="block md:hidden" width="12" height="32" viewBox="0 0 12 32" fill="none">
        <path d="M6 0V28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M1 24L6 30L11 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function FlowDiagram() {
  return (
    <div className="my-8 p-6 bg-[#FAF8F5] border border-[#D4C5B0] rounded-xl" role="img" aria-label="ACH transaction state machine: Pending flows to Initiated, then Processing, then Completed. Failed and Returned are error states branching from Processing.">
      <h4 className="text-xs font-semibold text-[#8B7E6E] uppercase tracking-wider mb-5 text-center" style={{ fontFamily: 'Georgia, serif' }}>
        ACH Transaction State Machine
      </h4>

      {/* Main flow - horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-0">
        <StateBox label="Pending" color="amber" />
        <Arrow />
        <StateBox label="Initiated" color="blue" />
        <Arrow />
        <StateBox label="Processing" color="blue-dark" />
        <Arrow />
        <StateBox label="Completed" color="green" />
      </div>

      {/* Branch states */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16">
        <div className="flex flex-col items-center gap-1">
          <BranchArrow direction="down-left" />
          <StateBox label="Failed" color="red" />
          <p className="text-[10px] text-[#8B7E6E] mt-1 text-center font-mono">
            Insufficient funds, invalid account
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <BranchArrow direction="down-right" />
          <StateBox label="Returned" color="red" />
          <p className="text-[10px] text-[#8B7E6E] mt-1 text-center font-mono">
            ACH return code received
          </p>
        </div>
      </div>
    </div>
  );
}
