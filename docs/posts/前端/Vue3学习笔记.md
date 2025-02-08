---
title: Vue学习笔记
date: 2024-10-09
abstract: 
  - vue3初期学习过程可以使用setup函数，作为过渡它依旧提供了vue2的选项式写法，比如`data`、`methods`、生命周期等，但是vue3更推荐使用setup语法糖加上组合式API，这样代码更简洁，可读性更高，并且更符合函数式编程思想。
  - 组合式api可以实现像react hooks一样的功能，并且vue提供的api更加的细致，在满足日常开发的需要的同时，也提供了更多的组合性。
tags: [Vue]
---

# Vue3学习笔记
vue3初期学习过程可以使用setup函数，作为过渡它依旧提供了vue2的选项式写法，比如`data`、`methods`、生命周期等，但是vue3更推荐使用setup语法糖加上组合式API，这样代码更简洁，可读性更高，并且更符合函数式编程思想。
组合式api可以实现像react hooks一样的功能，并且vue提供的api更加的细致，在满足日常开发的需要的同时，也提供了更多的组合性。

## 快速上手（只记录了v3新特性，其他的和v2一样）

### 生命周期
vue3的生命周期和vue2基本一样，需要注意是v3销毁期的名字换为了unmounted 和 beforeunmount；以下是v3生命周期钩子
1. `onBeforeCreate`：创建实例之前调用
2. `onCreated`：实例创建完成调用
3. `onBeforeMount`：实例挂载前调用
4. `onMounted`：实例挂载完成调用，这时可以操作dom了
5. `onBeforeUpdate`：更新视图前调用
6. `onUpdated`：更新完成调用
7. `onBeforeUnmount`：销毁实例前调用，可以清除定时器、事件等
8. `onUnmounted`：销毁实例完成调用
9. `onErrorCaptured`：子孙组件发生错误调用
11. `onActivated`：keep-alive的生命周期，激活缓存的组件时调用，可以做挂载前的一些操作
12. `onDeactivated`：keep-alive的生命周期，组件失活时调用，可以做一些销毁前的操作
13. `onServerPrefetch`：服务端渲染之前调用

### 基本语法（对标选项式的一些组合式API）
1. data 
   - `ref`(任意类型数据) 调用时需要.value，还可以用来获取dom元素，v3.5后推荐使用`useTempleRef`取获取元素配置子组件`defineExpose`()暴露方法或者状态给父组件，这一点类似于react中的`useImperativeHandle`
   - `reactive`(对象)
   - `shallowRef`(任意类型数据) 调用时需要.value，不同的是，只有第一层数据是响应式的，不会递归到深层次的响应式
2. methods：直接在script标签内写函数方法即可
3. computed：计算属性值会基于其响应式依赖被缓存
   - computed(()=>{ return xxx})
4. watch
   - watch()
   ::: info 示例
   ``` js
   const a = ref('')
   watch(a,async (newVal,oldVal)=>{
    if(newVal === 'xxx') return
    const xxx = await axios()
    onWatcherCleanup(() => {
      //清理逻辑
    })
   })

   // 监听多个数据
   watch([a,()=>b.value],([newa,newb],[olda,oldb])=>{
    // flush: 'post' 确保可以获取更新后的dom
    // flush: 'sync' 响应式数据更新前触发
   }, { deep: true,immediate: true，flush: 'post'  })
   ```
   :::    
   - watchEffect()
   ::: info 示例
   ``` js
    const unwatch = watchEffect(()=>{
    // 依赖的值发生变化，就会重新执行这个函数
    // 不需要手动传入依赖，会自动收集依赖
    // 并且本身就是深度监听，且开始就会执行相当于默认{ deep: true,immediate: true  }
     onCleanup(() => {
    // 清理逻辑
    })
   }，{flush: 'post'}) 
   //等价于 watchPostEffect(()=>{})
   // 当值为sync的时候也有一个等价的监听器 watchSyncEffect()

   unwatch() //停止监听回调
   ```
   ::: 
5. filters：v3弃用
6. minxins：v3不再推荐使用，并且也不需要了，可以直接写组合式api，封装类似react hook 的方式
7. props：
   - 宏 definProps({})
