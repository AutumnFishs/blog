import { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
  { text: "博客", link: "/" },
  { text: "导航", link: "/pages/navpage" },
  {
    text: "归档",
    link: "/pages/archives",
  },
  {
    text: "分类",
    link: "/pages/category",
  },
  { text: "标签", link: "/pages/tags" },
  { text: "日志", link: "/pages/logs" },
  { text: "关于", link: "/pages/about" },
];
