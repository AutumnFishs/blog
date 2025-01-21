<script setup lang="ts">
import { withBase } from 'vitepress';

defineProps({
    url: {
        type: String
    },
    title: {
        type: String
    },
    abstract: {
        type: String
    },
    date: {
        type: String
    },
    tags: {
        type: Array
    }
})
</script>

<template>
    <div class="post-card">
        <div class="post-header">
            <div class="post-title">
                <a class="post-title-text" :href="withBase(url || '')" v-text="title"></a>
                <div class="post-date" v-text="date"></div>
            </div>
        </div>
        <div class='post-info'>
            <a v-for="(tag, i) in tags" :key="i" v-text="tag" class="tag"
                :href="withBase(`/pages/category?tag=${tag}` || '')"></a>
        </div>
        <p class="abstract" v-html="abstract"></p>
    </div>
</template>

<style scoped lang="scss">
.post-card {
    padding: 14px 0 14px;

    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .post-title {
            flex: 1;
            color: var(--vp-c-text-1);
            font-size: 1.125rem;
            font-weight: 500;
            margin: 0.1rem 0;
            display: flex;
            justify-content: space-between;


            .post-title-text {
                color: var(--vp-c-text-1);
            }

            .post-title-text:hover {
                color: var(--vp-c-brand-1);
            }

            .post-date {
                font-size: 12px;
                margin: auto 0;
            }
        }
    }

    .abstract {
        font-size: 0.9375rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        color: var(--vp-c-text-2);
        line-height: 1.5rem;
    }

    .post-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin: 10px 0;

        .tag {
            padding: 0 8px;
            cursor: pointer;
            color: var(--vp-c-text-1);
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: all 0.3s ease-in-out;

            &:hover {
                color: var(--vp-c-brand-1);
                border: 1px solid var(--vp-c-brand-1);
            }
        }

        //相邻兄弟选择器(下一个元素)
        .tag+.tag {
            margin-left: 6px;
        }
    }


}

@media screen and (max-width: 768px) {
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .post-title {
            font-size: 1.0625rem;
            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            width: 17rem;
        }
    }


    .abstract {
        font-size: 0.9375rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin: 0.5rem 0 1rem;
    }
}
</style>
