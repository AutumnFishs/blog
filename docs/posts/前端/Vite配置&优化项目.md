---
title: Vite配置&优化项目
tags: [Vite,React]
date: 2025-02-05
abstract: 几个月前因为项目进入首页的时间非常慢，被领导说我对react不熟悉，我重新优化了下项目打包体积，以及文件的加载策略
---
# Vite配置&优化项目
几个月前因为项目进入首页的时间非常慢，被领导说我对react不熟悉，我重新优化了下项目打包体积，以及文件的加载策略

## 1. 技术栈
当前项目技术栈是react+vite+ts+zustand；

## 2. 在打包分析之前，先配置可视化分析工具
在vite中开发环境使用的是esbuild，生产环境使用的是rollup，这里安装的rollup插件rollup-plugin-visualizer,通过它可以实现对当前项目的打包文件大小有一个充分且直观的了解；
![项目打包可视化视图](/打包文件可视化视图.png)
## 3. 优化方式
### 图片压缩
图片是一个占用资源比较明显的地方；过去用的jpeg或者png格式的比较多，现在则是比较流行webp、avif格式的图片，在相同的质量下，这两种格式占用的体积更小，尤其是avif的，考虑兼容性可以优先选中webp；这里需要和ui沟通，由于工期，之前ui给的都是png的图片，并且图片体积都比较大，所以可以通过配置压缩图片大小，这里通过安装`vite-plugin-image-optimizer`插件实现对图片的压缩
``` js
// 这里忽略这两个图片的原因是这两个图片是动图，压缩后就失去了动态效果
ViteImageOptimizer({
    test: /\.(jpe?g|png|svg|gif|tiff|webp|avif)$/i,
    exclude: /(chat_robot.png|logo.jpeg)/i,
})
```
![图片压缩结果](/图片压缩.png)
### 使用svg图片
有些图片比如一些页面的按钮切换时icon变色，这些icon只是一些简单的图案，点击时切换icon加载新的图片就会浪费资源，可以使用svg图片，通过currentColor属性配置然后通过css属性修改配色，这样来减少图片的加载。
``` js
// vite.config.ts
import svgr from 'vite-plugin-svgr'
//在插件中添加svgr，实现在react中将svg图片转为react组件，方便我们对组件样式的调整
svgr()

// xx组件，引用组件后可以通过修改css样式来修改icon颜色大小
import React, { forwardRef } from "react";
import { ReactComponent as System } from "./System.svg";

export const SystemIcon = forwardRef<
    SVGSVGElement & { className: any },
    React.PropsWithChildren<{ className?: string }>
>(({className,...props}, ref) => {
    return <System ref={ref} {...props} className={className || ''}/>;
});
```
### 小图转内联
图片小的可以直接转为base64的url，这样可以减少向服务器请求的次数，也可以优化页面加载速度
```js
 build:{
    assetsInlineLimit: 1024 * 10
 }
```
### Tree Shaking
在webpack中需要配置实现抖动，移除未使用的代码；这个在vite中已经内置了，在项目中确保组件图片等都是按需加载，选择依赖库也尽可能的实现支持按需加载的依赖；通过import引入依赖实现代码分割，按需加载减小项目体积

