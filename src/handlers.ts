import { Config } from './config';
import { parseHash, warn } from './utils/tools';
import { getCommonMsg } from './utils';
import { report } from './reporter';
import { setGlobalPage, setGlobalSid, GlobalVal } from './config/global';

// 处理pv
export function handlePv(): void {
  if (!Config.autoSendPv) return;
  let commonMsg = getCommonMsg();
  let msg: pvMsg = {
    ...commonMsg,
    ...{
      t: 'pv',
      data: {
        dt: document.title,
        dl: location.href,
        dr: document.referrer,
        dpr: window.devicePixelRatio,
        de: document.charset,
      },
    },
  };
  report(msg);
}

// 处理html node
const normalTarget = function(e) {
  let t,
    n,
    r,
    a,
    i,
    o = [];
  if (!e || !e.tagName) return '';
  if (
    (o.push(e.tagName.toLowerCase()),
    e.id && o.push('#'.concat(e.id)),
    (t = e.className) && '[object String]' === Object.prototype.toString.call(t))
  ) {
    for (n = t.split(/\s+/), i = 0; i < n.length; i++) {
      // className包含active的不加入路径
      if (n[i].indexOf('active') < 0) o.push('.'.concat(n[i]));
    }
  }
  let s = ['type', 'name', 'title', 'alt'];
  for (i = 0; i < s.length; i++)
    (r = s[i]), (a = e.getAttribute(r)) && o.push('['.concat(r, '="').concat(a, '"]'));
  return o.join('');
};

// 获取元素路径，最多保留5层
const getElmPath = function(e) {
  if (!e || 1 !== e.nodeType) return '';
  let ret = [],
    deepLength = 0, // 层数，最多5层
    elm = ''; // 元素
  ret.push(`(${e.innerText.substr(0, 50)})`);
  for (let t = e || null; t && deepLength++ < 5 && !('html' === (elm = normalTarget(t))); ) {
    ret.push(elm), (t = t.parentNode);
  }
  return ret.reverse().join(' > ');
};

// 点击事件的监听
export function handleClick(event) {
  // 正在圈选
  let target;
  try {
    target = event.target;
  } catch (u) {
    target = '<unknown>';
  }
  if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') return;

  if (0 !== target.length) {
    // 空信息不上报
    let path = getElmPath(target);
    if (!path) return;

    let commonMsg = getCommonMsg();
    let msg: behaviorMsg = {
      ...commonMsg,
      ...{
        t: 'behavior',
        data: {
          type: 'click',
          path: getElmPath(target),
          pageX: event.pageX,
          pageY: event.pageY,
          msg: '',
        },
      },
    };
    report(msg);
  }
}

// 处理hash变化
// 注意在路由栈的路由不会触发
export function handleHashchange(e): void {
  let page = Config.enableSPA
    ? parseHash(location.hash.toLowerCase())
    : location.pathname.toLowerCase();
  page && setPage(page, false);
}

// 处理hash变化
export function handleHistorystatechange(e): void {
  let page = Config.enableSPA ? parseHash(e.detail.toLowerCase()) : e.detail.toLowerCase();
  page && setPage(page, false);
}

// 设置页面，是否是第一次
export function setPage(page, isFirst?: boolean) {
  if (!isFirst && GlobalVal.page === page && GlobalVal.sBegin > Date.now() - 100) {
    return;
  }
  setGlobalPage(page);
  setGlobalSid();
  handlePv();
}

// 处理Vue抛出的错误
export function handleVueErr(error, vm, info): void {
  let commonMsg = getCommonMsg();
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      data: {
        st: 'vue',
        msg: error,
        detail: JSON.stringify(info),
      },
    },
  };
  report(msg);
}

// 处理错误
export function handleErr(error): void {
  switch (error.type) {
    case 'error':
      error instanceof ErrorEvent ? reportCaughtError(error) : reportResourceError(error);
      break;
    case 'unhandledrejection':
      reportPromiseError(error);
      break;
  }
}

// 捕获js异常
function reportCaughtError(error: any): void {
  let commonMsg = getCommonMsg();
  let n = error.name || 'CustomError',
    a = error.message || '',
    i = error.error.stack || '';
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      data: {
        st: 'caughterror',
        cate: n, // 类别
        msg: a && a.substring(0, 1e3), // 信息
        detail: i && i.substring(0, 1e3), // 错误栈
        file: error.filename || '', // 出错文件
        line: error.lineno || '', // 行
        col: error.colno || '', // 列
      },
    },
  };
  report(msg);
}

// 捕获资源异常
function reportResourceError(error: any): void {
  let commonMsg = getCommonMsg();
  let target = error.target;
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      data: {
        st: 'resource',
        msg: target.outerHTML,
        file: target.src,
        detail: target.localName.toUpperCase(),
      },
    },
  };
  report(msg);
}

// 捕获promise异常
function reportPromiseError(error: any): void {
  let commonMsg = getCommonMsg();
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      data: {
        st: 'promise',
        msg: error.reason,
      },
    },
  };
  report(msg);
}

// 监听接口的错误
export function handleApi(url, success, time, code, msg) {
  if (!url) {
    warn('[retcode] api is null');
    return;
  }
  let commonMsg = getCommonMsg();
  let apiMsg: ApiMsg = {
    ...commonMsg,
    ...{
      t: 'api',
      data: {
        url, // 接口
        success, // 成功？
        time, // 耗时
        code, // 接口返回的code
        msg, // 信息
      },
    },
  };
  report(apiMsg);
}

// 监听用户的时长
// 用户在线时长统计
export function handleStayTime() {
  const now = Date.now();
  const duration = now - GlobalVal.lastTime;

  if (duration > Config.offlineTime) {
    GlobalVal.lastTime = Date.now();
  } else if (duration > Config.sendMill) {
    GlobalVal.lastTime = Date.now();
    let commonMsg = getCommonMsg();
    let msg: durationMsg = {
      ...commonMsg,
      ...{
        t: 'duration',
        data: {
          duration_ms: duration,
        },
      },
    };
    report(msg);
  }
}

// 用户自定义上传事件
export function handleCustomizeReport(customizeMessage) {
  if (!customizeMessage.t) {
    throw Error('行为类型不能为空');
  }
  let commonMsg = getCommonMsg();
  let eventMsg: eventMsg = {
    ...commonMsg,
    ...{
      t: 'event',
      data: {
        ...customizeMessage,
      },
    },
  };
  report(eventMsg);
}
