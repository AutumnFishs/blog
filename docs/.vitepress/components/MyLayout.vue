<script setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import { watch, computed, ref } from "vue";
import { inBrowser, useData } from "vitepress";
import { data } from "../theme/post.data";
import BlogPostCard from "./BlogPostCard.vue";
import { Pagination } from "tdesign-vue-next";

const { Layout } = DefaultTheme;
const { isDark, page, frontmatter, site } = useData();

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

// 文章列表
const posts = computed(() =>
  Object.values(data.postMap).sort((a, b) => b.date.time - a.date.time)
);

const computedRecentPosts = computed(() =>
  posts.value
    .map((item) => ({ ...item, date: item.date.string }))
    .slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
);

// 分页
const pageNum = ref(1);
const pageSize = ref(10);
const handleChange = (pageInfo) => {
  pageNum.value = pageInfo.current;
};
</script>

<template>
  <Layout>
    <!-- home -->
    <template #layout-top>
      <home v-if="frontmatter.layout === 'home'">
        <template #main>
          <div class="main">
            <BlogPostCard
              v-for="(article, index) in computedRecentPosts"
              :key="index"
              :url="article.url"
              :title="article.title"
              :abstract="article.abstract"
              :date="article.date"
              :tags="article.tags"
            />
            <div class="main-pagination">
              <Pagination
                v-model:pageSize="pageSize"
                :total="posts.length"
                size="small"
                @change="handleChange"
                :totalContent="false"
                :showPageSize="false"
              />
            </div>
          </div>
        </template>
      </home>
    </template>

    <!-- 回到顶部 -->
    <template #layout-bottom>
      <BlogGoTop />
    </template>

    <!-- giscus评论 -->
    <template #doc-after>
      <Giscus :key="page.filePath" repo="AutumnFishs/blog" repo-id="R_kgDOM9s-0A" category="Announcements"
        category-id="DIC_kwDOM9s-0M4CjVeh" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="0"
        input-position="top" lang="zh-CN" crossorigin="anonymous" loading="lazy" :theme="isDark ? 'dark' : 'light'" />
    </template>

    <!-- prev & next -->
    <template #aside-outline-before>
      <!-- <BlogPager :posts="posts"></BlogPager> -->
    </template>
    <!-- doc bottom -->
    <template #doc-bottom>
      <BlogImageViewer />
    </template>
    <!-- doc top -->
    <template #doc-top>
      <!-- <BlogSidebar /> -->
    </template>
  </Layout>
</template>
<style lang="scss" scoped>
.main {
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  .main-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin: 20px;
  }
}
</style>
