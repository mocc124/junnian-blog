# web Worker

Web Worker 提供了在后台线程中运行脚本的方法。并且可以使用XMLHttpRequest执行 I/O (尽管responseXML和channel属性总是为空)。一个 worker 在完成任务之后可以将消息发送到主线程，通过指定的事件处理。

web worker 的限制：
- 同源限制：分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
- dom限制：Worker 线程无法操作dom，也无法使用document、window、parent对象，除了navigator和location对象。
- 通信联系：Worker 线程和主线程不在同一个上下文环境，不能直接通信，必须通过消息完成。
- 脚本限制：Worker 线程不能执行alert()和confirm()，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
- 文件限制：Worker 线程无法读取本地文件（file://），它所加载的脚本，必须来自网络。

应用场景：处理数据，大文件上传等

参考链接：[使用 Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

## 基本使用
浏览器原生提供Worker()构造函数，用来供主线程生成 Worker 线程。此构造函数接受两个参数，脚本的网址（必需，是一个js脚本且要遵守同源政策）和配置对象（可选，用来指定区分 Worker 的名称）。

Worker()构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下。
- onerror，指定error监听函数
- postMessage，向 Worker 线程发送消息。
- onmessage，指定message事件监听函数
- onmessageerror，发送的数据无法序列化成字符串时，会触发此事件。
- terminate，立即终止 Worker 线程。

Web Worker 有自己的全局对象（self），也可以使用window身上的部分api方法。
- name，只读属性，Worker名字
- postMessage，向产生这个 Worker 线程发送消息。
- onmessage，指定message事件的监听函数。
- onmessageerror，发送的数据无法序列化成字符串时，会触发这个事件。
- importScript，加载 JS 脚本。
- close，关闭 当前Worker 线程。

主线程
```js
// Worker()构造函数参数是一个来自网络的脚本文件,若下载失败，Worker 自动失败
let worker = new Worker('work.js')

// 主线程调用 worker.postMessage() 向 Worker 发消息，可以是任意数据类型（包括二进制数据）
worker.postMessage('hello worker')

// 主线程通过 worker.onmessage 指定监听函数，用于接收消息
worker.onMessage = (event)=>{
    let {data} = event
    if(data) {
       console.log(data) 
       // 关闭线程
       worker.terminate();
    }else {
        worker.postMessage('hello worker')
    }
}
```

Work.js
```js
let message = 'worker.js is running'

// 监听函数方式1 self代表子线程自身，即子线程的全局对象。
self.addEventListener('message', function (event) {
    let { data } = event
    if(data) {
        self.postMessage(message);
        // self.close()可以在 Worker 内部关闭自身
        self.close()
        return
    }
    self.postMessage('data is not found');
}, false);

// 监听函数方式2
this.addEventListener('message', function (event) {
    // ...
}, false);

// 监听函数方式3
addEventListener('message', function (event) {
    // ...
}, false);

// 监听函数方式4
self.onmessage = ('message', function (event) =》{
  // ...
}, false);
```

错误处理：主线程中可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的error事件（Worker 内部也可以监听error事件，自行处理）。
```js
worker.onerror(function (event) {
    let {lineno,filename,message} = event
});

// or
worker.addEventListener('error', function (event) {
  // ...
});
```

P.S. Worker 使用完毕，为了节省系统资源，必须使用`rerminate()`h或`close()`方法关闭 Worker。

## 数据通信

主线程和worker线程之间通过postMessage通信，且通信内容不限制类型。但是注意：通信内容是拷贝关系，即是传值而不是传址，Worker线程中对通信内容的修改，不会影响到主线程。底层浏览器会先将通信内容串行化，然后把串行化后的字符串发给 Worker,worker 接收后再将它还原。

对于二进制文件，js引擎允许采用传址的方式，叫做[Transferable Objects]()。这样做可以减少运算，节省性能，但是一旦采取这种方式，主线程就无法使用这些二进制数据，这是为了防止出现多个线程同时修改数据的场景。

## 加载脚本块

如果要在worker线程中加载脚本，需要借助方法 importScripts()。如：`importScripts('script1.js');`


也可以载入与主线程在同一个网页的代码，如下：
```html
<!DOCTYPE html>
  <body>
    <!-- 指定的type属性必须是一个自定义的值 -->
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

Work
```js
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (event) {
// e.data === 'some message'
};
```
上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。