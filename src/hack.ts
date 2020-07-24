import { parseUrl, fnToString, warn, dispatchEvent, parseHash } from './utils/tools';
import { handleApi, setPage } from './handlers';
import { Config } from './config';

/**
 * hack pushstate replaceState
 * 派送historystatechange historystatechange事件
 * @export
 * @param {('pushState' | 'replaceState')} e
 */
export function hackState(e: 'pushState' | 'replaceState') {
  let t = history[e];
  'function' == typeof t &&
    ((history[e] = function(n, i, s) {
      !window['__bb_onpopstate_'] && hackOnpopstate(); // 调用pushState或replaceState时hack Onpopstate
      let c = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments),
        u = location.href,
        f = t.apply(history, c);
      if (!s || 'string' != typeof s) return f;
      if (s === u) return f;
      try {
        let l = u.split('#'),
          h = s.split('#'),
          p = parseUrl(l[0]),
          d = parseUrl(h[0]),
          g = l[1] && l[1].replace(/^\/?(.*)/, '$1'),
          v = h[1] && h[1].replace(/^\/?(.*)/, '$1');
        p !== d
          ? dispatchEvent('historystatechanged', d)
          : g !== v && dispatchEvent('historystatechanged', v);
      } catch (m) {
        warn('[retcode] error in ' + e + ': ' + m);
      }
      return f;
    }),
    (history[e].toString = fnToString(e)));
}

// 监听history的栈的改变
export function hackOnpopstate() {
  window['__bb_onpopstate_'] = window.onpopstate;

  window.addEventListener('popstate', function() {
    // for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
    let page = Config.enableSPA
      ? parseHash(location.hash.toLowerCase())
      : location.pathname.toLowerCase();
    setPage(page, false);
    // if (window.__bb_onpopstate_) return window.__bb_onpopstate_.apply(this, a)
  });
}

export function hackhook() {
  hackFetch();
  hackAjax();
}

// 劫持fetch网络请求
function hackFetch() {
  if ('function' == typeof window.fetch) {
    let __oFetch_ = window.fetch;
    window['__oFetch_'] = __oFetch_;
    window.fetch = function(t, o) {
      let a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
      let begin = Date.now(),
        url = (t && 'string' != typeof t ? t.url : t) || '',
        page = parseUrl(url as string);
      if (!page) return __oFetch_.apply(window, a);
      return __oFetch_.apply(window, a).then(function(e) {
        let response = e.clone(),
          headers = response.headers;
        if (headers && 'function' === typeof headers.get) {
          let ct = headers.get('content-type');
          if (ct && !/(text)|(json)/.test(ct)) return e;
        }
        let time = Date.now() - begin;
        response.text().then(function(res) {
          if (response.ok) {
            //  not need to report
          } else {
            handleApi(page, !1, time, status, res.substr(0, Config.maxLength) || '');
          }
        });
        return e;
      });
    };
  }
}

// 如果返回过长，会被截断
function hackAjax() {
  if ('function' == typeof window.XMLHttpRequest) {
    let begin = 0,
      url = '',
      page = '';
    let __oXMLHttpRequest_ = window.XMLHttpRequest;
    window['__oXMLHttpRequest_'] = __oXMLHttpRequest_;
    window.XMLHttpRequest = function(t) {
      let xhr = new __oXMLHttpRequest_(t);
      if (!xhr.addEventListener) return xhr;
      let open = xhr.open,
        send = xhr.send;
      xhr.open = function(method: string, url?: string) {
        let a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        url = url;
        page = parseUrl(url);

        open.apply(xhr, a);
      };
      xhr.send = function() {
        begin = Date.now();
        let a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        send.apply(xhr, a);
      };
      xhr.onreadystatechange = function() {
        if (page && 4 === xhr.readyState) {
          let time = Date.now() - begin;
          if (xhr.status >= 200 && xhr.status <= 299) {
            //  not need to report
          } else {
            handleApi(
              page,
              !1,
              time,
              status || 'FAILED',
              xhr.responseText.substr(0, Config.maxLength) || ''
            );
          }
        }
      };
      return xhr;
    };
  }
}
