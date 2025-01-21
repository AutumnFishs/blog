// @ts-nocheck
import DefaultTheme from "vitepress/theme";
import { h, onMounted } from "vue";
import { useData, type EnhanceAppContext, type Theme } from "vitepress";
// 自定义组件
import MyLayout from "../components/MyLayout.vue";
import MNavLinks from "../components/MNavLinks.vue";
import MNavLink from "../components/MNavLink.vue";
import MButton from "../components/MButton.vue";

import Home from "../components/Home.vue";
import BlogPostCard from "../components/BlogPostCard.vue";
import BlogTags from "../components/BlogTags.vue";
import BlogGoTop from "../components/BlogGoTop.vue";
import BlogImageViewer from "../components/BlogImageViewer.vue";

// vue预览组件插件
import DemoPreview, { useComponents } from "@vitepress-code-preview/container";
import "@vitepress-code-preview/container/dist/style.css";

// 进度条插件
import vitepressNprogress from "vitepress-plugin-nprogress";
import "vitepress-plugin-nprogress/lib/css/index.css";
// 文件图标库
import "virtual:group-icons.css";

// tdesign全局样式引入
import "tdesign-vue-next/es/style/index.css";

// 主题配置
import "./styles/index.scss";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {};

    const { frontmatter } = useData();

    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(MyLayout, props, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    vitepressNprogress(ctx);
    app.component("MNavLinks", MNavLinks);
    app.component("MNavLink", MNavLink);
    app.component("MButton", MButton);
    app.component("Home", Home);
    app.component("BlogPostCard", BlogPostCard);
    app.component("BlogGoTop", BlogGoTop);
    app.component("BlogTags", BlogTags);
    app.component("BlogImageViewer", BlogImageViewer);

    useComponents(app, DemoPreview);
  },
  setup() {
    onMounted(() => {});
  },
} satisfies Theme;
