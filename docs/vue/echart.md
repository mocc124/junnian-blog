---
sidebar: auto
---

# Echart
目前被普遍认可的图表库分别是Hcharts、Echarts、AntV。

## 补充内容：如何实现网页主题自动随系统主题切换（深/浅）

[prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)CSS 媒体特性用于检测用户是否有将系统的主题色设置为亮色或者暗色。

[:root](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:root)这个 CSS 伪类匹配文档树的根元素。对于 HTML 来说，:root 表示 <html> 元素，除了优先级更高之外，与 html 选择器相同。

[var()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var)CSS 函数可以插入一个自定义属性（有时也被称为“CSS 变量”）的值，用来代替非自定义属性中值的任何部分。

```css
:root {
  --vt-c-white: #ffffff;

  --vt-c-black: #181818;
  --vt-c-black-soft: #222222;
  --vt-c-black-mute: #282828;

  --vt-c-indigo: #2c3e50;

  --vt-c-divider-dark-1: rgba(84, 84, 84, 0.65);
  --vt-c-divider-dark-2: rgba(84, 84, 84, 0.48);

  --vt-c-text-dark-1: var(--vt-c-white);
  --vt-c-text-dark-2: rgba(235, 235, 235, 0.64);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);

    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);

    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}
```

## 准备

接口：[m眼电影票房 GET](http://pf.fe.st.maoyan.com/dashboard-ajax)

准备一个 node 服务：
依赖：
```json
{
  "name": "nodeserver",
  "version": "1.0.0",
  "description": "安装依赖： `npm install ts-node -g`",
  "main": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "ts-node index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.14.2"
  },
  "dependencies": {
    "axios": "^1.3.4",
    "express": "^4.18.2"
  }
}
```

开启服务：
```ts
import express,{Express,Router,Request,Response} from "express";
import axios from "axios";

const port:number = 3000
const url:string = "http://pf.fe.st.maoyan.com/dashboard-ajax"

const app:Express = express()
const router:Router = express.Router()

// 配置跨域请求中间件(服务端允许跨域请求)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); // 设置允许来自哪里的跨域请求访问（req.headers.origin为当前访问来源的域名与端口）
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"); // 设置允许接收的请求类型
    
    next();
});

app.use('/api',router)

router.get('/list',async(req:Request,res:Response)=>{
    let  {data} = await axios.get(url)
    
    res.json({
        data
    })
})

app.listen(port,()=>{
    console.log(`app run http://127.0.0.1:${port}/api/list`)
})
```

## Echarts

[Apache ECharts](https://echarts.apache.org/zh/index.html)

[Echarts Demo集](https://www.isqqw.com/)
[ppchart](http://ppchart.com/#/)
[chartlib echarts](http://chartlib.datains.cn/echarts)

安装依赖：`npm install echarts --save`

main.ts 引入 echarts5：`import * as echarts from "echarts"`

引入 echarts（全部引入）：
```js
import * as echarts from "echarts"

onMounted(()=>{
  let charts = echarts.init(document.querySelector("#container") as HTMLElement)
  let options = {
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36]
      }
    ]
  }

  charts.setOption(options)
}) 
```

[按需引入](https://echarts.apache.org/handbook/zh/basics/import/)请参考文档


### 补充：echarts引入地图
因不可抗力，地图组件已经在官方文档中移除，请自行查找，示例如下：
```vue
<template>
  <div class="box">
    <div id="china"></div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted } from 'vue'
import * as echarts from "echarts"; 
import "./assets/china.js"; //此文件自行查找

const dataList = [
    {name: '澳门', value: 18},
    {name: '香港', value: 273},
    {name: '台湾', value: 153},
    {name: '新疆', value: 76},
    {name: '宁夏', value: 75},
    {name: '青海', value: 18},
    {name: '甘肃', value: 134},
    {name: '陕西', value: 248},
    {name: '西藏', value: 1},
    {name: '云南', value: 176},
    {name: '贵州', value: 146},
    {name: '四川', value: 543},
    {name: '重庆', value: 576},
    {name: '海南', value: 168},
    {name: '广西', value: 254},
    {name: '广东', value: 1407},
    {name: '湖南', value: 1018},
    {name: '湖北', value: 67800},
    {name: '河南', value: 1273},
    {name: '山东', value: 765},
    {name: '江西', value: 936},
    {name: '福建', value: 307},
    {name: '安徽', value: 990},
    {name: '浙江', value: 1237},
    {name: '江苏', value: 633},
    {name: '上海', value: 394},
    {name: '黑龙江', value: 484},
    {name: '吉林', value: 93},
    {name: '辽宁', value: 126},
    {name: '内蒙古', value: 75},
    {name: '山西', value: 133},
    {name: '河北', value: 319},
    {name: '天津', value: 137},
    {name: '北京', value: 512}
];

onMounted(()=>{
  let charts = echarts.init(document.querySelector("#china") as HTMLElement)
  charts.setOption({
    tooltip: {
        triggerOn: "click",
        formatter: function(e:any, t:any, n:any) {
            return '.5' == e.value ? e.name + "：有疑似病例" : e.seriesName + "<br />" + e.name + ":" + e.value
        }
    }, 
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    }, // 提供下载工具
    visualMap: {
        min: 0,
        max: 100000,
        left: 26,
        bottom: 40,
        showLabel: !0,
        text: ["高", "低"],
        pieces: [{
            gt: 10000,
            label: "> 10000人",
            color: "#7f1100"
        }, {
            gte: 1000,
            lte: 10000,
            label: "1000 - 10000人",
            color: "#ff5428"
        }, {
            gte: 100,
            lt: 1000,
            label: "100 - 1000人",
            color: "#ff8c71"
        }, {
            gt: 10,
            lt: 100,
            label: "10 - 100人",
            color: "#ffd768"
        }, {
            gt: 1,
            lt: 10,
            label: "1 - 10人",
            color: "#ffffff"
        }],
        show: !0
    },
    geo: {
        map: "china",
        roam: !1,
        scaleLimit: {
            min: 1,
            max: 2
        },
        zoom: 1.23,
        top: 120,
        label: {
            show: !0,
            fontSize: "14",
            color: "rgba(0,0,0,0.7)"
        },
        itemStyle: {
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: "rgba(0, 0, 0, 0.2)",        
        },
        emphasis: {
            areaColor: "#f2d5ad",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderWidth: 0
        }
    },
    series: [{
        name: "确证病例",
        type: "map",
        geoIndex: 0,
        data: dataList,
    }]
  })
})
</script>

<style scoped lang="less">
.box {
  width: 100vw;
  height: 100vh;
  #china {
    width: 100%;
    height: 100%;
  }
}
</style>
```

