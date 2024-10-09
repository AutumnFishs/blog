# React18.2.0
这里只记录了一些平时常用的hook、api、组件等，像一些实验性的没提，也没用过，还有一些不是特别常用的暂时没有记录
## 关于使用Hook的一些心得
使用hook必须在函数最顶层使用，不能在for循环或者if里使用

### 关于useContext配合createContext实现状态管理的问题
1. 性能问题
    每次修改`useContext`的状态的时候，都会重新渲染所有使用该`useContext`的组件
2. 状态管理复杂
    它是一个组件，访问状态必须在这个组件下的子孙组件中访问，多个`Provider`互相使用状态困难，只能向下传递状态，所以一般是在app应用组件外层套用，方便全局引入，并且状态管理最好还是使用第三方库类似、`redux`、`redux-tookit`、`zustand`等
3. 优化方案
    当对状态管理要求较高时，尽量使用第三方工具避免直接使用上面这种方式，如果使用的话可以结合`useMemo`、`useContext`做些优化，避免一些不必要的更新

### 关于useEffect使用心得
1. 作为函数组件模拟实现类组件的生命周期
    `useEffect(()=>{},dependencies)`,它的`dependencies`是可选值
    - 当不写它的时候，每次函数组件的状态发生变化都会引起它的执行，容易出现死循环，一般需要避免这种情况的发生
    - `dependencies`为空数组的时候，就相当于`componentDidMount`，只会执行一次
    - `dependencies`为非空数组的时候，就相当于`componentDidUpdate`，每次依赖项的状态发生变化都会执行
    - 第一个参数的函数` return `一个函数，这个函数相当于`componentWillUnMount`,也就是销毁期
    ::: warning 注意
    当有依赖项的时候，每次依赖项发生变化都会执行这个函数，所以最好就是写一个专门初始化的`useEffect`，然后它`return`一个函数作为销毁期
    :::
2. 封装一些自定义hooks一般都会用`useEffect`

### 关于useImperativeHandle的使用
`useImperativeHandle(ref, createHandle, dependencies?)`
这个hook是用来像父组件暴露一些子组件的方法的，一般需要结合`forwardRef`api来使用，这样父组件可以通过`useRef`来获取子组件，如果子组件还使用这个hook就可以直接拿到暴露出去的方法了
::: info 官方案例
```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
const inputRef = useRef(null);

useImperativeHandle(ref, () => {
    return {
    focus() {
        inputRef.current.focus();
    },
    scrollIntoView() {
        inputRef.current.scrollIntoView();
    },
    };
}, []);

return <input {...props} ref={inputRef} />;
});
```    
:::

### 还未尝试的Hook
1. `useDebugValue` 开发者工具使用的hook
2. `useDeferredValue` 延迟某些ui的更新，比如数据未加载时候展示旧的内容，并且还可以在数据更新较快的时候，把最后更新的结果渲染出来，避免不必要的更新 可以配合`Suspense`
3. `useId` 生成一个唯一的id，但是官方不推荐作为key值，key值还是推荐使用数据里的id
4. `useInsertionEffect` 为`css-in-js`打造的hook
5. `useSyncExternalStore`订阅外部store的hook
6. `useTransition` 还有一个与之相似的api `startTransition`，功能比之要差些

## 关于使用API的一些新得，和上面重复的就不写了
### 关于lazy的使用
1. `lazy`,一般是配合`Suspense`组件实现懒加载,有时候组件因为功能多嵌套的非常复杂，引入一个组件会会连带加载非常多的子组件，这时候就可以通过`Suspense`配合`lazy`实现代码分割懒加载，优化页面加载速度了
2. 还有就是最普遍的用法路由组件实现代码分割，然后按需加载，减小初始化应用的加载压力，优化用户体验
### 关于memo的使用
`const MemoizedComponent = memo(SomeComponent, arePropsEqual?)`
一般配合`useMemo`，`useCallback`缓存，避免组件的不必要更新,它的第二个参数是一个函数，这个函数接收两个参数
```js
const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.items === nextProps.items;
};
```
当这个函数返回false就会重新渲染子组件，这个函数类似与类组件的`shouldComponentUpdate`生命周期，可以由开发者决定是否渲染子组件，但是一般不会用到这个


