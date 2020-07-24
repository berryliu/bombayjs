import { Config } from './config';
import { serialize, warn } from './utils/tools';

// 上报
export function report(e: ReportData) {
  send(e);
}

// post上报
export function send(msg: ReportData) {
  new Image().src = `${Config.reportUrl}?${serialize(msg)}`;
}

export function post(url, body) {
  let XMLHttpRequest = window.__oXMLHttpRequest_ || window.XMLHttpRequest;
  if (typeof XMLHttpRequest === 'function') {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(JSON.stringify(body));
    } catch (e) {
      warn('[bb] Failed to log, POST请求失败');
    }
  } else {
    warn('[bb] Failed to log, 浏览器不支持XMLHttpRequest');
  }
}
