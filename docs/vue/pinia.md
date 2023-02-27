---
sidebar: auto
---

# pinia

[Pinia.js](https://pinia.web3doc.top/) 是新一代的全局状态管理工具，有如下特点：

- 完整的 ts 的支持；
- 足够轻量，压缩后的体积只有1kb左右;
- 去除 mutations，只有 state，getters，actions；
- actions 支持同步和异步；
- 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
- 无需手动添加 store，store 一旦创建便会自动添加；
- 支持Vue3 和 Vue2

与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的规范，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。

## 第一章 起步

安装：`npm install pinia`

main.ts 引入：
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const store = createPinia()

app.use(store)
app.mount('#app')
```

store/index.ts 初始化 store：
```ts
import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  state:()=>{
    return {
        current: 100,
        name: "TOM"
    }
  },
  getters:{},
  actions:{}
})
```

组件中使用：
```vue
<script setup lang="ts">
import { useStore } from "./store/index";

const Store = useStore()
</script>

<template>
  <div>
    {{ Store.current }}{{Store.name}}
  </div>
</template>
```

## 第二章 核心概念
### Store
更新状态：在Vuex中不允许直接修改状态，必须通过[moutain的方式](https://vuex.vuejs.org/zh/guide/mutations.html)提交。但是在pinia中虽然不推荐但是确实可以直接修改状态。
```vue
<script setup lang="ts">
import { useStore } from "./store/index";

const Store = useStore()
</script>

<template>
  <div>{{ Store }}</div>
  <button @click="Store.current++">+</button>
</template>
```

但是更推荐以下几种方式：
- $patch的方式：`Store.$patch({current:200})`
- $patch的方式（函数形式，更常用）：`Store.$patch((state)=>{state.current=99})`
- $state方式会直接覆盖state数据：`Store.$state = {current:2499}`
- actions的方式：`Store.Fun()`
    ```ts
    import { defineStore } from 'pinia'

    export const useStore = defineStore('main', {
        state:()=>{
            return {
                cureent:1,
            }
        },
        actions:{
            // 注意：这里不能使用箭头函数
            changeCurrent(num:number) {
                // 在state中返回的对象，会自动挂载到这个store实例身上，可以在getters和actions通过访问this来获取和改变状态
                this.cureent = 649
            }
        }
    })
    ```

注意点：useStore返回值解构不具有响应式特点,如下:
```vue
<script setup lang="ts">
import { useStore } from "./store/index";

const Store = useStore()

let {current} = Store
</script>

<template>
  <div>
    {{ Store.current }} | {{ current }}
  </div>
  <button @click="Store.current++">+</button>
</template>
```

为此，可以引入storeToRefs api解决这个问题，如下：
```vue
<script setup lang="ts">
import { useStore } from "./store/index";
import { storeToRefs } from "pinia";

const Store = useStore()

let {current} = storeToRefs(Store)
</script>

<template>
  <div>
    {{ Store.current }} | {{ current }}
  </div>
  <button @click="Store.current++">+</button>
</template>
```

[storeToRefs 源码讲解](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=61&share_source=copy_web&vd_source=461186b903c28eeeb1342b31e0bfe68e&t=164)

### actions
同步的写法：
```ts
import { defineStore } from 'pinia'

type User = {
    name:string,
    age:number
}

export const useStore = defineStore('main', {
  state:()=>{
    return {
        user:<User>{name:"",age:0}
    }
  },
  actions:{
    changeCurrent(num:number) {
        this.current = 649
    },
    setUser() {
        this.user = {
            name:"tom",age:99
        }
    },
  }
})
```

异步的写法：
```ts
import { defineStore } from 'pinia'

type User = {
    name:string,
    age:number
}

export const useStore = defineStore('main', {
  state:()=>{
    return {
        user:<User>{name:"",age:0}
    }
  },
  actions:{
    setUser(num:number) {
        new Promise<number>((resolve, reject) => {
            setTimeout(()=>{
                resolve(199)
            },1000)
        }).then((data:number)=>{
            this.user.age = data
            this.setName('章叁')
        })
    },
    setName(name:string) {
        this.user.name = name
    },
  }
})
```

### getters

```ts
import { defineStore } from 'pinia'

type User = {
    name:string,
    age:number
}

// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  state:()=>{
    return {
        current: 1,
        name: "apc",
    }
  },
  getters:{
    allName():string {
        return `_${this.name} ${this.getage}`
    },
    getage():number {
        return this.current
    }
  }
})
```

## 第三章 核心api

`$reset()` 重置store
`$subscribe((args,state)=>{})` 类似于Vuex 的 abscribe，订阅state的改变
`$onAction((args)=>{})` 订阅 Actions 的调用

## 第三章 持久化插件

pinia和vueX都有一个通病：页面刷新之后状态会丢失，下面手写一个插件利用localStorage实现持久化：
```ts
import { toRaw } from "vue";
import { createPinia,PiniaPluginContext } from "pinia";

type Options =  {
    key?:string
}

// 默认key值
const _key_ = "_default"

const setStorage = (key:string,value:any)=>{
    localStorage.setItem(key,JSON.stringify(value))
}

const getStorage = (key:string)=>{
    return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key) as string):{}
}

const piniaPlugin = (options:Options={key:_key_})=>{
    
    return (context:PiniaPluginContext)=>{
        let {store} = context
        const data = getStorage(`${options?.key}-${store.$id}`)

        store.$subscribe(()=>{
            setStorage(`${options?.key}-${store.$id}`,toRaw(store.$state))
        })

        return {
            ...data
        }
    }
}

let store = createPinia()

store.use(piniaPlugin({
    key:"baetm4f71z7"
}))

export default store
```
