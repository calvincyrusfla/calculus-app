# Pre-calculus crash course

A web app that teaches college-level pre-calculus in 15 short lessons:

- **Part 1, Algebra foundations:** exponents and radicals, factoring, rational expressions, equations and inequalities
- **Part 2, Functions:** domain and range, transformations, composition and inverses, polynomial and rational functions, exponentials and logarithms
- **Part 3, Trigonometry:** radians, the unit circle, sine and cosine graphs, identities, trig equations, solving triangles

Each lesson has a short explanation, worked examples revealed one step at a time, a list of things to remember, and a three-question check. Several lessons include interactive graphs (transformations, exponential/log, sine and cosine, and a draggable unit circle). There is also a printable formula sheet and a 15-question final check.

**Blitz sessions** are full practice quizzes that mirror a class quiz (Blitz 1, 2, and 3 mirror the Quiz 1, 2, and 3 reviews: same question types and point values, 100 points each, no feedback until you submit). Each Blitz has a prep plan with study sessions and practice questions. Every question is generated from random values, so each attempt is a new version.

An **AI tutor** (powered by Claude) can be opened from the button in the corner or from the "Ask the tutor" button on any worked example, quiz question, Blitz question, or practice question. It sees the problem you are on and coaches you through it. During an unsubmitted Blitz it gives hints only.

Progress is saved in the browser (localStorage), so no account is needed.

## Run it locally

It is a plain static site with no build step. From the project folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy on Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick this GitHub repository.
2. Branch: `main`. Build command: leave empty. Publish directory: `.` (already set in `netlify.toml`).
3. Deploy. Every push to `main` redeploys automatically.

## Setting up the AI tutor

The tutor runs as a Netlify Function, so your API key stays on the server.

1. Get an API key from the Claude Console (https://platform.claude.com).
2. In Netlify: **Site configuration → Environment variables → Add a variable**. Name it `ANTHROPIC_API_KEY` and paste the key.
3. Redeploy (Deploys → Trigger deploy). The tutor now works on the live site.

Optional: set `TUTOR_MODEL` to use a different Claude model (default `claude-sonnet-5-5`). To test locally, run `netlify dev` instead of `python3 -m http.server`.

## Project layout

```
index.html        page shell
css/styles.css    all styles (light and dark themes)
js/content.js     lesson text, examples, and quiz questions
js/graphs.js      SVG graphs and interactive explorers
js/blitz.js       Blitz practice quizzes (question generators + quiz view)
js/prep.js        Prep plans: study sessions for each Blitz
js/app.js         routing, navigation, quizzes, progress
js/tutor.js       AI tutor chat panel
netlify/functions/tutor.mjs   server function that calls the Claude API
netlify.toml      Netlify settings
```

To add or edit a lesson, change `js/content.js`. Math is written in LaTeX between `$...$` and rendered with KaTeX.

## Adding a Blitz

In `js/blitz.js`, write a `buildBlitzN()` function that returns an array of question objects (see the Blitz 1 generators for the shape: `prompt`, optional `graph`, `choices`, `answer`, `why`, `lesson`, `points`), then set `ready: true`, a `topic`, `covers`, and `build` on that entry in `BLITZES`. To give it a study plan, add an entry for it in `PLANS` in `js/prep.js`; it appears in the sidebar automatically.
