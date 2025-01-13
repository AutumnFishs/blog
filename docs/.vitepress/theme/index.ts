import DefaultTheme from "vitepress/theme";
import { h, onMounted } from "vue";
import { useData, type EnhanceAppContext, type Theme } from "vitepress";
// 自定义组件
import MyLayout from "../components/MyLayout.vue";
import MNavLinks from "../components/MNavLinks.vue";
import MNavLink from "../components/MNavLink.vue";
import BlogConfetti from "../components/BlogConfetti.vue";
import BlogVisitor from "../components/BlogVisitor.vue";
import MButton from "../components/MButton.vue";
import BlogHeader from "../components/BlogHeader.vue";
import Home from "../components/Home.vue";
import DetailedPostCard from "../components/DetailedPostCard.vue";
import BlogArchives from "../components/BlogArchives.vue";
import BlogTags from "../components/BlogTags.vue";
import BlogGoTop from "../components/BlogGoTop.vue";
import BlogPager from "../components/BlogPager.vue";

// vue预览组件插件
import DemoPreview, { useComponents } from "@vitepress-code-preview/container";
import "@vitepress-code-preview/container/dist/style.css";

// 进度条插件
import vitepressNprogress from "vitepress-plugin-nprogress";
import "vitepress-plugin-nprogress/lib/css/index.css";
// 文件图标库
import "virtual:group-icons.css";
// 图片放大插件
import mediumZoom from "medium-zoom";
// 主题配置
import "./styles/tailwind.css";
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
    app.component("BlogConfetti", BlogConfetti);
    app.component("BlogVisitor", BlogVisitor);
    app.component("MButton", MButton);
    app.component("BlogHeader", BlogHeader);
    app.component("Home", Home);
    app.component("DetailedPostCard", DetailedPostCard);
    app.component("BlogArchives", BlogArchives);
    app.component("BlogGoTop", BlogGoTop);
    app.component("BlogTags", BlogTags);
    app.component("BlogPager", BlogPager);

    useComponents(app, DemoPreview);
  },
  setup() {
    onMounted(() => {
      mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" }); // 默认
      // mediumZoom("#app img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    });
  },
} satisfies Theme;
