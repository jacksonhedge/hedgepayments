'use client';

interface Step {
  title: string;
  description: string;
  highlight?: boolean;
}

interface StepListProps {
  steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
  return (
    <div className="my-6">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex gap-4 group">
            {/* Timeline column */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ${
                  step.highlight
                    ? 'bg-[#4CAF50] text-white shadow-[0_0_0_4px_rgba(76,175,80,0.15)]'
                    : 'bg-[#FAF8F5] text-[#6B5D4F] border-2 border-[#D4C5B0] group-hover:border-[#6B5D4F] group-hover:text-[#2C2416]'
                }`}
              >
                {index + 1}
              </div>
              {!isLast && (
                <div className={`w-px flex-1 min-h-[24px] my-1 ${
                  step.highlight ? 'bg-[#4CAF50]/30' : 'bg-[#D4C5B0]'
                }`} />
              )}
            </div>

            {/* Content column */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''} flex-1 min-w-0`}>
              <h4
                className={`text-[15px] font-semibold mb-1 ${
                  step.highlight ? 'text-[#4CAF50]' : 'text-[#2C2416]'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {step.title}
              </h4>
              <p
                className="text-[#6B5D4F] text-sm leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
