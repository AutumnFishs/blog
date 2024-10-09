import type { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
  "/study/": [
    {
      text: "VitePress笔记",
      collapsed: false,
      items: [
        // { text: '快速开始', link: '/study/vitepress/index.html' },
        { text: "简单部署", link: "/study/vitepress/deploy.html" },
        {
          text: "关于主题配置",
          items: [
            { text: "默认主题配置", link: "/study/vitepress/config.html" },
          ],
        },
        { text: "碎片知识", link: "/study/vitepress/miscellaneous.html" },
      ],
    },
    {
      text: "React笔记",
      collapsed: false,
      items: [
        { text: "react相关", link: "/study/react/index.html" },
        { text: "react路由相关", link: "/study/react/router.html" },
        { text: "react状态库相关", link: "/study/react/store.html" },
        { text: "常用案例", link: "/study/react/demo.html" },
      ],
    },
    {
      text: "Vue笔记",
      collapsed: false,
      items: [
        { text: "vue相关", link: "/study/vue/index.html" },
        { text: "vue小案例", link: "/study/vue/demo.html" },
      ],
    },
    {
      text: "nginx笔记",
      collapsed: false,
      items: [{ text: "nginx conf文件配置", link: "/study/nginx/index.html" }],
    },
  ],
  "/miscellaneous/": [
    {
      text: "日常碎片",
      collapsed: false,
      items: [
        { text: "一些杂七杂八的记录", link: "/miscellaneous/index.html" },
        {
          text: "关于电脑重置后的一些配置",
          link: "/miscellaneous/config.html",
        },
      ],
    },
  ],
  "/interview/": [
    {
      text: "面试题",
      collapsed: false,
      items: [
        { text: "html相关", link: "/interview/html.html" },
        { text: "css相关", link: "/interview/css.html" },
        { text: "js相关", link: "/interview/js.html" },
        { text: "浏览器相关", link: "/interview/browser.html" },
        { text: "vue相关", link: "/interview/vue.html" },
        { text: "react相关", link: "/interview/react.html" },
        { text: "算法相关", link: "/interview/algorithm.html" },
        { text: "其他", link: "/interview/other.html" },
      ],
    },
  ],
};
