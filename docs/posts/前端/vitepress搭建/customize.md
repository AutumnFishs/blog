---
recommend: 2
---
# 创建组件

## 全局组件
docs/.vitepress/components/里创建vue文件
然后在docs/.vitepress/theme/index.ts里配置全局注册该组件,然后就可以在全局使用了
```ts
import MNavLinks from '../components/MNavLinks.vue'
import MNavLink from '../components/MNavLink.vue'

export default {
//...
  enhanceApp({ app, router, siteData }:EnhanceAppContext) {
    // ...
    app.component('MNavLinks', MNavLinks)
    app.component('MNavLink', MNavLink)
  }
} satisfies Theme
```
::: info ???
/docs/components 目录下的组件会自动注册为全局组件，可以在 Markdown 中直接使用。（但不知道为啥我创建了没生效）
:::