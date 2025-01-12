---
title: Vitepress主题配置
date: 2023-04-13 16:32:00
abstract: 使用过程中的一些vitepress的配置项，开始使用的时候多少有些不熟悉，配置习惯后，也就不需要了，主要还是强化记忆吧。
tags:
  - Vitepress
  - 主题配置
---
# 主题配置

## 默认主题配置
::: info 默认主题配置
默认主题配置在`docs/.vitepress/theme/index.js`中，具体配置如下：
```ts
import DefaultTheme from "vitepress/theme";
import { h, onMounted } from "vue";
import { useData, type EnhanceAppContext, type Theme } from "vitepress";
// 自定义组件
import MButton from "../components/MButton.vue";
// 主题配置
import "./styles/index.scss";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {};

    const { frontmatter } = useData();

    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(MyLayout, props, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 这里一般是自定义组件，通过插槽的方式插入到默认主题中
    });
  },
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    vitepressNprogress(ctx);
    app.component("MButton", MButton);

    useComponents(app, DemoPreview);
  },
  setup() {
    onMounted(() => {
      mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" }); // 默认
      // mediumZoom("#app img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    });
  },
} satisfies Theme;

```
:::


## 侧边栏简单配置

侧边栏基本机构，在`docs/.vuepress/config.js`中配置，具体配置如下：

### 数组形式
```js
export default {
  themeConfig: {
    sidebar: [
      {
        text: '侧边栏标题',
        collapsed: false,
        items: [
          { text: '小标题', link: '/路径' },
          ...
        ]
      }
      ...
    ]
  }
}
```
### 对象形式（多个侧边栏）

假如你的文件夹结构如下：
```
.
├─ guide/
│  ├─ index.md
│  ├─ one.md
│  └─ two.md
└─ config/
   ├─ index.md
   ├─ three.md
   └─ four.md
```
就可以写多个侧边栏，具体配置如下：
```js
export default {
  themeConfig: {
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Index', link: '/guide/' },
            { text: 'One', link: '/guide/one' },
            { text: 'Two', link: '/guide/two' }
          ]
        }
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/config/': [
        {
          text: 'Config',
          items: [
            { text: 'Index', link: '/config/' },
            { text: 'Three', link: '/config/three' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ]
    }
  }
}
```
### 自定义配置
下面是侧边的hooks`useSidebar`,可以在layout.vue中自定义修改侧边栏
```js
export interface DocSidebar {
  isOpen: Ref<boolean>
  sidebar: ComputedRef<DefaultTheme.SidebarItem[]>
  sidebarGroups: ComputedRef<DefaultTheme.SidebarItem[]>
  hasSidebar: ComputedRef<boolean>
  hasAside: ComputedRef<boolean>
  leftAside: ComputedRef<boolean>
  isSidebarEnabled: ComputedRef<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}
```
使用示例：
```js
<script setup>
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()
</script>

<template>
  <div v-if="hasSidebar">Only show when sidebar exists</div>
</template>
```
### 结尾
::: info 笔记
sidebar配置分两种：
1. 数组：当菜单只有一个的时候可以使用数组的形式

2. 对象：当菜单有多个的时候可以使用对象的形式，比如导航栏分类有多个，可以每个导航页面单独配置侧边栏

3. 也可以自定义配置主题

collapsed：是否展开,默认是展开,配置为true收起，但是如果是当前页面所在的那个目录它默认也是展开的，
:::