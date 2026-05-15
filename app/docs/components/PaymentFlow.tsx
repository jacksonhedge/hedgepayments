'use client';

type NodeColor = 'brown' | 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'teal';

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  color: NodeColor;
  icon?: 'user' | 'bank' | 'shield' | 'check' | 'x' | 'refresh' | 'lock' | 'zap' | 'dollar' | 'link' | 'card' | 'building';
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

interface PaymentFlowProps {
  title: string;
  description?: string;
  nodes: FlowNode[];
  rows: string[][];
  connections?: FlowConnection[];
}

const colorMap: Record<NodeColor, { bg: string; border: string; text: string; iconBg: string }> = {
  brown:  { bg: 'bg-[#2C2416]/5',  border: 'border-[#2C2416]/20',  text: 'text-[#2C2416]',  iconBg: 'bg-[#2C2416]/10' },
  green:  { bg: 'bg-[#4CAF50]/8',  border: 'border-[#4CAF50]/30',  text: 'text-[#2E7D32]',  iconBg: 'bg-[#4CAF50]/15' },
  blue:   { bg: 'bg-[#2563EB]/8',  border: 'border-[#2563EB]/30',  text: 'text-[#2563EB]',  iconBg: 'bg-[#2563EB]/12' },
  amber:  { bg: 'bg-[#F59E0B]/8',  border: 'border-[#F59E0B]/30',  text: 'text-[#B45309]',  iconBg: 'bg-[#F59E0B]/15' },
  red:    { bg: 'bg-[#EF4444]/8',  border: 'border-[#EF4444]/30',  text: 'text-[#DC2626]',  iconBg: 'bg-[#EF4444]/12' },
  purple: { bg: 'bg-[#7C3AED]/8',  border: 'border-[#7C3AED]/30',  text: 'text-[#7C3AED]',  iconBg: 'bg-[#7C3AED]/12' },
  teal:   { bg: 'bg-[#0D9488]/8',  border: 'border-[#0D9488]/30',  text: 'text-[#0D9488]',  iconBg: 'bg-[#0D9488]/12' },
};

function NodeIcon({ icon, className }: { icon: FlowNode['icon']; className?: string }) {
  const cn = className || 'w-5 h-5';
  switch (icon) {
    case 'user':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'bank':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>;
    case 'shield':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'check':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
    case 'x':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'refresh':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>;
    case 'lock':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'zap':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'dollar':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case 'link':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case 'card':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case 'building':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>;
    default:
      return null;
  }
}

