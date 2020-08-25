import { Config } from '../config';
import { GlobalVal } from '../config/global';
import { version } from '../../package.json';

// 获取公共的上传参数
export function getCommonMsg() {
  let u = (navigator as any).connection;
  let data: CommonMsg = {
    t: '',
    p: getPage(),
    h: getHash(),
    v: Config.appVersion,
    tk: Config.token,
    e: Config.environment,
    uid: Config.userId,
    sid: GlobalVal.sid,
    aid: '',
    sr: screen.width + 'x' + screen.height,
    vp: getScreen(),
    ct: u ? u.effectiveType : '',
    ul: getLang(),
    o: location.href,
    ua: getDeviceString(),
    _v: `${version}`,
    _t: new Date().getTime(),
  };
  return data;
}

function getHash(): string {
  return location.hash;
}

// 获取当前设备相关信息
function getDeviceString(): string {
  return navigator.userAgent;
}

// 获取页面
function getPage(): string {
  if (GlobalVal.page) return GlobalVal.page;
  else {
    return location.pathname.toLowerCase();
  }
}

// 获取浏览器默认语言
function getLang() {
  let lang = navigator.language || (navigator as any).userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang;
}

// 获取浏览器的屏幕宽度
function getScreen() {
  let w = document.documentElement.clientWidth || document.body.clientWidth;
  let h = document.documentElement.clientHeight || document.body.clientHeight;
  return w + 'x' + h;
}
