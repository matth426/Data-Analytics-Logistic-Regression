export interface SlideMeta {
  id: number;
  title: string;
  section: 'Foundations' | 'Math & Odds' | 'By Hand' | 'Python' | 'Evaluation';
  shortLabel: string;
}

export interface DataPoint {
  student: number;
  x: number;
  y: 0 | 1;
}

export const PRACTICE_DATASET: DataPoint[] = [
  { student: 1, x: 1, y: 0 },
  { student: 2, x: 2, y: 1 },
  { student: 3, x: 3, y: 0 },
  { student: 4, x: 4, y: 1 },
];

export const SLIDES: SlideMeta[] = [
  { id: 1, title: 'Logistic Regression', section: 'Foundations', shortLabel: 'Title' },
  { id: 2, title: 'Learning Objectives', section: 'Foundations', shortLabel: 'Objectives' },
  { id: 3, title: 'Warm-Up: Predict before we Calculate', section: 'Foundations', shortLabel: 'Warm-Up' },
  { id: 4, title: 'Why Not Linear Regression?', section: 'Foundations', shortLabel: 'Why Not Linear' },
  { id: 5, title: 'The Sigmoid and Log-Odds', section: 'Math & Odds', shortLabel: 'Sigmoid & Log-Odds' },
  { id: 6, title: 'Odds and Odds Ratios', section: 'Math & Odds', shortLabel: 'Odds Ratios' },
  { id: 7, title: 'Practice Dataset', section: 'By Hand', shortLabel: 'Practice Data' },
  { id: 8, title: 'Manual Computation', section: 'By Hand', shortLabel: 'Manual Loss' },
  { id: 9, title: 'How the Model Is Fitted', section: 'By Hand', shortLabel: 'IRLS Fitting' },
  { id: 10, title: 'sklearn', section: 'Python', shortLabel: 'sklearn' },
  { id: 11, title: 'statsmodels', section: 'Python', shortLabel: 'statsmodels' },
  { id: 12, title: 'Evaluating Predictions', section: 'Evaluation', shortLabel: 'Confusion Matrix' },
  { id: 13, title: 'Pitfalls and Recap', section: 'Evaluation', shortLabel: 'Pitfalls & Recap' },
];

export const MODULE_START_SLIDE: Record<SlideMeta['section'], number> = {
  Foundations: 1,
  'Math & Odds': 5,
  'By Hand': 7,
  Python: 10,
  Evaluation: 12,
};

export const LEARNING_OBJECTIVES = [
  'Explain why linear regression fails for yes/no outcomes.',
  'Use the sigmoid, odds and log-odds.',
  'Compute predicted probabilities and log loss by hand.',
  'Fit the model in sklearn and statsmodels.',
  'Interpret odds ratios and a confusion matrix.',
];

export function sigmoid(z: number): number {
  if (z >= 0) {
    const expNeg = Math.exp(-z);
    return 1 / (1 + expNeg);
  }
  const expPos = Math.exp(z);
  return expPos / (1 + expPos);
}

export function singleLogLoss(p: number, y: 0 | 1): number {
  const eps = 1e-12;
  const clamped = Math.min(Math.max(p, eps), 1 - eps);
  return y === 1 ? -Math.log(clamped) : -Math.log(1 - clamped);
}

export function evaluateModel(
  data: DataPoint[],
  beta0: number,
  beta1: number
): {
  rows: Array<{
    student: number;
    x: number;
    y: 0 | 1;
    z: number;
    p: number;
    loss: number;
  }>;
  meanLoss: number;
  logLikelihood: number;
} {
  const rows = data.map((d) => {
    const z = beta0 + beta1 * d.x;
    const p = sigmoid(z);
    const loss = singleLogLoss(p, d.y);
    return {
      student: d.student,
      x: d.x,
      y: d.y,
      z,
      p,
      loss,
    };
  });
  const totalLoss = rows.reduce((acc, r) => acc + r.loss, 0);
  return {
    rows,
    meanLoss: totalLoss / rows.length,
    logLikelihood: -totalLoss,
  };
}

