<template>
  <div class="home">
    <header class="header">
      <img v-if="site.themeConfig.logo" class="logo" :src="site.themeConfig.logo" />
      <div class="title">{{ blog.name }}</div>
      <div class="description">{{ blog.desc }}</div>
      <ul class="banner">
        <li v-for="(item, index) in blog.inspiring" v-show="isShowInspiring === index" :key="index">
          {{ item }}
        </li>
      </ul>
    </header>
    <main ref="mainRef" class="main relative">
      <BlogPostCard v-for="(article, index) in computedRecentPosts" :key="index" :url="article.url"
        :title="article.title" :abstract="article.abstract" :date="article.date" :tags="article.tags" />
      <div class="main-pagination">
        <Pagination v-model:pageSize="pageSize" :total="posts.length" size="small" :totalContent="false"
          :showPageSize="false" @change="handleChange" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { data } from "../theme/post.data";
import { Pagination } from "tdesign-vue-next";
const { site, frontmatter } = useData();

const headerBtnRef = ref();
onMounted(() => {
  const VPNavBar = document.querySelector(".VPNavBar");
  if (VPNavBar) {
    VPNavBar.classList.add(".home");
  }

  // 鼠标滚动icon显示隐藏
  document.addEventListener("scroll", () => {
    const btnElement = headerBtnRef?.value;
    if (!btnElement) return;
    if (document.documentElement.scrollTop < 100) {
      btnElement.style.opacity = "1";
    } else {
      btnElement.style.opacity = "0";
    }
  });


  // 励志轮播
  timer.value = setInterval(() => {
    if (isShowInspiring.value >= blog.inspiring.length - 1) {
      isShowInspiring.value = 0;
    } else {
      isShowInspiring.value += 1;
    }
  }, inspiringTimeout);
});

// 滚动到文章列表
const mainRef = ref();
const blog = frontmatter.value.blog;
const inspiringTimeout = blog.inspiringTimeout || 10000;
const isShowInspiring = ref(0);
let timer = ref();
onUnmounted(() => {
  clearInterval(timer.value)
})

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

<style scoped lang="scss">
.home {
  width: 100%;

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 100px 0 0;

    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .title {
      font-size: 32px;
    }

    .description {
      font-size: 14px;
      font-weight: 400;
      opacity: 0.7;
      color: #999;
      padding: 10px 0;
    }

    .banner {
      width: 100%;

      li {
        text-align: center;
        margin: auto;
        font-size: 16px;
      }
    }
  }

  .main {
    padding-top: 88px;
    min-height: calc(100vh - 64px);
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
}
</style>