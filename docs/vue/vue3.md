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


