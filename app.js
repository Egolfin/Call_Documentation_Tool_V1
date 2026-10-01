'use strict';
(() => {
  const guide = window.GUIDE;
  const form = document.getElementById('fields');
  const note = document.getElementById('note');
  const copy = document.getElementById('copy');
  const status = document.getElementById('status');
  const dialog = document.getElementById('reset-dialog');
  const special = 'If Not Achieved, What Stopped It?';
  const controls = [];
  const preview = document.getElementById('note-preview');
  const storageKey = 'call-documentation-draft-v2';
  const guideSignature = JSON.stringify(guide);
  let storageAvailable = true;
  function saveDraft() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        guideSignature,
        selections: controls.map(({select, input}) => ({value: select.value, explanation: input.value})),
        lastCopied
      }));
      storageAvailable = true;
    } catch (_) { storageAvailable = false; }
    document.getElementById('storage-status').textContent = storageAvailable
      ? 'Draft saved in this tab.' : 'Draft recovery unavailable. Keep this tab open.';
  }
  let lastCopied = null;
  let copying = false;
  if (!Array.isArray(guide) || !guide.length) {
    status.textContent = 'Guide could not be loaded. Check that guide.js is present.';
    return;
  }
  function update() {
    let count = 0;
    const lines = [];
    const fragments = document.createDocumentFragment();
    for (const control of controls) {
      const { group, select, section, other, input, help, hint, display, number, index } = control;
      const option = group.options[Number(select.value)];
      const selected = select.value !== '' && !!option;
      const needsOther = selected && group.field === special && option.response === 'Other:';
      other.hidden = !needsOther;
      input.required = needsOther;
      const valid = selected && (!needsOther || !!input.value.trim());
      section.classList.toggle('complete', valid);
      number.textContent = String(index + 1).padStart(2, '0');
      display.textContent = selected ? option.response : 'Select one response...';
      display.classList.toggle('placeholder', !selected);
      hint.hidden = !needsOther || !!input.value.trim();
      input.setAttribute('aria-invalid', String(needsOther && !input.value.trim()));
      help.textContent = selected ? (option.explanation || 'No additional guidance yet.') : 'Choose a response above to see when to use it.';
      if (valid) count++;
      if (selected) {
        const answer = needsOther ? 'Other: ' + input.value.trim() : option.response;
        lines.push(group.field + ': ' + answer);
        const line = document.createElement('div'); line.className = 'note-line';
        const title = document.createElement('span'); title.className = 'note-label'; title.textContent = group.field + ':';
        const response = document.createElement('span'); response.className = 'note-answer'; response.textContent = answer;
        line.append(title, response); fragments.append(line);
      }
    }
    note.value = lines.join('\n');
    if (!lines.length) {
      const empty = document.createElement('p'); empty.className = 'empty-preview';
      empty.textContent = 'Your selections will appear here.'; fragments.append(empty);
    }
    preview.replaceChildren(fragments);
    document.body.classList.toggle('ready', count === guide.length);
    document.getElementById('reset').disabled = copying;
    copy.disabled = count !== guide.length || copying;
    document.getElementById('progress').textContent = count + ' of ' + guide.length;
    document.getElementById('completion-ring').setAttribute('stroke-dashoffset', String(100 - count / guide.length * 100));
    const meter = document.getElementById('meter');
    meter.max = guide.length; meter.value = count;
    document.getElementById('readiness').textContent = count === guide.length ? 'Ready to copy. Review your note below.' : 'Complete every field to copy. Preview shows selected fields.';
  }
  for (const [index, group] of guide.entries()) {
    const section = document.createElement('div'); section.className = 'field';
    const label = document.createElement('label'); label.htmlFor = 'answer-' + index;
    const number = document.createElement('span'); number.className = 'number'; number.setAttribute('aria-hidden', 'true'); number.textContent = index + 1;
    label.append(number, document.createTextNode(group.field));
    const select = document.createElement('select'); select.id = label.htmlFor; select.required = true;
    select.add(new Option('Select one response...', ''));
    group.options.forEach((option, i) => select.add(new Option(option.response, String(i))));
    const selectWrap = document.createElement('div'); selectWrap.className = 'select-wrap';
    const display = document.createElement('span'); display.className = 'select-value'; display.setAttribute('aria-hidden', 'true');
    const chevron = document.createElement('span'); chevron.className = 'chevron'; chevron.textContent = '⌄'; chevron.setAttribute('aria-hidden', 'true');
    selectWrap.append(display, chevron, select);
    const guidance = document.createElement('div'); guidance.className = 'guidance';
    const guidanceHeading = document.createElement('div'); guidanceHeading.className = 'guidance-heading';
    const information = document.createElement('span'); information.className = 'guidance-icon'; information.textContent = 'ⓘ'; information.setAttribute('aria-hidden', 'true');
    guidanceHeading.append(information, document.createTextNode('When to use'));
    const help = document.createElement('p'); help.className = 'guidance-text'; help.id = 'guidance-' + index; select.setAttribute('aria-describedby', help.id);
    guidance.append(guidanceHeading, help);
    const other = document.createElement('div'); other.className = 'other'; other.hidden = true;
    const inputLabel = document.createElement('label'); inputLabel.textContent = 'Explain what happened'; inputLabel.htmlFor = 'other-' + index;
    const input = document.createElement('input'); input.id = inputLabel.htmlFor; input.placeholder = 'Enter your explanation';
    const hint = document.createElement('p'); hint.id = 'hint-' + index; hint.textContent = 'An explanation is required for Other:.'; input.setAttribute('aria-describedby', hint.id);
    other.append(inputLabel, input, hint);
    section.append(label, selectWrap, guidance);
    if (group.field === special) section.append(other);
    controls.push({group, select, section, other, input, help, hint, display, number, index});
    select.addEventListener('change', () => {
      if (group.field === special && group.options[Number(select.value)]?.response !== 'Other:') input.value = '';
      status.textContent = ''; note.hidden = true; update(); saveDraft();
      if (!other.hidden) input.focus();
    });
    input.addEventListener('input', () => { status.textContent = ''; note.hidden = true; update(); saveDraft(); });
    form.append(section);
  }
  form.addEventListener('submit', event => event.preventDefault());
  async function copyNote() {
    update(); if (copy.disabled) return;
    const text = note.value;
    copying = true; update();
    try {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        note.hidden = false; note.focus(); note.select();
        if (!document.execCommand('copy')) throw new Error('Manual copy required');
      }
      lastCopied = text;
      status.textContent = note.value === text ? 'Completed note copied.' : 'Previous note copied. Copy again to include your latest changes.';
    } catch (_) {
      note.hidden = false; note.focus(); note.select();
      status.textContent = 'Copy unavailable. Your note is selected. Press Ctrl / ⌘ + C to copy.';
    } finally { copying = false; update(); saveDraft(); }
  }
  function reset() {
    controls.forEach(({select, input}) => { select.value = ''; input.value = ''; });
    lastCopied = null; note.hidden = true; status.textContent = 'Ready for a new call.'; update(); saveDraft(); controls[0].select.focus();
  }
  copy.addEventListener('click', copyNote);
  document.getElementById('reset').addEventListener('click', () => {
    const dirty = controls.some(({select, input}) => select.value !== '' || input.value);
    if (dirty && (lastCopied === null || note.value !== lastCopied)) dialog.showModal(); else reset();
  });
  document.getElementById('cancel').addEventListener('click', () => dialog.close());
  document.getElementById('confirm').addEventListener('click', () => { dialog.close(); reset(); });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !dialog.open) { event.preventDefault(); copyNote(); }
  });
  window.addEventListener('beforeunload', event => {
    if (controls.some(({select}) => select.value !== '') && (lastCopied === null || note.value !== lastCopied)) { event.preventDefault(); event.returnValue = ''; }
  });
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (saved && saved.guideSignature === guideSignature && Array.isArray(saved.selections)) {
      controls.forEach((control, index) => {
        const item = saved.selections[index];
        if (!item || typeof item.value !== 'string') return;
        if (item.value !== '' && !/^(0|[1-9][0-9]*)$/.test(item.value)) return;
        if (item.value !== '' && !control.group.options[Number(item.value)]) return;
        control.select.value = item.value;
        if (control.group.field === special && control.group.options[Number(item.value)]?.response === 'Other:' && typeof item.explanation === 'string') control.input.value = item.explanation;
      });
      lastCopied = typeof saved.lastCopied === 'string' ? saved.lastCopied : null;
    }
  } catch (_) { storageAvailable = false; }
  update(); saveDraft();
})();
