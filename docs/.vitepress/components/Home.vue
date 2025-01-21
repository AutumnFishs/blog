<template>
  <div class="home">
    <header class="header">
      <img v-if="site.themeConfig.logo" class="logo" :src="site.themeConfig.logo" />
      <div class="title">{{ blog.name }}</div>
      <div class="description">{{ blog.desc }}</div>
      <ul class="banner">
        <li v-for="(item, index) in blog.inspiring" :key="index" v-show="isShowInspiring === index">
          {{ item }}
        </li>
      </ul>
      <div ref="headerBtnRef" class="header-btn" @click="handleClick">
        <svg class="icon" t="1736307361577" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1879">
          <path
            d="M529.408 210.688c-66.816 0-121.088 54.272-121.088 119.552v189.184c0 66.816 55.552 119.552 121.088 119.552 66.816 0 119.552-54.272 119.552-119.552V330.24c0-66.816-54.016-119.552-119.552-119.552z m93.184 307.2c0 51.456-41.728 93.184-93.184 93.184s-94.464-41.728-94.464-93.184v-189.184c0-51.456 43.008-93.184 94.464-93.184s93.184 41.728 93.184 93.184v189.184z"
            fill="#444444" p-id="1880"></path>
          <path
            d="M528.128 289.792c-6.912 0-13.824 5.632-13.824 13.824v66.816c0 6.912 5.632 13.824 13.824 13.824 6.912 0 13.824-5.632 13.824-13.824v-66.816c0-8.192-5.632-13.824-13.824-13.824z"
            fill="#D86E1B" p-id="1881"></path>
          <path
            d="M528.128 864.256l19.456-32 19.456-32-37.632 15.36-37.632-15.36 36.352 64zM523.776 750.08h8.448v8.448h-8.448zM523.776 733.44h8.448v8.448h-8.448zM523.776 716.8h8.448v8.448h-8.448z"
            fill="#444444" p-id="1882"></path>
        </svg>
      </div>
    </header>
    <main class="main relative" ref="mainRef">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { onMounted, onUnmounted, ref } from "vue";
const { site, frontmatter } = useData();

const headerBtnRef = ref();
onMounted(() => {
  const VPNavBar = document.querySelector(".VPNavBar");
  if (VPNavBar) {
    VPNavBar.classList.add(".home");
  }

  // 鼠标滚动icon显示隐藏
  document.addEventListener("scroll", (event) => {
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
const handleClick = () => {
  mainRef.value?.scrollIntoView({ behavior: "smooth" });
};

const blog = frontmatter.value.blog;
const inspiringTimeout = blog.inspiringTimeout || 10000;
const isShowInspiring = ref(0);
let timer = ref();
onUnmounted(() => {
  clearInterval(timer.value)
})
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
    height: 100vh;
    padding-bottom: 100px;

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

    .header-btn {
      position: absolute;
      bottom: 100px;

      .icon {
        width: 50px;
        height: 50px;
      }
    }
  }

  .main {
    padding-top: 88px;
    min-height: calc(100vh - 64px);
  }
}
</style>