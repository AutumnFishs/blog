import { basename } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";
// 主题配置
import { getThemeConfig } from "@sugarat/theme/node";
// vue预览组件插件
import {
  demoPreviewPlugin,
  viteDemoPreviewPlugin,
} from "@vitepress-code-preview/plugin";
import vueJsx from "@vitejs/plugin-vue-jsx";
// 文件图标插件
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import { nav, head } from "./theme/config";
// 主题相关配置
const blogTheme = getThemeConfig({
  popover: {
    title: "公告",
    body: [
      // { type: "text", content: "" },
      {
        type: "image",
        src: "/微信图片_20240929180716.jpg",
        style:
          "display: block;width:100%;padding-left:6px;height: 100%;border-radius: 4px; overflow: hidden;",
      },
    ],
    onRouteChanged: (to, show) => {
      if (to.path === "/") {
        show.value = false;
      }
      show.value = false; // 默认不显示
    },
    // footer: [
    //   // { type: "text", content: "footer content" },
    //   {
    //     type: "button",
    //     content: "作者博客",
    //     link: "https://sugarat.top",
    //   },
    //   {
    //     type: "button",
    //     content: "博客主题",
    //     link: "https://theme.sugarat.top",
    //     props: {
    //       type: "success",
    //     },
    //   },
    // ],
  },
  hotArticle: {
    title: "🔥 精选文章",
    nextText: "换一组",
    pageSize: 9,
    empty: "暂无精选内容",
  },
  homeTags: {
    title: `标签`,
  },
  footer: {
    version: true,
    copyright: "MIT License | 秋鱼",
  },
  backToTop: {
    // 自定义触发高度
    top: 450,
  },
  oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json",
      },
    ],
  },
});

// process.env.GITHUB_REPOSITORY 存储仓库的全名  GitHub Actions 自动设置的标准环境变量之一
const GITHUB_REPOSITORY = basename(process.env.GITHUB_REPOSITORY || "");

export default defineConfig({
  // 主题配置
  extends: blogTheme,
  // 基准路径
  base: GITHUB_REPOSITORY ? `/${GITHUB_REPOSITORY}/` : "/", //在git上部署时，需要设置base，在vercel上部署时设置为/即可
  /* 站点标题 */
  title: "秋鱼的笔记",
  /* 站点描述 */
  description: "这就是一份笔记...",
  /* 头部 */
  head,
  /* 语言 */
  lang: "zh-CN",
  /* markdown配置 */
  markdown: {
    // lineNumbers: true
    config(md) {
      const docRoot = fileURLToPath(new URL("../", import.meta.url));
      md.use(demoPreviewPlugin, { docRoot });
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin(), viteDemoPreviewPlugin(), vueJsx()],
  },
  /* 去除url上.html后缀 */
  cleanUrls: true,
  /* 默认主题配置 */
  themeConfig: {
    /* 站点logo */
    logo: "/avatar.jpg",
    /*  */
    siteTitle: "秋鱼",
    /* 本地搜索 */
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            resetButtonTitle: "清除查询条件",
            noResultsText: "无法找到相关结果",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    /* 导航栏右侧 */
    socialLinks: [
      { icon: "github", link: "https://github.com/smallwhite0410/vitePress" },
    ],
    /* 导航栏 */
    nav,
    /* 侧边栏 */
    // sidebar,
    /* 右侧大纲配置 */
    outline: {
      level: "deep",
      label: "目录",
    },
    /* 底部翻页 */
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: "",
      copyright: "Copyright © 2024",
    },
    /* 只在屏幕小于xxx生效，一般是移动端 */
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    /*  */
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },
    // 自定义配置
    // @ts-ignore
    visitor: {
      badgeId: "smallwhite0410/vitePress",
    },
    comment: {
      repo: "smallwhite0410/vitePress",
      repoId: "R_kgDOMtDtOA",
      category: "Announcements",
      categoryId: "DIC_kwDOMtDtOM4CQ7jy",
    },
    // carbonAds: { // 广告
    //   code: "xxx",
    //   placement: "your-carbon-placement",
    // },
    editLink: {
      pattern: "https://github.com/AutumnFishs/blog/tree/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
  },
});
