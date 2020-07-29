interface Window {
  attachEvent: any;
  detachEvent: any;
  CustomEvent: any;
  __oXMLHttpRequest_: any;
  XMLHttpRequest: any;
  __bb: any;
  __bb_onpopstate_: any;
}

type ReportData = pvMsg | ApiMsg | ErrorMsg | durationMsg | behaviorMsg | customMsg;

type MsgType = '' | 'pv' | 'api' | 'error' | 'duration' | 'behavior' | 'custom';

interface CommonMsg {
  t: MsgType; // 类型
  p: string; // 页面路径
  h: string; // 页面的hash值
  v: string; // 版本
  e: string; // 开发生产环境
  tk: string; // 项目id
  sr: string; // 屏幕分辨率
  vp: string; // view 分辨率
  uid: string; // user id
  sid: string; // session id
  ct: string; // 网络
  ul: string; // 语言 language
  o: string; // 原始url origin url
  ua: string; //设备的浏览器类型 user agent
  _v: string; // SDK版本 version
  _t: number; // 开始时间戳 time
}

// pv上报
interface pvMsg extends CommonMsg {
  p_t: string; // 页面标题 title
  p_l: string; // 页面路径 location
  p_r: string; // 页面来源 reffer
  p_d: number; // 页面 dpr
  p_e: string; // 页面编码 encode
}

// 接口上报
interface ApiMsg extends CommonMsg {
  a_u: string; // 接口  url
  a_s: boolean; // 成功？ success
  a_t: number; // 耗时  time
  a_c: number; // 接口返回的 code
  a_m: string; // 信息  msg
}

// 错误上报
interface ErrorMsg extends CommonMsg {
  e_t: string; // 错误类型 type
  e_m: string; // 信息     msg
  e_c?: string; // 类别    cate
  e_d?: string; // 错误栈  detail
  e_f?: string; // 出错文件 file
  e_l?: number; // 出错行  line
}

// 时长切片上传
interface durationMsg extends CommonMsg {
  d_t: number; // 时延 time
}

// 行为上报
interface behaviorMsg extends CommonMsg {
  b_t: string; // 类型 type
  b_n: string; // 名称 name
  b_p: string; // DOM 路径 path
  b_m: string; // 信息 msg
  b_x: number; // page X
  b_y: number; // page Y
}

// 自定事件上报
interface customMsg extends CommonMsg {
  c_t: string; // 类型 type
  c_n: string; // 名称 name
  c_m: string; // 信息 msg
}
