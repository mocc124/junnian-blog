import axios from "axios";

const server = axios.create({
  baseURL: "https://v1.hitokoto.cn",
  timeout: 5000,
});

function get(query) {
    try {
      if (Object.prototype.toString.call(query) === '[object Object]') {
        return server({
          url: "/",
          method: 'get',
          params: {...query}
        })
      }
      return server({
        url: "/?" + query,
        method: 'get',
      })
    } catch (error) {
      throw new Error(`hitokoto error:${error}`)
    }
  }

export default {get}