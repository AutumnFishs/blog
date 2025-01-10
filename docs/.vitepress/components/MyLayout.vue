<script setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import { onMounted, watch, computed } from "vue";
import { inBrowser, useData } from "vitepress";
import { data } from '../theme/post.data'
import DetailedPostCard from './DetailedPostCard.vue'


const { Layout } = DefaultTheme
const { isDark, page, frontmatter } = useData();
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

onMounted(() => {
  document.querySelector(".VPFooter").style.display = "none";
})

watch(page, (page) => {
  console.log(page);

  if (page.frontmatter.layout === "home") {
    document.querySelector(".VPFooter").style.display = "none";
  } else {
    document.querySelector(".VPFooter").style.display = "block";
  }
});

const computedRecentPosts = computed(() => data.recentPosts.map(item =>
  ({ ...item, date: item.date.string })))
</script>

<template>
  <Layout>
    <template #home-features-before>
      <div v-if="frontmatter.layout === 'home'">
        <home>
          <template #main>
            <div class="max-w-screen-lg w-full px-6 py-8 my-0 mx-auto">
              <DetailedPostCard v-for="(article, index) in computedRecentPosts" :key="index" :url="article.url"
                :title="article.title" :abstract="article.abstract" :date="article.date" :tags="article.tags" />
            </div>
          </template>
        </home>
      </div>
    </template>
    <template #doc-after>
      <div class="mt-[24px]">
        <Giscus :key="page.filePath" repo="AutumnFishs/blog" repo-id="R_kgDOM9s-0A" category="Announcements"
          category-id="DIC_kwDOM9s-0M4CjVeh" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="0"
          input-position="top" lang="zh-CN" crossorigin="anonymous" loading="lazy" :theme="isDark ? 'dark' : 'light'" />
      </div>
    </template>
  </Layout>
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
