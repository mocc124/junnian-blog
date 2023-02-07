# HTML

## 基础内容

[MDN-web 入门](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web)、
[现代 JavaScript 教程](https://zh.javascript.info/)

## HTML5 内容

### 1. Audio、Video(多媒体支持)

[MDN docs-视频和音频内容](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Video_and_audio_content)、
[一些静态 src 资源](https://github.com/mdn/learning-area/tree/main/html/multimedia-and-embedding/video-and-audio-content)

简单示例：

```html
<!-- 没有声明 controls 属性，audio 将不会包含默认控件 -->
<audio id="clickSound">
  <!-- 源 1 -->
  <source
    src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
  />
  <!-- 源 2，源 1失败会依次向下尝试 -->
  <source src="xxx.mp3" />
</audio>

<button id="toggle" onclick="toggleSound()">播放</button>

<script>
  function toggleSound() {
    const music = document.getElementById("clickSound");
    const toggle = document.getElementById("toggle");

    if (music.paused) {
      music.play();
      toggle.innerHTML = "暂停";
    } else {
      music.pause();
      toggle.innerHTML = "播放";
    }
  }
</script>
```

### 2. Web storage

[MDN docs-Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)、
[localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)和[sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)两者的区别

- localStorage 和 sessionStorage 都是用来存储客户端临时信息的对象。目前只能存储字符串类型的对象（规范中可以存储其他原生类型的对象，但没有浏览器对其进行实现）。
- 不同浏览器之间均无法共享 localStorage 或 sessionStorage 信息。
- Storage 都容易受到 XSS 攻击。
- 两者的生命周期不同：localStorage 生命周期是永久，除非用户显式清除 localStorage 信息。sessionStorage 生命周期为当前窗口或标签页，一旦窗口或标签页被关闭，那么所有通过 sessionStorage 存储的数据也会被清空。
- localStorage 可以被同浏览器不同窗口/标签页中所有同源页面更新并同步，但 sessionStorage 不可以。

### 3. 离线存储

Web storage API 采用了离线缓存，会生成一个清单文件（manifest file)，这个清单文件实质就是一系列的 URL 列表文件，这些 URL 分别指向页面当中的 html,css,javascript,图片等相关内容。

当使用离线应用时，应用会引入这一清单文件，浏览器会读取这一文件，下载相应的文件，并将其缓存到本地。使得这些 web 应用能够脱离网络使用，而用户在离线时的更改也同样会映射到清单文件中，并在重新连线之后将更改返回应用。

### 4. WebSocket(双向通讯长链接)

[WebSocket protocol](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 是 HTML5 一种新的协议。它实现了浏览器与服务器全双工通信(full-duplex)。在此之前，web 通信是单向的，只能由客户端发起请求，服务端进行响应。想要进行实现响应或者客户端主动推送消息，只能采用"轮询"，即每隔一段时候，就发出一个询问，了解服务器有没有新的信息（效率低，浪费资源--不停连接/长连接）。最典型应用场景——聊天室。

其他特点包括：

1. 建立在 TCP 协议之上，服务器端的实现比较容易。
2. 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
3. 数据格式比较轻量，性能开销小，通信高效。
4. 可以发送文本，也可以发送二进制数据。
5. 没有同源限制，客户端可以与任意服务器通信。
6. 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。`ws://example.com:80/some/path`

示例:

```js
// 测试环境: http://coolaf.com/tool/chattest

const WS_STATUS = {
  0: "正在连接",
  1: "连接成功",
  2: "连接正在关闭",
  3: "连接失败/连接已关闭",
};

let ws = new WebSocket("ws://82.157.123.54:9010/ajaxchattest");

console.log(
  `当前状态:${WS_STATUS[ws.readyState] ?? "未知"} time:${new Date().getTime()}`
);

ws.onopen = function (evt) {
  ws.send("Hello WebSockets!");
};

ws.onmessage = function (res) {
  console.log("messge", res.data);
  ws.close(1000);
  console.log(
    `当前状态:${
      WS_STATUS[ws.readyState] ?? "未知"
    } time:${new Date().getTime()}`
  );
};

ws.onerror = function (err) {
  console.log("err", err);
};
```

### 5. Geolocation(地理位置 API)

[地理位置 API - Geolocation](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API)通过调用 navigator.geolocation 浏览器接口，获得用户位置数据相关的权限。

示例:

```js
const successCallback = (location) => {
  console.log("获取到的地理位置：", location);
};
const errorCallback = (error) => {
  switch (error.code) {
    case error.TIMEOUT:
      console.log("获取地理位置超时！");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("内部错误！无法获取地理位置！");
      break;
    case error.PERMISSION_DENIED:
      console.log("没有权限获取地理位置权限！");
      break;
    default:
      console.log("获取地理位置异常：", error);
      break;
  }
};
const PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 3000,
};

navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback,
  PositionOptions
);
```

### 6. Communication（跨文档消息通信）

浏览器内部[postMessage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)提供的直接通信机制，支持了运行在同一浏览器中的框架，标签页，窗口间的跨源通信。

示例（使用了 vscode 插件-Live Serevr）:

A 页面（发送消息）

```html
<script>
  window.onload = () => {
    const btn = document.getElementById("open");
    btn.addEventListener("click", (e) => {
      var popup = window.open("B.html");
      // 需要等待 B 页面加载完成之后再发送消息
      popup.onload = function () {
        // 消息队列会依次发送
        popup.postMessage("消息 A", "*");
        popup.postMessage("消息 B", "*");
        popup.postMessage("消息 C", "*");
      };
    });
  };

  // 监听回信
  window.addEventListener(
    "message",
    (event) => {
      let { data } = event;
      console.log(data);
    },
    false
  );
</script>

<body>
  <button id="open">OPEN</button>
</body>
```

B 页面（接收消息并回信）

```html
<script>
  window.addEventListener("message", messageHandler, true);
  function messageHandler(e) {
    let { origin, source, data } = e;
    console.log(origin, source, data);
    event.source.postMessage("回信", origin);
  }
</script>
```

### 7. Web Worker

[Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 为 JavaScript 创造了多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。

参考:[阮一峰——Web Worker 使用教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)、

### 8. requestAnimationFrame

通过 [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)，JS 动画能够和 CSS 动画/变换或 SVG SMIL 动画同步发生，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果。另外，当这个标签页不可见时，浏览器会暂停此标签页中的动画，这会节省一部分算力。

### 9. 摄像头

[MDN 演示](https://yari-demos.prod.mdn.mozit.cloud/zh-CN/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos/_sample_.%E6%BC%94%E7%A4%BA.html)

### 10. 全屏

浏览器提供了[Fullscreen API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API) 可以简单地控制浏览器，使得一个元素与其子元素占据整个屏幕，并隐藏其它浏览器用户界面。应用场景： 全屏地图、视频全屏播放、动画全屏预览等

[MDN 演示](https://mdn.github.io/dom-examples/fullscreen-api/index.html)

```html
<script>
  window.addEventListener("load", startup);

  function startup() {
    var elem = document.getElementById("video");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }
</script>
<body>
  <video controls id="video">
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
    />
  </video>
</body>
```

如果按照上面的肯定会报错，因为:无法直接执行 requestFullscreen()，这个 API 只有用户主动行为才允许触发，如下:

```html
<script>
  let elem = null;

  window.addEventListener("load", startup);

  function startup() {
    elem = document.getElementById("video");
  }

  window.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      if (!document.fullscreenElement) {
        // 窗口模式
        elem.requestFullscreen();
      } else {
        // 全屏模式
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  });
</script>
<body>
  <video controls id="video">
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
    />
  </video>
</body>
```

### 11. HTML5 拖放实现

[MDN-拖拽操作](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations)
[Drag and Drop API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)

[MDN-小车案例](https://park.glitch.me/)

### 12. 其它常见的 api

新增语义化标签、新增了一些 CSS3 选择器、新增了 storage 存储机制（ sessionStorage 和 localStorage）、新增了 history 对象、 form 表单元素升级、用于绘画的 canvas、web Woker 等

## pug

[Pug 中文文档](https://pugjs.org/zh-cn/api/getting-started.html)

应用场景：SSR 服务端渲染（Express+Pug、Nestjs+Pug）

pug 基本原理:（compile 方法将 template 编译成一个 js 函数，调用这个编译函数并传入参数会返回渲染的 HTML 字符串）

```js
// 编译出来的函数可以被传入不同的数据重复使用
const compiledFunction = pug.compile("p #{name} hello");
compiledFunction({ name: "Pug" });
compiledFunction({ name: "JavaScript" });

// render() 系列函数，会把编译和渲染两个步骤合二为一
pug.render("p #{name} hello", { name: "Pug" });
```
