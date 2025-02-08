---
title: Vue依赖
hidden: true
abstract: 记录一些比较好用的项目依赖
date: 2025-02-06
tags: [Vue,依赖]
---
# Vue依赖

## 1. `v-hotkey3`：vue3的指令插件，用于将热键（快捷键）绑定到 Vue 组件上,示例如下：
```html
<template>
  <div>
    <!-- 显示或隐藏基于 `show` 变量的内容 -->
    <p v-if="show">Hello, this is a toggleable message!</p>
    
    <!-- 使用 `v-hotkey` 指令绑定快捷键 -->
    <div v-hotkey="{'ctrl+e': toggleMessage}"></div>
  </div>
</template>

<script>
import { ref } from 'vue';
// 引入 `v-hotkey` 指令
import vHotkey from 'v-hotkey3';

export default {
  directives: { hotkey: vHotkey }, // 注册自定义指令
  setup() {
    const show = ref(false); // 定义响应式变量

    // 定义切换消息的方法
    const toggleMessage = () => {
      show.value = !show.value;
    };

    return {
      show,
      toggleMessage
    };
  }
};
</script>
```
## 2. `portal-vue`:传送，将当前元素渲染到dom文档的任何位置，兼容v2/v3；在v3中可以直接使用teleport实现，teleport是v3内置的传送；示例如下：
``` html
<template>
  <div>
    <!-- 要传输的内容 -->
    <Portal to="destination">
      <p>这是一段通过 Portal 渲染的文字。</p>
    </Portal>

    <!-- 目标位置 -->
    <PortalTarget name="destination"></PortalTarget>
  </div>
</template>

<script>
export default {
  // 组件逻辑...
}
</script>

<!-- 在入口添加插件 -->
import PortalVue from 'portal-vue';
app.use(PortalVue);
```
v3内置的teleport，示例如下：
``` html
<Teleport to="#destination">
    <p>这是一段通过 Teleport 渲染的文字。</p>
</Teleport>
```
## 3. `vee-validate`：用于简化表单验证，示例如下：
``` html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" />
      <input v-model="password" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit, errors } = useForm();

    const onSubmit = handleSubmit((values) => {
      console.log(values);
    });

    return { onSubmit, errors };
  }
};
</script>
```
[vee-validate地址](https://vee-validate.logaretm.com/)
