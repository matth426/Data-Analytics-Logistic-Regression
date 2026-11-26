import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ConceptOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface ConceptCheckProps {
  question: string;
  options: ConceptOption[];
  explanation: string;
  onAnswered?: (correct: boolean) => void;
}

export function ConceptCheck({
  question,
  options,
  explanation,
  onAnswered,
}: ConceptCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedOption = options.find((o) => o.id === selectedId) ?? null;

  const handleSelect = (option: ConceptOption) => {
    setSelectedId(option.id);
    onAnswered?.(option.isCorrect);
  };

  return (
    <div className="pt-5 border-t border-slate-200 space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
        {question}
      </p>

      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let style =
            'border-slate-200 bg-white text-slate-800 hover:border-slate-400';
          if (isSelected) {
            style = opt.isCorrect
              ? 'border-[#1D4ED8] bg-blue-50/70 text-slate-950 font-semibold'
              : 'border-slate-400 bg-slate-100 text-slate-800 font-medium';
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`text-left px-4 py-3 rounded-lg border text-base sm:text-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${style}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedOption && (
          <motion.div
            key={selectedOption.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`px-4 py-3 rounded-lg border text-base sm:text-lg flex items-start gap-2.5 ${
              selectedOption.isCorrect
                ? 'bg-blue-50/60 border-[#1D4ED8]/40 text-slate-950'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            {selectedOption.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] mt-1 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
            )}
            <div>
              <span className="font-semibold mr-1.5">
                {selectedOption.isCorrect ? 'Correct:' : 'Try again:'}
              </span>
              <span>{explanation}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
