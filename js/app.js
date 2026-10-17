/* App shell: routing, navigation, lessons, quizzes, progress. */
(function () {
  const { parts, lessons } = window.COURSE;
  const byId = Object.fromEntries(lessons.map(l => [l.id, l]));
  const view = document.getElementById('view');
  const nav = document.getElementById('lesson-nav');
  const STORE = 'precalc-progress-v1';

  /* ---------------------------------------------------------- progress */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { lessons: {} }; } catch (e) { return { lessons: {} }; }
  }
  let progress = load();
  function save() { try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch (e) { /* storage unavailable */ } }
  function isDone(id) { return !!(progress.lessons[id] && progress.lessons[id].done); }
  function doneCount() { return lessons.filter(l => isDone(l.id)).length; }
  function nextLesson() { return lessons.find(l => !isDone(l.id)) || null; }

  /* ---------------------------------------------------------- helpers */
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function renderMath(root) {
    if (window.renderMathInElement) {
      renderMathInElement(root, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        throwOnError: false,
        ignoredClasses: ['katex'],
      });
    }
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const partOf = id => parts.find(p => p.id === id);
  const partIndex = id => parts.findIndex(p => p.id === id) + 1;

  /* ---------------------------------------------------------- sidebar */
  function renderNav(activeId) {
    const done = doneCount();
    nav.innerHTML = '';
    const meter = h('div', { class: 'meter' });
    meter.append(
      h('p', { class: 'meter-label' }, `<strong>${done}</strong> of ${lessons.length} lessons complete`),
      h('div', { class: 'meter-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': lessons.length, 'aria-valuenow': done }, `<span style="width:${(done / lessons.length) * 100}%"></span>`)
    );
    nav.appendChild(meter);
    const bl = h('section', { class: 'nav-part nav-extra nav-blitz' });
    bl.appendChild(h('h2', null, '<a href="#/blitz">Blitz sessions</a>'));
    bl.appendChild(h('ul', null, Blitz.list.map(b => {
      const rec = progress.blitz && progress.blitz[b.id];
      const act = activeId === 'blitz-' + b.id ? 'is-active' : '';
      const prep = Prep.has(b.id)
        ? `<li class="nav-prep ${activeId === 'prep-' + b.id ? 'is-active' : ''}"><a href="#/prep/${b.id}">${b.title} prep plan<span class="nav-score">${prepDone(b.id)}/${Prep.count(b.id)}</span></a></li>`
        : '';
      return b.ready
        ? prep + `<li class="${act}"><a href="#/blitz/${b.id}">${b.title}${rec ? `<span class="nav-score">${Math.round(rec.best)}</span>` : ''}</a></li>`
        : `<li class="is-soon"><span>${b.title}<span class="nav-score">soon</span></span></li>`;
    }).join('')));
    nav.appendChild(bl);
    parts.forEach((p, pi) => {
      const sec = h('section', { class: 'nav-part' });
      sec.appendChild(h('h2', null, `Part ${pi + 1}: ${p.title}`));
      const ol = h('ol', { start: lessons.find(l => l.part === p.id).number });
      lessons.filter(l => l.part === p.id).forEach(l => {
        const li = h('li', { class: (isDone(l.id) ? 'is-done ' : '') + (l.id === activeId ? 'is-active' : '') });
        li.appendChild(h('a', { href: `#/lesson/${l.id}`, 'aria-current': l.id === activeId ? 'page' : null },
          `<span class="nav-num" aria-hidden="true">${isDone(l.id) ? '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>' : l.number}</span><span class="nav-title">${l.title}</span>${isDone(l.id) ? '<span class="sr-only">(complete)</span>' : ''}`));
        ol.appendChild(li);
      });
      sec.appendChild(ol);
      nav.appendChild(sec);
    });
    const extra = h('section', { class: 'nav-part nav-extra' });
    extra.appendChild(h('h2', null, 'Review'));
    extra.appendChild(h('ul', null,
      `<li class="${activeId === 'formulas' ? 'is-active' : ''}"><a href="#/formulas">Formula sheet</a></li>` +
      `<li class="${activeId === 'final' ? 'is-active' : ''}"><a href="#/final">Final check</a></li>`));
    nav.appendChild(extra);
  }

  /* ---------------------------------------------------------- quiz */
  function quiz(host, questions, opts) {
    opts = opts || {};
    const results = new Array(questions.length).fill(null);
    const list = h('ol', { class: 'quiz' });
    const summary = h('div', { class: 'quiz-summary', 'aria-live': 'polite' });
    questions.forEach((q, qi) => {
      const li = h('li', { class: 'q' });
      if (opts.tag) li.appendChild(h('p', { class: 'q-tag' }, opts.tag(q, qi)));
      li.appendChild(h('p', { class: 'q-prompt' }, q.q));
      const choices = h('div', { class: 'q-choices' });
      const why = h('div', { class: 'q-why', hidden: '' });
      shuffle(q.choices.map((c, i) => ({ c, i }))).forEach(({ c, i }) => {
        const b = h('button', { type: 'button', class: 'choice' }, c);
        b.addEventListener('click', () => {
          if (results[qi] !== null) return;
          const right = i === q.answer;
          results[qi] = right;
          choices.querySelectorAll('button').forEach(x => { x.disabled = true; });
          b.classList.add(right ? 'is-right' : 'is-wrong');
          if (!right) choices.querySelector('[data-correct="1"]').classList.add('is-answer');
          why.innerHTML = `<strong>${right ? 'Correct.' : 'Not quite.'}</strong> ${q.why}`;
          why.className = 'q-why ' + (right ? 'right' : 'wrong');
          why.hidden = false;
          renderMath(why);
          if (results.every(r => r !== null)) {
            const score = results.filter(Boolean).length;
            if (opts.onDone) opts.onDone(score, questions.length, results, summary);
          }
        });
        if (i === q.answer) b.dataset.correct = '1';
        choices.appendChild(b);
      });
      li.append(choices, why);
      list.appendChild(li);
    });
    host.append(list, summary);
  }

  /* ---------------------------------------------------------- views */
  function home() {
    const next = nextLesson();
    const done = doneCount();
    const wrap = h('div', { class: 'home' });

    const hero = h('section', { class: 'hero' });
    const copy = h('div', { class: 'hero-copy' });
    copy.innerHTML = `
      <h1 tabindex="-1">Pre-calculus, start to finish</h1>
      <p class="lede">A crash course in the algebra and trigonometry that college calculus expects you to know. Fifteen short lessons, each with worked examples you reveal one step at a time and a quick check at the end.</p>`;
    const actions = h('div', { class: 'hero-actions' });
    if (done === 0) actions.appendChild(h('a', { class: 'btn', href: '#/lesson/' + lessons[0].id }, 'Start lesson 1'));
    else if (next) actions.appendChild(h('a', { class: 'btn', href: '#/lesson/' + next.id }, `Continue with lesson ${next.number}`));
    else actions.appendChild(h('a', { class: 'btn', href: '#/final' }, 'Take the final check'));
    actions.appendChild(h('a', { class: 'btn-quiet', href: '#/formulas' }, 'Open the formula sheet'));
    copy.appendChild(actions);
    const fig = h('div', { class: 'hero-figure' });
    hero.append(copy, fig);
    wrap.appendChild(hero);
    Graphs.unitCircle(fig, { hero: true, animate: true });
    fig.appendChild(h('p', { class: 'hero-note' }, 'Drag the point around the circle. <span class="c-cos">Cosine</span> is how far across it is, <span class="c-sin">sine</span> is how far up. Unroll the height and you get the sine wave.'));

    const how = h('section', { class: 'how' });
    how.innerHTML = `
      <h2>How each lesson works</h2>
      <ol class="how-steps">
        <li><h3>Read the idea</h3><p>A short explanation with the rules you need, and the mistakes to avoid.</p></li>
        <li><h3>Work the examples</h3><p>Reveal each step yourself. Try to predict it before you click.</p></li>
        <li><h3>Check yourself</h3><p>Three questions with explanations. Answer them all to mark the lesson complete.</p></li>
      </ol>`;
    wrap.appendChild(how);

    const blz = h('section', { class: 'home-blitz' });
    blz.innerHTML = `<div><h2>Blitz sessions</h2><p>Full practice quizzes that mirror a real class quiz: 21 questions, 100 points, no hints until you submit, and new numbers every attempt.</p></div>`;
    const blzList = h('div', { class: 'home-blitz-list' });
    Blitz.list.forEach(b => {
      const rec = progress.blitz && progress.blitz[b.id];
      blzList.appendChild(b.ready
        ? h('a', { class: 'blitz-pill', href: `#/blitz/${b.id}` }, `<strong>${b.title}</strong><span>${rec ? `Best ${Math.round(rec.best)} / 100` : b.topic}</span>`)
        : h('div', { class: 'blitz-pill is-soon' }, `<strong>${b.title}</strong><span>Coming soon</span>`));
    });
    blz.appendChild(blzList);
    wrap.appendChild(blz);

    const map = h('section', { class: 'course-map' });
    map.appendChild(h('h2', null, 'The course'));
    parts.forEach((p, pi) => {
      const col = h('div', { class: 'map-part' });
      col.appendChild(h('h3', null, `Part ${pi + 1}: ${p.title}`));
      col.appendChild(h('p', null, p.blurb));
      const ol = h('ol', { start: lessons.find(l => l.part === p.id).number });
      lessons.filter(l => l.part === p.id).forEach(l => {
        ol.appendChild(h('li', { class: isDone(l.id) ? 'is-done' : '' }, `<a href="#/lesson/${l.id}">${l.title}</a><span class="mins">${l.minutes} min</span>`));
      });
      col.appendChild(ol);
      map.appendChild(col);
    });
    wrap.appendChild(map);
    return wrap;
  }

  function lessonView(l) {
    const i = l.number - 1;
    const prev = lessons[i - 1], next = lessons[i + 1];
    const art = h('article', { class: 'lesson' });
    art.appendChild(h('p', { class: 'crumb' }, `Part ${partIndex(l.part)}: ${partOf(l.part).title}`));
    art.appendChild(h('h1', { tabindex: '-1' }, l.title));
    art.appendChild(h('p', { class: 'meta' }, `Lesson ${l.number} of ${lessons.length}, about ${l.minutes} minutes${isDone(l.id) ? ', <span class="done-flag">complete</span>' : ''}`));
    art.appendChild(h('p', { class: 'lede' }, l.summary));
    art.appendChild(h('div', { class: 'prose' }, l.body));

    if (l.interactive) {
      const sec = h('section', { class: 'try' });
      sec.appendChild(h('h2', null, 'Try it'));
      art.appendChild(sec);
      Graphs.mount(sec, l.interactive);
    }

    const ex = h('section', { class: 'examples' });
    ex.appendChild(h('h2', null, l.examples.length > 1 ? 'Worked examples' : 'Worked example'));
    l.examples.forEach((e) => {
      const card = h('div', { class: 'example' });
      card.appendChild(h('h3', null, e.title));
      card.appendChild(h('p', { class: 'problem' }, e.problem));
      const ol = h('ol', { class: 'steps' });
      e.steps.forEach((s, si) => ol.appendChild(h('li', { hidden: si === 0 ? null : '' }, s)));
      card.appendChild(ol);
      const bar = h('div', { class: 'step-bar' });
      const nextBtn = h('button', { type: 'button', class: 'btn-small' }, 'Show next step');
      const allBtn = h('button', { type: 'button', class: 'btn-quiet' }, 'Show all steps');
      const count = h('span', { class: 'step-count' });
      bar.append(nextBtn, allBtn, count);
      card.appendChild(bar);
      let shown = 1;
      const update = () => {
        [...ol.children].forEach((li, k) => { li.hidden = k >= shown; });
        count.textContent = `Step ${shown} of ${e.steps.length}`;
        if (shown >= e.steps.length) { nextBtn.hidden = true; allBtn.hidden = true; count.textContent = 'All steps shown'; }
      };
      nextBtn.addEventListener('click', () => { shown++; update(); ol.children[shown - 1].classList.add('just-shown'); });
      allBtn.addEventListener('click', () => { shown = e.steps.length; update(); });
      update();
      ex.appendChild(card);
    });
    art.appendChild(ex);

    const take = h('section', { class: 'takeaways' });
    take.appendChild(h('h2', null, 'Remember'));
    take.appendChild(h('ul', null, l.takeaways.map(t => `<li>${t}</li>`).join('')));
    art.appendChild(take);

    const check = h('section', { class: 'check' });
    check.appendChild(h('h2', null, 'Check yourself'));
    const prevBest = progress.lessons[l.id];
    if (prevBest && prevBest.done) check.appendChild(h('p', { class: 'muted' }, `Best score so far: ${prevBest.best} of ${l.quiz.length}.`));
    quiz(check, l.quiz, {
      onDone(score, total, results, summary) {
        const rec = progress.lessons[l.id] || {};
        progress.lessons[l.id] = { done: true, best: Math.max(score, rec.best || 0) };
        save();
        renderNav(l.id);
        const msg = score === total ? 'All correct. This lesson is complete.' : `${score} of ${total} correct. This lesson is marked complete; read the explanations above for the ones you missed.`;
        summary.innerHTML = `<p><strong>${msg}</strong></p>`;
        const row = h('div', { class: 'summary-actions' });
        if (next) row.appendChild(h('a', { class: 'btn', href: '#/lesson/' + next.id }, `Go to lesson ${next.number}: ${next.title}`));
        else row.appendChild(h('a', { class: 'btn', href: '#/final' }, 'Take the final check'));
        const again = h('button', { type: 'button', class: 'btn-quiet' }, 'Retry these questions');
        again.addEventListener('click', () => route(true));
        row.appendChild(again);
        summary.appendChild(row);
      },
    });
    art.appendChild(check);

    const pager = h('nav', { class: 'pager', 'aria-label': 'Lesson navigation' });
    pager.innerHTML =
      (prev ? `<a class="pager-prev" href="#/lesson/${prev.id}"><span>Previous</span>${prev.number}. ${prev.title}</a>` : '<span></span>') +
      (next ? `<a class="pager-next" href="#/lesson/${next.id}"><span>Next</span>${next.number}. ${next.title}</a>` : `<a class="pager-next" href="#/final"><span>Next</span>Final check</a>`);
    art.appendChild(pager);
    return art;
  }

  function formulas() {
    const art = h('article', { class: 'lesson formulas' });
    art.appendChild(h('h1', { tabindex: '-1' }, 'Formula sheet'));
    art.appendChild(h('p', { class: 'lede' }, 'The key rules from every lesson on one page. Print it or keep it open while you practice.'));
    const printBtn = h('button', { type: 'button', class: 'btn-quiet no-print' }, 'Print this page');
    printBtn.addEventListener('click', () => window.print());
    art.appendChild(printBtn);
    parts.forEach((p, pi) => {
      const sec = h('section', { class: 'sheet-part' });
      sec.appendChild(h('h2', null, `Part ${pi + 1}: ${p.title}`));
      lessons.filter(l => l.part === p.id).forEach(l => {
        const block = h('div', { class: 'sheet-block' });
        block.appendChild(h('h3', null, `<a href="#/lesson/${l.id}">${l.number}. ${l.title}</a>`));
        block.appendChild(h('ul', null, l.takeaways.map(t => `<li>${t}</li>`).join('')));
        sec.appendChild(block);
      });
      art.appendChild(sec);
    });
    return art;
  }

  function finalCheck() {
    const art = h('article', { class: 'lesson final' });
    art.appendChild(h('h1', { tabindex: '-1' }, 'Final check'));
    art.appendChild(h('p', { class: 'lede' }, `One question from each of the ${lessons.length} lessons, picked at random. Questions you miss link back to the lesson to review.`));
    const picked = lessons.map(l => Object.assign({ lesson: l }, l.quiz[Math.floor(Math.random() * l.quiz.length)]));
    const sec = h('section', { class: 'check' });
    quiz(sec, picked, {
      tag: q => `Lesson ${q.lesson.number}: ${q.lesson.title}`,
      onDone(score, total, results, summary) {
        const missed = picked.filter((q, i) => !results[i]).map(q => q.lesson);
        let html = `<p><strong>You scored ${score} of ${total}.</strong> `;
        html += missed.length ? 'Review these lessons, then try again:</p>' : 'Every topic checks out. You are ready for calculus.</p>';
        summary.innerHTML = html;
        if (missed.length) summary.appendChild(h('ul', { class: 'missed' }, missed.map(l => `<li><a href="#/lesson/${l.id}">${l.number}. ${l.title}</a></li>`).join('')));
        const again = h('button', { type: 'button', class: 'btn' }, 'New set of questions');
        again.addEventListener('click', () => route(true));
        summary.appendChild(again);
        progress.final = Math.max(score, progress.final || 0); save();
      },
    });
    art.appendChild(sec);
    return art;
  }

  function notFound() {
    const art = h('article', { class: 'lesson' });
    art.innerHTML = '<h1 tabindex="-1">That page does not exist</h1><p class="lede">The link may be out of date. <a href="#/">Go to the course home</a> to pick a lesson.</p>';
    return art;
  }

  function prepDone(id) {
    const rec = progress.prep && progress.prep[id];
    return rec ? Object.values(rec).filter(Boolean).length : 0;
  }
  const prepApi = {
    renderMath,
    lessonTitle: id => (byId[id] ? `Lesson ${byId[id].number}, ${byId[id].title}` : 'the lessons'),
    isDone: (id, i) => !!(progress.prep && progress.prep[id] && progress.prep[id][i]),
    setDone: (id, i, v) => { progress.prep = progress.prep || {}; progress.prep[id] = progress.prep[id] || {}; progress.prep[id][i] = v; save(); },
    blitzRecord: id => (progress.blitz && progress.blitz[id]) || null,
    onChange: () => renderNav('prep-' + location.hash.split('/')[2]),
  };
  const blitzApi = {
    renderMath,
    lessonTitle: id => (byId[id] ? `Lesson ${byId[id].number}, ${byId[id].title}` : 'the lessons'),
    getRecord: id => (progress.blitz && progress.blitz[id]) || null,
    saveRecord: (id, rec) => { progress.blitz = progress.blitz || {}; progress.blitz[id] = rec; save(); },
    onChange: () => { const hash = location.hash.replace(/^#\/?/, '').split('/'); renderNav(hash[0] === 'blitz' && hash[1] ? 'blitz-' + hash[1] : 'blitz'); },
  };

  /* ---------------------------------------------------------- router */
  function route(keepScroll) {
    const hash = location.hash.replace(/^#\/?/, '');
    const [kind, id] = hash.split('/');
    let node, active = null, title = 'Pre-calculus crash course';
    if (!kind) node = home();
    else if (kind === 'lesson' && byId[id]) { node = lessonView(byId[id]); active = id; title = `${byId[id].title} | Pre-calculus crash course`; }
    else if (kind === 'formulas') { node = formulas(); active = 'formulas'; title = 'Formula sheet | Pre-calculus crash course'; }
    else if (kind === 'blitz' && !id) { node = Blitz.indexView(blitzApi); active = 'blitz'; title = 'Blitz sessions | Pre-calculus crash course'; }
    else if (kind === 'blitz' && Blitz.get(id)) { node = Blitz.blitzView(Blitz.get(id), blitzApi); active = 'blitz-' + id; title = `${Blitz.get(id).title} | Pre-calculus crash course`; }
    else if (kind === 'prep' && Prep.has(id)) { node = Prep.view(id, prepApi); active = 'prep-' + id; title = `${Prep.plans[id].title} | Pre-calculus crash course`; }
    else if (kind === 'final') { node = finalCheck(); active = 'final'; title = 'Final check | Pre-calculus crash course'; }
    else node = notFound();
    view.innerHTML = '';
    view.appendChild(node);
    renderMath(view);
    renderNav(active);
    document.title = title;
    document.body.classList.remove('nav-open');
    document.getElementById('menu-btn').setAttribute('aria-expanded', 'false');
    if (keepScroll !== true) window.scrollTo(0, 0);
    const h1 = view.querySelector('h1');
    if (h1 && kind) h1.focus({ preventScroll: true });
  }

  document.getElementById('menu-btn').addEventListener('click', e => {
    const open = document.body.classList.toggle('nav-open');
    e.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.getElementById('scrim').addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    document.getElementById('menu-btn').setAttribute('aria-expanded', 'false');
  });
  window.addEventListener('hashchange', route);
  route();
})();
