---
title: Zustand学习笔记
date: 2024-10-09
abstract: Zustand一个 基于 Flux 模型实现的小型、快速和可扩展的状态管理解决方案，相比于redux的繁琐，操作更方便，并且整个库也非常小。当然，它不仅仅只支持React，也支持vue等...
tags: [Zustand,状态管理工具]
---
# Zustand一个轻量级的React状态管理工具
`Zustand`相比于`redux`，操作更方便，并且整个库也非常小。

中文官网：https://awesomedevin.github.io/zustand-vue/docs/introduce/what-is-zustand

### 使用步骤
1. 安装
::: info
```sh [npm]
npm i zustand
``` 

```sh [yarn]
yarn add zustand
```

```sh [pnpm]
pnpm add zustand
```
:::

2. store初始化
```js [react]
import {create} from 'zustand'

const useTestStore = create((set,get)=>{
    name:'',
    msg:"",
    age:0,
    setAge:()=>set((state)=>{
        {name:state.age+1}
    })
})
```

3. 在需要的组件中使用
```jsx [react]
function TestComp(){
    const name = useTestStore((state)=>state.name)
    const setAge = useTestStore((state)=>state.setAge)

    return <div>{name} 
        <button click={setAge}>点击</button>
    </div>
}
```
### 基础概念
#### 直接使用整个state，会导致只要有一个状态发生变化都会触发组件更新，比如：你页面上有多个组件都使用了这个store的状态，但是b组件更新了某个状态，而a、c组件你使用了整个state，就会导致a、c组件也一起更新
```js [react]
const state = useTestStore()
```
#### 使用多个状态的时候,通过传递 `shallow` 相等函数告诉 `zustand` 希望对象被浅拆分
```js [react]
import { shallow } from 'zustand/shallow'

// 当`state.name`或`state.age`发生变化后，组件重新渲染
const { name, age } = useTestStore(
  (state) => ({ name: state.name, age: state.age }),
  shallow
)
```

#### 更新状态
```js [react]
const useTestStore = create((set) => ({
  name: 'xxx',
  age: 1,
  setName: (newVal) => set(() => ({ name:newVal })),  // 这里会直接修改name，不会影响到其他状态
}))
```

#### 异步操作,只要拿到异步数据然后调用set去修改就可以
```js [react]
const useFishStore = create((set,get) => ({
    fishies: {},

    // 使用axios也一样
    fetch1: async (pond) => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
    },

    // 需要使用旧的数据可以直接使用回调里的state，也可以使用get获取
    fetch2: async (pond) => {
    const response = await fetch(pond)
    set((state)=>{
        console.log(state.fishies)
    })
    },

    // get().xxx获取旧值
    fetch3: async (pond) => {
    const response = await fetch(pond)
    set(()=>{
      console.log(get().fishies)
    })
    },
}))
```

#### 中间件
##### `persist`中间件
```tsx [react]
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
interface AtlasStore {
  ....
}

export const useAtlasStore = create<AtlasStore, [["zustand/persist", AtlasStore]]>(
  persist(
    (set) => ({
      atlasTabVal: "atlas",
      setAtlasTabVal: (val) => set({ atlasTabVal: val }),
    }),
    {
      name: "useAtlasStore-storage", // unique name
      storage: createJSONStorage(() => sessionStorage), // 默认情况下使用 localStorage
    }
  )
);
```
##### `immer`中间件,使用`immer`可以让我们直接修改`state`的状态
```js [react]
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useBeeStore = create(
immer((set) => ({
    bees: 0,
    addBees: (by) =>
    set((state) => {
        state.bees += by
    }),
}))
)
```
##### `redux`中间件，支持像写`redux`一样写`zustand`,虽然支持，但是如果要用这个不如直接使用`redux-toolkit`
```js [react]
import { redux } from 'zustand/middleware'
const types = { increase: 'INCREASE', decrease: 'DECREASE' }
const reducer = (state, { type, by = 1 }) => {
switch (type) {
    case types.increase:
    return { grumpiness: state.grumpiness + by }
    case types.decrease:
    return { grumpiness: state.grumpiness - by }
}
}
const initialState = {
grumpiness: 0,
dispatch: (args) => set((state) => reducer(state, args)),
}
const useReduxStore = create(redux(reducer, initialState))
```
##### devtools中间件,利用开发者工具`调试/追踪`Store
```js [react]
import { devtools, persist } from 'zustand/middleware'

const useFishStore = create(
    devtools(persist(
        (set, get) => ({
        fishes: 0,
        addAFish: () => set({ fishes: get().fishes + 1 }),
        }),
    ))
)
```

### 更高级的使用

#### 通过`immer`快速修改深度嵌套的状态
当一个数据嵌套的层级很深，修改就比较麻烦，比如下面:

- 数据嵌套
```js [react]
type State = {
  deep: {
    nested: {
      obj: { count: number },
      ...{} // more
    }
  }
}
```
- 修改数据
```js [react]
normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
    }
}))
``` 
- zustand 支持使用 immer 缩短嵌套深度对象的状态更新 

:::info 官方示例
```js [react]
import produce from 'immer'

const useStore = create((set) => ({
  deep: {
    nested: {
      obj: { count: 0 },
    }
  },
  immerInc: () =>
    set(
      produce((state: State) => {
        ++state.deep.nested.obj.count
      })
    ),
}))

const immerInc = useStore((state) => state.immerInc)
immerInc()
```
:::

#### `subscribeWithSelector`中间件 监听状态变化

可以监听某些状态发生变化，然后统一做些处理
::: info 官方示例
```js [react]
import { subscribeWithSelector } from 'zustand/middleware'
const useDogStore = create(
  subscribeWithSelector(() => ({ paw: true, snout: true, fur: true }))
)

// 仅限 `paw` 修改时，触发监听
const unsub2 = useDogStore.subscribe((state) => state.paw, console.log)
// subscribe 还可以监听到旧值
const unsub3 = useDogStore.subscribe(
  (state) => state.paw,
  (paw, previousPaw) => console.log(paw, previousPaw)
)
// subscribe 也支持自定义相等函数
const unsub4 = useDogStore.subscribe(
  (state) => [state.paw, state.fur],
  console.log,
  { equalityFn: shallow }
)
// 立即订阅并触发
const unsub5 = useDogStore.subscribe((state) => state.paw, console.log, {
  fireImmediately: true,
})
```
:::

#### 结合ref使用
有时候我们需要数据更新，但是不要触发页面的更新就可以使用这个`subscribe`监听状态变化，并且用ref存储它的值，还有就是使用`useEffect`初始化时开始执行，避免在外面写的时候每次组件更新都得重新创建监听
```js [react]
const useScratchStore = create(set => ({ scratches: 0, ... }))

const Component = () => {
  // 获取初始状态
  const scratchRef = useRef(useScratchStore.getState().scratches)
  // 挂载时连接到 store ，卸载时断开连接，捕获引用中的状态变化
  useEffect(() => useScratchStore.subscribe(
    state => (scratchRef.current = state.scratches)
  ), [])
  ...
}
```
