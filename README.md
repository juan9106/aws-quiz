# AWS Quiz

A small React + TypeScript quiz with 46 AWS questions loaded from a validated JSON bank. Runs entirely in the browser.

## Development

Use Node.js 24 LTS and pnpm 10.8.1 (pinned in packageManager).

- pnpm install --frozen-lockfile
- pnpm dev
- pnpm lint
- pnpm test
- pnpm build
- pnpm preview

The app is served under /aws-quiz/ and uses hash routing for GitHub Pages.

## Quiz rules

Choose 1–10 questions, with 120 seconds per question. Questions are shuffled without modifying the bank. Skipped questions score zero. Each question is worth one point: multiple-answer questions receive partial credit for correct selections, but any incorrect selection makes that question worth zero. Results round the overall percentage to a whole number.

The timer uses a deadline and stops when the attempt ends. Try again clears the attempt. Reloading starts over; only the color theme is saved locally.

## Questions

Edit src/data/questions.json. Each entry has a unique positive integer number, a nonempty question, unique options and answers, and type single option or multi option. Correct answers must appear in options; single questions require one answer and multiple questions at least two. Invalid banks show a load error. Run the tests after editing. Academic accuracy of the question content must be reviewed separately.

## Deployment

pnpm deploy builds first and then publishes dist using gh-pages. GitHub repository access is required. The configured base path is /aws-quiz/; change it if the repository name changes. Building or testing does not publish the site.
