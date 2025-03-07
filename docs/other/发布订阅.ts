/**
 * 发布订阅模式实现类
 * 该类采用单例模式，确保全局只有一个发布订阅中心
 */
class PubSub {
  /** 单例实例 */
  private static instance: PubSub;
  /** 事件存储对象，key为事件名称，value为对应的回调函数数组 */
  private events: { [key: string]: Function[] } = {};

  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() {}

  /**
   * 获取单例实例的静态方法
   * @returns PubSub的唯一实例
   */
  public static getInstance(): PubSub {
    if (!PubSub.instance) {
      PubSub.instance = new PubSub();
    }
    return PubSub.instance;
  }

  /**
   * 订阅事件方法
   * @param event 事件名称
   * @param callback 事件触发时执行的回调函数
   * @returns 返回取消订阅的函数，执行该函数可以取消订阅
   */
  public subscribe(event: string, callback: Function) {
    (this.events[event] || (this.events[event] = [])).push(callback);
    return () =>
      (this.events[event] = this.events[event].filter((cb) => cb !== callback));
  }

  /**
   * 发布事件方法
   * @param event 事件名称
   * @param data 传递给订阅者的数据
   */
  public publish(event: string, data: any) {
    (this.events[event] || []).forEach((cb) => cb(data));
  }
}

/**
 * 导出PubSub的单例实例，供其他模块使用
 */
export const pubsub = PubSub.getInstance();

class PubSub2 {
  /** 单例实例 */
  private static instance: PubSub2;

  /** 事件存储对象 */
  private events: { [key: string]: Function[] } = {};
  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() {}

  public static getInstance(): PubSub2{
    if (!PubSub2.instance) {
      PubSub2.instance = new PubSub2();
    }
    return PubSub2.instance;
  }

  /**
   * 订阅事件方法
   * @param event 事件名称
   * @param callback 事件触发时执行的回调函数
   * @returns 返回取消订阅的函数，执行该函数可以取消订阅
   */
  public subscribe(event: string, callback: Function) {
    this.events[event] == this.events[event] || [];
    this.events[event].push(callback);

    /* 返回取消订阅的函数 */
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  }

  /**
   * 发布事件方法
   * @param event 事件名称
   * @param data 传递给订阅者的数据
   */
  public publish(event: string, data: any) {
    this.events[event] == this.events[event] || [];
    this.events[event].forEach((cb) => cb(data));
  }
}

export const pubsub2 = PubSub2.getInstance();
