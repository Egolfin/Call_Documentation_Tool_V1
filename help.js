'use strict';
(() => {
  const button = document.getElementById('help-button');
  const dialog = document.getElementById('help-dialog');
  const close = document.getElementById('help-close');
  const content = document.getElementById('help-content');
  const done = document.getElementById('help-done');
  const focusStops = [close, content, done];

  button.addEventListener('click', () => {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.toggle('help-open', true);
    close.focus();
  });
  close.addEventListener('click', () => dialog.close());
  done.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.toggle('help-open', false);
    button.focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const active = document.activeElement;
    if (event.shiftKey && (active === close || !focusStops.includes(active))) {
      event.preventDefault();
      done.focus();
    } else if (!event.shiftKey && (active === done || !focusStops.includes(active))) {
      event.preventDefault();
      close.focus();
    }
  });
  // Keep the existing copy shortcut intact outside the modal. While reading
  // the guide, a shortcut must not copy or move focus into the inert form.
  document.addEventListener('keydown', event => {
    if (dialog.open && (event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
