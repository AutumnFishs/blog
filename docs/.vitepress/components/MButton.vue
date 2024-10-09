<template>
    <button class="btn">按钮</button>
</template>

<script setup lang="ts">
</script>

<style lang='scss' scoped>
.btn {
    background-color: #409eff;
    color: #fff;
    border: none;
    padding: 5px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #66b1ff;
    }
}
</style>