function FlowNodeBox({ node }: { node: FlowNode }) {
  const c = colorMap[node.color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl px-4 py-3 flex items-center gap-3 min-w-[150px] transition-all hover:shadow-md print:shadow-none`}>
      {node.icon && (
        <div className={`${c.iconBg} rounded-lg p-1.5 flex-shrink-0`}>
          <NodeIcon icon={node.icon} className={`w-4 h-4 ${c.text}`} />
        </div>
      )}
      <div className="min-w-0">
        <div className={`${c.text} text-xs font-semibold leading-tight whitespace-nowrap`} style={{ fontFamily: 'Georgia, serif' }}>
          {node.label}
        </div>
        {node.sublabel && (
          <div className="text-[10px] text-[#8B7E6E] mt-0.5 leading-tight font-mono whitespace-nowrap">
            {node.sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

function DownArrow({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1.5">
      <svg width="12" height="32" viewBox="0 0 12 32" fill="none" aria-hidden="true">
        <path d="M6 0V28" stroke="#D4C5B0" strokeWidth="1.5" strokeDasharray={dashed ? '4 3' : undefined} />
        <path d="M1 24L6 30L11 24" stroke="#D4C5B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && (
        <span className="text-[10px] text-[#6B5D4F] font-mono tracking-wide bg-white/80 px-2 py-0.5 rounded-full border border-[#D4C5B0]/40">{label}</span>
      )}
    </div>
  );
}

function RightArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1.5">
      <svg width="36" height="12" viewBox="0 0 36 12" fill="none" aria-hidden="true">
        <path d="M0 6H32" stroke="#D4C5B0" strokeWidth="1.5" />
        <path d="M28 1L34 6L28 11" stroke="#D4C5B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && (
        <span className="text-[10px] text-[#6B5D4F] font-mono tracking-wide whitespace-nowrap">{label}</span>
      )}
    </div>
  );
}

export default function PaymentFlow({ title, description, nodes, rows, connections = [] }: PaymentFlowProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Find a connection between any node in prevRow and any node in nextRow
  const findVerticalConnection = (prevRow: string[], nextRow: string[]) => {
    for (const fromId of prevRow) {
      for (const toId of nextRow) {
        const conn = connections.find(c => c.from === fromId && c.to === toId);
        if (conn) return conn;
      }
    }
    // Fallback: check last node of prev → first node of next
    return connections.find(c => c.from === prevRow[prevRow.length - 1] && c.to === nextRow[0]);
  };

  const getHorizontalLabel = (fromId: string, toId: string) => {
    return connections.find(c => c.from === fromId && c.to === toId)?.label;
  };

  return (
    <figure
      className="my-8 p-6 sm:p-8 bg-[#FAF8F5] border border-[#D4C5B0] rounded-xl overflow-x-auto print:border-gray-300 print:bg-white"
      aria-label={`Payment flow diagram: ${title}`}
    >
      <figcaption className="text-center mb-5">
        <h4
          className="text-xs font-semibold text-[#8B7E6E] uppercase tracking-wider mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h4>
        {description && (
          <p className="text-[11px] text-[#8B7E6E]/70 font-mono">{description}</p>
        )}
      </figcaption>

      <div className="flex flex-col items-center gap-0 min-w-fit mx-auto">
        {rows.map((row, rowIndex) => {
          const prevRow = rowIndex > 0 ? rows[rowIndex - 1] : null;
          const vertConn = prevRow ? findVerticalConnection(prevRow, row) : null;

          return (
            <div key={rowIndex}>
              {/* Arrow between rows */}
              {prevRow && (
                <div className="flex justify-center">
                  <DownArrow
                    label={vertConn?.label}
                    dashed={vertConn?.dashed}
                  />
                </div>
              )}

              {/* Row of nodes */}
              <div className="flex items-center justify-center gap-0">
                {row.map((nodeId, nodeIndex) => {
                  const node = nodeMap.get(nodeId);
                  if (!node) return null;

                  const nextNodeId = row[nodeIndex + 1];
                  const hLabel = nextNodeId ? getHorizontalLabel(nodeId, nextNodeId) : undefined;

                  return (
                    <div key={nodeId} className="flex items-center">
                      <FlowNodeBox node={node} />
                      {nodeIndex < row.length - 1 && (
                        <RightArrow label={hLabel} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

// Simpler variant for branching flows
interface BranchFlowProps {
  title: string;
  mainFlow: FlowNode[];
  branches?: {
    afterNodeIndex: number;
    nodes: FlowNode[];
    label?: string;
  }[];
  connectionLabels?: string[];
}

export function BranchFlow({ title, mainFlow, branches = [], connectionLabels = [] }: BranchFlowProps) {
  return (
    <figure
      className="my-8 p-6 sm:p-8 bg-[#FAF8F5] border border-[#D4C5B0] rounded-xl overflow-x-auto print:border-gray-300 print:bg-white"
      aria-label={`Payment flow diagram: ${title}`}
    >
      <figcaption>
        <h4
          className="text-xs font-semibold text-[#8B7E6E] uppercase tracking-wider mb-5 text-center"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h4>
      </figcaption>

      {/* Main horizontal flow */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-0">
        {mainFlow.map((node, i) => (
          <div key={node.id} className="flex flex-col md:flex-row items-center">
            <FlowNodeBox node={node} />
            {i < mainFlow.length - 1 && (
              <>
                {/* Horizontal arrow for desktop */}
                <div className="hidden md:flex flex-col items-center gap-0.5 px-1.5">
                  <svg width="36" height="12" viewBox="0 0 36 12" fill="none" aria-hidden="true">
                    <path d="M0 6H32" stroke="#D4C5B0" strokeWidth="1.5" />
                    <path d="M28 1L34 6L28 11" stroke="#D4C5B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {connectionLabels[i] && (
                    <span className="text-[10px] text-[#6B5D4F] font-mono tracking-wide whitespace-nowrap">{connectionLabels[i]}</span>
                  )}
                </div>
                {/* Vertical arrow for mobile */}
                <div className="flex md:hidden flex-col items-center gap-0.5 py-1.5">
                  <svg width="12" height="32" viewBox="0 0 12 32" fill="none" aria-hidden="true">
                    <path d="M6 0V28" stroke="#D4C5B0" strokeWidth="1.5" />
                    <path d="M1 24L6 30L11 24" stroke="#D4C5B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {connectionLabels[i] && (
                    <span className="text-[10px] text-[#6B5D4F] font-mono tracking-wide">{connectionLabels[i]}</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Branches */}
      {branches.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {branches.map((branch, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center text-[#D4C5B0]">
                <svg width="12" height="28" viewBox="0 0 12 28" fill="none" aria-hidden="true">
                  <path d="M6 0V24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M1 20L6 26L11 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {branch.label && (
                  <span className="text-[10px] text-[#6B5D4F] font-mono bg-white/80 px-2 py-0.5 rounded-full border border-[#D4C5B0]/40">{branch.label}</span>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                {branch.nodes.map((node, ni) => (
                  <div key={node.id} className="flex flex-col items-center">
                    <FlowNodeBox node={node} />
                    {ni < branch.nodes.length - 1 && (
                      <div className="py-1">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                          <path d="M6 0V16" stroke="#D4C5B0" strokeWidth="1.5" />
                          <path d="M1 12L6 18L11 12" stroke="#D4C5B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}
