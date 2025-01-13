<script setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import { onMounted, watch, computed, ref } from "vue";
import { inBrowser, useData } from "vitepress";
import { data } from '../theme/post.data'
import DetailedPostCard from './DetailedPostCard.vue'


const { Layout } = DefaultTheme
const { isDark, page, frontmatter, site } = useData();
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

const posts = computed(() => Object.values(data.postMap))
const computedRecentPosts = computed(() =>
  posts.value
    .map(item => ({ ...item, date: item.date.string }))
    .slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
)

const pageNum = ref(1)
const pageSize = ref(10)

const handleChange = (currentPageNum, currentPageSize) => {
  pageNum.value = currentPageNum
}

// 背景图
const bg = frontmatter.value.bgImage ? site.value.base + 'public/' + frontmatter.value.bgImage : ''
</script>

<template>
  <Layout>
    <!-- home -->
    <template #layout-top>
      <home v-if="frontmatter.layout === 'home'">
        <div :class="`bg bg-[url(${bg})]`" :style="{
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"></div>
        <template #main>
          <div class="main">
            <DetailedPostCard v-for="(article, index) in computedRecentPosts" :key="index" :url="article.url"
              :title="article.title" :abstract="article.abstract" :date="article.date" :tags="article.tags" />
            <div class="main-pagination">
              <el-pagination size="small" background layout="prev, pager, next" @next-click="handleChange"
                :hide-on-single-page="true" @prev-click="handleChange" @change="handleChange" :total="posts.length"
                class="mt-4" />
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
      <div class="mt-[24px]">
        <Giscus :key="page.filePath" repo="AutumnFishs/blog" repo-id="R_kgDOM9s-0A" category="Announcements"
          category-id="DIC_kwDOM9s-0M4CjVeh" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="0"
          input-position="top" lang="zh-CN" crossorigin="anonymous" loading="lazy" :theme="isDark ? 'dark' : 'light'" />
      </div>
    </template>
  </Layout>
</template>
<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
  overflow: hidden;

}

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



    .el-pagination.is-background>ul.el-pager>li.is-active.number {
      background: var(--sb-thumb-color) !important;
    }
  }
}
</style>
