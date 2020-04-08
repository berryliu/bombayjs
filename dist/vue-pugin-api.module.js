var e = function() {
  return (e =
    Object.assign ||
    function(e) {
      for (var t, n = 1, o = arguments.length; n < o; n++)
        for (var r in (t = arguments[n]))
          Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      return e;
    }).apply(this, arguments);
};
var t = {
  reportUrl: 'http://localhost:7002',
  token: '',
  appVersion: '1.0.0',
  environment: 'production',
  outtime: 300,
  enableSPA: !0,
  autoSendPv: !0,
  isPage: !0,
  isAjax: !0,
  isResource: !0,
  isError: !0,
  isRecord: !0,
  isBehavior: !0,
  ignore: {
    ignoreErrors: [],
    ignoreUrls: [],
    ignoreApis: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
  },
  behavior: { console: ['log', 'error'], click: !0 },
  maxLength: 1e3,
  Vue: '',
  user: {},
};
function n(n) {
  t = e(e({}, t), n);
}
function o(e) {
  return e && t[e] ? t[e] : {};
}
var r = function() {};
function a() {
  for (
    var e,
      t,
      n = 20,
      o = new Array(n),
      r = Date.now()
        .toString(36)
        .split('');
    n-- > 0;

  )
    (t = (e = (36 * Math.random()) | 0).toString(36)), (o[n] = e % 3 ? t : t.toUpperCase());
  for (var a = 0; a < 8; a++) o.splice(3 * a + 2, 0, r[a]);
  return o.join('');
}
function i(e) {
  var t = [];
  for (var n in e)
    e.hasOwnProperty(n) && t.push(encodeURIComponent(n) + '=' + encodeURIComponent(e[n]));
  return t.join('&');
}
function s(e, t) {
  var n = 0,
    o = e.length;
  if (
    (function(e, t) {
      var n = Object.prototype.toString
        .call(e)
        .substring(8)
        .replace(']', '');
      return t ? n === t : n;
    })(e, 'Array')
  )
    for (; n < o && !1 !== t.call(e[n], e[n], n); n++);
  else for (var r in e) if (!1 === t.call(e[r], e[r], r)) break;
  return e;
}
var c = function(e, t, n) {
    window.addEventListener
      ? window.addEventListener(
          e,
          function o(r) {
            n && window.removeEventListener(e, o, !0), t.call(this, r);
          },
          !0
        )
      : window.attachEvent &&
        window.attachEvent('on' + e, function o(r) {
          n && window.detachEvent('on' + e, o), t.call(this, r);
        });
  },
  u = function(e, t) {
    return t
      ? (window.removeEventListener
          ? window.removeEventListener(e, t)
          : window.detachEvent && window.detachEvent(e, t),
        this)
      : this;
  },
  d = function(e) {
    return (e ? p(e.replace(/^#\/?/, '')) : '') || '[index]';
  },
  p = function(e) {
    return e && 'string' == typeof e ? e.replace(/^(https?:)?\/\//, '').replace(/\?.*$/, '') : '';
  },
  l = function(e) {
    return function() {
      return e + '() { [native code] }';
    };
  },
  f = (function() {
    var e = 'object' == typeof console ? console.warn : r;
    try {
      var t = { warn: e };
      t.warn.call(t);
    } catch (e) {
      return r;
    }
    return e;
  })(),
  v = function(e, t) {
    var n;
    window.CustomEvent
      ? (n = new CustomEvent(e, { detail: t }))
      : ((n = window.document.createEvent('HTMLEvents')).initEvent(e, !1, !0), (n.detail = t)),
      window.dispatchEvent(n);
  },
  h = function(e) {
    var t = e.split('::');
    return t.length > 1 ? { group: t[0], key: t[1] } : { group: 'default_group', key: t[0] };
  },
  g = function(e, t) {
    return e.reduce(function(e, n, o) {
      return t(n, o) ? o : e;
    }, -1);
  },
  w = function() {
    return navigator.userAgent.indexOf('Edge') > -1;
  },
  y = self != top,
  m = {
    page: '',
    sid: '',
    sBegin: Date.now(),
    _health: { errcount: 0, apisucc: 0, apifail: 0 },
    circle: !1,
    cssInserted: !1,
  };
function b(e, t) {
  'error' === e && m._health.errcount++,
    'api' === e && t && m._health.apisucc++,
    'api' !== e || t || m._health.apifail++;
}
function L() {
  var e,
    n,
    o = navigator.connection;
  return {
    t: '',
    page: E(),
    times: 1,
    v: t.appVersion,
    token: t.token,
    e: t.environment,
    begin: new Date().getTime(),
    uid: S(),
    sid: m.sid,
    sr: screen.width + 'x' + screen.height,
    vp:
      ((e = document.documentElement.clientWidth || document.body.clientWidth),
      (n = document.documentElement.clientHeight || document.body.clientHeight),
      e + 'x' + n),
    ct: o ? o.effectiveType : '',
    ul: _(),
    _v: '{{VERSION}}',
    o: location.href,
    user: t.user,
  };
}
function E() {
  return m.page ? m.page : location.pathname.toLowerCase();
}
function S() {
  var e = localStorage.getItem('bombay_uid') || '';
  return e || ((e = a()), localStorage.setItem('bombay_uid', e)), e;
}
function _() {
  var e = navigator.language || navigator.userLanguage;
  return (e = e.substr(0, 2));
}
function R(e) {
  return (
    'res' === e.t
      ? j(e)
      : 'error' === e.t
      ? j(e)
      : 'behavior' === e.t
      ? j(e)
      : 'health' === e.t &&
        window &&
        window.navigator &&
        'function' == typeof window.navigator.sendBeacon
      ? (function(e) {
          'object' == typeof e && (e = i(e)),
            (e = t.reportUrl + '?' + e),
            window && window.navigator && 'function' == typeof window.navigator.sendBeacon
              ? window.navigator.sendBeacon(e)
              : f('[arms] navigator.sendBeacon not surported');
        })(e)
      : j(e),
    this
  );
}
function j(e) {
  var n,
    o = e[e.t];
  delete e[e.t],
    (function(e, t) {
      var n = window.__oXMLHttpRequest_ || window.XMLHttpRequest;
      if ('function' == typeof n)
        try {
          var o = new n();
          o.open('POST', e, !0),
            o.setRequestHeader('Content-Type', 'text/plain'),
            o.send(JSON.stringify(t));
        } catch (e) {
          f('[bombayjs] Failed to log, POST请求失败');
        }
      else f('[bombayjs] Failed to log, 浏览器不支持XMLHttpRequest');
    })(t.reportUrl + '?' + i(e), (((n = {})[e.t] = o), n));
}
var x = 'bombayjs-circle-active',
  C = 'bombayjs-circle-css';
var T = function(e) {
    var t,
      n,
      o,
      r,
      a,
      i = [];
    if (!e || !e.tagName) return '';
    if (
      (i.push(e.tagName.toLowerCase()),
      e.id && i.push('#'.concat(e.id)),
      (t = e.className) && '[object String]' === Object.prototype.toString.call(t))
    )
      for (n = t.split(/\s+/), a = 0; a < n.length; a++)
        n[a].indexOf('active') < 0 && i.push('.'.concat(n[a]));
    var s = ['type', 'name', 'title', 'alt'];
    for (a = 0; a < s.length; a++)
      (o = s[a]), (r = e.getAttribute(o)) && i.push('['.concat(o, '="').concat(r, '"]'));
    return i.join('');
  },
  k = function(e) {
    if (!e || 1 !== e.nodeType) return '';
    var t = [],
      n = 0,
      o = '';
    t.push('(' + e.innerText.substr(0, 50) + ')');
    for (var r = e || null; r && n++ < 5 && 'html' !== (o = T(r)); ) t.push(o), (r = r.parentNode);
    return t.reverse().join(' > ');
  };
function A(t) {
  if (m.circle) {
    var n = t.target.className.split(/\s+/),
      o = k(t.target);
    return (
      (o =
        1 === n.length || (2 === n.length && '' === n[0])
          ? o.replace(/\.\.bombayjs-circle-active/, '')
          : o.replace(/\.bombayjs-circle-active/, '')),
      window.parent.postMessage({ t: 'setElmPath', path: o, page: m.page }, '*'),
      void t.stopPropagation()
    );
  }
  var r;
  try {
    r = t.target;
  } catch (e) {
    r = '<unknown>';
  }
  if ('INPUT' !== r.nodeName && 'TEXTAREA' !== r.nodeName && 0 !== r.length) {
    var a = { type: 'ui.click', data: { path: k(r), message: '' } };
    if (!a.data.path) return;
    var i = L();
    R(e(e({}, i), { t: 'behavior', behavior: a }));
  }
}
function P(t) {
  var n;
  try {
    n = t.target;
  } catch (e) {
    n = '<unknown>';
  }
  if (('INPUT' === n.nodeName || 'TEXTAREA' === n.nodeName) && 0 !== n.length) {
    var o = { type: 'ui.blur', data: { path: k(n), message: n.value } };
    if (!o.data.path || !o.data.message) return;
    var r = L();
    R(e(e({}, r), { t: 'behavior', behavior: o }));
  }
}
var N = [
  '',
  'fetchStart',
  'domainLookupStart',
  'domainLookupEnd',
  'connectStart',
  'connectEnd',
  'requestStart',
  'responseStart',
  'responseEnd',
  '',
  'domInteractive',
  '',
  'domContentLoadedEventEnd',
  '',
  'loadEventStart',
  '',
  'msFirstPaint',
  'secureConnectionStart',
];
function O(e) {
  var n = t.enableSPA ? d(location.hash.toLowerCase()) : location.pathname.toLowerCase();
  n && I(n, !1);
}
function B(e) {
  var n = t.enableSPA ? d(e.detail.toLowerCase()) : e.detail.toLowerCase();
  n && I(n, !1);
}
function I(n, o) {
  !o && M(),
    (function(t) {
      var n = L();
      R(
        e(e({}, n), {
          t: 'behavior',
          behavior: { type: 'navigation', data: { from: n.page, to: t } },
        })
      );
    })(n),
    y && window.parent.postMessage({ t: 'setPage', href: location.href, page: n }, '*'),
    (function(e) {
      m.page = e;
    })(n),
    (m.sid = a()),
    (m.sBegin = Date.now()),
    (function() {
      if (t.autoSendPv) {
        var n = L();
        R(
          e(e({}, n), {
            t: 'pv',
            dt: document.title,
            dl: location.href,
            dr: document.referrer,
            dpr: window.devicePixelRatio,
            de: document.charset,
          })
        );
      }
    })();
}
function M() {
  var t = m._health.errcount ? 0 : 1,
    n = L(),
    o = e(e(e({}, n), m._health), { t: 'health', healthy: t, stay: Date.now() - m.sBegin });
  (m._health = { errcount: 0, apisucc: 0, apifail: 0 }), R(o);
}
function H(t) {
  switch (t.type) {
    case 'error':
      t instanceof ErrorEvent
        ? (function(t) {
            var n = L(),
              o = t.name || 'CustomError',
              r = t.message || '',
              a = t.error.stack || '';
            R(
              e(e({}, n), {
                t: 'error',
                st: 'caughterror',
                cate: o,
                msg: r && r.substring(0, 1e3),
                detail: a && a.substring(0, 1e3),
                file: t.filename || '',
                line: t.lineno || '',
                col: t.colno || '',
              })
            );
          })(t)
        : (function(t) {
            var n = L(),
              o = t.target;
            R(
              e(e({}, n), {
                t: 'error',
                st: 'resource',
                msg: o.outerHTML,
                file: o.src,
                stack: o.localName.toUpperCase(),
              })
            );
          })(t);
      break;
    case 'unhandledrejection':
      !(function(t) {
        var n = L();
        R(e(e({}, n), { t: 'error', st: 'promise', msg: t.reason }));
      })(t);
  }
  b('error');
}
function U() {
  var t = window.performance;
  if (!t || 'object' != typeof t || 'function' != typeof t.getEntriesByType) return null;
  var n = L(),
    r = e(e({}, n), { dom: 0, load: 0, t: 'res', res: [] }),
    a = t.timing || {},
    i = t.getEntriesByType('resource') || [];
  if ('function' == typeof window.PerformanceNavigationTiming) {
    var c = t.getEntriesByType('navigation')[0];
    c && (a = c);
  }
  if (
    (s({ dom: [10, 8], load: [14, 1] }, function(e, t) {
      var n = a[N[e[1]]],
        o = a[N[e[0]]];
      if (void 0 !== n && void 0 !== o) {
        var i = Math.round(o - n);
        i >= 0 && i < 36e5 && (r[t] = i);
      }
    }),
    (i = i.filter(function(e) {
      return !(
        g(o('ignore').ignoreApis, function(t) {
          return e.name.indexOf(t) > -1;
        }) > -1
      );
    })),
    w())
  ) {
    var u = [];
    s(i, function(e) {
      u.push({
        connectEnd: e.connectEnd,
        connectStart: e.connectStart,
        domainLookupEnd: e.connectStart,
        domainLookupStart: e.domainLookupStart,
        duration: e.duration,
        entryType: e.entryType,
        fetchStart: e.fetchStart,
        initiatorType: e.initiatorType,
        name: e.name,
        redirectEnd: e.redirectEnd,
        redirectStart: e.redirectStart,
        responseEnd: e.responseEnd,
        responseStart: e.responseStart,
        startTime: e.startTime,
      });
    }),
      (i = u);
  }
  (r.res = i), R(r);
}
function D(t, n, r, a, i, s) {
  if (t) {
    b('api', n);
    var c = L(),
      u = e(e({}, c), { t: 'api', beigin: s, url: t, success: n, time: r, code: a, msg: i });
    g(o('ignore').ignoreApis, function(e) {
      return t.indexOf(e) > -1;
    }) > -1 || R(u);
  } else f('[retcode] api is null');
}
function q(e) {
  var t = document.getElementsByClassName(x);
  if (t.length > 0)
    for (var n = 0; n < t.length; n++)
      t[n].className = t[n].className.replace(/ bombayjs-circle-active/g, '');
  e.target.className += ' ' + x;
}
function V() {
  !(function() {
    var e = '.' + x + '{border: #ff0000 2px solid;}',
      t = document.createElement('style');
    (t.type = 'text/css'), (t.id = C);
    try {
      t.appendChild(document.createTextNode(e));
    } catch (n) {
      t.styleSheet.cssText = e;
    }
    document.getElementsByTagName('head')[0].appendChild(t);
  })(),
    (m.cssInserted = !0),
    (m.circle = !0),
    c('mouseover', q);
}
function X() {
  var e;
  (e = document.getElementById(C)).parentNode.removeChild(e),
    (m.cssInserted = !1),
    (m.circle = !1),
    u('mouseover', q);
}
function J(e) {
  e.data &&
    e.data.t &&
    ('setCircle' === e.data.t
      ? Boolean(e.data.v)
        ? V()
        : X()
      : 'back' === e.data.t
      ? window.history.back()
      : 'forward' === e.data.t && window.history.forward());
}
function F(e) {
  var n = history[e];
  'function' == typeof n &&
    ((history[e] = function(o, r, a) {
      !window.__bb_onpopstate_ &&
        ((window.__bb_onpopstate_ = window.onpopstate),
        (window.onpopstate = function() {
          for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) n[o] = arguments[o];
          var r = t.enableSPA ? d(location.hash.toLowerCase()) : location.pathname.toLowerCase();
          if ((I(r, !1), window.__bb_onpopstate_)) return window.__bb_onpopstate_.apply(this, n);
        }));
      var i = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments),
        s = location.href,
        c = n.apply(history, i);
      if (!a || 'string' != typeof a) return c;
      if (a === s) return c;
      try {
        var u = s.split('#'),
          l = a.split('#'),
          h = p(u[0]),
          g = p(l[0]),
          w = u[1] && u[1].replace(/^\/?(.*)/, '$1'),
          y = l[1] && l[1].replace(/^\/?(.*)/, '$1');
        h !== g ? v('historystatechanged', g) : w !== y && v('historystatechanged', y);
      } catch (t) {
        f('[retcode] error in ' + e + ': ' + t);
      }
      return c;
    }),
    (history[e].toString = l(e)));
}
function $() {
  !(function() {
    if ('function' == typeof window.fetch) {
      var e = window.fetch;
      (window.__oFetch_ = e),
        (window.fetch = function(t, n) {
          var o = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments),
            r = Date.now(),
            a = (t && 'string' != typeof t ? t.url : t) || '',
            i = p(a);
          return i
            ? e.apply(window, o).then(function(e) {
                var t = e.clone(),
                  n = t.headers;
                if (n && 'function' == typeof n.get) {
                  var o = n.get('content-type');
                  if (o && !/(text)|(json)/.test(o)) return e;
                }
                var a = Date.now() - r;
                return (
                  t.text().then(function(e) {
                    t.ok
                      ? D(i, !0, a, status, e.substr(0, 1e3) || '', r)
                      : D(i, !1, a, status, e.substr(0, 1e3) || '', r);
                  }),
                  e
                );
              })
            : e.apply(window, o);
        });
    }
  })(),
    (function() {
      if ('function' == typeof window.XMLHttpRequest) {
        var e = 0,
          n = '',
          o = window.XMLHttpRequest;
        (window.__oXMLHttpRequest_ = o),
          (window.XMLHttpRequest = function(r) {
            var a = new o(r);
            if (!a.addEventListener) return a;
            var i = a.open,
              s = a.send;
            return (
              (a.open = function(e, t) {
                var o = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                (n = p((t = t))), i.apply(a, o);
              }),
              (a.send = function() {
                e = Date.now();
                var t = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                s.apply(a, t);
              }),
              (a.onreadystatechange = function() {
                if (n && 4 === a.readyState) {
                  var o = Date.now() - e;
                  if (a.status >= 200 && a.status <= 299) {
                    var r = a.status || 200;
                    if ('function' == typeof a.getResponseHeader) {
                      var i = a.getResponseHeader('Content-Type');
                      if (i && !/(text)|(json)/.test(i)) return;
                    }
                    D(n, !0, o, r, a.responseText.substr(0, t.maxLength) || '', e);
                  } else D(n, !1, o, r || 'FAILED', a.responseText.substr(0, t.maxLength) || '', e);
                }
              }),
              a
            );
          });
      }
    })();
}
export default (function() {
  function o(e, t) {
    this.init(e);
  }
  return (
    (o.prototype.init = function(e) {
      var o = e.Vue,
        r = (function(e, t) {
          var n = {};
          for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
          if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
            var r = 0;
            for (o = Object.getOwnPropertySymbols(e); r < o.length; r++)
              t.indexOf(o[r]) < 0 && (n[o[r]] = e[o[r]]);
          }
          return n;
        })(e, ['Vue']);
      !r || r.token
        ? (o && this.addListenVueError(o),
          n(r),
          I(t.enableSPA ? d(location.hash.toLowerCase()) : location.pathname.toLowerCase(), !0),
          t.isPage && this.sendPerf(),
          t.enableSPA && this.addListenRouterChange(),
          t.isError && this.addListenJs(),
          t.isAjax && this.addListenAjax(),
          t.isRecord && this.addRrweb(),
          t.isBehavior && this.addListenBehavior(),
          t.isResource && this.sendResource(),
          (window.__bb = this),
          this.addListenUnload(),
          c('message', J),
          m.circle && V())
        : console.warn('请输入一个token');
    }),
    (o.prototype.setUserInfo = function(e) {
      n({ user: e });
    }),
    (o.prototype.sendPerf = function() {
      !(function() {
        var t = window.performance;
        if (t && 'object' == typeof t)
          var n = {
              dns: 0,
              tcp: 0,
              ssl: 0,
              ttfb: 0,
              trans: 0,
              dom: 0,
              res: 0,
              firstbyte: 0,
              fpt: 0,
              tti: 0,
              ready: 0,
              load: 0,
            },
            o = t.timing || {},
            r = Date.now(),
            a = 1,
            i = setInterval(function() {
              if (o.loadEventEnd) {
                if ((clearInterval(i), 'function' == typeof window.PerformanceNavigationTiming)) {
                  var c = t.getEntriesByType('navigation')[0];
                  c && ((o = c), (a = 2));
                }
                s(
                  {
                    dns: [3, 2],
                    tcp: [5, 4],
                    ssl: [5, 17],
                    ttfb: [7, 6],
                    trans: [8, 7],
                    dom: [10, 8],
                    res: [14, 12],
                    firstbyte: [7, 2],
                    fpt: [8, 1],
                    tti: [10, 1],
                    ready: [12, 1],
                    load: [14, 1],
                  },
                  function(e, t) {
                    var r = o[N[e[1]]],
                      i = o[N[e[0]]],
                      s = Math.round(i - r);
                    (2 === a || (void 0 !== r && void 0 !== i)) &&
                      ('dom' === t && (s = Math.round(i - r)), s >= 0 && s < 36e5 && (n[t] = s));
                  }
                );
                var u =
                    window.navigator.connection ||
                    window.navigator.mozConnection ||
                    window.navigator.webkitConnection,
                  d = t.navigation || { type: void 0 };
                n.ct = u ? u.effectiveType || u.type : '';
                var p = (u && (u.downlink || u.downlinkMax || u.bandwidth)) || null;
                if (
                  ((p = p > 999 ? 999 : p) && (n.bandwidth = p),
                  (n.navtype = 1 === d.type ? 'Reload' : 'Other'),
                  1 === a && o[N[16]] > 0 && o[N[1]] > 0)
                ) {
                  var l = o[N[16]] - o[N[1]];
                  l >= 0 && l < 36e5 && (n.fpt = l);
                }
                1 === a && o[N[1]] > 0
                  ? (n.begin = o[N[1]])
                  : 2 === a && n.load > 0
                  ? (n.begin = r - n.load)
                  : (n.begin = r);
                var f = L();
                R(e(e(e({}, f), { t: 'perf' }), n));
              }
            }, 50);
      })();
    }),
    (o.prototype.sendResource = function() {
      'complete' === window.document.readyState ? U() : this.addListenResource();
    }),
    (o.prototype.addListenResource = function() {
      c('load', U);
    }),
    (o.prototype.addListenBehavior = function() {
      !(function() {
        if (window && window.console)
          for (var n = t.behavior.console, o = 0; n.length; o++) {
            var r = n[o],
              a = window.console[r];
            if (!window.console[r]) return;
            !(function(t, n) {
              window.console[t] = function() {
                var o,
                  r,
                  a = Array.prototype.slice.apply(arguments),
                  i = { type: 'console', data: { level: t, message: JSON.stringify(a) } };
                (o = i),
                  (r = L()),
                  R(e(e({}, r), { t: 'behavior', behavior: o })),
                  n && n.apply(null, a);
              };
            })(r, a);
          }
      })(),
        t.behavior.click && this.addListenClick();
    }),
    (o.prototype.addListenClick = function() {
      c('click', A), c('blur', P);
    }),
    (o.prototype.addListenRouterChange = function() {
      F('pushState'), F('replaceState'), c('hashchange', O), c('historystatechanged', B);
    }),
    (o.prototype.addListenVueError = function(t) {
      t.config.errorHandler = function(t, n, o) {
        console.error(t),
          (function(t, n, o) {
            var r = L();
            R(
              e(e({}, r), {
                t: 'error',
                st: 'vue_error',
                msg: t,
                file: '',
                stack: 'Vue',
                vm: JSON.stringify(n),
                info: JSON.stringify(o),
              })
            );
          })(t, n, o);
      };
    }),
    (o.prototype.addListenJs = function() {
      c('error', H), c('unhandledrejection', H);
    }),
    (o.prototype.addListenAjax = function() {
      $();
    }),
    (o.prototype.addListenUnload = function() {
      c('beforeunload', M), this.destroy();
    }),
    (o.prototype.addRrweb = function() {}),
    (o.prototype.removeListenRouterChange = function() {
      u('hashchange', O), u('historystatechanged', B);
    }),
    (o.prototype.removeListenJs = function() {
      u('error', H), u('unhandledrejection', H);
    }),
    (o.prototype.removeListenResource = function() {
      u('beforeunload', M);
    }),
    (o.prototype.removeListenAjax = function() {}),
    (o.prototype.removeListenUnload = function() {
      u('load', U);
    }),
    (o.prototype.removeRrweb = function() {}),
    (o.prototype.sum = function(t, n) {
      !(function(t, n) {
        void 0 === n && (n = 1);
        var o = L(),
          r = h(t);
        R(e(e(e({}, o), r), { t: 'sum', val: n }));
      })(t, n);
    }),
    (o.prototype.avg = function(t, n) {
      !(function(t, n) {
        void 0 === n && (n = 1);
        var o = L(),
          r = h(t);
        R(e(e(e({}, o), r), { t: 'avg', val: n }));
      })(t, n);
    }),
    (o.prototype.msg = function(n) {
      !(function(n) {
        var o = L(),
          r = h(n);
        R(e(e({}, o), { t: 'msg', group: r.group, msg: r.key.substr(0, t.maxLength) }));
      })(n);
    }),
    (o.prototype.api = function(e, t, n, o, r) {
      D(e, t, n, o, r, Date.now());
    }),
    (o.prototype.destroy = function() {
      t.enableSPA && this.removeListenRouterChange(),
        t.isError && this.removeListenJs(),
        t.isAjax && this.removeListenAjax(),
        t.isRecord && this.removeRrweb(),
        t.isResource && this.removeListenResource(),
        this.removeListenResource();
    }),
    o
  );
})();
