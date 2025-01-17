<template>
    <div class="blog-sidebar" v-if="isShow">
        <div class="blog-sidebar-bullet-point">
            <BulletpointIcon class="bullet-point-icon" @click="toggle" />
        </div>
        <div class="blog-sidebar-content" v-show="open">
            <div class="blog-sidebar-content-item" v-for="item in sidebarList" :key="item.subTitle">
                <div class="sub-title" @click="handleIsFlag(item.subTitle)">{{ item.subTitle }}
                    <ChevronRightSIcon :class="`sub-title-icon ${item.subFlag ? 'is-open' : ''}`" />
                </div>
                <div class="sub-item-list" v-show="item.subFlag">
                    <div class="item" v-for="subItem in item.subList" :key="subItem.url">
                        <a :class="`item-link ${withBase(subItem.url) === decodeURIComponent(route.path) ? 'is-active' : ''}`"
                            :href="withBase(subItem.url)">{{ subItem.title }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BulletpointIcon, ChevronRightSIcon } from 'tdesign-icons-vue-next'
import { withBase, useRouter } from 'vitepress'
import { data } from '../theme/post.data'
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
const { route } = useRouter()

// 控制侧边栏显隐
const isShow = ref(true)
watch(() => route.path, (newPath) => {
    if (newPath.includes('pages')) {
        isShow.value = false
    } else {
        isShow.value = true
    }
}, { immediate: true })

// 侧边栏列表
const open = ref(true)
const toggle = () => {
    open.value = !open.value
}

// 判断是否展开
const handleIsFlag = (subTitle: string) => {
    const item = sidebarList.find((item) => item.subTitle === subTitle)
    if (item) {
        item.subFlag = !item.subFlag
    }
}
</script>

<style scoped lang="scss">
@media (max-width:1600px) {
    .blog-sidebar {
        display: none;
    }
}


.blog-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 220px;
    height: calc(100vh - 64px);
    padding: 20px 10px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
    color: var(--vp-c-text-1);

    .blog-sidebar-content::-webkit-scrollbar {
        width: 3px;
    }

    .blog-sidebar-content {
        margin-top: 20px;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;

        .blog-sidebar-content-item {
            margin: 8px 0;

            .sub-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
                margin: 5px 0;
                border-top: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;
                cursor: pointer;

                .sub-title-icon.is-open {
                    transform: rotate(90deg);
                }

                .sub-title-icon {
                    transition: all 0.3s;
                    transform: rotate(0deg);
                }
            }

            .sub-title+.sub-title {
                margin-top: 20px;
            }

            .sub-item-list {
                .item {
                    margin: 5px 0;
                    word-break: keep-all;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                }

                .is-active {
                    color: var(--vp-c-brand);
                    cursor: pointer;
                }

                .item-link:hover {
                    color: var(--vp-c-brand);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>