(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{265:function(t,s,e){},289:function(t,s,e){"use strict";e(265)},296:function(t,s,e){"use strict";e.r(s);var a=e(0);e(94);const o=e(295).a.create({baseURL:"https://v1.hitokoto.cn",timeout:5e3});var i=Object(a.b)({__name:"Home",setup(t){let s=Object(a.d)("xxxxx"),e=Object(a.d)([{message:"web worker",link:"/posts/webWorker.html"},{message:"PWA离线缓存",link:""},{message:"Event Loop事件循环机制",link:"/posts/EventLoop.html"},{message:"OSI七层网络模型",link:""},{message:"web comment与微前端",link:""},{message:"浏览器渲染",link:""},{message:"常规响应式布局的方式",link:""},{message:"浏览器与网络通信",link:""},{message:"装饰器模式解决了什么问题",link:""},{message:"ES6新特性之Proxy",link:""},{message:"观察者模式和发布订阅模式",link:""},{message:"Vue v-model原理解析",link:""},{message:"Webpack手动构建Vue项目流程",link:""},{message:"ESM、Commjs、AMD、CMD模块",link:""},{message:"JWT技术",link:""},{message:"",link:""}]);Object(a.c)(()=>{try{i()}catch(t){console.error("初始化失败 "+t.message)}});let i=async()=>{await function(t){try{return"[object Object]"===Object.prototype.toString.call(t)?o({url:"/",method:"get",params:{...t}}):o({url:"/?"+t,method:"get"})}catch(t){throw new Error(`err: ${t} `)}}("c=d&c=h&c=j&c=k").then(({data:t})=>{let{from:e,hitokoto:a,from_who:o}=t;s.value=`${a} —— ${o||""}《${e}》`})};return{__sfc:!0,soul:s,posts:e,init:i}}}),n=(e(289),e(11)),r=Object(n.a)(i,(function(){var t=this,s=t._self._c,e=t._self._setupProxy;return s("div",{staticClass:"container"},[s("header",{staticClass:"container-header"}),t._v(" "),s("main",{staticClass:"container-main"},[s("div",{staticClass:"main-left"},[s("h5",[t._v("来口鸡汤：")]),t._v(" "),s("p",[t._v(t._s(e.soul))])]),t._v(" "),s("div",{staticClass:"main-right"},[s("div",{staticClass:"posts-box"},[s("h3",[t._v("近期在看：")]),t._v(" "),s("ul",t._l(e.posts,(function(e){return s("li",[s("a",{attrs:{href:e.link}},[t._v(t._s(e.message))])])})),0)])])]),t._v(" "),t._m(0)])}),[function(){var t=this._self._c;this._self._setupProxy;return t("footer",{staticClass:"container-footer"},[t("div",{staticClass:"footer-left"},[t("button",{staticClass:"footer-btn start"},[t("a",{attrs:{href:"/path.html"}},[this._v("起步")])])]),this._v(" "),t("div",{staticClass:"footer-right"},[t("div",{staticClass:"footer-btn resource"},[t("a",{attrs:{href:"/amway.html"}},[this._v("我的资源")])])])])}],!1,null,"451df754",null);s.default=r.exports}}]);