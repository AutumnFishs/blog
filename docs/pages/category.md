---
layout: page
title: 分类
---

<div class="blog-category">
    <h1>{{currentTag ||"分类列表"}}<span>{{ total }}</span></h1>
    <div class='category-tags' v-if='!currentTag'>
        <h2>分类：</h2>
        <div :class="currentTag === item.subTitle?'active':''" v-for="item in sidebarList" :key="item.subTitle"  @click="handleClick(item.subTitle)">
        <span>{{ item.subTitle }}</span><span class="total">{{ item.subList.length }}</span>
        </div>
    </div>
    <div class='tags-cloud' v-if='!currentTag'><h2>标签云：</h2> <BlogTags/></div>
    <div class="list">
        <div class="item" v-for="subItem in postList" :key="subItem.url">
            <a :href="withBase(subItem.url)">{{ subItem.title }}</a> <span>{{ subItem.date.string }}</span>
        </div>
    </div>
</div>

<script setup lang="ts">
import { withBase, useRouter } from 'vitepress'
import { data } from '../.vitepress/theme/post.data'
import { reactive, ref, watch,computed,unref  } from 'vue'
const { sidebarMap,tagMap,postMap } = data
const sidebarList = reactive(Object.keys(sidebarMap).map((key) => {
    return {
        subTitle: key,
        subList: sidebarMap[key].sort((a, b) => b.date.time - a.date.time),
        subFlag: false,
        subOrder: key === '其他' ? 100 : 0
    }
}).sort((a, b) => a.subOrder - b.subOrder))
const total = computed(()=>Object.values(postMap).length)
const router = useRouter()
const handleClick = (title) =>{
    router.go(`${router.route.path}?tag=${title}`)
}
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
const currentTag = computed(()=>getQueryParam("tag"))
const computedTagMap = computed(() => {
    let result = {}
    for (let key in tagMap) {
        result[key] = tagMap[key].map(url => postMap[url])
    }
    return result
})
const postList = computed(() => (unref(computedTagMap)[unref(currentTag)]))
</script>

<style scoped lang="scss">
.blog-category {
    width: 100%;
    max-width: 1140px;
    padding: 10px;
    margin: 0 auto;
    margin-bottom: 20px;
    h1{
        width:100%;
        height:120px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:28px;
        span{
            position:relative;
            top:-10px;
            right:-10px;
            font-size:12px;
        }
    }
    .category-tags{
        display: flex;
        align-items: center;
        h2{
            margin-right:20px;
        }
        >div{
            .total{
                position:relative;
                top:-5px;
                right:-5px;
                font-size:10px;
            }
        }
        div+div{
            margin-left:40px;
        }
        div.active{
            color: var(--td-brand-color);
        }
        div:hover{
             color: var(--td-brand-color);
        }
    }
    .tags-cloud {
        margin-top:50px;
    }
    .list{
        .item{
            display:flex;
            align-items:center;
            justify-content: space-between;
        }
        .item + .item{
            margin-top:20px;
        }
    }
}
</style>