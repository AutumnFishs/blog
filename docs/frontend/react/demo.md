# react项目中常用一些封装组件、自定义Hooks
## 封装的一些组件
### 路由守卫的简单实现
react中没有像vue中的全局前置守卫beforeEach，实现路由监听可以自己封装一个`withRouteWatcher`作为根组件,不可以直接给项目根组件root使用，是因为如果直接给项目根组件root使用，会导致项目的根组件root无法获取到路由信息，所以需要封装一个`withRouteWatcher`作为根组件，然后在根组件中使用路由监听。

或者直接在根组件中使用useEffect监听location，根据url信息判断是否需要登录。
::: info 小案例
```js
import React from 'react';
import { useLocation , useNavigate} from 'react-router-dom';
import {routeList} from './routeList'
import { UserContext } from './UserContext'; // 确保你已经定义了这个上下文
const withRouteWatcher = (Component) => {
    // 从context中获取用户信息,使用时，需要创建一个context，用第三方状态库也可以，比如redux
    const {userMsg} = useContext(UserContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const witheName = ['/login','/register','/about']
    useEffect(() => {
    // 当用户未登录时，跳转到登录页面
    if (!whitelistedNames.includes(pathname)) {
      if (!userMsg.isLogin) {
        navigate('/login'); // 用户未登录，跳转到登录页面
        return;
      }
      const route = routeList.find(route => route.path === pathname);
      if (route && route?.role !== userMsg?.role) {
        navigate('/home'); // 角色不符，跳转到首页
        return;
      }
    }
    navigate(pathname); // 白名单等其他情况，保持当前路径
    console.log('Route changed to:', pathname);
  }, [pathname]);
    
    return <Component />;
};
//...
const routeList = [
            {path:'/',element:<Home/>role:'user'},
            {path:'/about',element:<About/>},
            {path:'/login',element:<Login/>},
            {path:'/register',element:<Register/>}
        ]
const routeRoot =  [{
        path:'/',
        element:<withRouteWatcher><MainLayout/></withRouteWatcher>,
        children:routeList
    }，
]
```
:::

### 用createPortal写个模态框
1. 先创建个模态框
    ```js
    import React, { useState, useEffect, useRef } from 'react';
    import ReactDOM from 'react-dom';

    const Modal = (props) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const body = document.body;
        if(!document.querySelector('#model')){
            body.appendChild(document.createElement('div')).id ='model';
        }
        modalRef.current = document.getElementById('model');
    }, []);

    return (
        ReactDOM.createPortal(
            <div className="modal" >
                <div className="modal-content">
                {props?.header}
                {props.children}
                {props?.footer}
                </div>
            </div>,
            modalRef.current
            )
        );
    };

    export default Modal;
    ```
2. 然后在需要的地方使用
    ```js
    import React, { useState } from 'react';
    import Modal from './Modal';

    const App = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleModal}>Toggle Modal</button>
            {isOpen && (
                <Modal header={<div>头部<div>} footer={<div>尾部</div>}>
                <div>主要内容</div>
                <button onClick={toggleModal}>Close Modal</button>
                </Modal>
            )}
        </div>
        );
    };
    export default App;
    ```
3. 此外也可以在状态管理工具里封装一个`useModal`的hook，然后在需要的地方使用
    ```js
    import { useState } from 'react';

    const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return { isOpen, openModal, closeModal };
    };

    export default useModal;
    ```


### 错误边界组件
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

### 图片懒加载
这里用了tailwind
::: info 小案例
```ts
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";

// 正在加载loading

// 加载失败error

// 定义 IMG 的样式变体
export const imgVariants = cva("object-cover", {
  variants: {
    variant: {
      default: "rounded",
      circle: "rounded-full",
      square: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// 定义 IMG 组件的属性类型
interface IImgProps
  extends HTMLAttributes<HTMLImageElement>,
    VariantProps<typeof imgVariants> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

// IMG 组件实现
const Img = forwardRef<HTMLImageElement, IImgProps>(
  ({ src, alt, className, variant, placeholderSrc, ...props }, ref) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = src;
              img.onload = () => {
                setIsLoading(false);
              };
              img.onerror = () => {
                setIsError(true);
                observer.unobserve(img); // 停止观察该元素
              };
              observer.unobserve(img); // 停止观察该元素
            }
          });
        },
        { threshold: 0.1 }
      );

      if (imageRef.current) {
        observer.observe(imageRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [src]);
    const finalSrc = isLoading ? "正在加载图片" : isError ? "错误图片" : src;

    return (
      <img
        ref={imageRef}
        src={finalSrc}
        alt={alt}
        className={imgVariants({ variant }) + ` ${className || ""}`}
        {...props}
      />
    );
  }
);

Img.displayName = "Img";

export default Img;
``` 
:::

