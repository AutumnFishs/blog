<script setup lang="ts">
import { useData } from 'vitepress';
const { theme } = useData();
const { visitor } = theme.value;

</script>
<template>
    <img class="visitor" :src="`https://visitor-badge.laobi.icu/badge?page_id=${visitor.badgeId}`"
        alt="visitor badge" />
</template>
<style>
.visitor {
    height: 16px;
    margin-left: 8px
}
</style>