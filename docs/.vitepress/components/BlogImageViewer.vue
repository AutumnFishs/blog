<template>
    <ImageViewer :key="previewImageInfo.url" v-model:visible="visible" :default-index="previewImageInfo.index"
        :images="previewImageInfo.list">
    </ImageViewer>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { ImageViewer } from 'tdesign-vue-next';
const visible = ref(false);
const previewImageInfo = reactive<{ url: string; list: string[]; index: number }>(
    {
        url: "",
        list: [],
        index: 0,
    }
);
function previewImage(e) {
    // 触发点击事件的元素
    const target = e.target;
    // 当前绑定点击事件的元素
    const currentTarget = e.currentTarget
    if (target.nodeName === 'IMG') {
        previewImageInfo.list = []
        // 获取容器内所有图片
        currentTarget.querySelectorAll('.VPDoc .container .content .content-container .main img').forEach(dom => {
            previewImageInfo.list.push(dom.src)
        });
        previewImageInfo.url = target.src;
        const findIndex = previewImageInfo.list.findIndex((item) => item === target.src)
        previewImageInfo.index = findIndex

        // 容器外图片
        if (findIndex === -1 && target.src) {
            previewImageInfo.list = [target.src]
        }
        visible.value = true
    }
}
onMounted(() => {
    if (typeof document !== "undefined") {
        const docDomContainer = document.querySelector("#VPContent");
        docDomContainer?.addEventListener("click", previewImage);
    }
});

onUnmounted(() => {
    if (typeof document !== "undefined") {
        const docDomContainer = document.querySelector("#VPContent");
        docDomContainer?.removeEventListener("click", previewImage);
    }
});
</script>
<style scoped>
.tdesign-demo-image-viewer__ui-image {
    width: 100%;
    height: 100%;
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border-radius: var(--td-radius-small);
    overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: var(--td-text-color-anti);
    line-height: 22px;
    transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
    opacity: 1;
    cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    position: absolute;
}

.tdesign-demo-image-viewer__ui-image--footer {
    padding: 0 16px;
    height: 56px;
    width: 100%;
    line-height: 56px;
    font-size: 16px;
    position: absolute;
    bottom: 0;
    color: var(--td-text-color-anti);
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
    flex: 1;
}

.tdesign-demo-popup__reference {
    margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
    cursor: pointer;
}

.tdesign-demo-image-viewer__base {
    width: 160px;
    height: 160px;
    margin: 10px;
    border: 4px solid var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
}
</style>