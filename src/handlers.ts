import { Config } from './config';
import { parseHash, warn } from './utils/tools';
import { getCommonMsg } from './utils';
import { report } from './reporter';
import { setGlobalPage, setGlobalSid, GlobalVal } from './config/global';

const EL_BEHAVIOR_NAME = 'b-name';
const EL_BEHAVIOR_MSG = 'b-msg';

// 处理pv
export function handlePv(): void {
  let commonMsg = getCommonMsg();
  let msg: pvMsg = {
    ...commonMsg,
    ...{
      t: 'pv',
      p_t: document.title,
      p_l: location.href,
      p_r: document.referrer,
      p_d: window.devicePixelRatio,
      p_e: document.charset,
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
      a_u: url, // 接口
      a_s: success, // 成功？
      a_t: time, // 耗时
      a_c: code, // 接口返回的code
      a_m: msg, // 信息
    },
  };
  report(apiMsg);
}

// 处理Vue抛出的错误
export function handleVueErr(error, vm, info): void {
  let commonMsg = getCommonMsg();
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      e_t: 'vue',
      e_m: error,
      e_d: JSON.stringify(info).substr(0, Config.maxLength),
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
      e_t: 'caughterror',
      e_m: a && a.substr(0, Config.maxLength), // 信息
      e_c: n, // 类别
      e_d: i && i.substr(0, Config.maxLength), // 错误栈
      e_f: error.filename || '', // 出错文件
      e_l: error.lineno || '', // 行
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
      e_t: 'resource',
      e_m: target.localName.toUpperCase(),
      e_f: target.src,
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
      e_t: 'promise',
      e_m:
        (error.reason &&
          error.reason.message &&
          error.reason.message.substr(0, Config.maxLength)) ||
        '',
    },
  };
  report(msg);
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
        d_t: duration,
      },
    };
    report(msg);
  }
}

// 点击事件的监听
export function handleClick(event) {
  let target;
  try {
    target = event.target;
  } catch (u) {
    target = '<unknown>';
  }
  if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') return;
  // 无标记不上报
  if (!getElBehaviorName(target)) return;

  if (0 !== target.length) {
    // 空信息不上报
    let path = getElPath(target);
    if (!path) return;

    let commonMsg = getCommonMsg();
    let msg: behaviorMsg = {
      ...commonMsg,
      ...{
        t: 'behavior',
        b_t: 'click',
        b_n: encode(getElBehaviorName(target)),
        b_m: encode(getElBehaviorMsg(target)),
        b_p: getElPath(target),
        b_x: event.pageX,
        b_y: event.pageY,
      },
    };
    report(msg);
  }
}

// 自定事件上报
interface message {
  type: string; // 类型
  name: string; // 名称
  msg: string | object; // 信息
}

// 用户自定义上传事件
export function handleCustomizeReport(message: message) {
  if (!message.type) {
    throw Error('自定义类型不能为空');
  }
  let commonMsg = getCommonMsg();

  let customMsg: customMsg = {
    ...commonMsg,
    ...{
      t: 'custom',
      c_t: encode(message.type),
      c_n: encode(message.name),
      c_m: encode(JSON.stringify(message.msg)),
    },
  };
  report(customMsg);
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

const encode = function(e: string) {
  return encodeURIComponent(e);
};

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
const getElPath = function(e) {
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

// 获取元素埋点配置名称
const getElBehaviorName = function(e) {
  if (!e || 1 !== e.nodeType) return '';
  return e.getAttribute(EL_BEHAVIOR_NAME) || '';
};

// 获取元素埋点配置信息
const getElBehaviorMsg = function(e) {
  if (!e || 1 !== e.nodeType) return '';
  return e.getAttribute(EL_BEHAVIOR_MSG) || '';
};
