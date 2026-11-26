# IT365 - Data Analytics 1: Lesson 9 (Logistic Regression)

Interactive web lecture on **Logistic Regression — Predicting yes or no, by hand and in Python**.

> **Disclaimer:** AI was used to generate this interactive web page; the lecture content and slides were created by **Mattheus Marcus Contreras**.

## Topics Covered (13 Slides)

1. Title & Overview
2. Learning Objectives
3. Warm-Up: Linear vs. Sigmoid Predictions
4. Why Not Linear Regression?
5. The Sigmoid and Log-Odds
6. Odds and Odds Ratios
7. Practice Dataset (`n = 4`) & Hand Calculation
8. Manual Log Loss & Maximum Likelihood Estimation (MLE)
9. How the Model Is Fitted (IRLS / Newton-Raphson)
10. `sklearn` (`penalty=None` vs. L2 Regularization)
11. `statsmodels` Logit Summary
12. Evaluating Predictions & Confusion Matrix Thresholds
13. Pitfalls (Separation, Imbalance, Small `n`) & Recap Exercise

## Local Development

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

## Deploying to GitHub Pages

This repository is preconfigured with `.github/workflows/deploy.yml` and relative asset paths (`base: './'`).

1. Push the repository to GitHub on the `main` (or `master`) branch.
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow will automatically build `dist/` and publish the live webpage.
