---
sidebar: auto
---

# Router

## 第一章 了解 Router
[Vue Router](https://router.vuejs.org/zh/)为 Vue.js 提供富有表现力、可配置的、方便的路由。

注意Vue2.x不能使用Router 4.x版本，只能安装3.x版本。

安装: `npm install vue-router@4`

配置:
```ts
import {createRouter,createWebHashHistory,type RouteRecordRaw} from "vue-router"

let routes:Array<RouteRecordRaw> = [
    {
        path:"/",
        component:()=>import('../views/home.vue')
    },{
        path:"/register",
        component:()=>import('../views/register.vue')
    },{
        path:"/login",
        component:()=>import('../views/login.vue')
    }
]

let router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router
```

注册:
```ts
import { createApp } from 'vue'
import './style.css'
import './assets/tailwind.css'
import App from './App.vue'
import router from "./router/index";

const app = createApp(App)
app.use(router)

app.mount('#app')
```

使用:
```vue
<template>
  <header>
    <div class="nav">
      <div class="nav-left">
        <div class="logo">
         <RouterLink to="/">Aparo</RouterLink>
        </div>
      </div>
      <div class="nav-right">
        <span class="item">
          <RouterLink to="/login">登录</RouterLink>
        </span>
        <span class="item">
          <RouterLink to="/register">注册</RouterLink>
        </span>
      </div>
    </div>
  </header>
  <RouterView></RouterView>
</template>
```

## 第二章 路由模式
[MDN History](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

### HashHistory
hash实现是URL中hasn(#)后面的部分,常用作锚点在页面内导航,改变hash部分是不会导致页面刷新的.

原理:通过 `location.hash`获取/更改当前hash部分,通过监听`hashchange`事件获取URL的变化。改变URL的方式只有一下几种:

1. 通过浏览器前进后退改变URL
2. 通过`<a>`标签改变URL
3. 通过`window.location.hash = ''`改变

### webHistory
原理:通过[HTML5 的 history](https://developer.mozilla.org/zh-CN/docs/Web/API/History) 实现,通过监听`popstate`事件获取URL的变化。

注意：通过`history.pushState({},'','/b')`的方式改变路径不会被`hashchange`事件监听到（或者使用Vue内置的push方法）。

## 第三章 命名路由 编程式路由
### 命名路由
路由配置:
```ts
let routes:Array<RouteRecordRaw> = [
    {
        path:"/",
        component:()=>import('../views/home.vue')
    },{
        path:"/register",
        component:()=>import('../views/register.vue')
    },{
        path:"/login",
        component:()=>import('../views/login.vue')
    }
]
```

使用:
```vue
<RouterLink :to="{name:home}">Aparo</RouterLink>
<RouterLink :to="{name:login}">登录</RouterLink>

<!-- 使用a标签也是可以跳转的，但是不推荐，因为它的默认事件会导致页面刷新 -->
<a href="/home">Aparo</a>
```
### 编程式路由
```js
import { ref,reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

// 字符串形式
router.push('/home')
// 对象形式
router.push({
   path:'/home'
})
// 命名形式
router.push({
   name:'home'
})
```

## 第四章 历史记录
1. 通过RouterLink标签的replace属性：`<RouterLink replace>Aparo</RouterLink>`
2. 编程式路由通过`router.push()`会留下历史记录，但是`router.replace()`不会
3. 历史记录操作可以通过`router.go()`，可以接收一个负值表示后退n步，但后退一般推荐使用`router.back()`，更加语义化。

## 第五章 路由传参

### query 参数
传递参数：
```js
import { ref,reactive,watch } from 'vue'
import { useRouter } from 'vue-router';

let userInfo = reactive({
    name:"",
    pwd:"",
    email:"",
})
const router = useRouter()

const submit = ()=>{
    router.push({
        name:"login",
        query:{
            ...userInfo
        } // query参数只能为一个对象
    })
}
```

接收参数：
```js
import { useRoute } from 'vue-router';
let route = useRoute() // route.query 取值
```

### params 参数（不会被展示在地址栏）

注意：使用params参数传参，必须使用命名路由的方式（不能使用`{path:''}`）传递参数：
```js
// 传递参数：
const submit = ()=>{
    router.push({
        name:"login",
        params:{/*...*/}
    })
}

// 接收参数：
let route = useRoute() // route.params 取值
```
注意：在 vue Router v4.1.x 之后，增加了删除未使用的参数功能。会提示你 `Discarded invalid param(s) ...`，这是因为这种用法如果没有在路由表上面声明动态参数，将会造成刷新后参数丢失。

解决方法：在路由表中声明你用到的这些参数（如下：动态路由参数），或使用 query 的形式来传递参数。也可以用 vuex 之类的状态管理来暂存。

### 动态路由参数

应用场景：[侧边栏-权限管理](https://blog.csdn.net/qq_31906983/article/details/88942965)

这一小节内容很重要，请去官网查看：[动态路由匹配](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)和[路由的匹配语法](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html)

路由配置：
```ts
import { defineAsyncComponent } from "vue"
import {createRouter,createWebHashHistory,RouteRecordRaw} from "vue-router"

let routes:Array<RouteRecordRaw> = [
    {
        path:"/",
        name:"login",
        component:()=>import('../views/login.vue'),
    },{
        path:"/home/:name?/:email?/:power?", // 动态路由参数,?表示可选
        name:"home",
        component:()=>import('../views/home.vue'),
        children: [
            {
                path:"",
                name:"model-a",
                component:()=>import('../components/modelA.vue')
            },{
                path:"b",
                name:"model-b",
                component:()=>import('../components/modelB.vue')
            },{
                path:"setting",
                name:"setting",
                component:()=>import('../components/setting.vue')
            },
        ]
    },{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: ()=>import('../error/404.vue')
	}
]

let router = createRouter({
    history:createWebHashHistory(),
    routes
})

// 动态加载路由,注意:这里的component必须使用defineAsyncComponent+@路径导入的形式,否则vite会报错
const addNewRoute = (menuList:any[]) => {
    menuList.forEach(menu => {
        const childRoute = {
            path: '/' + menu.menuclickname,
            name: menu.menuname,
            component: defineAsyncComponent(() => import(/*@vite-ignore*/`@/components/${menu.menucomponent}`)),
            meta: {
                title: menu.menuname
            }
        }
        router.addRoute(childRoute)
    })
}

export {router,addNewRoute}
```

动态路由参数的传递与接收，与params参数相同。

需要注意：当在这种动态加载的模式下，在页面刷新时，会出现一个警告`[Vue Router warn]: No match found for location with path...`,因为刷新页面时请求路由为空，因为追加路由是在addRoute里做的，请求路由比addRoute早所以出现这问题。[参考链接](https://blog.csdn.net/weixin_43835425/article/details/116708448)

解决方法：在路由文件后追加404路径：`{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },`，参考[路由的匹配语法中的自定义正则表达式和可选参数](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html)

## 第六章 路由嵌套

示例：
router.js
```js
[
    {
        path:"/",
        name:"login",
        component:()=>import('../views/login.vue'),
    },{
        path:"/home/:name?/:email?",
        name:"home",
        component:()=>import('../views/home.vue'),
        children: [
            {
                path:"",
                name:"model-a",
                component:()=>import('../components/modelA.vue')
            },{
                path:"b",
                name:"model-b",
                component:()=>import('../components/modelB.vue')
            }
        ]
    },{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: ()=>import('../error/404.vue')
	}
]
```

home.vue
```vue
<template>
    <header>
        <RouterLink to="/home"> Aparo </RouterLink>
        <RouterLink class="item" to="/b">模块B</RouterLink>
    </header>
    <RouterView></RouterView>
</template>
```

login.vue
```js
  import { reactive,toRaw } from 'vue'
  import { useRouter } from 'vue-router';

  let userInfo = reactive({
      name:"",
      email:"",
  })

  const router = useRouter()
  
  const submit = ()=>{
    let user =  toRaw(userInfo);
    verify(user).then(data=>{
        let { name,email,power } = data
        router.push({
            // 注意:这里命令式导航需要指定到子路由,或者采用路径匹配的方式,但是动态参数要写到父路由path
            name:"model-a", 
            params:{ 
                name,
                email,
                power:JSON.stringify(power) 
            }
        })
    }).catch(err=>{
        throw new Error(`用户信息校验失败 ${JSON.stringify(err)}`)
    })
  }

  //   校验信息
  const verify = (user)=>{/**/}
```

## 第七章  命名视图
应用场景: 不同tab页中有相同的组件,如商品页中某件商品的价格相同,但是描述不同(一件上衣的款式是固定的,但颜色不同;一部手机外观相同,但是配置/价格不同)

```js
let routes:Array<RouteRecordRaw> = [
    {
        path:"/",
        name:"detail",
        component:()=>import('../views/detail.vue'),
        children: [
            {
                path:"phone",
                name:"phone",
                components: {
                    default:()=>import('../components/phone.vue'),
                    message:()=>import('../components/recommend.vue'),
                }
            },{
                path:"plus",
                name:"plus",
                components: {
                    default:()=>import('../components/phonePlus.vue'),
                    message:()=>import('../components/recommend.vue'),
                }
            }
        ]
    }
]
```
[命名视图 官网文档](https://router.vuejs.org/zh/guide/essentials/named-views.html)

## 第八章 路由重定向
示例:
```js
[
    {
        path:"/",
        children: [
            {
                path:"",
                name:"home",
                component:()=>{import("./views/home.vue")}
            }
        ]
    }
]
```

上面的路由会在访问`/`时自动跳转到`/home`,使用的是默认路由的方式。还有下面的这种重定向的方式:
```js
[
    {
        path:"/",
        // 1. 字符串形式,使用path
        // redirect:"/home"
        // 2. 对象形式,可使用 path/name
        // redirect:{ name:"/home" } or redirect:{ name:"home" }
        // 3. 函数形式,可使用 path/name
        redirect: to=>{
            // 3.1 可以返回一个字符串
            // return "/name" 
            // 3.2 返回对象时不仅可以使用path.name,也可以携带参数
            return {
                name:"home",
                query:{/**/}
            }
        }
        children: [
            {
                path:"/home",
                name:"home",
                component:()=>{import("./views/home.vue")}
            }
        ]
    }
]
```

使用 alias为路由起别名,多个路径均会匹配到同一个路由组件:
```js
[
    { path: '/', component: home, alias: ['/home', '/root'] },
]
```

## 第九章 路由守卫-前置守卫
应用场景: 用户登录校验/路由校验

示例:
```js
import { createApp } from 'vue'
import App from './App.vue'
import {router} from "./router/index";

const app = createApp(App)
app.use(router)

const whiteList = ['/']

router.beforeEach((to,from,next)=>{
    // 跳转路由存在白名单中或用户已登录才允许跳转(token应每次请求后端校验是否过期)
    if(whiteList.includes(to.path)||localStorage.getItem('token')) {
        next()
    }else {
        next('/') // 重定向到登录界面
    }
})

app.mount('#app')
```

## 第十章 路由守卫-后置守卫
axios拦截器也可以了解一下,思路大致相同

实例:封装一个全局路由loading组件
```vue
<template>
  <div class="wraps">
    <div class="bar" ref="bar"></div>
  </div>
</template>

<script lang='ts' setup>
import { ref,reactive,onMounted } from 'vue'
let speed = ref<number>(1)
let bar = ref<HTMLElement>()
let timer = ref<number>(0)
const startLoading = ()=>{
  let dom = bar.value as HTMLElement
  speed.value = 1
  /*
    window.requestAnimationFrame()采用了系统时间间隔,会收集动画,统一刷新相较于setInterval更加节省性能.
    setInterval和setTimeout的问题在于不够精确,运行机制决定了只会把动画代码添加到浏览器UI进程中等待执行,可能会被阻塞.且会导致频繁的重流重绘.

    底层原理:动画延迟多长时间合适?一方面要保证循环间隔足够短,才能让动画流畅;另一方面,要循环间隔要经可能长,保证浏览器有能力渲染产生的变化.
    显示器刷新率一般为60hz,因此最佳的循环间隔时1000ms/60,约等于16.6ms.
  */ 
  timer.value = window.requestAnimationFrame(function fn() {
    if (speed.value<=95) {
      speed.value += 1
      dom.style.width = speed.value+'%'
      timer.value= window.requestAnimationFrame(fn) // 递归执行
    }else {
      speed.value = 1
      window.cancelAnimationFrame(timer.value)
    }
  })
}
const endLoading = ()=>{
  let dom = bar.value as HTMLElement
  setTimeout(()=>{
    window.requestAnimationFrame(()=>{
      speed.value = 100
      dom.style.width = speed.value+'%'
    })
  },500)
}
defineExpose({startLoading,endLoading})
</script>

<style scoped lang="less">
.wraps {
  position: fixed;
  top: 0;
  width: 100%;
  height: 2px;
  .bar {
    height: inherit;
    width: 2px;
    background-color: tomato;
  }
}
</style>
```
main.ts中引入,并挂载
```js
import { createApp,createVNode,render } from 'vue'
import App from './App.vue'
import {router} from "./router/index";
import loadingBar from "./components/loadingBar.vue";
let vNode = createVNode(loadingBar) // 转换为虚拟dom,

render(vNode,document.body)

const app = createApp(App)

app.use(router)

const whiteList = ['/']

router.beforeEach((to,from,next)=>{
    // 开始动画
    vNode.component?.exposed?.startLoading()
})

router.afterEach((to,from)=>{
    // 结束动画
    vNode.component?.exposed?.endLoading()
})

app.mount('#app')
```

## 第十一章 路由元信息

可以将将任意信息附加到路由上,可以在路由地址和导航守卫上都被访问到。应用场景:权限校验标识、路由组件过渡动效、路由组件持久化存储(keep-alive)的相关配置、动态页面标签名称等

### 根据路由元信息动态改变浏览器标签name
```js
[
    {
        path:"/",
        name:login,
        component:()=>import('@/views/login.vue'),
        alias: ['/login', ''],
        meta: {title:"登录页"},
    },{
        path:"/index",
        name:home,
        meta: {title:"首页"},
        component:()=>import('@/views/index.vue'),
    }
]
```
前置守卫中修改标签标题：`document.title = to.meta.title`,TypeScript可以通过[扩展 RouteMeta 接口](https://router.vuejs.org/zh/guide/advanced/meta.html)

### 路由组件过渡动效：
利用[Animate Css](https://animate.style/)动态添加类名，实现动画效果
```js
[
    {
        path:"/",
        name:login,
        component:()=>import('@/views/login.vue')
        meta: {
            transition:"animate__animated animate__fadeIn"
        },
    },{
        path:"/index",
        name:home,
        meta: {
            transition:"animate__animated animate__fadeIn"
        },
        component:()=>import('@/views/index.vue'),
    }
]
```

App.vue，支持[Transition API ](https://cn.vuejs.org/guide/built-ins/transition.html)
```vue
<template>
    <router-view v-slot="{ route,Component }"> <!-- v-slot 语法糖可简写为#default -->
    <transition name="fade" :enter-active-class="route.meta.transition">
        <component :is="Component" />
    </transition>
    </router-view>
</template>
```

## 第十二章 滚动行为
当切换到新路由时，想要页面滚到顶部/任意位置，或者是保持原先的滚动位置。

[scrollBehavior 函数](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)接收 to、 from 路由对象和 savedPosition。
```js
[
    path:"/",
    savedPosition((to,from,savePosition)=>{
        // return { top: 0 } // 始终滚动到顶部 
        // return {el:"#main", top:0} // 滚动到指定元素的相对偏移量
        if (savedPosition) {
            return savedPosition // 滚动到上一次位置
        } else {
            return { top: 0 }
        }
        // 返回一个 falsy 的值，或者是一个空对象，那么不会发生滚动。
    })
]
```

## 第十三章 动态路由

[官方文档](https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html) 

在应用程序已经运行的时候添加或删除路由。应用场景：菜单权限
```vue
<script lang='ts' setup>
  import { ref,reactive,watch,toRaw } from 'vue'
  import { useRouter } from 'vue-router';
  import { login } from "../axios/index";

  type User = {
    name:string,
    password:string,
  }
  let userInfo = reactive<User>({
      name:"",
      password:"",
  })
  const router = useRouter()

  //   提交信息
  const submit = ()=>{
    let user =  toRaw(userInfo);
    if(!user.name||!user.password) {
        alert("信息不完整,请填写完整")
        return
    }
    login(userInfo).then(data=>{
      let {code,power,name,token} = data.data 
      if(code === 200) {
        // 写入storage
        localStorage.setItem('token',token)
        localStorage.setItem('power',JSON.stringify(power))
        // 动态路由
        power.forEach(menu => {
            router.addRoute({
                path: menu.path,
                name: menu.name,
                // component:()=>{import(`@/components/${menu.component}`)}
                // 这里采用了异步组件的方式，推荐使用官方的 @rollup/plugin-dynamic-import-vars 插件
                component:()=>defineAsyncComponent(()=>import(/* @vite-ignore */`@/components/${menu.component}`))
            })
        })
        // 路由跳转
        router.push({name:"model-a", })
      }else {
        console.log('用户名/密码错误');
        return
      }
    })
  }
</script>
```

[Glob 导入文档](https://cn.vitejs.dev/guide/features.html#glob-import)
