const head = require("./config/head.js");
const nav = require("./config/nav.js");

module.exports = {
  title: 'web Ninga',
  description: '...',
  base: "/junnian-blog/",
  head,
  configureWebpack: {
    node: {
      global: true,
      process: true
    }
  },
  themeConfig: {
    nav,
    lastUpdated: '最后更新日期', 
  },
  plugins: ['@vuepress/back-to-top','@vuepress/last-updated'],
}