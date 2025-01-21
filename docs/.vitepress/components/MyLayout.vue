<script setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import { watch } from "vue";
import { inBrowser, useData } from "vitepress";

const { Layout } = DefaultTheme;
const { isDark, page, frontmatter } = useData();

// giscus主题跟随博客主题
watch(isDark, (dark) => {
  if (!inBrowser) return;

  const iframe = document
    .querySelector("giscus-widget")
    ?.shadowRoot?.querySelector("iframe");

  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? "dark" : "light" } } },
    "https://giscus.app"
  );
});
</script>

<template>
  <Layout>
    <template #layout-top>
      <home v-if="frontmatter.layout === 'home'">
      </home>
    </template>

    <template #layout-bottom>
      <BlogGoTop />
    </template>

    <!-- giscus评论 -->
    <template #doc-after>
      <Giscus :key="page.filePath" repo="AutumnFishs/blog" repo-id="R_kgDOM9s-0A" category="Announcements"
        category-id="DIC_kwDOM9s-0M4CjVeh" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="0"
        input-position="top" lang="zh-CN" crossorigin="anonymous" loading="lazy" :theme="isDark ? 'dark' : 'light'" />
    </template>

    <!-- 图片预览 -->
    <template #doc-bottom>
      <BlogImageViewer />
    </template>
  </Layout>
</template>
