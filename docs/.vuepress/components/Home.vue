<template>
  <div class="container">
    <header class="container-header"></header>
    <main class="container-main">
      <div class="main-left">
        <h5>来口鸡汤：</h5>
        <p>{{ soul }}</p>
      </div>
      <div class="main-right">
        <div class="posts-box">
          <h3>近期在看：</h3>
          <ul>
            <li v-for="item in posts">
              <a :href="item.link">{{ item.message }}</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
    <footer class="container-footer">
      <div class="footer-left">
        <button class="footer-btn start">
          <a href="/path.html">起步</a>
        </button>
      </div>
      <div class="footer-right">
        <div class="footer-btn resource">
          <a href="/amway.html">我的资源</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue';
import {get} from '../axios/index';

let soul = ref('xxxxx')
let posts = ref([
    { message: "web worker", link: "/posts/webWorker.html" },
    { message: "PWA离线缓存", link: "" },
    { message: "Event Loop事件循环机制", link: "/posts/EventLoop.html" },
    { message: "OSI七层网络模型", link: "" },
    { message: "web comment与微前端", link: "" },
    { message: "浏览器渲染", link: "" },
    { message: "常规响应式布局的方式", link: "" },
    { message: "浏览器与网络通信", link: "" },
    { message: "装饰器模式解决了什么问题", link: "" },
    { message: "ES6新特性之Proxy", link: "" },
    { message: "观察者模式和发布订阅模式", link: "" },
    { message: "Vue v-model原理解析", link: "" },
    { message: "Webpack手动构建Vue项目流程", link: "" },
    { message: "ESM、Commjs、AMD、CMD模块", link: "" },
    { message: "JWT技术", link: "" },
    { message: "", link: "" },
])

onMounted(()=>{
  try {
    init()
  } catch (error) {
    console.error(`初始化失败 ${error.message}`);
  }
})

let init = async()=> {
    let query = 'c=d&c=h&c=j&c=k'
    await get(query).then(({ data }) => {
        let { from, hitokoto, from_who } = data;
        soul.value = `${hitokoto} —— ${from_who?from_who:''}《${from}》`;
    });
}
</script>

<style scoped>
:root {
  --fg-color: #1f1c24;
  --font-sans: "DM Sans", sans-serif;
}
body,ul,li,span,h3,h4,h5 {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
/* 自定义样式 */
.container {
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  width:100%;
  height:80vh;
  border-radius: .5rem;
  margin-top: 1rem;
  -webkit-box-direction: normal;
  box-sizing: border-box;
  color: var(--fg-color);
  font-family: var(--font-sans);
  font-size: 18px;
  padding: 2rem 4rem;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
}
/* main start */
.container-main {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3rem;
  font-size: 1.5rem;
}
.main-left {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-right {
  box-sizing: border-box;
  font-size: 18px;
  width: 700px;
  height: 500px;
  padding: 8px 20px;
  overflow: auto;
  /* 隐藏滚动条 火狐*/
  scrollbar-width:none;   
  /* 隐藏滚动条 IE*/
  -ms-overflow-style:none;       
}
 /* 隐藏滚动条 chrome*/
.main-right::-webkit-scrollbar {          
    display: none;
}
.main-right h3 {
  margin: 6px 0;
}
.main-right ul {
  margin-left: 20px;
}
.main-right ul li {
  margin: 4px 0;
}
/* main end */
.container-footer {
  display: flex;
  align-items: center;
  height: 3rem;
  font-size: 1.5rem;
}
.footer-btn {
  font-size: 20px;
  border-radius: 10px;
  padding: 5px 20px;
  border: 1px solid #ccc;
  color: #222;
  margin: 3rem;
}
.footer-btn a {
  color: #222;
}
.footer-btn a:hover {
  color: seagreen;
  /* border: 0; */
  background-color: #fff;
}
/* 媒体查询 */
@media screen and (max-width:900px) {
  .main-left{
    display: none;
  }
}
</style>