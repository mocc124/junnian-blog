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
  },
  plugins: ['@vuepress/back-to-top']
}