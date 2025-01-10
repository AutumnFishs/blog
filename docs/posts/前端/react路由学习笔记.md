---
title: react路由学习笔记
date: 2023-06-26 10:10:10
tags: [react,路由]
categories: [前端]
---
---
# 关于react路由的使用（6.26.1）
## 关于路由的基本使用
### 在使用路由之前，需要先写个路由表
```js
import { ApplicationIcon } from "@heroicons/react/outline";
import { MainLayout } from "./layouts/MainLayout";
import { lazy } from "react";
const OverviewPage = lazy(() => import("./pages/OverviewPage"));// 按需加载
const Messages = lazy(() => import("./pages/Messages"));
const routes = {
    path: "/",//路径
    element: <MainLayout />,
    errorElement:<ErrorBoundary />,
    children: [ // 子级路由会在MainLayout中<Outlet/>所在位置渲染
      {
        path: "/home",
        name: "首页",
        isMenu: true,// 自定义属性
        element: <OverviewPage />,
        icon: <ApplicationIcon className="my-[12px] h-6 w-6" />,// 自定义属性
      },
      {
        path: "/messages/:signal",
        name: "信息",
        element: <Messages />,
        loader: ({ params }) =>// 路由的异步加载,结果会传递到Messages组件中，通过useLoaderData()去取
        fetch("/api/dashboard.json", {
        signal: params.signal,
        }),
        errorElement:<ErrorBoundary />,// 单个路由的错误边界,一般不这么用，可以直接在根路由上写一个错误边界组件，这样就可以捕获到在所有根组件下的错误，然后统一处理了，如上
      },
    ],
}
```
#### 错误边界组件
::: info 官方示例
// ErrorBoundary.js
```js
export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
```
:::
### 然后在router.js中引入路由表
```js
import { createBrowserRouter } from "react-router-dom";// 客户端路由
import routes from "./routes";

const router = createBrowserRouter(routes);

export default router;
```
### 然后在App.js中引入路由表,一般搭配`Suspense`和`lazy`使用
```js
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <div className="App">
        <Suspense fallback={<>loading...</>}>
            <RouterProvider router={router} />
        </Suspense>
    </div>
  );
}
```
### 在这里是无法使用路由API，只能在router的children中使用，比如`home`页面，及其子组件里面；

## 关于路由的一些常用组件
### 导航组件
1. `Link` 导航组件，用于跳转路由
    - `to` 跳转的路由，不以`/`开头的时候，会相对于父路由
    - `state` 跳转的路由的状态，传递一个对象到跳转到组件，再跳转的组件中通过`useLocation`获取state
    - `replace` 是否替换路由，当它为`true`时，相当于history.replace(xxx);
    - `reloadDocument` 这个属性的跳转类似与 `a href`
    - `preventScrollReset`是否阻止滚动重置，当它为`true`时，跳转的滚动不会重置到页面顶部
    - `unstable_viewTransition`这个属性是实验性，可以在新的页面没有加载完成的时候显示旧的页面，暂时不推荐使用

2. `NavLink` 导航组件，用于跳转路由，但是可以设置样式 ，`className` 、`style` 都可以使用回调函数的参数，如下：
    ```js
    <NavLink
    to="/messages"
    className={({ isActive, isPending, isTransitioning }) =>
        [
        isPending ? "pending" : "",
        isActive ? "active" : "",
        isTransitioning ? "transitioning" : "",
        ].join(" ")
    }
    >
    Messages
    </NavLink>
    ```
    - `caseSensitive` 这个属性则会区分路由的大小写
    其余的属性和 `Link` 组件一样,`aria-current`,`end`后面再提（俺也不知道,熊大知道）

3. `Outlet` 路由的子级组件，用于渲染路由,类似于占位符，和{children}比较像，不同的是它用于路由的子路由渲染，而children用于所有的子组件

4. `Navigate` 导航组件，用于跳转路由，但是不会渲染路由，用法如下：
    ```js
    //...
    let { user , setUser} = useState()
    //...
    <div>
    {user && <Navigate to="/messages" replace={true} />}
    </div>
    ```

### 关于路由的一些常用hooks
1. `useLocation` 获取当前路由的信息，返回一个对象，包括`pathname`,`search`,`hash`,`key`等信息
2. `useNavigate` 导航组件，用于跳转路由，但是不会渲染路由，用法如下：
    ```js
    const navigate = useNavigate()
    navigate("/messages")
    ```
3. `useParams` 获取路由的参数，返回一个对象，包括`id`,`name`等信息，使用的时候需要配置动态路由表
    ```js
    const router = createBrowserRouter([
        {
            path: "/messages/:id",
            element: <MessagePage />,
            children:[
              ...// 配置子路由的时候，一定要在父页面里写<Outlet/>，不然子路由无法渲染(不要忘记)
            ]
        },
    ])
    //...
    const { id } = useParams()
    ```