8. 指令使用：指令：事件.修饰符=方法
   - v-module除了双向绑定，v3还可以实现父子通信
   ::: info 示例
   ``` html
    <!-- Parent.vue -->
    <Child v-model="countModel" />
    <!-- 等价于 -->
    <Child
      :modelValue="countModel"
      @update:modelValue="$event => (countModel = $event)"
    />

    <!-- 3.4版本以后的写法 -->
    <!-- Child.vue -->
    <script setup>
    const model = defineModel()

    function update() {
      model.value++
    }
    </script>

    <template>
      <div>Parent bound v-model is: {{ model }}</div>
      <button @click="update">Increment</button>
    </template>

    <!-- 3.4之前的写法 -->
    <!-- Child.vue -->
    <script setup>
    const props = defineProps(['modelValue'])
    const emit = defineEmits(['update:modelValue'])
    </script>

    <template>
      <input
        :value="props.modelValue"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </template>

    <MyComponent v-model:title="bookTitle" />
    <!-- MyComponent.vue -->
    <script setup>
      // required表示当前项必填，default表示默认值（需要注意的是默认值必须保持和父组件里面同步）
    const title = defineModel('title'，{required:true,default:0})
    </script>

    <template>
      <input type="text" v-model="title" />
    </template>
    
   ```
   :::
8. 依赖注入
   ::: info 示例
   ``` js
    const location = ref('North Pole')

    function updateLocation() {
      location.value = 'South Pole'
    }

    provide('location', {
      location,
      updateLocation
    })

    // 在需要的后代组件中
    const { location, updateLocation } = inject('location')
   ```
   :::

9. 异步组件 ：defineAsyncComponent，类型于react中Suspense + lazy实现的懒加载效果，只在需要时加载该组件
    ::: info 示例
    ```js
    import { defineAsyncComponent } from 'vue'

    const AsyncComp = defineAsyncComponent(() =>
      import('./components/MyComponent.vue')
    )

    //高级配置
    const AsyncComp = defineAsyncComponent({
      // 加载函数
      loader: () => import('./Foo.vue'),

      // 加载异步组件时使用的组件
      loadingComponent: LoadingComponent,
      // 展示加载组件前的延迟时间，默认为 200ms
      delay: 200,

      // 加载失败后展示的组件
      errorComponent: ErrorComponent,
      // 如果提供了一个 timeout 时间限制，并超时了
      // 也会显示这里配置的报错组件，默认值是：Infinity
      timeout: 3000
    })
    ```
    :::

### 内置组件
1. Teleport是v3新增的组件，像一个传送门，可以将当前的dom传递到指定html的指定位置，比如一个全局弹框，直接传送到body标签、或者写一个右键菜单栏啥的
2. suspense实验性功能...

### 组件通信
- 依赖注入：provide,inject
- 父子通信：props,emit ，v3除了像以前一样使用这个，还可以通过v-model实现
- 使用插件pinia

## 关于 Vue3 的一些 API

### 应用实例 API

1. `createApp(rootComponent, rootProps)` 用来创建应用实例，它的第一个参数是根组件，第二个参数是传递给根组件的属性(可选)。

```js
// 方式一:
const app = createApp(App, { msg: 'hello world' })

// 方式二:
const app = createApp({...})
```

2. `createSSRApp()`用来创建服务端渲染应用实例，用法和`createApp()`一样。（暂时没用过）

3. `app.mount()`用来将 app 组件挂载到 DOM 节点上，返回值是根组件实例，它的参数可以是 css 选择器或者 DOM 节点。

```js
import { createApp } from "vue";
const app = createApp(/*  */);

//挂载
app.mount("#app");

app.mount(document.getElementById("app"));
```

4. `app.unmount`用来卸载应用实例，一般不会用到（暂时没用过）。

5. `app.onUmount()` 用来注册卸载钩子函数，应用卸载时会调用这个函数。它接收一个回调函数作为参数。（3.5+）

```js
app.onUnmounted(() => {
  console.log("app unmounted");
});
```

6. `app.component()`用来注册全局组件，第一个参数是组件的名字，第二个参数是组件的定义。

```js
import MyComponent from './MyComponent.vue'
...

app.component('my-component',MyComponent)
```