### 动态面包屑组件
一般写法是跳转页面时记录组件的路径，然后根据路径渲染面包屑，不要求层级和顺序一般是拥有删除功能的，还有一种是点击时按层级去取当前的路由及其上层的路由，然后渲染面包屑，这种写法比较适合层级和顺序要求比较高的场景，比如后台管理系统。
::: info 小案例
这里引入的组件是`https://ui.shadcn.com/`的，可以直接在粘贴板里复制使用，主要是实现逻辑，然后根据需求进行修改，这里删除功能没写，可以自己写一个删除按钮，然后点击时删除对应的路由跳转记录。

实现思路：
1. 先把路由扁平化，然后根据路径匹配到对应的路由，匹配到后判断当前这个路由面包屑是否存在，如果存在就先删除，然后添加到数组里，如果不存在就直接添加到数组里，然后存储到sessionStorage里，然后渲染面包屑。
```tsx
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// 这里是cloneDeep了routeList，防止修改原数组
import { newRoutes } from "@/router/routes";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
interface LocationType {
  pathname: string;
  search: string;
  hash: string;
  state?: null | object;
  key: string;
  name?: string;
}

export function BreadcrumbComp() {
  const location: LocationType = useLocation();
  const navigate = useNavigate();

  // 存储面包屑的数组
  const [routes, setRoutes] = useState<LocationType[]>(
    JSON.parse(sessionStorage.getItem("breadcrumb") || "[]")
  );

  const handleClick = (route) => {
    if (route?.state) {
      navigate(route.pathname, { state: route.state });
    } else {
      navigate(route.pathname);
    }
  };

  // 路由扁平化对比，找到匹配的路由
  function flatRoutes(routes) {
    let res = [];
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name) {
        res.push(routes[i]);
      }
      if (routes[i].children) {
        res = res.concat(flatRoutes(routes[i].children));
      }
    }
    return res;
  }

  // 路由匹配
  function matchRoute(route, locationPathname) {
    const routeArr = route.path.split("/");
    const locationPathnameArr = locationPathname.split("/");
    if (routeArr.length !== locationPathnameArr.length) {
      return false; // 路径段数不匹配，直接返回不匹配
    }

    for (let i = 0; i < routeArr.length; i++) {
      const segment = routeArr[i];
      if (segment.startsWith(":") && locationPathnameArr[i]) {
        continue; // 忽略动态段
      }
      if (segment !== locationPathnameArr[i]) {
        return false; // 当前段不匹配，直接返回不匹配
      }
    }

    return true; // 所有段都匹配
  }

  useEffect(() => {
    const route = flatRoutes(newRoutes).find((route) =>
      matchRoute(route, location.pathname)
    );
    const routeIndex = routes.findIndex((route) => {
      return route.pathname === location.pathname;
    });

    // 因为我的路由表里有些没有name，所以需要判断一下，没有就不存了
    if (route?.name) {
      const newLocation = { ...location, name: route?.name };
      setRoutes((prevRoutes) => {
        const routes = prevRoutes.filter((_, index) => index !== routeIndex);
        sessionStorage.setItem(
          "breadcrumb",
          JSON.stringify([...routes, newLocation].slice(-7))
        );
        return [...routes, newLocation].slice(-7);
      });
    }
    // location.key 是 react-router-dom 的一个属性，每次路由跳转时都会改变，所以可以用它来判断是否是同一个路由跳转，如果是同一个路由跳转就不执行下面的代码
  }, [location.key]);
  return (
    <div className="flex h-[64px] flex-1 items-center">
      <Breadcrumb>
        <BreadcrumbList>
          {routes.length > 5 ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage
                  onClick={() => handleClick({ pathname: routes[0].pathname })}
                >
                  {routes[0].name}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
                    <BreadcrumbEllipsis className="mt-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {routes.slice(1, routes.length - 2).map((route, index) => {
                      return (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => handleClick(route)}
                        >
                          {route.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              {routes.slice(-2).map((route, i) => {
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage onClick={() => handleClick(route)}>
                        {route.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {routes.map((route, index) => {
                return (
                  <div className="flex items-center gap-1.5" key={index}>
                    {index !== 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbPage onClick={() => handleClick(route)}>
                        {route.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
```
2. 直接递归对比路由，并记录当前路由的层级，然后根据层级渲染面包屑。
```tsx
export function findObjectAndParents(routes, targetPath) {
    let result = null;

    function traverse(nodes, path) {
        for (let node of nodes) {
            // 将当前节点添加到路径中
            path.push(node);

            // 检查当前节点是否是我们要找的目标
            if (matchRoute(node, targetPath)) {
                result = { path: path.slice(), node }; // 使用 slice 方法浅拷贝一个新的数组副本
                path.pop(); // 移除当前节点
                return true; // 已找到目标节点
            }

            // 如果当前节点有子节点，则递归查找子节点
            if (node.children && Array.isArray(node.children)) {
                if (traverse(node.children, path)) {
                    path.pop(); // 移除当前节点
                    return true; // 如果子节点中找到了目标节点，则返回
                }
            }

            // 如果当前节点不是目标节点，也不是目标节点的父节点，移除路径中的当前节点
            path.pop();
        }

        return false;
    }

    // 从根节点开始遍历
    const path = []; // 初始化一个空路径数组
    const found = traverse(routes, path);

    // 清理路径数组
    path.length = 0;

    return result; // 返回找到的目标节点及其所有父节点组成的路径，或 null 如果没找到
}
function matchRoute(route, locationPathname) {
    const routeArr = route.path.split("/");
    const locationPathnameArr = locationPathname.split("/");
    if (routeArr.length !== locationPathnameArr.length) {
        return false; // 路径段数不匹配，直接返回不匹配
    }

    for (let i = 0; i < routeArr.length; i++) {
        const segment = routeArr[i];
        if (segment.startsWith(":") && locationPathnameArr[i]) {
            continue; // 忽略动态段
        }
        if (segment !== locationPathnameArr[i]) {
            return false; // 当前段不匹配，直接返回不匹配
        }
    }

    return true; // 所有段都匹配
}
```
:::

