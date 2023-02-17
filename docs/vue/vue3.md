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
