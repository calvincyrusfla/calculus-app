/* SVG graphing and the interactive explorers used in lessons. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const PI = Math.PI;

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function tex(target, latex, display) {
    if (window.katex) {
      try { katex.render(latex, target, { throwOnError: false, displayMode: !!display }); return; } catch (e) { /* fall through */ }
    }
    target.textContent = latex;
  }
  function fmt(v) {
    const r = Math.round(v * 1000) / 1000;
    return (Object.is(r, -0) ? 0 : r).toString();
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

  /* Express v as a multiple of pi when it is a simple fraction of pi. */
  function piTex(v) {
    if (Math.abs(v) < 1e-9) return '0';
    const t = v / PI;
    for (let den = 1; den <= 12; den++) {
      const num = Math.round(t * den);
      if (Math.abs(num / den - t) < 1e-9) {
        const g = gcd(num, den), n = num / g, d = den / g;
        const sign = n < 0 ? '-' : '';
        const an = Math.abs(n);
        const top = (an === 1 ? '' : an) + '\\pi';
        return d === 1 ? sign + top : sign + '\\frac{' + top + '}{' + d + '}';
      }
    }
    return fmt(v);
  }

  /* ---------------------------------------------------------------- Plot */
  class Plot {
    constructor(host, o) {
      this.o = Object.assign({ w: 600, h: 380, xmin: -6, xmax: 6, ymin: -5, ymax: 5, xstep: 1, ystep: 1, xlabel: fmt, ylabel: fmt, xlabelEvery: 1, ylabelEvery: 1 }, o);
      const { w, h: hh } = this.o;
      this.svg = svgEl('svg', { viewBox: `0 0 ${w} ${hh}`, class: 'plot', role: 'img', 'aria-label': this.o.label || 'Graph' }, host);
      this.gridG = svgEl('g', { class: 'grid' }, this.svg);
      this.layer = svgEl('g', {}, this.svg);
      this.drawGrid();
    }
    X(x) { const o = this.o; return (x - o.xmin) / (o.xmax - o.xmin) * o.w; }
    Y(y) { const o = this.o; return o.h - (y - o.ymin) / (o.ymax - o.ymin) * o.h; }
    drawGrid() {
      const o = this.o, g = this.gridG;
      let i = 0;
      for (let x = Math.ceil(o.xmin / o.xstep) * o.xstep; x <= o.xmax + 1e-9; x += o.xstep, i++) {
        const isAxis = Math.abs(x) < 1e-9;
        svgEl('line', { x1: this.X(x), x2: this.X(x), y1: 0, y2: o.h, class: isAxis ? 'axis' : 'gridline' }, g);
        const n = Math.round(x / o.xstep);
        if (!isAxis && n % o.xlabelEvery === 0 && x > o.xmin + 1e-9 && x < o.xmax - 1e-9) {
          const ty = Math.min(Math.max(this.Y(0) + 16, 14), o.h - 4);
          const t = svgEl('text', { x: this.X(x), y: ty, class: 'ticklabel', 'text-anchor': 'middle' }, g);
          t.textContent = o.xlabel(x);
        }
      }
      for (let y = Math.ceil(o.ymin / o.ystep) * o.ystep; y <= o.ymax + 1e-9; y += o.ystep) {
        const isAxis = Math.abs(y) < 1e-9;
        svgEl('line', { x1: 0, x2: o.w, y1: this.Y(y), y2: this.Y(y), class: isAxis ? 'axis' : 'gridline' }, g);
        const n = Math.round(y / o.ystep);
        if (!isAxis && n % o.ylabelEvery === 0 && y > o.ymin + 1e-9 && y < o.ymax - 1e-9) {
          const tx = Math.min(Math.max(this.X(0) - 6, 18), o.w - 4);
          const t = svgEl('text', { x: tx, y: this.Y(y) + 4, class: 'ticklabel', 'text-anchor': 'end' }, g);
          t.textContent = o.ylabel(y);
        }
      }
    }
    clear() { this.layer.innerHTML = ''; }
    curve(fn, cls) {
      const o = this.o, N = 800;
      let d = '', pen = false, prevY = null;
      for (let i = 0; i <= N; i++) {
        const x = o.xmin + (o.xmax - o.xmin) * i / N;
        const y = fn(x);
        if (!isFinite(y)) { pen = false; prevY = null; continue; }
        const py = this.Y(y);
        if (prevY !== null && Math.abs(py - prevY) > o.h * 1.2) pen = false; // jump across an asymptote
        const cy = Math.max(-o.h, Math.min(2 * o.h, py));
        d += (pen ? 'L' : 'M') + this.X(x).toFixed(2) + ' ' + cy.toFixed(2);
        pen = true; prevY = py;
      }
      return svgEl('path', { d, class: 'curve ' + (cls || '') }, this.layer);
    }
    vline(x, cls) { return svgEl('line', { x1: this.X(x), x2: this.X(x), y1: 0, y2: this.o.h, class: cls }, this.layer); }
    hline(y, cls) { return svgEl('line', { x1: 0, x2: this.o.w, y1: this.Y(y), y2: this.Y(y), class: cls }, this.layer); }
    dot(x, y, cls, r) { return svgEl('circle', { cx: this.X(x), cy: this.Y(y), r: r || 5, class: cls }, this.layer); }
  }

  /* ------------------------------------------------------------ controls */
  function slider(parent, { label, min, max, step, value, show }) {
    const wrap = h('label', { class: 'slider' });
    const top = h('span', { class: 'slider-top' });
    const name = h('span', { class: 'slider-name' });
    tex(name, label);
    const val = h('span', { class: 'slider-val' });
    top.append(name, val);
    const input = h('input', { type: 'range', min, max, step, value });
    wrap.append(top, input);
    parent.appendChild(wrap);
    const api = {
      get value() { return parseFloat(input.value); },
      set value(v) { input.value = v; api.refresh(); },
      refresh() { tex(val, show ? show(api.value) : fmt(api.value)); },
      onInput(cb) { input.addEventListener('input', () => { api.refresh(); cb(); }); },
    };
    api.refresh();
    return api;
  }
  function segmented(parent, options, value, onChange) {
    const g = h('div', { class: 'segmented', role: 'radiogroup' });
    options.forEach(([key, latex]) => {
      const b = h('button', { type: 'button', role: 'radio', 'aria-checked': key === value ? 'true' : 'false' });
      tex(b, latex);
      b.addEventListener('click', () => {
        g.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', 'false'));
        b.setAttribute('aria-checked', 'true');
        onChange(key);
      });
      g.appendChild(b);
    });
    parent.appendChild(g);
    return g;
  }
  function shell(host, caption) {
    const box = h('figure', { class: 'explorer' });
    const fig = h('div', { class: 'explorer-graph' });
    const side = h('div', { class: 'explorer-controls' });
    box.append(fig, side);
    if (caption) box.appendChild(h('figcaption', null, caption));
    host.appendChild(box);
    return { box, fig, side };
  }

  /* ------------------------------------------------- transformations */
  const parents = {
    square: { f: x => x * x, tex: (inn) => inn === 'x' ? 'x^2' : `\\left(${inn}\\right)^2` },
    abs: { f: x => Math.abs(x), tex: (inn) => `\\left|${inn}\\right|` },
    sqrt: { f: x => x < 0 ? NaN : Math.sqrt(x), tex: (inn) => `\\sqrt{${inn}}` },
    cube: { f: x => x * x * x, tex: (inn) => inn === 'x' ? 'x^3' : `\\left(${inn}\\right)^3` },
  };
  function transformExplorer(host) {
    const { fig, side } = shell(host, 'Dashed: the parent graph. Solid: after your transformations.');
    const eq = h('div', { class: 'explorer-eq', 'aria-live': 'polite' });
    fig.appendChild(eq);
    const plot = new Plot(fig, { w: 520, h: 520, xmin: -8, xmax: 8, ymin: -8, ymax: 8, xlabelEvery: 2, ylabelEvery: 2, label: 'Transformation graph' });
    let parent = 'square';
    segmented(side, [['square', 'x^2'], ['abs', '|x|'], ['sqrt', '\\sqrt{x}'], ['cube', 'x^3']], parent, k => { parent = k; draw(); });
    const a = slider(side, { label: 'a', min: -3, max: 3, step: 0.5, value: 1 });
    const b = slider(side, { label: 'b', min: 0.5, max: 3, step: 0.25, value: 1 });
    const hh = slider(side, { label: 'h', min: -5, max: 5, step: 1, value: 0 });
    const k = slider(side, { label: 'k', min: -5, max: 5, step: 1, value: 0 });
    const reset = h('button', { type: 'button', class: 'btn-quiet' }, 'Reset');
    side.appendChild(reset);
    reset.addEventListener('click', () => { a.value = 1; b.value = 1; hh.value = 0; k.value = 0; draw(); });
    [a, b, hh, k].forEach(s => s.onInput(draw));

    function draw() {
      const P = parents[parent], A = a.value, B = b.value, H = hh.value, K = k.value;
      plot.clear();
      plot.curve(P.f, 'muted dashed');
      plot.curve(x => A * P.f(B * (x - H)) + K, 'c-sin thick');
      plot.dot(H, K, 'pt-sin', 5);
      const xh = H === 0 ? 'x' : H > 0 ? `x - ${fmt(H)}` : `x + ${fmt(-H)}`;
      const inner = B === 1 ? xh : (H === 0 ? `${fmt(B)}x` : `${fmt(B)}(${xh})`);
      const pre = A === 1 ? '' : A === -1 ? '-' : fmt(A);
      const post = K === 0 ? '' : K > 0 ? ` + ${fmt(K)}` : ` - ${fmt(-K)}`;
      tex(eq, `y = ${A === 0 ? '0' : pre + P.tex(inner)}${post}`, true);
    }
    draw();
  }

  /* ---------------------------------------------------- rational example */
  function rationalPlot(host) {
    const { fig } = shell(host, 'The graph of $\\dfrac{2x^2-8}{x^2-x-2}$: hole at $\\left(2, \\tfrac83\\right)$, asymptotes $x=-1$ and $y=2$.');
    const plot = new Plot(fig, { w: 560, h: 420, xmin: -7, xmax: 7, ymin: -6, ymax: 9, xlabelEvery: 1, ylabelEvery: 1, label: 'Rational function graph' });
    plot.vline(-1, 'asym');
    plot.hline(2, 'asym');
    plot.curve(x => 2 * (x + 2) / (x + 1), 'c-sin thick');
    plot.dot(2, 8 / 3, 'hole', 5);
  }

  /* ---------------------------------------------------- exponential / log */
  function expLogExplorer(host) {
    const { fig, side } = shell(host, 'An exponential and its inverse logarithm are mirror images across $y = x$.');
    const eq = h('div', { class: 'explorer-eq', 'aria-live': 'polite' });
    fig.appendChild(eq);
    const plot = new Plot(fig, { w: 480, h: 480, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabelEvery: 2, ylabelEvery: 2, label: 'Exponential and logarithm graph' });
    const b = slider(side, { label: 'b', min: 0.2, max: 5, step: 0.1, value: 2 });
    const showLog = h('label', { class: 'toggle' }, '<input type="checkbox" checked> <span>Show the logarithm</span>');
    side.appendChild(showLog);
    const legend = h('div', { class: 'legend' });
    side.appendChild(legend);
    b.onInput(draw);
    showLog.querySelector('input').addEventListener('change', draw);
    function draw() {
      let B = b.value;
      if (Math.abs(B - 1) < 1e-9) { B = 1.1; b.value = 1.1; } // base 1 is not allowed
      const withLog = showLog.querySelector('input').checked;
      plot.clear();
      plot.curve(x => x, 'muted dashed');
      plot.curve(x => Math.pow(B, x), 'c-sin thick');
      plot.dot(0, 1, 'pt-sin', 4);
      if (withLog) { plot.curve(x => x > 0 ? Math.log(x) / Math.log(B) : NaN, 'c-cos thick'); plot.dot(1, 0, 'pt-cos', 4); }
      eq.innerHTML = '';
      const e1 = h('span', { class: 'c-sin' }); tex(e1, `y = ${fmt(B)}^x`); eq.appendChild(e1);
      if (withLog) { const e2 = h('span', { class: 'c-cos' }); tex(e2, `y = \\log_{${fmt(B)}} x`); eq.appendChild(e2); }
      legend.innerHTML = '';
      const kind = B > 1 ? 'growth: rises left to right' : 'decay: falls left to right';
      legend.appendChild(h('p', null, `Base ${fmt(B)} means <strong>${kind}</strong>.`));
    }
    draw();
  }

  /* ---------------------------------------------------- sine / cosine graph */
  function trigExplorer(host) {
    const { fig, side } = shell(host, 'Faint wave: the parent graph. Dashed line: the midline.');
    const eq = h('div', { class: 'explorer-eq', 'aria-live': 'polite' });
    fig.appendChild(eq);
    const plot = new Plot(fig, { w: 640, h: 380, xmin: -2 * PI, xmax: 2 * PI, ymin: -5.5, ymax: 5.5, xstep: PI / 2, ystep: 1, xlabel: v => { const s = piTex(v); return s.replace(/\\frac\{(.*?)\}\{(\d+)\}/, '$1/$2').replace(/\\pi/g, 'π'); }, ylabelEvery: 2, label: 'Sine and cosine graph' });
    let fn = 'sin';
    segmented(side, [['sin', '\\sin'], ['cos', '\\cos']], fn, k => { fn = k; draw(); });
    const A = slider(side, { label: 'A', min: -4, max: 4, step: 0.5, value: 1 });
    const B = slider(side, { label: 'B', min: 0.5, max: 4, step: 0.5, value: 1 });
    const C = slider(side, { label: 'C', min: -PI, max: PI, step: PI / 12, value: 0, show: piTex });
    const D = slider(side, { label: 'D', min: -3, max: 3, step: 0.5, value: 0 });
    const facts = h('dl', { class: 'facts', 'aria-live': 'polite' });
    side.appendChild(facts);
    [A, B, C, D].forEach(s => s.onInput(draw));

    function draw() {
      const a = A.value, b = B.value, c = Math.round(C.value / (PI / 12)) * (PI / 12), d = D.value;
      const base = fn === 'sin' ? Math.sin : Math.cos;
      plot.clear();
      plot.curve(base, 'muted');
      plot.hline(d, 'midline');
      plot.curve(x => a * base(b * (x - c)) + d, 'c-sin thick');
      const inner = (c === 0 ? 'x' : (c > 0 ? `x - ${piTex(c)}` : `x + ${piTex(-c)}`));
      const arg = b === 1 ? inner : (c === 0 ? `${fmt(b)}x` : `${fmt(b)}\\left(${inner}\\right)`);
      const pre = a === 1 ? '' : a === -1 ? '-' : fmt(a);
      const post = d === 0 ? '' : d > 0 ? ` + ${fmt(d)}` : ` - ${fmt(-d)}`;
      tex(eq, a === 0 ? `y = ${fmt(d)}` : `y = ${pre}\\${fn}\\left(${arg}\\right)${post}`, true);
      const rows = [
        ['Amplitude', fmt(Math.abs(a))],
        ['Period', piTex(2 * PI / b)],
        ['Phase shift', c === 0 ? '0' : piTex(Math.abs(c)) + (c > 0 ? '\\text{ right}' : '\\text{ left}')],
        ['Midline', 'y = ' + fmt(d)],
        ['Range', `[${fmt(d - Math.abs(a))},\\ ${fmt(d + Math.abs(a))}]`],
      ];
      facts.innerHTML = '';
      rows.forEach(([k, v]) => { const cell = h('div'); const dt = h('dt', null, k); const dd = h('dd'); tex(dd, v); cell.append(dt, dd); facts.appendChild(cell); });
    }
    draw();
  }

  /* ---------------------------------------------------- unit circle */
  const SIN_Q1 = { 0: '0', 30: '\\tfrac{1}{2}', 45: '\\tfrac{\\sqrt{2}}{2}', 60: '\\tfrac{\\sqrt{3}}{2}', 90: '1' };
  const TAN_Q1 = { 0: '0', 30: '\\tfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}' };
  function isSpecial(deg) { return deg % 30 === 0 || deg % 45 === 0; }
  function refAngle(deg) { const m = ((deg % 180) + 180) % 180; return m > 90 ? 180 - m : m; }
  function exact(deg, which) {
    const rad = deg * PI / 180;
    const ref = refAngle(deg);
    let mag, val;
    if (which === 'sin') { mag = SIN_Q1[ref]; val = Math.sin(rad); }
    else if (which === 'cos') { mag = SIN_Q1[90 - ref]; val = Math.cos(rad); }
    else {
      if (Math.abs(Math.cos(rad)) < 1e-9) return '\\text{undefined}';
      mag = TAN_Q1[ref]; val = Math.tan(rad);
    }
    if (mag === '0') return '0';
    return (val < 0 ? '-' : '') + mag;
  }
  function radTex(deg) {
    if (deg === 0) return '0';
    const g = gcd(deg, 180), n = deg / g, d = 180 / g;
    const top = (n === 1 ? '' : n) + '\\pi';
    return d === 1 ? top : `\\frac{${top}}{${d}}`;
  }

  function unitCircle(host, opts) {
    opts = opts || {};
    const W = 760, H = 340, cx = 170, cy = 170, r = 130, wx0 = 350, ww = 390;
    const box = h('figure', { class: 'unit-circle' + (opts.hero ? ' is-hero' : '') });
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'uc-svg', role: 'img', 'aria-label': 'Unit circle with sine wave' }, box);
    const read = h('div', { class: 'uc-readout', 'aria-live': 'polite' });
    box.appendChild(read);
    host.appendChild(box);

    // static layer
    const g0 = svgEl('g', { class: 'grid' }, svg);
    svgEl('line', { x1: cx - r - 24, x2: cx + r + 24, y1: cy, y2: cy, class: 'axis' }, g0);
    svgEl('line', { x1: cx, x2: cx, y1: cy - r - 24, y2: cy + r + 24, class: 'axis' }, g0);
    svgEl('circle', { cx, cy, r, class: 'uc-ring' }, g0);
    for (let d = 0; d < 360; d += 15) {
      if (!isSpecial(d)) continue;
      const a = d * PI / 180;
      svgEl('circle', { cx: cx + r * Math.cos(a), cy: cy - r * Math.sin(a), r: 2.5, class: 'uc-tick' }, g0);
    }
    // wave axes
    svgEl('line', { x1: wx0, x2: wx0 + ww + 10, y1: cy, y2: cy, class: 'axis' }, g0);
    svgEl('line', { x1: wx0, x2: wx0, y1: cy - r - 10, y2: cy + r + 10, class: 'axis' }, g0);
    [[1, '1'], [-1, '−1']].forEach(([v, s]) => {
      svgEl('line', { x1: wx0, x2: wx0 + ww, y1: cy - v * r, y2: cy - v * r, class: 'gridline' }, g0);
      const t = svgEl('text', { x: wx0 - 6, y: cy - v * r + 4, class: 'ticklabel', 'text-anchor': 'end' }, g0); t.textContent = s;
    });
    ['π/2', 'π', '3π/2', '2π'].forEach((s, i) => {
      const x = wx0 + ww * (i + 1) / 4;
      svgEl('line', { x1: x, x2: x, y1: cy - r, y2: cy + r, class: 'gridline' }, g0);
      const t = svgEl('text', { x, y: cy + r + 22, class: 'ticklabel', 'text-anchor': 'middle' }, g0); t.textContent = s;
    });
    let wd = '';
    for (let i = 0; i <= 200; i++) { const t = 2 * PI * i / 200; wd += (i ? 'L' : 'M') + (wx0 + ww * i / 200).toFixed(1) + ' ' + (cy - r * Math.sin(t)).toFixed(1); }
    svgEl('path', { d: wd, class: 'curve muted' }, g0);

    // dynamic layer
    const g = svgEl('g', {}, svg);
    const arc = svgEl('path', { class: 'uc-arc' }, g);
    const radius = svgEl('line', { class: 'uc-radius' }, g);
    const cosSeg = svgEl('line', { class: 'uc-cos' }, g);
    const sinSeg = svgEl('line', { class: 'uc-sin' }, g);
    const link = svgEl('line', { class: 'uc-link' }, g);
    const trace = svgEl('path', { class: 'curve c-sin thick' }, g);
    const wavePt = svgEl('circle', { r: 6, class: 'pt-sin' }, g);
    const handle = svgEl('circle', { r: 11, class: 'uc-handle', tabindex: 0, role: 'slider', 'aria-label': 'Angle', 'aria-valuemin': 0, 'aria-valuemax': 360 }, g);

    let theta = 0, interacted = false;

    function set(rad) {
      theta = ((rad % (2 * PI)) + 2 * PI) % (2 * PI);
      let deg = theta * 180 / PI;
      const near = Math.round(deg / 15) * 15;
      const snapped = Math.abs(deg - near) < 4 && isSpecial(near % 360);
      if (snapped) { deg = near % 360; theta = deg * PI / 180; }
      const px = cx + r * Math.cos(theta), py = cy - r * Math.sin(theta);
      const large = theta > PI ? 1 : 0;
      arc.setAttribute('d', theta < 1e-6 ? '' : `M ${cx + 34} ${cy} A 34 34 0 ${large} 0 ${cx + 34 * Math.cos(theta)} ${cy - 34 * Math.sin(theta)}`);
      Object.entries({ x1: cx, y1: cy, x2: px, y2: py }).forEach(([k, v]) => radius.setAttribute(k, v));
      Object.entries({ x1: cx, y1: cy, x2: px, y2: cy }).forEach(([k, v]) => cosSeg.setAttribute(k, v));
      Object.entries({ x1: px, y1: cy, x2: px, y2: py }).forEach(([k, v]) => sinSeg.setAttribute(k, v));
      const wxp = wx0 + ww * theta / (2 * PI);
      Object.entries({ x1: px, y1: py, x2: wxp, y2: py }).forEach(([k, v]) => link.setAttribute(k, v));
      let td = '';
      const n = Math.max(2, Math.ceil(120 * theta / (2 * PI)));
      for (let i = 0; i <= n; i++) { const t = theta * i / n; td += (i ? 'L' : 'M') + (wx0 + ww * t / (2 * PI)).toFixed(1) + ' ' + (cy - r * Math.sin(t)).toFixed(1); }
      trace.setAttribute('d', td);
      wavePt.setAttribute('cx', wxp); wavePt.setAttribute('cy', py);
      handle.setAttribute('cx', px); handle.setAttribute('cy', py);
      handle.setAttribute('aria-valuenow', Math.round(deg));
      handle.setAttribute('aria-valuetext', Math.round(deg) + ' degrees');
      readout(deg, snapped || Math.abs(deg - Math.round(deg)) < 1e-9 && isSpecial(Math.round(deg)));
    }

    function readout(deg, isExact) {
      const d = Math.round(deg);
      const rows = isExact ? [
        ['\\theta', `${d}^\\circ = ${radTex(d)}`, ''],
        ['\\cos\\theta', exact(d, 'cos'), 'c-cos'],
        ['\\sin\\theta', exact(d, 'sin'), 'c-sin'],
        ['\\tan\\theta', exact(d, 'tan'), ''],
      ] : [
        ['\\theta', `${fmt(deg)}^\\circ \\approx ${fmt(theta)}`, ''],
        ['\\cos\\theta', '\\approx ' + fmt(Math.cos(theta)), 'c-cos'],
        ['\\sin\\theta', '\\approx ' + fmt(Math.sin(theta)), 'c-sin'],
        ['\\tan\\theta', Math.abs(Math.cos(theta)) < 1e-9 ? '\\text{undefined}' : '\\approx ' + fmt(Math.tan(theta)), ''],
      ];
      read.innerHTML = '';
      rows.forEach(([k, v, cls]) => {
        const cell = h('div', { class: 'uc-cell ' + cls });
        const kk = h('span', { class: 'uc-k' }); tex(kk, k);
        const vv = h('span', { class: 'uc-v' }); tex(vv, v);
        cell.append(kk, vv); read.appendChild(cell);
      });
      if (!isExact) read.appendChild(h('p', { class: 'uc-hint' }, 'Drag near a dot on the circle to snap to a special angle and see exact values.'));
    }

    function toSvg(evt) {
      const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function fromPointer(evt) {
      const p = toSvg(evt);
      if (p.x > wx0 && p.x <= wx0 + ww + 5) set(Math.min(1, (p.x - wx0) / ww) * 2 * PI * 0.99999);
      else set(Math.atan2(cy - p.y, p.x - cx));
    }
    let dragging = false;
    svg.addEventListener('pointerdown', e => { interacted = true; dragging = true; svg.setPointerCapture(e.pointerId); fromPointer(e); e.preventDefault(); });
    svg.addEventListener('pointermove', e => { if (dragging) fromPointer(e); });
    svg.addEventListener('pointerup', () => { dragging = false; });
    svg.addEventListener('pointercancel', () => { dragging = false; });
    handle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 1 : 15;
      let deg = Math.round(theta * 180 / PI);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') deg += step;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') deg -= step;
      else return;
      interacted = true; e.preventDefault();
      set(deg * PI / 180);
    });

    const end = PI / 3;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (opts.animate && !reduce) {
      const total = 2 * PI + end, dur = 3600; let t0 = null;
      const step = ts => {
        if (interacted || !box.isConnected) return;
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = total * eased;
        // during the sweep show raw values; land exactly on pi/3
        if (p < 1) set(v > 2 * PI - 1e-6 && v < 2 * PI + 1e-6 ? 2 * PI - 1e-6 : v); else set(end);
        if (p < 1) requestAnimationFrame(step);
      };
      set(0.0001);
      requestAnimationFrame(step);
    } else {
      set(end);
    }
  }

  window.Graphs = {
    mount(host, spec) {
      switch (spec.type) {
        case 'transform': return transformExplorer(host);
        case 'rational': return rationalPlot(host);
        case 'explog': return expLogExplorer(host);
        case 'trig': return trigExplorer(host);
        case 'unitcircle': return unitCircle(host, {});
      }
    },
    unitCircle,
  };
})();
