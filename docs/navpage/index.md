---
layout: doc
layoutClass: m-nav-layout
sidebar: false
lastUpdated: false
prev: false
next: false
editLink: false

hidden: true
---

<script setup>
import { data } from './data'
</script>
<style lang="scss">
.VPDoc{
/* 覆盖全局的 vp-layout-max-width（仅当前页面使用） */
--vp-layout-max-width: 1440px;

/* 修改 layout 最大宽度 */
.container {
    max-width: var(--vp-layout-max-width) !important;
}
.content-container,
.content {
    max-width: 100% !important;
}
}
</style>

# 网址导航

<MNavLinks v-for="{title, items} in data" :title="title" :items="items"/>
