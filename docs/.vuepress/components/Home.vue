<template>
    <div class="container">
      <div class="main">
        <div class="main-sentence">
          <div class="main-sentence-content">{{sentence.hitokoto}}</div>
          <div class="main-sentence-from">
            {{`—${sentence.from_who?sentence.from_who:""} &lt;${sentence.from?sentence.from:""}&gt;`}}
          </div>
        </div>
        <div class="main-start">
          <p>{{hoemMessage}}</p>
          <div class="main-start-btns">
            <button class="main-btn-start">起步</button>
            <button class="main-btn-more">查看资源</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from "axios"
  export default {
    data() {
      return {
        hoemMessage:"Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。",
        sentence: {
          from:"浣溪沙",
          from_who:"苏轼",
          hitokoto:"游蕲水清泉寺，寺临兰溪，溪水西流。"
        }
      }
    },
    mounted() {
      this.initServe()
      // this.get({c:"i",c:"d",c:"k"}).then(res=>{
      //   let {from,from_who,hitokoto} = res.data
      //   this.sentence = {from,from_who,hitokoto}
      // })
    },
    methods:{
      initServe() {
        this.server = axios.create({
          baseURL: "https://v1.hitokoto.cn", timeout: 5000,
        });
      },
      get(query) {
        try {
          if (query ?? false) { 
            if (Object.prototype.toString.call(query) !== '[object String]') { 
              return this.server({
                url: "/",
                method: 'get',
                params: {...query}
              })
            }
            return this.server({
                url: "/?" + query,
                method: 'get',
            })
          }
          throw new TypeError(`${query} 类型错误`)
        } catch (error) {
          throw new TypeError(error)
        }
      }
    }
  }
</script>

<style scoped>
/* 自定义样式 */
.container {
  display:flex;
  flex-direction: column;
  width:100%;
  height:100%;
  padding:10px ;
}
/* main start */
.main {
  display:flex;
  justify-content:space-around;
  align-items:center;
  flex-wrap:wrap;
}
.main-sentence {
  box-sizing:border-box;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:end;
  max-height:200px;
  max-width:160px;
  min-height:150px;
  min-width:330px;
  color: #5a29e4;
  padding: 0.35rem 1.136rem;
  box-shadow: 0px 1rem 3rem rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  transition-duration: 200ms;
}
.main-sentence-content {
  margin:5px 0;
}
.main-sentence-from {
  margin:5px 0;
}
.main-start {
  box-sizing:border-box;
  display:flex;
  flex-direction: column;
  justify-content:space-between;
  align-items:start;
  max-height:400px;
  max-width:400px;
  min-height:260px;
  min-width:200px;
  padding: 0.35rem 0.4rem;
  border-radius: 1rem;
  box-sizing:border-box;
}
.main-start p {
  margin:0;
  padding:0;
}
.main-start-btns {
   display:flex;
}
.main-btn-start {
    -webkit-box-direction: normal;
    box-sizing: border-box;
    font-family: "DM Sans", sans-serif;
    font-size: 15px;
    font-weight: 400;
    text-decoration: none;
    padding: 10px 15px;
    box-shadow: 0px 1rem 3rem rgba(255, 255, 255, 0);
    border-radius: 1rem;
    transition-duration: 200ms;
    margin: 1rem;
    border:0 ;
    background-color:rgba(0,0,0,0.1);
    color:#5a29e4;
}
.main-btn-more {
    -webkit-box-direction: normal;
    box-sizing: border-box;
    font-family: "DM Sans", sans-serif;
    font-size: 15px;
    font-weight: 400;
    text-decoration: none;
    padding: 10px 20px;
    box-shadow: 0px 1rem 3rem rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    transition-duration: 200ms;
    margin: 1rem;
    border:0 ;
    background-color:rgba(0,0,0,0.1);
    color:#5a29e4;
}
/* main end */
/* footer start */
.footer {
  width:100%;
  height:40px;
  background-color:tomato;
}
/* footer end */
@media screen and (max-width: 800px)  {
  .main-sentence {
    display:none;
  }
}
</style>