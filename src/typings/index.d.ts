type ReportData = pvMsg | ApiMsg | ErrorMsg | durationMsg | behaviorMsg | eventMsg;

type MsgType = '' | 'pv' | 'api' | 'error' | 'duration' | 'behavior' | 'event';

interface CommonMsg {
  t: MsgType; // 类型
  page: string; // 页面
  hash: string; // 页面的hash值
  v: string; // 版本
  e: string; // 开发生产环境
  token: string; // 项目id
  begin: number; // 开始时间戳
  sr: string; // 屏幕分辨率
  vp: string; // view 分辨率
  _v: string; // 脚本sdk版本
  uid: string; // user id
  sid: string; // session id
  ct: string; // 网络
  ul: string; // 语言
  o: string; // 原始url
  ua: string; //设备的浏览器类型
  user: string; // 当前用户
}

// pv上报
interface pvMsg extends CommonMsg {
  data: {
    dt: string; // document title
    dl: string; // document location
    dr: string; // reffer
    dpr: number; // dpr
    de: string; // document 编码
  };
}

// 接口上报
interface ApiMsg extends CommonMsg {
  data: {
    url: string; // 接口
    success: boolean; // 成功？
    time: number; // 耗时
    code: number; // 接口返回的code
    msg: string; // 信息
  };
}

// 错误上报
interface ErrorMsg extends CommonMsg {
  data: {
    st: string; // sub type
    msg: string; // 信息
    cate?: string; // 类别
    detail?: string; // 错误栈 或 出错标签
    file?: string; // 出错文件
    line?: number; // 行
    col?: number; // 列
  };
}

// 时长切片上传
interface durationMsg extends CommonMsg {
  data: {
    duration_ms: number;
  };
}

// 自定行为上报
interface behaviorMsg extends CommonMsg {
  data: {
    type: string;
    path: string;
    msg: string;
    pageX: number;
    pageY: number;
  };
}

// 自定行为上报
interface eventMsg extends CommonMsg {
  data: {
    type: string;
    name: string;
    msg: string;
  };
}
