<script setup>
import Giscus from "@giscus/vue";
// import DefaultTheme from "vitepress/theme";
import BlogTheme from "@sugarat/theme";
import { watch } from "vue";
import { inBrowser, useData } from "vitepress";
// Layout 可以实现自定义

const { isDark, page } = useData();
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
watch(page, (page) => {
  if (page.frontmatter.layout === 'home') {
    document.querySelector('.theme-blog-popover').style.display = 'none'
  }
})
</script>

<template>
  <BlogTheme.Layout>
    <template #nav-bar-title-after>
      <BlogVisitor />
    </template>
    <template #doc-after>
      <div style="margin-top: 24px">
        <Giscus :key="page.filePath" repo="AutumnFishs/blog" repo-id="R_kgDOM9s-0A" category="Announcements"
          category-id="DIC_kwDOM9s-0M4CjVeh" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="0"
          input-position="bottom" lang="zh-CN" crossorigin="anonymous" :theme="isDark ? 'dark' : 'light'" />
      </div>
    </template>
  </BlogTheme.Layout>
</template>
<style lang="scss" scoped>
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}

@media screen and (min-width: 960px) {
  .home {
    padding-top: var(--vp-nav-height);
  }
}

.header-banner {
  width: 100%;
  padding: 60px 0;
}

.content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.blog-list-wrapper {
  width: 100%;
}

.blog-info-wrapper {
  margin-left: 16px;
  position: sticky;
  top: 100px;
}

@media screen and (max-width: 959px) {
  .blog-info-wrapper {
    margin-left: 16px;
    position: sticky;
    top: 40px;
  }
}

@media screen and (max-width: 767px) {
  .content-wrapper {
    flex-wrap: wrap;
  }

  .blog-info-wrapper {
    margin: 20px 0;
    width: 100%;
  }
}
</style>