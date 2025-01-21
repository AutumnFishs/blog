---
layout: page
title: 归档
sidebar: false
---
<div class="archives-main">
        <div class="list" v-for="year in yearList" :key="year">
            <div class="year" v-text="year"></div>
            <div class="post-list" v-for="(article, index2) in computedYearMap[year]" :key="index2">
                <a class="post-dot" v-text="article.title" :href="withBase(article.url)">
                </a>
                <div class="desc" v-text="article.date.string">
                </div>
            </div>
        </div>
    </div>
<script setup lang='ts'>
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { data } from '../.vitepress/theme/post.data';
const { yearMap, postMap } = data
const yearList = Object.keys(yearMap).sort((a, b) => b - a); // 按年份降序排序
const computedYearMap = computed(() => {
    let result = {}
    for (let key in yearMap) {
        result[key] = yearMap[key].map(url => postMap[url])
    }
    return result
})
</script>
    
<style lang="scss" scoped>
.archives-main {
    max-width: 1024px;
    width: 100%;
    padding: 32px 24px;
    margin: 0 auto;
    .list {
        padding: 12px 8px;
        font-size: 20px;
        line-height: 28px;
        .post-list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 24px;
            white-space: nowrap;
            a {
                overflow: hidden;
                text-overflow: ellipsis;
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

            .desc {
                padding-left: 16px;
                white-space: nowrap;
            }
        }
    }
}
</style>
