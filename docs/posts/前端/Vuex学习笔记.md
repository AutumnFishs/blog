---
title: Vuex学习笔记
date: 2025-01-15
tags: ['Vue']
abstract: vue项目中内置的组件通信方式有很多，但是除了推荐使用父子通信方式，其他的如依赖注入、事件总线等都是由一些弊端的，如果需要做工程化项目还是比较推荐使用市面上比较成熟的通信插件，vuex就是这样一种配套的通信工具，vuex可以简单的理解为是一个存放数据的状态仓库，哪个组件想要使用就到仓库取......
---
# Vuex学习笔记

## 安装使用
1.  安装vuex
``` sh
npm install vuex --save
```
2. 引入
``` js 
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default Vuex.Store({})


// main.js
import store from './store'

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
```
## 基本概念
1. State 相当于组件中的data
2. Getters 相当于组件中的computed
3. Mutations 相当于组件中的method，同步
4. Actions 相当于组件中的method，异步
5. Modules 实现模块
6. Plugins 插件：一般在这里添加logger、持久化插件
    ::: info 示例  
    store/index.js 根模块  
    ``` js
    import Vue from 'vue'
    import Vuex from 'vuex'
    import moduleA from './modules/moduleA'
    import moduleB from './modules/moduleB'

    Vue.use(Vuex)

    export default new Vuex.Store({
        state: {
            // 根级别的 state
            globalLoading: false,
            userInfo: null
        },
        mutations: {
            // 根级别的 mutations
            SET_GLOBAL_LOADING(state, payload) {
                state.globalLoading = payload
            },
            SET_USER_INFO(state, payload) {
                state.userInfo = payload
            }
        },
        actions: {
            // 根级别的 actions
            setGlobalLoading({ commit }, status) {
                // 模拟异步操作，比如延迟两秒
                setTimeout(() => {
                    commit('SET_GLOBAL_LOADING', status);
                }, 2000);
            },
            updateUserInfo({ commit }, userInfo) {
                commit('SET_USER_INFO', userInfo)
            }
        },
        getters: {
            // 根级别的 getters
            isGlobalLoading: state => state.globalLoading,
            getUserInfo: state => state.userInfo
        },
        modules: {
            moduleA,
            moduleB
        },
        plugins:[
            createPersistedState({
                key: 'vuex',
                paths: ["moduleA.count", "globalLoading", 'moduleB.loading']// 可以持久化存储根模块状态和子模块状态，不写默认全部
            })
        ]
    })

    ```
    a模块
    ``` js
    // moduleA
    const state = {
    count: 0,
    message: '这是模块A的消息'
    }

    const mutations = {
    INCREMENT(state) {
        state.count++
    },
    SET_MESSAGE(state, payload) {
        state.message = payload
    }
    }

    const actions = {
    incrementAsync({ commit }) {
        setTimeout(() => {
        commit('INCREMENT')
        }, 1000)
    },
    updateMessage({ commit }, message) {
        commit('SET_MESSAGE', message)
    }
    }

    const getters = {
    doubleCount: state => state.count * 2,
    getMessage: state => state.message
    }

    export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
    }
    ```
    在组件中使用
    ``` html
    <script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
    data() {
        return {
        }
    },
    computed: {
        // 根 store 映射
        ...mapState(['globalLoading', 'userInfo']),
        ...mapGetters(['isGlobalLoading', 'getUserInfo']),
        
        // moduleA 映射
        ...mapState('moduleA', {
        count: state => state.count,
        message: state => state.message
        }),
        ...mapGetters('moduleA', [
        'doubleCount'
        ])
    },
    methods: {
        // 根 store 映射
        ...mapMutations(['SET_GLOBAL_LOADING', 'SET_USER_INFO']),
        ...mapActions(['setGlobalLoading', 'updateUserInfo']),
        
        // moduleA 映射
        ...mapMutations('moduleA', [
        'INCREMENT',
        'SET_MESSAGE'
        ]),
        ...mapActions('moduleA', [
        'incrementAsync',
        'updateMessage'
        ])
    },
    created() {},
    mounted() {}
    }
    </script>
    ```
    :::



