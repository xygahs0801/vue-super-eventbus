const Emmiter = require("events");
export default (() => {
    const _emmiter = new Emmiter();
    const _events = {};
    const _subs = {};
    let _debug = false;
    class EventBus {
        constructor({ debug = false } = {}) {
            _debug = debug;
        }
        emit(event, ...args) {
            if (_debug) {
                console.log("EventBus: -> share -> ...args", ...args);
                console.log("EventBus: -> share -> event", event);
            }
            if (!event) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            _emmiter.emit(event, ...args);
            return this;
        }
        share(event, ...args) {
            if (_debug) {
                console.log("EventBus: -> share -> ...args", ...args);
                console.log("EventBus: -> share -> event", event);
            }
            if (!event) {
                throw new Error("第1个参数为事件名，String或者Symbol类型，不能为空");
            }
            _events[event] = args;
            _emmiter.emit(event, ...args);
            return this;
        }
        on(vm, event, listener) {
            let self = this;
            if (_debug) {
                console.log("EventBus: -> on -> vm", vm);
                console.log("EventBus: -> on -> event", event);
                console.log("EventBus: -> on -> listener", listener);
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
                listener(...data);
            };
            _subs[vm._uid][event].push(listenerHandle);
            const data = _events[event];
            if (event in _events) {
                listenerHandle(...data);
            }
            _emmiter.on(event, listenerHandle);
            return this;
        }
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
                listener(...data);
            };
            if (event in _events) {
                listenerHandle(...data);
            } else {
                _emmiter.once(event, listenerHandle);
            }
            return this;
        }
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
        install(Vue, options = { debug: false, injectName: "$bus" }) {
            const self = this;
            Vue.prototype[options.injectName] = self;
            _debug = !!options.debug;
            Vue.mixin({
                mounted: function() {
                    if (this.$options.on && typeof this.$options.on === "object") {
                        for (const key in this.$options.on) {
                            if (this.$options.on.hasOwnProperty(key)) {
                                const listener = this.$options.on[key].bind(this);
                                self.on(this, key, listener);
                            }
                        }
                    }
                },
                beforeDestroy() {
                    for (const event in _subs[this._uid]) {
                        const listeners = _subs[this._uid][event];
                        for (const listener of listeners) {
                            self.off(event, listener);
                        }
                    }
                    delete _subs[this._uid];
                }
            });
        }
    }
    return new EventBus();
})();
