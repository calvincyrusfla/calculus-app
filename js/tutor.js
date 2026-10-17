/* Tutor chat: a panel that sends questions (plus the problem on screen) to /api/tutor. */
(function () {
  const ENDPOINT = '/api/tutor';
  const view = document.getElementById('view');
  let messages = [];      // { role, content }
  let context = '';       // problem text sent with every request
  let contextLabel = '';
  let mode = 'normal';    // 'hint' while a Blitz attempt is unsubmitted
  let busy = false;

  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function renderMath(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
    }
  }

  /* Light formatting for replies: paragraphs, "- " and "1. " lists, **bold**. Math is left for KaTeX. */
  function format(text) {
    const blocks = esc(text).split(/\n{2,}/);
    return blocks.map(block => {
      const lines = block.split('\n');
      if (lines.every(l => /^\s*[-*] /.test(l))) return '<ul>' + lines.map(l => `<li>${l.replace(/^\s*[-*] /, '')}</li>`).join('') + '</ul>';
      if (lines.every(l => /^\s*\d+[.)] /.test(l))) return '<ol>' + lines.map(l => `<li>${l.replace(/^\s*\d+[.)] /, '')}</li>`).join('') + '</ol>';
      return `<p>${lines.join('<br>')}</p>`;
    }).join('').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  /* ------------------------------------------------------------ panel */
  const launcher = h('button', { type: 'button', class: 'tutor-launch', 'aria-controls': 'tutor-panel', 'aria-expanded': 'false' },
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/></svg><span>Ask the tutor</span>');
  const panel = h('aside', { id: 'tutor-panel', class: 'tutor', 'aria-label': 'Tutor chat', hidden: '' });
  panel.innerHTML = `
    <header class="tutor-head">
      <div><h2>Tutor</h2><p>Ask about any step, or show your work and I'll check it.</p></div>
      <button type="button" class="tutor-icon" data-act="new" title="Start a new chat" aria-label="Start a new chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
      <button type="button" class="tutor-icon" data-act="close" title="Close" aria-label="Close tutor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="tutor-context" hidden></div>
    <div class="tutor-log" aria-live="polite"></div>
    <form class="tutor-form">
      <label class="sr-only" for="tutor-input">Your question</label>
      <textarea id="tutor-input" rows="2" placeholder="Type your question. Use ^ for powers, like x^2."></textarea>
      <button type="submit" class="btn-small">Send</button>
    </form>
    <p class="tutor-foot">AI tutor. It can make mistakes, so check its work.</p>`;
  document.body.append(launcher, panel);
  const log = panel.querySelector('.tutor-log');
  const ctxBox = panel.querySelector('.tutor-context');
  const input = panel.querySelector('textarea');
  const form = panel.querySelector('form');

  function open() {
    panel.hidden = false;
    document.body.classList.add('tutor-open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!messages.length) showStarters();
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    panel.hidden = true;
    document.body.classList.remove('tutor-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }
  launcher.addEventListener('click', () => {
    if (panel.hidden) { if (!messages.length) setPageContext(); open(); } else close();
  });
  panel.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'close') close();
    if (act.dataset.act === 'new') { reset(); setPageContext(); showStarters(); input.focus(); }
    if (act.dataset.act === 'clear-context') { context = ''; contextLabel = ''; mode = 'normal'; drawContext(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });

  function reset() { messages = []; log.innerHTML = ''; }

  function drawContext() {
    if (!contextLabel) { ctxBox.hidden = true; return; }
    ctxBox.hidden = false;
    ctxBox.innerHTML = `<span><strong>Looking at:</strong> ${esc(contextLabel)}${mode === 'hint' ? ' <em>(hints only until you submit)</em>' : ''}</span>
      <button type="button" data-act="clear-context" aria-label="Stop sharing this problem">Remove</button>`;
  }

  function showStarters() {
    if (messages.length) return;
    const ideas = context
      ? (mode === 'hint'
        ? ['Give me a hint to get started', 'What concept is this question testing?', 'Explain the method with different numbers']
        : ['Walk me through this step by step', 'Why does this step work?', 'Give me a hint, not the answer', 'Give me a similar problem to try'])
      : ['How do I find the domain of a function?', 'Explain the unit circle simply', 'When do I flip an inequality sign?', 'How do I solve a log equation?'];
    const wrap = h('div', { class: 'tutor-starters' });
    wrap.appendChild(h('p', null, context ? 'Try one of these, or type your own question:' : 'Ask anything from the course. Some ideas:'));
    ideas.forEach(t => {
      const b = h('button', { type: 'button' }, esc(t));
      b.addEventListener('click', () => send(t));
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
  }

  function addBubble(role, content, extraClass) {
    const starters = log.querySelector('.tutor-starters');
    if (starters) starters.remove();
    const b = h('div', { class: `tutor-msg ${role}${extraClass ? ' ' + extraClass : ''}` });
    b.innerHTML = role === 'assistant' ? format(content) : `<p>${esc(content).replace(/\n/g, '<br>')}</p>`;
    log.appendChild(b);
    renderMath(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  async function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    busy = true;
    form.querySelector('button').disabled = true;
    messages.push({ role: 'user', content: text });
    addBubble('user', text);
    input.value = '';
    const typing = h('div', { class: 'tutor-msg assistant typing', 'aria-label': 'Tutor is typing' }, '<span></span><span></span><span></span>');
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages, context, mode }),
      });
      let data = {};
      try { data = await res.json(); } catch (e) { /* not JSON */ }
      typing.remove();
      if (!res.ok || !data.reply) {
        messages.pop();
        let msg = data.error || 'The tutor could not answer right now. Try again in a moment.';
        if (data.error === 'not_configured') msg = 'The tutor is not set up yet. The site owner needs to add an ANTHROPIC_API_KEY environment variable in Netlify and redeploy.';
        else if (res.status === 404) msg = 'The tutor only works on the deployed Netlify site (or with "netlify dev" locally).';
        addBubble('assistant', msg, 'error');
      } else {
        messages.push({ role: 'assistant', content: data.reply });
        addBubble('assistant', data.reply);
      }
    } catch (e) {
      typing.remove();
      messages.pop();
      addBubble('assistant', 'The tutor could not be reached. Check your connection and try again.', 'error');
    } finally {
      busy = false;
      form.querySelector('button').disabled = false;
      input.focus();
    }
  }
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });

  /* ------------------------------------------------------------ context from the page */
  // Turn rendered content back into text, keeping math as LaTeX.
  function toText(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('.tutor-ask, button.btn-small, button.btn-quiet, .step-bar, .prep-actions, .bq-why a').forEach(e => e.remove());
    clone.querySelectorAll('.katex').forEach(k => {
      const ann = k.querySelector('annotation[encoding="application/x-tex"]');
      k.replaceWith(document.createTextNode(ann ? `$${ann.textContent}$` : k.textContent));
    });
    clone.querySelectorAll('svg').forEach(s => s.replaceWith(document.createTextNode('[graph shown on screen]')));
    clone.querySelectorAll('[hidden]').forEach(e => e.removeAttribute('hidden'));
    clone.querySelectorAll('p, li, div, label, h3, br, dd, dt').forEach(e => e.insertAdjacentText('beforebegin', '\n'));
    return clone.textContent.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
  }
  const pageTitle = () => { const t = view.querySelector('h1'); return t ? t.textContent.trim() : 'Course home'; };
  const crumb = () => { const c = view.querySelector('.crumb'); return c ? c.textContent.trim() + ': ' : ''; };

  function setPageContext() {
    mode = blitzActive() ? 'hint' : 'normal';
    contextLabel = pageTitle();
    context = `Page: ${crumb()}${contextLabel}`;
    drawContext();
  }
  const blitzActive = () => !!view.querySelector('.blitz-bar');

  function choicesText(el, sel) {
    const all = [...el.querySelectorAll(sel)];
    const graded = all.some(c => c.classList.contains('is-answer') || c.classList.contains('is-right'));
    const anyWrong = all.some(c => c.classList.contains('is-wrong') || c.classList.contains('is-picked-wrong'));
    return all.map((c, i) => {
      const input = c.querySelector('input');
      const correct = c.classList.contains('is-right') || c.classList.contains('is-answer');
      const chosen = c.classList.contains('is-right') || c.classList.contains('is-wrong') || c.classList.contains('is-picked-wrong') ||
        (input && input.checked) || (graded && !anyWrong && correct);
      const tags = [];
      if (chosen) tags.push('the student chose this');
      if (graded && correct) tags.push('correct answer');
      return `(${String.fromCharCode(65 + i)}) ${toText(c)}${tags.length ? '  <- ' + tags.join(', ') : ''}`;
    }).join('\n');
  }

  function describe(el) {
    const where = `${crumb()}${pageTitle()}`;
    if (el.classList.contains('example')) {
      const shown = [...el.querySelectorAll('.steps li')].filter(li => !li.hidden).length;
      return {
        label: `${el.querySelector('h3').textContent.trim()} (worked example)`, mode: 'normal',
        text: `${where}\nWorked example: ${toText(el.querySelector('h3'))}\nProblem: ${toText(el.querySelector('.problem'))}\nFull solution steps (the student has revealed ${shown} so far):\n${[...el.querySelectorAll('.steps li')].map((li, i) => `${i + 1}. ${toText(li)}`).join('\n')}`,
      };
    }
    if (el.classList.contains('q')) {
      const n = [...el.parentNode.children].indexOf(el) + 1;
      const why = el.querySelector('.q-why:not([hidden])');
      return {
        label: `Check question ${n}`, mode: 'normal',
        text: `${where}\nQuiz question: ${toText(el.querySelector('.q-prompt'))}\nChoices:\n${choicesText(el, '.choice')}${why ? `\nExplanation shown: ${toText(why)}` : '\n(The student has not answered yet.)'}`,
      };
    }
    if (el.classList.contains('bq')) {
      const head = el.querySelector('.bq-head').childNodes[0].textContent.trim();
      const active = blitzActive();
      const why = el.querySelector('.bq-why:not([hidden])');
      return {
        label: `${pageTitle().split(':')[0]}, ${head}`, mode: active ? 'hint' : 'normal',
        text: `${where}\n${head}: ${toText(el.querySelector('.bq-prompt'))}${el.querySelector('.bq-graph') ? '\n[A graph is shown with this question. You cannot see it; ask the student to describe it if you need details.]' : ''}\nChoices:\n${choicesText(el, '.bchoice')}${why ? `\nExplanation shown after grading: ${toText(why)}` : ''}`,
      };
    }
    if (el.classList.contains('practice')) {
      const topic = el.closest('.prep-topic');
      const why = el.querySelector('.bq-why:not([hidden])');
      return {
        label: `Practice: ${topic ? topic.querySelector('h3').childNodes[0].textContent.trim() : 'question'}`, mode: 'normal',
        text: `${where}\nPractice question: ${toText(el.querySelector('.bq-prompt'))}${el.querySelector('.bq-graph') ? '\n[A graph is shown with this question. You cannot see it; ask the student to describe it if you need details.]' : ''}\nChoices:\n${choicesText(el, '.bchoice')}${why ? `\nExplanation shown: ${toText(why)}` : '\n(The student has not answered yet.)'}`,
      };
    }
    return null;
  }

  function askAbout(el) {
    const d = describe(el);
    if (!d) return;
    reset();
    context = d.text;
    contextLabel = d.label;
    mode = d.mode;
    drawContext();
    open();
    showStarters();
  }

  /* Add "Ask the tutor" buttons to examples and questions as they appear. */
  const TARGETS = '.example, .quiz .q, .bq, .practice';
  function decorate() {
    if (mode === 'hint' && !blitzActive()) { mode = 'normal'; drawContext(); }
    view.querySelectorAll(TARGETS).forEach(el => {
      const existing = el.querySelector(':scope > .tutor-ask');
      const label = el.classList.contains('bq') && blitzActive() ? 'Get a hint' : 'Ask the tutor';
      if (existing) { if (existing.textContent !== label) existing.textContent = label; return; }
      const b = h('button', { type: 'button', class: 'tutor-ask' }, label);
      b.addEventListener('click', () => askAbout(el));
      el.appendChild(b);
    });
  }
  let pending = null;
  new MutationObserver(() => { if (!pending) pending = requestAnimationFrame(() => { pending = null; decorate(); }); })
    .observe(view, { childList: true, subtree: true });
  decorate();

  // A new page clears page-level context so it never points at the wrong page.
  window.addEventListener('hashchange', () => {
    if (!messages.length) { context = ''; contextLabel = ''; mode = 'normal'; drawContext(); }
  });
})();
