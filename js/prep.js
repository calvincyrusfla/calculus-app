/* Prep plans: a guided study sequence for each Blitz.
   Each topic lists the Blitz question numbers it prepares for and the
   question generators (from blitz.js) used for its practice button. */
(function () {
  const R = String.raw;

  const PLANS = {
    '1': {
      blitz: '1',
      title: 'Blitz 1 prep plan',
      lede: 'Six short sessions that cover every question type on Blitz 1, in an order where each skill builds on the last. Read the method, check the example, then practice until you get two in a row right.',
      sessions: [
        {
          title: 'Algebra moves',
          minutes: 25,
          goal: 'Handle the two heavy algebra questions that open the quiz.',
          topics: [
            {
              title: 'Factoring out a common binomial power', qs: [1], gens: ['factor'], lesson: 'factoring',
              method: [
                R`Find every factor the two terms share. For each one, take the <strong>lowest</strong> power that appears. Include any common number.`,
                R`Pull that GCF out front and write what is left of each term inside one bracket.`,
                R`Multiply out and combine the bracket into a single polynomial.`,
                R`Check the bracket for one more common number and move it out front.`,
              ],
              example: {
                problem: R`Factor $4(x+1)^3(x-2)^2 + 2(x+1)^4(x-2)$.`,
                steps: [
                  R`Shared factors: $2$, $(x+1)^3$ (lowest power), $(x-2)^1$ (lowest power). GCF $= 2(x+1)^3(x-2)$.`,
                  R`What remains: $2(x-2)$ from the first term and $(x+1)$ from the second.`,
                  R`Combine: $2x - 4 + x + 1 = 3x - 3 = 3(x - 1)$.`,
                  R`Answer: $6(x+1)^3(x-2)(x-1)$.`,
                ],
              },
              trap: R`Taking the highest power as the GCF, or leaving a common number inside the last bracket. The answer choices are built around exactly these slips.`,
            },
            {
              title: 'Rationalizing the numerator', qs: [2], gens: ['rationalize'], lesson: 'exponents',
              method: [
                R`Multiply top and bottom by the conjugate of the numerator (same two roots, opposite sign between them).`,
                R`Multiply out only the top. It becomes a difference of squares, so the roots disappear.`,
                R`Leave the bottom factored. Cancel the $h$.`,
              ],
              example: {
                problem: R`Rationalize the numerator: $\dfrac{\sqrt{x+h} - \sqrt{x}}{h}$.`,
                steps: [
                  R`Multiply by $\dfrac{\sqrt{x+h} + \sqrt{x}}{\sqrt{x+h} + \sqrt{x}}$.`,
                  R`Top: $(x + h) - x = h$.`,
                  R`$\dfrac{h}{h(\sqrt{x+h} + \sqrt{x})} = \dfrac{1}{\sqrt{x+h} + \sqrt{x}}$.`,
                ],
              },
              trap: R`Multiplying out the denominator. Keep it as $h(\ldots)$ so the $h$ cancels cleanly.`,
            },
          ],
        },
        {
          title: 'Evaluating and combining functions',
          minutes: 30,
          goal: 'Plug inputs into functions correctly, including expressions and piecewise rules.',
          topics: [
            {
              title: 'Substituting expressions: f(a + c) and f(x + h)', qs: [3, 11], gens: ['eval', 'fxh'], lesson: 'functions',
              method: [
                R`Put the new input in parentheses and replace <strong>every</strong> $x$ with it.`,
                R`Expand $(x + h)^2 = x^2 + 2xh + h^2$. It is never just $x^2 + h^2$.`,
                R`Distribute coefficients to every term, then combine like terms.`,
              ],
              example: {
                problem: R`For $f(x) = 2x^2 - x$, find $f(x + h)$.`,
                steps: [
                  R`$f(x + h) = 2(x + h)^2 - (x + h)$.`,
                  R`$= 2(x^2 + 2xh + h^2) - x - h$.`,
                  R`$= 2x^2 + 4xh + 2h^2 - x - h$.`,
                ],
              },
              trap: R`For $f(a + c)$, there should be no $x$ left in the answer. Any choice containing $x$ is wrong.`,
            },
            {
              title: 'Evaluating piecewise functions', qs: [9], gens: ['piecewise'], lesson: 'functions',
              method: [
                R`Compare the input to each condition. Exactly one row applies.`,
                R`Watch the boundary: $\le$ includes the endpoint, $<$ does not.`,
                R`Use only that row's formula.`,
              ],
              example: {
                problem: R`$f(x) = \begin{cases} 9 & x \le -2 \\ |x + 1| & -2 < x \le 4 \\ -5 & x > 4 \end{cases}$. Find $f(-2)$, $f(0)$, and $f(4)$.`,
                steps: [
                  R`$f(-2)$: $-2 \le -2$ is true, so the first row: $9$.`,
                  R`$f(0)$: middle row, $|0 + 1| = 1$.`,
                  R`$f(4)$: $4 \le 4$, still the middle row: $|4 + 1| = 5$.`,
                ],
              },
              trap: R`Plugging into the middle formula out of habit. Always check the condition first.`,
            },
            {
              title: 'Combining functions', qs: [10, 12], gens: ['product', 'difference'], lesson: 'composition',
              method: [
                R`$(f \cdot g)(c) = f(c) \cdot g(c)$: evaluate each function first, then multiply.`,
                R`$(g - f)(x) = g(x) - f(x)$: put the subtracted function in parentheses and distribute the minus sign.`,
              ],
              example: {
                problem: R`$f(x) = 3x$, $g(x) = |x - 3|$. Find $(f \cdot g)(-3)$.`,
                steps: [
                  R`$f(-3) = -9$.`,
                  R`$g(-3) = |-6| = 6$.`,
                  R`$(f \cdot g)(-3) = -9 \cdot 6 = -54$.`,
                ],
              },
              trap: R`In $(f - g)(x)$, forgetting that the minus applies to every term of $g$, including its constant.`,
            },
          ],
        },
        {
          title: 'Domain, intercepts, and symmetry',
          minutes: 25,
          goal: 'Answer the formula questions that test definitions.',
          topics: [
            {
              title: 'Domain from a formula', qs: [7], gens: ['domain'], lesson: 'functions',
              method: [
                R`Even root ($\sqrt{\ }$): what is inside must be $\ge 0$.`,
                R`Odd root ($\sqrt[3]{\ }$): any real number works.`,
                R`Denominator: cannot equal $0$. Exclude that value with a union.`,
              ],
              example: {
                problem: R`Find the domain of $g(t) = \sqrt[3]{2 - t}$ and of $k(t) = \sqrt{2 - t}$.`,
                steps: [
                  R`Cube root: no restriction. Domain $(-\infty, \infty)$.`,
                  R`Square root: $2 - t \ge 0 \Rightarrow t \le 2$. Domain $(-\infty, 2]$.`,
                ],
              },
              trap: R`Treating a cube root like a square root. Look at the index on the radical.`,
            },
            {
              title: 'Intercepts of a line', qs: [13], gens: ['intercepts'], lesson: 'functions',
              method: [
                R`$y$-intercept: set $x = 0$. It is the constant term.`,
                R`$x$-intercept: set the function equal to $0$ and solve.`,
                R`Write each as a point: $(x, 0)$ and $(0, y)$.`,
              ],
              example: {
                problem: R`Find the intercepts of $B(x) = 6x + 8$.`,
                steps: [
                  R`$y$-intercept: $B(0) = 8$, so $(0, 8)$.`,
                  R`$x$-intercept: $6x + 8 = 0 \Rightarrow x = -\tfrac{4}{3}$, so $\left(-\tfrac43, 0\right)$.`,
                ],
              },
              trap: R`Flipping the fraction ($-\tfrac34$ instead of $-\tfrac43$) or writing the $y$-intercept as $(8, 0)$.`,
            },
            {
              title: 'Even, odd, or neither', qs: [4], gens: ['evenodd'], lesson: 'functions',
              method: [
                R`Compute $f(-x)$ and simplify. Use $|-x| = |x|$, $(-x)^2 = x^2$, $(-x)^3 = -x^3$.`,
                R`Same as $f(x)$: even. Exactly the negative of $f(x)$: odd. Otherwise: neither.`,
              ],
              example: {
                problem: R`Is $f(x) = \dfrac{x^3}{6 + |x|}$ even, odd, or neither?`,
                steps: [
                  R`$f(-x) = \dfrac{(-x)^3}{6 + |-x|} = \dfrac{-x^3}{6 + |x|}$.`,
                  R`That equals $-f(x)$, so $f$ is odd.`,
                ],
              },
              trap: R`A constant added on ($x^3 + 4$) breaks oddness. Check the whole function, not just the leading term.`,
            },
            {
              title: 'Symmetry of an equation', qs: [21], gens: ['symmetry'], lesson: 'functions',
              method: [
                R`$x$-axis test: replace $y$ with $-y$.`,
                R`$y$-axis test: replace $x$ with $-x$.`,
                R`Origin test: replace both.`,
                R`Each test passes only if you get back the exact same equation.`,
              ],
              example: {
                problem: R`Test $x = y^2 + 7$ for symmetry.`,
                steps: [
                  R`$y \to -y$: $x = (-y)^2 + 7 = y^2 + 7$. Same, so $x$-axis symmetry.`,
                  R`$x \to -x$: $-x = y^2 + 7$. Different, so no $y$-axis symmetry.`,
                  R`Both: $-x = y^2 + 7$. Different, so no origin symmetry. Answer: $x$-axis only.`,
                ],
              },
              trap: R`This question is worth 6 points, the most on the quiz. Run all three tests every time.`,
            },
          ],
        },
        {
          title: 'Reading graphs',
          minutes: 30,
          goal: 'Pull exact information off a graph: dots, arrows, and intervals.',
          topics: [
            {
              title: 'Vertical line test', qs: [6], gens: ['isfunction'], lesson: 'functions',
              method: [
                R`Imagine sweeping a vertical line across the whole graph.`,
                R`If it ever touches the graph twice, it is not a function. Circles and sideways curves always fail.`,
              ],
              trap: R`A wiggly graph is still a function as long as it never doubles back left.`,
            },
            {
              title: 'Domain and range from a graph', qs: [8], gens: ['domainrange'], lesson: 'functions',
              method: [
                R`Domain: read left to right ($x$-values). Range: read bottom to top ($y$-values).`,
                R`Closed dot: bracket $[\ ]$. Open dot: parenthesis $(\ )$. Arrow: $\infty$ or $-\infty$, always with a parenthesis.`,
              ],
              trap: R`Swapping domain and range, or using a parenthesis where a closed dot needs a bracket.`,
            },
            {
              title: 'Increasing, decreasing, constant', qs: [14], gens: ['incdec'], lesson: 'functions',
              method: [
                R`Read left to right. Rising: increasing. Falling: decreasing. Flat: constant.`,
                R`Write intervals using $x$-values only, with parentheses.`,
                R`Join separate pieces with $\cup$. If a behavior never happens, say "never".`,
              ],
              trap: R`Using $y$-values for the intervals. The interval is where on the $x$-axis it happens.`,
            },
            {
              title: 'Reading values and range with dots', qs: [17], gens: ['readgraph'], lesson: 'functions',
              method: [
                R`To find $f(c)$, go to $x = c$ and use the <strong>closed</strong> dot. An open dot is not on the graph.`,
                R`For the range, collect the $y$-values of every piece. A flat segment contributes a single value like $\{-3\}$.`,
              ],
              trap: R`Reading an open dot as the function's value.`,
            },
            {
              title: 'Relative maxima and minima', qs: [19], gens: ['extrema'], lesson: 'functions',
              method: [
                R`A relative maximum is a peak; a relative minimum is a valley.`,
                R`State it as: at $x = $ (location), the value is $y = $ (height).`,
              ],
              trap: R`Using where the graph crosses the $x$-axis. Extrema are turning points, not intercepts.`,
            },
          ],
        },
        {
          title: 'Transformations and graphing',
          minutes: 30,
          goal: 'Move parent graphs and match equations to pictures.',
          topics: [
            {
              title: 'Listing transformations in order', qs: [5], gens: ['transform'], lesson: 'transformations',
              method: [
                R`Name the parent: $\tfrac1x$, $\sqrt{x}$, $|x|$, or $x^2$.`,
                R`Horizontal shift first: $x - h$ moves right $h$, $x + h$ moves left $h$.`,
                R`Then the stretch or shrink: factor $> 1$ stretches, factor between $0$ and $1$ shrinks.`,
                R`Vertical shift last: $+k$ up, $-k$ down.`,
              ],
              example: {
                problem: R`Describe $g(x) = \dfrac{4}{x + 5} - 3$.`,
                steps: [
                  R`Parent: $f(x) = \tfrac1x$.`,
                  R`$x + 5$: shift left 5.`,
                  R`$4$ on top: stretch vertically by a factor of 4.`,
                  R`$-3$: shift down 3.`,
                ],
              },
              trap: R`Reading $x + 5$ as "right 5". Inside changes do the opposite of their sign.`,
            },
            {
              title: 'Graphing a piecewise function', qs: [15], gens: ['piecegraph'], lesson: 'functions',
              method: [
                R`Draw each formula only on its own interval.`,
                R`At the boundary: $\le$ or $\ge$ gets a closed dot; $<$ or $>$ gets an open dot.`,
              ],
              trap: R`Picking a graph with the right shapes but the dots swapped. Check both dots at the boundary.`,
            },
            {
              title: 'Shifting 1/x', qs: [16], gens: ['recipgraph'], lesson: 'transformations',
              method: [
                R`$\tfrac1x$ has asymptotes $x = 0$ and $y = 0$.`,
                R`$\tfrac1x + k$ moves the horizontal asymptote to $y = k$. $\tfrac{1}{x - h}$ moves the vertical asymptote to $x = h$.`,
                R`Find where the asymptotes moved, then pick the graph that hugs them.`,
              ],
              trap: R`Confusing a vertical shift with a horizontal one. Ask: is the change inside the denominator or outside the fraction?`,
            },
            {
              title: 'Reflections and vertical scaling', qs: [18, 20], gens: ['reflect', 'shrink'], lesson: 'transformations',
              method: [
                R`$f(-x)$: mirror across the $y$-axis (left and right swap, heights stay).`,
                R`$-f(x)$: mirror across the $x$-axis (up and down swap).`,
                R`$c \cdot f(x)$: multiply every height by $c$. Points on the $x$-axis do not move.`,
              ],
              trap: R`For $\tfrac15 f(x)$, the graph gets shorter, not narrower. Width only changes when the number is inside, as in $f(5x)$.`,
            },
          ],
        },
        {
          title: 'Dress rehearsal',
          minutes: 30,
          goal: 'Take Blitz 1 under quiz conditions and close the gaps.',
          rehearsal: true,
          steps: [
            R`Take Blitz 1 start to finish without notes. Let the timer run.`,
            R`Read the explanation for every question you missed, even lucky guesses.`,
            R`Go back to the session above that covers each miss and do two practice questions.`,
            R`Retake Blitz 1. Every attempt has new numbers. You are ready when you score 90 or more twice in a row.`,
          ],
        },
      ],
    },
  };

  /* ------------------------------------------------------------ view */
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  const qLabel = qs => (qs.length > 1 ? 'Questions ' + qs.join(' and ') : 'Question ' + qs[0]);

  /* api: { renderMath, lessonTitle(id), isDone(planId, i), setDone(planId, i, v), blitzRecord(id), onChange() } */
  function view(planId, api) {
    const plan = PLANS[planId];
    const art = h('article', { class: 'lesson prep' });
    art.appendChild(h('p', { class: 'crumb' }, '<a href="#/blitz">Blitz sessions</a>'));
    art.appendChild(h('h1', { tabindex: '-1' }, plan.title));
    art.appendChild(h('p', { class: 'lede' }, plan.lede));

    const total = plan.sessions.reduce((s, x) => s + x.minutes, 0);
    const overview = h('nav', { class: 'prep-overview', 'aria-label': 'Sessions in this plan' });
    const ol = h('ol');
    plan.sessions.forEach((s, i) => {
      ol.appendChild(h('li', { class: api.isDone(planId, i) ? 'is-done' : '' },
        `<a href="#/prep/${planId}" data-jump="${i}">${s.title}</a><span>${s.minutes} min</span>`));
    });
    overview.appendChild(ol);
    const done = plan.sessions.filter((_, i) => api.isDone(planId, i)).length;
    overview.appendChild(h('p', { class: 'prep-total' }, `${done} of ${plan.sessions.length} sessions done, about ${Math.round(total / 60 * 10) / 10} hours in all`));
    overview.addEventListener('click', e => {
      const a = e.target.closest('[data-jump]');
      if (!a) return;
      e.preventDefault();
      const t = document.getElementById('session-' + a.dataset.jump);
      if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); t.querySelector('h2').focus({ preventScroll: true }); }
    });
    art.appendChild(overview);

    plan.sessions.forEach((s, i) => {
      const sec = h('section', { class: 'prep-session' + (api.isDone(planId, i) ? ' is-done' : ''), id: 'session-' + i });
      const head = h('header', { class: 'prep-head' });
      head.innerHTML = `<p class="prep-num">Session ${i + 1}</p><h2 tabindex="-1">${s.title}</h2><p class="prep-goal">${s.goal} <span>About ${s.minutes} minutes.</span></p>`;
      sec.appendChild(head);

      if (s.rehearsal) {
        const steps = h('ol', { class: 'checklist' }, s.steps.map(t => `<li>${t}</li>`).join(''));
        sec.appendChild(steps);
        const rec = api.blitzRecord(plan.blitz);
        if (rec) sec.appendChild(h('p', { class: 'muted' }, `Your best Blitz ${plan.blitz} score so far: ${Math.round(rec.best * 10) / 10} of 100.`));
        sec.appendChild(h('a', { class: 'btn', href: `#/blitz/${plan.blitz}` }, `Take Blitz ${plan.blitz}`));
      } else {
        s.topics.forEach(t => {
          const card = h('div', { class: 'prep-topic' });
          card.appendChild(h('h3', null, `${t.title}<span class="prep-qs">${qLabel(t.qs)}</span>`));
          card.appendChild(h('ol', { class: 'checklist' }, t.method.map(m => `<li>${m}</li>`).join('')));
          if (t.example) {
            const ex = h('div', { class: 'prep-example' });
            ex.innerHTML = `<p class="problem"><strong>Example.</strong> ${t.example.problem}</p><ol class="steps">${t.example.steps.map(x => `<li>${x}</li>`).join('')}</ol>`;
            card.appendChild(ex);
          }
          card.appendChild(h('p', { class: 'warn' }, `<strong>Watch out:</strong> ${t.trap}`));
          const row = h('div', { class: 'prep-actions' });
          const btn = h('button', { type: 'button', class: 'btn-small' }, 'Practice a question');
          row.appendChild(btn);
          row.appendChild(h('a', { class: 'prep-link', href: `#/lesson/${t.lesson}` }, `Full lesson: ${api.lessonTitle(t.lesson)}`));
          card.appendChild(row);
          const slot = h('div', { class: 'prep-practice' });
          card.appendChild(slot);
          btn.addEventListener('click', () => {
            btn.remove();
            Blitz.practice(slot, t.gens, api.renderMath);
          });
          sec.appendChild(card);
        });
      }

      const mark = h('button', { type: 'button', class: 'btn-quiet prep-mark', 'aria-pressed': api.isDone(planId, i) ? 'true' : 'false' },
        api.isDone(planId, i) ? 'Session done. Mark as not done' : 'Mark session done');
      mark.addEventListener('click', () => {
        const now = !api.isDone(planId, i);
        api.setDone(planId, i, now);
        sec.classList.toggle('is-done', now);
        mark.setAttribute('aria-pressed', now ? 'true' : 'false');
        mark.textContent = now ? 'Session done. Mark as not done' : 'Mark session done';
        ol.children[i].classList.toggle('is-done', now);
        const d = plan.sessions.filter((_, k) => api.isDone(planId, k)).length;
        overview.querySelector('.prep-total').textContent = `${d} of ${plan.sessions.length} sessions done, about ${Math.round(total / 60 * 10) / 10} hours in all`;
        api.onChange();
      });
      sec.appendChild(mark);
      art.appendChild(sec);
    });
    return art;
  }

  window.Prep = {
    plans: PLANS,
    has: id => !!PLANS[id],
    view,
    count: id => PLANS[id].sessions.length,
  };
})();
