---
sidebar: auto
---

# Express

[Express 官网](https://www.expressjs.com.cn/)

## 了解Express

先尝试使用node原生模块开启一个服务
```js
// 调用 HTTP 模块
const http = require("http");

// 创建 HTTP 服务器并监听 8000 端口的所有请求
http.createServer((request, response) => {

    // 用 HTTP 状态码和内容类型来设定 HTTP 响应头
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应体 "Hello World"
    response.end('Hello World\n');
}).listen(8000);

// 在控制台打印访问服务器的 URL
console.log('服务器运行于 http://127.0.0.1:8000/');
```
这样写起来很麻烦，且如果需要进行一些具体的处理，比如还要处理 GET、POST、DELETE 请求、托管静态文件，或用模板来动态创建响应，会陷入重复造轮子的场景。

Express的优点：

- 为不同 URL 路径中使用不同 HTTP 动词的请求（路由）编写处理程序。
- 集成了“视图”渲染引擎，以便通过将数据插入模板来生成响应。
- 设置常见 web 应用设置，比如用于连接的端口，以及渲染响应模板的位置。
- 在请求处理管道的任何位置添加额外的请求处理“中间件”。

除了上面这些我们还可以通过[Express中间件](https://www.expressjs.com.cn/resources/middleware.html)中找到实现 cookie、会话、用户登录、URL 参数、POST 数据、安全头等更复杂功能的库。

Express的[基本示例](https://www.expressjs.com.cn/starter/hello-world.html)，通过require() 导入 Express 模块，并创建了一个 Express 应用。`app.get()`是路由定义,在监听到一个path = '/' 的 HTTP GET 请求时会调用 callback 函数，callback函数调用响应的`send()`方法来返回字符串响应。最后一个代码块在“3000”端口上启动服务器，并在控制台打印日志。

## 模块
使用模块的优点：单文件应用是很难维护的，模块可以划分功能，让代码管理更有序。使用模块还有助于管理名字空间，因为在使用模块时只会导入模块中显式导出的变量。

express遵循了Common js的模块规则，可使用`require()`函数将它们导入其它代码。Express 本身就是一个模块，Express 应用中使用的中间件和数据库也是。

导出模块：
```js
exports.area = width => { return width * width; };
exports.perimeter = width => { return 4 * width; };

// 把对象赋值给 module.exports（也可以让 exports 对象直接作为一个构造器或另一个函数）也是可以的
// module.exports = {
//   area: width => { return width * width; },
//   perimeter: width => { return 4 * width; }
// };
```

导入模块：
```js
const square = require('./square');
console.log('边长为 4 的正方形面积为 ' + square.area(4));
```
更多内容请参考[CommonJs模块](http://nodejs.cn/api/modules.html)

## 异步api

在 Node 中更加推荐使用无阻塞异步 API，因为 Node 是一个单线程事件驱动的执行环境。一旦阻塞意味着所有请求被影响。
所以请大量使用 [async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)、[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 等特性。还可以参考这个文章：[编写异步 JavaScript 程序的指南](http://callbackhell.com/)

## 路由处理器
[路由文档 中文](https://www.expressjs.com.cn/guide/routing.html)

```js
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```
这定义了一个路由处理函数来处理对path='/'的 HTTP GET 请求。callback 直接调用响应的 send() 以返回字符串“Hello World!”。除了send方法，还可以通过调用 `res.json()` 来发送 JSON 响应、调用` res.sendFile()` 来发送文件。[更多其它响应方法](https://www.expressjs.com.cn/guide/routing.html#response-methods)

注意：callback的第一个参数始终是请求，第二个参数始终是响应。一般都默认使用req和res命名。

express对象还提供了处理其它请求的更多方法，如下：
```
checkout(), copy(), delete(), get(), head(), lock(), merge(), mkactivity(), mkcol(), move(), m-search(), notify(), options(), patch(), post(), purge(), put(), report(), search(), subscribe(), trace(), unlock(), unsubscribe().
```
注意一个特殊的路由方法: `app.all()`，它可以响应任意 HTTP 请求。

### 分离路由模块
借助[express.Router 对象](https://www.expressjs.com.cn/guide/routing.html#express.Router)实现，示例如下：

导出
```js
const express = require('express');
const router = express.Router();

// 首页路由
router.get('/', (req, res) => {
  res.send('首页');
});

// “关于”页面路由
router.get('/about', (req, res) => {
  res.send('关于页面');
});

module.exports = router;
```
导入:
```js
const router = require('./router.js');

app.use('/doc', router); // /doc/home、/doc/aboout
```

⚪ 今后将介绍更多关于路由的信息，特别是关于 Router 的用法，请参见 路由和控制器 一节。

## 中间件
中间件提供了错误处理静态文件、到压缩 HTTP 响应等等。路由函数通过向 HTTP 客户端返回响应来结束 HTTP请求，而中间件函数通常是对请求或响应执行某些操作，然后调用“栈”里的下一个函数，可能是其它中间件或路由处理器。中间件的调用顺序由应用开发者决定。一般使用 `app.use()` 或 `app.add()` 将一个中间件函数添加至处理链中，这取决于中间件是应用于所有响应/特定GET，POST等响应的。可以为两种情况指定相同的路由，但在调用 use() 时路由可以省略，示例如下：
```js
const express = require('express');
const app = express();

// 示例中间件函数
const a_middleware_function = (req, res, next) => {
  // ... 进行一些操作
  next(); // 调用 next() ，Express 将调用处理链中下一个中间件函数。
};

// 用 use() 为所有的路由和请求添加该函数
app.use(a_middleware_function);

// 用 use() 为一个特定的路由和所有请求添加该函数
app.use('/someroute', a_middleware_function);

// 为一个特定的路由和请求添加该函数
app.get('/', a_middleware_function);

app.listen(3000);
```

P.S. 中间件callback可以执行任何操作，如更改请求和响应对象，也可以提前结束请求。如果它没有结束循环，则必须调用`next() `将控制传递给下一个中间件函数（否则请求将成为悬挂请求，请求被阻塞）。

P.S. 中间件和路由函数是严格按声明顺序调用的。一些中间件的引入顺序很重要（例如，如果会话中间件依赖于 cookie 中间件，则必须先添加cookie处理器）。绝大多数情况下要先调用中间件后设置路由，否则路由处理器将无法访问中间件的功能。

P.S. 中间件函数和路由处理回调之间的唯一区别是：中间件函数有第三个参数 next。在中间件执行逻辑后应及时调用这个 next 函数，它包含了中间件函数调用后应调用的下一个函数。

使用第三方中间件，首先需要借助 NPM 将其安装到当前应用中。如要安装[morgan HTTP 请求记录器]()中间件:`npm install morgan`然后，调用 `use()` 将该中间件添加到栈：
```js
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
```

手写中间件请参考文档：[编写用于快速应用的中间件](编写用于快速应用的中间件)

## 托管静态文件
[static()](https://www.expressjs.com.cn/starter/static-files.html) 是 Express 提供的原生中间件函数之一，可以用来托管包括图片、CSS 和 JS 等静态文件。如通过这一行来托管 'public' 文件夹中的所有静态文件：`app.use(express.static('public'));`托管之后，public 文件夹下的所有文件均可通过在根 URL 后直接添加文件名来访问了，如:http://localhost:3000/index.html。

可以通过多次调用 static() 来托管多个文件夹。如果一个中间件函数找不到某个文件，将直接传递给下一个中间件（中间件的调用顺序取决于声明顺序）。
```js
app.use(express.static('public'));
app.use(express.static('media'));
```

还可以为静态 URL 指定了一个装载路径，而不是直接把文件添加到根 URL 里。如:`app.use('/media', express.static('public'));` ，于是这些文件将通过 '/media' 前缀调用：http://localhost:3000/media/images/dog.jpg

## 错误处理
Express 内建了[错误处理机制](https://www.expressjs.com.cn/guide/error-handling.html)，可以协助处理 app 中没有被处理的错误。默认的错误处理中间件函数在中间件函数栈的末尾。如果一个错误传递给 next() 而没有用错误处理器来处理它，内建处理机制将启动，栈跟踪的错误将回写给客户端。

用来处理错误的特殊中间件函数有四个参数(err, req, res, next)，且必须在所有其它 use() 和路由调用后才能调用，因此它们是需求处理过程中最后的中间件。例如：
```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('出错了！');
});
```

补充：Node 和 Express 有一个一般性约定，即：使用“错误优先”回调。这个约定要求回调函数的第一个参数是错误值，而后续的参数包含成功数据。可以参考这个文章：[理解错误优先回调](https://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/)

## 使用数据库

Express 支持的Node支持的所有数据库，包括：PostgreSQL、MySQL、Redis、SQLite、MongoDB，等等。使用数据库前先要用 NPM 来安装驱动程序。以 MongoDB 为例，安装驱动：`npm install mongodb`，

在 Express 代码中 require() 驱动程序，连接，然后就可以执行增加、读取、更新、删除四种操作（CRUD）。以下示例展示了如何查找 MongoDB 表中 'cat' 的记录：
```js
// MongoDB 3.0 以上版本适用，老版本不适用。
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', (err, client) => {
  if(err) {
    throw err;
  }

  let db = client.db('animal');
  db.collection('cat').find().toArray((err, result) => {
    if(err) throw err;
    console.log(result);
    client.close();
  });
});
```
还有一种通过“对象关系映射（Object Relational Mapper，简称 ORM）”间接访问数据库的方法。可以把数据定义为“对象”或“模型”，然后由 ORM 根据给定的数据库格式搞定所有映射关系。这种方法对于开发者有一个好处：可以用 JavaScript 对象的思维而无需直接使用数据库语法，同时传进的数据也有现成的检查工具。

更多文档请查阅[数据库集成](https://www.expressjs.com.cn/guide/database-integration.html)

## 渲染视图

模板引擎可为输出文档的结构指定一个模板，并于页面生成时填充。通常用于生成 HTML，也可以生成其它类型的文档。Express支持的模板有可以查阅[兼容引擎的列表](https://github.com/expressjs/express/wiki#template-engines)。模板之间的对比可参考这篇文章[JavaScript 模板引擎对比评测](https://strongloop.com/strongblog/compare-javascript-templates-jade-mustache-dust/)，下面采用[pug](https://www.pugjs.cn/api/getting-started.html)模板示例：

安装依赖:`npm insatll pug --save`

配置：
```js
const express = require('express');
const app = express();

// 指定加载模板引擎模块
app.set('view engine', 'pug');
// 指定模板文件所在的目录
app.set('views', 'views');

// 设置路由，命中时并传递参数
app.use('/',(req, res, next) => {
    res.render('index', { title: 'Hey', message: 'Hello world! (pug)' })
});

app.listen(3000,()=>{console.log('http://127.0.0.1:3000')});
```

创建一个在目录中命名的 Pug 模板文件：
```pug
//- views/index.pug
html
  head
    title= title
  body
    h1= message
```
访问: http://127.0.0.1:3000

