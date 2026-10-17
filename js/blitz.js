/* Blitz sessions: timed, quiz-style practice that mirrors a real class quiz.
   Every question is generated from random values, so each attempt is a new version.
   To add Blitz 2 or 3: write a build function that returns an array of questions
   (same shape as the Blitz 1 generators below) and set ready: true in BLITZES. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------ random + format helpers */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
  const sgn = () => (Math.random() < 0.5 ? -1 : 1);
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`;
  }
  /* poly([[3,'x^2'],[-2,'x'],[5,'']]) -> "3x^2 - 2x + 5" */
  function poly(pairs) {
    let s = '', first = true;
    for (const [c, v] of pairs) {
      if (!c) continue;
      const abs = Math.abs(c);
      const body = v ? (abs === 1 ? v : abs + v) : String(abs);
      s += first ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body;
      first = false;
    }
    return s || '0';
  }
  const plusC = (base, n) => (n === 0 ? base : n > 0 ? `${base} + ${n}` : `${base} - ${-n}`);
  const coef = c => (c === 1 ? '' : c === -1 ? '-' : String(c));
  const iv = (a, b, la, rb) => `${la}${a}, ${b}${rb}`;
  const NEG_INF = '-\\infty', INF = '\\infty';

  /* Make sure a generated question has distinct choices; retry otherwise. */
  function build(gen) {
    for (let i = 0; i < 40; i++) {
      const q = gen();
      const keys = q.choices.map(c => JSON.stringify(c.graph ? c.graph.key : c));
      if (new Set(keys).size === keys.length) return q;
    }
    return gen();
  }

  /* ------------------------------------------------------------ graph drawing */
  let markerId = 0;
  function drawGraph(host, spec, size) {
    const [xmin, xmax] = spec.x || [-6, 6];
    const [ymin, ymax] = spec.y || [-6, 6];
    const plot = new Graphs.Plot(host, {
      w: size, h: size * (ymax - ymin) / (xmax - xmin), xmin, xmax, ymin, ymax,
      xlabelEvery: spec.xlabelEvery || 2, ylabelEvery: spec.ylabelEvery || 2, label: spec.label || 'Graph',
    });
    plot.svg.classList.add('bgraph');
    const id = 'arr' + (++markerId);
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `<marker id="${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arrowhead"/></marker>`;
    plot.svg.insertBefore(defs, plot.svg.firstChild);
    const lo = ymin - 4, hi = ymax + 4;
    (spec.asym || []).forEach(a => { if ('x' in a) plot.vline(a.x, 'asym'); else plot.hline(a.y, 'asym'); });
    (spec.pieces || []).forEach(pc => {
      const pts = [];
      const N = 240;
      for (let i = 0; i <= N; i++) {
        let x, y;
        if (pc.param) { const t = pc.t[0] + (pc.t[1] - pc.t[0]) * i / N; x = pc.param[0](t); y = pc.param[1](t); }
        else { x = pc.from + (pc.to - pc.from) * i / N; y = pc.f(x); }
        if (!isFinite(y)) continue;
        pts.push([plot.X(x), plot.Y(Math.max(lo, Math.min(hi, y)))]);
      }
      if (pts.length < 2) return;
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'curve bcurve');
      if (pc.arrowStart) path.setAttribute('marker-start', `url(#${id})`);
      if (pc.arrowEnd) path.setAttribute('marker-end', `url(#${id})`);
      plot.layer.appendChild(path);
    });
    (spec.dots || []).forEach(dt => plot.dot(dt.x, dt.y, dt.open ? 'bdot-open' : 'bdot', 4.5));
    return plot;
  }
  // Graph choice helper: key is used to detect duplicate choices.
  const G = (key, spec) => ({ graph: Object.assign({ key }, spec) });

  /* ============================================================ BLITZ 1 generators */

  // 1. Factor completely (product-rule style expression)
  function q_factor() {
    const p = pick([-3, -2, 2, 3]), q = pick([5, 7, 9]) * sgn(), s = pick([2, 3]), t = pick([-7, -5, 5, 7]);
    const L = `(${poly([[p, 'x'], [q, '']])})`, Q = `(${poly([[s, 'x^2'], [t, '']])})`;
    const A = 3 * p * s, B = 2 * s * q, C = p * t;
    let g = gcd(gcd(A, B), C); if (A < 0) g = -g;
    const R = [A / g, B / g, C / g];
    const lead = coef(3 * g);
    const rem = r => `(${poly([[r[0], 'x^2'], [r[1], 'x'], [r[2], '']])})`;
    const prompt = `Factor completely.<span class="bexpr">$3${L}^2(${p})${Q}^3 + ${L}^3(3)${Q}^2(${2 * s}x)$</span>`;
    return {
      prompt,
      choices: [
        `$${lead}${L}^2${Q}^2${rem(R)}$`,
        `$${lead}${L}${Q}^2${rem(R)}$`,
        `$${lead}${L}^2${Q}^2${rem([R[0], -R[1], R[2]])}$`,
        `$${lead}${L}${Q}${rem([R[0], R[1], -R[2]])}$`,
      ],
      why: `Both terms share $3${L}^2${Q}^2$. Taking it out leaves $${p}${Q} + ${2 * s}x${L} = ${poly([[A, 'x^2'], [B, 'x'], [C, '']])}$. That still has a common factor of $${g}$, so the full factorization is $${lead}${L}^2${Q}^2${rem(R)}$.`,
      lesson: 'factoring',
    };
  }

  // 2. Rationalize the numerator
  function q_rationalize() {
    const k = pick([2, 3, 5, 6, 7]);
    const sum = `\\sqrt{${k}x + ${k}h} + \\sqrt{${k}x}`;
    return {
      prompt: `Rationalize the numerator of the expression and simplify.<span class="bexpr">$\\dfrac{\\sqrt{${k}(x + h)} - \\sqrt{${k}x}}{h}$</span>`,
      choices: [
        `$\\dfrac{${k}}{${sum}}$`,
        `$\\dfrac{${k}}{\\sqrt{${2 * k}x + ${k}h}}$`,
        `$\\dfrac{${2 * k}x + ${k}h}{h\\left(${sum}\\right)}$`,
        `$\\dfrac{${k}h}{${sum}}$`,
      ],
      why: `Multiply top and bottom by the conjugate $${sum}$. The numerator becomes $(${k}x + ${k}h) - ${k}x = ${k}h$. Cancel the $h$ to get $\\dfrac{${k}}{${sum}}$.`,
      lesson: 'exponents',
    };
  }

  // 3. Evaluate f(a + c)
  function q_eval() {
    let c, d;
    do { c = ri(2, 6); d = ri(1, 6); } while (d === c || d === 2 * c);
    const inside = plusC('a', c - d);
    return {
      prompt: `Find $f(a + ${c})$ for the given function.<span class="bexpr">$f(x) = \\sqrt{x - ${d}}$</span>`,
      choices: [
        `$\\sqrt{${inside}}$`,
        `$\\sqrt{a - ${c}}$`,
        `$\\sqrt{x + a - ${c}}$`,
        `$\\sqrt{${plusC('x + a', c - d)}}$`,
      ],
      why: `Replace every $x$ with $a + ${c}$: $\\sqrt{(a + ${c}) - ${d}} = \\sqrt{${inside}}$. No $x$ remains in the answer.`,
      lesson: 'functions',
    };
  }

  // 4. Even, odd, or neither
  function q_evenodd() {
    const k = ri(2, 9);
    const items = [
      [`\\dfrac{x^3}{${k} + |x|}`, 1, `$f(-x) = \\dfrac{-x^3}{${k} + |x|} = -f(x)$.`],
      [`\\dfrac{x^2}{${k} + |x|}`, 0, `$f(-x) = \\dfrac{x^2}{${k} + |x|} = f(x)$.`],
      [`\\dfrac{x^3}{${k} + x}`, 2, `$f(-x) = \\dfrac{-x^3}{${k} - x}$, which is neither $f(x)$ nor $-f(x)$.`],
      [`x^4 - ${k}x^2`, 0, `Only even powers appear, so $f(-x) = f(x)$.`],
      [`x^3 + ${k}`, 2, `$f(-x) = -x^3 + ${k}$, which is neither $f(x)$ nor $-f(x)$.`],
      [`\\dfrac{x}{x^2 + ${k}}`, 1, `$f(-x) = \\dfrac{-x}{x^2 + ${k}} = -f(x)$.`],
      [`${k}|x| + x^2`, 0, `$|-x| = |x|$ and $(-x)^2 = x^2$, so $f(-x) = f(x)$.`],
      [`x^5 - ${k}x`, 1, `Only odd powers appear, so $f(-x) = -f(x)$.`],
    ];
    const [f, ans, why] = pick(items);
    return {
      prompt: `Determine if the function is even, odd, or neither.<span class="bexpr">$f(x) = ${f}$</span>`,
      choices: ['Even', 'Odd', 'Neither'], answer: ans, fixed: true,
      why: `${why} Even means $f(-x) = f(x)$; odd means $f(-x) = -f(x)$.`,
      lesson: 'functions',
    };
  }

  // 5. Identify parent function and list transformations
  function q_transform() {
    const parent = pick(['recip', 'sqrt', 'abs', 'square']);
    const hShift = nz(-6, 6), kShift = nz(-5, 5);
    const stretch = parent === 'recip' ? true : Math.random() < 0.6;
    const m = ri(2, 5);
    const factorTex = stretch ? String(m) : `\\tfrac{1}{${m}}`;
    const inner = hShift > 0 ? `x - ${hShift}` : `x + ${-hShift}`;
    const kPart = kShift > 0 ? ` + ${kShift}` : ` - ${-kShift}`;
    const P = { recip: '\\dfrac{1}{x}', sqrt: '\\sqrt{x}', abs: '|x|', square: 'x^2' }[parent];
    const pre = stretch ? String(m) : `\\dfrac{1}{${m}}`;
    const g = {
      recip: `\\dfrac{${m}}{${inner}}${kPart}`,
      sqrt: `${pre}\\sqrt{${inner}}${kPart}`,
      abs: `${pre}\\left|${inner}\\right|${kPart}`,
      square: `${pre}\\left(${inner}\\right)^2${kPart}`,
    }[parent];
    const desc = (right, isStretch, up) =>
      `Parent function: $f(x) = ${P}$; shift the graph of $f$ to the ${right ? 'right' : 'left'} ${Math.abs(hShift)} units, ` +
      `${isStretch ? 'stretch' : 'shrink'} the graph vertically by a factor of $${isStretch ? m : `\\tfrac{1}{${m}}`}$, ` +
      `and shift the graph ${up ? 'upward' : 'downward'} by ${Math.abs(kShift)} units.`;
    const R = hShift > 0, U = kShift > 0;
    return {
      prompt: `A function $g$ is given. Identify the parent function, then list in order the transformations applied to the parent function to obtain the graph of $g$.<span class="bexpr">$g(x) = ${g}$</span>`,
      choices: [desc(R, stretch, U), desc(!R, !stretch, !U), desc(R, !stretch, U), desc(!R, stretch, !U)],
      why: `$${inner}$ means a shift ${R ? 'right' : 'left'} ${Math.abs(hShift)} (inside changes do the opposite of their sign). The factor $${factorTex}$ ${stretch ? 'stretches' : 'shrinks'} vertically. $${kPart.trim()}$ shifts ${U ? 'up' : 'down'} ${Math.abs(kShift)}.`,
      lesson: 'transformations',
    };
  }

  // 6. Function or not (vertical line test)
  function q_isfunction() {
    const isFn = Math.random() < 0.5;
    let spec;
    if (isFn) {
      const a = ri(20, 30) / 10, b = ri(9, 14) / 10;
      spec = pick([
        { pieces: [{ f: x => 1.1 * Math.sin(a * x) + 1.5 * Math.sin(b * x), from: -5.5, to: 5.5 }] },
        { pieces: [{ f: x => (x * x * x - 9 * x) / 5, from: -4.6, to: 4.6, arrowStart: true, arrowEnd: true }] },
        { pieces: [{ f: x => 0.25 * x * x - 3, from: -5.4, to: 5.4, arrowStart: true, arrowEnd: true }] },
      ]);
    } else {
      const r = ri(2, 4), cx = ri(-1, 1), cy = ri(-1, 1);
      spec = pick([
        { pieces: [{ param: [t => cx + r * Math.cos(t), t => cy + r * Math.sin(t)], t: [0, 2 * Math.PI] }] },
        { pieces: [{ param: [t => t * t / 2 - 3, t => t], t: [-3.6, 3.6], arrowStart: true, arrowEnd: true }] },
        { pieces: [{ param: [t => (t * t * t) / 4 - 2 * t, t => t], t: [-3.4, 3.4], arrowStart: true, arrowEnd: true }] },
      ]);
    }
    return {
      prompt: 'Determine whether the relation defines $y$ as a function of $x$.',
      graph: spec,
      choices: ['Not a function', 'Function'], answer: isFn ? 1 : 0, fixed: true,
      why: isFn
        ? 'Every vertical line crosses the graph at most once, so it passes the vertical line test: it is a function.'
        : 'Some vertical line crosses the graph more than once, so one $x$ has two $y$-values: not a function.',
      lesson: 'functions',
    };
  }

  // 7. Domain in interval notation
  function q_domain() {
    const c = ri(1, 8);
    const forms = [
      [`\\sqrt[3]{${c} - t}`, 1, 'A cube root accepts any real number, including negatives.'],
      [`\\sqrt{${c} - t}`, 0, `An even root needs $${c} - t \\ge 0$, so $t \\le ${c}$.`],
      [`\\sqrt{t - ${c}}`, 2, `An even root needs $t - ${c} \\ge 0$, so $t \\ge ${c}$.`],
      [`\\dfrac{4}{\\sqrt[3]{t - ${c}}}`, 3, `The cube root is fine everywhere, but the denominator is $0$ at $t = ${c}$.`],
    ];
    const [f, ans, why] = pick(forms);
    return {
      prompt: `Write the domain in interval notation.<span class="bexpr">$g(t) = ${f}$</span>`,
      choices: [
        `$(-\\infty, ${c}]$`, `$(-\\infty, \\infty)$`, `$[${c}, \\infty)$`, `$(-\\infty, ${c}) \\cup (${c}, \\infty)$`,
      ], answer: ans, fixed: true,
      why, lesson: 'functions',
    };
  }

  // 8. Domain and range from a graph
  function q_domainrange() {
    const x0 = pick([-5, -4]), y0 = pick([0, 1]), M = pick([2, 3, 4]), xp = x0 + 2;
    const spec = {
      pieces: [
        { f: x => y0 + (M - y0) * (x - x0) / (xp - x0), from: x0, to: xp },
        { f: () => M, from: xp, to: 0 },
        { f: x => M - x, from: 0, to: 5.6, arrowEnd: true },
      ],
      dots: [{ x: x0, y: y0 }],
    };
    const D = s => s;
    return {
      prompt: 'Determine the domain and range of the function.',
      graph: spec,
      choices: [
        D(`Domain: $[${x0}, \\infty)$; Range: $(-\\infty, ${M}]$`),
        D(`Domain: $(${x0}, \\infty)$; Range: $(-\\infty, ${M})$`),
        D(`Domain: $(-\\infty, ${M}]$; Range: $[${x0}, \\infty)$`),
        D(`Domain: $[${x0}, \\infty)$; Range: $[${y0}, \\infty)$`),
      ],
      why: `The graph starts at the closed dot $x = ${x0}$ and continues right forever: domain $[${x0}, \\infty)$. Its highest point is $y = ${M}$ and the arrow heads down forever: range $(-\\infty, ${M}]$.`,
      lesson: 'functions',
    };
  }

  // 9. Evaluate a piecewise function
  function q_piecewise() {
    const p = pick([-3, -2]), qq = pick([3, 4, 5]), A = ri(6, 9), B = -ri(3, 6), b = ri(1, 3);
    const c = pick([p - 1, p, 0, 1, qq, qq + 1, 0]);
    let val, region;
    if (c <= p) { val = A; region = `$${c} \\le ${p}$, so use the first piece`; }
    else if (c <= qq) { val = Math.abs(c + b); region = `$${p} < ${c} \\le ${qq}$, so use $|x + ${b}|$: $|${c} + ${b}| = ${val}$`; }
    else { val = B; region = `$${c} > ${qq}$, so use the last piece`; }
    const pool = [A, B, Math.abs(c + b), c + b, 0, -Math.abs(c + b), A - 1].filter(v => v !== val);
    const others = [...new Set(pool)].slice(0, 3);
    return {
      prompt: `Evaluate $f(${c})$.<span class="bexpr">$f(x) = \\begin{cases} ${A} & x \\le ${p} \\\\ |x + ${b}| & ${p} < x \\le ${qq} \\\\ ${B} & x > ${qq} \\end{cases}$</span>`,
      choices: [`$${val}$`, ...others.map(v => `$${v}$`)],
      why: `${region}. The answer is $${val}$.`,
      lesson: 'functions',
    };
  }

  // 10. (f · g)(c)
  function q_product() {
    const a = ri(2, 5), b = ri(1, 5), c = -ri(1, 4);
    const v = a * c * Math.abs(c - b);
    const pool = [-v, a * c + Math.abs(c - b), a * c * Math.abs(c + b), a * Math.abs(c - b), v + a].filter(x => x !== v);
    const others = [...new Set(pool)].slice(0, 3);
    const fmt = n => `$(f \\cdot g)(${c}) = ${n}$`;
    return {
      prompt: `Evaluate the function for the given value of $x$.<span class="bexpr">$f(x) = ${a}x,\\quad g(x) = |x - ${b}|,\\quad (f \\cdot g)(${c}) = \\,?$</span>`,
      choices: [fmt(v), ...others.map(fmt)],
      why: `$f(${c}) = ${a * c}$ and $g(${c}) = |${c} - ${b}| = ${Math.abs(c - b)}$. Multiply: $${a * c} \\cdot ${Math.abs(c - b)} = ${v}$.`,
      lesson: 'composition',
    };
  }

  // 11. Find f(x + h)
  function q_fxh() {
    const a = pick([-4, -3, -2, 2, 3, 4]), b = nz(-5, 5), c = nz(-6, 6);
    const P = arr => `$${poly(arr)}$`;
    return {
      prompt: `Find and simplify $f(x + h)$.<span class="bexpr">$f(x) = ${poly([[a, 'x^2'], [b, 'x'], [c, '']])}$</span>`,
      choices: [
        P([[a, 'x^2'], [2 * a, 'xh'], [a, 'h^2'], [b, 'x'], [b, 'h'], [c, '']]),
        P([[a, 'x^2'], [a, 'h^2'], [b, 'x'], [b, 'h'], [c, '']]),
        P([[a, 'x^2'], [2 * a, 'xh'], [a, 'h^2'], [b, 'x'], [c, '']]),
        P([[a, 'x^2'], [2, 'xh'], [1, 'h^2'], [b, 'x'], [b, 'h'], [c, '']]),
      ],
      why: `Replace $x$ with $(x + h)$: $${a}(x + h)^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}(x + h) ${c < 0 ? '-' : '+'} ${Math.abs(c)}$. Expand $(x + h)^2 = x^2 + 2xh + h^2$ and distribute the $${a}$ to every term.`,
      lesson: 'functions',
    };
  }

  // 12. (g - f)(x) or (f - g)(x)
  function q_difference() {
    const m = ri(2, 7), a = ri(2, 4), c = nz(-8, 8);
    const gMinusF = Math.random() < 0.6;
    const name = gMinusF ? '(g - f)(x)' : '(f - g)(x)';
    const s = gMinusF ? 1 : -1;
    const ans = [[s * a, 'x^2'], [-s * m, 'x'], [s * c, '']];
    const P = arr => `$${name} = ${poly(arr)}$`;
    return {
      prompt: `Find the combined function.<span class="bexpr">$f(x) = ${m}x,\\quad g(x) = ${poly([[a, 'x^2'], [c, '']])},\\quad ${name} = \\,?$</span>`,
      choices: [
        P(ans),
        P([[s * a, 'x^2'], [s * m, 'x'], [s * c, '']]),
        P([[s * a, 'x^2'], [s * m, 'x'], [-s * c, '']]),
        P([[s * a, 'x^2'], [-s * m, 'x'], [-s * c, '']]),
      ],
      why: gMinusF
        ? `$(g - f)(x) = (${poly([[a, 'x^2'], [c, '']])}) - ${m}x = ${poly(ans)}$.`
        : `$(f - g)(x) = ${m}x - (${poly([[a, 'x^2'], [c, '']])})$. The minus sign hits every term of $g$: $${poly(ans)}$.`,
      lesson: 'composition',
    };
  }

  // 13. Intercepts of a linear function
  function q_intercepts() {
    let m, b;
    do { m = nz(-7, 7); b = nz(-9, 9); } while (Math.abs(m) === Math.abs(b) || Math.abs(m) === 1);
    const xi = frac(-b, m), wrong = frac(-m, b);
    return {
      prompt: `Determine the $x$- and $y$-intercepts for the given function.<span class="bexpr">$B(x) = ${poly([[m, 'x'], [b, '']])}$</span>`,
      choices: [
        `$x$-intercept: $\\left(${xi}, 0\\right)$; $y$-intercept: $(0, ${b})$`,
        `$x$-intercept: $\\left(${xi}, 0\\right)$; $y$-intercept: $(0, ${-b})$`,
        `$x$-intercept: $\\left(${wrong}, 0\\right)$; $y$-intercept: $(${b}, 0)$`,
        `$x$- and $y$-intercept: $(0, 0)$`,
      ],
      why: `$y$-intercept: set $x = 0$ to get $B(0) = ${b}$. $x$-intercept: set $${poly([[m, 'x'], [b, '']])} = 0$, so $x = ${xi}$.`,
      lesson: 'functions',
    };
  }

  // 14. Increasing, decreasing, constant from a graph
  function q_incdec() {
    const p = pick([-3, -2, -1]), qq = pick([1, 2, 3]), v = pick([-2, -1, 1]);
    const s1 = sgn(), s2 = sgn();
    const spec = {
      pieces: [
        { f: x => v + s1 * (x - p), from: Math.max(-5.6, p - (s1 > 0 ? v + 5.4 : 5.4 - v)), to: p, arrowStart: true },
        { f: () => v, from: p, to: qq },
        { f: x => v + s2 * (x - qq), from: qq, to: Math.min(5.6, qq + (s2 > 0 ? 5.4 - v : v + 5.4)), arrowEnd: true },
      ],
    };
    const L = `(-\\infty, ${p})`, Rr = `(${qq}, \\infty)`;
    const setOf = (want, l, r) => {
      const parts = []; if (s1 === want) parts.push(l); if (s2 === want) parts.push(r);
      return parts.length ? `$${parts.join(' \\cup ')}$` : null;
    };
    const fmt = (inc, dec, con) => `a. ${inc || 'never increasing'}<br>b. ${dec || 'never decreasing'}<br>c. ${con}`;
    const inc = setOf(1, L, Rr), dec = setOf(-1, L, Rr);
    const L2 = `(-\\infty, ${p - 1})`, R2 = `(${qq + 1}, \\infty)`;
    return {
      prompt: 'Use interval notation to write the intervals over which $f$ is (a) increasing, (b) decreasing, and (c) constant.',
      graph: spec,
      choices: [
        fmt(inc, dec, `$(${p}, ${qq})$`),
        fmt(dec, inc, `$(${p}, ${qq})$`),
        fmt(setOf(1, L2, R2), setOf(-1, L2, R2), `$(${p}, ${qq})$`),
        fmt(inc, dec, 'never constant'),
      ],
      why: `Read left to right using $x$-values. The graph is flat between $x = ${p}$ and $x = ${qq}$, so it is constant on $(${p}, ${qq})$. Left of $${p}$ it ${s1 > 0 ? 'rises' : 'falls'}; right of $${qq}$ it ${s2 > 0 ? 'rises' : 'falls'}.`,
      lesson: 'functions',
    };
  }

  // 15. Graph a piecewise function
  function q_piecegraph() {
    const k = pick([1, 2, 3]);
    const sq = x => x * x;
    const left = (extra) => Object.assign({ f: sq, from: -2.4, to: 0, arrowStart: true }, extra || {});
    const right = (extra) => Object.assign({ f: x => x + k, from: 0, to: 5.6 - k, arrowEnd: true }, extra || {});
    return {
      prompt: `Graph the function.<span class="bexpr">$t(x) = \\begin{cases} x + ${k}, & x > 0 \\\\ x^2, & x \\le 0 \\end{cases}$</span>`,
      choices: [
        G('correct', { pieces: [left(), right()], dots: [{ x: 0, y: 0 }, { x: 0, y: k, open: true }] }),
        G('both', { pieces: [{ f: sq, from: -2.4, to: 2.4, arrowStart: true, arrowEnd: true }, { f: x => x + k, from: -5.6, to: 5.6 - k, arrowStart: true, arrowEnd: true }] }),
        G('swapdots', { pieces: [left(), right()], dots: [{ x: 0, y: 0, open: true }, { x: 0, y: k }] }),
        G('closed', { pieces: [left(), right()], dots: [{ x: 0, y: 0 }, { x: 0, y: k }] }),
      ],
      why: `Draw $x^2$ only for $x \\le 0$, ending in a closed dot at $(0, 0)$. Draw $x + ${k}$ only for $x > 0$, starting with an open dot at $(0, ${k})$ because $0$ is not included.`,
      lesson: 'functions',
    };
  }

  // 16. Sketch a reciprocal function using transformations
  function q_recipgraph() {
    const k = pick([2, 3]) * sgn();
    const vertical = Math.random() < 0.6;
    const R = (h, v, key) => G(key, {
      pieces: [{ f: x => 1 / (x - h) + v, from: -6, to: h - 0.02 }, { f: x => 1 / (x - h) + v, from: h + 0.02, to: 6 }],
      asym: [{ x: h }, { y: v }],
    });
    const prompt = vertical
      ? `Sketch the graph using transformations of a parent function.<span class="bexpr">$m(x) = \\dfrac{1}{x} ${k > 0 ? '+' : '-'} ${Math.abs(k)}$</span>`
      : `Sketch the graph using transformations of a parent function.<span class="bexpr">$m(x) = \\dfrac{1}{x ${k > 0 ? '-' : '+'} ${Math.abs(k)}}$</span>`;
    const correct = vertical ? R(0, k, 'v+') : R(k, 0, 'h+');
    return {
      prompt,
      choices: [correct, vertical ? R(0, -k, 'v-') : R(-k, 0, 'h-'), vertical ? R(k, 0, 'h+') : R(0, k, 'v+'), vertical ? R(-k, 0, 'h-') : R(0, -k, 'v-')],
      why: vertical
        ? `Adding $${k}$ outside the fraction moves $\\tfrac{1}{x}$ ${k > 0 ? 'up' : 'down'} ${Math.abs(k)}: the horizontal asymptote becomes $y = ${k}$ and the vertical asymptote stays at $x = 0$.`
        : `Changing the denominator to $x ${k > 0 ? '-' : '+'} ${Math.abs(k)}$ moves $\\tfrac{1}{x}$ ${k > 0 ? 'right' : 'left'} ${Math.abs(k)}: the vertical asymptote becomes $x = ${k}$.`,
      lesson: 'transformations',
    };
  }

  // 17. Read a value and the range from a graph
  function q_readgraph() {
    const h = pick([-3, -2]), v = pick([2, 3]), r = pick([2, 3]), u = pick([2, 3]);
    const fv = (-1 - h) * (-1 - h);
    const leftEnd = h - Math.sqrt(5.6);
    const spec = {
      pieces: [
        { f: x => (x - h) * (x - h), from: leftEnd, to: -1, arrowStart: true },
        { f: () => -v, from: -1, to: r },
        { f: x => u + (x - r), from: r, to: Math.min(5.6, r + 5.6 - u), arrowEnd: true },
      ],
      dots: [{ x: -1, y: fv }, { x: -1, y: -v, open: true }, { x: r, y: -v, open: true }, { x: r, y: u }],
    };
    const ch = (a, rng) => `$f(-1) = ${a}$; Range: $${rng}$`;
    const good = `\\{${-v}\\} \\cup [0, \\infty)`, bad = `[${-v}, \\infty)`;
    return {
      prompt: 'Use the graph of $y = f(x)$ to answer: (a) find $f(-1)$; (b) find the range of $f$.',
      graph: spec,
      choices: [ch(fv, good), ch(-v, good), ch(fv, bad), ch(-v, bad)],
      why: `At $x = -1$ the closed dot is at $y = ${fv}$ (the open dot is not part of the graph). The $y$-values used are $${-v}$ from the flat segment, and everything from $0$ upward: $${good}$.`,
      lesson: 'functions',
    };
  }

  // 18. Reflect a graph: y = f(-x)
  function q_reflect() {
    const c = pick([-2, -3]), b = pick([1, 2]);
    const arc = (cx, cy, up, key) => G(key, {
      pieces: [{ f: x => cy + (up ? 1 : -1) * Math.sqrt(Math.max(0, 4 - (x - cx) * (x - cx))), from: cx - 2, to: cx + 2 }],
    });
    return {
      prompt: 'Use the graph of $y = f(x)$ below to graph $y = f(-x)$.',
      graph: { pieces: [{ f: x => b + Math.sqrt(Math.max(0, 4 - (x - c) * (x - c))), from: c - 2, to: c + 2 }] },
      choices: [arc(-c, b, true, 'ok'), arc(c, -b, false, 'xaxis'), arc(-c, -b, false, 'both'), arc(c, b - 2, true, 'down')],
      why: '$f(-x)$ flips every point $(x, y)$ to $(-x, y)$: a reflection across the $y$-axis. Heights stay the same; left and right swap.',
      lesson: 'transformations',
    };
  }

  // 19. Relative maxima and minima
  function q_extrema() {
    const r = pick([2, 3]), k = pick([3, 4, 5]);
    const f = x => k * (Math.pow(x * x - r * r, 2) - Math.pow(r, 4)) / Math.pow(r, 4);
    const lim = Math.sqrt(r * r + r * r * Math.sqrt(1 + 6 / k));
    const z = (r * Math.SQRT2).toFixed(1);
    const line = (x, kind, val) => `At $x = ${x}$, the function has a relative ${kind} of $${val}$.`;
    return {
      prompt: 'Identify the location and value of any relative maxima or minima of the function.',
      graph: { x: [-6, 6], y: [-6, 6], pieces: [{ f, from: -Math.min(lim, 5.9), to: Math.min(lim, 5.9), arrowStart: true, arrowEnd: true }] },
      choices: [
        [line(-r, 'minimum', -k), line(0, 'maximum', 0), line(r, 'minimum', -k)].join('<br>'),
        [line(-r, 'minimum', 0), line(0, 'maximum', 0), line(r, 'minimum', 0)].join('<br>'),
        [line(-r, 'minimum', -k), line(r, 'minimum', -k)].join('<br>'),
        [line(-z, 'minimum', 0), line(0, 'maximum', 0), line(z, 'minimum', 0)].join('<br>'),
      ],
      why: `The low points (valleys) are at $x = \\pm${r}$ with height $${-k}$: relative minima. The peak between them is at $x = 0$ with height $0$: a relative maximum. The value is the $y$-coordinate, not where the graph crosses the axis.`,
      lesson: 'functions',
    };
  }

  // 20. Vertical shrink: y = (1/c) f(x)
  function q_shrink() {
    const [P, c] = pick([[5, 5], [6, 3], [8, 4], [6, 2], [8, 2], [9, 3]]);
    const Z = pick([4, 5, 6]);
    const tent = (peak, half, shift) => ({ f: x => peak - (peak / half) * Math.abs(x - shift), from: shift - half, to: shift + half });
    const spec = (pc, key) => G(key, { x: [-7, 7], y: [-1, 11], pieces: [pc] });
    return {
      prompt: `Use the graph of $y = f(x)$ below to graph $y = \\dfrac{1}{${c}}f(x)$.`,
      graph: { x: [-7, 7], y: [-1, 11], pieces: [tent(P, Z, 0)] },
      choices: [spec(tent(P / c, Z, 0), 'ok'), spec(tent(P, Z / c, 0), 'h'), spec(tent(P, Z, 1), 'r'), spec(tent(P, Z, -1), 'l')],
      why: `Multiplying the outputs by $\\tfrac{1}{${c}}$ shrinks the graph vertically. The peak at $(0, ${P})$ moves to $(0, ${frac(P, c)})$; points on the $x$-axis stay put.`,
      lesson: 'transformations',
    };
  }

  // 21. Symmetry of an equation
  function q_symmetry() {
    const k = ri(2, 9);
    const items = [
      [`x = y^2 + ${k}`, 1, 'Replacing $y$ with $-y$ gives the same equation, so it is symmetric about the $x$-axis. Replacing $x$ with $-x$ changes it.'],
      [`y = x^2 + ${k}`, 2, 'Replacing $x$ with $-x$ gives the same equation: $y$-axis symmetry. Replacing $y$ with $-y$ changes it.'],
      [`y = ${k}x^3`, 3, 'Replacing both $x$ with $-x$ and $y$ with $-y$ gives the same equation: origin symmetry.'],
      [`x^2 + y^2 = ${k * k}`, 4, 'Both variables are squared, so every test leaves the equation unchanged.'],
      [`y = x + ${k}`, 0, 'None of the three substitutions leaves the equation unchanged.'],
      [`y = |x| - ${k}`, 2, '$|-x| = |x|$, so replacing $x$ with $-x$ gives the same equation: $y$-axis symmetry.'],
      [`xy = ${k}`, 3, '$(-x)(-y) = xy$, so the equation is unchanged: origin symmetry.'],
    ];
    const [eq, ans, why] = pick(items);
    return {
      prompt: `Determine whether the graph of the equation is symmetric with respect to the $x$-axis, $y$-axis, origin, or none of these.<span class="bexpr">$${eq}$</span>`,
      choices: ['none of these', '$x$-axis', '$y$-axis', 'origin', '$x$-axis, $y$-axis, and origin'], answer: ans, fixed: true,
      why, lesson: 'functions', points: 6,
    };
  }

  function buildBlitz1() {
    return [q_factor, q_rationalize, q_eval, q_evenodd, q_transform, q_isfunction, q_domain, q_domainrange,
      q_piecewise, q_product, q_fxh, q_difference, q_intercepts, q_incdec, q_piecegraph, q_recipgraph,
      q_readgraph, q_reflect, q_extrema, q_shrink, q_symmetry].map(gen => {
      const q = build(gen);
      q.points = q.points || 4.7;
      if (q.answer == null) q.answer = 0;
      return q;
    });
  }

  /* ============================================================ BLITZ 2 generators */
  function polyArr(coeffs, v) {
    v = v || 'x';
    const n = coeffs.length - 1;
    return poly(coeffs.map((c, i) => [c, n - i === 0 ? '' : n - i === 1 ? v : `${v}^${n - i}`]));
  }
  function mul(a, b) {
    const r = new Array(a.length + b.length - 1).fill(0);
    a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; }));
    return r;
  }
  function synth(coeffs, c) { // divide by (x - c)
    const q = [coeffs[0]];
    for (let i = 1; i < coeffs.length; i++) q.push(coeffs[i] + q[i - 1] * c);
    const rem = q.pop();
    return { q, rem };
  }
  const xm = (p, v) => `(${poly([[1, v || 'x'], [-p, '']])})`; // (x - p)
  const cx = (a, b) => `${a === 0 ? '' : a + ' '}\\pm ${b === 1 ? '' : b}i`;
  const setTex = items => `\\left\\{ ${items.join(', ')} \\right\\}`;
  const evalPoly = (c, x) => c.reduce((s, k) => s * x + k, 0);

  // 1. Identify the (non-vertical) asymptote
  function q2_asym() {
    if (Math.random() < 0.6) {
      const d = pick([1, 2]), m = pick([2, 3, 4]), k = nz(-3, 3), b = nz(-6, 6), c = nz(-6, 6), g = nz(-6, 6);
      const a = d * m, e = d * k;
      const ans = poly([[m, 'x'], [-m * k, '']]);
      return {
        prompt: `Identify the asymptotes.<span class="bexpr">$f(x) = \\dfrac{${polyArr([a, 0, b, c])}}{${polyArr([d, e, g])}}$</span>`,
        choices: [
          `Slant asymptote: $y = ${ans}$`,
          `Slant asymptote: $y = ${poly([[m, 'x'], [m * k, '']])}$`,
          `Horizontal asymptote: $y = ${m}$`,
          `Horizontal asymptote: $y = 0$`,
        ],
        why: `The numerator's degree is one more than the denominator's, so there is a slant asymptote. Divide: $${a}x^3 \\div ${d === 1 ? '' : d}x^2 = ${m}x$. Then $${m}x(${polyArr([d, e, g])}) = ${polyArr([a, m * e, m * g, 0])}$; subtracting leaves $${-m * e}x^2$ as the next leading term, and $${-m * e}x^2 \\div ${d === 1 ? '' : d}x^2 = ${-m * k}$. So $y = ${ans}$.`,
        lesson: 'polynomial-rational',
      };
    }
    let a, d;
    do { a = nz(-6, 6); d = pick([1, 2, 3]); } while (Math.abs(a) === d);
    const b = nz(-6, 6), c = nz(-8, 8), e = nz(-6, 6), g = nz(-8, 8);
    return {
      prompt: `Identify the asymptotes.<span class="bexpr">$f(x) = \\dfrac{${polyArr([a, b, c])}}{${polyArr([d, e, g])}}$</span>`,
      choices: [
        `Horizontal asymptote: $y = ${frac(a, d)}$`,
        `Horizontal asymptote: $y = 0$`,
        `Horizontal asymptote: $y = ${frac(d, a)}$`,
        `Slant asymptote: $y = ${frac(a, d)}x$`,
      ],
      why: `The degrees are equal (both 2), so the horizontal asymptote is the ratio of leading coefficients: $y = \\dfrac{${a}}{${d}} = ${frac(a, d)}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 2. Composition with absolute value, and its domain
  function q2_compdomain() {
    let a, b, c;
    do { a = pick([-5, -4, -3, -2, 2, 3, 4, 5]); b = nz(-9, 9); c = nz(-9, 9); } while (a * c + b === 0);
    const rn = Math.random() < 0.6;
    const name = rn ? '(r \\circ n)(x)' : '(n \\circ r)(x)';
    const inner = `\\left|${poly([[a, 'x'], [a * c + b, '']])}\\right|`;
    const outer = `\\left|${poly([[a, 'x'], [b, '']])}\\right| ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
    const ans = rn ? inner : outer, other = rn ? outer : inner;
    const all = '(-\\infty, \\infty)', cut = `\\left(-\\infty, ${frac(-(a * c + b), a)}\\right)`;
    const ch = (f, d) => `$${name} = ${f}$; domain: $${d}$`;
    return {
      prompt: `Find the indicated function and write its domain in interval notation.<span class="bexpr">$r(x) = \\left|${poly([[a, 'x'], [b, '']])}\\right|,\\quad n(x) = ${poly([[1, 'x'], [c, '']])},\\quad ${name} = \\,?$</span>`,
      choices: [ch(ans, all), ch(other, all), ch(ans, cut), ch(other, cut)],
      why: rn
        ? `$(r \\circ n)(x) = r(n(x)) = \\left|${a}(${poly([[1, 'x'], [c, '']])}) ${b > 0 ? '+' : '-'} ${Math.abs(b)}\\right| = ${inner}$. Absolute value and linear functions accept every real number, so the domain is $(-\\infty, \\infty)$.`
        : `$(n \\circ r)(x) = n(r(x)) = ${outer}$. Every real number works, so the domain is $(-\\infty, \\infty)$.`,
      lesson: 'composition',
    };
  }

  // 3. Composition of a quadratic and a line
  function q2_comppoly() {
    const a = ri(2, 5), b = nz(-6, 6), c = nz(-9, 9), m = pick([-3, -2, 2, 3, 4]), k = nz(-7, 7);
    const gf = Math.random() < 0.65;
    const fT = polyArr([a, b, c]), gT = poly([[m, 'x'], [k, '']]);
    const P = arr => `$${polyArr(arr)}$`;
    const gof = [m * a, m * b, m * c + k];
    const fog = [a * m * m, 2 * a * m * k + b * m, a * k * k + b * k + c];
    return {
      prompt: `For the given functions $f$ and $g$, find the indicated composition.<span class="bexpr">$f(x) = ${fT},\\quad g(x) = ${gT},\\quad ${gf ? '(g \\circ f)(x)' : '(f \\circ g)(x)'}$</span>`,
      choices: gf
        ? [P(gof), P([m * a, m * b, m * c - k]), P([a, b, c + k]), P([a, m * b, m * c + k])]
        : [P(fog), P(gof), P([a * m * m, b * m, a * k * k + b * k + c]), P([a * m, 2 * a * m * k + b * m, a * k * k + b * k + c])],
      why: gf
        ? `$(g \\circ f)(x) = g(f(x)) = ${m}(${fT}) ${k > 0 ? '+' : '-'} ${Math.abs(k)} = ${polyArr(gof)}$.`
        : `$(f \\circ g)(x) = f(g(x)) = ${a}(${gT})^2 ${b > 0 ? '+' : '-'} ${Math.abs(b)}(${gT}) ${c > 0 ? '+' : '-'} ${Math.abs(c)}$. Expand the square first: $(${gT})^2 = ${polyArr([m * m, 2 * m * k, k * k])}$. Result: $${polyArr(fog)}$.`,
      lesson: 'composition',
    };
  }

  // 4. Domain of a rational function
  function q2_ratdomain() {
    const c = ri(2, 9), k = nz(-9, 9);
    const forms = [
      [`\\dfrac{${k}x}{x^2 + ${c * c}}`, 2, `$x^2 + ${c * c}$ is always positive, so the denominator is never $0$.`],
      [`\\dfrac{${k}x}{x^2 - ${c * c}}`, 0, `$x^2 - ${c * c} = 0$ when $x = \\pm ${c}$, so exclude both.`],
      [`\\dfrac{${k}}{x - ${c}}`, 1, `The denominator is $0$ only at $x = ${c}$.`],
      [`\\dfrac{${k}x + 1}{x}`, 3, 'The denominator is $0$ only at $x = 0$.'],
    ];
    const [f, ans, why] = pick(forms);
    return {
      prompt: `Write the domain in interval notation.<span class="bexpr">$f(x) = ${f}$</span>`,
      choices: [
        `$(-\\infty, -${c}) \\cup (-${c}, ${c}) \\cup (${c}, \\infty)$`,
        `$(-\\infty, ${c}) \\cup (${c}, \\infty)$`,
        '$(-\\infty, \\infty)$',
        '$(-\\infty, 0) \\cup (0, \\infty)$',
      ], answer: ans, fixed: true,
      why: `${why} A rational function is defined everywhere except where its denominator is zero.`,
      lesson: 'functions',
    };
  }

  // 5. End behavior
  function q2_endbehavior() {
    const n = ri(2, 7), a = nz(-6, 6);
    const coeffs = [a]; for (let i = 0; i < n; i++) coeffs.push(ri(-6, 6));
    if (coeffs[n] === 0) coeffs[n] = nz(-6, 6);
    const even = n % 2 === 0;
    const ans = even ? (a > 0 ? 2 : 3) : (a > 0 ? 1 : 0);
    return {
      prompt: `Determine the end behavior of the polynomial function.<span class="bexpr">$f(x) = ${polyArr(coeffs)}$</span>`,
      choices: ['rises to the left and falls to the right', 'falls to the left and rises to the right', 'rises to the left and rises to the right', 'falls to the left and falls to the right'],
      answer: ans, fixed: true,
      why: `Only the leading term $${coef(a)}x^${n}$ matters. The degree ${n} is ${even ? 'even, so both ends go the same way' : 'odd, so the ends go opposite ways'}, and the leading coefficient is ${a > 0 ? 'positive' : 'negative'}, so the right end ${a > 0 ? 'rises' : 'falls'}.`,
      lesson: 'polynomial-rational',
    };
  }

  // 6. Evaluate a composition at a number
  function q2_compvalue() {
    const p = nz(-6, 6), q = pick([-3, -2, 2, 3, 4]), r = nz(-5, 5), c = nz(-4, 4);
    const f = x => x * x + p * x, g = x => q * x + r;
    const v = f(g(c));
    const pool = [-v, g(f(c)), f(c) * g(c), f(c) + g(c), v + 2 * p].filter(x => x !== v);
    const others = [...new Set(pool)].slice(0, 3);
    const fmt = n => `$(f \\circ g)(${c}) = ${n}$`;
    return {
      prompt: `Evaluate the function for the given value of $x$.<span class="bexpr">$f(x) = ${poly([[1, 'x^2'], [p, 'x']])},\\quad g(x) = ${poly([[q, 'x'], [r, '']])},\\quad (f \\circ g)(${c}) = \\,?$</span>`,
      choices: [fmt(v), ...others.map(fmt)],
      why: `Work inside out. $g(${c}) = ${g(c)}$. Then $f(${g(c)}) = (${g(c)})^2 ${p > 0 ? '+' : '-'} ${Math.abs(p)}(${g(c)}) = ${v}$.`,
      lesson: 'composition',
    };
  }

  // 7. Factor a cubic given one zero
  function q2_factorzero() {
    let z, a, b, d;
    do { z = pick([-5, -4, -3, -2, 2, 3, 4, 5]); a = pick([2, 3, 4]); b = nz(-7, 7); d = nz(-9, 9); }
    while (gcd(a, b) !== 1 || d === -z || b === -a * z || Math.abs(b) === Math.abs(a * d));
    const quad = [a, a * d + b, b * d];
    const cubic = mul([1, -z], quad);
    const L = (A, B) => `(${poly([[A, 'x'], [B, '']])})`;
    return {
      prompt: `Factor $f(x) = ${polyArr(cubic)}$ given that $${z}$ is a zero.`,
      choices: [
        `$${xm(z)}${L(a, b)}${L(1, d)}$`,
        `$${xm(-z)}${L(a, -b)}${L(1, d)}$`,
        `$${xm(z)}(${polyArr([a, a * d - b, -b * d])})$`,
        `$${xm(-z)}(${polyArr(quad)})$`,
      ],
      why: `A zero of $${z}$ means $${xm(z)}$ is a factor. Synthetic division by $${z}$ leaves $${polyArr(quad)}$, which factors as $${L(a, b)}${L(1, d)}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 8. All zeros of a cubic with complex zeros
  function q2_complexzeros() {
    const r = nz(-6, 6), al = nz(-3, 3), be = ri(1, 5);
    const quad = [1, -2 * al, al * al + be * be];
    const cubic = mul([1, -r], quad);
    const ch = (x, a) => `$${x},\\ ${cx(a, be)}$`;
    return {
      prompt: `Find all the zeros.<span class="bexpr">$f(x) = ${polyArr(cubic)}$</span>`,
      choices: [ch(r, al), ch(-r, al), ch(-r, -al), ch(r, -al)],
      why: `Test the rational candidates: $f(${r}) = 0$, so $${xm(r)}$ is a factor. Dividing leaves $${polyArr(quad)}$. The quadratic formula gives $x = \\dfrac{${2 * al} \\pm \\sqrt{${4 * al * al} - ${4 * (al * al + be * be)}}}{2} = ${cx(al, be)}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 9. Degree-5 polynomial with two given zeros
  function q2_solvegiven() {
    let p, r1, r2, al, be;
    do { p = pick([-5, -3, -1, 1, 3, 5]); r1 = nz(-4, 4); r2 = nz(-4, 4); al = nz(-3, 3); be = ri(1, 4); } while (r1 === r2 || Math.abs(r1) === Math.abs(r2));
    const f = mul(mul(mul([2, -p], [1, -r1]), [1, -r2]), [1, -2 * al, al * al + be * be]);
    const reals = [r1, r2].sort((x, y) => x - y);
    const half = frac(p, 2);
    const conj = `${al} - ${be === 1 ? '' : be}i`;
    return {
      prompt: `A polynomial $f(x)$ and two of its zeros are given. Solve $f(x) = 0$.<span class="bexpr">$f(x) = ${polyArr(f)}$; $\\ ${conj}$ and $${half}$ are zeros</span>`,
      choices: [
        `$${setTex([...reals, half, cx(al, be)])}$`,
        `$${setTex([reals[0], `\\pm ${frac(Math.abs(p), 2)}`, cx(al, be)])}$`,
        `$${setTex([...reals, frac(-p, 2), cx(al, be)])}$`,
        `$${setTex([...reals, half, `\\pm ${Math.abs(al)} - ${be === 1 ? '' : be}i`])}$`,
      ],
      why: `Complex zeros come in conjugate pairs, so $${cx(al, be)}$ are both zeros, giving the factor $${polyArr([1, -2 * al, al * al + be * be])}$. The zero $${half}$ gives the factor $${p < 0 ? `(2x + ${-p})` : `(2x - ${p})`}$. Dividing $f$ by both leaves $${polyArr(mul([1, -r1], [1, -r2]))} = ${xm(r1)}${xm(r2)}$, so the other zeros are $${r1}$ and $${r2}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 10. Inverse of a x^n + b
  function q2_inverse() {
    const n = pick([3, 3, 5]), a = ri(2, 9), b = nz(-9, 9);
    const minus = poly([[1, 'x'], [-b, '']]), plus = poly([[1, 'x'], [b, '']]);
    return {
      prompt: `A one-to-one function is given. Write an expression for the inverse function.<span class="bexpr">$m(x) = ${poly([[a, `x^${n}`], [b, '']])}$</span>`,
      choices: [
        `$m^{-1}(x) = \\sqrt[${n}]{\\dfrac{${minus}}{${a}}}$`,
        `$m^{-1}(x) = \\sqrt[${n}]{\\dfrac{${plus}}{${a}}}$`,
        `$m^{-1}(x) = \\dfrac{${minus}}{${a}}$`,
        `$m^{-1}(x) = \\left(\\dfrac{${plus}}{${a}}\\right)^${n}$`,
      ],
      why: `Swap and solve: $x = ${a}y^${n} ${b > 0 ? '+' : '-'} ${Math.abs(b)}$. Undo the constant: $${minus} = ${a}y^${n}$. Undo the ${a}: $y^${n} = \\dfrac{${minus}}{${a}}$. Undo the power with a ${n === 3 ? 'cube' : 'fifth'} root.`,
      lesson: 'composition',
    };
  }

  // 11. Horizontal asymptote and where the graph crosses it
  function q2_hacross() {
    const x0 = nz(-6, 6);
    if (Math.random() < 0.55) {
      let a, e, g;
      do { a = pick([-4, -3, -2, 2, 3, 4, 5]); e = nz(-9, 9); g = nz(-9, 9); } while (x0 * x0 + e * x0 + g === 0);
      const ab = (A, B) => `a. ${A}<br>b. ${B}`;
      return {
        prompt: `(a) Identify the horizontal asymptote (if any). (b) If the graph has a horizontal asymptote, find the point where the graph crosses it.<span class="bexpr">$s(x) = \\dfrac{${poly([[a, 'x'], [-a * x0, '']])}}{${polyArr([1, e, g])}}$</span>`,
        choices: [
          ab('$y = 0$', `$(${x0}, 0)$`),
          ab(`$y = ${x0}$`, `$(0, ${x0})$`),
          ab('No horizontal asymptote', 'Not applicable'),
          ab('$y = 0$', `$(${-x0}, 0)$`),
        ],
        why: `The numerator has lower degree, so the horizontal asymptote is $y = 0$. The graph crosses it where $s(x) = 0$, which is where the numerator is $0$: $${poly([[a, 'x'], [-a * x0, '']])} = 0 \\Rightarrow x = ${x0}$.`,
        lesson: 'polynomial-rational',
      };
    }
    let a, b, e, g;
    do { a = pick([2, 3, 4, -2, -3]); b = nz(-9, 9); e = nz(-6, 6); g = nz(-9, 9); } while (b === a * e || x0 * x0 + e * x0 + g === 0);
    const c = a * g - (b - a * e) * x0;
    const ab = (A, B) => `a. ${A}<br>b. ${B}`;
    return {
      prompt: `(a) Identify the horizontal asymptote (if any). (b) If the graph has a horizontal asymptote, find the point where the graph crosses it.<span class="bexpr">$s(x) = \\dfrac{${polyArr([a, b, c])}}{${polyArr([1, e, g])}}$</span>`,
      choices: [
        ab(`$y = ${a}$`, `$(${x0}, ${a})$`),
        ab('$y = 0$', `$(${x0}, 0)$`),
        ab('No horizontal asymptote', 'Not applicable'),
        ab(`$y = ${a}$`, `$(${-x0}, ${a})$`),
      ],
      why: `Equal degrees: $y = \\dfrac{${a}}{1} = ${a}$. Set $s(x) = ${a}$ and cross-multiply: $${polyArr([a, b, c])} = ${a}(${polyArr([1, e, g])})$. The $x^2$ terms cancel, leaving $${b - a * e}x = ${a * g - c}$, so $x = ${x0}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 12. Intermediate value theorem
  function q2_ivt() {
    const want = Math.random() < 0.5;
    for (let tries = 0; tries < 400; tries++) {
      const co = [pick([-3, -2, -1, 1, 2, 3]), ri(-8, 8), ri(-9, 9), ri(-25, 25)];
      const m = ri(-3, 3);
      const fa = evalPoly(co, m), fb = evalPoly(co, m + 1);
      if (fa === 0 || fb === 0) continue;
      const yes = (fa < 0) !== (fb < 0);
      if (yes !== want) continue;
      return {
        prompt: `Determine whether the intermediate value theorem guarantees that the function has a zero on the given interval.<span class="bexpr">$f(x) = ${polyArr(co)};\\quad [${m}, ${m + 1}]$</span>`,
        choices: ['No', 'Yes'], answer: yes ? 1 : 0, fixed: true,
        why: `$f(${m}) = ${fa}$ and $f(${m + 1}) = ${fb}$. ${yes ? 'The signs are opposite, so a polynomial (which is continuous) must cross $0$ in between: yes.' : 'Both have the same sign, so the theorem gives no guarantee: no.'}`,
        lesson: 'polynomial-rational',
      };
    }
    return q2_ivt();
  }

  // 13. One-to-one from a graph
  function q2_onetoone() {
    const yes = Math.random() < 0.5;
    const spec = yes ? pick([
      { pieces: [{ f: x => x * x * x / 8 + x / 2, from: -3.4, to: 3.4, arrowStart: true, arrowEnd: true }] },
      { pieces: [{ f: x => Math.pow(2, x) - 3, from: -5.6, to: 3.1, arrowStart: true, arrowEnd: true }] },
      { pieces: [{ f: x => -0.6 * x + 1, from: -5.6, to: 5.6, arrowStart: true, arrowEnd: true }] },
    ]) : pick([
      { pieces: [{ f: x => 4 * x / (1 + x * x) + 0.3, from: -5.6, to: 5.6 }] },
      { pieces: [{ f: x => 0.5 * (x - 1) * (x - 1) - 3, from: -2.4, to: 4.4, arrowStart: true, arrowEnd: true }] },
      { pieces: [{ f: x => Math.abs(x + 1) - 2, from: -5.6, to: 3.6, arrowStart: true, arrowEnd: true }] },
    ]);
    return {
      prompt: 'Determine if the relation defines $y$ as a one-to-one function of $x$.',
      graph: spec,
      choices: ['No', 'Yes'], answer: yes ? 1 : 0, fixed: true,
      why: yes
        ? 'It passes the vertical line test (a function) and the horizontal line test: no horizontal line hits it twice. So it is one-to-one.'
        : 'Some horizontal line crosses the graph twice, so two different $x$-values share a $y$-value. It fails the horizontal line test: not one-to-one.',
      lesson: 'composition',
    };
  }

  // 14. Possible rational zeros
  function q2_rationalzeros() {
    const L = pick([1, 1, 2]), C = pick([4, 6, 8, 9, 10, 12, 15]);
    const facs = n => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };
    const vals = new Map();
    facs(C).forEach(p => facs(L).forEach(q => { vals.set(p / q, frac(p, q)); }));
    const list = [...vals.entries()].sort((x, y) => x[0] - y[0]).map(e => e[1]);
    const recips = facs(C).map(q => frac(1, q));
    const f = polyArr([L, ri(-6, 6), ri(-6, 6), ri(-6, 6), C]);
    return {
      prompt: `List the possible rational zeros.<span class="bexpr">$f(x) = ${f}$</span>`,
      choices: [
        `$${list.map(t => '\\pm ' + t).join(',\\ ')}$`,
        `$${list.join(',\\ ')}$`,
        `$${list.map(t => '-' + t).join(',\\ ')}$`,
        `$${recips.map(t => '\\pm ' + t).join(',\\ ')}$`,
      ],
      why: `Candidates are $\\pm\\dfrac{\\text{factors of } ${C}}{\\text{factors of } ${L}}$. Factors of ${C}: ${facs(C).join(', ')}. Factors of ${L}: ${facs(L).join(', ')}. Both signs are always included.`,
      lesson: 'polynomial-rational',
    };
  }

  // 15. Long division
  function q2_longdiv() {
    const p = pick([2, 3, 4]), q = nz(-5, 5), a = pick([2, 3, 4]), b = nz(-5, 5), c = nz(-5, 5);
    const div = mul([p, q], [a, b, c]);
    const P = arr => `$${polyArr(arr)}$`;
    return {
      prompt: `Divide using long division.<span class="bexpr">$(${polyArr(div)}) \\div (${poly([[p, 'x'], [q, '']])})$</span>`,
      choices: [P([a, b, c]), P([a, -b, c]), P([a, 0, c]), P([a, b, -c])],
      why: `$${div[0]}x^3 \\div ${p}x = ${a}x^2$. Multiply and subtract, bring down the next term, and repeat: the next quotient terms are $${poly([[b, 'x']])}$ and $${c}$, with remainder $0$. Check: $(${poly([[p, 'x'], [q, '']])})(${polyArr([a, b, c])}) = ${polyArr(div)}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 16. Quadratic inequality
  function q2_quadineq() {
    let r1, r2;
    do { r1 = nz(-9, 9); r2 = nz(-9, 9); } while (r1 >= r2 || r1 === -r2);
    const s = sgn();
    const op = pick(['\\le', '\\ge', '<', '>']);
    const strict = op === '<' || op === '>';
    const wantPos = op === '\\ge' || op === '>';
    const outside = wantPos === (s > 0);
    const L = strict ? '(' : '[', Rb = strict ? ')' : ']';
    const out = (x, y) => `(-\\infty, ${x}${Rb} \\cup ${L}${y}, \\infty)`;
    const btw = (x, y) => `${L}${x}, ${y}${Rb}`;
    const ans = outside ? out(r1, r2) : btw(r1, r2);
    const other = outside ? btw(r1, r2) : out(r1, r2);
    const neg = outside ? out(-r2, -r1) : btw(-r2, -r1);
    return {
      prompt: `Solve the inequality. Write the solution set in interval notation.<span class="bexpr">$${polyArr([s, -s * (r1 + r2), s * r1 * r2])} ${op} 0$</span>`,
      choices: [`$${ans}$`, `$${other}$`, `$${neg}$`, '$(-\\infty, \\infty)$'],
      why: `Factor: $${s < 0 ? '-' : ''}${xm(r1)}${xm(r2)} ${op} 0$. The zeros $${r1}$ and $${r2}$ split the line. ${s < 0 ? 'Because the leading coefficient is negative, the expression is negative outside the zeros and positive between them.' : 'The expression is positive outside the zeros and negative between them.'} So the solution is $${ans}$${strict ? '' : ', with endpoints included'}.`,
      lesson: 'equations',
    };
  }

  // 17. Rational inequality with x^2 / (x^2 + k^2)
  function q2_ratineq() {
    const k = ri(2, 12);
    const ops = [['\\ge', 2, 'The fraction is never negative, so every real number works.'],
      ['>', 1, 'The fraction is positive everywhere except $x = 0$, where it equals $0$.'],
      ['\\le', 3, 'The fraction is never negative, so it is $\\le 0$ only when it equals $0$, at $x = 0$.'],
      ['<', 4, 'The fraction is never negative, so there is no solution.']];
    const [op, ans, why] = pick(ops);
    return {
      prompt: `Solve the inequality. Write the solution set in interval notation.<span class="bexpr">$\\dfrac{x^2}{x^2 + ${k * k}} ${op} 0$</span>`,
      choices: [`$(-\\infty, -${k}] \\cup [${k}, \\infty)$`, '$(-\\infty, 0) \\cup (0, \\infty)$', '$(-\\infty, \\infty)$', '$\\{0\\}$', 'No solution'],
      answer: ans, fixed: true,
      why: `The denominator $x^2 + ${k * k}$ is always positive and the numerator $x^2$ is never negative. ${why}`,
      lesson: 'equations',
    };
  }

  // 18. Synthetic division
  function q2_synthetic() {
    let c, Q, R;
    do { c = nz(-5, 5); Q = [1, nz(-7, 7), nz(-9, 9), nz(-9, 9)]; R = nz(-12, 12); } while (false);
    const dividend = mul(Q, [1, -c]); dividend[dividend.length - 1] += R;
    const den = x => `s ${x > 0 ? '-' : '+'} ${Math.abs(x)}`;
    const rem = (r, d) => (r === 0 ? '' : ` ${r > 0 ? '+' : '-'} \\dfrac{${Math.abs(r)}}{${den(d)}}`);
    const wrong = synth(dividend, -c);
    const tail = poly([[Q[3], 's'], [R, '']]);
    return {
      prompt: `Use synthetic division to divide the polynomials.<span class="bexpr">$(${polyArr(dividend, 's')}) \\div (${den(c)})$</span>`,
      choices: [
        `$${polyArr(Q, 's')}${rem(R, c)}$`,
        `$${polyArr(Q, 's')}$`,
        `$${polyArr([1, Q[1], Q[2], 0], 's')} + \\dfrac{${tail}}{${den(c)}}$`,
        `$${polyArr(wrong.q, 's')}${rem(wrong.rem, -c)}$`,
      ],
      why: `Divide by $${den(c)}$, so use $${c}$ in the synthetic division box (the opposite sign of the number in the divisor). The bottom row gives quotient $${polyArr(Q, 's')}$ and remainder $${R}$, written as $\\dfrac{${R}}{${den(c)}}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 19. Vertical asymptotes
  function q2_vasym() {
    const k = ri(2, 9);
    const forms = [
      [`\\dfrac{x}{x^2 + ${k * k}}`, 0, `$x^2 + ${k * k}$ is never $0$, so there are no vertical asymptotes.`],
      [`\\dfrac{x}{x^2 - ${k * k}}`, 3, `$x^2 - ${k * k} = 0$ at $x = \\pm ${k}$, and the numerator is not $0$ there.`],
      [`\\dfrac{${k + 1}}{x - ${k}}`, 2, `The denominator is $0$ only at $x = ${k}$.`],
      [`\\dfrac{x + 1}{x^2 - ${k}x}`, 1, `$x^2 - ${k}x = x(x - ${k})$ is $0$ at $x = 0$ and $x = ${k}$.`],
    ];
    const [f, ans, why] = pick(forms);
    return {
      prompt: `Determine the vertical asymptote(s) of the graph of the function.<span class="bexpr">$f(x) = ${f}$</span>`,
      choices: ['None', `$x = ${k}$ and $x = 0$`, `$x = ${k}$`, `$x = ${k}$ and $x = -${k}$`],
      answer: ans, fixed: true,
      why: `Vertical asymptotes sit where the denominator is $0$ (after cancelling common factors). ${why}`,
      lesson: 'polynomial-rational',
    };
  }

  // 20. Polynomial from zeros
  function q2_fromzeros() {
    let z;
    do { z = [nz(-6, 9), nz(-6, 9), nz(-6, 9)]; } while (new Set(z).size < 3);
    z.sort((a, b) => a - b);
    const S = z[0] + z[1] + z[2], Pr = z[0] * z[1] + z[0] * z[2] + z[1] * z[2], T = z[0] * z[1] * z[2];
    const pw = Pr - 2 * S || Pr + 4;
    const P = arr => `$f(x) = ${polyArr(arr)}$`;
    return {
      prompt: `Write a polynomial $f(x)$ that meets the given conditions.<span class="bexpr">Degree 3 polynomial with zeros $${z[0]}$, $${z[1]}$, and $${z[2]}$</span>`,
      choices: [P([1, -S, Pr, -T]), P([1, S, Pr, T]), P([1, -S, pw, -T]), P([1, S, pw, T])],
      why: `Each zero $c$ gives a factor $(x - c)$: $f(x) = ${z.map(v => xm(v)).join('')}$. Multiply out: $${polyArr([1, -S, Pr, -T])}$.`,
      lesson: 'polynomial-rational',
    };
  }

  // 21. Zeros and multiplicities
  function q2_multiplicity() {
    let m, n, k, a, p, q;
    do { m = ri(2, 7); n = ri(2, 7); k = ri(2, 7); a = ri(2, 9); p = nz(-9, 9); q = nz(-9, 9); } while (p === -q || p === q);
    const zs = (list) => list.map(([v, mu]) => `$${v}$ (multiplicity ${mu})`).join(', ');
    return {
      prompt: `Find the zeros of the function and state the multiplicities.<span class="bexpr">$f(x) = ${a}x^${m}${xm(p)}^${n}${xm(-q)}^${k}$</span>`,
      choices: [
        zs([[0, m], [p, n], [-q, k]]),
        zs([[p, n], [-q, k]]),
        zs([[-p, n], [q, k]]),
        zs([[0, m], [-p, n], [q, k]]),
      ],
      why: `Set each factor to zero. $x^${m}$ gives $0$ with multiplicity ${m}. $${xm(p)}^${n}$ gives $${p}$ with multiplicity ${n}. $${xm(-q)}^${k}$ gives $${-q}$ with multiplicity ${k}. The constant ${a} is not a zero.`,
      lesson: 'polynomial-rational', points: 5.75,
    };
  }

  function buildBlitz2() {
    const gens = [q2_asym, q2_compdomain, q2_comppoly, q2_ratdomain, q2_endbehavior, q2_compvalue, q2_factorzero,
      q2_complexzeros, q2_solvegiven, q2_inverse, q2_hacross, q2_ivt, q2_onetoone, q2_rationalzeros, q2_longdiv,
      q2_quadineq, q2_ratineq, q2_synthetic, q2_vasym, q2_fromzeros, q2_multiplicity];
    return gens.map((gen, i) => {
      const q = build(gen);
      q.points = q.points || (i === 10 ? 4 : 4.75);
      if (q.answer == null) q.answer = 0;
      return q;
    });
  }

  /* ============================================================ registry */
  const BLITZES = [
    {
      id: '1', title: 'Blitz 1', topic: 'Factoring, functions, and graphs', ready: true, build: buildBlitz1,
      covers: 'factoring, rationalizing, evaluating functions, even and odd, transformations, domain and range, piecewise functions, combining functions, intercepts, reading graphs, extrema, and symmetry',
    },
    {
      id: '2', title: 'Blitz 2', topic: 'Polynomial and rational functions', ready: true, build: buildBlitz2,
      covers: 'composition and inverses, end behavior, dividing polynomials, finding real and complex zeros, the rational zero test, the intermediate value theorem, asymptotes, and polynomial and rational inequalities',
    },
    { id: '3', title: 'Blitz 3', topic: 'Coming soon', ready: false },
  ];

  /* ============================================================ view */
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pts = n => (Math.round(n * 10) / 10).toString();

  function renderChoice(label, c) {
    if (c.graph) { const box = h('div', { class: 'bchoice-graph' }); drawGraph(box, c.graph, 260); label.appendChild(box); }
    else label.appendChild(h('span', { class: 'bchoice-text' }, c));
  }

  /* api: { renderMath, lessonTitle(id), getRecord(id), saveRecord(id, rec), onChange() } */
  function indexView(api) {
    const art = h('article', { class: 'lesson blitz-index' });
    art.appendChild(h('h1', { tabindex: '-1' }, 'Blitz sessions'));
    art.appendChild(h('p', { class: 'lede' }, 'Full practice quizzes built to feel like the real thing: same question types, same point values, and no feedback until you submit. Every attempt uses new numbers, so take each one more than once.'));
    const list = h('div', { class: 'blitz-list' });
    BLITZES.forEach(b => {
      const rec = api.getRecord(b.id);
      const card = h(b.ready ? 'a' : 'div', { class: 'blitz-card' + (b.ready ? '' : ' is-soon'), href: b.ready ? `#/blitz/${b.id}` : null });
      card.innerHTML = `<h2>${b.title}</h2><p>${b.topic}</p>` +
        (b.ready && window.Prep && Prep.has(b.id) ? `<p class="blitz-prep">Includes a study plan: <span>${b.title} prep plan</span></p>` : '') +
        (b.ready ? `<p class="blitz-meta">${rec ? `Best score ${pts(rec.best)} of 100, ${rec.attempts} attempt${rec.attempts === 1 ? '' : 's'}` : 'Not attempted yet'}</p>` : '<p class="blitz-meta">Not available yet</p>');
      list.appendChild(card);
    });
    art.appendChild(list);
    return art;
  }

  function blitzView(b, api) {
    const art = h('article', { class: 'lesson blitz' });
    art.appendChild(h('p', { class: 'crumb' }, '<a href="#/blitz">Blitz sessions</a>'));
    art.appendChild(h('h1', { tabindex: '-1' }, `${b.title}: ${b.topic}`));
    const rec = api.getRecord(b.id);
    const intro = h('div', { class: 'blitz-intro' });
    intro.innerHTML = `
      <p class="lede">Covers ${b.covers}.</p>
      <ul class="blitz-rules">
        <li>21 multiple-choice questions, 100 points</li>
        <li>No feedback until you submit, like the real quiz</li>
        <li>New numbers every attempt, and a timer so you can track your pace</li>
      </ul>
      ${window.Prep && Prep.has(b.id) ? `<p class="tip">New to this material? Work through the <a href="#/prep/${b.id}">${b.title} prep plan</a> first. It covers every question type with a method, an example, and practice.</p>` : ''}
      ${rec ? `<p class="muted">Best score so far: ${pts(rec.best)} of 100 across ${rec.attempts} attempt${rec.attempts === 1 ? '' : 's'}.</p>` : ''}`;
    const start = h('button', { type: 'button', class: 'btn' }, rec ? 'Start a new attempt' : `Start ${b.title}`);
    intro.appendChild(start);
    art.appendChild(intro);
    const stage = h('div', { class: 'blitz-stage' });
    art.appendChild(stage);
    start.addEventListener('click', () => { intro.hidden = true; runAttempt(b, stage, api); });
    return art;
  }

  function runAttempt(b, stage, api) {
    stage.innerHTML = '';
    const questions = b.build();
    const total = questions.reduce((s, q) => s + q.points, 0);
    const picks = new Array(questions.length).fill(null);
    const result = h('div', { class: 'blitz-result', 'aria-live': 'polite' });
    stage.appendChild(result);
    const form = h('ol', { class: 'bquiz' });
    const orders = [];
    questions.forEach((q, qi) => {
      const li = h('li', { class: 'bq', id: `bq-${qi}` });
      li.appendChild(h('p', { class: 'bq-head' }, `Question ${qi + 1}<span>${pts(q.points)} pts</span>`));
      li.appendChild(h('div', { class: 'bq-prompt' }, q.prompt));
      if (q.graph) { const gbox = h('div', { class: 'bq-graph' }); drawGraph(gbox, q.graph, 320); li.appendChild(gbox); }
      const order = q.fixed ? q.choices.map((_, i) => i) : shuffle(q.choices.map((_, i) => i));
      orders.push(order);
      const opts = h('div', { class: 'bq-choices' + (q.choices[0].graph ? ' has-graphs' : '') + (q.choices.every(c => typeof c === 'string' && c.length < 40) ? ' short' : '') });
      order.forEach(ci => {
        const label = h('label', { class: 'bchoice' });
        const input = h('input', { type: 'radio', name: `bq${qi}`, value: ci });
        input.addEventListener('change', () => { picks[qi] = ci; updateBar(); });
        label.appendChild(input);
        renderChoice(label, q.choices[ci]);
        opts.appendChild(label);
      });
      li.appendChild(opts);
      li.appendChild(h('div', { class: 'bq-why', hidden: '' }));
      form.appendChild(li);
    });
    stage.appendChild(form);

    const bar = h('div', { class: 'blitz-bar' });
    const status = h('span', { class: 'blitz-status' });
    const timer = h('span', { class: 'blitz-timer', 'aria-label': 'Elapsed time' }, '0:00');
    const submit = h('button', { type: 'button', class: 'btn' }, 'Submit quiz');
    bar.append(status, timer, submit);
    stage.appendChild(bar);
    api.renderMath(stage);

    const t0 = Date.now();
    let elapsed = 0, done = false, confirmPending = false;
    const tick = setInterval(() => {
      if (!stage.isConnected || done) { clearInterval(tick); return; }
      elapsed = Math.floor((Date.now() - t0) / 1000);
      timer.textContent = clock(elapsed);
    }, 1000);
    function updateBar() {
      const n = picks.filter(p => p !== null).length;
      status.textContent = `${n} of ${questions.length} answered`;
      if (confirmPending) { confirmPending = false; submit.textContent = 'Submit quiz'; }
    }
    updateBar();

    submit.addEventListener('click', () => {
      if (done) return;
      const blank = picks.filter(p => p === null).length;
      if (blank && !confirmPending) {
        confirmPending = true;
        status.textContent = `${blank} unanswered. Unanswered questions score zero.`;
        submit.textContent = 'Submit anyway';
        return;
      }
      done = true;
      elapsed = Math.floor((Date.now() - t0) / 1000);
      clearInterval(tick);
      grade();
    });

    function grade() {
      let score = 0, right = 0;
      const missedLessons = new Map();
      questions.forEach((q, qi) => {
        const li = document.getElementById(`bq-${qi}`);
        const ok = picks[qi] === q.answer;
        if (ok) { score += q.points; right++; } else missedLessons.set(q.lesson, (missedLessons.get(q.lesson) || 0) + 1);
        li.classList.add(ok ? 'is-right' : 'is-wrong');
        li.querySelector('.bq-head').insertAdjacentHTML('beforeend', `<strong class="bq-mark">${ok ? 'Correct' : picks[qi] === null ? 'Not answered' : 'Incorrect'}</strong>`);
        li.querySelectorAll('.bchoice').forEach((label, k) => {
          const ci = orders[qi][k];
          label.querySelector('input').disabled = true;
          if (ci === q.answer) label.classList.add('is-answer');
          else if (ci === picks[qi]) label.classList.add('is-picked-wrong');
        });
        const why = li.querySelector('.bq-why');
        why.innerHTML = `${q.why} <a href="#/lesson/${q.lesson}">Review: ${api.lessonTitle(q.lesson)}</a>`;
        why.hidden = false;
      });
      score = Math.round(score * 10) / 10;
      const prev = api.getRecord(b.id) || { best: 0, attempts: 0 };
      api.saveRecord(b.id, { best: Math.max(prev.best, score), attempts: prev.attempts + 1, last: score });
      bar.remove();
      const lessonsHtml = [...missedLessons.entries()].sort((a, c) => c[1] - a[1])
        .map(([id, n]) => `<li><a href="#/lesson/${id}">${api.lessonTitle(id)}</a> (${n} missed)</li>`).join('');
      result.innerHTML = `
        <p class="blitz-score"><strong>${pts(score)}</strong> / ${pts(total)}</p>
        <p>${right} of ${questions.length} correct in ${clock(elapsed)}.${score >= prev.best && prev.attempts ? ' New best score.' : ''}</p>
        ${lessonsHtml ? `<p>Lessons to review before your next attempt:</p><ul>${lessonsHtml}</ul>` : '<p>A perfect run. Try again with new numbers to make sure it sticks.</p>'}
        <p class="muted">Scroll down to see the correct answer and an explanation for every question.</p>`;
      const again = h('button', { type: 'button', class: 'btn' }, 'New attempt with new numbers');
      again.addEventListener('click', () => { runAttempt(b, stage, api); window.scrollTo(0, stage.offsetTop - 20); });
      result.appendChild(again);
      api.renderMath(form);
      api.renderMath(result);
      api.onChange();
      window.scrollTo(0, Math.max(0, result.getBoundingClientRect().top + window.scrollY - 80));
    }
  }

  /* ------------------------------------------------------------ single-question practice (used by prep plans) */
  const GENERATORS = {
    factor: q_factor, rationalize: q_rationalize, eval: q_eval, evenodd: q_evenodd, transform: q_transform,
    isfunction: q_isfunction, domain: q_domain, domainrange: q_domainrange, piecewise: q_piecewise,
    product: q_product, fxh: q_fxh, difference: q_difference, intercepts: q_intercepts, incdec: q_incdec,
    piecegraph: q_piecegraph, recipgraph: q_recipgraph, readgraph: q_readgraph, reflect: q_reflect,
    extrema: q_extrema, shrink: q_shrink, symmetry: q_symmetry,
    asym2: q2_asym, compdomain: q2_compdomain, comppoly: q2_comppoly, ratdomain: q2_ratdomain, endbehavior: q2_endbehavior,
    compvalue: q2_compvalue, factorzero: q2_factorzero, complexzeros: q2_complexzeros, solvegiven: q2_solvegiven,
    inverse: q2_inverse, hacross: q2_hacross, ivt: q2_ivt, onetoone: q2_onetoone, rationalzeros: q2_rationalzeros,
    longdiv: q2_longdiv, quadineq: q2_quadineq, ratineq: q2_ratineq, synthetic: q2_synthetic, vasym: q2_vasym,
    fromzeros: q2_fromzeros, multiplicity: q2_multiplicity,
  };
  function practice(host, keys, renderMath) {
    const box = h('div', { class: 'practice' });
    host.appendChild(box);
    let turn = 0;
    function next() {
      const key = keys[turn++ % keys.length];
      const q = build(GENERATORS[key]);
      if (q.answer == null) q.answer = 0;
      box.innerHTML = '';
      box.appendChild(h('div', { class: 'bq-prompt' }, q.prompt));
      if (q.graph) { const g = h('div', { class: 'bq-graph' }); drawGraph(g, q.graph, 300); box.appendChild(g); }
      const order = q.fixed ? q.choices.map((_, i) => i) : shuffle(q.choices.map((_, i) => i));
      const opts = h('div', { class: 'bq-choices' + (q.choices[0].graph ? ' has-graphs' : '') + (q.choices.every(c => typeof c === 'string' && c.length < 40) ? ' short' : '') });
      const why = h('div', { class: 'bq-why', hidden: '' });
      const again = h('button', { type: 'button', class: 'btn-small', hidden: '' }, 'Try another one');
      again.addEventListener('click', next);
      order.forEach(ci => {
        const b = h('button', { type: 'button', class: 'bchoice' });
        renderChoice(b, q.choices[ci]);
        b.addEventListener('click', () => {
          if (!why.hidden) return;
          opts.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const ok = ci === q.answer;
          b.classList.add(ok ? 'is-answer' : 'is-picked-wrong');
          if (!ok) opts.children[order.indexOf(q.answer)].classList.add('is-answer');
          why.innerHTML = `<strong class="${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</strong> ${q.why}`;
          why.hidden = false; again.hidden = false;
          renderMath(why);
        });
        opts.appendChild(b);
      });
      box.append(opts, why, again);
      renderMath(box);
    }
    next();
  }

  window.Blitz = {
    practice,
    list: BLITZES,
    get: id => BLITZES.find(b => b.id === id && b.ready),
    indexView,
    blitzView,
  };
})();
