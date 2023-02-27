# Vue3+vite+ts+pinia

Vue 核心 [MVVM](https://www.liaoxuefeng.com/wiki/1022910821149312/1108898947791072)

## 第一章：简介

MVVM（Model-View-ViewModel）架构

- 『View』：视图层（UI 用户界面）
- 『ViewModel』：业务逻辑层（一切 js 可视为业务逻辑）
- 『Model』：数据层（存储数据及对数据的处理如增删改查）

Vue2 与 Vue3 的区别
![Options API、Composition API](https://img-blog.csdnimg.cn/img_convert/e8ad905d83aaec45451797517ef453aa.png)

Vue3 新特性：

- 重写了双向数据绑定
- 提升了 ViewModel 性能瓶颈
- fragments
- 支持 TREE-Shaking
- Composition API

### 重写了双向绑定：

vue2 —— 基于 Object.defineProperty get 和 set 方法实现，数组的话是重写了原型方法，如 push、pop、splice 等（源码：Observer/index.js）
vue3 —— 基于 ES6 的 Proxy（源码地址：reactive/reactive.ts）

proxy 与 Object.defineProperty(obj, prop, desc)方式相比有以下优势：

```js
//丢掉麻烦的备份数据
//省去for in 循环
//可以监听数组变化
//代码更简化
//可以监听动态新增的属性；
//可以监听删除的属性 ；
//可以监听数组的索引和 length 属性（vue2直接修改数组length是监听不到的）

let proxyObj = new Proxy(obj, {
  get: function (target, prop) {
    return prop in target ? target[prop] : 0;
  },
  set: function (target, prop, value) {
    target[prop] = 888;
  },
});
```

### 优化了 VDOM

工具网站：[Vue Template Explorer ](https://vue-next-template-explorer.netlify.app/)

对于动态属性或动态标签，会添加如 TEXT、PROPS 等标记，对于静态标签会利用 [PatchFlags](https://juejin.cn/post/6968585717924495368)（diff 算法底层）做静态标记，对比时不会做全量对比。

### fragments

Vue3 中可以由多个根标签，底层原理时给这些增加了一个虚拟节点，这个虚拟节点不会被渲染。
同时支持 TSX 和 JSX 的写法。
同时新增了 Suspense teleport 和 多 v-model 用法。

### Vue3 Tree shaking

简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码

而 Vue3 源码引入 tree shaking 特性，将全局 API 进行分块。如果你不使用其某些功能，它们将不会包含在你的基础包中 ，
如` import {watch} from 'vue'`， 除了 watch 其他的 computed 没用到就不会给你打包减少体积，
但在 Vue2 中，无论我们使用 a 功能，a,b 模块会出现打包在生产代码中。
主要原因是 Vue 实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到

### Vue 3 Composition Api

新增了 setup 函数和 Setup 语法糖模式

## 第二章：环境配置

安装[Node.js]()环境，安装完成检测：node 版本`node -v`和包管理工具检测 `npm -v`

补充:也可以使用[nvm](https://nvm.uihtm.com/)管理 node 环境,安装完成检测本地 node 已安装环境：`nvm list`，切换 node 版本 适用`nvm use 14.19.3`
注意：nvm 安装路径不能有中文和空格；已有的 node 需要卸载后再安装 nvm

构建项目
方式 1（vite 构建）：

```cmd
C:\Users\Mrnianj\Desktop\test>npm init vite@latest
Need to install the following packages:
  create-vite@latest
Ok to proceed? (y) y
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'create-vite@4.0.0',
npm WARN EBADENGINE   required: { node: '^14.18.0 || >=16.0.0' },
npm WARN EBADENGINE   current: { node: 'v15.10.0', npm: '7.5.3' }
npm WARN EBADENGINE }
√ Project name: ... vite-project
√ Select a framework: » Vue
√ Select a variant: » TypeScript

Scaffolding project in C:\Users\Mrnianj\Desktop\test\vite-project...

Done. Now run:

  cd vite-project
  npm install
  npm run dev
```

方式 2（vue 脚手架构建,配置项较多）：

```cmd
C:\Users\Mrnianj\Desktop\test>npm init vue@latest
Need to install the following packages:
  create-vue@latest
Ok to proceed? (y) y
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'create-vue@3.5.0',
npm WARN EBADENGINE   required: { node: '^14.18.0 || >=16.0.0' },
npm WARN EBADENGINE   current: { node: 'v15.10.0', npm: '7.5.3' }
npm WARN EBADENGINE }

Vue.js - The Progressive JavaScript Framework

√ Project name: ... vue-project
√ Add TypeScript? ... No / Yes
√ Add JSX Support? ... No / Yes
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add Vitest for Unit Testing? ... No / Yes
√ Add an End-to-End Testing Solution? » Playwright
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes

Scaffolding project in C:\Users\Mrnianj\Desktop\test\vue-project...

Done. Now run:

  cd vue-project
  npm install
  npm run lint
  npm run dev
```

### Node.js 底层原理

Node.js 主要由 V8、[Libuv](https://github.com/libuv/libuv#) 和第三方库组成：

V8：实现 JS 解析、执行和支持自定义拓展，得益于 V8 支持自定义拓展，才有了 Node.js。
Libuv：跨平台的异步 IO 库，但它提供的功能不仅仅是 IO，还包括进程、线程、信号、定时器、进程间通信，线程池等。
第三方库：异步 DNS 解析（ cares ）、HTTP 解析器（旧版使用 http_parser，新版使用 llhttp）、HTTP2 解析器（ nghttp2 ）、 解压压缩库( zlib )、加密解密库( openssl )等等。

![Node.js 架构](https://img-blog.csdnimg.cn/d3718cc40bd74ad884adb38d07a5b0cb.png)

核心：[Libuv](https://github.com/libuv/libuv)

## 第三章：目录文件结构、FS 和 VS Code 插件

文件结构
public - 静态资源，不会被 vite 编译
src/assets - 静态资源
src/components - Vue 组件
src/App.vue - 全局入口文件
main.ts - 全局 ts 文件
vite-end.d.ts - .vue 声明文件扩充（ts 不认识.vue 文件,通过 declare module 实现）
index.html - vite 入口文件，通过 ES module 的形式（引入之后拦截，去做一些处理）
package.json - 全局依赖、命令等
tsconfig.json - ts 配置文件
vite.config.json - vite 配置文件（vite 基于 esbuild 进行编译、打包是基于 rollup 的）

SFC（单文件组件），

- template，只能出现一个，
- style，可以出现多个
- script，setup 形式只能出现一个

VS Code 插件推荐：
`Vue language Features(volar)`（与 vue2 的`vetur`冲突）和`TypeScript Vue Plugin(volar)`

npm run dev 命令执行的过程：
npm run dev ---> package.json/scripts/dev ---> vite ---> bin（软链接）-->node modules/.bin/vite（跨平台兼容） --> npm install -g（全局包）--> 环境变量 --> Error

## 第四章：模板语法和 vue 指令

### script 的三种书写风格：

1. Vue3 依然支持 Vue2 option API 的书写风格：
   ```vue
   <script>
   export default {
     data() {
       return {};
     },
     methods: { fun() {} },
   };
   </script>
   ```
2. setup 函数模式（注意：局部变量、函数必须 return，才能被模板字符串解析）
   ```vue
   <script>
   export default {
     setup() {
       const a = 1;
       return {
         a, // setup返回变量a，就可以在模板中直接使用
       };
     },
   };
   </script>
   ```
3. setup 语法糖模式（不用手动 return）
   ```vue
   <script setup lang="ts">
   const a: number = 1;
   </script>
   ```

### 模板语法

模板语法支持简单运算、三元表达、API 方法等，示例如下

```vue
<template>
  <div class="container">
    {{ arr.reduce((a, b) => a + b, 0) }}
  </div>
</template>
<script setup lang="ts">
const arr: number[] = [1, 2, 3, 4, 5];
</script>
```

### Vue 指令

v-bind: ，绑定元素 prop、style、class，语法糖可以使用:替换 v-bind:

```vue
<template>
  <div class="container">
    <!-- 动态class-->
    <div :class="[isRed ? 'red' : 'blue']"></div>
    <!-- class动态绑定，绑定style-->
    <div :class="Red" class="main,red" :style="border"></div>
  </div>
</template>

<script setup lang="ts">
const Red: string = "red";
const isRed: boolean = true;
const border = "border:1px solid #ccc";
</script>

<style>
.red {
  width: 100px;
  height: 100px;
  background-color: red;
}
.blue {
  width: 100px;
  height: 100px;
  background-color: blue;
}
</style>
```

v-model: ，双向绑定

```vue
<template>
  <input type="text" v-model="input" />
  <p>content：{{ input }}</p>
</template>
<script setup lang="ts">
const input: string = "请输入";
</script>
```

注意：只有使用 ref 或 reactive 所包裹起来的值才是响应式的。

```vue
<script setup lang="ts">
import { ref } from "vue";
const input: string = ref("请输入");
</script>
```

v-for: 遍历,支持嵌套循环，注意 key 属性的用法

```vue
<template>
  <div v-for="(item, index) in arr" :key="index">{{ item }}-{{ index }}</div>
</template>
<script setup lang="ts">
const arr: string[] = ["a", "b", "c"];
</script>
```

- v-once，添加了此属性的元素只会被渲染一次
- v-memo，Vue3.2 新增的内置指令，类似与 v-once，大致的作用就是小幅度手动提升一部分性能，一般是配合 v-for 使，[Vue3.2 新增 v-memo](https://juejin.cn/post/7180973915580137527)

- v-text: ，与{{}}效果相似，
- v-html: ，可以解析 html 标签，不支持组件

- v-if: ，容器的显示隐藏,将元素变为注释节点，直接控制 dom
- v-else-if: ，...
- v-else: ，...
- v-show: ，容器的显示隐藏，比 v-if 性能更高，只是控制样式 display:none

- v-on: ， 绑定事件，语法糖使用@替换 v-on:，动态事件`@[event]='xxx'`
  内置修饰符：
- .stop - 阻止冒泡事件
- 更多其它指令见[官网文档 v-on](https://cn.vuejs.org/api/built-in-directives.html#v-on)

## 第五章：虚拟 dom 和 diff 算法

虚拟 DOM：就是通过 js 生成的一个 AST 抽象语法树，这种思路在 TS 转 JS、babel 插件中 ES6 转 ES5 的过程中，甚至 V8 引擎在 js 解析为字节码的过程中也会进行 AST 转换。

Vue3 AST 在线解析:[Vue 3 Template Explorer](https://template-explorer.vuejs.org/)，通过这个网址我们可以看到，使用 js 描述 Dom 对象，这种方式不仅方便且节省性能，还可以进行算法优化和节点复用。

⭐ diff 算法源码讲解：[diff 算法](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=6&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=216)

## 第六章 Ref

[响应式 API：核心](https://cn.vuejs.org/api/reactivity-core.html)

Vue2 中通过 data 函数返回对象实现响应式数据，在 Vue3 中，只有被 ref 或者 reactive 系列包裹的值才可以做到响应式。

```vue
<template>
  <div>{{ data.arr }}</div>
  <button @click="click">click</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
type D = {
  type: string;
  arr: number[];
};
let data = ref<D>({ type: "xxx", arr: [1, 2, 3] }); // 泛型的方式，简单类型
let click = function () {
  // js中通过.value读写值
  data.value.arr.push(10);
};
</script>
```

ref 会返回了一个 ES6 类，他有一个属性 value。在取值或者修改时，必须加 .value 的形式读写值。

复杂类型推荐使用 Ref（首字母大写），如下：

```vue
<template>
  <div>{{ data.arr }}</div>
  <button @click="click">click</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
type D = {
  type: string;
  arr: number[];
};
let data: Ref<D> = ref({ type: "xxx", arr: [1, 2, 3] }); // interface 复杂类型
let click = function () {
  data.value.arr.push(Math.floor(Math.random() * 10));
};
</script>
```

其它 ref 指令

- `import type { isRef } from 'vue'`可以判断是否为 ref 响应式对象
- `import type { shallowRef } from 'vue'`只能做浅层响应，只到.value 层级
- `import type { triggerRef } from 'vue'`强制更新收集的依赖，ref 底层会调用这个 triggerRef
- ❗ 注意：shallowRef 和 ref 不能混用，因为 ref 更新时会强势更新 shallowRef 的视图（ref 底层更新是会调用 triggerRef，会强制更新收集的依赖）。
- `import type { customRef } from 'vue'`可以创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

  ```vue
  <template>
    <div>{{ obj }}</div>
    <button @click="click">click</button>
  </template>

  <script setup lang="ts">
  import { customRef } from "vue";
  function myRef<T>(value: T) {
    return customRef((track, triger) => {
      let timer: any;
      return {
        get() {
          track(); // 收集依赖
          return value;
        },
        set(newVal) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            value = newVal;
            clearTimeout(timer);
            triger(); // 触发依赖
          }, 500);
        },
      };
    });
  }

  let obj = myRef<String>("初始文本");

  let click = function () {
    obj.value = "customRef 更改了";
  };
  </script>
  ```

ref 的另一种用法：被用来获取 dom 元素，如下：

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const strBox = ref<HTMLDivElement>(); // 常量名和标签ref属性值需一致

onMounted(() => {
  console.log(strBox.value?.innerText);
});
</script>

<template>
  <div ref="strBox">JavaScript...</div>
</template>
```

⭐ ref 源码讲解：[ref 源码](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=7&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=986)

## 第七章 Reactive

ref 和 reactive 都是用来创建响应式对象的，两者的区别在于：

1. ref 支持所有类型，reactive 只支持引用类型（Arr、Object、Map、Set）
2. ref 取值赋值都需要以.value 的形式 ，reactive 可以直接读写值

❗ 注意：reactive 是通过 proxy 代理的对象，不能被直接赋值，arr 类型一般使用方法进行增删改操作（方法 1），或将数组作为对象属性包装一层（方法 2）

补充：

- `import { readonly } from "vue"`，readonly 可以将 reactive 代理的对象变为只读，无法重新赋值，但是可被原始对象影响，原始对象更改也会 readonly 对象。
- `import { shallowReactive } from "vue"`，shallowReactive 也是响应式浅层的，只到第一层数据，也会被 reactive 影响，所以不能混用。

❗ 注意：shallowReactive 和 reactive 也是不能混用

Reactive 源码[reactive 源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=8&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=817)

## 第八章：ToRef、ToRefs、ToRaw

ToRef 应用场景：可以将对象的某个属性包装成为一个响应式对象提供给外部使用，而不用暴露整个对象。经常将 toRef 作为函数参数传递，并做到响应式对象视图更新

```vue
<script setup lang="ts">
import { ref, reactive, toRef, toRefs, toRaw } from "vue";
const tom = { name: "tom", age: 28 };
const tomName = toRef(tom, "age");
// toRef 只能修改响应式对象的值，对非响应式视图毫无影响
const changeTom = () => {
  tomName.value = Math.floor(Math.random() * 100);
};

const jerry = reactive({ name: "jerry", age: 28 });
const JerryAge = toRef(jerry, "age");
// 可以做到响应式更新
const changeJerry = (obj) => {
  JerryAge.value = Math.floor(Math.random() * 100);
};
</script>

<template>
  <h1>{{ tom.name + "--" + tom.age }}</h1>
  <button @click="changeTom">change tom age</button>
  <hr />
  <h1>{{ jerry.name + "--" + jerry.age }}</h1>
  <button @click="changeJerry">change jerry age</button>
</template>
```

理解：相当于解构，但是解构出来的对象是响应式的

⭐ toRefs 源码实现非常简单

```ts
const toRefs = <T extends object>(object: T) => {
  const map: any = {};
  for (let key in object) {
    map[key] = toRef(object.key);
  }
  return map;
};
```

toRefs 一般被用于复杂对象，常搭配对象解构，示例如下：

```vue
<script setup>
import { reactive, toRefs } from "vue";
const person = reactive({ name: "tom", age: 18 });
let { name, age } = toRefs(person);
let change = () => {
  age.value = Math.floor(18 + Math.random() * 82);
  name.value = Math.random().toString(36).slice(2);
};
</script>

<template>
  <div>{{ person }}</div>
  <button @click="change">change</button>
</template>
```

toRaw 应用场景：将一个对象脱离响应式包装，底层是通过 \_\_v_raw 属性，此属性并不会暴露给开发者使用。

⭐ [toRaw 源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=9&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=709)

## 第八章番外：响应式原理 （未完善）

推荐阅读
[Vue.js 设计与实现-第二篇 Vue 响应系统]()、
[Vue 官网 深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)、
[小满视频版讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=10)

基本原理:创建了一个用于存储副作用函数的桶，接着通过 proxy 代理对象，并设置 getter 和 setter，getter 中将副作用函数添加到桶中和 setter 中拿出副作用桶中的函数执行。

```js
let bucket = new Set();

let data = { msg: "hello" };

data = new Proxy(data, {
  // 拦截读取
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect);
    // 返回属性值
    return data[key];
  },
  // 拦截设置
  set(target, key, value) {
    target[key] = value;
    // 把副作用函数从桶里取出并执行
    bucket.forEach((fn) => fn());
    // 返回 true 代表设置操作成功
    return true;
  },
});
```

## 第九章 computed 计算属性

基本使用：

```vue
<script setup>
import { ref, computed } from "vue";
let firstName = ref("a");
let lastName = ref("b");
// 1. 函数写法

// 2. 对象写法
const name = computed({
  get() {
    return `${firstName.value}---${lastName.value}`;
  },
  set(newVal) {
    let [last, first] = newVal.split(" ");
    lastName = ref(last);
    firstName = ref(first);
  },
});
</script>

<template>
  <div>{{ name }}</div>
  <input v-model="firstName" />
  <input v-model="lastName" />
</template>
```

## 第十章 watch 侦听器

```vue
<script setup lang="ts">
import { ref, watch } from "vue";

let msg = ref("hello");
let msg1 = ref("world");
// 1. 为单个属性添加侦听器
watch(msg, (newVal, oldVal) => {
  console.log(newVal, oldVal);
});
// 2. 为多个属性添加侦听器（数组形式）
watch([msg, msg1], (newVal, oldVal) => {
  console.log(newVal, oldVal);
});
</script>
```

### 深度监视，

vue3 中需要注意 newVal 和 oldVal 是相同的，后面会解释（源码 job 之后，新旧值是直接赋值）

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
let data = ref({
  foo: { name: "tom", age: 18 },
});
// 深度监视
watch(
  data,
  (newVal, oldVal) => {
    // newVal和oldVal 是相同的！！！
    console.log(newVal, oldVal);
  },
  {
    // active 底层会默认开启
    deep: true,
    immediate: true,
    flush: "pre", // watch回调执行时机：pre 组件更新之前执行; async 同步执行; post 组件更新之后执行
  }
);
</script>
```

### 监视对象的某个属性，而非监视整个对象

```vue
<script setup lang="ts">
import { watch, reactive } from "vue";
let data = reactive({
  foo: { name: "tom", age: 18 },
});
// 监视单一属性 官方推荐使用函数返回
watch(
  () => data.foo.name,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
  }
);
</script>
```

⭐ 源码讲解[watch 源码](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=12&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=409)

## 第十一章 watchEffect 高级侦听器

```vue
<script setup lang="ts">
import { ref, watchEffect } from "vue";
let data = ref({
  foo: { name: "tom", age: 18 },
});
// watchEffect会返回一个停止函数
const stop = watchEffect(
  (oninvalidate) => {
    // 需要监听的属性直接在回调函数中使用即可，会自动监听，而且是非惰性的，挂载完成后会自动调用
    console.log("data ==>", data.value);
    // oninvalidate 会在更新前被调用，无关oninvalidate函数位置
    oninvalidate(() => {
      console.log("before");
    });
  },
  {
    // 可以有更多配置项
    flush: "post", // 侦听时机
    // 提供了一个调试函数
    onTrigger(e) {
      debugger;
    },
  }
);
</script>

<template>
  <input v-model="data.foo.name" />
  <input v-model="data.foo.age" />
  <button @click="stop">停止监听</button>
</template>
```

## 第十二章 生命周期

```vue
<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onRenderTracked,
  onRenderTriggered,
} from "vue";

// 1. setup 语法糖模式中，beforeCreate created 被屏蔽了(直接在setup函数中可以替代)
console.log("setup");

// 2. 创建前
onBeforeMount(() => {
  console.log("创建之前");
});
// 3. 创建后
onMounted(() => {
  console.log("创建之后");
});
// 4.更新前
onBeforeUpdate(() => {
  console.log("更新之前");
});
// 5.更新后
onUpdated(() => {
  console.log("更新之后");
});
// 6. 卸载前
onBeforeUnmount(() => {
  console.log("卸载前");
});
// 7. 卸载前
onUnmounted(() => {
  console.log("卸载后");
});
// 两个特殊钩子
// 8. 收集依赖钩子
onRenderTracked((e) => {});
// 9. 触发依赖钩子
onRenderTriggered((e) => {});

const msg = ref("张三");
const change = () => {
  msg.value = "李四篡位";
};
</script>
<Comp />
<template>
  <div>{{ msg }}</div>
  <button @click="change">change</button>
</template>
```

❗ 注意：nextTick 是异步的，生命周期都是同步的，nextTick 执行的时候生命周期早就执行过一遍了

⭐ [生命周期源码](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=14&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=665)

## 第十三章 实操组件和认识 less、scoped

[Vue.js - SFC 语法定义](https://cn.vuejs.org/api/sfc-spec.html)

实现经典两栏后台管理系统基本布局,文件结构如下：

```
Layout
|
|- Content -- index.vue
|
|- Header -- index.vue
|
|- Menu -- index.vue
|
|_ index.vue
```

### 预处理器-less

在 vue 中使用 lang 这个 attribute 来声明预处理器语言，下面演示[less](https://less.bootcss.com/)

❗ 注意：使用 vite 构建的项目，不需要安装 less-loader，

less 预处理器基本语法:

```html
<div class="content">
  <div class="content-item"></div>
</div>
```

```less
@primary-color: #333;
.content {
  display: flex;
  flex-direction: column;
  &-item {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid @primary-color;
  }
}
```

⭐ scoped 属性可以实现样式隔离，底层会给元素添加 data-v-xxx 的唯一属性，底层使用 PostCSS 实现。

[vue.js-组件作用域 CSS](https://cn.vuejs.org/api/sfc-css-features.html#scoped-css)、
[scoped 原理](https://juejin.cn/post/7098569051860893709)

## 第十四章 父子组件传参

### 父传子（defineProps）

index.vue 父组件传递参数

```vue
<template>
  <Menu :data="menuData"></Menu>
</template>

<script setup lang="ts">
import Menu from "./Menu/index.vue";

const menuData = [
  { name: "A", code: Math.random().toString(36).slice(2) },
  { name: "B", code: Math.random().toString(36).slice(2) },
  { name: "C", code: Math.random().toString(36).slice(2) },
];
</script>
```

Menu 子组件接收参数（js 形式）

```vue
<template>
  <ul>
    <li v-for="item in data" :key="item.code">{{ item.name }}</li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    default: [{ name: "默认内容", code: "xxxx" }],
  },
});

// 模板语法中可以直接使用，js中使用需要接收defineProps返回值.的形式
console.log(props.data);
</script>
```

Menu 子组件接收参数（ts 泛型字面量模式更加简单）

```vue
<template>
  <div class="menu">
    <div class="log">XXX log</div>
    <ul>
      <li v-for="item in data" :key="item.code">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// ts形式（无默认值）
// let props = defineProps<{data:object[]}>()
// console.log(props.data)

// ts形式（有默认值）,需要使用ts特有的 withDefaults 设置默认值
let props = withDefaults(defineProps<{ data: object[] }>(), {
  // 对于复杂类型默认值推荐使用函数返回值
  data: () => [{ name: "默认", code: Math.random().toString(36).slice(2) }],
});
console.log(props.data[0]);
</script>
```

### 子传父（defineEmits）

Menu 子组件传递参数（js 形式）

```vue
<template>
  <div class="menu">
    <ul>
      <li v-for="item in data" :key="item.code" @click="send(item.code)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// 接收父组件参数
let props = withDefaults(defineProps<{ data: object[] }>(), {
  data: () => [{ name: "默认", code: Math.random().toString(36).slice(2) }],
});

const emits = defineEmits(["on-click"]);
// 子组件传值给父组件
const send = (code: string) => {
  // 这里参数可以传多个，但第一个不能省略
  emits("on-click", code, "this is Child Component.");
};
</script>
```

父组件接收参数

```vue
<template>
  <div class="layout">
    <Menu :data="menuData" @on-click="getCode"></Menu>
  </div>
</template>

<script setup lang="ts">
import Menu from "./Menu/index.vue";

const menuData = [
  { name: "A", code: Math.random().toString(36).slice(2) },
  { name: "B", code: Math.random().toString(36).slice(2) },
];

// 接收子组件参数
const getCode = (...data: any) => {
  console.log(data);
};
</script>
```

Menu 子组件传递参数（ts 形式）

```vue
<template>
  <div class="menu">
    <ul>
      <li v-for="item in data" :key="item.code" @click="send(item.code)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
let props = withDefaults(defineProps<{ data: object[] }>(), {
  data: () => [{ name: "默认", code: Math.random().toString(36).slice(2) }],
});

// 子组件传值给父组件（ts形式）
const emit = defineEmits<{
  (e: "on-click", code: string): void;
}>();

let send = (code: string) => {
  emit("on-click", code);
};
</script>
```

### defineExpose 暴露子组件属性或方法给父组件

应用场景: [element 的 from 组件](https://element-plus.org/zh-CN/component/form.html#%E8%A1%A8%E5%8D%95%E6%A0%A1%E9%AA%8C)用到了 defineExpose 传递参数

子组件暴露属性/方法

```vue
<script setup lang="ts">
// 3.1 暴露一些子组件的属性或方法给父组件
defineExpose({
  name: "this is menu",
  open: (...current: any) => {
    console.log(current.shift());
  },
});
</script>
```

父组件接收属性并调用方法

```vue
<template>
  <Menu ref="menuCom"></Menu>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Menu from "./Menu/index.vue";
// 接收子组件暴露的属性和方法，此处常量名和组件ref属性值需要保持一致
const menuCom = ref<InstanceType<typeof Menu>>();

onMounted(() => {
  // 访问值
  console.log(menuCom.value?.name);
  // 调用方法
  menuCom.value.open(1, 2, 3);
});
</script>
```

案例 [封装一个瀑布流插件案例讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=16&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=703)

js 实现思路：利用绝对定位，计算每张图片的 top、left，先放置第一列数据，并将第一列的高度为维护一个数组，循环在最低高度添加下一张图片。

## 第十五章 全局组件、递归组件和局部组件

在 Vue3 setup 模式中组件引入是开箱即用的，不再需要注册，import 引入即可在 template 被使用。

### 全局组件

全局组件需要在 main.js 中注册，才能在此项目下所有组件中使用：

```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// 引入全局组件
import Card from "./components/expame/Card.vue";

// 链式调用 注册全局组件并挂载
createApp(App).component("Card", Card).mount("#app");
```

批量注册全局组件可以借鉴[element 的循环注册](https://element-plus.org/zh-CN/component/icon.html#%E6%B3%A8%E5%86%8C%E6%89%80%E6%9C%89%E5%9B%BE%E6%A0%87)的方式

### 递归组件

父组件:

```vue
<template>
  <TreeVue :data="data"></TreeVue>
</template>

<script setup lang="ts">
import TreeVue from "./components/Tree.vue";

const data = [
  {
    name: "A",
    checked: false,
  },
  {
    name: "B",
    checked: true,
    children: [
      {
        name: "B-1",
        checked: false,
        child: [{ name: "B-1-1", checked: true }],
      },
      {
        name: "B-2",
        checked: false,
        child: [{ name: "B-2-1", checked: true }],
      },
    ],
  },
];
</script>
```

见如下，直接使用当前组件名递归（方式 1）

```vue
<template>
  <div v-for="item in data" class="tree">
    <input type="checkbox" :checked="item.checked" /><span>{{
      item.name
    }}</span>
    <!-- 组件内直接使用当前组件名作为递归组件 -->
    <Tree v-if="item?.children?.length" :data="item?.children"></Tree>
  </div>
</template>

<script setup lang="ts">
interface Tree {
  name: String;
  checked: boolean;
  children?: Tree[];
}

defineProps<{
  data: Tree[];
}>();
</script>
```

使用 script 标签递归（方式 2）

```vue
<template>
  <div v-for="item in data" class="tree">
    <input type="checkbox" :checked="item.checked" />
    <span>{{ item.name }}</span>
    <MyTreeVue v-if="item?.children?.length" :data="item?.children"></MyTreeVue>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Tree {
  name: String;
  checked: boolean;
  children?: Tree[];
}

defineProps<{
  data: Tree[];
}>();
</script>

<!-- vue支持再写一个script标签在递归组件中重命名并导出当前组件 -->
<script lang="ts">
export default {
  name: "MyTreeVue",
};
</script>
```

使用第三方依赖（方式 3）
[unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options)

递归组件添加事件，❗ 注意阻止事件冒泡和使用$event 传递事件源

```vue
<template>
  <div v-for="item in data" class="tree">
    <input
      type="checkbox"
      :checked="item.checked"
      @click.stop="clickTap(item, $event)"
    />
    <span>{{ item.name }}</span>
    <Tree v-if="item?.children?.length" :data="item?.children"></Tree>
  </div>
</template>

<script setup lang="ts">
// ...
const clickTap = (item: Tree, e: HTMLInputElement) => {
  console.log(item, e);
};
</script>
```

## 第十六章 动态组件

[vue.js-动态组件](https://cn.vuejs.org/guide/essentials/component-basics.html#dynamic-components)

多个组件使用同一个挂载点，并做到动态切换,下面是一个简单天气组件 table 切换的案例

```vue
<template>
  <div class="weather">
    <header>
      <div
        @click="switchCom(item, index)"
        :class="[active == index ? 'active' : '']"
        v-for="(item, index) in data"
        :key="index"
      >
        {{ item.name }}
      </div>
    </header>
    <section>
      <component :is="comId"></component>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import TodayVue from "./Today.vue";
import TomorrowVue from "./Tomorrow.vue";

let comId = ref(TodayVue);
let active = ref(0);

const data = reactive([
  {
    name: "今天",
    com: TodayVue,
  },
  {
    name: "明天",
    com: TomorrowVue,
  },
]);

let switchCom = (item: object, index: number) => {
  comId.value = item.com;
  active.value = index;
};
</script>

<style scoped lang="less">
@border: #ccc;
.weather {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 200px;
  border: 1px solid @border;
  border-radius: 8px;
  padding: 5px;
  box-shadow: #cccccc 1px 1px;
  cursor: pointer;
  header {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid @border;
  }
  section {
    flex: 1 1 auto;
    padding: 5px 2px;
  }
}
.active {
  background-color: #adc181;
  color: #3b2121;
}
</style>
```

❗ 注意：如果按照上面的做了依然会出现警告，这是因为 ref 对组件内部也做了 proxy 代理，这是不必要的，且带来了性能浪费。
因此需要 shallowRef（代理外面一层）或 markRaw（添加**skip**属性，reactive 碰到此属性会跳过 proxy 代理）

```js
import { shallowRef, markRaw } from "vue";

let comId = shallowRef(TodayVue);

const data = reactive([
  {
    name: "今天",
    com: markRaw(TodayVue),
  },
  {
    name: "明天",
    com: markRaw(TomorrowVue),
  },
]);

// ...
```

第二种方式：类似于 vue2 的书写风格

```js
import AVue from "./Avue.vue";
import BVue from "./Bvue.vue";

const data = reactive([
  {
    name: "今天",
    com: "AVue", // 字符串形式
  },
  {
    name: "明天",
    com: "BVue",
  },
]);

// 类似于Vue2 需要注册
components: {
  AVue, BVue;
}
```

源码解析：[动态组件源码解析](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=18&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=635)

补充：动态组件缓存请参考第二十章 keep-alive 缓存组件或者[vue.js-keep-alive](https://cn.vuejs.org/guide/built-ins/keep-alive.html)

## 第十七章 插槽 slot

使用场景：组件可以被复用但是内部有少量的改动，使用插槽根据需求修改就行了

### 匿名插槽和具名插槽

index.vue

```vue
<template>
  <div class="content">
    <MenuVue>
      <template v-slot:left>←</template>
      <template v-slot:right>→</template>
      <template v-slot>匿名插槽被插入了</template>
    </MenuVue>
  </div>
</template>
```

menu.vue

```vue
<template>
  <div class="container">
    <header>
      <!-- 具名插槽 -->
      <span><slot name="left"></slot></span>
      <span><slot name="right"></slot></span>
    </header>
    <main>
      <!-- 匿名插槽 -->
      <slot></slot>
    </main>
  </div>
</template>
```

### 作用域插槽

父组件中可以拿到子组件的值
index.vue

```vue
<template>
  <div class="content">
    <MenuVue>
      <template v-slot="{ slotData, index }">
        作用域插槽{{ slotData.name }}插到了第{{ index }}位
      </template>
    </MenuVue>
  </div>
</template>
```

menu.vue

```vue
<template>
  <main>
    <div v-for="(item, index) in slotData" :key="index">
      <slot :index="index" :slotData="item"></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
const slotData = [
  { name: "A", age: 18 },
  { name: "B", age: 19 },
  { name: "C", age: 20 },
];
</script>
```

语法糖 1：可以使用#代替 v-slot:，如`<template #left></template>
语法糖2：可以使用#default代替v-slot，如`<template #default={data}></template>

### 动态插槽

动态决定插槽

```vue
<template>
  <div class="content">
    <MenuVue>
      <template #[slotName]> 我在哪儿 </template>
    </MenuVue>
  </div>
</template>

<script steup lang="ts">
import { ref } from "vue";

let slotName = ref("left");
</script>
```

## 第十八章 异步组件、代码分包和 suspense

注意：suspense 和 telepot 是一样的，都是 Vue3 新增的内置组件，但是需要注意的是 suspense 以后可能会有一些变化。

### 异步组件

应用场景可参考 elementUI 的骨架屏案例，这两者一般是配合使用的。

```vue
<template>
  <div class="content">
    <Suspense>
      <template #default>
        <!--   加载完成之后的组件   -->
        <syncVue></syncVue>
      </template>
      <template #fallback>
        <!--   加载中的组件   -->
        <skeletonVue></skeletonVue>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import skeletonVue from "./components/skeleton.vue";
// 第一种方式（函数方式，常用）
const syncVue = defineAsyncComponent(() => import("@/components/sync.vue"));

// 第二种方式（对象形式）
// const syncVue = defineAsyncComponent({
//   loadingComponent:()=> import("@/components/sync.vue"),
//   timeout:,
//   errorComponent:
// })
</script>
```

性能优化之代码分包：凡是通过 import 函数模式引入的，在打包时都会被拆解，不会被打入主包。

在普通模式下，npm run build 会打包到 dist 文件夹，assets>>index.xxx.js 文件会将所有的东西放到其中，如果这个文件很大，首次加载时白屏时间会非常长。

使用异步组件的方式，异步组件会被拆分出来，在需要时才会被加载。

## 第十九章 传送组件

Teleport 是 vue3.0 新增的内置组件，可将模板渲染到指定 dom 节点，不受父级 style、v-show 限制
Teleport 组件有两个属性 to（传送位置，css 选择器）和 disabled（是否为原位置，布尔值），

Teleport 源码：
坐标：runtime-core>>src>>renderer.ts
Teleport 经过 patch 函数的创建--->判断每个类型创建对应节点、元素和组件
如果是 Teleport，调用 process 方法（创建、更新）
process 方法调用 resolveTarget(n2.props,querySelector)
resolveTarget 函数读取 props 的 to 属性，通过 querySelector 读取元素并返回

获取目标移动的 dom 节点--向目标元素挂载节点--挂载子节点（disable 为 true，原先位置挂载，false 挂载到 target 位置）

## 第二十章 keep-alive 缓存组件

[keep-alive 内置组件](https://cn.vuejs.org/guide/built-ins/keep-alive.html#keepalive)一般用来被优化用户体验，被包裹的组件会被缓存，常用属性如下：

KeepAlive 默认会缓存内部的所有组件实例，但是可以通过通过 include 和 exclude 属性来定制。

- A、B 组件会被缓存 ： `<keep-alive include="['A','B']"></keep-alive>`
- C 组件不会被缓存：`<keep-alive exclude="['C']"></keep-alive>`
- 指定缓存组件的最大数量（自动缓存活跃组件）：`<keep-alive :max="2"></keep-alive>`

使用 keep-alive 之后，会增加两个声明周期钩子（注意与 mounted 钩子的打印顺序）：

```vue
<script setup>
// mounted钩子只会走一次
mounted(() => {
  console.log("初始化");
});

onActivated(() => {
  console.log("keep-alive初始化");
});

onDeactivated(() => {
  console.log("keep-alive卸载");
});

// onUnmounted钩子不会被调用，取而代之的是 onDeactivated钩子
onUnmounted(() => {
  console.log("卸载");
});
</script>
```

源码讲解:[坐标](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=22&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=479)

## 第二十一章 transition 动画组件

[Transition 组件](https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component)，在掌握基本用法后，需要掌握自定义过渡 class 的方式后，尝试使用[Animate.css](https://animate.style/)

Transition tag 属性可以将 Transition 最终渲染为指定标签，如

Transition 组件可以在过渡过程中挂上钩子函数，进一步搭配[gsap 库](https://greensock.com)实现动画效果

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
  </Transition>
</template>
```


apper 属性可以在页面挂载完成之后，立即开始动画，对应三种状态：
```vue
<template>
  <Transition
    apper
    apper-form-class="from"
    apper-active-class="active"
    apper-to-class="to"
  >
    <!-- ... -->
  </Transition>
</template>

<script lang='ts' setup>
// 在元素被插入到 DOM 之前被调用
onBeforeEnter(el) {},

// 在元素被插入到 DOM 之后的下一帧被调用
onEnter(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
},

// 当进入过渡完成时调用。
onAfterEnter(el) {},

onEnterCancelled(el) {},

// 在 leave 钩子之前调用
onBeforeLeave(el) {},

// 在离开过渡开始时调用
onLeave(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
},

// 在离开过渡完成、且元素已从 DOM 中移除时调用
onAfterLeave(el) {},

// 仅在 v-show 过渡中可用
onLeaveCancelled(el) {}
</script>
```

## 第二十二章 transition Group 动画组件

[TransitionGroup](https://cn.vuejs.org/guide/built-ins/transition-group.html) 和 Transition 类似也是一个内置组件，可以对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果。
注意：TransitionGroup 列表中的每个元素都必须有一个独一无二的 key attribute。

移动动画通过 move 指定，如:
```vue
<template>
  <button @click="change">change</button>
  <transition-group tag="div" class="container" move-class="move">
    <div class="item" v-for="item in data" :key="item.id">
      {{ item.number }}
    </div>
  </transition-group>
</template>

<style scoped>
.move {
  transition: all 1s;
}
</style>
```

## 第二十三章 依赖注入

[依赖注入](https://cn.vuejs.org/guide/components/provide-inject.html)指的是父组件相对于所有的后代组件，会作为依赖提供者。为所有的后代的组件树提供依赖。任何层级的子组件都可以注入由父组件提供给整条链路的依赖。（底层是通过原型链实现的）

注意：provide()函数模式只能在 setup 函数模式或语法糖模式中才能使用。
```vue
<script setup lang="ts">
import { provide, ref } from "vue";
import childVue from "./components/child.vue";

const message = ref("^_^");

// 注入
provide("message", message);
</script>

<template>
  {{ message }}
  <hr />
  <childVue />
</template>
```

后代组件
```vue
<script setup lang="ts">
import { inject, ref, onMounted } from "vue";
import type { Ref } from "vue";
defineProps<{ msg: string }>();

const count = ref(0);

// 给定默认值
// const message = inject<Ref<String>>("message",ref("默认消息"))
// 无默认值
const message = inject<Ref<String>>("message");

onMounted(() => {
  console.log(message!.value); //（没有默认值的情况）非空断言
});

const change = function () {
  message!.value = "*_*";
};
</script>

<template>
  <h1>{{ message }}</h1>
  <button @click="change">改变inject值</button>
</template>
```

[源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=30&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=375)

## 第二十四章 EventBus

需要注意：Vue3移除了$on $off等自带的自定义事件相关方法，原因是EventBus方案简单但是维护成本高，于是不再提供官方支持。官方推荐使用props、emits、provide/inject、vuex、pinia等方案来取缔它，不过小项目中我们依然可以使用EventBus，借助 mitt 或 tiny-emitter来实现。

手写原理，实现一个简单的消息订阅发布模型:
```ts
type BusList = {
  on:(name:String,callback:Function)=>void,
  emit:(name:String,)=>void,
}

type PramsKey = string|number|symbol

type List = {
  [key:PramsKey]:Array<Function>
}

class Bus {
  list:List
  constructor() {
    this.list = {}
  }
  emit(name:string,...ags:Array<any>) {
    this.list[name].forEach(fn=>{
      fn.apply(this,ags)
    })
  }
  on(name:string,callback:Function) {
    let fn:Array<Function> = this.list[name]||[]
    fn.push(callback)
    this.list[name] = fn
  }
}

export default new Bus()
```

## 第二十五章 TSX

上面普遍使用的是template风格，TSX(Typescript + XML)/JSX(Javascript + XML)风格则可以将js代码与标签混用，类似于[React](https://react.docschina.org/docs/introducing-jsx.html)写法风格，常见的有[ant design](https://ant.design/index-cn)第三方库采用了这种风格。

安装[babel-plugin-jsx](https://www.npmjs.com/package/@vitejs/plugin-vue-jsx)插件

配置 vite.cofig.js：
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 在写demo时，vs code有报错，但功能正常
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
})
```

### tsx 组件形式

#### 基础用法
```tsx
// 返回一个渲染函数形式
export default function () {
  return (<div>这是测试块</div>)
};
```

#### defineComponent Api形式
```tsx
import { defineComponent } from "vue";

export default defineComponent({
  data(vm) {
    return {
      message:"测试文本"
    }
  },
  render() {
    // 注意单大括号的用法
    return(<div>{this.message}</div>)
  }
})
```

#### setup函数形式(常用)
```tsx
import { defineComponent } from "vue";

const App = defineComponent({
  setup() {
    return () => (<div>测试...</div>);
  },
});

export default App
```

#### 条件渲染和循环渲染
- v-for不支持，使用三元表达式代替 
- 使用 map 代替 v-for
- v-bind 使用 {} 代替
```tsx
import { defineComponent,ref } from "vue";

const App = defineComponent({
  setup() {
    let flag = ref(false)
    const data = [
      {id:1, name:"tom"},
      {id:2, name:"jerry"},
    ]
    return () => (<>
    {/* 条件渲染 */}
    <div>{flag.value?<span>true</span>:<span>false</span>}</div>
    {/* 循环渲染 */}
    {
      data.map(item=>{
        return <div data-id={item.id}>{item.name}</div>
      })
    }
    </>);
  },
});

export default App
```

#### v-model 可以直接使用
```tsx
import { ref } from "vue";
 
export default {
  setup() {
    const v = ref('@_@')
    return () => (<>
      <input type="text" v-model={v.value}/>
      {v.value}
    </>);
  },
};
```

#### props emit 通信
```tsx
import { defineComponent,ref } from "vue";

interface Props {
  name?:string
}

const App = defineComponent({
  props:{
    name:String
  },
  emits:['my-click'],
  setup(props:Props,{emit}) {
    const data = [
    {id:1,name:"张三"},
    {id:2,name:"肖肖"},
    ]
    
    return (props:Props) => (<>
    <h3>Props:{props?.name}</h3>
    <hr />
    {
      data.map(v=>{
        return <span onClick={()=>{emit("my-click",v)}} data-id={v.id}>{v.name}</span>
      })
    }
    </>);
  },
});

export default App

// 父组件
{/* <tsxVue @my-click="getItem" name="tom"></tsxVue> */}
```

#### solt 插槽
```tsx
const Child = (_, { slots }) => (
  <>
    {/* 三元表达式 */}
    <h1>{ slots.default ? slots.default() : '默认值' }</h1>
    {/* 可选链 */}
    <h2>{ slots.bar?.() }</h2>
  </>
);
 
export default {
  setup() {
    const slots = {
      bar: () => <span>B</span>,
      default: () => <span>D</span>,
    };
    return () => (
      <Child v-slots={slots}></Child>
    );
  },
};
```

#### vite插件

[Babel](https://babel.docschina.org/) --- JavaScript 语法编译器，常被用来做es6语法的转换，兼容低版本浏览器。

babel基本原理：源码 --parse（编译器）--> 抽象语法树(AST) --transform（转换过程）--> 修改后的AST --generator（生成器）--> 转换后的代码

[实现vite插件](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=33&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=925)

补充: [unplugin-auto-import 插件](https://github.com/antfu/unplugin-auto-import)可以实现自动按需引入 vue\vue-router\pinia 等的 api

## 第二十六章 深入 v-model 

v-model可以被用在select、input、表单元素和自定义组件上

v-model是props和emit的语法糖，需要注意的是在vue3中，v-model是破坏性更新的。（因为props是单项数据流，vue开发者观察到了这个问题，提出了这个api）

vue3相较于vue2的变化：
- 默认值的改变，prop value-->modelValue
- 事件 input-->updata:modelValue
- v-bind的.sync修饰符和组件的model选项已经被移除
- 新增 支持多个v-model
- 新增 支持自定义修饰符

示例：
父组件
```vue
<script setup lang="ts">
  import { ref } from "vue";
  import vModelVue from "./views/v-model.vue"

  let isShow = ref<boolean>(true)
</script>

<template>
  <button @click="isShow = !isShow">关闭子组件{{isShow.value}}</button>
  <hr>
  <vModelVue v-model="isShow" />
</template>
```

子组件
```vue
<script lang='ts' setup>
  defineProps<{
    modelValue:boolean
  }>()

  const emit = defineEmits(['update:modelValue'])

  const close = ()=>{
    emit('update:modelValue',false)
  }
</script>

<template>
  <div v-if="modelValue">
    {{ modelValue }}
    <input type="text" :value="modelValue">
    <button @click="close">关闭</button>
  </div>
</template>
```

上面的示例中，父组件可以通过 v-model 控制子组件的状态，子组件也可以通过 defineEmits 改变父组件状态，实现数据的双向绑定。

多个 v-model 示例：
父组件
```vue
<script setup lang="ts">
import { ref } from "vue";

import vModelVue from "./views/v-model.vue"

let isShow = ref<boolean>(true)
let text = ref<string>("...")
</script>

<template>
  <button @click="isShow = !isShow">关闭子组件{{ isShow }} </button>
  <hr>
  <vModelVue v-model="isShow" v-model:textValue="text"/>
</template>
```

子组件
```vue
<script lang='ts' setup>
  import { ref,reactive,onMounted } from 'vue'
  defineProps<{
    modelValue:boolean,
    textValue:string
  }>()

  const emit = defineEmits(['update:modelValue','update:textValue'])
  const close = ()=>{
    emit('update:modelValue',false)
  }
  const change = (e:Event)=>{
    let target = e.target as HTMLInputElement
    emit('update:textValue',target.value)
  }
</script>

<template>
  <div v-if="modelValue">
    {{ modelValue }}
    <input type="text" :value="textValue" @change="change">
    <button @click="close">关闭</button>
  </div>
</template>
```

自定义修饰符
父组件
```vue
<script setup lang="ts">
import { ref } from "vue";
import vModelVue from "./views/v-model.vue"

let isShow = ref<boolean>(true)
let text = ref<string>("...")
</script>

<template>
  <vModelVue v-model="isShow" v-model:textValue.true="text"/>
</template>
```

子组件
```vue
<script lang='ts' setup>
  import { ref,reactive,onMounted } from 'vue'
  const props = defineProps<{
    modelValue:boolean,
    textValue:string,
    textValueModifiers?:{
      true:boolean
    },
  }>()

  const emit = defineEmits(['update:modelValue','update:textValue'])
  const close = ()=>{
    emit('update:modelValue',false)
  }
  const change = (e:Event)=>{
    let target = e.target as HTMLInputElement
    emit('update:textValue',target.value)
  }
</script>

<template>
  <div v-if="modelValue">
    <input type="text" :value="(props?.textValueModifiers?.true)?textValue:'默认内容'" @change="change">
    <button @click="close">关闭</button>
  </div>
</template>
```

[源码视频讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=35&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=582)


## 第二十七章 自定义指令directive

Vue中内置有 v-if,v-for,v-bind，v-show,v-model 等指令 另外提供了directive-自定义指令（破坏性更新）。

应用场景：权限控制、页面loading、字符串复制等

Vue3指令的钩子函数
- created 元素初始化的时候
- beforeMount 指令绑定到元素后调用 只调用一次
- mounted 元素插入父级dom调用
- beforeUpdate 元素被更新之前调用
- update 这个周期方法被移除 改用updated
- beforeUnmount 在元素被移除前调用
- unmounted 指令被移除后调用 只调用一次

补充：Vue2 指令 bind inserted update componentUpdated unbind

### 按钮级别鉴权示例:
```vue
<script setup lang="ts">
import type {Directive} from "vue";

// 本地用户信息，可能会从vuex、pinia、localStorage等获取
window.localStorage.setItem("userID","1736")

// mock 后台返回的数据
const permission = [
  '1736:home:create',
  '1736:home:edit',
  // '1736:home:delete',
]

// 自定义指令的函数模式
const vHasShow:Directive<HTMLElement,string> = (el,bingding)=>{
  if(!permission.includes(`${window.localStorage.userID}:${bingding.value}`)) {
    el.style.display = 'none'
  }
}
</script>

<template>
  <div class="btns">
    <button v-has-show="'home:create'">创建</button>
    <button v-has-show="'home:edit'">编辑</button>
    <button v-has-show="'home:delete'">删除</button>
  </div>
</template>
```

### 利用自定义指令实现拖拽效果示例：
```vue
<script setup lang="ts">
import {ref,Directive,DirectiveBinding} from 'vue'

const vMove = (el:HTMLElement,bing:DirectiveBinding)=>{
  let headerElement:HTMLElement = el.firstElementChild as HTMLElement
  headerElement.addEventListener("mousedown",(e:MouseEvent)=>{
    let X = e.clientX-el.offsetLeft
    let Y = e.clientY-el.offsetTop
    const move = (e:MouseEvent)=>{
      el.style.left = e.clientX-X+"px"
      el.style.top = e.clientY-Y+"px"
    }
    document.addEventListener('mousemove',move)
    document.addEventListener('mouseup',()=>{
      document.removeEventListener("mousemove",move)
    })
  })
  
}
</script>

<template>
  <div v-move class="card">
    <header>这是头部区域</header>
    <main>这是内容区域这是内容区域这是内容区域</main>
  </div>
</template>

<style scoped>
.card {
  position: absolute;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: aliceblue;
}
.card header {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
```

## 第二十八章 自定义Hooks

hook 主要是用来处理复用代码逻辑的封装，[vue2中的Mixins](https://v2.cn.vuejs.org/v2/guide/mixins.html)也可以将多个相同的逻辑抽离出来，需要的组件引入mixins就可以实现代码的复用，但mixins有劣势：
弊端1：就是涉及到覆盖的问题（组件的data、methods、filters优先级更高，也就是mixins中的生命周期钩子在组件生命周期钩子之前调用）。
弊端2：组件引入mixins后，变量来源不明确，不利于阅读，维护困难。

hook的代表：[VueUse](https://vueuse.org/)

利用hoke实现图片转base64示例：
```vue
<script setup lang="ts">
// import xxxVue from ''
import {ref,Directive,DirectiveBinding} from 'vue'
import useBase64 from "./hooks/base64";

const imgUrl = '/img/1.png'

useBase64({el:"#img"}).then(data=>{
  console.log(data);
})
</script>

<template>
  <img id="img" alt="err" :src="imgUrl">
</template>
```

base64.ts
```ts
import { onMounted } from "vue";

type Options = {
    el:string
}

function base64(el:HTMLImageElement) {
    const canvas = document.createElement('canvas')   
    const ctx = canvas.getContext('2d')
    canvas.width = el.width
    canvas.height = el.height
    ctx?.drawImage(el,0,0,canvas.width,canvas.height)
    return canvas.toDataURL('image/png')
}

export default function(options:Options):Promise<{baseUrl:string}> {
    return new Promise(resolve =>{
        onMounted(()=>{
            let img:HTMLImageElement = document.querySelector(options.el||'') as HTMLImageElement
            img.onload = ()=>{
                resolve({
                    baseUrl:base64(img)
                })
            }
        })
    })
};
```

## 第二十九章 Vue3定义全局函数/变量

vue2中通过prototype属性在原型上定义全局属性，vue3中没有prorotype属性使用app.config.gloableProperties代替。
```vue
<!-- Vue2.x中 -->
Vue.prototype.$xxx = ()=>{}

<!-- Vue3.x中 -->
const app = createApp({})
app.config.gloableProperties.$xxx = ()=>{}
```

注意需要为vue扩充类型：
```vue
<script setup lang="ts">
import {getCurrentInstance} from 'vue'

// js中读取
const app = getCurrentInstance()
console.log(app?.proxy?.$filters.format('js'))
</script>

<template>
  {{ $glbData }}
</template>
```

main.ts
```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$glbData = {a:1,b:2}
app.config.globalProperties.$filters = {
    format<T extends any>(str: T): string {
        return `$${str}`
    }
}

type Filter = {
    format<T>(str: T): string,
}
 
// 声明要扩充@vue/runtime-core包的声明.
// 这里扩充"ComponentCustomProperties"接口, 因为他是vue3中实例的属性的类型.
declare module 'vue' {
    export interface ComponentCustomProperties {
        $filters: Filter,
        $glbData:object
    }
}
 
app.mount('#app')
```

[源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=40&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=284)

## 第三十章 Vue插件

关于[插件](https://cn.vuejs.org/guide/reusability/plugins.html)，Vue插件底层是利用了app.config.globalProperties实现全局的插件。而[awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) 集合了大量第三方贡献的插件和库供查阅使用。

常见应用场景：全局消息提示组件、全局搜索等

### 实现全局loading组件效果

components/Loading/Loading.vue
```vue
<template>
    <div v-if="isShow" class="container">
        <p>Loading ...</p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let isShow = ref<boolean>(false)

const show = ()=>{isShow.value = true}
const hide = ()=>{isShow.value = false}

// 通过defineExpose抛出的，可以被读取到
defineExpose({
    isShow,
    show,
    hide
})
</script>

<style acoped>
.container {
    position: absolute;
    left: 0;
    top: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    background-color: #ccc;
    width: 100vw;
    height: 100vh;
    display: flex;
}
</style>
```

components/Loading/index.ts
```ts
import { createVNode,render  } from "vue";
import type { App,VNode} from "vue";
import Loading from "./Loading.vue";

export default  {
    install(app:App) {
        let Vnode:VNode = createVNode(Loading)
        render(Vnode,document.body)
        // 注意：如果引入了element-ui，此处的$loading可能会冲突
        app.config.globalProperties.$loading = {
            show:Vnode.component?.exposed?.show,
            hide:Vnode.component?.exposed?.hide
        }

        // 调用方式
        // app.config.globalProperties.$loading.show()
    }
};
```

main.ts
```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Loading from "./components/Loading";

const app = createApp(App)

// 使用插件
app.use(Loading)

type Lod = {
    show: () => void,
    hide: () => void,
    isShow?: boolean
}
//编写ts loading 声明文件放置报错 和 智能提示
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $loading: Lod
    }
}

app.mount('#app')
```

组件中使用
```vue
<script lang="ts" setup>
import { getCurrentInstance,onMounted } from "vue";

let instance = getCurrentInstance();
instance?.proxy?.$loading.show()

setTimeout(()=>{
   instance?.proxy?.$loading.hide()
},3000)
</script> 
```

[Vue.use 源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=41&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=706)

## 第三十一章 UI 库
- 首选 [element-ui](https://element-plus.gitee.io/zh-CN/)，因为是setup语法糖模式+TS风格
- 次选 [ant design](https://www.antdv.com/docs/vue/introduce-cn)，setup函数模式
- 备选 [iview](https://www.iviewui.com/)，使用的是options api风格+js
- [Vant](https://vant-contrib.gitee.io/vant/#/zh-CN/home)

区别：element提供了vscode volar插件的语法支持，antd表单元素提供了分页，而如果使用element则需要自己去封装表单分页。vant 则是移动端开发，尤其是移动端电商项目首选这个。

element使用流程：
1. 安装：npm/yarn 包管理器安装依赖
2. 引入配置：选择全量引入或按需引入
3. 配置volar插件（非vscode编辑器可跳过）
4. 引入组件

## 第三十二章 scoped和样式传统

因为Vue是单页面应用，因此需要做css模块化，否则会造成样式混乱。scoped可以做到样式私有化的作用。scoped原理（渲染规则）如下：
1. 给HTML的DOM节点添加一个不重复的data属性，如data-v-6b8c1表示唯一性
2. 在每句CSS样式选择器末尾（编译后的css语句）添加一个当前组件的data属性选择器（#id[data-v-xxx]:{}）来私有化样式
3. 若组件内部包含有其他组件，只会给其他组件的最外层标签添加当前组件的data属性

因此请注意，下面的这个示例：
```vue
<template>
  <main>
    <el-input v-model="input" placeholder="Please input" class="ipt"/>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let input = ref('')
</script>

<style lang="less" scoped>
main {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 155, 155, .1);
  padding: 10%;
  box-sizing: border-box;
}

// 这里的样式不能被命中子组件中的元素
.el-input__wrapper {
  background-color: tomato;
}
</style>
```
根据第三点：若组件内部包含有其他组件，只会给其他组件的最外层标签添加当前组件的data属性，input不会被添加data-v-xxx的属性，因此不会被css选择器命中，导致样式失效。

因此，vue提供了样式传透的机制：

```css
/* vue2中使用 `/deep/` 修饰符: */
/deep/ .ipt {
  /* ... */
}
```

```css
/* vue2中使用 `:deep()` 修饰符: */
:deep(.ipt)  {
  /* ... */
}
```

原理：将 data-v-xxx 属性，移动至:deep() 生命时的上一级样式属性选择器，底层是使用[Post Css](https://www.postcss.com.cn)插件实现，类似与babel，将css转化为AST，循坏解析AST，并添加自定义属性（挪动属性选择器位置）。

[样式穿透源码讲解 0503](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=43&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=300)

## 第三十三章 css style完整新特性

### 插槽选择器
应用场景：封装子组件，子组件中指定插槽中的样式
```vue
<template>
<main>
    <el-input v-model="input" placeholder="Please input" class="ipt"/>
    <slot>
        <span>默认内容</span>
    </slot>
</main>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let input = ref('')
</script>

<style lang="less" scoped>
main {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 155, 155, .1);
  padding: 10%;
  box-sizing: border-box;
}

// 子组件指定插槽样式
:slotted(.default-slot ) {
    color: tomato;
}
</style>
```

父组件中需要指定类名样式才可以生效
```html
<A>
  <span class="default-slot">XXX</span>
</A>
```

### 全局选择器（慎用）

第一种：vue允许一个组件中出现多个style标签，但只能存在一个setup属性的style标签，因此在style标签中的样式不会被PostCss插件处理，会成为全局样式

第二种：vue新增了:global，可以在有scoped属性的style标签中指定全局样式
```vue
<style lang="less" scoped>
:global(body) {
  margin: 0;
  padding: 0;
}
</style>
```

### 动态class

实现样式的动态控制
```vue
<template>
  <div class="red">RED</div>
  <div class="blue">BLUE</div>
</template>

<script lang="ts" setup>
import { ref,reactive } from "vue";
import A from "./components/A.vue";

let color = ref('red')
let style = reactive({
  color:"blue"
})

setTimeout(() => {
  color.value = "green"
  style.color = 'green'
}, 2000);
</script>

<style lang="less" scoped>
.red {
  color: v-bind(color);
}
.blue {
  color: v-bind("style.color");
}
</style>
```

### css module

示例：
```vue
<template>
  <!-- 默认 module ，应用单个样式 -->
  <div :class="$style.div">css module</div>
  <!-- 应用多个样式 -->
  <div :class="[$style.div,$style.border]">css module</div>
</template>

<style module>
.div {
  color: #ccc;
}
.border {
  border: 1px solid tomato;
}
</style>
```

css module 命名导出方式
```vue
<template>
  <div :class="nor.div">css module</div>
</template>

<style module='nor'>
.div {
  color: #ccc;
}
.border {
  border: 1px solid tomato;
}
</style>
```

### css hooks

css hooks多应用于jsx等
```vue
<template>
  <!-- 默认 module ，应用单个样式 -->
  <div :class="pro.div">css module</div>
  <!-- 应用多个样式 -->
  <div :class="[pro.div,pro.border]">css module</div>
</template>

<script lang="ts" setup>
import { useCssModule } from "vue";

let style = useCssModule('pro')

console.log(style.div);
</script>

<style module="pro">
.div {
  color: #ccc;
}
.border {
  border: 1px solid tomato;
}
</style>
```



## 第三十四章 Tailwind CSS

[Tailwind CSS](https://www.tailwindcss.cn/)是基于post CSS解析，js编写的CSS框架。

优点：无需命名，开箱即用、体积小、兼容移动端、支持响应式
缺点：增加心智负担、污染HTML结构

Post CSS处理Tailwind CSS大致流程
1. 将CSS解析为AST抽象语法树
2. 读取插件配置，根据配置文件生成新的抽象语法树
3. 将AST树传递给一系列数据转换操作处理（变量数据循环生成，切套类名循环）
4. 清除一系列操作留下的数据痕迹
5. 将处理完毕的AST树重新转换成字符串

### 基本使用

[在 Vue 3 和 Vite 安装 Tailwind CSS](https://www.tailwindcss.cn/docs/guides/vue-3-vite)

需要注意：如果是安装了Tailwind CSS 2.x版本，请按照文档配置（即生产环境下这些类名不会被打包）
```js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Tailwind CSS 3.x的版本配置如下：
```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 第三十五章 Event Loop 和 nextTick

JS是单线程语言，单线程的好处是不用考虑同步的问题，避免了线程复杂和保证了线程安全。但只能同步执行肯定是不能满足需求的，所以 JS 有了一个用来实现异步的函数：setTimeout。

### Event Loop:
需要先了解两个数据结构：
- 队列（Queue）：先进先出，类似于排队，先排的人最先被提供服务
- 栈（Stack）：先进后出，类似于向箱子里放东西，最后放置的在最顶层，也会最先被取出来
- 调用栈（Call Stack）：也是栈，不过里面放的是函数
- Event Table: 存储 JavaScript 中的异步事件 (request, setTimeout, IO等) 及其对应的回调函数的列表，可以理解为一张 事件->回调函数 对应表
- Event Queue：回调函数队列，也叫 Callback Queue，当 Event Table 中的事件被触发，事件对应的 回调函数 就会被 push 进这个 Event Queue，然后等待被执行

同步任务和异步任务：
- 同步任务：代码按照自上而下的顺序依次执行
- 异步任务（又分为宏任务和微任务，微任务执行栈被清空才会执行宏任务）
  - 微任务：Promise.then/catch/finally、MutationObserver、process.nextTick(Node.js环境)
  - 宏任务：Script、setTimeout、setInteval、UI交互事件、postMessage、Ajax
  
![EventLoop](/EventLoop.png)

1. 开始，任务先进入 Call Stack
2. 同步任务直接在栈中等待被执行，异步任务从 Call Stack 移入到 Event Table 注册
3. 当对应的事件触发（或延迟到指定时间），Event Table 会将事件回调函数移入 Event Queue 等待
4. 当 Call Stack 中没有任务，就从 Event Queue 中拿出一个任务放入 Call Stack

也就是说Event Loop 会一直检查 Call Stack 中是否有函数需要执行，如果有，就从栈顶依次执行。同时，如果执行的过程中发现其他函数，继续入栈然后执行。

示例：
```js
console.log(1)
setTimeout(()=>{
  console.log(2)
},0)

const p = new Promise((resolve,reject)=>{
  console.log(3)
  resolve(1000)
  console.log(4)
})

p.then(data=>{
  console.log(data)
})

console.log(5)
/*
  1. 先执行同步代码，log(1)、new Promise、log(5)
  2. 同步代码执行结束，检查微任务队列，执行p.then，微任务队列执行完毕，再次检查微任务队列（循环执行），直到微任务队列被清空
  3. 微任务队列清空后，执行宏任务队列，log(2)
  执行结果： 1 3 4 5 1000 2
*/ 
```

面试题1：
```js
async function Prom() {
	console.log('Y');
	await Promise.resolve()
	console.log('X');
}

setTimeout(()=>{
	console.log(1);
	Promise.resolve().then(()=>{
		console.log(2);
	})
},0)
setTimeout(()=>{
	console.log(3);
	Promise.resolve().then(()=>{console.log(4);})
},0)

Promise.resolve().then(()=>{
	console.log(5);
})
Promise.resolve().then(()=>{
	console.log(6);
})
Promise.resolve().then(()=>{
	console.log(7);
})
Promise.resolve().then(()=>{
	console.log(8);
})

Prom()
console.log(0);
```

面试题2：
```js
for(var i=0;i<5;i++) {
  setTimeout(()=>{
    console.log(i) // ?
  }) 
}
```

### nextTick

Vue的mvvm模型中，更新DOM是有策略的，并不是同步的。nextTick 可以接收一个函数做为入参，nextTick 执行后能拿到最新的数据。

[nextTick](https://cn.vuejs.org/api/general.html#nexttick)可以在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。nextTick底层实现利用了Event Loop。

示例：
```vue
<script lang='ts' setup>
import { createApp, nextTick } from 'vue'
const app = createApp({
  setup() {
    const message = ref<string>('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      // 这里获取DOM的value是旧值
      console.log('Now DOM is updated')
      await nextTick()
      // nextTick 后获取DOM的value是更新后的值
      console.log('Now DOM is updated')
    }
  }
})
</script>
```

[源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=47&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=91)


## 第三十六章 Vue开发移动端以及打包apk

开发移动端最常见的问题是适配各种尺寸的移动设备。之前使用的是rem（更具HTML font-size去做缩放），现在更多的是使用vw、vh（根据视口进行缩放），vw和vh会将视口分为一百份，元素根据此比例进行布局。

解决方案1：[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

第一步：安装依赖：`npm install postcss-px-to-viewport --save-dev`

第二步：配置基本参数：
```json
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pxtoViewPort from "postcss-px-to-viewport";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css:{
    postcss:{
      plugins:[
        pxtoViewPort({
          unitToConvert: "px",      //要转换的单位
          viewPortWidth: "1920",    //viewPort的宽度
          viewPortHeight: "1080",   //viewPort的高度
          unitPrecision: 3,         //指定px转换为视图单位值的小数位数
          selectorBlackList: ['.ignore','.hairlines'],    //指定不转换成目标视图单位的类
          minPixelValue: 1,        //最小阈值，小于等于该值时不转换
          mediaQuery:false         //是否在媒体查询时也转换为目标视图单位
        })
      ]
    }
  }
})
```
注意：低版本vite 可能需要声明文件，请参考这篇文章:[Vue如何开发移动端](https://xiaoman.blog.csdn.net/article/details/125490078)

第三步：正常开发即可，此插件会将px单位自动转换为vw、vh单位

#### vue打包apk文件
1. 借助 HBuilder 云打包（排队）
2. 原声安卓+webview
3. flutter 实现，参考[闲鱼](https://www.infoq.cn/article/xianyu-cross-platform-based-on-flutter)

## 第三十七章 unocss 原子化构想
[UnoCSS](https://venerable-strudel-d42cce.netlify.app/)是一个原子化 CSS 引擎，而不是一个框架。相较于[tailwind css](https://www.tailwindcss.cn/)更加灵活并注重性能。

参考链接[unocss原子化](https://xiaoman.blog.csdn.net/article/details/125650172)，具体详见官网。

## 第三十八章 函数式编程

Vue常见的有template、和JSX编码风格，但还有第三种函数式编码风格。主要核心是h函数（底层调用了createVNode）
```vue
<script lang='ts' setup>
  import {ref,h,createVNode, render} from 'vue'

  let div = createVNode('div',{id:"container"},'CONTAINER...')
  let app = document.querySelector('#app') 

  render(div,app as HTMLDivElement)
</script>
```

h函数接受3个参数：
- type 元素的类型
- propsOrChildren 数据对象, 这里主要表示(props, attrs, dom props, class 和 style)
- children 子节点

基础实现：
```vue
<template>
  <div class="container mx-auto px-4">
    <Btn text="ABB" @on-click="getBtn"></Btn>
  </div>
</template>

<script setup lang="ts">
  import { h } from "vue";
  
  type Props = {
    text:string
  }

  const Btn = (props:Props, ctx:any)=>{
    return h('span',{
      class:['rounded-full','py-3','px-6','shadow-lg','bg-green-400','mt-5'],
      onClick:()=>{
        ctx.emit('on-click','我是按钮')
      }
    },
      props.text
    )
  }

  const getBtn = (str:string)=>{
    console.log(str);
  }
</script>
```

插槽：
```vue
<template>
  <div class="container mx-auto px-4">
    <Btn text="ABB" @on-click="getBtn">
      <template #default>123</template>
    </Btn>
  </div>
</template>

<script setup lang="ts">
  import { h } from "vue";
  
  type Props = {
    text:string
  }

  const Btn = (props:Props, ctx:any)=>{
    return h('span',{
      class:['rounded-full','py-3','px-6','shadow-lg','bg-green-400','mt-5'],
      onClick:()=>{
        ctx.emit('on-click','我是按钮')
      }
    },
      ctx.slots.default()
    )
  }

  const getBtn = (str:string)=>{
    console.log(str);
  }
</script>
```

## 第三十九章 Vue开发桌面程序 Electron

[Electron](https://www.electronjs.org/)内置了 Chromium 和 nodeJS 其中 Chromium 是渲染进程，要渲染和解析HTML，Nodejs作为主进程，其中管道用IPC 通信。

[文字版讲解](https://xiaoman.blog.csdn.net/article/details/126063804)、
[视频讲解](https://www.bilibili.com/video/BV1dS4y1y7vd)

## 第四十章 响应式语法糖

[响应性语法糖 $ref](https://cn.vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables)要求 vue 3.2.25 及以上版本

注意：现在处于实验阶段，正式环境慎用

vite 配置：
```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    reactivityTransform:true // 开启 reactivityTransform
  }), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## 第四十一章 了解 docker

应用场景：要求维护四个项目，每个项目 node版本不同 框架不同 这很头疼，docker可以解决这个问题。

安装：[Developers - Docker](https://www.docker.com/get-started/)

docker 分几个概念：镜像、容器、仓库
- 镜像：类似于装机时候需要的系统盘或者系统镜像文件，这里它负责创建docker容器的，有很多官方现成的镜像：node、mysql、monogo、nginx可以从远程仓库下载
- 容器：容器特别像一个虚拟机，容器中运行着一个完整的操作系统。可以在容器中装 Nodejs，可以执行npm install，可以做一切你当前操作系统能做的事情
- 仓库：仓库就像是 github 那样的，我们可以制作镜像然后 push 提交到云端的仓库，也可以从仓库 pull 下载镜像


配置docker的国内镜像：
```js
"registry-mirrors": [
  http://hub-mirror.c.163.com",
  https://docker.mirrors.ustc.edu.cn",
  https://registry.docker-cn.com"
],
```

## 第四十二章 配置环境变量

[环境变量](https://cn.vitejs.dev/guide/env-and-mode.html#env-variables)的作用:让开发者区分不同的运行环境，来实现兼容开发和生产。如 `npm run dev` 就是开发环境 ，`npm run build` 就是生产环境等等。

使用Vite构建的项目，可以使用 import.meta.env 对象获取暴露的环境变量。如下：
```
{
  "BASE_URL":"/", //部署时的URL前缀
  "MODE":"development", //运行模式
  "DEV":true,"  //是否在dev环境
  PROD":false, //是否是build 环境
  "SSR":false //是否是SSR 服务端渲染模式
}
```

注意：不能使用动态赋值的方式，如 import.meta.env[key]赋值，因为这些环境变量在打包的时候是会被硬编码的方式通过 JSON.stringify 注入浏览器中。

需要在根目录 .env.[name] 文件中配置额外的环境变量，如新建 .env.development 配置开发环境变量 ；.env.production 配置生产环境变量 。内容如下：
```
VITE_HTTP = http://www.baidu.com
VITE_IP = 180.101.50.242
```

在vite.config.js中使用环境变量请参考:[链接](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=53&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=531)


## 第四十三章 利用webpack手动构建 Vue3 项目

### 第一步 创建基本结构：
```
│  README.md
│
├─public
│      index.html
│
└─src
    │  App.vue
    │
    ├─assets
    ├─components
    └─views
```

### 第二步 配置 ts
安装 ts：`npm install typescript -g`
安装ts配置文件：`tsc --init`，生成 tsconfig.json 配置文件

### 第三步 安装 webpack服务及其插件
安装以下webpack依赖以及插件
```json
{
  "dependencies": {
    "html-webpack-plugin": "^5.5.0", 
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.11.1"
  }
}
```

根目录新建 webpack.config.js 配置文件（webpak基于node环境，遵循common js规范）：
```js
const { Configuration } = require('webpack')
const  path  = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

/**
 * @type {Configuration}
 */

const config = {
    entry: './src/main.ts', //入口文件
    output: {
        filename: '[hash].js',
        path:path.resolve(__dirname,'dist')
    },//打包出口文件
    plugins: [
        new htmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
} 

module.exports = config
```

配置 webpack 开发/打包命令：
```js
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  },
}
```

尝试运行打包命令`npm run build`，会产生打包文件 dist/...

### 第四步 安装 vue 

安装：`npm install vue`

main.ts 引入 vue:
```ts
import { createApp } from "vue";
import App from "./App.vue"

let app = createApp(App)

app.mount('#app')
```

注意：可能出现不能正确识别.vue文件，即`err: 找不到模块'./App.vue'或其相应的类型声明`，需要单独扩充 xxx.d.ts的声明文件，如下：
```js
// path: src/env.d.ts
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
  }
```

此时尝试打包，会报错，因为 webpack 对于 vue SFC 中的 template 模板语法不能正确解析，需要借助loader

### 第五步 安装 loder

#### vue loader
安装依赖 `@vue/compiler-sfc`（解析vue文件）和`vue-loader`（解析vue语法）
```json
{
  "dependencies": {
    "@vue/compiler-sfc": "^3.2.47",
    "vue-loader": "^17.0.1",
  }
}
```

配置依赖：
```ts
const { VueLoaderPlugin } = require('vue-loader/dist/index'); 

const config = {
    plugins: [
        new VueLoaderPlugin(), //解析vue
    ],
    module: {
     rules:[
        {
            test: /\.vue$/, // 接收 RegExp
            use: 'vue-loader'
        }
     ]   
    }
} 

module.exports = config
```

安装完成之后，可以尝试打包（vue script中不能指定 lang='ts'，后面会解决），但是会发现dist文件中之前打包的js文件依然存在，不会被覆盖。引入`clean-webpack-plugin`依赖，在打包时自动清空dist。
```json
{
  "dependencies": {
    "clean-webpack-plugin": "^4.0.0",
  }
}
```

引入：
```ts
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
    plugins: [
        new CleanWebpackPlugin(), //build打包之前清空dist
    ],
} 

module.exports = config
```
之后，可以正常打包，vue文件vue模板语法可以正常被识别。但一般我们经常会在 src/assets 目录下引入静态文件，如 css 等，目前的这个项目是不可以引入css文件的，因为缺少`css-loader`解析css文件，`style-loader`解析style样式。

#### css loader
```json
{
  "dependencies": {
    "css-loader": "^6.7.3",
    "style-loader": "^3.3.1",
  }
}
```

配置：
```js
const config = {
    module: {
     rules:[
        {
            test: /\.css$/, 
            use: ["style-loader", "css-loader"],
        }
     ]   
    }
} 
module.exports = config
```

之后就可以看到css文件可以被正常解析，但是在vue-cli中，是存在别名的，如@表示src，我们需要进行配置resolve:
```js
const  path  = require('path')

const config = {
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'src')
        },
        extensions:['.vue','.ts','.js','.css']
    }
} 

module.exports = config
```

如需引入less/sass，同上安装依赖，配置rules即可被识别并解析。
```js
const config = {
    module: {
        rules: [
            {
                test: /\.less$/, //解析 less
                use: ["style-loader", "css-loader", "less-loader"],
            }
        ]
    }
}
 
module.exports = config
```

#### ts loader
安装；`npm install ts-loader`

配置：
```js
const config = {
    module: {
        rules: [
            {
                test: /\.ts$/,  //解析ts
                loader: "ts-loader",
                options: {
                    configFile: path.resolve(process.cwd(), 'tsconfig.json'),
                    appendTsSuffixTo: [/\.vue$/]
                },
            }
        ]
    }
}
 
module.exports = config
```

### 第六步 其他配置

#### webpack配置项补充
```js
const config = {
    mode: "development", //环境
    entry: './src/main.ts', //入口文件
    output: {},//出口文件
    module: {
        rules: [] // loader，解析文件
    },
    plugins: [], //插件
    resolve: {
        alias: {},//别名
        extensions: [] //识别后缀
    },
    stats:"errors-only", //取消提示
    devServer: { 
        proxy: {},
        port: 9001,
        hot: true,
        open: true,
    }, // 端口 代理等
    externals: {
        vue: "Vue" 
    },//CDN 引入可以节省打包体积，性能优化
}

module.exports = config
```
#### 美化webpack命令行

安装[friendly-errors-webpack-plugin]()依赖

## 第四十四章 Vue3 性能优化

### 在线测试
一般采用Chrome devTools/Lighthouse，各项数值如下：
- FCP (First Contentful Paint)：浏览器首次内容绘制的时间，即首次白屏时间。
- Speed Index: 页面各可见部分显示的平均时间。
- LCP (Largest Contentful Paint)：页面最大元素绘制时间。
- TTI（Time to Interactive）：从页面开始渲染到可交互的时间，内容必须渲染完毕，交互元素绑定的事件已经注册完成。
- TBT（Total Blocking Time）：主进程阻塞时间，记录了首次内容绘制到用户可交互之间的时间，此阶段页面点击无反应。
- CLS（Cumulative Layout Shift）：计算布局偏移值，会比较两次渲染帧的内容偏移情况。

### 代码分析：
vite打包是基于rollup，所以可以使用 rollup 插件分析，如 rollup-plugin-visualizery：`npm install rollup-plugin-visualizer`

配置开启open：
```js
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [vue(), vueJsx(),visualizer({
  open:true
})],
```
运行build命令，网页查看代码体积

### vite性能优化

```js
import { defineConfig } from 'vite'

export default defineConfig({
  build:{
      chunkSizeWarningLimit:2000, //打包时文件大小>2000kb提示
      cssCodeSplit:true, //css 是否拆分
      sourcemap:false, //是否生成 sourcemap
      minify:false, //是否禁用最小化混淆，也可以接收一个字符串指定打包：'esbuild'打包速度最快，'terser'打包体积最小
      assetsInlineLimit:5000 //小于该大小的图片将打包成 Base64 
  },
})
```

### PWA 离线缓存

PWA 技术的出现就是让web网页无限接近于Native 应用：
- 可以添加到主屏幕，利用manifest实现
- 可以实现离线缓存，利用service worker实现
- 可以发送通知，利用service worker实现

安装依赖库: `npm install vite-plugin-pwa -D`

注册依赖（基本配置项）：
```js
import { VitePWA } from 'vite-plugin-pwa' 

export default defineConfig({
  plugins: [
    VitePWA({
      workbox:{
          cacheId:"xxxName",//缓存名称
          runtimeCaching:[
            {
              urlPattern:/.*\.js.*/, //缓存文件
              handler:"StaleWhileRevalidate", //重新验证时失效
              options:{
                cacheName:"xxx-js", //缓存js，名称
                expiration:{
                  maxEntries:30, //缓存文件数量，遵循LRU算法
                  maxAgeSeconds:30 * 24 * 60 * 60 //缓存有效期
 
                }
              }
            }
          ]
      },
    })
  ],
})
```

安装此插件后，会在 build 打包时，自动生成 sw.js 和 manifest。webmanifest 等PWA必须文件。
Chrome devTools/Application/Service Workers 可以读取到sw.js文件

### 图片懒加载

Vue2 ，使用[vue-lazyload](https://www.npmjs.com/package/vue-lazyload)
Vue3 ，使用[vue3-lazy](https://github.com/ustbhuangyi/vue3-lazy)

### 虚拟列表
常见面试题：后端返回的成千上万的数据如何处理？

[Virtualized Table 虚拟化表格](https://element-plus.gitee.io/zh-CN/component/table-v2.html)，原理：只展示可视窗口的dom元素，其余的dom都不会被渲染。

### web worker
[Web Worker 使用教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

注意：web werker中只能操作数据，不能操作DOM！

Vueuse已经集成了[useWebWorker](https://vueuse.org/core/useWebWorker/)

### 防抖、节流

Vueuse也已经集成了[useDebounceFn](https://vueuse.org/shared/useDebounceFn/)

## 第四十五章 了解微前端 和 web Component
Web Components 提供了基于原生支持的、对视图层的封装能力，可以让单个组件相关的 javaScript、css、html模板运行在以html标签为界限的局部环境中，不会影响到全局，组件间也不会相互影响 。 再简单来说：就是提供了我们自定义标签的能力，并且提供了标签内完整的生命周期 。

web Component的组成：
- Custom elements（自定义元素）：JavaScript API，允许定义custom elements及其行为，然后可以在我们的用户界面中按照需要使用它们。
- Shadow DOM（影子DOM）：JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，开发者可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- HTML templates（HTML模板）：和元素使开发者可以编写与HTML结构类似的组件和样式。然后它们可以作为自定义元素结构的基础被多次重用。

应用场景：
微前端底层js部分是通过proxy代理劫持底层的window对象实现隔离，css部分就是通过Shadow DOM隔离样式。
如JD的跨端框架 Taro 的组件部分，就是用基于 Web Components 开发的 。

### 基本示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEMO</title>
    <script src="./index.js"></script>
</head>
<body>
    <my-node></my-node>
    <my-node></my-node>
</html>
```

js
```js
class Demo extends HTMLElement {
    constructor(){
        //调用super 来建立正确的原型链继承关系
        super()

        const shaDom = this.attachShadow({
            mode:"open"
        })

        this.node = this.h('div')
        this.node.innerText = '默认内容'
        this.node.setAttribute('style','padding:5px;border:1px solid #ccc')

        shaDom.appendChild(this.node)
    }

    h(el) {
        return document.createElement(el)
    }
}

window.customElements.define('my-node',Demo)
```

### tempalte风格

tempalte模板中的style样式会被隔离

```js
class Btn extends HTMLElement {
    constructor() {
        super()
        const template = this.h('template')
        template.innerHTML = `
        <div>小满</div>
        <style>
            div{
                height:200px;
                width:200px;
                background:blue;
            }
        </style>
        `
        //表示 shadow DOM 子树的根节点。
        const shaDow = this.attachShadow({ mode: "open" })
 
        shaDow.appendChild(template.content.cloneNode(true))
    }
 
    h(el) {
        return document.createElement(el)
    }
 
    /**
     * 生命周期
     */
    //当自定义元素第一次被连接到文档 DOM 时被调用。
    connectedCallback() {
        console.log('已插入')
    }
 
    //当自定义元素与文档 DOM 断开连接时被调用。
    disconnectedCallback() {
        console.log('已断开')
    }
 
    //当自定义元素被移动到新文档时被调用
    adoptedCallback() {
        console.log('被移动')
    }
    //当自定义元素的一个属性被增加、移除或更改时被调用
    attributeChangedCallback() {
        console.log('被改变')
    }
 
}
 
window.customElements.define('xiao-man', Btn)
```

### vue开发Web Component
[用 Vue 来构建标准的 Web Component](https://cn.vuejs.org/guide/extras/web-components.html)
[视频参考](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=56&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=434)

## 第四十六章 Proxy 跨域

概念: 当一个请求url的 协议、域名、端口 三者之间任意一个与当前页面url不同即为跨域。

常见解决跨域的方法：

1. JSONP，基本原理:利用了HTML里script元素标签没有跨域限制，动态创建script标签，将src作为服务器地址，服务器返回一个callback接受返回的参数。限制：只能使用GET请求
目前再用的网站：百度、豆瓣图书等
```js
function clickButton() {
    let obj, s
    obj = { "table":"products", "limit":10 }; //添加参数
    s =  document.createElement("script"); //动态创建script
    s.src = "接口地址xxxxxxxxxxxx"  + JSON.stringify(obj);
    document.body.appendChild(s);
 }
//与后端定义callback名称
function myFunc(myObj)  {
    //接受后端返回的参数
    document.getElementById("demo").innerHTML = myObj;
}
```

2. cors 设置 CORS 允许跨域资源共享，这是后端解决的方式：

可以指定地址
```json
{ "Access-Control-Allow-Origin": "http://xxx.com" }
```

使用通配符则任何地址都能访问，安全性低（不推荐）
```json
{ "Access-Control-Allow-Origin": "*" }
```

3. 正反向代理
vite.config.js 通过[配置proxy](https://cn.vitejs.dev/config/server-options.html#server-proxy)即可实现。需要注意的时这种方式只能在dev环境下使用（启动了node服务），项目进入生产环境是不可以使用这种方式的。一般会部署到Apache或Niginx等，如niginx则可以通过配置proxy_pass解决跨域问题。

```js
export default defineConfig({
  server: {
    proxy: {
      // 常见写法1：字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 常见写法2：选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

[proxy源码实现](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=57&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=478)，底层使用了`http-proxy`库实现。
