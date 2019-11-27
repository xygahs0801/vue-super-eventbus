- [vue-super-eventbus](#vue-super-eventbus)
  - [Install](#install)
  - [Usage](#usage)
    - [On Vue entry](#on-vue-entry)
    - [In Vue component](#in-vue-component)
    - [In other Vue component](#in-other-vue-component)
# vue-super-eventbus
An enhanced component of Vue event bus can be automatically destroyed without manual cancellation of subscription events, modularization, immutability of event data and many other features.

## Install
``` shell
npm i --save vue-super-eventbus
```

## Usage
### On Vue entry
``` javascript
import EventBus from "vue-super-eventbus"
Vue.use(EventBus)
```
### In Vue component
``` javascript
// Recommend
on:{
  event1(data){
    // handle data
    console.log(data)
  },
  event2(data){
    // handle data
    console.log(data)
  }
},
// Or
created() {
  this.$bus.on(this, "event1", data => {
    // handle data
    console.log(data);
  });
  this.$bus.on(this, "event2", data => {
    // handle data
    console.log(data);
  });
},
```
### In other Vue component
``` javascript
created() {
  this.$bus
    .emit("event1", 'test message')
    .emit("event2", { message: "test json message" });
}
beforeDestroy() {
  // No need to off the event, The lib take care of this for you.
}
```