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
        <div class="grid-css">
<pre><code>
.grid-layout { 
{{ Object.entries(formData.style).map(([key, value]) => `    ${key}: ${value};`).join('\n') }}
}
</code></pre>
<pre><code>
{{ formData.childrenStyle.map(style => `.grid-item { \n${Object.entries(style).map(([key, value]) => `    ${key}: ${value};`).join('\n')}\n}`).join('\n') }}
</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormProps } from 'tdesign-vue-next';
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
        border: '1px solid #5a5555',
        borderRadius: '10px',
        padding: '10px',
        background: '#fff',
    }));

    return childrenStyle;
}
let formData: FormProps['data'] = ref({
    card: 6,
    style: {
        display: 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
        "grid-template-areas": `"a a a" "b c c" "b c c"`,
        padding: '10px',
        overflow: 'auto',
        width: '100%',
    },
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
    // 宽高比
    aspect-ratio: 2 / 1;
    display: grid;
    grid-template-areas:"grid-layout grid-layout grid-layout-materials" "grid-css grid-css grid-css";
    grid-template-rows: 2fr 1fr;
    border: 1px solid #5a5555;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
    background: #eee;
    box-sizing: border-box;
    .grid-css{
        grid-area: grid-css;
        border-top: 5px solid #ccc;
        overflow-y: auto;
        padding: 10px;
    }
    .grid-layout{
        grid-area: grid-layout;
    }
    .grid-layout-materials {
        grid-area: grid-layout-materials;
        border-left: 5px solid #ccc;
        padding: 10px;
        background: #fff;
        overflow-y: auto;
    }
}
</style>
