# Pre-calculus crash course

A web app that teaches college-level pre-calculus in 15 short lessons:

- **Part 1, Algebra foundations:** exponents and radicals, factoring, rational expressions, equations and inequalities
- **Part 2, Functions:** domain and range, transformations, composition and inverses, polynomial and rational functions, exponentials and logarithms
- **Part 3, Trigonometry:** radians, the unit circle, sine and cosine graphs, identities, trig equations, solving triangles

Each lesson has a short explanation, worked examples revealed one step at a time, a list of things to remember, and a three-question check. Several lessons include interactive graphs (transformations, exponential/log, sine and cosine, and a draggable unit circle). There is also a printable formula sheet and a 15-question final check.

**Blitz sessions** are full practice quizzes that mirror a class quiz (Blitz 1 and Blitz 2 mirror the Quiz 1 and Quiz 2 reviews: 21 questions, 100 points, no feedback until you submit). Each Blitz has a prep plan with study sessions and practice questions. Every question is generated from random values, so each attempt is a new version.

Progress is saved in the browser (localStorage), so no account or backend is needed.

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

## Project layout

```
index.html        page shell
css/styles.css    all styles (light and dark themes)
js/content.js     lesson text, examples, and quiz questions
js/graphs.js      SVG graphs and interactive explorers
js/blitz.js       Blitz practice quizzes (question generators + quiz view)
js/prep.js        Prep plans: study sessions for each Blitz
js/app.js         routing, navigation, quizzes, progress
netlify.toml      Netlify settings
```

To add or edit a lesson, change `js/content.js`. Math is written in LaTeX between `$...$` and rendered with KaTeX.

## Adding a Blitz

In `js/blitz.js`, write a `buildBlitzN()` function that returns an array of question objects (see the Blitz 1 generators for the shape: `prompt`, optional `graph`, `choices`, `answer`, `why`, `lesson`, `points`), then set `ready: true`, a `topic`, `covers`, and `build` on that entry in `BLITZES`. To give it a study plan, add an entry for it in `PLANS` in `js/prep.js`; it appears in the sidebar automatically.
