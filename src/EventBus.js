const Emmiter = require("events");
function deepClone(obj) {
  var _tmp, result;
  _tmp = JSON.stringify(obj);
  result = JSON.parse(_tmp);
  return result;
}
export const EventBus = (() => {
  const _emmiter = new Emmiter();
  const _events = {};
  const _subs = {};
  return class EventBus {
    /**
     * Emit event
     * @param {string|symbol} event Event name or symbol
     * @param {*} args Event passed data
     * @returns {EventBus} this
     */
    emit(event, args) {
      if (!event) {
        throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
      }
      _emmiter.emit(event, args);
      return this;
    }
    /**
     * Subscribers who subscribe after the event is published can also receive the event.
     * It's like a global variable, but when that variable changes, all subscribers can receive a change event.
     * @param {string|symbol} event Event name or symbol
     * @param {*} args Event passed data
     * @returns {EventBus} this
     */
    share(event, args) {
      if (!event) {
        throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
      }
      _events[event] = args;
      _emmiter.emit(event, args);
      return this;
    }
    /**
     * Subscribe events
     * @param {Vue} vm Vue instance
     * @param {string|symbol} event Event name or symbol
     * @param {Function} listener
     * @returns {EventBus} this
     */
    on(vm, event, listener) {
      if (!vm) {
        throw new Error("第1个参数为vue的实例，不能为空");
      }
      if (!event) {
        throw new Error("第2个参数为事件名，String或者Symbol类型，不能为空");
      }
      if (!listener) {
        throw new Error("第3个参数为监听回调，不能为空");
      }
      if (!_subs[vm._uid]) {
        _subs[vm._uid] = {
          [event]: []
        };
      }
      if (!_subs[vm._uid][event]) {
        _subs[vm._uid][event] = [];
      }
      _subs[vm._uid][event].push(listener);
      const beforeDestroy = vm.$options.beforeDestroy;
      let isReplced = false;
      for (let i = 0; i < beforeDestroy.length; i++) {
        if (beforeDestroy[i].name === beforeDestroyHandle.name) {
          beforeDestroy[i] = beforeDestroyHandle;
          isReplced = true;
          break;
        }
      }
      if (!isReplced) {
        beforeDestroy.push(beforeDestroyHandle);
      }
      const data = _events[event];
      if (event in _events) {
        listener(deepClone(data));
      }
      _emmiter.on(event, data => {
        listener(deepClone(data));
      });
      return this;
      function beforeDestroyHandle() {
        for (const event in _subs[vm._uid]) {
          const listeners = _subs[vm._uid][event];
          for (const listener of listeners) {
            _emmiter.off(event, listener);
          }
        }
        delete _subs[vm._uid];
      }
    }
    /**
     * Subscribe events once
     * @param {string|symbol} event Event name or symbol
     * @param {Function} listener
     * @returns {EventBus} this
     */
    once(event, listener) {
      if (!event) {
        throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
      }
      const data = _events[event];
      if (event in _events) {
        listener(deepClone(data));
      }
      _emmiter.once(event, data => {
        listener(deepClone(data));
      });
      return this;
    }
    /**
     * Unsubscribe events
     * @param {string|symbol} event Event name or symbol
     * @param {Function} listener
     * @returns {EventBus} this
     */
    off(event, listener) {
      if (!event) {
        throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
      }
      if (!listener) {
        throw new Error("第2个参数为回调函数引用，不能为空");
      }
      _emmiter.off(event, listener);
      return this;
    }
  };
})();