### 配合hook使用的
1. `createContext`，一般就是配合`useContext`
2. `forwardRef`,将 DOM 节点暴露给父组件，或者像上面配合hook将子组件方法暴露给父组件
### 没咋用过的API
`startTransition` 类似`useTransition`
# 关于react-dom的一些好东西
## 关于react-dom的一些api
关于react-dom的API，serverAPI这里就不提了，只说一下clientAPI
### 关于createPortal
`createPortal(children, domNode, key?)`  
`createPortal`这个api功能比较强，类似vue中的`Teleport`,允许将JSX,作为children渲染到页面上，最重要的是可以指定渲染到哪个元素下，当然这个节点必须是页面已经存在，其实最佳实践就是在全局添加，比如模态框、全局提示、右键菜单啥的，一般就是封装组件的时候用
::: info 官方案例
```js
import { createPortal } from 'react-dom';
// ...

<div>
  <p>这个子节点被放置在父节点 div 中。</p>
  {createPortal(
    <p>这个子节点被放置在 document body 中。</p>,
    document.body
  )}
</div>
```
:::
### 关于flushSync的使用
这个api是react中的同步执行api，正常情况下react会进行优化，让一些代码一起执行，比如`useState`的状态变更，不可能说每个状态变更都去更新一次，它会批量执行，等待当前的状态都变更完了再执行，而这个api它是同步刷新；可以达到vue中的`nextTick`的效果，不过`nextTick`是获取更新后dom再执行操作，它是直接同步；
::: info 官方示例
```js
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);
  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    }
  }, []);
  return (
    <>
      <h1>是否打印：{isPrinting ? '是' : '否'}</h1>
      <button onClick={() => window.print()}>
        打印
      </button>
    </>
  );
}
```
:::

::: warning 注意
`flushSync` 可能会严重影响性能，因此请谨慎使用；
:::
### 关于render的使用
`render(children, container, callback?)` 这个api是react中用来渲染的api，它的第一个参数是子节点，第二个参数是容器，第三个参数是回调函数，一般是用来更新dom的，但是它的第三个参数是可选的，一般不需要用;

最常用的场景就是渲染根节点到指定容器里，并且react18里用`createRoot`函数，不在使用它。
::: info 官方示例
```js
import { render } from 'react-dom';
const domNode = document.getElementById('root');
render(<App />, domNode);
```
:::
与之相对应的还有个api，`unmountComponentAtNode`，它的作用是卸载指定的容器，一般是在组件卸载的时候用，它的参数是容器；  
使用 `unmountComponentAtNode` 从 浏览器 DOM 节点 中移除 已挂载的 React 组件。react18里面也不在使用这api，而是直接使用`root.unmount(domNode)`函数卸载； 
::: info 官方示例
```js
import { render, unmountComponentAtNode } from'react-dom';
const domNode = document.getElementById('root');
render(<App />, domNode);
// 卸载组件
unmountComponentAtNode(domNode);
```
:::
react18推荐使用的创建渲染根节点，卸载根节点的方式如下:
::: info 官方示例
```js
import { createRoot } from'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
root.unmount();//卸载根节点内的所有组件
```
:::

### 关于hydrate这个API(尚未尝试，只简单试过Next.js)
`hydrate`这个api是用来实现服务端渲染的，暂时没有用过，目前有现成的服务端渲染的库，比如`next.js`就是用的这个api去实现的，在react18后提供了新的api`hydrateRoot`
`hydrateRoot(domNode, reactNode, options?)`
::: info 官方示例
```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';
hydrateRoot(
  document.getElementById('root'),
  <App />
);
```
:::