### 文件上传
```tsx
// 接口
export async function uploadLibFile(data, config) {
  return await axios.post(`/upload`, data, config);
}

/* 
* 上传文件
* @param file 要上传的文件
* @param file 要上传的文件
* @param callback 上传进度回调函数(展示上传进度)
*/
export const uploadFileWithProgress = async (file, callback):Promise<any> => {
  try {
    const formData = new FormData(); // 创建一个FormData对象
    // 上传时遇到.md文件 的 file里面读取不到type，type值为空字符串，这里手动判断然后转blob手动添加 MIME 类型
    if (file.name.includes('.md') || file.name.includes('.MD')) {
      formData.set('file', new Blob([file], { type: 'text/markdown' }), file.name);
    } else {
      formData.append('file', file);
    }

    // 上传时一般使用二进制流，这里使用axios上传文件，需要设置请求头
    const config = {
      headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = Math.round((loaded * 100) / total);
        console.log(`Upload progress: ${file.name} ${progress}%`);
        callback(progress)
      },
    };

    // 上传接口
    const data = await uploadLibFile(formData, config);

    // 上传成功返回结果
    console.log('Upload complete:', data);
    return data
  } catch (error) {

    // 上传失败处理
    return ''
  }
};

// 组件
import { useDropzone } from "react-dropzone";
import { alertContext } from "../../contexts/alertContext";

let qid = 1;
export default function UploadModal({
  id,
  accept,
  open,
  desc = "",
  setOpen,
  onResult,
}) {
  const { setErrorData } = useContext(alertContext); // 弹窗
  // size
  const [size, setSize] = useState("500"); // 文件大小
  // 符号
  const [symbol, setSymbol] = useState("\\n\\n;\\n; ;"); //分隔符
  const chunkType = useRef("smart"); // 分块方式
  const [overlap, setOverlap] = useState("50"); // 重叠字数

  const [progressList, setProgressList] = useState([]); // 上传进度列表
  const progressCountRef = useRef(0); // 上传进度计数

  // 弹框开关初始化
  useEffect(() => {
    if (!open) { 
      setProgressList([]);
      progressCountRef.current = 0;
      filePathsRef.current = [];
      failFilesRef.current = [];
    }
  }, [open]);

  const failFilesRef = useRef([]); // 记录上传失败的文件

  // react-dropzone库useDropzone的上传方法
  /* 
  *  onDrop: 上传文件
  *  acceptedFiles: 上传的文件列表
  */
  const onDrop = (acceptedFiles) => {
    //限制上传的文件大小为50mb
    const sizeLimit = 50 * 1024 * 1024;

    //超过50mb的文件名列表
    const errorFile = [];

    const errorFilename = [];

    // 符合限制条件的上传文件列表
    const files = [];
    try {
      acceptedFiles.forEach((file) => {
        if (file.size >= sizeLimit) {
          errorFile.push(file.name);
        } else {
          files.push(file);
        }
      });
    } catch (e) {

    }

    // 存在上传文件大小超过限制的文件提示框展示
    errorFile.length &&
      setErrorData({
        title: '提示',
        list: errorFile.map(
          (str) =>`文件: ${str.length > 30 ? str.slice(0, 30) + "..." : str} 超过50M,已移除`
        ),
      });

    // 没有符合限制条件的上传文件直接返回
    if (!files.length) return;

    // 进度条列表
    setProgressList((list) => {
      return [
        ...list,
        ...files.map((file) => {
          return {
            id: qid++, // 唯一标识
            file,// 上传文件
            await: true, // 是否等待上传
            size: sizeLimit,// 文件大小
            pros: 0,// 上传进度
            error: false,// 是否上传失败
          };
        }),
      ];
    });

    // 当前上传文件的数量
    progressCountRef.current += files.length;
  };

  // 上传成功的文件返回的存储路径
  const filePathsRef = useRef([]);

  // 上传调度
  const [end, setEnd] = useState(true);

  // 上传进度条列表发生变化触发
  useEffect(() => {
    // 一次最多上传3个文件
    const requestCount = 3;

    // 分类
    let awaits = []; // 排队上传的任务
    let peddings = []; // 上传中的任务

    // 上传进度列表分类
    progressList.forEach((item) => {
      if (item.await) {// 等待上传的任务
        awaits.push(item);
      } else if (item.pros !== 100 && !item.error) {//上传中的任务
        peddings.push(item);
      }
    });

    // 处理未完成的任务
    if (peddings.length || awaits.length) {
      setEnd(true);
      // 任务补位
      awaits.filter((e, i) => i < requestCount - peddings.length)// 只取前3个任务
        .forEach((task) => {
          // task为补位任务
          // 标记开始上传
          setProgressList((oldState) =>
            oldState.map((el) => {
              return el.id !== task.id
                ? el
                : {
                    ...el,
                    await: false,
                    pros: 1,
                  };
            })
          );

          /* 
          ** uploadFileWithProgress
          **  @param {File} file 文件
          **  @param {Function} callback 回调函数返回上传进度
          **  @return {Promise} 返回Promise
          */
          uploadFileWithProgress(task.file, (count) => {
            // 更新进度
            setProgressList((oldState) =>
              oldState.map((el) => {
                return el.id !== task.id? el: {...el,pros: count,};
              })
            );
          }).then((data) => {
            // data 存在上传成功
            if (data) {
              //上传成功的文件路径
              filePathsRef.current.push(data.file_path);
            } else {
              //上传失败的文件名
              failFilesRef.current.push(task.file.name);
              setProgressList((oldState) =>
                oldState.map((el) => {
                  return el.id !== task.id
                    ? el
                    : {
                        ...el,
                        error: true,
                      };
                })
              );
            }

            setEnd(
              // 判断是否所有文件上传完成（success+error =total）
              filePathsRef.current.length + failFilesRef.current.length !==
                progressCountRef.current
            );
          });
        });
    }
  }, [progressList]);

  /* 
  ** useDropzone
  **  @param {Object} accept 接受的文件类型
  **  @param {Function} onDrop 文件上传回调函数
  **  @param {Boolean} useFsAccessApi 是否使用文件系统访问API
  **  @return {Object} 返回对象中的getRootProps 根节点属性，getInputProps 输入节点属性，isDragActive 是否拖拽激活
  */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/*": accept.map((str) => `.${str}`),
    },
    useFsAccessApi: false,
    onDrop,
  });

  return (
    <dialog onClick={() => setOpen(false)}>
      <form>
        <button onClick={() => setOpen(false)}>✕</button>
        <h3>上传文件</h3>
        <p>{desc}</p>
        <div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <UploadIcon />
              {isDragActive ? (<p>将文件拖拽到这上传</p>) : (<p>点击或拖拽文件到这上传</p>)}
            </div>
            <div>
              {progressList.map((pros) => (
                <div key={pros.id}>
                  <p>
                    {pros.file.name}
                    {pros.file.pros === 1 && <span>完成</span>}
                  </p>
                  <Progress
                    error={pros.error}
                    value={pros.pros}
                  />
                </div>
              ))}
          </div>
        </div>
      </form>
    </dialog>
  );
}

```