7. `app.directive()`用来注册全局指令，第一个参数是指令的名字，第二个参数是指令的定义。一般需要操作 dom 的时候才会使用自定义指令。

```js
// 使 v-focus 在所有组件中都可用
app.directive("focus", {
  /* ... */
});
```

指令的第二个参数：生命周期钩子函数，都是可选的

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {},
};
```

一般时候指令最长使用的是 mounted 和 updated，当只使用这两个钩子的时候可以简化为：

```js
app.directive("focus", (el, binding) => {
  // 当绑定元素插入到 DOM 中，在mounted和updated时调用
  el.focus();
});
```

8. `app.use(plugin,...options)`用来安装一个插件，第一个参数是插件，第二个参数是插件的配置项（可选）。
   自定义一个插件，一般可以通过`app.component()`和`app.directive()`来注册全局组件和指令，通过`app.provide()`使一个资源可被注入到整个引用中；向`app.config.globalProperties`中添加一些全局实例属性或方法. 例如 vue-router

::: info 自定义一个插件

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide("i18n", options);
  },
};
```

:::

::: info 使用插件

```js
app.use(i18n, {
  greetings: {
    hello: 'hello world'
  }
})

<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

:::

9. `app.mixin()`,注册全局混入，影响注册之后所有组件的行为。一般不推荐使用，主要是为了向后兼容，v3 推荐使用组合式函数。

10. `app.provide()`依赖注入，用来提供可注入的资源，第一个参数是资源的 key，第二个参数是资源的值。使用：

```js
app.provide("key", value);

//需要使用的组件中
import { inject } from "vue";
const key = inject("key");
```

11. `app.runWithContext()`可以用来确保在应用上下文中运行一个函数,接收一个函数并立即运行，一般不推荐使用。(3.3+)

```js
export default {
  setup() {
    const data = ref([]);
    const dataLoaded = ref(false);

    const fetchData = async () => {
      // 模拟网络请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 使用 runWithContext 确保在正确的上下文中更新状态
      runWithContext(() => {
        data.value = ["Item 1", "Item 2", "Item 3"];
        dataLoaded.value = true;
      });
    };

    onMounted(fetchData);

    return {
      data,
      dataLoaded,
    };
  },
};
```

12. `app.version`用来获取 vue 的版本号，一般是在开发插件的时候使用的，用来判断当前 vue 版本是否支持插件。

13. `app.config`可以用来获取和设置全局配置，可以在挂载应用之前修改配置项

    - `app.config.errorHandler` 全局错误处理器，用来捕获组件渲染和生命周期钩子中的错误,在这个回调里做相应的处理

    ```js
    app.config.errorHandler = (err, instance, info) => {
      // 处理错误
    };
    ```

    - `app.config.warnHandler` 全局警告处理器，用来捕获组件渲染和生命周期钩子中的警告

    ```js
    app.config.warnHandler = (msg, instance, trace) => {
      // 这里的`trace`是组件层级结构的追踪
    };
    ```

    - `app.config.compilerOptions` 用来扩展 vue 编译器的功能的，一般情况下用不到。
    - `app.config.globalProperties` 它是一个对象，用来添加全局属性或方法，可以在组件中通过`this`访问，相当于 v2 的 vue.prototype,使用时当组件的属性和全局属性冲突时，组件的属性优先级更高。
    - `app.config.optionMergeStrategies`可以用来自定义选项合并策略，比如项目使用 mixin 混入的时候，会进行合并，这时候可以通过这个进行修改合并策略，一般使用 vue 默认的合并策略。
    - `app.config.idPrefix` 用来配置 `useId()`生成的 id 的前缀，比如：(3.5+)

    ```js
    app.config.idPrefix = "xxx";

    const id = useId(); // 'xxx:0'
    ```

    - `app.config.throwUnhandledErrorInProduction`用来强制在生产模式下抛出未处理的错误，默认是 false
      - 一般在开发模式下，错误抛出会直接导致应用崩溃，以便及时注意到错误并进行修复
      - 生产模式下只会记录到控制台，尽量减少对用户体验的影响

### 全局常规 API

1. `version`获取当前的 vue 版本号

```js
import { version } from "vue";
console.log(version);
```

2. `nextTick()`用来在下次 dom 更新后执行，获取最新的 dom 状态，可以直接在回调函数里做更新后的处理，或者直接使用`async await`等待 nextTick 执行完成。

```js
import { nextTick } from 'vue'

