/**
 * PubOS Platform Loader — p.js
 * Universal entry point for all PubOS tools across the publisher network.
 *
 * Usage:
 *   <script src="https://cdn.jsdelivr.net/gh/muddywatermedia/pubos-site-deploy@main/p.js" data-pubos="searching-net"></script>
 *
 * What it does:
 *   - Reads site ID from data-pubos attribute
 *   - Checks URL params for tool triggers (?modal=quiz, etc.)
 *   - Lazy-loads the appropriate tool scripts on demand
 *   - Fires CPA pixels (click 1 on page load, click 2 on action)
 *   - Exposes window.PubOS for future tool hooks & config
 *
 * URL triggers:
 *   ?modal=quiz|zip|pick|gate|age|spin   → loads m.js (modal engine)
 *
 * Future hooks (loaded on demand):
 *   ?ab=1           → A/B test variant
 *   ?gate=email     → content gate
 *   ?poll=1         → inline poll
 */
(function () {
  'use strict';

  // =============================================
  // CONFIG
  // =============================================
  var CDN_BASE = 'https://cdn.jsdelivr.net/gh/muddywatermedia/pubos-site-deploy@main/';

  // Detect our own script tag to read data attributes
  var scriptTag = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.indexOf('p.js') !== -1) return scripts[i];
      }
      return null;
    })();

  var siteId = (scriptTag && scriptTag.getAttribute('data-pubos')) || window.location.hostname;

  // =============================================
  // GLOBAL PUBOS OBJECT
  // =============================================
  window.PubOS = window.PubOS || {};
  window.PubOS.site = siteId;
  window.PubOS.version = '1.0.0';
  window.PubOS.loaded = {};
  window.PubOS.config = {};

  // =============================================
  // CPA PIXEL HELPERS
  // =============================================

  // Click 1 — trxclk — fires on qualifying page load
  window.PubOS.fireClick1 = function (toolName) {
    console.log('[PubOS] Click 1 — trxclk — ' + toolName + ' loaded on ' + siteId);
    // PLACEHOLDER: Replace with real trxclk pixel URL
    // new Image().src = 'https://trxclk.example.com/pixel?click=1&tool=' + toolName + '&site=' + siteId + '&cb=' + Date.now();
  };

  // Click 2 — conversion — fires on user action completion
  window.PubOS.fireConversion = function (toolName, data) {
    console.log('[PubOS] Click 2 — CONVERSION — ' + toolName + ' completed on ' + siteId, data);
    // PLACEHOLDER: Replace with real conversion pixel URL
    // new Image().src = 'https://tj.example.com/conv?click=2&tool=' + toolName + '&site=' + siteId + '&data=' + encodeURIComponent(JSON.stringify(data)) + '&cb=' + Date.now();
  };

  // =============================================
  // LAZY SCRIPT LOADER
  // =============================================
  function loadScript(name, src, callback) {
    if (window.PubOS.loaded[name]) {
      if (callback) callback();
      return;
    }
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = function () {
      window.PubOS.loaded[name] = true;
      console.log('[PubOS] Loaded: ' + name);
      if (callback) callback();
    };
    s.onerror = function () {
      console.error('[PubOS] Failed to load: ' + name + ' from ' + src);
    };
    document.head.appendChild(s);
  }

  // =============================================
  // PUBLIC LOADER API
  // =============================================
  window.PubOS.load = function (name, callback) {
    var registry = {
      'modals': CDN_BASE + 'm.js'
      // Future tools:
      // 'analytics': CDN_BASE + 'a.js',
      // 'abtest':    CDN_BASE + 'ab.js',
      // 'polls':     CDN_BASE + 'poll.js',
    };
    if (!registry[name]) {
      console.warn('[PubOS] Unknown tool: ' + name);
      return;
    }
    loadScript(name, registry[name], callback);
  };

  // =============================================
  // URL PARAM TRIGGERS — auto-load tools based on URL
  // =============================================
  var params = new URLSearchParams(window.location.search);

  // ?modal=quiz|zip|pick|gate|age|spin → load modal engine
  var modalType = params.get('modal');
  if (modalType) {
    var validModals = ['quiz', 'zip', 'pick', 'gate', 'age', 'spin'];
    if (validModals.indexOf(modalType) !== -1) {
      window.PubOS.load('modals');
    } else {
      console.warn('[PubOS] Unknown modal type: ' + modalType);
    }
  }

  // Future triggers:
  // if (params.get('ab'))   window.PubOS.load('abtest');
  // if (params.get('poll')) window.PubOS.load('polls');

  // =============================================
  // BEACON — lightweight page view ping
  // =============================================
  console.log('[PubOS] p.js v' + window.PubOS.version + ' initialized | site=' + siteId);

})();