### 压缩js代码以及移除注释、console等
vite默认使用的是esbuild来压缩代码，esbuild压缩代码相对更快，但是terser可以提供更细致的压缩方式，压缩的体积更小，这里使用terser进行压缩js代码体积，并且移除console、debugger代码；
```js
build:{
minify: "terser",
terserOptions: {
compress: {
    drop_console: true,
    drop_debugger: true,
},
},
}
```
### css压缩
关于css压缩，当前项目使用的是tailwindcss，tailwindcss已经内置了css压缩功能，所以不需要额外配置，需要考虑的就是class类名过多，重复等，可以通过clsx、tailwind-merge这两组件实现样式合并，尽可能的减少代码体积；可以多次复用的classname也可以通过@layer component{ @apply xxx } 的方式实现复用，比如：
``` css
@layer component {
    .side-bar-arrangement {
    @apply flex h-full w-52 flex-col overflow-hidden scrollbar-hide;
    box-shadow: 1px 0 2px #eee; /* me */
    }
}
```
### 分包策略
起初打算使用网上的一些案例，使用最小化分包策略实现；不过实际效果不是很好，有些资源非常小，同样需要请求服务器资源，这会拖慢整个项目的加载，折中考虑，把一些比较大的包单独放到一个里，并且在合适位置加载，避免影响整个项目的加载速度
``` js
rollupOptions: {
    output: {
        manualChunks: {
        acebuilds: [
            "react-ace",
            "ace-builds",
            "react-syntax-highlighter",
            "rehype-mathjax",
            "react-markdown",
        ],
        reactflow: ["reactflow"],
        pdfjs: ["pdfjs-dist"],
        reactdrop: [
            "react-window",
            "react-beautiful-dnd",
            "react-dropzone",
        ],
        },
    },}
```
### 打包压缩gzip，同时服务端也压缩gzip
客户端打包压缩gzip，服务端也压缩gzip，这样浏览器可以快速拿到资源，并且浏览器可以快速识别gzip实现快速解压
``` js
plugins:[
      viteCompression({
        verbose: true,//是否在控制台中输出压缩结果
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',//压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: '.gz',
        deleteOriginFile: //true源文件压缩后是否删除
      })
    ]
```
nginx配置当时不懂，领导直接塞了这么一段过来，然后修修改改...
``` sh
server {
	listen 3001;
# 	server_name xxx

	# 加速配置
	client_max_body_size 1024M;
    client_body_buffer_size 1M;
    client_header_buffer_size 8K;

	gzip on;
# 	gzip_comp_level  2;
    # 加速配置
	gzip_comp_level  5;
	gzip_proxied any;

	gzip_min_length  1000;
# 	gzip_types  text/xml text/css;

	# 加速配置
	gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	gzip_http_version 1.1;
	gzip_vary  on;
	gzip_disable "MSIE [4-6] \.";
```
## 4. react优化
### 按需加载import
组件按需加载，配合lazy+suspence实现组件懒加载，避免同时加载大量的组件，造成页面加载时间过长
### 首页白屏优化
页面首次加载资源过多，会产生白屏现象，尤其是项目越来越大，以及公司网络带宽比较小，有时候网络会很卡，表现的比较明显，这时可以在页面中先加载loading动画，首页加载成功后，隐藏loading，再加载其他资源，从而避免白屏现象，后面路由入口也直接沿用这个loading动画，避免出现页面闪烁
``` html
<body id="body" style="width: 100%; height: 100%">
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="index-loading">
    <img id="loading-img" src="./src/assets/lc_zy_loading.gif" alt="" />
</div>
<div style="width: 100vw; height: 100vh" id="root"></div>
<script type="module" src="/src/index.tsx"></script>
</body>

<!-- loading -->
 export const FallBackLoading = () => {
  useEffect(() => {
    document.getElementById("index-loading").style.display = "block";
    return () => {
      document.getElementById("index-loading").style.display = "none";
    };
  }, []);
  return <></>;
};


<!-- 路由入口 -->
<Suspense fallback={<FallBackLoading />}>
    {newRouter ? <RouterProvider router={newRouter} /> : ""}
</Suspense>
```
### 组件缓存
使用比较频繁的组件或者页面，通过useMemo+useCallback+useStatus来实现组件的缓存，避免因为状态变更或者函数引用变更造成组件的重新渲染

### 状态持久化存储
项目中使用的是zustand以及react内置的createContext做状态管理的，状态持久化的底层大部分都是使用localStorage，zustand它内置了持久化存储不需要过多操作
``` js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAtlasStore = create<AtlasStore, [["zustand/persist", AtlasStore]]>(
  persist(
    (set) => ({
      atlasTabVal: "atlas",
      setAtlasTabVal: (val) => set({ atlasTabVal: val }),
      mainConfigTabVal: "concept",
      setMainConfigTabVal: (val) => set({ mainConfigTabVal: val }),
      constructAtlasTabVal: "record",
      setConstructAtlasTabVal: (val) => set({ constructAtlasTabVal: val }),
      attrsType: attrsType,
      statusType: statusType,
    }),
    {
      name: "useAtlasStore-storage", // unique name
      storage: createJSONStorage(() => sessionStorage), // 默认情况下使用 localStorage
    }
  )
);
```
## 5. 浏览器开发者工具优化
使用浏览器开发者面板中的Lighthouse，可以帮忙分析页面哪些资源加载可以进行优化，比如性能、seo、无障碍、最佳做法等..
![性能分析报告](/性能分析报告.png)

## 6. 浏览器内置api优化加载
浏览器内置一些api可以实现对项目加载的优化
### 1. 通过IntersectionObserver实现图片懒加载
``` tsx
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
    const finalSrc = isLoading ? "正在加载" : isError ? "错误图片" : src;

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
### 2. 通过requestAnimationFrame实现流畅的加载动画效果
通过这个api确保回调函数可以在下次重绘之前的一个合适时机去执行，确保页面动画流畅的进行,比如来一个进度条动画：
```js
let start = null;
const duration = 3000; // 动画持续时间3秒
const loadingBar = document.getElementById('loading-bar');