nextTick(() => {
  // DOM 更新了
})

// 或者使用async await
async function xxx(){
    ....
    await nextTick()
    ....
}
```

3. `defineComponent()`用来定义一个组件，选项式组件写法

```js
export default defineComponent({
    setup(){
        ...
    }
})
```

4. `defineAsyncComponent()` 异步组件，平时在使用路由实现按需加载的时候会直接使用 import 实现，如下：

```js
component: () => import('./Foo.vue')；
```

使用`defineAsyncComponent`可以做更细化的操作,比如加载时的组件，加载错误后的组件，加载延时，超时设置

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000，
  ...
})
```

异步组件还可以搭配 suspense 组件一起使用

### 组合式 API

1. `setup()`函数，是组合式 API 的入口函数，在组件实例创建之前执行，接收两个参数 props，context，props 是父组件传递过来的属性，context 是上下文对象，包含四个属性：attrs，slots，emit，expose

```js
export default {
  setup(props, context) {
    context.attrs; // 等同于this.$attrs
    context.slots; // 等同于this.$slots
    context.emit; // 等同于this.$emit
    context.expose; // 用来暴露公共属性（函数）
    expose({
      // 暴露的属性或方法 和 react的 useImperativeHandle 暴露句柄有点像，可以代替return 返回的属性
    });
    return {};
  },
};
```

2. `ref()` 用来创建一个响应式的数据，可以通过`.value`来访问和修改数据，一般用来定义基本类型的数据，
   复杂的数据结构可以使用`reactive()`来定义,`ref()`和`reactive()`的区别在于`ref()`定义的数据需要通过`.value`来访问和修改，而`reactive()`定义的数据可以直接访问和修改。

3. `computed()` 用来创建一个计算属性，当依赖项发生变化时，computed 会重新计算，返回一个新的值，一般用来定义需要经过计算才能得到的数据。

```js
const count = ref(0);
// 一个只读的计算属性
const doubleCount = computed(() => count.value * 2);

// 一个可读可写的计算属性
const doubleCount = computed({
  get: () => count.value * 2,
  set: (val) => {
    if (val) {
      count.value = val * 2;
    }
  },
});
```

4. `readonly()`用来创建一个只读的副本，不可修改，但是当原始数据发生变化时，副本也会跟着变化，一般用来定义一个共享数据，但是不希望被修改的

```js
const xxx = reactive(0);
// copyXxx是xxx的只读副本，不可修改 ，但是当xxx发生变化时，copyXxx也会跟着变化
const copyXxx = readonly(xxx);
```

5. `watchEffect((onCleanup)=>{},options)` 用来监听数据的变化，当依赖项发生变化的时候，会自动执行回调函数，onCleanup 是可选的，用来清除上次一次的副作用（比如，上一次的异步请求还未执行完，就可以直接清除掉），options 是可选的，用来配置 watchEffect 的行为，比如立即执行，深度监听等,stop 是停止监听

```js
const stop = watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value);
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前
  // 未完成的请求
  onCleanup(cancel);
  data.value = await response;
});

stop(); // 停止监听
```

3.5 版本以后用`onWatcherCleanup`代替`onCleanup`，用法和`onCleanup`一样；并且 stop , pause , resume 可以直接解构出来使用

```js
import { onWatcherCleanup } from "vue";
const { stop, pause, resume } = watchEffect(
  async () => {
    const { response, cancel } = doAsyncWork(newId);
    onWatcherCleanup(cancel);
    data.value = await response;
  },
  {
    flush: "post", // 'pre' | 'post' | 'sync' ，默认是'pre' ；'post':相当于watchPostEffect() ；'sync':相当于watchSyncEffect()；
    onTrack(e) {
      debugger;
    },
    onTrigger(e) {
      debugger;
    },
  }
);
pause(); // 暂停监听
resume(); // 恢复监听
stop(); // 停止监听
```

6. `watch(source,callback,options)`监听器，和`watchEffect`不同的是，`watch`可以监听多个数据源，并且可以指定监听的方式，比如深度监听，立即执行等

