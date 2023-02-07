
import axios  from "axios";

const server = axios.create({
  baseURL: "https://v1.hitokoto.cn", timeout: 5000,
});


function get(query) {
    try {
      if (Object.prototype.toString.call(query) !== '[object Object]') { 
        if (Object.prototype.toString.call(query) !== '[object String]') { 
          return server({
            url: "/?" + query,
            method: 'get',
          })
        }
        return server({
          url: "/",
          method: 'get',
          params: {...query}
        })
      }
    } catch (error) {
      throw new Error(`hitokoto error:${error}`)
    }
    throw new TypeError(`${query} 类型错误`)
  }

export default {get}