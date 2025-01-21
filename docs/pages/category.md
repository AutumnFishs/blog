---
layout: page
title: 分类
---

<div class="blog-category">
    <div class="category" v-for="item in sidebarList" :key="item.subTitle">
        <div class="title">{{ item.subTitle }}
        </div>
        <div class="list">
            <div class="item" v-for="subItem in item.subList" :key="subItem.url">
                <a :href="withBase(subItem.url)">{{ subItem.title }}</a> <span>{{ subItem.date.string }}</span>
            </div>
        </div>
    </div>
</div>

<script setup lang="ts">
import { withBase, useRouter } from 'vitepress'
import { data } from '../.vitepress/theme/post.data'
import { reactive, ref, watch } from 'vue'
const { sidebarMap } = data
const sidebarList = reactive(Object.keys(sidebarMap).map((key) => {
    return {
        subTitle: key,
        subList: sidebarMap[key].sort((a, b) => b.date.time - a.date.time),
        subFlag: false,
        subOrder: key === '其他' ? 100 : 0
    }
}).sort((a, b) => a.subOrder - b.subOrder))
</script>

<style scoped lang="scss">
.blog-category {
    width: 100%;
    max-width: 1140px;
    padding: 10px;
    margin: 0 auto;
    margin-bottom: 20px;

    .category {
        .title {
            font-size: 24px;
        }

        .list {
            .item {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

    .category+.category {
        margin-top: 20px;
    }
}
</style>