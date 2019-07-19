- [vue-super-eventbus](#vue-super-eventbus)
  - [Install](#Install)
  - [Usage](#Usage)
    - [On Vue entry](#On-Vue-entry)
    - [In Vue component](#In-Vue-component)
    - [In other Vue component](#In-other-Vue-component)
  - [API](#API)
  - [Functions](#Functions)
  - [emit(event, args) ⇒ <code>EventBus</code>](#emitevent-args-%E2%87%92-codeEventBuscode)
  - [share(event, args) ⇒ <code>EventBus</code>](#shareevent-args-%E2%87%92-codeEventBuscode)
  - [on(vm, event, listener) ⇒ <code>EventBus</code>](#onvm-event-listener-%E2%87%92-codeEventBuscode)
  - [once(event, listener) ⇒ <code>EventBus</code>](#onceevent-listener-%E2%87%92-codeEventBuscode)
  - [off(event, listener) ⇒ <code>EventBus</code>](#offevent-listener-%E2%87%92-codeEventBuscode)
# vue-super-eventbus
An enhanced component of Vue event bus can be automatically destroyed without manual cancellation of subscription events, modularization, immutability of event data and many other features.

## Install
``` shell
npm i --save vue-super-eventbus
```

## Usage
### On Vue entry
``` javascript
import { EventBus } from "vue-super-eventbus"

Vue.prototype.$bus = new EventBus();
```
### In Vue component
``` javascript
created() {
  this.$bus.share("login", { ok: true });
}
```
### In other Vue component
``` javascript
created() {
  this.$bus.on(this, "login", data => {
    console.log(data);
  });
  this.$bus.on(this, "login", data => {
    console.log(data);
  });
}
```
## API
## Functions

<dl>
<dt><a href="#emit">emit(event, args)</a> ⇒ <code>EventBus</code></dt>
<dd><p>Emit event</p>
</dd>
<dt><a href="#share">share(event, args)</a> ⇒ <code>EventBus</code></dt>
<dd><p>Subscribers who subscribe after the event is published can also receive the event.
It&#39;s like a global variable, but when that variable changes, all subscribers can receive a change event.</p>
</dd>
<dt><a href="#on">on(vm, event, listener)</a> ⇒ <code>EventBus</code></dt>
<dd><p>Subscribe events</p>
</dd>
<dt><a href="#once">once(event, listener)</a> ⇒ <code>EventBus</code></dt>
<dd><p>Subscribe events once</p>
</dd>
<dt><a href="#off">off(event, listener)</a> ⇒ <code>EventBus</code></dt>
<dd><p>Unsubscribe events</p>
</dd>
</dl>

<a name="emit"></a>

## emit(event, args) ⇒ <code>EventBus</code>
Emit event

**Kind**: global function  
**Returns**: <code>EventBus</code> - this  

| Param | Type                                       | Description          |
| ----- | ------------------------------------------ | -------------------- |
| event | <code>string</code> \| <code>symbol</code> | Event name or symbol |
| args  | <code>\*</code>                            | Event passed data    |

<a name="share"></a>

## share(event, args) ⇒ <code>EventBus</code>
Subscribers who subscribe after the event is published can also receive the event.
It's like a global variable, but when that variable changes, all subscribers can receive a change event.

**Kind**: global function  
**Returns**: <code>EventBus</code> - this  

| Param | Type                                       | Description          |
| ----- | ------------------------------------------ | -------------------- |
| event | <code>string</code> \| <code>symbol</code> | Event name or symbol |
| args  | <code>\*</code>                            | Event passed data    |

<a name="on"></a>

## on(vm, event, listener) ⇒ <code>EventBus</code>
Subscribe events

**Kind**: global function  
**Returns**: <code>EventBus</code> - this  

| Param    | Type                                       | Description          |
| -------- | ------------------------------------------ | -------------------- |
| vm       | <code>Vue</code>                           | Vue instance         |
| event    | <code>string</code> \| <code>symbol</code> | Event name or symbol |
| listener | <code>function</code>                      |                      |

<a name="once"></a>

## once(event, listener) ⇒ <code>EventBus</code>
Subscribe events once

**Kind**: global function  
**Returns**: <code>EventBus</code> - this  

| Param    | Type                                       | Description          |
| -------- | ------------------------------------------ | -------------------- |
| event    | <code>string</code> \| <code>symbol</code> | Event name or symbol |
| listener | <code>function</code>                      |                      |

<a name="off"></a>

## off(event, listener) ⇒ <code>EventBus</code>
Unsubscribe events

**Kind**: global function  
**Returns**: <code>EventBus</code> - this  

| Param    | Type                                       | Description          |
| -------- | ------------------------------------------ | -------------------- |
| event    | <code>string</code> \| <code>symbol</code> | Event name or symbol |
| listener | <code>function</code>                      |                      |

