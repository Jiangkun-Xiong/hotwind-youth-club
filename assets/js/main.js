/* Shared interactions. Text: content/*.json. Images: media.js. Layout: styles.css. */
(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const media = window.HOTWIND_MEDIA_RULES.normalise(window.HOTWIND_MEDIA);
  let lang = 'en', activeKey = '', returnFocus = null;
  const menu = $('#navigation'), menuButton = $('#menu-toggle'), dialog = $('#lightbox');
  try { const stored=localStorage.getItem('jx-language'); if(stored==='zh'||stored==='en') lang=stored; } catch (_) {}
  function textFor(value) { return value?.[lang] || value?.en || ''; }
  function escapeHtml(s) { return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  const safeImagePath = window.HOTWIND_MEDIA_RULES.safeImagePath;
  function hydrateImages() {
    $$('[data-photo]').forEach(img=>{
      const m=media[img.dataset.photo]; if(!m||!safeImagePath(m.src)) return;
      const source=img.hasAttribute('data-thumb')&&m.thumb?m.thumb:m.src;
      if(safeImagePath(source)&&img.getAttribute('src')!==source)img.src=source;
      img.alt=textFor(m.alt); img.style.objectPosition=m.position||'center';
      if(img.closest('.gallery-open')) img.style.objectFit=m.fit||'cover';
    });
    $$('[data-caption]').forEach(el=>{ const m=media[el.dataset.caption]; if(m)el.textContent=textFor(m.caption); });
  }
  function galleryHTML(key,m) {
    const src=safeImagePath(m.src)?m.src:''; if(!src)return '';
    const thumb=safeImagePath(m.thumb)?m.thumb:src;
    return `<article class="gallery-card" data-category="${escapeHtml(m.category)}"><a class="gallery-open" href="${src}" data-lightbox="${escapeHtml(key)}"><div class="img-box"><img src="${thumb}" width="${Number(m.width)||1600}" height="${Number(m.height)||1200}" alt="${escapeHtml(textFor(m.alt))}" data-photo="${escapeHtml(key)}" data-thumb loading="lazy" style="object-fit:${m.fit==='contain'?'contain':'cover'};object-position:${escapeHtml(m.position||'center')}"></div><div class="gallery-info"><span data-caption="${escapeHtml(key)}">${escapeHtml(textFor(m.caption))}</span><small data-en="View full image ↗" data-zh="查看完整图片 ↗">${lang==='zh'?'查看完整图片 ↗':'View full image ↗'}</small></div></a></article>`;
  }
  function renderMedia() {
    const archive=$('[data-archive]');
    if(archive)archive.innerHTML=Object.entries(media).filter(([,m])=>m.gallery).map(([key,m])=>galleryHTML(key,m)).join('');
    $$('[data-group-gallery]').forEach(section=>{
      const entries=Object.entries(media).filter(([,m])=>m.group===section.dataset.groupGallery);
      section.hidden=!entries.length;
      $('.gallery-grid',section).innerHTML=entries.map(([key,m])=>galleryHTML(key,m)).join('');
    });
    $$('[data-cover]').forEach(cover=>{
      const record=Object.entries(media).find(([,m])=>m.group===cover.dataset.cover&&m.featured&&safeImagePath(m.src));
      if(!record)return;
      const [key,m]=record, img=document.createElement('img');
      img.src=m.thumb||m.src;img.alt=textFor(m.alt);img.loading='lazy';img.width=m.width;img.height=m.height;
      img.className='art-photo';img.style.objectFit=m.fit||'cover';img.style.objectPosition=m.position||'center';
      img.dataset.photo=key;img.setAttribute('data-thumb','');
      cover.replaceChildren(img);cover.classList.add('has-photo');
    });
    $$('[data-featured-photo]').forEach(container=>{
      const group=container.dataset.featuredPhoto;
      const candidate=Object.entries(media).find(([,m])=>m.group===group&&m.category==='community'&&!m.featured);
      container.hidden=!candidate;
      if(candidate){const [key,m]=candidate;container.innerHTML=`<a href="${m.src}" data-lightbox="${key}"><img src="${m.src}" alt="${escapeHtml(textFor(m.alt))}" loading="lazy" width="${m.width}" height="${m.height}" data-photo="${key}"></a><p class="caption" data-caption="${key}">${escapeHtml(textFor(m.caption))}</p>`;}
    });
  }
  function filter(root) {
    const choice=$('.filter[aria-pressed="true"]',root)?.dataset.filter||'all';
    let count=0;
    $$('[data-filter-list] > [data-category]',root).forEach(card=>{
      const show=choice==='all'||card.dataset.category===choice;
      card.hidden=!show;if(show)count++;
    });
    const status=$('[data-result-count]',root);
    if(status)status.textContent=lang==='zh'?`显示 ${count} 项`:`${count} ${count===1?'item':'items'} shown`;
  }
  function closeMenu(focus=false) {
    const wasOpen=menu?.classList.contains('open');
    menu?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');
    if(focus&&wasOpen)menuButton.focus();
  }
  function setLanguage(next) {
    lang=next;document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    $$('[data-en][data-zh]').forEach(el=>{el.textContent=el.dataset[lang];});
    $$('[data-aria-en][data-aria-zh]').forEach(el=>el.setAttribute('aria-label',lang==='zh'?el.dataset.ariaZh:el.dataset.ariaEn));
    const toggle=$('#language-toggle');toggle.textContent=lang==='zh'?'EN':'中文';
    toggle.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
    menuButton.setAttribute('aria-label',lang==='zh'?'打开导航':'Open navigation');
    dialog?.querySelector('#photo-close')?.setAttribute('aria-label',lang==='zh'?'关闭图片':'Close image');
    $('#photo-prev')?.setAttribute('aria-label',lang==='zh'?'上一张图片':'Previous image');
    $('#photo-next')?.setAttribute('aria-label',lang==='zh'?'下一张图片':'Next image');
    document.title=(lang==='zh'?document.body.dataset.titleZh:document.body.dataset.titleEn)+' | Hotwind Youth Club';
    hydrateImages();$$('[data-filter-root]').forEach(filter);
    if(activeKey&&dialog?.open)showPhoto(activeKey,false);
    try { localStorage.setItem('jx-language',lang); } catch (_) {}
  }
  function availableKeys() {
    const keys=$$('[data-lightbox]').filter(el=>!el.closest('[hidden]')).map(el=>el.dataset.lightbox);
    return [...new Set(keys.length?keys:Object.keys(media))];
  }
  function showPhoto(key,open=true) {
    const m=media[key];if(!m||!safeImagePath(m.src)||!dialog?.showModal)return;
    activeKey=key;$('#lightbox-image').src=m.src;$('#lightbox-image').alt=textFor(m.alt);
    $('#lightbox-caption').textContent=textFor(m.caption);
    if(open&&!dialog.open){returnFocus=document.activeElement;dialog.showModal();$('#photo-close').focus();}
  }
  function movePhoto(direction){const keys=availableKeys();const i=keys.indexOf(activeKey);if(keys.length)showPhoto(keys[(i+direction+keys.length)%keys.length],false);}
  function closePhoto(){dialog?.close();returnFocus?.focus();activeKey='';}
  renderMedia();setLanguage(lang);
  $('#language-toggle').addEventListener('click',()=>setLanguage(lang==='en'?'zh':'en'));
  menuButton.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));});
  menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  $$('[data-filter-root]').forEach(root=>$$('.filter',root).forEach(button=>button.addEventListener('click',()=>{
    $$('.filter',root).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter(root);
  })));
  document.addEventListener('click',e=>{
    if(!e.target.closest('.site-header'))closeMenu();
    const anchor=e.target.closest('[data-lightbox]');
    if(anchor&&dialog?.showModal&&media[anchor.dataset.lightbox]){e.preventDefault();showPhoto(anchor.dataset.lightbox);}
  });
  $('#photo-close')?.addEventListener('click',closePhoto);
  $('#photo-prev')?.addEventListener('click',()=>movePhoto(-1));
  $('#photo-next')?.addEventListener('click',()=>movePhoto(1));
  dialog?.addEventListener('click',e=>{if(e.target===dialog)closePhoto();});
  dialog?.addEventListener('cancel',()=>{activeKey='';});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu(true);
    if(dialog?.open&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();movePhoto(e.key==='ArrowRight'?1:-1);}
  });
  window.matchMedia('(min-width:781px)').addEventListener?.('change',e=>{if(e.matches)closeMenu();});
})();
