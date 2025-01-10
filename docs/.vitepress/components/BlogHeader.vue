<template>
    <div ref="blogHeader" class="blog-header" v-show="!isAtTop || !frontmatter.value?.home">
        <div class="container">
            <div class="left">hyj</div>
            <ul class="right-nav">
                <li v-for="item in site.themeConfig.nav" :key="item.text">
                    <a @click="navigateToAbout(item.link)">{{ item.text }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useData, useRouter } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'
import { throttle } from 'lodash'
const { site, frontmatter } = useData()
const blogHeader = ref()

const isAtTop = ref(true);
const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    isAtTop.value = scrollTop == 0;

};
const throttledHandleScroll = throttle(handleScroll, 100);

onMounted(() => {
    if (frontmatter.value.home) {
        window.addEventListener('scroll', throttledHandleScroll);
    }
})
onUnmounted(() => {
    window.removeEventListener('scroll', throttledHandleScroll);
})

const router = useRouter();
function navigateToAbout(link) {
    router.go(link);
}
</script>

<style scoped lang="scss">
.blog-header {
    position: fixed;
    z-index: 1;
    top: 0;
    width: 100vw;
    height: 64px;

    .container {
        margin: 0 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left {
        width: 100px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }

    .right-nav {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        li {
            margin-right: 20px;
        }
    }
}
</style>
