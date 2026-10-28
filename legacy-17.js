(() => {
  const panel = document.querySelector('#view-panel');
  const toggle = document.querySelector('#view-menu-toggle');
  const choice = document.querySelector('#cup-choice');
  const heading = document.createElement('div');
  heading.className = 'panel-heading';
  heading.innerHTML = '<h2>选择视角</h2><button id="view-panel-close" type="button" aria-label="收起视角菜单">×</button>';
  panel.prepend(heading);
  const overall = document.createElement('h3');
  overall.textContent = '整体视角'; overall.style.order = '-20'; panel.append(overall);
  const closeups = document.createElement('h3');
  closeups.textContent = '局部特写'; closeups.style.order = '0'; panel.append(closeups);
  const label = document.createElement('label');
  label.htmlFor = 'cup-choice'; label.textContent = '单独查看部件'; label.style.order = '20'; panel.append(label);
  function classify() {
    for (const button of panel.querySelectorAll(':scope > button')) {
      button.type = 'button';
      button.style.order = ['front','left','right','back'].includes(button.dataset.view) ? '-10' : '10';
    }
  }
  // Keep controls as direct nav children: older scene extensions still insert before the select.
  classify();
  new MutationObserver(classify).observe(panel, {childList: true});
  function setOpen(open, restoreFocus = false) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.querySelector(':scope > button')?.focus({preventScroll:true});
    } else if (restoreFocus) {
      toggle.focus({preventScroll:true});
    }
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  heading.querySelector('button').addEventListener('click', () => setOpen(false, true));
  // Existing handlers execute on the original controls, then the menu gets out of the way.
  panel.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button?.parentElement === panel || event.target.closest('a[download]')) setOpen(false, true);
  });
  choice.addEventListener('change', () => setOpen(false, true));
  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false, true); event.preventDefault();
    }
  });
  document.body.dataset.compactControls = 'true';
})();
