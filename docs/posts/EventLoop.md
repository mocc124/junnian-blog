# Event Loop

参考链接:[并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)，[事件循环：微任务和宏任务](https://zh.javascript.info/event-loop)，[一次弄懂Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606?utm_source=gold_browser_extension)，[带你彻底弄懂Event Loop](https://segmentfault.com/a/1190000016278115)

Event Loop是一个执行模型，一般指的是事件循环机制。JavaScript是单线程语言，单线程的好处是不用考虑同步的问题，避免了线程复杂和保证了线程安全。但需要cpu排队处理任务，这就意味着任务可能会被阻塞，导致cpu资源被闲置。如 Ajax 从网络读取数据，cpu得等着响应结果出来，再继续往下执行，后面的任务会被阻塞。

为了防止这种情况的发生，于是将所有任务大致分成同步任务（synchronous）和异步任务（asynchronous）。

同步任务会在主线程上依次排队执行，会形成一个执行栈（execution context stack）。

异步任务则不会进入主线程、而被放入"任务队列"（task queue），异步任务运行结束，如定时器到达时间，就在"任务队列"之中放置一个事件。

"执行栈"中的所有同步任务被清空，系统就会读取"任务队列"，看看里面有哪些事件可被执行。于是那些对应的异步任务会结束等待状态，进入执行栈，依次执行。

![](https://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)

主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

实际上，JS引擎会将异步任务再次划分为宏任务和微任务，宏任务会进入到一个Event Table中，并注册回调函数，每当指定的事件完成时，这个Event Table会将这个函数移到Event Queue中；微任务也会进入到另一个Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中；

![](https://upload-images.jianshu.io/upload_images/4820992-82913323252fde95.png?imageMogr2/auto-orient/strip|imageView2/2/w/863/format/webp)

1. 整体的script(作为第一个宏任务)开始执行的时候，会把所有代码分为两部分：“同步任务”、“异步任务”；
2. 同步任务会直接进入主线程依次执行；
3. 异步任务会再分为宏任务和微任务；
4. 宏任务进入到Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中；
5. 微任务也会进入到另一个Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中；
6. 当主线程内的任务执行完毕，主线程为空时，会检查微任务的Event Queue，如果有任务，就全部执行，如果没有就执行下一个宏任务；
7. 上述过程会不断重复，这就是Event Loop事件循环；

## Event Loop

先大致了解几个数据结构：
- 队列（Queue）：先进先出，类似于排队，先排的人最先被提供服务
- 栈（Stack）：先进后出，类似于向箱子里放东西，最后放置的在最顶层，也会最先被取出来
- 调用栈（Call Stack）：也是栈，不过里面放的是函数
- Event Table: 存储 JavaScript 中的异步事件 (request, setTimeout, IO等) 及其对应的回调函数的列表，可以理解为一张 事件->回调函数 对应表
- Event Queue：回调函数队列，也叫 Callback Queue，当 Event Table 中的事件被触发，事件对应的 回调函数 就会被 push 进这个 Event Queue，然后等待被执行

同步任务和异步任务：
- 同步任务：代码按照自上而下的顺序依次执行
- 异步任务（又分为宏任务和微任务，微任务执行栈被清空才会执行宏任务）
  - 微任务：Promise.then/catch/finally、MutationObserver、process.nextTick(Node.js环境)
  - 宏任务：Script标签、setTimeout、setInteval、UI交互事件、postMessage、Ajax
  
示例1：
```js
console.log(1)
setTimeout(function(){
  console.log(2)
},0)
console.log(3)
```

1. 开始，script 标签先进入 Call Stack
2. 同步任务直接在栈中被执行，输出1
3. 栈中的异步任务从 Call Stack 移入到 Event Table ，setTimeout是宏任务被移入宏任务 Event Table
4. 同步任务输出3后，执行栈 Call Stack 被清空，于是执行setTimeout（因为没有指定时间，会被直接放入Event Queue ），输出2


示例2：
```js
setTimeout(()=>{
    console.log(1)
});
new Promise(resolve=>{
    console.log(2);
    resolve(100);
}).then(data=>{
    console.log(data)
});
console.log(4);
/*
1. setTimeout 被放入宏任务队列
2. new Promise执行输出2，Promise.then属于微任务，放入微任务队列
3. 输出4，同步任务执行结束，执行栈被清空，检查微任务队列，执行.then方法，输出100
4. .then执行结束，微任务执行结束，第一次循环结束，从宏任务队列拿出宏任务执行，wetTimeout执行，输出1
*/
```

示例 3：
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

示例 4：
```js
function add() {
  console.log(1)
  setTimeout(function() { // timer1
    console.log(2)
  }, 1000)
}
add();

setTimeout(function() { // timer2
  console.log(3)
})

new Promise(function(resolve) {
  console.log(4)
  setTimeout(function() { // timer3
    console.log(5)
  }, 100)
  resolve()
}).then(function() {
  setTimeout(function() { // timer4
    console.log(6) 
  }, 0)
  console.log(7)
})

console.log(8)

/*
1. 依次执行同步任务：输出1，4，8,并依次将timer1，timer2，timer3放入宏任务队列
2. 同步任务被清空，检查微任务队列，发现有.then，执行
3. timer4 放入宏任务队列，然后打印输出7，.then执行结束，第一次循环结束，检查宏任务队列
4. 宏任务队列根据执行顺序依次为，timer2，timer4，timer3，timer1，取出timer2执行，打印3
5. timer2执行完毕，检查微任务队列，无微任务，第二次循环结束，取出下一个宏任务timeer4执行
6. ...，打印输出6
7. ...，打印输出5
8. ...，打印输出2
*/
```


## 思考以下代码块输出结果
题1：
```js
for(var i=0;i<5;i++) {
  setTimeout(()=>{
    console.log(i) // ?
  }) 
}
```

题2：
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

