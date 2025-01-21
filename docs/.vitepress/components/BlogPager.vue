<template>
    <div class="pager-link" v-if="!frontmatter.layoutClass">
        <div class="prev" @click="handlePrev">
            <ChevronLeftDoubleIcon />
            <span>{{ findIndex > 0 ? (pager?.prev || 'Prev page') : '到顶了' }}</span>
        </div>
        <div class="next" @click="handleNext">
            <span>{{ findIndex < props.posts.length - 1 ? (pager?.next || 'Next page') : '到底了' }}</span>
                    <ChevronRightDoubleIcon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useData, withBase, useRouter } from 'vitepress';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, watch } from 'vue';
const props = defineProps({
    posts: {
        type: Array as () => any[],
        default: () => [] // 默认为空数组
    }
});

const { site, frontmatter } = useData();
const { route, go } = useRouter();
const findIndex = ref(0)

watch(() => route.component?.name, (newVal, oldVal) => {
    const path = newVal?.split('.md')[0]
    findIndex.value = props.posts.findIndex(item => (item.url).includes(path))
}, { immediate: true })


const pager = site.value.themeConfig.docFooter
// 上一页
const handlePrev = () => {
    if (findIndex.value > 0) {
        go(withBase(props.posts[findIndex.value - 1].url || ''))
    } else {
        MessagePlugin.warning('到顶了');
    }
}

// 下一页
const handleNext = () => {
    if (findIndex.value < props.posts.length - 1) {
        go(withBase(props.posts[findIndex.value + 1].url || ''))
    } else {
        MessagePlugin.warning('到底了');
    }
}
</script>

<style scoped lang="scss">
.pager-link {
    position: absolute;
    top: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.pager-link>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    padding: 2px 10px;
    width: 48%;
    height: 100%;
    transition: border-color 0.25s;
    font-size: 12px;
}

.pager-link>div:hover {
    border-color: var(--vp-c-brand-1);
}

.pager-link .next:hover,
.pager-link .prev:hover {
    cursor: pointer;
    color: var(--vp-c-brand-1);
}
</style>