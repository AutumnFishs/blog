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
# 网址导航

<MNavLinks v-for="{title, items} in data" :title="title" :items="items"/>
