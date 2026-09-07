(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var storageAvailable = true;
  function storageNotice() {
    storageAvailable = false;
    $('storageNotice').hidden = false;
    $('storageNotice').textContent = '当前查看器无法保存本地记录。仍可阅读、搜索和临时勾选，但关闭后可能丢失；请把重要事项另外保存。';
  }
  function get(key) { try { return localStorage.getItem(key); } catch (_) { storageNotice(); return null; } }
  function set(key, value) { try { localStorage.setItem(key, value); } catch (_) { storageNotice(); } }
  try { localStorage.setItem('parrot-storage-test', '1'); localStorage.removeItem('parrot-storage-test'); } catch (_) { storageNotice(); }
  var savedTheme = get('parrot-guide-theme');
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $('themeToggle').setAttribute('aria-pressed', String(theme === 'dark'));
    $('themeToggle').setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#12221c' : '#f4efe4';
  }
  applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : darkQuery && darkQuery.matches ? 'dark' : 'light');
  $('themeToggle').addEventListener('click', function () {
    savedTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(savedTheme); set('parrot-guide-theme', savedTheme);
  });
  if (darkQuery) {
    var followSystem = function (event) { if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light'); };
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', followSystem);
    else if (darkQuery.addListener) darkQuery.addListener(followSystem);
  }
  function measureHeader() { root.style.setProperty('--header-height', document.querySelector('.topbar').offsetHeight + 'px'); }
  measureHeader();
  if (window.ResizeObserver) new ResizeObserver(measureHeader).observe(document.querySelector('.topbar'));
  window.addEventListener('resize', measureHeader);

  var activeModal = null, lastFocused = null, savedScroll = 0;
  var pageSurfaces = [document.querySelector('.topbar'), document.querySelector('.layout'), document.querySelector('.bottom-nav')];
  function openModal(name, opener) {
    if (activeModal) closeModal(false);
    activeModal = $(name === 'search' ? 'searchModal' : 'tocModal');
    lastFocused = opener || document.activeElement;
    savedScroll = window.scrollY;
    activeModal.hidden = false;
    document.body.style.position = 'fixed'; document.body.style.top = -savedScroll + 'px'; document.body.style.width = '100%';
    pageSurfaces.forEach(function (el) { el.inert = true; el.setAttribute('aria-hidden', 'true'); });
    if (name === 'search') { $('searchInput').focus(); search(); }
    else activeModal.querySelector('[data-close]').focus();
  }
  function closeModal(restoreFocus) {
    if (!activeModal) return;
    activeModal.hidden = true; activeModal = null;
    pageSurfaces.forEach(function (el) { el.inert = false; el.removeAttribute('aria-hidden'); });
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    var oldBehavior = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollTo(0, savedScroll); root.style.scrollBehavior = oldBehavior;
    document.body.classList.remove('keyboard-open');
    if (restoreFocus !== false && lastFocused) lastFocused.focus({preventScroll:true});
  }
  document.querySelectorAll('[data-open]').forEach(function (button) {
    button.addEventListener('click', function () { openModal(button.dataset.open, button); });
  });
  document.querySelectorAll('[data-close]').forEach(function (button) { button.addEventListener('click', function () { closeModal(); }); });
  document.querySelectorAll('.modal').forEach(function (modal) { modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); }); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && activeModal) { event.preventDefault(); closeModal(); return; }
    if (event.key === '/' && !activeModal && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) && !event.target.isContentEditable) { event.preventDefault(); openModal('search'); }
    if (event.key === 'Tab' && activeModal) {
      var focusable = Array.from(activeModal.querySelectorAll('button,input,a[href],[tabindex="0"]')).filter(function (el) { return !el.disabled && el.getClientRects().length; });
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', function () {
    document.body.classList.toggle('keyboard-open', !!activeModal && window.visualViewport.height < window.innerHeight * .75);
    if (activeModal) activeModal.querySelector('.modal-sheet').style.maxHeight = Math.max(180, window.visualViewport.height - 32) + 'px';
  });
  function reveal(target) {
    var parent = target.closest('details');
    while (parent) { parent.open = true; parent = parent.parentElement.closest('details'); }
    if (target.tagName === 'DETAILS') target.open = true;
    if (target.classList.contains('anchor-target')) { var d = target.querySelector('details'); if (d) d.open = true; }
  }
  function jump(id, highlight) {
    var target = $(id); if (!target) return;
    closeModal(false); reveal(target);
    document.querySelectorAll('.search-hit').forEach(function (node) { node.classList.remove('search-hit'); });
    if (highlight) target.classList.add('search-hit');
    try { history.pushState(null, '', '#' + encodeURIComponent(id)); } catch (_) { location.hash = id; }
    var focusTarget = target.matches('.chapter') ? target.querySelector('h2') : target;
    focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus({preventScroll:true});
    target.scrollIntoView({block:'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }
  document.addEventListener('click', function (event) {
    var a = event.target.closest('a[href^="#"]');
    if (!a || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!$(id)) return;
    event.preventDefault(); jump(id, a.classList.contains('result-link'));
  });

  var searchNodes = Array.from(document.querySelectorAll('.chapter h3,.chapter summary,.chapter .detail-body li,.chapter .detail-body>p,.chapter .card li,.chapter .card p,.chapter .note p,.chapter .essentials li,.chapter .chapter-intro,.chapter dd,.chapter .check-item span,.chapter .zone,.chapter .flow p,.chapter .species-copy p'));
  var entries = searchNodes.map(function (node, i) {
    if (!node.id) node.id = 'search-item-' + i;
    var chapter = node.closest('.chapter'); var detail = node.closest('details');
    return {node:node, id:node.id, text:node.textContent.trim(), chapter:chapter.querySelector('h2').textContent, title:detail ? detail.querySelector('summary').textContent : chapter.querySelector('h2').textContent};
  });
  var aliases = [['小太阳','绿颊','绿颊锥尾','green cheek'],['虎皮','budgie','budgerigar'],['牛油果','鳄梨'],['腹泻','拉肚子'],['咬人','扑咬'],['颗粒','配方粮'],['不吃','拒食','不进食'],['瓜子','葵花籽'],['尾摆','喘','呼吸'],['奶粉','育雏配方']];
  function expandedTokens(query) {
    return query.toLowerCase().split(/\s+/).filter(Boolean).map(function (token) {
      var group = aliases.find(function (row) { return row.indexOf(token) !== -1; });
      return group ? group.concat([token]) : [token];
    });
  }
  function markedText(parent, text, words) {
    var parts = words.filter(Boolean).map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).sort(function (a,b) { return b.length - a.length; });
    if (!parts.length) { parent.textContent = text; return; }
    var regexp = new RegExp(parts.join('|'), 'gi'), last = 0, match;
    while ((match = regexp.exec(text)) !== null) {
      parent.appendChild(document.createTextNode(text.slice(last,match.index)));
      var mark = document.createElement('mark'); mark.textContent = match[0]; parent.appendChild(mark); last = match.index + match[0].length;
    }
    parent.appendChild(document.createTextNode(text.slice(last)));
  }
  function search() {
    var query = $('searchInput').value.trim().slice(0,100), results = $('searchResults'); results.replaceChildren();
    if (!query) { $('searchStatus').textContent = '输入关键词，定位具体步骤；不会隐藏其他章节。'; return; }
    var groups = expandedTokens(query), words = [].concat.apply([], groups);
    var matches = entries.filter(function (entry) { var text = entry.text.toLowerCase(); return groups.every(function (group) { return group.some(function (word) { return text.indexOf(word) !== -1; }); }); });
    $('searchStatus').textContent = matches.length ? '找到 ' + matches.length + ' 处，' + (matches.length > 60 ? '先显示前 60 处。可增加关键词缩小范围。' : '点击结果即可跳转并展开内容。') : '没有找到。试试较短的词，例如“换粮”“不吃”“脚”“离线”；急症请直接联系医院。';
    matches.slice(0,60).forEach(function (entry) {
      var li = document.createElement('li'), link = document.createElement('a'), location = document.createElement('span'), title = document.createElement('strong'), snippet = document.createElement('p');
      link.className = 'result-link'; link.href = '#' + entry.id; location.className = 'result-location'; location.textContent = entry.chapter;
      title.textContent = entry.title;
      var lower = entry.text.toLowerCase(); var positions = words.map(function (word) { return lower.indexOf(word); }).filter(function (i) { return i >= 0; });
      var start = Math.max(0, Math.min.apply(null,positions) - 32); var excerpt = (start ? '…' : '') + entry.text.slice(start,start+140) + (entry.text.length > start+140 ? '…' : '');
      markedText(snippet, excerpt, words); link.append(location,title,snippet); li.appendChild(link); results.appendChild(li);
    });
  }
  $('searchInput').addEventListener('input', search);
  $('searchInput').addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); $('searchInput').blur(); search(); } });
  $('searchClear').addEventListener('click', function () { $('searchInput').value = ''; search(); $('searchInput').focus(); });
  document.querySelectorAll('[data-query]').forEach(function (button) { button.addEventListener('click', function () { $('searchInput').value = button.dataset.query; search(); }); });

  function dateKey(date) { return date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0'); }
  function periods() { var now = new Date(), monday = new Date(now.getFullYear(),now.getMonth(),now.getDate()); monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7); return {daily:dateKey(now),weekly:dateKey(monday),prep:'always'}; }
  var currentPeriods = periods();
  var boxes = Array.from(document.querySelectorAll('input[data-check]'));
  var transientChecks = {};
  function checkKey(box) { return 'parrot-v2-check-' + currentPeriods[box.dataset.group] + '-' + box.dataset.check; }
  function updateMeters() {
    ['daily','weekly','prep'].forEach(function (group) {
      var groupBoxes = boxes.filter(function (box) { return box.dataset.group === group; });
      document.querySelector('[data-meter="' + group + '"]').textContent = groupBoxes.filter(function (box) { return box.checked; }).length + ' / ' + groupBoxes.length + ' 项完成';
      document.querySelector('[data-date="' + group + '"]').textContent = group === 'daily' ? currentPeriods.daily + ' · 本机日期' : group === 'weekly' ? currentPeriods.weekly + ' 起的一周' : '长期保留 · 不按日期重置';
    });
  }
  function loadChecks() { boxes.forEach(function (box) { box.checked = storageAvailable ? get(checkKey(box)) === '1' : !!transientChecks[checkKey(box)]; }); updateMeters(); }
  loadChecks();
  function refreshPeriods() { var next = periods(); if (next.daily !== currentPeriods.daily || next.weekly !== currentPeriods.weekly) { currentPeriods = next; loadChecks(); } }
  boxes.forEach(function (box) { box.addEventListener('change', function () { var wanted = box.checked; refreshPeriods(); box.checked = wanted; transientChecks[checkKey(box)] = wanted; set(checkKey(box),wanted?'1':'0'); updateMeters(); }); });
  document.querySelectorAll('[data-reset]').forEach(function (button) { button.addEventListener('click', function () {
    refreshPeriods(); var group = button.dataset.reset;
    if (!window.confirm('只重置' + (group==='daily'?'今日':group==='weekly'?'本周':'长期准备') + '清单的勾选？其他清单与日期不受影响。')) return;
    boxes.filter(function (box) { return box.dataset.group === group; }).forEach(function (box) { box.checked = false; transientChecks[checkKey(box)] = false; set(checkKey(box),'0'); }); updateMeters();
  }); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refreshPeriods(); });
  window.addEventListener('pageshow', refreshPeriods); window.addEventListener('focus', refreshPeriods); setInterval(refreshPeriods,60000);

  var chapters = Array.from(document.querySelectorAll('.chapter'));
  var resumeId = get('parrot-v2-reading');
  if (resumeId && chapters.some(function (s) { return s.id === resumeId; }) && !location.hash) {
    $('resumeCard').hidden = false; $('resumeLink').href = '#' + resumeId; $('resumeLink').textContent = '继续阅读：' + $(resumeId).querySelector('h2').textContent.split('：')[0];
  }
  $('dismissResume').addEventListener('click', function () { $('resumeCard').hidden = true; });
  var framePending = false, lastChapter = '';
  function onScroll() {
    framePending = false; if (activeModal) return;
    var max = root.scrollHeight - window.innerHeight;
    $('progressBar').style.width = Math.max(0,Math.min(100,max > 0 ? window.scrollY/max*100 : 0)) + '%';
    var current = ''; chapters.forEach(function (chapter) { if (chapter.getBoundingClientRect().top <= document.querySelector('.topbar').offsetHeight+70) current = chapter.id; });
    document.querySelectorAll('.toc-list a').forEach(function (a) { if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
    $('currentChapter').textContent = current ? $(current).querySelector('h2').textContent.split('：')[0] : '虎皮 · 小太阳';
    if (current && current !== lastChapter) { lastChapter = current; set('parrot-v2-reading',current); }
  }
  window.addEventListener('scroll', function () { if (!framePending) { framePending=true; requestAnimationFrame(onScroll); } }, {passive:true}); onScroll();
  function handleHash() { var target; try { target = $(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; } if (target) { reveal(target); requestAnimationFrame(function () { target.scrollIntoView(); }); } }
  window.addEventListener('hashchange',handleHash); if (location.hash) handleHash();

  var allExpanded = false, printState = null;
  function detailsList() { return Array.from(document.querySelectorAll('main details')); }
  $('expandAll').addEventListener('click',function () { allExpanded = !allExpanded; detailsList().forEach(function (d) { d.open=allExpanded; }); $('expandAll').textContent=allExpanded?'收起全部详细内容':'展开全部详细内容'; });
  function beforePrint() { if (printState) return; printState=detailsList().map(function (d) { return [d,d.open]; }); printState.forEach(function (row) { row[0].open=true; }); }
  function afterPrint() { if (!printState) return; printState.forEach(function (row) { row[0].open=row[1]; }); printState=null; }
  window.addEventListener('beforeprint',beforePrint); window.addEventListener('afterprint',afterPrint);
  $('printButton').addEventListener('click',function () { beforePrint(); window.print(); });
  $('downloadGuide').addEventListener('click',function () {
    try {
      var clone = document.documentElement.cloneNode(true);
      clone.removeAttribute('data-theme'); clone.removeAttribute('style');
      clone.querySelector('body').removeAttribute('style'); clone.querySelector('body').classList.remove('keyboard-open');
      clone.querySelectorAll('[inert]').forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
      clone.querySelectorAll('.modal,#resumeCard,#toast,#storageNotice').forEach(function (el) { el.hidden=true; });
      clone.querySelectorAll('details').forEach(function (d) { d.removeAttribute('open'); });
      clone.querySelectorAll('.search-hit').forEach(function (el) { el.classList.remove('search-hit'); });
      clone.querySelectorAll('input').forEach(function (el) { el.removeAttribute('checked'); el.removeAttribute('value'); });
      clone.querySelectorAll('[aria-current]').forEach(function (el) { el.removeAttribute('aria-current'); });
      clone.querySelectorAll('[data-meter]').forEach(function (el) { var group = el.closest('.check-group'); el.textContent = '0 / ' + group.querySelectorAll('input').length + ' 项完成'; });
      clone.querySelectorAll('[data-date]').forEach(function (el) { el.textContent=''; });
      clone.querySelector('#searchResults').replaceChildren(); clone.querySelector('#downloadStatus').textContent=''; clone.querySelector('#progressBar').style.width='0'; clone.querySelector('#currentChapter').textContent='虎皮 · 小太阳';
      var blob = new Blob(['<!doctype html>\n' + clone.outerHTML],{type:'text/html;charset=utf-8'});
      var url = URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download='鹦鹉饲养指南-新手图解离线版.html'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); },60000);
      $('downloadStatus').textContent='已请求浏览器下载完整 HTML。若微信没有弹出保存，请从右上角菜单用系统浏览器打开再下载，或在电脑保存。';
    } catch (_) { $('downloadStatus').textContent='当前查看器不支持直接下载。请用系统浏览器打开在线页面，或在电脑保存完整 HTML；也可打印为静态 PDF。'; }
  });
})();
