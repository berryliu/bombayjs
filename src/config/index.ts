// 默认参数
export let Config = {
  // 上报地址
  reportUrl: 'http://localhost:7002',
  // 提交参数
  token: '',
  // app版本
  appVersion: '1.0.0',
  // 环境
  environment: 'production',
  // 开启单页面？
  enableSPA: true,
  // 是否上报ajax性能数据
  isAjax: true,
  // 是否上报错误信息
  isError: true,
  // 是否记录停留时长
  isCountStayTime: true,
  // 是否上报行为
  isBehavior: true,
  // 是否自动上报行为
  behavior: {
    click: true,
  },
  // 最长上报数据长度
  maxLength: 100,
  // 是否上报 Vue 的错误日志
  Vue: '',
  // 用户信息
  userId: '',
  // 定义用户多少毫秒不操作认为不在线 (默认10分钟)
  offlineTime: 10 * 60 * 1000,
  // 多少时间上传一次用户停留
  sendMill: 30 * 1000,
};

// 设置参数
export function setConfig(options) {
  Config = {
    ...Config,
    ...options,
  };
}

export function getConfig(e: string) {
  return e ? (Config[e] ? Config[e] : {}) : {};
}
