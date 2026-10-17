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

  /* ============================================================ registry */
  const BLITZES = [
    {
      id: '1', title: 'Blitz 1', topic: 'Factoring, functions, and graphs', ready: true, build: buildBlitz1,
      covers: 'factoring, rationalizing, evaluating functions, even and odd, transformations, domain and range, piecewise functions, combining functions, intercepts, reading graphs, extrema, and symmetry',
    },
    { id: '2', title: 'Blitz 2', topic: 'Coming soon', ready: false },
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