function step(timestamp) {
  if (!start) start = timestamp;
  let progress = timestamp - start;

  let percentage = Math.min(progress / duration * 100, 100);

  loadingBar.style.width = percentage + '%';

  if (progress < duration) {
    // 如果未完成，则请求浏览器在下次重绘前再次调用step函数
    requestAnimationFrame(step);
  } else {
    console.log("Loading complete");
  }
}

// 开始动画
requestAnimationFrame(step);
```
### 3. 使用web worker加载资源
web worker可以用来加载一些不需要立马用到的但是很大的数据，比如关系图的节点信息等等，可以在进入页面之前就放在后台加载，如下：在入口创建一个worker，在需要的时候通知它加载，然后在加载完成时再通知主进程可以搭配状态管理工具使用...（前端时间遇到页面接口状态变更的，考虑使用这个，比较后考虑使用发布订阅更合适，这个只做了解，可以作为后续项目优化的点）
``` js
// main.ts
// 创建一个新的 web worker
const worker = new Worker('worker.js');

// 监听来自 worker 的消息
worker.onmessage = function(e) {
  console.log('从 worker 接收到的数据:', e.data);
  
  // 假设这是关系图的节点信息，现在可以用来初始化你的应用或其他操作
  const nodesData = e.data;
  initializeGraph(nodesData);
};

// 发送消息给 worker 开始加载数据
worker.postMessage('startLoading');

function initializeGraph(data) {
  // 使用接收到的数据初始化图形或其他UI组件
  console.log('初始化图形:', data);
}

// work.js
// 模拟一个耗时的任务，比如加载大数据集
function loadData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 假设这里是从服务器获取数据的模拟
      const largeDataSet = Array.from({length: 10000}, (_, i) => ({
        id: i,
        name: `Node ${i}`,
        connections: [i + 1, i + 2].filter(id => id < 10000)
      }));
      
      resolve(largeDataSet);
    }, 2000); // 模拟网络延迟
  });
}

// 监听来自主线程的消息
onmessage = async function(e) {
  if (e.data === 'startLoading') {
    console.log('开始加载数据...');
    
    try {
      // 加载数据
      const data = await loadData();
      
      // 将加载的数据发送回主线程
      postMessage(data);
    } catch (error) {
      console.error('数据加载失败:', error);
    }
  }
};
```
## 7. 静态资源缓存
项目更新后有些浏览器需要清除缓存，否则会因为html页面缓存导致找不到静态资源...
``` html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```
通过配置上述元信息，确保html页面不会被缓存，这并不会阻止其他静态资源缓存，这样当前端更新后，每次进入页面都会重新请求静态资源，如果是文件没有更新则还是使用原来的资源，以确保资源的有效利用;也可以配置nginx实现
``` sh
# 对于静态资源，比如图片、CSS、JS文件等，设置较长的缓存时间
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d; # 设置缓存有效期为30天
    add_header Cache-Control "public";
}

# 对于HTML页面，确保不被缓存
location / {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    expires 0;
}
```
页面更新添加监听文件加载失败的逻辑确保在失败时提醒用户刷新页面，并添加次数限制，如果多次加载失败则提醒用户服务异常，并说明原因，比如：
``` js
let errorCount = 0;
const maxErrorsBeforeReload = 3; // 设置最大错误数
const errorWindowDuration = 60 * 1000; // 1分钟内发生的错误计数

window.addEventListener('error', function(event) {
    if (event.target instanceof HTMLScriptElement || 
        event.target instanceof HTMLLinkElement || 
        event.target instanceof HTMLImageElement) {
        
        const now = new Date().getTime();
        if (!this.lastErrorTime || now - this.lastErrorTime > errorWindowDuration) {
            errorCount = 0;
        }

        errorCount++;
        this.lastErrorTime = now;

        if (errorCount <= maxErrorsBeforeReload) {
            console.error('资源加载失败:', event.target.src || event.target.href);
            reloadPage();
        } else {
            console.warn('超出最大重试次数，不再尝试刷新页面');
        }
    }
}, true);

function reloadPage() {
    console.warn('页面将在3秒后刷新...');
    setTimeout(() => {
        location.reload();
    }, 3000); // 延迟3秒刷新页面，给用户一定反应时间
}
```