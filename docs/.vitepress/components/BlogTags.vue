<template>
    <div class="blog-tags">
        <div class="tags">
            <div v-for="(tag, i) in tags" :key="i" class="tag" @click="onTagClick(tag)">
                <span>{{ tag }}</span>
                <span class="tag-count"> {{ computedTagMap[tag].length }} </span>篇
            </div>
        </div>
        <p v-text="currentTag" class="current-tag"></p>
        <ul>
            <li v-for="(article, index) in postList" :key="index" class="card">
                <a v-text="article.title" :href="withBase(article.url)" class="post-dot">
                </a>
                <div v-text="article.date.string" class="post-date">
                </div>
            </li>
        </ul>
    </div>

</template>

<script setup>
import { ref, unref, computed, onMounted } from 'vue'
import { data } from '../theme/post.data'
import { withBase } from 'vitepress'

const { tagMap, postMap } = data
const tags = Object.keys(tagMap)
const computedTagMap = computed(() => {
    let result = {}
    for (let key in tagMap) {
        result[key] = tagMap[key].map(url => postMap[url])
    }
    return result
})

const currentTag = ref()
function onTagClick(newTag) {
    currentTag.value = newTag
}
const postList = computed(() => (unref(computedTagMap)[unref(currentTag)]))
onMounted(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('tag')) currentTag.value = searchParams.get('tag')
})

</script>

<style scoped lang="scss">
.blog-tags {
    max-width: 1024px;
    width: 100%;
    padding: 24px 32px;
    margin: 0 auto;

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;

        .tag {
            padding: 4px 16px;
            background: var(--vp-c-bg-alt);
            color: var(--vp-c-text-1);
            cursor: pointer;

            &:hover {
                color: var(--vp-c-brand);
                display: block;
            }

            .tag-count {
                padding-left: 4px;
                color: var(--vp-c-brand);
            }
        }
    }

    .current-tag {
        font-size: 24px;
        line-height: 32px;
        padding: 16px 0;
    }

    .card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0px;

        .post-dot {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .post-date {
            padding-left: 4px;
            white-space: nowrap;
        }

        .post-dot::before {
            display: inline-block;
            content: '';
            margin-right: 10px;
            width: 4px;
            height: 4px;
            line-height: 18px;
            border-radius: 50%;
            background-color: var(--vp-c-brand-1);
            vertical-align: middle;
        }

    }

}
</style>