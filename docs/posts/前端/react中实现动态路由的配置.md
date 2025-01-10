---
title: react中实现动态路由的配置
date: 2023-07-14 14:25:00
tags: [react, react-router-dom]
---
# 关于 react 中实现动态路由的配置

## 前言

最近一个迭代提出一个需求，通过菜单授权动态生产路由；然后这个项目是vite+react18+react-router-dom6的，在实现过程中遇到了一些问题，记录一下。

## 项目配置

1. "node":"18.20.2"
2. "react": "^18.2.0"
3. "react-router-dom": "6.17.0"

## 实现思路

1. 路由配置映射地址以及基本路由配置（直接使用组件、lazy 函数会在后端返回后被序列化，导致渲染组件失败）
2. 登录成功后请求后端返回的菜单数据，根据菜单数据生成路由(使用zustand做全局状态管理工具，并且持久化保存到本地)

## 代码实现（以下代码只是做大概的展示）

### 1. 路由配置映射地址以及基本路由配置
完成配置路由映射地址路由表给后端，后端返回的菜单数据根据路由表生成路由；以及完成默认路由配置，如404页面、登录页面、首页等
```tsx
// routes.tsx
import { menuListType } from "@/store/useMenuStore";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { routeType } from "./routeType";
// 公共组件
const MainLayout = lazy(() => import("@/layout/MainLayout"));

const Mod: any = import.meta.glob("../pages/**/*.tsx"); // 在vite中动态引入所有组件地址

export const lazyLoad = (moduleName: string) => {
  const Module = lazy(Mod[`../pages/${moduleName}/index.tsx`]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Module></Module>
    </Suspense>
  );
};

// 路由配置映射地址，不能直接使用组件，把这个放后端
export const list = [
  {
    path: "/ims/",
    name: "概览页",
    isMenu: true,
    element: "OverviewPage",
    // icon: <ApplicationIcon className="my-[12px] h-6 w-6" />,
  },
  {
    path: "/ims/filelib",
    name: "知识管理",
    isMenu: true,
    isChildren: true,
    // icon: <KnowledgeIcon className="my-[12px] h-6 w-6" />,
    children: [
      {
        path: "/ims/filelib/data",
        name: "知识库",
        isMenu: true,
        children: [
          { index: true, name: "首页", element: "FileDataPage" },
          {
            path: "/ims/filelib/data/:id",
            name: "详情",
            element: "FileDataPage/Files",
          },
        ],
      },
    ],
  },
  {
    path: "/ims/sys",
    name: "系统管理",
    isMenu: true,
    role: "admin",
    isChildren: true,
    // icon: <SystemIcon className="my-[12px] h-6 w-6" />,
    children: [
      {
        path: "/ims/sys/config",
        name: "系统配置",
        isMenu: true,
        element: "SystemPage/Config",
      },
    ],
  },
];

export const routeList: routeType[] = [
  {
    path: "/ims/",
    element: <MainLayout />,
    children: [],
  },
  { path: "/ims/model/doc", element: lazyLoad("ModelPage/Doc") },
  { path: "*", element: <Navigate to="/ims/" replace /> },
];
// @ts-ignore (这里使用这个是因为 createBrowserRouter 的类型定义有问题，它是支持index设置默认子路由的，但是设置后ts类型会报错)
const router = createBrowserRouter(routeList); // 没有登录时的默认路由

export default router;
```

### 2. zustand 做状态管理
持久化后端返回的菜单数据
```tsx
// useMenuStore.ts
import { routeType } from "@/router/routeType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type menuListType = Omit<routeType, "element" | "children"> & {
  element?: string;
  children?: menuListType[];
};
interface menuStore {
  menuList: menuListType[] | null;
  setMenuList: (val: menuListType[]) => void;
}

export const useMenuStore = create<menuStore, [["zustand/persist", menuStore]]>(
  persist(
    (set) => ({
      menuList: null,
      setMenuList: (val) => set({ menuList: val }),
    }),
    {
      name: "useMenuStore-storage", // unique name
      storage: createJSONStorage(() => localStorage), // 默认情况下使用 localStorage
    }
  )
);
```

### 3. 创建工具函数
最核心部分，vite中动态导入组件地址
```tsx
// routes.tsx
const Mod: any = import.meta.glob("../pages/**/*.tsx"); // 在vite中动态引入所有组件地址

export const lazyLoad = (moduleName: string) => {
  const Module = lazy(Mod[`../pages/${moduleName}/index.tsx`]);
  return <Module></Module>
};

...

const processRoutes = (list: menuListType[]): routeType[] => {
  return list.map((route) => {
    let processedRoute;
    if (route.children) {
      processedRoute = {
        ...route,
        children: processRoutes(route.children),
      };
    } else {
      processedRoute = {
        ...route,
        element: lazyLoad(route.element),
      };
    }
    return processedRoute;
  });
};
// 最终的router
export const handleEndRouter = (list: menuListType[]) => {
  const rootRouter = routeList.find((item) => {
    return item.path === "/ims/";
  });
  if (rootRouter) {
    rootRouter.children = processRoutes(list);
  }
  // @ts-ignore
  return createBrowserRouter(routeList);
};

```

### 4. 在登录后获取路由数据，并处理路由
根据登录的用户权限，获取对应的路由数据，并处理路由，确保刷新的时候不会导致路由丢失，刷新不出页面
```tsx
// login.tsx
const { setMenuList } = useMenuStore();
const handleLogin = async () => {
  const res = await login({
    username: mail,
    password: password,
  });
  setToken(res.data.token);
  res.code === 200 &&
    getUserInfo().then((res) => {
      setMenuList(res.data.menuList); // 获取路由数据,并存到store中
    });
};

// App.tsx
export default function App() {
  const { menuList, setMenuList } = useMenuStore();
  // 免登录列表
  const noAuthPages = ["doc"];
  const path = location.pathname.split("/")?.[2] || "";

  const newRouter = useMemo(() => {
    if (user?.user_id && menuList.length > 0) {
      return handleEndRouter(menuList);
    } else {
      return router;
    }
  }, [user, menuList]);// 监听用户和路由数据变化，动态生成路由
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col ">
      {user?.user_id || noAuthPages.includes(path) ? (
        <Suspense
          fallback={
            <div className="flex h-[100vh] w-[100vw] items-center justify-center">
              loading
            </div>
          }
        >
          {newRouter ? <RouterProvider router={newRouter} /> : ""}
        </Suspense>
      ) : user ? (
        ""
      ) : (
        <LoginPage></LoginPage>
      )}
    </div>
  );
}
```

## 总结

1. 主要是当前使用的 vite 搭建的项目不支持，直接动态导入组件，所以需要使用`import.meta.glob`来动态导入组件。
2. 使用`zustand`来管理路由数据，在登录后获取路由数据，并处理路由，确保刷新的时候不会导致路由丢失，刷新不出页面
3. 使用`createBrowserRouter`来创建路由，并使用`RouterProvider`来渲染路由，使用的时候需要注意`lazyLoad`函数使用时机，过早使用会导致页面无法渲染
4. 因为暂时没有提需求要要动态添加路由页面，所以这里的路由表是写死的，只是在权限控制时根据用户选中的权限返回对应的路由表
最后实现主要参考：[react-router v6 如何实现动态路由？](https://juejin.cn/post/7132393527501127687)
