---
title: VueRouter学习笔记
date: 2025-01-15
tags: ['Vue']
abstract: VueRouter是vue官方团队支持的路由插件，同时支持Vue2，Vue3实现路由切换页面
---
# VueRouter学习笔记


## 引入插件做了哪些事
1. 触发路由解析器解析初始路由
2. 全局添加组件`router-view`，`router-link`
3. 添加实例对象`$router`(整个路由信息以及一些api)、`$route`(当前路由信息)
4. 添加API `useRouter` (相当于 `$router`)、`useRoute` (相当于 `$route`)

## 快速上手
1. 安装
    ``` sh
        # v3
        npm install vue-router@4
        # v2
        npm install vue-router@3
    ```
2. 创建路由
    ``` js
    // router/index.js
    import { createRouter, createWebHistory } from 'vue-router'
    import Home from '@/views/Home.vue'

    const routes = [
        {
            path: '/',
            name: 'Home',
            component: Home,
            // 元信息
            meta: { requiresAuth: true },
            children:[
                {path:'test',name:'test',component:Test}
            ]
        },
    ]

    const router = createRouter({
        history: createWebHistory(),
        routes
    })

    export default router
    ```

3. 引入路由
    ``` js
    // main.js
    import router from '@/router'
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
    ```
4. 组件中使用
   ```html
   <!-- App.vue -->
   <template>
    <!-- 跳转页面 -->
    <router-link></router-link>
    <!-- 路由页面视图 -->
    <router-view/>
   </template>
   ```
## 基础语法
### 动态路由匹配
```js
const routes = [
  // 动态字段以冒号开始
  { path: '/detail/:id', component: Detail },// route.params 读取 { username: 'eduardo' }
]
```
### 匹配不到页面
```js
const routes = [
  // 将匹配所有内容并将其放在 `route.params.pathMatch` 下,一般放在最后一个路由
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
```
### 路由重定向
```js
const routes = [{ path: '/home', redirect: '/' }]
```
### 配置别名
```js
const routes = [{ path: '/',alias: '/home' }]
```
### 路由组件传参
```js
const routes = [{ path: '/user/:id', component: User, props: true }]//可以直接将pramas参数传递到组件props中
```
### 导航
1. 声明式导航：`<router-link :to="...">	`
2. 编程式导航：
    ``` js
        // 新增历史记录
        router.push('/home')

        // params传参 
        router.push({ name: 'home', params: { title: 'params传参' } })

        // query传参 /test?plan=private
        router.push({ path: '/test', query: { plan: 'private' } })

        // hash传参 /about#team
        router.push({ path: '/about', hash: '#team' })

        // 替换历史记录
        router.replace({ path: '/home' })

        //前移
        router.go(1)

        //返回
        router.go(-1)
    ```
    ::: info 备注
    以上三种就是模仿web API`history.pushState`、`history.replaceState` 和 `history.go`实现的
    :::

## 模式
vue-router中有三种模式：
1. createWebHashHistory 哈希模式
2. createWebHistory history模式(html5模式)
3. createMemoryHistory memory模式 适合 Node 环境和 SSR

## 路由守卫
### 全局路由前置守卫
``` js
// to 即将要去的路由信息
// from 当前的路由信息
// next可选 下一步
// 可以做用户权限校验、动态路由
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```
### 全局路由解析守卫
```js
router.beforeResolve(async to => {
 // 类似router.beforeResolve 
})
```
### 全局路由后置守卫
```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```
### 路由独享守卫
``` js
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
  },
]
```
### 组件内路由守卫
``` html
<script>
    export default {
    beforeRouteEnter(to, from) {//组件调用前，没有this
    },
    beforeRouteUpdate(to, from) {// 组件复用时（路由发生变化，但是当前组件再次被使用的时候触发）
    },
    beforeRouteLeave(to, from) {// 离开当前组件前触发，比如一个配置页面可以在离开前提醒是否保存配置，是跳转，不是取消跳转
    },
    }
</script>
```
## 路由插槽
```html
<router-view></router-view>
<!-- 等价于 -->
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```
### 结合组件缓存，组件过渡
``` html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```
## 滚动行为
使用前提：浏览器支持pushState
``` js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```

## 动态路由
记录两种实现思路：
1. 在登录时根据用户权限直接生成完整的路由表
    - 简单直接，首次加载时可能稍微慢点，
2. 在每次跳转页面时加载对应的页面路由，并在退出登录或者登录过期时统一移除
    - 逻辑相对复杂，不过每次跳转新页面加载内容较少，加载首页会快点
不管哪种实现方式都是依靠以下这几个API：
- addRoute() 添加单个路由
- removeRoute() 删除路由
- hasRoute() 查看当前路由是否存在
- getRoutes() 获取当前所有路由