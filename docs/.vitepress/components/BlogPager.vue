<template>
    <div class="pager-link">
        <div class="prev" @click="handlePrev" v-if="findIndex > 0">
            <el-icon>
                <DArrowLeft />
            </el-icon>
            <span>{{ pager?.prev || 'Prev page' }}</span>
        </div>
        <div class="next" @click="handleNext" v-if="findIndex < props.posts.length - 1">
            <span>{{ pager?.next || 'Next page' }}</span>
            <el-icon>
                <DArrowRight />
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vitepress';
import { ref, watch } from 'vue';
const props = defineProps({
    posts: {
        type: Array as () => any[],
        default: () => [] // 默认为空数组
    }
});

const { site } = useData();
const base = site.value.base.slice(0, -1);
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
        go(base + props.posts[findIndex.value - 1].url)
    }
}

// 下一页
const handleNext = () => {
    if (findIndex.value < props.posts.length - 1) {
        go(base + props.posts[findIndex.value + 1].url)
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