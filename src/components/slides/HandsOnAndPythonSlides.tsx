import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  XCircle,
} from 'lucide-react';
import {
  PRACTICE_DATASET,
  SKLEARN_CODE,
  STATSMODELS_CODE,
  computeConfusionMetrics,
  evaluateModel,
  runIRLS,
  sigmoid,
} from '../../data/lectureData';
import { CodeBlock } from '../CodeBlock';
import { ConceptCheck } from '../ConceptCheck';

interface HandsOnProps {
  onMarkSlideComplete: (slideId: number) => void;
}

export function Slide7PracticeDataset({ onMarkSlideComplete }: HandsOnProps) {
  const [zInput, setZInput] = useState('');
  const [zChecked, setZChecked] = useState<boolean | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(zInput.trim());
    const correct = !Number.isNaN(val) && Math.abs(val - 0.5) < 0.01;
    setZChecked(correct);
    if (correct) onMarkSlideComplete(7);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            Practice Dataset
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            Hours studied and whether the student passed (<span className="font-mono">n = 4</span>).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-base sm:text-lg text-slate-900">
          Hand exercise: <span className="font-bold text-[#1D4ED8]">β0 = −2.5, β1 = 1</span>
        </div>

        <form onSubmit={handleCheck} className="pt-4 border-t border-slate-200 space-y-3">
          <label
            htmlFor="slide7-z-input"
            className="block text-lg font-semibold text-slate-900"
          >
            What is z for a student who studied 3 hours?
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="slide7-z-input"
              type="text"
              inputMode="decimal"
              value={zInput}
              onChange={(e) => {
                setZInput(e.target.value);
                setZChecked(null);
              }}
              placeholder="z = ?"
              className="w-28 px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-lg text-slate-950 tabular-nums focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white font-medium text-base hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Check
            </button>
          </div>
          {zChecked !== null && (
            <div className="text-base font-medium text-slate-800 flex items-center gap-2 pt-1">
              {zChecked ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                  <span>Correct: −2.5 + 1(3) = 0.5</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-slate-500 shrink-0" />
                  <span>Compute −2.5 + 1 × 3.</span>
                </>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Right 70%: Clean Table + Animated Scatter */}
      <div className="lg:col-span-8 space-y-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left font-mono text-base sm:text-lg tabular-nums">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-sans">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">x Hours</th>
                <th className="px-6 py-4 font-semibold">y Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {PRACTICE_DATASET.map((row) => (
                <tr key={row.student}>
                  <td className="px-6 py-4 text-slate-800">{row.student}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{row.x}</td>
                  <td className="px-6 py-4 font-bold">
                    <span className={row.y === 1 ? 'text-[#1D4ED8]' : 'text-slate-900'}>
                      {row.y}
                    </span>{' '}
                    <span className="font-sans font-normal text-slate-500 text-base">
                      ({row.y === 1 ? 'Pass' : 'Fail'})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <svg
            viewBox="0 0 640 210"
            className="w-full h-auto"
            role="img"
            aria-label="Animated scatter plot of the four students"
          >
            <line x1={80} y1={45} x2={580} y2={45} stroke="#E2E8F0" strokeDasharray="6 6" strokeWidth={1.5} />
            <line x1={80} y1={155} x2={580} y2={155} stroke="#CBD5E1" strokeWidth={1.5} />
            <text x={60} y={51} textAnchor="end" className="fill-[#1D4ED8] font-mono text-base font-semibold">
              y = 1
            </text>
            <text x={60} y={161} textAnchor="end" className="fill-slate-700 font-mono text-base font-semibold">
              y = 0
            </text>

            {PRACTICE_DATASET.map((d, idx) => {
              const cx = 80 + ((d.x - 0.5) / 4) * 500;
              const cy = d.y === 1 ? 45 : 155;
              return (
                <g key={d.student}>
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={11}
                    fill={d.y === 1 ? '#1D4ED8' : '#0F172A'}
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.12 * idx, type: 'spring', stiffness: 260, damping: 20 }}
                  />
                  <text
                    x={cx}
                    y={d.y === 1 ? 76 : 134}
                    textAnchor="middle"
                    className="fill-slate-600 font-mono text-sm"
                  >
                    Student {d.student} ({d.x}h)
                  </text>
                </g>
              );
            })}

            {[1, 2, 3, 4].map((xt) => (
              <text
                key={xt}
                x={80 + ((xt - 0.5) / 4) * 500}
                y={192}
                textAnchor="middle"
                className="fill-slate-500 font-mono text-base"
              >
                x = {xt}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Slide8ManualComputation({ onMarkSlideComplete }: HandsOnProps) {
  const [useMLE, setUseMLE] = useState(false);

  const beta0 = useMLE ? -2.27 : -2.5;
  const beta1 = useMLE ? 0.908 : 1.0;

  const evalRes = useMemo(
    () => evaluateModel(PRACTICE_DATASET, beta0, beta1),
    [beta0, beta1]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            Manual Computation
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            For <span className="font-mono">y = 1</span>, loss is{' '}
            <span className="font-mono font-semibold text-slate-900">−ln(p)</span>. For{' '}
            <span className="font-mono">y = 0</span>, it is{' '}
            <span className="font-mono font-semibold text-slate-900">−ln(1 − p)</span>.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="text-base font-medium text-slate-700">Compare coefficients:</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setUseMLE(false)}
              className={`px-4 py-2.5 rounded-lg border text-left font-mono text-base transition-colors cursor-pointer ${
                !useMLE
                  ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              Hand Guess: (−2.5, 1.0)
            </button>
            <button
              type="button"
              onClick={() => {
                setUseMLE(true);
                onMarkSlideComplete(8);
              }}
              className={`px-4 py-2.5 rounded-lg border text-left font-mono text-base transition-colors cursor-pointer ${
                useMLE
                  ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              Fitted MLE: (−2.270, 0.908)
            </button>
          </div>

          <div className="pt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">What is MLE?</span>{' '}
            Maximum Likelihood Estimation finds the{' '}
            <span className="font-mono text-slate-900">β</span> values that make the observed outcomes most probable—equivalently, minimizing the mean log loss.
          </div>
        </div>

        <ConceptCheck
          question="Why is the loss large for students 2 and 3?"
          options={[
            {
              id: 'wrong-side',
              label: 'Predicted p was on the wrong side of 0.5',
              isCorrect: true,
            },
            {
              id: 'outliers',
              label: 'Their x values are outliers',
              isCorrect: false,
            },
          ]}
          explanation="Student 2 passed (y=1) with p=0.378, and Student 3 failed (y=0) with p=0.622."
          onAnswered={() => onMarkSlideComplete(8)}
        />
      </div>

      {/* Right 70%: Clean Table + Animated Log-Loss Bars */}
      <div className="lg:col-span-8 space-y-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left font-mono text-base sm:text-lg tabular-nums">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-sans">
              <tr>
                <th className="px-5 py-3.5 font-semibold">x</th>
                <th className="px-5 py-3.5 font-semibold">z</th>
                <th className="px-5 py-3.5 font-semibold">p</th>
                <th className="px-5 py-3.5 font-semibold">y</th>
                <th className="px-5 py-3.5 font-semibold">loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {evalRes.rows.map((r) => {
                const highLoss = r.loss > 0.7;
                return (
                  <tr key={r.student} className={highLoss ? 'bg-blue-50/30' : ''}>
                    <td className="px-5 py-3.5 text-slate-900">{r.x}</td>
                    <td className="px-5 py-3.5 text-slate-700">{r.z.toFixed(useMLE ? 3 : 1)}</td>
                    <td className="px-5 py-3.5 text-slate-900">{r.p.toFixed(3)}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{r.y}</td>
                    <td className={`px-5 py-3.5 font-bold ${highLoss ? 'text-[#1D4ED8]' : 'text-slate-900'}`}>
                      {r.loss.toFixed(3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Animated Loss Bars */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-lg font-semibold text-slate-900">
              Log Loss per Student
            </span>
            <span className="font-mono text-xl font-bold text-[#1D4ED8] tabular-nums">
              Mean log loss = {evalRes.meanLoss.toFixed(3)}
            </span>
          </div>

          <div className="space-y-3.5">
            {evalRes.rows.map((r) => {
              const highLoss = r.loss > 0.7;
              const widthPct = Math.min((r.loss / 1.1) * 100, 100);
              return (
                <div key={r.student} className="grid grid-cols-12 gap-4 items-center font-mono text-base tabular-nums">
                  <div className="col-span-3 text-slate-700">
                    S{r.student} (x={r.x}, y={r.y})
                  </div>
                  <div className="col-span-7 h-5 rounded-md bg-slate-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-md ${highLoss ? 'bg-[#1D4ED8]' : 'bg-slate-700'}`}
                      initial={false}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    />
                  </div>
                  <div className={`col-span-2 text-right font-semibold ${highLoss ? 'text-[#1D4ED8]' : 'text-slate-900'}`}>
                    {r.loss.toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slide9FittingIRLS({ onMarkSlideComplete }: HandsOnProps) {
  const steps = useMemo(() => runIRLS(PRACTICE_DATASET, 0, 0, 6, 0), []);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      onMarkSlideComplete(9);
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, 650);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, onMarkSlideComplete]);

  const current = steps[stepIdx];

  const width = 680;
  const height = 340;
  const padL = 68;
  const padR = 32;
  const padT = 28;
  const padB = 48;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xToPx = (x: number) => padL + ((x - 0.5) / 4) * plotW;
  const pToPx = (p: number) => padT + (1 - p) * plotH;

  const curvePath = Array.from({ length: 41 }, (_, i) => {
    const x = 0.5 + i * 0.1;
    const p = sigmoid(current.beta0 + current.beta1 * x);
    return `${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(1)} ${pToPx(p).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            How the Model Is Fitted
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            No closed form. Logistic regression repeats Newton steps (IRLS).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm sm:text-base text-slate-900 space-y-1.5">
          <div>β ← β + (XᵀWX)⁻¹ Xᵀ(y − p)</div>
          <div className="text-slate-600">W = diag(p(1 − p))</div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="font-mono text-base font-semibold text-slate-800 tabular-nums">
            Iteration {current.iteration} of {steps.length - 1}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (stepIdx >= steps.length - 1) setStepIdx(0);
                setIsPlaying((p) => !p);
                onMarkSlideComplete(9);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D4ED8] text-white font-medium text-base hover:bg-blue-800 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Animate IRLS'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
                onMarkSlideComplete(9);
              }}
              disabled={stepIdx >= steps.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium text-base hover:border-slate-500 disabled:opacity-40 cursor-pointer"
            >
              <StepForward className="w-4 h-4" />
              Step
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-base hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          <p>
            <span className="font-semibold text-slate-900">What is IRLS?</span>{' '}
            Iteratively Reweighted Least Squares repeats a weighted least-squares step, updating each observation&apos;s weight{' '}
            <span className="font-mono text-slate-900">p(1 − p)</span> every round until{' '}
            <span className="font-mono text-slate-900">β</span> converges to the MLE.
          </p>
          <p>
            Linear regression solves <span className="font-mono">(XᵀX)⁻¹Xᵀy</span> in one step. Logistic repeats it.
          </p>
        </div>
      </div>

      {/* Right 70%: Animated Morphing Curve + Live Parameter Table */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Animated IRLS sigmoid convergence"
          >
            <line x1={padL} y1={pToPx(1)} x2={width - padR} y2={pToPx(1)} stroke="#E2E8F0" strokeDasharray="6 6" />
            <line x1={padL} y1={pToPx(0.5)} x2={width - padR} y2={pToPx(0.5)} stroke="#F1F5F9" />
            <line x1={padL} y1={pToPx(0)} x2={width - padR} y2={pToPx(0)} stroke="#CBD5E1" strokeWidth={1.5} />

            <text x={padL - 12} y={pToPx(1) + 5} textAnchor="end" className="fill-slate-600 font-mono text-base">
              1.0
            </text>
            <text x={padL - 12} y={pToPx(0.5) + 5} textAnchor="end" className="fill-slate-400 font-mono text-base">
              0.5
            </text>
            <text x={padL - 12} y={pToPx(0) + 5} textAnchor="end" className="fill-slate-600 font-mono text-base">
              0.0
            </text>

            {/* Morphing IRLS curve */}
            <motion.path
              animate={{ d: curvePath }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={4}
              strokeLinecap="round"
            />

            {PRACTICE_DATASET.map((d) => (
              <circle
                key={d.student}
                cx={xToPx(d.x)}
                cy={pToPx(d.y)}
                r={9}
                fill={d.y === 1 ? '#1D4ED8' : '#0F172A'}
                stroke="#FFFFFF"
                strokeWidth={2.5}
              />
            ))}

            {[1, 2, 3, 4].map((x) => (
              <text
                key={x}
                x={xToPx(x)}
                y={height - 14}
                textAnchor="middle"
                className="fill-slate-600 font-mono text-base"
              >
                x = {x}
              </text>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm font-sans text-slate-500">β̂0</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{current.beta0.toFixed(3)}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm font-sans text-slate-500">β̂1</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{current.beta1.toFixed(3)}</div>
          </div>
          <div className="p-4 rounded-xl border border-[#1D4ED8]/40 bg-blue-50/40">
            <div className="text-sm font-sans font-medium text-[#1D4ED8]">Odds Ratio</div>
            <div className="text-2xl font-bold text-[#1D4ED8] mt-1">{current.oddsRatio.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="text-sm font-sans text-slate-500">Log-Likelihood</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{current.logLikelihood.toFixed(3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slide10Sklearn({ onMarkSlideComplete }: HandsOnProps) {
  const [usePenaltyNone, setUsePenaltyNone] = useState(true);

  const mleSteps = useMemo(() => runIRLS(PRACTICE_DATASET, 0, 0, 10, 0), []);
  const l2Steps = useMemo(() => runIRLS(PRACTICE_DATASET, 0, 0, 10, 1.0), []);

  const activeStep = usePenaltyNone
    ? mleSteps[mleSteps.length - 1]
    : l2Steps[l2Steps.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
            sklearn
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            Compare unregularized MLE (<span className="font-mono">penalty=None</span>) against default L2 regularization.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setUsePenaltyNone(true);
              onMarkSlideComplete(10);
            }}
            className={`px-4 py-2.5 rounded-lg border text-left font-mono text-base transition-colors cursor-pointer ${
              usePenaltyNone
                ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-semibold'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            penalty=None (−2.270, 0.908)
          </button>
          <button
            type="button"
            onClick={() => {
              setUsePenaltyNone(false);
              onMarkSlideComplete(10);
            }}
            className={`px-4 py-2.5 rounded-lg border text-left font-mono text-base transition-colors cursor-pointer ${
              !usePenaltyNone
                ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-semibold'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            Default L2, C=1.0 (−1.412, 0.565)
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200 text-base sm:text-lg text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">What is L2 regularization?</span>{' '}
          It adds a penalty proportional to{' '}
          <span className="font-mono text-slate-900">β₁²</span> to the loss, shrinking coefficients toward{' '}
          <span className="font-mono text-slate-900">0</span> to prevent overfitting. Larger{' '}
          <span className="font-mono text-slate-900">C</span> weakens the penalty;{' '}
          <span className="font-mono text-slate-900">penalty=None</span> disables it.
        </div>

        <ConceptCheck
          question="sklearn applies regularization by default. What does penalty=None do?"
          options={[
            {
              id: 'unreg',
              label: 'Disables L2 shrinkage for exact MLE',
              isCorrect: true,
            },
            {
              id: 'zero',
              label: 'Sets all coefficients to zero',
              isCorrect: false,
            },
          ]}
          explanation="Passing penalty=None fits pure maximum likelihood without shrinking β toward zero."
          onAnswered={() => onMarkSlideComplete(10)}
        />
      </div>

      {/* Right 70%: Code + Animated Predicted Probabilities */}
      <div className="lg:col-span-8 space-y-6">
        <CodeBlock label="Python — scikit-learn" code={SKLEARN_CODE} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-lg font-semibold text-slate-900">
              Predicted Probabilities: <span className="font-mono">m.predict_proba(X)[:, 1]</span>
            </span>
            <span className="font-mono text-base text-[#1D4ED8] font-semibold tabular-nums">
              β = ({activeStep.beta0.toFixed(3)}, {activeStep.beta1.toFixed(3)})
            </span>
          </div>

          <div className="space-y-3">
            {activeStep.probs.map((prob, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 items-center font-mono text-base tabular-nums">
                <div className="col-span-3 text-slate-700">x = {idx + 1}</div>
                <div className="col-span-7 h-5 rounded-md bg-slate-100 overflow-hidden relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10" />
                  <motion.div
                    className="h-full rounded-md bg-[#1D4ED8]"
                    initial={false}
                    animate={{ width: `${prob * 100}%` }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  />
                </div>
                <div className="col-span-2 text-right font-semibold text-slate-900">
                  {prob.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slide11Statsmodels({ onMarkSlideComplete }: HandsOnProps) {
  const [selectedTerm, setSelectedTerm] = useState<'coef' | 'std err' | 'z' | 'P>|z|' | 'McFadden'>('P>|z|');

  const explanations: Record<typeof selectedTerm, string> = {
    coef: 'Log-odds coefficients: const = −2.270 and Hours = 0.908.',
    'std err': 'Standard error = 1.077. With n = 4, uncertainty is wide.',
    z: 'Wald statistic z = 0.908 / 1.077 ≈ 0.84.',
    'P>|z|': 'Hours: z = 0.84, p ≈ 0.40. With n = 4 it is not significant.',
    McFadden: 'McFadden pseudo R² = 0.153.',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
            statsmodels
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            Outputs <span className="font-mono">coef, SE, z, p</span>, and pseudo <span className="font-mono">R²</span> (McFadden = 0.153).
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="text-sm font-medium text-slate-500">Our result</div>
          <div className="text-xl font-semibold text-slate-950 leading-snug">
            Hours: <span className="font-mono text-[#1D4ED8]">z = 0.84, p ≈ 0.40</span>.
          </div>
          <p className="text-lg text-slate-600">With n = 4 it is not significant.</p>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="text-sm font-medium text-slate-500">Inspect column:</div>
          <div className="flex flex-wrap gap-2">
            {(['coef', 'std err', 'z', 'P>|z|', 'McFadden'] as const).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSelectedTerm(term);
                  onMarkSlideComplete(11);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono text-sm cursor-pointer transition-colors ${
                  selectedTerm === term
                    ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
          <motion.p
            key={selectedTerm}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base text-slate-700 pt-2 leading-relaxed"
          >
            {explanations[selectedTerm]}
          </motion.p>
        </div>
      </div>

      {/* Right 70% */}
      <div className="lg:col-span-8 space-y-6">
        <CodeBlock label="Python — statsmodels.api" code={STATSMODELS_CODE} />

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left font-mono text-base sm:text-lg tabular-nums">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-sans">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Variable</th>
                <th className="px-5 py-3.5 font-semibold">coef</th>
                <th className="px-5 py-3.5 font-semibold">std err</th>
                <th className="px-5 py-3.5 font-semibold">z</th>
                <th className="px-5 py-3.5 font-semibold">P&gt;|z|</th>
                <th className="px-5 py-3.5 font-semibold">exp(coef)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-900">const</td>
                <td className="px-5 py-4">−2.270</td>
                <td className="px-5 py-4">2.848</td>
                <td className="px-5 py-4">−0.80</td>
                <td className="px-5 py-4">0.425</td>
                <td className="px-5 py-4">0.103</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-semibold text-slate-900">Hours</td>
                <td className="px-5 py-4">0.908</td>
                <td className="px-5 py-4">1.077</td>
                <td className="px-5 py-4">0.84</td>
                <td className="px-5 py-4 font-bold text-[#1D4ED8]">0.40</td>
                <td className="px-5 py-4 font-bold text-slate-950">2.480</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Slide12Evaluation({ onMarkSlideComplete }: HandsOnProps) {
  const [threshold, setThreshold] = useState(0.5);

  const fittedProbs = [0.204, 0.388, 0.612, 0.796];
  const actuals: Array<0 | 1> = [0, 1, 0, 1];
  const metrics = useMemo(
    () => computeConfusionMetrics(fittedProbs, actuals, threshold),
    [threshold]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
            Evaluating Predictions
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            Predict 1 when <span className="font-mono font-semibold text-slate-900">p ≥ {threshold.toFixed(2)}</span>. Move the threshold to trade precision for recall.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-slate-700">Threshold τ</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#1D4ED8]">
              {threshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={threshold}
            onChange={(e) => {
              setThreshold(parseFloat(e.target.value));
              onMarkSlideComplete(12);
            }}
            className="w-full lecture-slider"
          />
          <button
            type="button"
            onClick={() => setThreshold(0.5)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to 0.50
          </button>
        </div>

        <ConceptCheck
          question="When is recall more important than accuracy?"
          options={[
            {
              id: 'missing',
              label: 'When missing a positive is costly (disease, fraud)',
              isCorrect: true,
            },
            {
              id: 'never',
              label: 'Never — accuracy is always best',
              isCorrect: false,
            },
          ]}
          explanation="Lowering the threshold catches more true positives (higher recall) at the expense of extra false alarms."
          onAnswered={() => onMarkSlideComplete(12)}
        />
      </div>

      {/* Right 70%: Animated Threshold Dot-Line + Confusion Matrix + Animated Metric Bars */}
      <div className="lg:col-span-8 space-y-6">
        {/* Animated Probability Threshold Axis */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-base font-semibold text-slate-800 mb-2">
            Animated Classification Boundary (Predict 1 to the right of τ)
          </div>
          <svg viewBox="0 0 640 135" className="w-full h-auto" role="img" aria-label="Probability threshold axis">
            <line x1={40} y1={68} x2={600} y2={68} stroke="#CBD5E1" strokeWidth={2} />
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const x = 40 + tick * 560;
              return (
                <g key={tick}>
                  <line x1={x} y1={62} x2={x} y2={74} stroke="#94A3B8" strokeWidth={1.5} />
                  <text x={x} y={114} textAnchor="middle" className="fill-slate-500 font-mono text-sm">
                    {tick.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Sliding threshold line */}
            <motion.line
              animate={{ x1: 40 + threshold * 560, x2: 40 + threshold * 560 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              y1={16}
              y2={94}
              stroke="#1D4ED8"
              strokeWidth={3}
            />
            <motion.text
              animate={{ x: 40 + threshold * 560 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              y={14}
              textAnchor="middle"
              className="fill-[#1D4ED8] font-mono text-sm font-bold"
            >
              τ = {threshold.toFixed(2)}
            </motion.text>

            {/* Student probability dots */}
            {fittedProbs.map((prob, idx) => {
              const x = 40 + prob * 560;
              const actual = actuals[idx];
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={68}
                    r={10}
                    fill={actual === 1 ? '#1D4ED8' : '#0F172A'}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                  />
                  <text x={x} y={46} textAnchor="middle" className="fill-slate-700 font-mono text-sm">
                    S{idx + 1} (y={actual})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Confusion Matrix */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left font-mono text-lg sm:text-xl tabular-nums">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-sans">
              <tr>
                <th className="px-6 py-4 font-semibold"></th>
                <th className="px-6 py-4 font-semibold">Predicted 0</th>
                <th className="px-6 py-4 font-semibold">Predicted 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 font-sans font-semibold text-slate-900">Actual 0</td>
                <td className="px-6 py-4 font-bold text-slate-950">{metrics.tn} (TN)</td>
                <td className="px-6 py-4 text-slate-600">{metrics.fp} (FP)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-sans font-semibold text-slate-900">Actual 1</td>
                <td className="px-6 py-4 text-slate-600">{metrics.fn} (FN)</td>
                <td className="px-6 py-4 font-bold text-[#1D4ED8]">{metrics.tp} (TP)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Animated Metrics Bars */}
        <div className="grid grid-cols-3 gap-5 font-mono tabular-nums">
          {[
            { label: 'Accuracy', val: metrics.accuracy },
            { label: 'Precision', val: metrics.precision },
            { label: 'Recall', val: metrics.recall },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex justify-between text-base">
                <span className="font-sans text-slate-600">{m.label}</span>
                <span className="font-bold text-slate-950">
                  {m.val !== null ? m.val.toFixed(2) : '—'}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-[#1D4ED8]"
                  initial={false}
                  animate={{ width: `${(m.val ?? 0) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Slide13PitfallsRecap({ onMarkSlideComplete }: HandsOnProps) {
  const [showSeparation, setShowSeparation] = useState(false);
  const [zExercise, setZExercise] = useState('');
  const [pExercise, setPExercise] = useState('');
  const [exerciseChecked, setExerciseChecked] = useState<{
    zOk: boolean;
    pOk: boolean;
  } | null>(null);

  const handleCheckExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const zNum = parseFloat(zExercise.trim());
    const pNum = parseFloat(pExercise.trim());
    const zOk = !Number.isNaN(zNum) && Math.abs(zNum - 1.0) < 0.02;
    const pOk = !Number.isNaN(pNum) && Math.abs(pNum - 0.731) < 0.015;
    setExerciseChecked({ zOk, pOk });
    if (zOk && pOk) onMarkSlideComplete(13);
  };

  // Separation animation curve: normal (beta1=0.908) vs near-separation (beta1=10)
  const sepB0 = showSeparation ? -25 : -2.27;
  const sepB1 = showSeparation ? 10 : 0.908;
  const width = 640;
  const height = 220;
  const padL = 60;
  const padR = 30;
  const padT = 22;
  const padB = 38;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xToPx = (x: number) => padL + ((x - 0.5) / 4) * plotW;
  const pToPx = (p: number) => padT + (1 - p) * plotH;

  const sepPath = Array.from({ length: 81 }, (_, i) => {
    const x = 0.5 + i * 0.05;
    const p = sigmoid(sepB0 + sepB1 * x);
    return `${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(1)} ${pToPx(p).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left 30% */}
      <div className="lg:col-span-4 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 leading-tight [text-wrap:balance]">
          Pitfalls and Recap
        </h2>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200 text-base sm:text-lg">
          <div className="py-3.5">
            <span className="font-semibold text-slate-950">Separation:</span>{' '}
            <span className="text-slate-600">If one x splits classes perfectly, β̂ does not exist.</span>
          </div>
          <div className="py-3.5">
            <span className="font-semibold text-slate-950">Imbalance:</span>{' '}
            <span className="text-slate-600">Accuracy misleads when 95% of cases are 0. Use precision and recall.</span>
          </div>
          <div className="py-3.5">
            <span className="font-semibold text-slate-950">Small n:</span>{' '}
            <span className="text-slate-600">Our n = 4 only teaches the method. Use 10+ events per predictor.</span>
          </div>
        </div>

        <div className="font-mono text-base text-slate-900 space-y-1">
          <div>• p = 1/(1 + e^−z), z is log-odds</div>
          <div>• e^β is the odds ratio</div>
        </div>
      </div>

      {/* Right 70%: Animated Separation Graph + Final Exercise */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-lg font-semibold text-slate-900">
              {showSeparation
                ? 'Perfect Separation: y = [0, 0, 1, 1] → β1 → ∞'
                : 'Overlapping Data: y = [0, 1, 0, 1] → Finite β̂1 = 0.908'}
            </span>
            <button
              type="button"
              onClick={() => setShowSeparation((s) => !s)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white font-medium text-sm text-slate-800 hover:border-slate-500 cursor-pointer"
            >
              {showSeparation ? 'Show Overlap' : 'Animate Separation'}
            </button>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <line x1={padL} y1={pToPx(1)} x2={width - padR} y2={pToPx(1)} stroke="#E2E8F0" strokeDasharray="6 6" />
            <line x1={padL} y1={pToPx(0)} x2={width - padR} y2={pToPx(0)} stroke="#CBD5E1" strokeWidth={1.5} />
            <text x={padL - 10} y={pToPx(1) + 5} textAnchor="end" className="fill-slate-600 font-mono text-sm">
              1.0
            </text>
            <text x={padL - 10} y={pToPx(0) + 5} textAnchor="end" className="fill-slate-600 font-mono text-sm">
              0.0
            </text>

            <motion.path
              animate={{ d: sepPath }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={3.5}
            />

            {[1, 2, 3, 4].map((x, idx) => {
              const y = showSeparation ? (x >= 3 ? 1 : 0) : idx % 2 === 1 ? 1 : 0;
              return (
                <motion.circle
                  key={x}
                  cx={xToPx(x)}
                  animate={{ cy: pToPx(y) }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  r={8.5}
                  fill={y === 1 ? '#1D4ED8' : '#0F172A'}
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                />
              );
            })}
          </svg>
        </div>

        {/* Final Exercise */}
        <form
          onSubmit={handleCheckExercise}
          className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
        >
          <div className="text-lg sm:text-xl font-semibold text-slate-950">
            Exercise: recompute <span className="font-mono text-[#1D4ED8]">p</span> for{' '}
            <span className="font-mono">x = 3</span> using <span className="font-mono">β = (−2, 1)</span>.
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="final-z" className="block font-mono text-sm text-slate-600 mb-1">
                z = −2 + 1·(3)
              </label>
              <input
                id="final-z"
                type="text"
                inputMode="decimal"
                value={zExercise}
                onChange={(e) => {
                  setZExercise(e.target.value);
                  setExerciseChecked(null);
                }}
                placeholder="1"
                className="w-28 px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-lg tabular-nums focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label htmlFor="final-p" className="block font-mono text-sm text-slate-600 mb-1">
                p = 1 / (1 + e^−z)
              </label>
              <input
                id="final-p"
                type="text"
                inputMode="decimal"
                value={pExercise}
                onChange={(e) => {
                  setPExercise(e.target.value);
                  setExerciseChecked(null);
                }}
                placeholder="0.731"
                className="w-32 px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-lg tabular-nums focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white font-medium text-base hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Verify
            </button>
          </div>

          {exerciseChecked && (
            <div className="text-base font-medium text-slate-800 flex items-center gap-2">
              {exerciseChecked.zOk && exerciseChecked.pOk ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                  <span>Exact: z = 1 and p = 1 / (1 + e^−1) ≈ 0.731.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-slate-500 shrink-0" />
                  <span>
                    {!exerciseChecked.zOk
                      ? 'Check z first: −2 + 1×3 = 1.'
                      : 'z = 1 is correct; now compute 1 / (1 + e^−1) ≈ 0.731.'}
                  </span>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
