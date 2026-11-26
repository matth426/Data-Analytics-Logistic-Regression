import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  LEARNING_OBJECTIVES,
  MODULE_START_SLIDE,
  SLIDES,
  sigmoid,
} from '../../data/lectureData';
import { ConceptCheck } from '../ConceptCheck';

interface SlideProps {
  onGoToSlide: (slideId: number) => void;
  checkedObjectives: boolean[];
  onToggleObjective: (index: number) => void;
  onMarkSlideComplete: (slideId: number) => void;
}

export function Slide1Title({ onGoToSlide }: SlideProps) {
  const sigPoints = Array.from({ length: 61 }, (_, i) => {
    const z = -5 + (i / 60) * 10;
    const x = 60 + (i / 60) * 560;
    const y = 320 - sigmoid(z) * 240;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const sampleDots = [
    { x: 110, y: 320, label: '0' },
    { x: 210, y: 320, label: '0' },
    { x: 260, y: 80, label: '1' },
    { x: 390, y: 320, label: '0' },
    { x: 470, y: 80, label: '1' },
    { x: 570, y: 80, label: '1' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-4">
      {/* Left 30-35% */}
      <div className="lg:col-span-5 space-y-6">
        <div className="text-base sm:text-lg font-medium text-slate-500">
          IT365 - Data Analytics 1 · Lesson 9
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-950 tracking-tight leading-[1.08] [text-wrap:balance]">
          Logistic Regression
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
          Predicting yes or no, by hand and in Python
        </p>
        <div className="text-lg font-medium text-slate-800 pt-1">
          Mattheus Marcus Contreras
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onGoToSlide(2)}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#1D4ED8] text-white font-semibold text-lg hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <span>Start Lesson</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onGoToSlide(5)}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium text-lg hover:border-slate-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Jump to Sigmoid
          </button>
        </div>

        <p className="pt-4 border-t border-slate-200 text-sm sm:text-base text-slate-500 leading-relaxed">
          Disclaimer: AI was used to generate this interactive web page, while the lecture content and slides were created by Mattheus Marcus Contreras.
        </p>
      </div>

      {/* Right 65-70%: Spacious animated sigmoid preview */}
      <div className="lg:col-span-7">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <svg
            viewBox="0 0 680 390"
            className="w-full h-auto"
            role="img"
            aria-label="Animated logistic sigmoid curve separating binary outcomes 0 and 1"
          >
            {/* Reference ceiling & floor */}
            <line x1={60} y1={80} x2={620} y2={80} stroke="#E2E8F0" strokeDasharray="6 6" strokeWidth={1.5} />
            <line x1={60} y1={200} x2={620} y2={200} stroke="#F1F5F9" strokeWidth={1.5} />
            <line x1={60} y1={320} x2={620} y2={320} stroke="#CBD5E1" strokeWidth={1.5} />

            <text x={44} y={86} textAnchor="end" className="fill-slate-500 font-mono text-base">
              1.0
            </text>
            <text x={44} y={206} textAnchor="end" className="fill-slate-400 font-mono text-base">
              0.5
            </text>
            <text x={44} y={326} textAnchor="end" className="fill-slate-500 font-mono text-base">
              0.0
            </text>

            {/* Animated S-curve */}
            <motion.path
              d={sigPoints}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Animated binary observations */}
            {sampleDots.map((dot, idx) => (
              <motion.circle
                key={idx}
                cx={dot.x}
                cy={dot.y}
                r={8}
                fill={dot.label === '1' ? '#1D4ED8' : '#0F172A'}
                stroke="#FFFFFF"
                strokeWidth={2.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 + idx * 0.08, duration: 0.3 }}
              />
            ))}

            <text x={340} y={366} textAnchor="middle" className="fill-slate-500 font-sans text-base">
              Predictor x  →  Probability p = 1 / (1 + e^−z)
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Slide2Objectives({ onGoToSlide }: SlideProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="text-base font-medium text-slate-500">Lesson 9 Roadmap</div>
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-950 leading-tight [text-wrap:balance]">
          Learning Objectives
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
          At the end of this lesson, students should be able to master five core skills.
        </p>
      </div>

      {/* Right 70% */}
      <div className="lg:col-span-8">
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {LEARNING_OBJECTIVES.map((obj, idx) => {
            const targetSlide = [4, 5, 8, 10, 12][idx] ?? 3;
            return (
              <div
                key={obj}
                className="py-5 flex items-center justify-between gap-6"
              >
                <div className="flex items-baseline gap-4 flex-1">
                  <span className="font-mono text-lg font-semibold text-[#1D4ED8] tabular-nums shrink-0">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-xl sm:text-2xl leading-snug text-slate-900">
                    {obj}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onGoToSlide(targetSlide)}
                  className="font-mono text-base text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0 cursor-pointer px-2 py-1"
                >
                  Slide {targetSlide} →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Slide3WarmUp({ onMarkSlideComplete }: SlideProps) {
  const [hours, setHours] = useState<number>(6.0);
  const [revealed, setRevealed] = useState<boolean>(false);

  const linearPred = -0.2 + 0.25 * hours;
  const sigmoidPred = sigmoid(-2.5 + 1.0 * hours);
  const isInvalidLinear = linearPred < 0 || linearPred > 1;

  const width = 680;
  const height = 400;
  const padL = 72;
  const padR = 32;
  const padT = 36;
  const padB = 56;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const xToPx = (x: number) => padL + (x / 7) * plotW;
  const yToPx = (y: number) => padT + ((1.5 - y) / 1.9) * plotH;

  const sigmoidPath = Array.from({ length: 71 }, (_, i) => {
    const x = i * 0.1;
    const y = sigmoid(-2.5 + 1.0 * x);
    return `${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(1)} ${yToPx(y).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            Warm-Up: Predict before we Calculate
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            We predict Pass (1) or Fail (0) from hours studied.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200 text-lg text-slate-800 leading-relaxed">
          <p>
            <span className="font-semibold">Q:</span> A straight line predicts{' '}
            <span className="font-mono font-semibold">1.3</span>. What does 1.3 mean?
          </p>
          <p>
            <span className="font-semibold">Q:</span> Another line predicts{' '}
            <span className="font-mono font-semibold">−0.2</span>. Is that a probability?
          </p>
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              onMarkSlideComplete(3);
            }}
            className="px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white font-medium text-base hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Reveal Takeaway
          </button>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl font-semibold text-[#1D4ED8] leading-snug"
          >
            Neither. We need a model whose output always stays between 0 and 1.
          </motion.p>
        )}

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-base font-medium text-slate-800">
            <label htmlFor="warmup-hours">Hours Studied (x)</label>
            <span className="font-mono text-xl font-semibold tabular-nums text-[#1D4ED8]">
              {hours.toFixed(1)} h
            </span>
          </div>
          <input
            id="warmup-hours"
            type="range"
            min={0}
            max={7}
            step={0.5}
            value={hours}
            onChange={(e) => {
              setHours(parseFloat(e.target.value));
              onMarkSlideComplete(3);
            }}
            className="w-full lecture-slider"
          />
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setHours(0)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 hover:border-slate-400 cursor-pointer"
            >
              x = 0 (−0.2)
            </button>
            <button
              type="button"
              onClick={() => setHours(6)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 hover:border-slate-400 cursor-pointer"
            >
              x = 6 (1.3)
            </button>
          </div>
        </div>
      </div>

      {/* Right 70%: Animated Graph */}
      <div className="lg:col-span-8 space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-base font-medium text-slate-600">
              Straight Line vs. Bounded Sigmoid
            </span>
            <div className="flex items-center gap-6 text-base font-medium">
              <span className="text-slate-600">— Straight Line</span>
              <span className="text-[#1D4ED8]">— Sigmoid (Valid [0, 1])</span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Animated chart comparing straight line predictions with sigmoid probability"
          >
            {/* Shaded valid [0,1] corridor */}
            <rect
              x={padL}
              y={yToPx(1)}
              width={plotW}
              height={yToPx(0) - yToPx(1)}
              fill="#F8FAFC"
            />
            <line
              x1={padL}
              y1={yToPx(1)}
              x2={width - padR}
              y2={yToPx(1)}
              stroke="#94A3B8"
              strokeDasharray="6 6"
              strokeWidth={1.5}
            />
            <line
              x1={padL}
              y1={yToPx(0)}
              x2={width - padR}
              y2={yToPx(0)}
              stroke="#94A3B8"
              strokeDasharray="6 6"
              strokeWidth={1.5}
            />

            <text x={padL - 12} y={yToPx(1.3) + 5} textAnchor="end" className="fill-slate-500 font-mono text-sm">
              1.3
            </text>
            <text x={padL - 12} y={yToPx(1) + 5} textAnchor="end" className="fill-slate-800 font-mono text-base font-semibold">
              1.0
            </text>
            <text x={padL - 12} y={yToPx(0) + 5} textAnchor="end" className="fill-slate-800 font-mono text-base font-semibold">
              0.0
            </text>
            <text x={padL - 12} y={yToPx(-0.2) + 5} textAnchor="end" className="fill-slate-500 font-mono text-sm">
              −0.2
            </text>

            {/* X-axis */}
            <line
              x1={padL}
              y1={height - padB}
              x2={width - padR}
              y2={height - padB}
              stroke="#CBD5E1"
              strokeWidth={1.5}
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => (
              <text
                key={tick}
                x={xToPx(tick)}
                y={height - padB + 26}
                textAnchor="middle"
                className="fill-slate-600 font-mono text-base"
              >
                {tick}h
              </text>
            ))}

            {/* Animated Straight Line */}
            <motion.line
              x1={xToPx(0)}
              y1={yToPx(-0.2)}
              x2={xToPx(7)}
              y2={yToPx(-0.2 + 0.25 * 7)}
              stroke="#64748B"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Animated Sigmoid Curve */}
            <motion.path
              d={sigmoidPath}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={4}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Animated vertical cursor */}
            <motion.line
              animate={{ x1: xToPx(hours), x2: xToPx(hours) }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              y1={padT}
              y2={height - padB}
              stroke="#CBD5E1"
              strokeDasharray="3 4"
              strokeWidth={1.5}
            />

            {/* Animated Linear dot */}
            <motion.circle
              animate={{ cx: xToPx(hours), cy: yToPx(linearPred) }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              r={8}
              fill={isInvalidLinear ? '#0F172A' : '#64748B'}
              stroke="#FFFFFF"
              strokeWidth={2.5}
            />

            {/* Animated Sigmoid dot */}
            <motion.circle
              animate={{ cx: xToPx(hours), cy: yToPx(sigmoidPred) }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              r={9}
              fill="#1D4ED8"
              stroke="#FFFFFF"
              strokeWidth={2.5}
            />
          </svg>
        </div>

        {/* Clean 2-metric comparison row */}
        <div className="grid grid-cols-2 gap-6 font-mono tabular-nums">
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm text-slate-500 font-sans">Straight Line Output</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {linearPred.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 mt-1 font-sans">
              {isInvalidLinear ? 'Outside [0, 1] — impossible probability' : 'Inside [0, 1] only locally'}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-[#1D4ED8]/40 bg-blue-50/40">
            <div className="text-sm text-[#1D4ED8] font-sans font-medium">Sigmoid Output</div>
            <div className="text-3xl font-bold text-[#1D4ED8] mt-1">
              {sigmoidPred.toFixed(3)}
            </div>
            <div className="text-sm text-slate-700 mt-1 font-sans">
              Always strictly between 0 and 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slide4WhyNotLinear({ onMarkSlideComplete }: SlideProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const examples = [
    { one: 'Pass', zero: 'Fail', feature: 'Hours studied' },
    { one: 'Churn', zero: 'Stay', feature: 'Support tickets' },
    { one: 'Spam', zero: 'Not spam', feature: 'Suspicious links' },
  ];
  const active = examples[selectedIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-950 leading-tight [text-wrap:balance]">
          Why Not Linear Regression?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
          Use logistic regression whenever <span className="font-mono font-semibold text-slate-900">y</span> is binary.
        </p>

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="text-base font-medium text-slate-800">
            Pick a binary outcome example:
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={ex.one}
                type="button"
                onClick={() => {
                  setSelectedIdx(i);
                  onMarkSlideComplete(4);
                }}
                className={`px-4 py-2 rounded-lg border text-base font-medium transition-colors cursor-pointer ${
                  selectedIdx === i
                    ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {ex.one} / {ex.zero}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right 70% */}
      <div className="lg:col-span-8 space-y-8">
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="py-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-baseline"
          >
            <div className="text-xl font-semibold text-slate-900">Problem 1</div>
            <div className="sm:col-span-3 text-xl sm:text-2xl text-slate-700 leading-relaxed">
              Predictions can fall below 0 or above 1, so they are not probabilities.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="py-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-baseline"
          >
            <div className="text-xl font-semibold text-slate-900">Problem 2</div>
            <div className="sm:col-span-3 text-xl sm:text-2xl text-slate-700 leading-relaxed">
              The errors of a 0/1 outcome cannot be normal or constant in variance.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.16 }}
            className="py-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-baseline bg-blue-50/30 -mx-4 px-4 rounded-lg"
          >
            <div className="text-xl font-bold text-[#1D4ED8]">Fix</div>
            <div className="sm:col-span-3 text-xl sm:text-2xl font-medium text-slate-950 leading-relaxed">
              Model the probability through an S-shaped curve, the sigmoid.
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.one}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="p-6 rounded-xl border border-slate-200 bg-slate-50 font-mono text-base sm:text-lg text-slate-800"
          >
            Target <span className="text-[#1D4ED8] font-semibold">y = 1 ({active.one})</span> vs{' '}
            <span className="font-semibold">y = 0 ({active.zero})</span> predicted from{' '}
            <span className="underline decoration-slate-400 underline-offset-4">{active.feature}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Slide5Sigmoid({ onMarkSlideComplete }: SlideProps) {
  const [beta0, setBeta0] = useState(-2.5);
  const [beta1, setBeta1] = useState(1.0);
  const [xVal, setXVal] = useState(2.5);

  const z = beta0 + beta1 * xVal;
  const p = sigmoid(z);
  const odds = p / Math.max(1 - p, 1e-9);

  const width = 680;
  const height = 380;
  const padL = 72;
  const padR = 32;
  const padT = 32;
  const padB = 52;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Plot over x in [-2, 7] so shifting beta0/beta1 visibly shifts & steepens the curve!
  const xToPx = (xv: number) => padL + ((xv + 2) / 9) * plotW;
  const pToPx = (pv: number) => padT + (1 - pv) * plotH;

  const curvePath = Array.from({ length: 91 }, (_, i) => {
    const xv = -2 + i * 0.1;
    const pv = sigmoid(beta0 + beta1 * xv);
    return `${i === 0 ? 'M' : 'L'} ${xToPx(xv).toFixed(1)} ${pToPx(pv).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            The Sigmoid and Log-Odds
          </h2>
          <p className="text-lg sm:text-xl text-[#1D4ED8] font-medium leading-snug">
            The model is linear in the log-odds. z = 0 gives p = 0.5.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-base text-slate-900 space-y-1.5">
          <div>z = β0 + β1·x</div>
          <div>p = 1 / (1 + e^(−z))</div>
          <div>ln(p / (1 − p)) = z</div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-base font-medium text-slate-700 mb-1.5">
              <span>Intercept β0</span>
              <span className="font-mono tabular-nums font-semibold">{beta0.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-5}
              max={3}
              step={0.5}
              value={beta0}
              onChange={(e) => {
                setBeta0(parseFloat(e.target.value));
                onMarkSlideComplete(5);
              }}
              className="w-full lecture-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-base font-medium text-slate-700 mb-1.5">
              <span>Slope β1</span>
              <span className="font-mono tabular-nums font-semibold">{beta1.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2}
              max={3}
              step={0.2}
              value={beta1}
              onChange={(e) => {
                setBeta1(parseFloat(e.target.value));
                onMarkSlideComplete(5);
              }}
              className="w-full lecture-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-base font-medium text-slate-700 mb-1.5">
              <span>Input x</span>
              <span className="font-mono tabular-nums font-semibold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2}
              max={7}
              step={0.5}
              value={xVal}
              onChange={(e) => {
                setXVal(parseFloat(e.target.value));
                onMarkSlideComplete(5);
              }}
              className="w-full lecture-slider"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setBeta0(-2.5);
              setBeta1(1.0);
              setXVal(2.5);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to z = 0
          </button>
        </div>
      </div>

      {/* Right 70%: Animated Sigmoid SVG + Large Readouts */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Animated interactive sigmoid curve"
          >
            <line x1={padL} y1={pToPx(1)} x2={width - padR} y2={pToPx(1)} stroke="#CBD5E1" strokeDasharray="6 6" strokeWidth={1.5} />
            <line x1={padL} y1={pToPx(0.5)} x2={width - padR} y2={pToPx(0.5)} stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth={1.5} />
            <line x1={padL} y1={pToPx(0)} x2={width - padR} y2={pToPx(0)} stroke="#94A3B8" strokeWidth={1.5} />

            <text x={padL - 12} y={pToPx(1) + 5} textAnchor="end" className="fill-slate-700 font-mono text-base">
              1.0
            </text>
            <text x={padL - 12} y={pToPx(0.5) + 5} textAnchor="end" className="fill-slate-400 font-mono text-base">
              0.5
            </text>
            <text x={padL - 12} y={pToPx(0) + 5} textAnchor="end" className="fill-slate-700 font-mono text-base">
              0.0
            </text>

            {[-2, 0, 2, 4, 6].map((xt) => (
              <text
                key={xt}
                x={xToPx(xt)}
                y={height - padB + 26}
                textAnchor="middle"
                className="fill-slate-600 font-mono text-base"
              >
                x={xt}
              </text>
            ))}

            {/* Morphing Sigmoid Curve */}
            <motion.path
              animate={{ d: curvePath }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={4}
              strokeLinecap="round"
            />

            {/* Animated projection lines & point */}
            <motion.line
              animate={{ x1: xToPx(xVal), x2: xToPx(xVal), y1: pToPx(0), y2: pToPx(p) }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <motion.line
              animate={{ x1: padL, x2: xToPx(xVal), y1: pToPx(p), y2: pToPx(p) }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <motion.circle
              animate={{ cx: xToPx(xVal), cy: pToPx(p) }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              r={10}
              fill="#1D4ED8"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-5 font-mono tabular-nums">
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm font-sans text-slate-500">Log-odds (z)</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{z.toFixed(2)}</div>
          </div>
          <div className="p-5 rounded-xl border border-[#1D4ED8]/40 bg-blue-50/40">
            <div className="text-sm font-sans font-medium text-[#1D4ED8]">Probability (p)</div>
            <div className="text-3xl font-bold text-[#1D4ED8] mt-1">{p.toFixed(3)}</div>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm font-sans text-slate-500">Odds p/(1−p)</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {odds > 99 ? '>99' : odds.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slide6OddsRatios({ onMarkSlideComplete }: SlideProps) {
  const [beta1, setBeta1] = useState(0.69);
  const oddsRatio = Math.exp(beta1);

  const steps = [0, 1, 2, 3].map((step) => {
    const z = step * beta1;
    const p = sigmoid(z);
    const odds = p / (1 - p);
    return { step, z, p, odds };
  });

  const maxOdds = Math.max(...steps.map((s) => s.odds), 1.5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            Odds and Odds Ratios
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            For every <span className="font-mono font-semibold text-slate-900">+1</span> in{' '}
            <span className="font-mono font-semibold text-slate-900">x</span>, the odds multiply by{' '}
            <span className="font-mono font-semibold text-[#1D4ED8]">e^β1</span>.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-slate-700">Slope β1</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#1D4ED8]">
              {beta1.toFixed(2)} → {oddsRatio.toFixed(2)}×
            </span>
          </div>
          <input
            type="range"
            min={-1.2}
            max={1.2}
            step={0.01}
            value={beta1}
            onChange={(e) => {
              setBeta1(parseFloat(e.target.value));
              onMarkSlideComplete(6);
            }}
            className="w-full lecture-slider"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: 'β1 = −0.69 (0.5×)', val: -0.69 },
              { label: 'β1 = 0.69 (2×)', val: 0.69 },
              { label: 'β1 = 0.908 (2.48×)', val: 0.908 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setBeta1(p.val);
                  onMarkSlideComplete(6);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-sm text-slate-700 hover:border-slate-400 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <ConceptCheck
          question="If β1 is negative, is e^β1 above or below 1?"
          options={[
            { id: 'above', label: 'Above 1', isCorrect: false },
            { id: 'below', label: 'Below 1 (between 0 and 1)', isCorrect: true },
          ]}
          explanation="When β1 < 0, e^β1 lies between 0 and 1, so each +1 in x shrinks the odds."
          onAnswered={() => onMarkSlideComplete(6)}
        />
      </div>

      {/* Right 70%: Animated Multiplicative Odds Bars */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-lg font-semibold text-slate-900">
              Multiplicative Odds Growth (starting at odds = 1.00)
            </span>
            <span className="font-mono text-base text-[#1D4ED8] font-semibold">
              e^{beta1.toFixed(2)} = {oddsRatio.toFixed(2)}× per step
            </span>
          </div>

          <div className="space-y-5">
            {steps.map((s) => {
              const barPct = Math.min(Math.max((s.odds / maxOdds) * 100, 3), 100);
              return (
                <div key={s.step} className="space-y-2">
                  <div className="flex items-baseline justify-between font-mono text-base sm:text-lg tabular-nums">
                    <span className="font-semibold text-slate-900">
                      x₀ + {s.step}{' '}
                      <span className="font-normal text-slate-500">
                        (p = {s.p.toFixed(3)})
                      </span>
                    </span>
                    <span className="font-bold text-slate-950">
                      odds = {s.odds.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-6 w-full rounded-md bg-slate-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-md ${
                        s.step === 1 ? 'bg-[#1D4ED8]' : 'bg-slate-800'
                      }`}
                      initial={false}
                      animate={{ width: `${barPct}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-lg text-slate-600 leading-relaxed">
          Example: <span className="font-mono text-slate-900">p = 0.8</span> gives odds{' '}
          <span className="font-mono text-slate-900">0.8 / 0.2 = 4</span> (four passes for every fail).
        </p>
      </div>
    </div>
  );
}

export { SLIDES };
