import tools from './toolkit-assets.json';

// Embedded product logos also work in the saved, offline portfolio.
export function renderToolkit(svg) {
  return `<div class="aw-toolkit-heading"><span class="aw-eyebrow">A little behind the scenes</span><h3 id="aw-toolkit-title">My everyday toolkit.</h3><p>For design, video, and the insights behind the work.</p></div>
  <div class="aw-toolkit-groups">${['Design','Video','Data'].map((category,index)=>`
    <div class="aw-toolkit-group" data-category="${category.toLowerCase()}">
      <h4><span aria-hidden="true">0${index+1}</span>${{Design:'Design & create',Video:'Edit & tell stories',Data:'Analyze & understand'}[category]}</h4>
      <ul>${tools.filter(tool=>tool.category===category).map(tool=>`<li><span class="aw-tool-logo"><img src="${tool.logo}" alt="" width="36" height="36" decoding="async"></span><span data-no-translate>${tool.name}</span></li>`).join('')}</ul>
    </div>`).join('')}</div>
  <div class="aw-toolkit-footer"><button class="aw-primary" data-again>Make another cup ${svg('refresh')}</button><button class="aw-game-exit" data-finish>Back to café</button></div>`;
}
