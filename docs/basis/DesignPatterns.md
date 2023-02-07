# 设计模式

[JavaScript 设计模式 es6（23 种)](https://juejin.cn/post/6844904032826294286)

![23种设计模式](https://ask.qcloudimg.com/http-save/yehe-2768794/qgyv5hince.png?imageView2/2/w/1620)

## 单例模式

限制类实例化次数只能一次，一个类只有一个实例，并提供一个访问它的全局访问点。

- 优点: 适用于单一对象，保证只生成一个对象实例，避免频繁创建和销毁实例，减少内存占用。
- 缺点: 导致了模块耦合度较高，且不适用动态扩展对象，或需创建多个相似对象的场景。

### 类实现

```js
class Boss {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  static init(name, age) {
    if (!Boss.instance) {
      return Boss.instance;
    }
    return (Boss.instance = new Boss(name, age));
  }
}

let tom = Boss.init("tom", 12);
let jerry = Boss.init("jerry", 32);

tom === jerry; // true
```

### 闭包实现

```js
let Boss = (function () {
  let instance = null;
  return function (name, age) {
    if (instance) {
      return instance;
    }
    return (instance = new (function (name, age) {
      this.name = name;
      this.age = age;
    })());
  };
})();

let a = new Boss("tom", 12);
let b = new Boss("jerry", 22);

a === b; // true
```

### 应用场景

[Vuex](https://vuex.vuejs.org/zh/index.html)是 Vue 的全局状态管理库，类似于 React 中的 Redux，理念都是来自于 Flux 架构，用一个全局的 Store 存储应用所有的状态，然后提供一些 API 供用户去读取和修改。

Vuex 部分源码：

```js
let Vue;

// ...

export function install(_Vue) {
  // 是否已经执行过了 Vue.use(Vuex)，如果在非生产环境多次执行，则提示错误
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  // 如果是第一次执行 Vue.use(Vuex)，则把传入的 _Vue 赋值给定义的变量 Vue
  Vue = _Vue;
  // Vuex 初始化逻辑
  applyMixin(Vue);
}
```

## 策略模式

策略模式通过封装了一系列算法，只要这些算法规则指向的目标一致，就可以被替换使用，符合了开闭原则。

策略模式由两部分构成：一部分是封装不同策略的策略组，另一部分是 Context。通过组合和委托来让 Context 拥有执行策略的能力，从而实现可复用、可扩展和可维护，并且避免大量复制粘贴的工作。

表单验证策略是最常见的策略模式应用场景之一，还可以了解[async-validator]()的策略设计模式，因为 element-ui 和 antd 的表单校验都是基于它封装的。

```js
// 策略组
var strategies = {
  isNonEmpty: function (value, errorMsg) {
    return value === "" || value === null ? errorMsg : true;
  },
  isMobile: function (value, errorMsg) {
    // 手机号码格式
    return !/(^1[3|4|5|7|8][0-9]{9}$)/.test(value) ? errorMsg : true;
  },
  minLength: function (value, length, errorMsg) {
    return value.length < length ? errorMsg : true;
  },
};

// Context
var loginForm = document.getElementById("login-form");

loginForm.onsubmit = function (e) {
  e.preventDefault();
  var accountIsMobile = strategies.isMobile(account, "手机号格式错误");
  var pwdMinLength = strategies.minLength(pwd, 8, "密码不能小于8位");
  var errorMsg = accountIsMobile || pwdMinLength;
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
};
```

## 迭代器模式

提供一种方法顺序遍历某个对象中的元素，而又不暴露该对象的内部表示。

应用场景：[ES6 Iterator](https://zh.javascript.info/iterable)、Array.prototype.forEach 等数组方法用到了

```js
class Iterator {
  constructor(conatiner) {
    this.list = conatiner.list;
    this.index = 0;
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++];
    }
    return null;
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false;
    }
    return true;
  }
}

class Container {
  constructor(list) {
    this.list = list;
  }
  getIterator() {
    return new Iterator(this);
  }
}

// 测试代码
let container = new Container([1, 2, 3, 4, 5]);
let iterator = container.getIterator();
console.log(iterator.next());
```

ES6 iterator

```js
let each = {
  from: 0,
  to: 10,
  next() {
    return this.current >= this.to
      ? { done: true }
      : { done: false, value: this.current++ };
  },
  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },
};
let cache = [];
for (let item of each) {
  cache.push(item);
}
```

## 观察者模式

定义了对象间一种一对多的依赖关系，当目标对象 Subject(被观察者，发布者) 的状态发生改变时，所有依赖它的对象 Observer(观察者，订阅者) 都会得到通知。

```js
// 被观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.observers = []; // 观察者 存放在被观察者中
    this.state = ["报纸", "小说", "散文"];
  }
  // 注册观察者
  attach(observer) {
    this.observers.push(...observer); // 存放所有观察者
  }
  // 通知消息
  setState(newState) {
    this.state.push(...newState);
    this.observers.forEach((o) => o.update(newState));
  }
}
// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(newState) {
    console.log(`${this.name}收到新通知: ${newState}上架了!`);
  }
}
// 被观察者
let sub = new Subject("报社");
let tom = new Observer("tom");
let jerry = new Observer("jerry");

// 观察者
sub.attach([tom, jerry]);

sub.setState(["漫画", "期刊"]);
```

## 发布订阅模式

## 中介者模式

## 享元模式

```js

```