export interface IrlStep {
  iteration: number;
  beta0: number;
  beta1: number;
  oddsRatio: number;
  logLikelihood: number;
  meanLogLoss: number;
  probs: number[];
  deltaNorm: number;
}

/**
 * Runs Newton-Raphson / IRLS steps on 1D logistic regression:
 * beta <- beta + (X^T W X)^-1 X^T (y - p)
 * Optional L2 penalty (lambda = 1 / C on beta1 only, matching sklearn default when C=1.0).
 */
export function runIRLS(
  data: DataPoint[],
  initialBeta0 = 0,
  initialBeta1 = 0,
  maxSteps = 8,
  l2Lambda = 0
): IrlStep[] {
  let b0 = initialBeta0;
  let b1 = initialBeta1;
  const steps: IrlStep[] = [];

  for (let iter = 0; iter <= maxSteps; iter++) {
    const evalRes = evaluateModel(data, b0, b1);
    const probs = evalRes.rows.map((r) => r.p);
    steps.push({
      iteration: iter,
      beta0: b0,
      beta1: b1,
      oddsRatio: Math.exp(b1),
      logLikelihood: evalRes.logLikelihood,
      meanLogLoss: evalRes.meanLoss,
      probs,
      deltaNorm: iter === 0 ? 0 : steps[iter - 1]?.deltaNorm ?? 0,
    });

    if (iter === maxSteps) break;

    // Gradient of log-likelihood minus 0.5 * lambda * b1^2
    let g0 = 0;
    let g1 = -l2Lambda * b1;
    // Hessian (negative Fisher information: X^T W X + diag(0, lambda))
    let h00 = 0;
    let h01 = 0;
    let h11 = l2Lambda;

    for (let i = 0; i < data.length; i++) {
      const xi = data[i].x;
      const yi = data[i].y;
      const pi = probs[i];
      const wi = Math.max(pi * (1 - pi), 1e-9);
      const diff = yi - pi;

      g0 += diff;
      g1 += xi * diff;

      h00 += wi;
      h01 += xi * wi;
      h11 += xi * xi * wi;
    }

    const det = h00 * h11 - h01 * h01;
    if (Math.abs(det) < 1e-12) break;

    const d0 = (h11 * g0 - h01 * g1) / det;
    const d1 = (-h01 * g0 + h00 * g1) / det;
    const deltaNorm = Math.hypot(d0, d1);

    b0 += d0;
    b1 += d1;

    if (steps[iter]) {
      steps[iter].deltaNorm = deltaNorm;
    }
  }

  return steps;
}

export function computeConfusionMetrics(
  probs: number[],
  actuals: Array<0 | 1>,
  threshold: number
): {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
  accuracy: number;
  precision: number | null;
  recall: number | null;
  predictions: Array<0 | 1>;
} {
  let tn = 0;
  let fp = 0;
  let fn = 0;
  let tp = 0;
  const predictions: Array<0 | 1> = [];

  for (let i = 0; i < probs.length; i++) {
    const pred: 0 | 1 = probs[i] >= threshold ? 1 : 0;
    predictions.push(pred);
    const actual = actuals[i];
    if (actual === 0 && pred === 0) tn++;
    else if (actual === 0 && pred === 1) fp++;
    else if (actual === 1 && pred === 0) fn++;
    else tp++;
  }

  const total = probs.length;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : null;
  const recall = tp + fn > 0 ? tp / (tp + fn) : null;

  return { tn, fp, fn, tp, accuracy, precision, recall, predictions };
}

export const SKLEARN_CODE = `import numpy as np
from sklearn.linear_model import LogisticRegression
X = np.array([[1],[2],[3],[4]]); y = np.array([0,1,0,1])
m = LogisticRegression(penalty=None).fit(X, y)
m.intercept_, m.coef_      # -2.270, [0.908]
m.predict_proba(X)[:,1]    # 0.204 0.388 0.612 0.796
m.predict(X)               # [0 0 1 1]`;

export const STATSMODELS_CODE = `import statsmodels.api as sm
Xc = sm.add_constant(X)
res = sm.Logit(y, Xc).fit()
print(res.summary())
np.exp(res.params) # odds ratios: 0.103, 2.480`;
