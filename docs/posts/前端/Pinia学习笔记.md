---
title: Pinia学习笔记
date: 2025-01-15
tags: ['Vue']
abstract: Pinia是Vue的官方状态管理库，用于管理Vue项目中的状态。主要配合vue3使用，同时支持使用组合式api的写法和选项式写法，vue2也可以使用，但是需要安装@vue/composition-api插件。
---
# Pinia学习笔记

## 快速开始
::: info 安装使用
1. 安装
``` sh
npm install pinia
```
2. 引入
``` js 
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```
:::

## 基本概念
在 pinia 中没有根仓库，每一个都可以理解是一个模块，所以也不需要像在vuex中那样将模块引入根模块中；pinia支持两种写法，选项式和组合式。

### 选项式
1. state 相当于 data
2. getter 相当于 computed
3. action 相当于 methods，不同于vuex，它同时支持同步异步
4. defineStore创建仓库；第一个参数是仓库的唯一id，可以理解为vuex的命名空间，第二个参数是一个对象，包含state、getters、actions。
``` js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

### 组合式
1. state 使用 ref 创建
2. getter 使用 computed 创建
3. action 直接使用 function 函数
4. 最后 return 抛出即可
```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

## 组件中使用仓库
1. 组件使用setup语法糖时
```html
<script setup>
import { useCounterStore } from '@/stores/counter'

import { storeToRefs } from 'pinia';
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
// 如果需要解构必须使用pinia提供的工具，否则不具有响应式
const { name, doubleCount } = storeToRefs(store)
// 方法可以直接解构出来
const { increment } = store
</script>
```
2. 组件使用setup函数时
```html
<script>
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()
    const { name, doubleCount } = storeToRefs(store)
    const { increment } = store
    return { name, doubleCount, increment }
  },
  methods:{
    test(){
        console.log(this.name)
        console.log(this.doubleCount)
        this.increment()
    }
  }
}
</script>
``` 
1. 组件依旧使用v2写法时
```html
<script>
import { useCounterStore } from '@/stores/counter'

export default {
  computed:{
    // 读取仓库里的count
    ...mapState(useCounterStore, ['count','doubleCount']),
    // 可修改的state
    ...mapWritableState(useCounterStore, ['count'])
    // aciton
    ...mapActions(useCounterStore, ['increment'])
  },
  methods:{
    test(){
        console.log(this.count)
        this.increment()
    }
  }
}
</script>
```


## 持久化方案
1. 可以使用内置的$subscribe
   ```js
    // 使用Pinia插件机制来实现状态的持久化
    pinia.use(({ store }) => {
        // 创建一个基于store ID的状态存储键名，用于localStorage中的键值对存储
        const storageKey = `pinia-${store.$id}`;
        
        // 从localStorage中获取之前保存的状态值
        const storageValue = localStorage.getItem(storageKey);
        
        // 如果localStorage中有该store的保存状态，则恢复状态
        if (storageValue) {
            // 使用$patch方法根据保存的状态更新store。JSON.parse将字符串转换回对象
            store.$patch(JSON.parse(storageValue)); // 表示使用从localStorage读取并解析后的状态数据更新store
        }

        // 订阅store的变化，每当state发生改变时自动保存到localStorage
        store.$subscribe(
            (mutation, state) => {
                // mutation包含了触发变化的信息，state是当前store的状态
                // 将当前状态通过JSON.stringify转换为字符串后保存到localStorage
                localStorage.setItem(storageKey, JSON.stringify(state)); // 表示将状态序列化为JSON字符串后保存到localStorage
            },
            { detached: true } // 表示这个订阅是独立的，即使store被销毁，订阅仍然存在
        );
    });
   ```
2. 使用第三方插件`pinia-plugin-persistedstate`
    - 首先在pinia中引入插件
        ``` js
        import { createPinia } from 'pinia'
        import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

        const pinia = createPinia()
        pinia.use(piniaPluginPersistedstate)
        ```
    - 引入插件后definStore可以在第三个配置项中配置如何持久化
        ```js
        export const useStore = defineStore('store', {
        state: () => ({
            someState: 'hello pinia',
        }),
        //persist: true,//表示全部持久化
        persist：{
            key: 'piniaStore', //存储名称
            storage: sessionStorage, // 存储方式
            paths: ['someState'], //指定 state 中需要被持久化的数据。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
        }
        })
        ```