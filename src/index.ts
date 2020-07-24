import { Config, setConfig } from './config';
import {
  handleErr,
  handleVueErr,
  handleHashchange,
  handleHistorystatechange,
  handleClick,
  handleApi,
  handleStayTime,
  handleCustomizeReport,
  setPage,
} from './handlers';
import { on, off, parseHash } from './utils/tools';
import { hackState, hackhook } from './hack';

export default class Bombay {
  constructor(options, fn) {
    this.init(options);
  }

  // init({ Vue, ...options }) {
  init(options) {
    // 没有token,则不监听任何事件
    if (options && !options.token) {
      throw Error('请输入一个token');
      return;
    }

    // 监听Vue的错误
    // Vue && this._addListenVueError(Vue);

    setConfig(options);
    let page = Config.enableSPA
      ? parseHash(location.hash.toLowerCase())
      : location.pathname.toLowerCase();
    setPage(page, true);

    Config.enableSPA && this._addListenRouterChange();
    Config.isError && this._addListenJs();
    Config.isAjax && this._addListenAjax();
    Config.isBehavior && this._addListenBehavior();
    window.__bb = this;
    // this._addListenUnload();
  }

  report(message) {
    // 没有token,则不监听任何事件
    if (!Config.token) {
      throw Error('请输入一个合法token');
    }
    handleCustomizeReport(message);
  }

  api(api, success, time, code, msg) {
    handleApi(api, success, time, code, msg);
  }

  // 只支持更改用户的信息, 当获取到用户信息后，传入
  setUserId(userId) {
    const config = {
      userId: userId,
    };
    setConfig(config);
  }

  // 监听click
  _addListenClick() {
    on('click', handleClick); // 非输入框点击，会过滤掉点击输入框

    if (Config.isCountStayTime) {
      on('click', handleStayTime); // 非输入框点击，会过滤掉点击输入框
    }
  }

  // 监听路由
  _addListenRouterChange() {
    hackState('pushState');
    hackState('replaceState');
    on('hashchange', handleHashchange);
    on('historystatechanged', handleHistorystatechange);
  }

  _addListenVueError(Vue) {
    Vue.config.errorHandler = function(error, vm, info) {
      handleVueErr(error, vm, info);
    };
  }

  _addListenJs() {
    // js错误或静态资源加载错误
    on('error', handleErr);
    //promise错误
    on('unhandledrejection', handleErr);
    // window.addEventListener('rejectionhandled', rejectionhandled, true);
  }

  _addListenAjax() {
    hackhook();
  }

  // 监听行为
  _addListenBehavior() {
    Config.behavior.click && this._addListenClick();
  }

  // beforeunload
  _addListenUnload() {
    this._destroy();
  }

  // 移除路由
  _removeListenRouterChange() {
    off('hashchange', handleHashchange);
    off('historystatechanged', handleHistorystatechange);
  }

  _removeListenJs() {
    off('error', handleErr);
    off('unhandledrejection', handleErr);
  }

  _removeListenAjax() {}

  _destroy() {
    Config.enableSPA && this._removeListenRouterChange();
    Config.isError && this._removeListenJs();
    Config.isAjax && this._removeListenAjax();
  }
}
