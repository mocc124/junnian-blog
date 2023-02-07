module.exports =  [
  ['link', { rel: 'icon', href: '/search.ico' }],
  [
    'script', {}, `
    var _hmt = _hmt || [];
    (function(){
      let hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?1a7062b879a785e4c4c743ef69d9724e";
      let s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();     
    `
  ],
]