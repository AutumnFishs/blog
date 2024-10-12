import { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
  { text: "首页", link: "/" },
  { text: "导航", link: "/navpage/index.html" },
  {
    text: "前端",
    items: [
      { text: "Vue笔记", link: "/frontend/vue/vue.html" },
      { text: "React笔记", link: "/frontend/react/react.html" },
      { text: "Nginx笔记", link: "/frontend/nginx/nginx.html" },
      { text: "VitePress笔记", link: "/frontend/vitepress/vitepress.html" },
    ],
  },
  { text: "面试题", link: "/interview/index.html" },
  { text: "随手日志", link: "/fragments/index.html" },
  { text: "关于我的", link: "https://github.com/AutumnFishs" },
];
