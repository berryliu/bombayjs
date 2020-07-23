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

  init({ Vue, ...options }) {
    // 没有token,则不监听任何事件
    if (options && !options.token) {
      throw Error('请输入一个token');
      return;
    }

    // 监听Vue的错误
    Vue && this.addListenVueError(Vue);

    setConfig(options);
    let page = Config.enableSPA
      ? parseHash(location.hash.toLowerCase())
      : location.pathname.toLowerCase();
    setPage(page, true);

    Config.enableSPA && this.addListenRouterChange();
    Config.isError && this.addListenJs();
    Config.isAjax && this.addListenAjax();
    // 行为是一个页面内的操作
    Config.isBehavior && this.addListenBehavior();
    // 绑定全局变量
    window.__bb = this;
    this.addListenUnload();
  }

  handleCustomizeReport(customizeMessage) {
    // 没有token,则不监听任何事件
    if (!Config.token) {
      throw Error('请输入一个合法token');
    }
    handleCustomizeReport(customizeMessage);
  }

  // 只支持更改用户的信息, 当获取到用户信息后，传入
  setUserInfo(userInfo) {
    const config = {
      user: userInfo,
    };
    setConfig(config);
  }

  // 监听行为
  addListenBehavior() {
    Config.behavior.click && this.addListenClick();
  }

  // 监听click
  addListenClick() {
    on('click', handleClick); // 非输入框点击，会过滤掉点击输入框

    if (Config.isCountStayTime) {
      on('click', handleStayTime); // 非输入框点击，会过滤掉点击输入框
    }
  }

  // 监听路由
  addListenRouterChange() {
    hackState('pushState');
    hackState('replaceState');
    on('hashchange', handleHashchange);
    on('historystatechanged', handleHistorystatechange);
  }

  addListenVueError(Vue) {
    Vue.config.errorHandler = function(error, vm, info) {
      console.error(error);
      handleVueErr(error, vm, info);
    };
  }

  addListenJs() {
    // js错误或静态资源加载错误
    on('error', handleErr);
    //promise错误
    on('unhandledrejection', handleErr);
    // window.addEventListener('rejectionhandled', rejectionhandled, true);
  }

  addListenAjax() {
    hackhook();
  }

  // beforeunload
  addListenUnload() {
    this.destroy();
  }

  // 移除路由
  removeListenRouterChange() {
    off('hashchange', handleHashchange);
    off('historystatechanged', handleHistorystatechange);
  }

  removeListenJs() {
    off('error', handleErr);
    off('unhandledrejection', handleErr);
  }

  removeListenAjax() {}

  api(api, success, time, code, msg) {
    handleApi(api, success, time, code, msg);
  }

  destroy() {
    Config.enableSPA && this.removeListenRouterChange();
    Config.isError && this.removeListenJs();
    Config.isAjax && this.removeListenAjax();
  }
}
