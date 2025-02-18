<template>
    <div class="grid-layout-container">
        <div class="grid-layout" :style="formData.style">
            <div class="grid-item" v-for="i in formData.card" :key="i" :style="formData.childrenStyle[i]">card</div>
        </div>
        <t-form class="grid-layout-materials" ref="form" :data="formData" label-width="100px"
            scroll-to-first-error="smooth">
            <t-form-item label="Card个数:" name="card">
                <t-input-number v-model="formData.card" :step="1" min="1" max="20" />
            </t-form-item>
            <t-form-item label="列设置:" name="style">
                <t-input v-model="formData.style['grid-template-columns']" placeholder="grid-template-columns" />
            </t-form-item>
            <t-form-item label="行设置:" name="style">
                <t-input v-model="formData.style['grid-template-rows']" placeholder="grid-template-rows" />
            </t-form-item>
            <t-form-item label="区块设置:" name="style">
                <t-textarea v-model="formData.style['grid-template-areas']" placeholder="grid-template-areas" />
            </t-form-item>
        </t-form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormProps } from 'tdesign-vue-next';
const props = defineProps({
    card: {
        type: Number,
        default: 6,
    },
    style: {
        type: Object,
        default: () => ( {
        display: 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
        "grid-template-areas": `"a a a" "b c c" "b c c"`,
    }),
    },
})  
function generateChildrenStyle(gridTemplateAreas) {
    // 将 grid-template-areas 字符串按行分割
    const rows = gridTemplateAreas.split('\n').map(row => row.trim()).filter(row => row);

    // 提取所有唯一的区域名称
    const areasSet = new Set();
    rows.forEach(row => {
        row.split(' ').forEach(area => {
            if (area && area !== '.') { // 忽略空区域（用 '.' 表示）
                areasSet.add(area.trim());
            }
        });
    });

    // 转换为 childrenStyle 数组
    const childrenStyle = Array.from(areasSet).map(area => ({
        "grid-area": area,
    }));

    return childrenStyle;
}
let formData: FormProps['data'] = ref({
    card: props.card,
    style: props.style,
    childrenStyle:[
    ]
});
watch(() => formData.value.style['grid-template-areas'], (newVal) => {
    formData.value.childrenStyle = generateChildrenStyle(newVal);
}, { immediate: true,deep: true })
</script>
<style lang="scss">
.grid-layout-container {
    width: 100%;
    aspect-ratio: 3 / 1;
    display: grid;
    grid-template-columns: 2fr 1fr;
    border: 1px solid #5a5555;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
    background: #eee;
    box-sizing: border-box;

    .grid-layout {
        padding: 10px;
        overflow-y: auto;
        width: 100%;
        .grid-item {
            border: 1px solid #5a5555;
            border-radius: 10px;
            padding: 10px;
            background: #fff;
        }
    }

    .grid-layout-materials {
        border-left: 5px solid #ccc;
        padding: 10px;
        background: #fff;
    }
}
</style>
