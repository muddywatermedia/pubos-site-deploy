/**
 * PubOS Modal Engine — m.js
 * Drop-in engagement overlay for any site.
 * Usage: <script src="https://modals.pubos.ai/m.js"></script>
 * Trigger: ?modal=quiz|zip|pick|gate|age|spin
 *
 * Pixel chain:
 *   Click 1 (trxclk): fires on modal load (page view = rewarded action)
 *   Click 2 (conversion): fires on modal completion
 */
(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var modalType = params.get('modal');
  if (!modalType) return;

  var VALID = ['quiz', 'zip', 'pick', 'gate', 'age', 'spin'];
  if (VALID.indexOf(modalType) === -1) return;

  // =============================================
  // PIXEL INTEGRATION (delegates to PubOS platform if available)
  // =============================================
  function fireClick1() {
    if (window.PubOS && window.PubOS.fireClick1) {
      window.PubOS.fireClick1('modal-' + modalType);
    } else {
      console.log('[PUBOS] Click 1 — trxclk — modal loaded:', modalType);
    }
  }

  function fireConversion(data) {
    if (window.PubOS && window.PubOS.fireConversion) {
      window.PubOS.fireConversion('modal-' + modalType, data);
    } else {
      console.log('[PUBOS] Click 2 — CONVERSION — modal completed:', modalType, data);
    }
  }

  // =============================================
  // STYLES (prefixed with pm- to avoid conflicts)
  // =============================================
  var css = document.createElement('style');
  css.textContent = [
    '.pm-overlay{position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;opacity:1;transition:opacity .3s;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.pm-overlay.pm-out{opacity:0;pointer-events:none}',
    '.pm-sheet{background:#fff;width:100%;max-width:480px;max-height:92vh;border-radius:20px 20px 0 0;padding:1.5rem 1.25rem 2rem;overflow-y:auto;transform:translateY(0);transition:transform .35s cubic-bezier(.32,.72,0,1);-webkit-overflow-scrolling:touch;box-sizing:border-box}',
    '.pm-overlay.pm-out .pm-sheet{transform:translateY(100%)}',
    '.pm-handle{width:36px;height:4px;background:#e2e8f0;border-radius:4px;margin:0 auto 1.25rem}',
    '.pm-logo{text-align:center;margin-bottom:1.25rem}',
    '.pm-logo b{font-size:1.3rem;font-weight:800;letter-spacing:-.03em;color:#0f172a}',
    '.pm-logo b span{color:#2563eb}',
    '.pm-logo small{display:block;font-size:.7rem;color:#94a3b8;margin-top:.15rem;letter-spacing:.02em;font-weight:400}',
    '.pm-bar{height:3px;background:#e2e8f0;border-radius:3px;margin-bottom:1.5rem;overflow:hidden}',
    '.pm-bar-fill{height:100%;background:linear-gradient(90deg,#2563eb,#3b82f6);border-radius:3px;transition:width .4s;width:0%}',
    '.pm-step-n{font-size:.65rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem}',
    '.pm-h{font-size:1.15rem;font-weight:700;letter-spacing:-.02em;line-height:1.3;margin-bottom:.3rem;color:#0f172a}',
    '.pm-p{font-size:.82rem;color:#475569;line-height:1.5;margin-bottom:1.25rem}',
    '.pm-opts{display:flex;flex-direction:column;gap:.6rem;list-style:none;margin:0;padding:0}',
    '.pm-opt{display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s;text-align:left;font-size:.88rem;font-weight:500;color:#0f172a;width:100%;-webkit-tap-highlight-color:transparent;font-family:inherit;box-sizing:border-box}',
    '.pm-opt:active{transform:scale(.98)}',
    '.pm-opt.pm-sel{border-color:#2563eb;background:rgba(37,99,235,.06);box-shadow:0 0 0 3px rgba(37,99,235,.12)}',
    '.pm-ic{width:36px;height:36px;border-radius:10px;background:rgba(37,99,235,.06);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}',
    '.pm-lb{flex:1}',
    '.pm-lb small{display:block;font-size:.72rem;color:#94a3b8;font-weight:400;margin-top:.1rem}',
    '.pm-rd{width:18px;height:18px;border-radius:50%;border:2px solid #e2e8f0;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}',
    '.pm-opt.pm-sel .pm-rd{border-color:#2563eb}',
    '.pm-rd::after{content:"";width:9px;height:9px;border-radius:50%;background:#2563eb;transform:scale(0);transition:transform .15s}',
    '.pm-opt.pm-sel .pm-rd::after{transform:scale(1)}',
    '.pm-cb{display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s;font-size:.88rem;font-weight:500;color:#0f172a;width:100%;-webkit-tap-highlight-color:transparent;font-family:inherit;box-sizing:border-box}',
    '.pm-cb.pm-sel{border-color:#2563eb;background:rgba(37,99,235,.06);box-shadow:0 0 0 3px rgba(37,99,235,.12)}',
    '.pm-ck{width:20px;height:20px;border-radius:6px;border:2px solid #e2e8f0;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;font-size:.7rem;color:transparent}',
    '.pm-cb.pm-sel .pm-ck{border-color:#2563eb;background:#2563eb;color:#fff}',
    '.pm-btn{display:block;width:100%;padding:.85rem;margin-top:1.25rem;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;opacity:.35;pointer-events:none;-webkit-tap-highlight-color:transparent;box-sizing:border-box}',
    '.pm-btn.pm-go{opacity:1;pointer-events:auto}',
    '.pm-btn.pm-go:active{transform:scale(.98)}',
    '.pm-input{width:100%;padding:.85rem 1rem;border:2px solid #e2e8f0;border-radius:12px;font-size:1rem;font-family:inherit;outline:none;transition:border-color .15s;box-sizing:border-box;text-align:center;letter-spacing:.15em;font-weight:600}',
    '.pm-input:focus{border-color:#2563eb}',
    '.pm-input::placeholder{letter-spacing:normal;font-weight:400;color:#94a3b8}',
    '.pm-loading{display:none;text-align:center;padding:2.5rem .5rem}',
    '.pm-loading.pm-show{display:block}',
    '.pm-spinner{width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:#2563eb;border-radius:50%;animation:pm-spin .7s linear infinite;margin:0 auto 1.25rem}',
    '@keyframes pm-spin{to{transform:rotate(360deg)}}',
    '.pm-loading h3{font-size:1rem;font-weight:700;margin-bottom:.2rem;color:#0f172a}',
    '.pm-loading p{font-size:.82rem;color:#475569}',
    '.pm-step{display:none}',
    '.pm-step.pm-on{display:block}',
    '.pm-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.6rem;list-style:none;margin:0;padding:0}',
    '.pm-wheel-wrap{position:relative;width:260px;height:260px;margin:0 auto 1.25rem}',
    '.pm-wheel{width:100%;height:100%;border-radius:50%;transition:transform 4s cubic-bezier(.17,.67,.12,.99)}',
    '.pm-wheel-ptr{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:24px solid #2563eb;z-index:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}',
    '.pm-result{text-align:center;padding:1rem 0}',
    '.pm-result h3{font-size:1.1rem;font-weight:700;color:#0f172a;margin-bottom:.25rem}',
    '.pm-result p{font-size:.85rem;color:#475569}',
    '@media(min-width:640px){.pm-sheet{border-radius:20px;margin-bottom:2rem;max-height:85vh}.pm-overlay{align-items:center}.pm-overlay.pm-out .pm-sheet{transform:translateY(40px)}.pm-handle{display:none}}',
    '@media(min-width:1024px){.pm-sheet{padding:2rem;max-width:520px}}',
  ].join('\n');
  document.head.appendChild(css);

  // =============================================
  // HELPERS
  // =============================================
  var siteName = window.location.hostname.replace(/^www\./, '');
  var siteLabel = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function makeOverlay() {
    var ov = el('div', 'pm-overlay');
    var sh = el('div', 'pm-sheet');
    sh.innerHTML = '<div class="pm-handle"></div>';
    ov.appendChild(sh);
    return { overlay: ov, sheet: sh };
  }

  function makeLogo(sub) {
    return '<div class="pm-logo"><b>' + siteLabel.split('.').map(function (p, i) { return i === 0 ? p : '<span>.' + p + '</span>'; }).join('') + '</b><small>' + (sub || 'Personalized for you') + '</small></div>';
  }

  function makeBar() {
    return '<div class="pm-bar"><div class="pm-bar-fill" id="pmBar"></div></div>';
  }

  function makeBtn(id, text) {
    return '<button class="pm-btn" id="' + id + '">' + text + '</button>';
  }

  function makeLoading(h, p) {
    return '<div class="pm-loading" id="pmLoading"><div class="pm-spinner"></div><h3>' + h + '</h3><p>' + p + '</p></div>';
  }

  function dismiss(ov) {
    ov.classList.add('pm-out');
    setTimeout(function () { ov.style.display = 'none'; }, 400);
  }

  function activateBtn(id) {
    var b = document.getElementById(id);
    if (b) b.classList.add('pm-go');
  }

  function deactivateBtn(id) {
    var b = document.getElementById(id);
    if (b) b.classList.remove('pm-go');
  }

  // =============================================
  // MODAL: QUIZ — QUERY BUILDER
  // Builds a search query from user answers + page context,
  // then redirects to a configurable SERP URL.
  // =============================================

  // --- CONFIG: Set your destination SERP URL ---
  // Use {query} as placeholder for the constructed search query.
  // Override via: window.PubOS.searchUrl = 'https://your-serp.com/search?q={query}'
  var SEARCH_URL = (window.PubOS && window.PubOS.searchUrl)
    || params.get('serp')
    || 'https://www.google.com/search?q={query}';
  // Examples:
  // 'https://search.yahoo.com/search?p={query}'
  // 'https://www.bing.com/search?q={query}'
  // 'https://feed.system1.com/search?q={query}&segment=pubos'

  // --- Extract page topic from meta/title ---
  function getPageTopic() {
    // Try meta keywords first
    var metaKw = document.querySelector('meta[name="keywords"]');
    if (metaKw && metaKw.content) return metaKw.content.split(',')[0].trim();
    // Try og:title
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && ogTitle.content) return ogTitle.content.replace(/\s*[|\-–—].*/g, '').trim();
    // Fall back to page title, strip site name
    var title = document.title.replace(/\s*[|\-–—].*$/g, '').trim();
    // Remove common filler words for cleaner query
    return title.replace(/^(the|a|an|how to|guide to|top \d+)\s+/i, '').trim() || 'best results';
  }

  function buildQuiz() {
    var layout = makeOverlay();
    var answers = {};
    var step = 1;
    var pageTopic = getPageTopic();

    // Q1: Category — maps to intent modifier on the page topic
    // Q2: Buyer stage — qualifies intent (researching vs ready)
    // Q3: Search modifier — "near me", "best price", etc.
    var steps = [
      {
        n: 'Step 1 of 3', h: 'What are you looking for?', p: 'We\'ll find the best results for you.',
        key: 'category',
        opts: [
          { v: 'buy',      qmod: 'buy',            ic: '🛒', l: 'Shopping & Deals', s: 'Products, prices, coupons' },
          { v: 'services', qmod: 'services',        ic: '🔧', l: 'Services & Providers', s: 'Local pros, quotes, appointments' },
          { v: 'learn',    qmod: 'guide',           ic: '📚', l: 'Information & Research', s: 'Answers, how-tos, comparisons' },
          { v: 'watch',    qmod: 'streaming watch', ic: '🎬', l: 'Entertainment & Media', s: 'Streaming, games, events, tickets' },
        ]
      },
      {
        n: 'Step 2 of 3', h: 'Where are you in the process?', p: 'Helps us tailor your results.',
        key: 'stage',
        opts: [
          { v: 'researching', qmod: '',          ic: '🔍', l: 'Just starting', s: 'Learning about my options' },
          { v: 'comparing',   qmod: 'compare',   ic: '⚖️', l: 'Comparing options', s: 'Narrowing down choices' },
          { v: 'ready',       qmod: 'best',      ic: '✅', l: 'Ready to decide', s: 'I know what I need' },
          { v: 'switching',   qmod: 'switch to',  ic: '🔄', l: 'Switching / upgrading', s: 'Looking for something better' },
        ]
      },
      {
        n: 'Step 3 of 3', h: 'What matters most?', p: 'We\'ll rank your results based on this.',
        key: 'modifier',
        opts: [
          { v: 'price',   qmod: 'best price',  ic: '💰', l: 'Best price', s: 'Cheapest options first' },
          { v: 'quality', qmod: 'top rated',    ic: '⭐', l: 'Top rated', s: 'Quality over price' },
          { v: 'nearby',  qmod: 'near me',      ic: '📍', l: 'Nearest to me', s: 'Local results, close by' },
          { v: 'popular', qmod: 'most popular',  ic: '🔥', l: 'Most popular', s: 'What everyone else picks' },
        ]
      }
    ];

    var html = makeLogo('Find what you\'re looking for') + makeBar();

    steps.forEach(function (s, i) {
      var sn = i + 1;
      html += '<div class="pm-step' + (sn === 1 ? ' pm-on' : '') + '" id="pmS' + sn + '">';
      html += '<div class="pm-step-n">' + s.n + '</div>';
      html += '<div class="pm-h">' + s.h + '</div>';
      html += '<div class="pm-p">' + s.p + '</div>';
      html += '<div class="pm-opts" data-step="' + sn + '">';
      s.opts.forEach(function (o) {
        html += '<button class="pm-opt" data-value="' + o.v + '" data-qmod="' + o.qmod + '"><div class="pm-ic">' + o.ic + '</div><div class="pm-lb">' + o.l + '<small>' + o.s + '</small></div><div class="pm-rd"></div></button>';
      });
      html += '</div>';
      html += makeBtn('pmN' + sn, sn < 3 ? 'Continue →' : 'See My Results →');
      html += '</div>';
    });

    html += makeLoading('Building your personalized search...', 'Finding the best matches for you');
    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    // Bind options
    layout.overlay.querySelectorAll('.pm-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sn = btn.closest('.pm-opts').dataset.step;
        btn.closest('.pm-opts').querySelectorAll('.pm-opt').forEach(function (b) { b.classList.remove('pm-sel'); });
        btn.classList.add('pm-sel');
        answers['q' + sn] = btn.dataset.value;
        answers['qmod' + sn] = btn.dataset.qmod;
        activateBtn('pmN' + sn);
      });
    });

    function goTo(s) {
      document.getElementById('pmS' + step).classList.remove('pm-on');
      document.getElementById('pmS' + s).classList.add('pm-on');
      step = s;
      document.getElementById('pmBar').style.width = ((s - 1) / 3 * 100) + '%';
    }

    // --- Build the search query from answers ---
    function buildQuery() {
      var parts = [];
      // Q3 modifier first (e.g., "best price", "near me", "top rated")
      if (answers.qmod3) parts.push(answers.qmod3);
      // Page topic is the core query
      parts.push(pageTopic);
      // Q1 category intent (e.g., "buy", "services", "guide")
      if (answers.qmod1) parts.push(answers.qmod1);
      // Q2 stage modifier (e.g., "compare", "best", "switch to") — only if non-empty
      if (answers.qmod2) parts.push(answers.qmod2);
      return parts.join(' ').replace(/\s+/g, ' ').trim();
    }

    document.getElementById('pmN1').addEventListener('click', function () { goTo(2); });
    document.getElementById('pmN2').addEventListener('click', function () { goTo(3); });
    document.getElementById('pmN3').addEventListener('click', function () {
      var query = buildQuery();
      var convData = {
        category: answers.q1,
        stage: answers.q2,
        modifier: answers.q3,
        query: query,
        pageTopic: pageTopic,
        redirectUrl: SEARCH_URL.replace('{query}', encodeURIComponent(query))
      };

      fireConversion(convData);
      document.getElementById('pmS3').classList.remove('pm-on');
      document.getElementById('pmLoading').classList.add('pm-show');
      document.getElementById('pmBar').style.width = '100%';

      // Redirect to SERP after brief loading animation
      var redirectUrl = SEARCH_URL.replace('{query}', encodeURIComponent(query));
      console.log('[PubOS] Query built: "' + query + '" → ' + redirectUrl);

      setTimeout(function () {
        window.location.href = redirectUrl;
      }, 1800);
    });

    return layout.overlay;
  }

  // =============================================
  // MODAL: ZIP CODE
  // =============================================
  function buildZip() {
    var layout = makeOverlay();
    var html = makeLogo('Local results near you') + makeBar();

    html += '<div class="pm-step pm-on" id="pmS1">';
    html += '<div class="pm-h">Enter your zip code</div>';
    html += '<div class="pm-p">We\'ll show you the best results in your area.</div>';
    html += '<input class="pm-input" id="pmZip" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="5" placeholder="e.g. 78738" autocomplete="postal-code">';
    html += makeBtn('pmN1', 'Find Local Results →');
    html += '</div>';
    html += makeLoading('Finding results near you...', 'Checking availability in your area');

    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    var input = document.getElementById('pmZip');
    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '');
      if (input.value.length === 5) activateBtn('pmN1');
      else deactivateBtn('pmN1');
    });

    document.getElementById('pmN1').addEventListener('click', function () {
      var zip = input.value;
      if (zip.length !== 5) return;
      fireConversion({ zip: zip });
      document.getElementById('pmS1').classList.remove('pm-on');
      document.getElementById('pmLoading').classList.add('pm-show');
      document.getElementById('pmBar').style.width = '100%';
      setTimeout(function () { dismiss(layout.overlay); }, 1600);
    });

    return layout.overlay;
  }

  // =============================================
  // MODAL: INTEREST PICKER (multi-select grid)
  // =============================================
  function buildPick() {
    var layout = makeOverlay();
    var selected = {};
    var topics = [
      { v: 'finance', ic: '💰', l: 'Finance' },
      { v: 'health', ic: '🏥', l: 'Health' },
      { v: 'travel', ic: '✈️', l: 'Travel' },
      { v: 'tech', ic: '💻', l: 'Technology' },
      { v: 'home', ic: '🏠', l: 'Home' },
      { v: 'auto', ic: '🚗', l: 'Auto' },
      { v: 'education', ic: '🎓', l: 'Education' },
      { v: 'food', ic: '🍽️', l: 'Food' },
    ];

    var html = makeLogo('Personalize your experience') + makeBar();
    html += '<div class="pm-step pm-on" id="pmS1">';
    html += '<div class="pm-h">Pick your interests</div>';
    html += '<div class="pm-p">Select 2 or more topics to personalize your results.</div>';
    html += '<div class="pm-grid">';
    topics.forEach(function (t) {
      html += '<button class="pm-cb" data-value="' + t.v + '"><div class="pm-ck">✓</div><div class="pm-ic">' + t.ic + '</div><div class="pm-lb">' + t.l + '</div></button>';
    });
    html += '</div>';
    html += makeBtn('pmN1', 'Show My Results →');
    html += '</div>';
    html += makeLoading('Personalizing your feed...', 'Curating content based on your interests');

    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    layout.overlay.querySelectorAll('.pm-cb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.dataset.value;
        if (selected[v]) { delete selected[v]; btn.classList.remove('pm-sel'); }
        else { selected[v] = true; btn.classList.add('pm-sel'); }
        if (Object.keys(selected).length >= 2) activateBtn('pmN1');
        else deactivateBtn('pmN1');
      });
    });

    document.getElementById('pmN1').addEventListener('click', function () {
      fireConversion({ interests: Object.keys(selected) });
      document.getElementById('pmS1').classList.remove('pm-on');
      document.getElementById('pmLoading').classList.add('pm-show');
      document.getElementById('pmBar').style.width = '100%';
      setTimeout(function () { dismiss(layout.overlay); }, 1600);
    });

    return layout.overlay;
  }

  // =============================================
  // MODAL: CONTENT GATE (single question)
  // =============================================
  function buildGate() {
    var layout = makeOverlay();
    var html = makeLogo('Quick question before you continue');

    html += '<div class="pm-step pm-on" id="pmS1">';
    html += '<div class="pm-h">How do you currently handle this?</div>';
    html += '<div class="pm-p">Your answer helps us show the most relevant information.</div>';
    html += '<div class="pm-opts">';
    html += '<button class="pm-opt" data-value="researching"><div class="pm-ic">🔍</div><div class="pm-lb">Still researching<small>Just learning about my options</small></div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="comparing"><div class="pm-ic">⚖️</div><div class="pm-lb">Comparing options<small>Narrowing down my choices</small></div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="ready"><div class="pm-ic">✅</div><div class="pm-lb">Ready to act<small>I know what I need</small></div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="existing"><div class="pm-ic">🔄</div><div class="pm-lb">Already have something<small>Looking to switch or upgrade</small></div><div class="pm-rd"></div></button>';
    html += '</div>';
    html += makeBtn('pmN1', 'Continue to Article →');
    html += '</div>';

    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    var answer = null;
    layout.overlay.querySelectorAll('.pm-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        layout.overlay.querySelectorAll('.pm-opt').forEach(function (b) { b.classList.remove('pm-sel'); });
        btn.classList.add('pm-sel');
        answer = btn.dataset.value;
        activateBtn('pmN1');
      });
    });

    document.getElementById('pmN1').addEventListener('click', function () {
      fireConversion({ intent: answer });
      dismiss(layout.overlay);
    });

    return layout.overlay;
  }

  // =============================================
  // MODAL: AGE VERIFICATION
  // =============================================
  function buildAge() {
    var layout = makeOverlay();
    var html = makeLogo('Verify to continue');

    html += '<div class="pm-step pm-on" id="pmS1">';
    html += '<div class="pm-h">What\'s your age range?</div>';
    html += '<div class="pm-p">Some content is tailored by age group. This helps us show you the right information.</div>';
    html += '<div class="pm-opts">';
    html += '<button class="pm-opt" data-value="18-24"><div class="pm-ic">🧑</div><div class="pm-lb">18 – 24</div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="25-34"><div class="pm-ic">👨</div><div class="pm-lb">25 – 34</div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="35-44"><div class="pm-ic">👨‍💼</div><div class="pm-lb">35 – 44</div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="45-54"><div class="pm-ic">👩‍💼</div><div class="pm-lb">45 – 54</div><div class="pm-rd"></div></button>';
    html += '<button class="pm-opt" data-value="55+"><div class="pm-ic">🧓</div><div class="pm-lb">55+</div><div class="pm-rd"></div></button>';
    html += '</div>';
    html += makeBtn('pmN1', 'Continue →');
    html += '</div>';

    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    var answer = null;
    layout.overlay.querySelectorAll('.pm-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        layout.overlay.querySelectorAll('.pm-opt').forEach(function (b) { b.classList.remove('pm-sel'); });
        btn.classList.add('pm-sel');
        answer = btn.dataset.value;
        activateBtn('pmN1');
      });
    });

    document.getElementById('pmN1').addEventListener('click', function () {
      fireConversion({ age: answer });
      dismiss(layout.overlay);
    });

    return layout.overlay;
  }

  // =============================================
  // MODAL: SPIN TO WIN
  // =============================================
  function buildSpin() {
    var layout = makeOverlay();
    var prizes = [
      { label: 'Premium Results', color: '#2563eb' },
      { label: 'Top 10 Picks', color: '#7c3aed' },
      { label: 'VIP Access', color: '#059669' },
      { label: 'Best Deals', color: '#d97706' },
      { label: 'Expert Picks', color: '#dc2626' },
      { label: 'Local Favorites', color: '#0891b2' },
    ];

    // Build SVG wheel
    var segments = prizes.length;
    var angle = 360 / segments;
    var svgParts = [];
    for (var i = 0; i < segments; i++) {
      var startAngle = (i * angle - 90) * Math.PI / 180;
      var endAngle = ((i + 1) * angle - 90) * Math.PI / 180;
      var x1 = 130 + 120 * Math.cos(startAngle);
      var y1 = 130 + 120 * Math.sin(startAngle);
      var x2 = 130 + 120 * Math.cos(endAngle);
      var y2 = 130 + 120 * Math.sin(endAngle);
      var largeArc = angle > 180 ? 1 : 0;
      svgParts.push('<path d="M130,130 L' + x1 + ',' + y1 + ' A120,120 0 ' + largeArc + ',1 ' + x2 + ',' + y2 + ' Z" fill="' + prizes[i].color + '"/>');
      // Label
      var midAngle = ((i + 0.5) * angle - 90) * Math.PI / 180;
      var tx = 130 + 75 * Math.cos(midAngle);
      var ty = 130 + 75 * Math.sin(midAngle);
      var rot = (i + 0.5) * angle;
      svgParts.push('<text x="' + tx + '" y="' + ty + '" fill="white" font-size="10" font-weight="600" text-anchor="middle" dominant-baseline="middle" transform="rotate(' + rot + ' ' + tx + ' ' + ty + ')">' + prizes[i].label + '</text>');
    }
    var svgWheel = '<svg viewBox="0 0 260 260" class="pm-wheel" id="pmWheel"><circle cx="130" cy="130" r="125" fill="#1e293b" />' + svgParts.join('') + '<circle cx="130" cy="130" r="18" fill="white"/></svg>';

    var html = makeLogo('Spin for your reward!');
    html += '<div class="pm-step pm-on" id="pmS1">';
    html += '<div class="pm-h" style="text-align:center">Tap to spin the wheel</div>';
    html += '<div class="pm-p" style="text-align:center">Every spin wins! See what you\'ll unlock.</div>';
    html += '<div class="pm-wheel-wrap"><div class="pm-wheel-ptr"></div>' + svgWheel + '</div>';
    html += makeBtn('pmN1', 'SPIN →');
    html += '</div>';
    html += '<div class="pm-step" id="pmS2">';
    html += '<div class="pm-result" id="pmResult"></div>';
    html += makeBtn('pmN2', 'Claim My Reward →');
    html += '</div>';

    layout.sheet.innerHTML += html;
    document.body.appendChild(layout.overlay);

    activateBtn('pmN1');

    var spun = false;
    document.getElementById('pmN1').addEventListener('click', function () {
      if (spun) return;
      spun = true;
      var winIndex = Math.floor(Math.random() * segments);
      var extraSpins = 5 + Math.floor(Math.random() * 3);
      var targetAngle = extraSpins * 360 + (360 - (winIndex + 0.5) * angle);
      var wheel = document.getElementById('pmWheel');
      wheel.style.transform = 'rotate(' + targetAngle + 'deg)';

      setTimeout(function () {
        document.getElementById('pmS1').classList.remove('pm-on');
        document.getElementById('pmS2').classList.add('pm-on');
        document.getElementById('pmResult').innerHTML = '<h3>🎉 You won: ' + prizes[winIndex].label + '!</h3><p>Tap below to see your personalized results.</p>';
        activateBtn('pmN2');
      }, 4200);
    });

    document.getElementById('pmN2').addEventListener('click', function () {
      fireConversion({ prize: prizes[Math.floor(Math.random() * segments)].label });
      dismiss(layout.overlay);
    });

    return layout.overlay;
  }

  // =============================================
  // INIT
  // =============================================
  var builders = {
    quiz: buildQuiz,
    zip: buildZip,
    pick: buildPick,
    gate: buildGate,
    age: buildAge,
    spin: buildSpin,
  };

  // Wait for DOM
  function init() {
    fireClick1();
    builders[modalType]();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
