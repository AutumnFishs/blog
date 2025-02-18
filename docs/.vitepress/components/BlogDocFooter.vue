<script setup>
import { computed } from "vue";
import { data } from "../theme/post.data";
import { useRouter, withBase } from "vitepress";

const router = useRouter();

// 获取排序后的文章列表
const posts = computed(() =>
  Object.values(data.postMap)
    .sort((a, b) => b.date.time - a.date.time)
    .map((item) => ({
      ...item,
      date: item.date.string,
    }))
);

// 获取当前文章索引
const currentIndex = computed(() =>
  posts.value.findIndex((item) => item.title === router.route.data.title)
);

// 获取分页数据
const pager = computed(() => {
  if (currentIndex.value === -1) return [];

  const start = Math.max(0, currentIndex.value - 1);
  const end = Math.min(posts.value.length, start + 3);

  return posts.value.slice(start, end);
});
</script>

<template>
  <footer v-if="pager.length" class="VPDocFooter">
    <div class="pager">
      <div v-for="(post, i) in pager" :key="post.url" class="pager-item"
        :class="post.title !== router.route.data.title ? 'is-opacity' : 'current-page'">
        <a :href="withBase(post.url)">cd ..{{ post.url }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.VPDocFooter {
  text-align: center;

  .pager {
    display: inline-block;

    .pager-item {
      margin: 0.5rem 0;
    }

    .is-opacity {
      opacity: 0.5;
    }

    .current-page {
      font-size: 16px;
    }
  }
}
</style>