```js
const stop = watch([source1,source2],([newVal1,newVal2],[oldVal1,oldVal2],onCleanup) => {
  // newVal1,newVal2 是新的值
  // oldVal1,oldVal2 是旧的值
  // onCleanup 是可选的，用来清除上次一次的副作用（比如，上一次的异步请求还未执行完，就可以直接清除掉）
  const { response, cancel } = doAsyncWork(newVal1)
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前
  // 未完成的请求
  onCleanup(cancel)
  data.value = await response
},{
  deep:true,// 深度监听
  immediate:true,// 立即执行
  flush:'post',// 'pre' | 'post' | 'sync' ，默认是'pre' ；'post':相当于watchPostEffect() ；'sync':相当于watchSyncEffect()；
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
stop()
```

7. `onWatcherCleanup`清除上一次副作用

```js
import { watch, onWatcherCleanup } from "vue";

watch(id, (newId) => {
  const { response, cancel } = doAsyncWork(newId);
  // 如果 `id` 变化，则调用 `cancel`，
  // 如果之前的请求未完成，则取消该请求
  onWatcherCleanup(cancel);
});
```

### 工具函数

1. `isRef()`,检测一个值是否是 ref 对象，返回值是 true 或者 false
2. `unRef()`相当于`val = isRef(val) ? val.value : val`的语法糖，用来获取 ref 对象的值，如果传入的值不是 ref 对象，则直接返回该值
3. `toRef()`将响应式对象的某个属性变为 ref 对象，并且当响应式对象的属性发生变化时，ref 对象的值也会跟着变化

```js
const state = reactive({
  foo: 1,
  bar: 2,
});
const fooRef = toRef(state, "foo");
```

4. `toValue`在 3.3 版本以后新增 API，可以将值、ref 对象、getter 函数输出为值，相当于`isRef(val) ? val.value : val`的语法糖，不一样的是它会递归知道返回值；
5. `toRefs()`一般用来解构响应式对象，可以让响应式对象的每个属性都变成 ref 对象，并且当响应式对象的属性发生变化时，ref 对象的值也会跟着变化;

:::demo

```vue
<template>
  <div>
    <p>state.foo----{{ state.foo }}</p>
    <p>toRefs解构出来的foo----{{ fooRef }}</p>
    <p>state：{{ state }}</p>
    <button @click="fooRef++">++foo</button>
    <br />
    <button @click="state.foo++">++state.foo</button>
  </div>
</template>
<script setup>
import { reactive, toRef, toRefs } from "vue";
const state = reactive({
  foo: "1",
  bar: "2",
});
const fooRef = toRef(state, "foo");
const barRef = toRef(state, "bar");
</script>
```

:::

6. `isProxy()`用来判断一个对象是否是响应式对象（`reactive()`、`readonly()`、`shallowReactive()`、`shallowReadonly()`），返回值是 true 或者 false 7. `isReactive()`用来判断一个对象是否是响应式对象（`reactive()`、`shallowReactive()`），返回值是 true 或者 false 8. `isReadonly()`用来判断一个对象是否是只读对象（`readonly()`、`shallowReadonly()`），返回值是 true 或者 false 9. `shallowRef()`相当于 ref 的浅层代理，比如

:::demo

```vue
<template>
  <div>
    <p>ref的count----{{ state.count }}</p>
    <p>shallowState的count----{{ shallowState.count }}</p>
    <button @click="state.count++">++count</button>
    <br />
    <button @click="shallowState.count++">++shallowState.count</button>
    <br />
    <button @click="changeCount">shallowState.value = { count: 2 };</button>
  </div>
</template>
<script setup>
import { ref, shallowRef } from "vue";
const state = ref({ count: 1 });
const shallowState = shallowRef({ count: 1 });
function changeCount() {
  shallowState.value = { count: 2 };
}
</script>
```

:::
7. `triggerRef()`则是用来强制触发 shallowRef 的更新，正常情况下shallowRef的值不会像ref一样直接修改，这时候可以使用 triggerRef() 来强制更新
::: tip 官方示例
``` ts
// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 打印 "Hello, universe"
triggerRef(shallow)
```
:::
