import { basename } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";
// 主题配置
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
// element plus 按需引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { nav, head } from "./theme/config";
// 主题相关配置

// process.env.GITHUB_REPOSITORY 存储仓库的全名  GitHub Actions 自动设置的标准环境变量之一
const GITHUB_REPOSITORY = basename(process.env.GITHUB_REPOSITORY || "");

export default defineConfig({
  // 基准路径
  base: GITHUB_REPOSITORY ? `/${GITHUB_REPOSITORY}/` : "/blog", //在git上部署时，需要设置base，在vercel上部署时设置为/即可
  /* 站点标题 */
  title: "秋鱼的小破站",
  /* 站点描述 */
  description: "个人博客",
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
    plugins: [
      groupIconVitePlugin(),
      viteDemoPreviewPlugin(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 3001,
    },
  },
  /* 去除url上.html后缀 */
  cleanUrls: true,
  /* 默认主题配置 */
  themeConfig: {
    /* 本地搜索 */
    siteTitle: "hyj",
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
      { icon: "github", link: "https://github.com/autumnfishs/blog" },
    ],
    /* 导航栏 */
    nav,
    /* 右侧大纲配置 */
    outline: {
      level: "deep",
      label: "当前页面",
    },
    /* 底部翻页 */
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: "Released under the MIT License",
      copyright: "Copyright © 2024-2025 hyj",
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
      badgeId: "AutumnFishs/blog",
    },
    comment: {
      repo: "AutumnFishs/blog",
      repoId: "R_kgDOM9s-0A",
      category: "Announcements",
      categoryId: "DIC_kwDOM9s-0M4CjVeh",
    },
    editLink: {
      pattern: "https://github.com/AutumnFishs/blog/tree/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
  },
});
