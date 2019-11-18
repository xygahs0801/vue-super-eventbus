const Emmiter = require("events");
function deepClone(obj) {
    if (!obj || true == obj) return obj;
    var objType = typeof obj;
    if ("number" == objType || "string" == objType) return obj;
    var result = Array.isArray(obj) ? [] : !obj.constructor ? {} : new obj.constructor();
    if (obj instanceof Map) for (var key of obj.keys()) result.set(key, deepClone(obj.get(key)));
    for (var key in obj) if (obj.hasOwnProperty(key)) result[key] = deepClone(obj[key]);
    return result;
}
export const EventBus = (() => {
    const _emmiter = new Emmiter();
    const _events = {};
    const _subs = {};
    let _debug = false;
    return class EventBus {
        constructor({ debug = false } = {}) {
            _debug = debug;
        }
        /**
         * Emit event
         * @param {string|symbol} event Event name or symbol
         * @param {*} args Event passed data
         * @returns {EventBus} this
         */
        emit(event, ...args) {
            if (_debug) {
                console.log("EventBus: EventBus -> emit -> ...args", ...args);
            }
            if (!event) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            _emmiter.emit(event, ...args);
            return this;
        }
        /**
         * Subscribers who subscribe after the event is published can also receive the event.
         * It's like a global variable, but when that variable changes, all subscribers can receive a change event.
         * @param {string|symbol} event Event name or symbol
         * @param {*} args Event passed data
         * @returns {EventBus} this
         */
        share(event, ...args) {
            if (_debug) {
                console.log("EventBus: EventBus -> share -> ...args", ...args);
                console.log("EventBus: EventBus -> share -> event", event);
            }
            if (!event) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            _events[event] = args;
            _emmiter.emit(event, ...args);
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
            let self = this;
            if (_debug) {
                console.log("EventBus: EventBus -> on -> vm", vm);
                console.log("EventBus: EventBus -> on -> event", event);
                console.log("EventBus: EventBus -> on -> listener", listener);
            }
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
            let listenerHandle = (...data) => {
                listener(...deepClone(data));
            };
            _subs[vm._uid][event].push(listenerHandle);
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
                listenerHandle(...data);
            }
            _emmiter.on(event, listenerHandle);
            return this;
            function beforeDestroyHandle() {
                for (const event in _subs[vm._uid]) {
                    const listeners = _subs[vm._uid][event];
                    for (const listener of listeners) {
                        self.off(event, listener);
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
            if (_debug) {
                console.log("EventBus: once -> event", event);
                console.log("EventBus: once -> listener", listener);
            }
            if (!event || (typeof event !== "string" && typeof event !== "symbol")) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            const data = _events[event];
            let listenerHandle = (...data) => {
                listener(...deepClone(data));
            };
            if (event in _events) {
                listenerHandle(...data);
            }
            // _emmiter.once(event, () => {
            //   listenerHandle()
            // });
            _emmiter.once(event, listenerHandle);
            return this;
        }
        /**
         * Unsubscribe events
         * @param {string|symbol} event Event name or symbol
         * @param {Function} listener
         * @returns {EventBus} this
         */
        off(event, listener) {
            if (_debug) {
                console.log("EventBus: off -> event", event);
                console.log("EventBus: off -> listener", listener);
            }
            if (!event) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            if (!listener) {
                throw new Error("第2个参数为回调函数引用，不能为空");
            }
            _emmiter.off(event, listener);
            return this;
        }
        inspect() {
            console.log("EventBus: -> inspect", { _emmiter, _events, _subs, debug: _debug });
        }
    };
})();
