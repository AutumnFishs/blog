---
title: 开发过程用遇到的问题
date: 2025-01-14
---
# 开发过程用遇到的问题

## 2025.1
### pnpm因为项目地址迁移，存放项目的文件夹名称变更导致项目中找不到依赖报错
最后的解决方式还是重新安装依赖 `pnpm i` 梭哈
``` sh
# 移除全局pnpm默认指向虚拟仓库目录
pnpm config delete --global virtual-store-dir
# 重新设置虚拟仓库目录  这里一般配置当前项目的（配置时出现了意外，即使我没有 添加-g它也会修改的是全局的）
pnpm config set  virtual-store-dir /Users/xxx/.pnpm-store
```

### 1.前端代码更新，但是浏览器缓存了静态资源，导致更新后找不到资源报错
解决方法：`禁止缓存html`（不会禁止缓存`css`，`js`文件`等`外部资源）这样既可以确保当前端静态资源发生变化可以直接加载最新的资源，又可以保证在前端未更新的时候可以沿用外部资源的缓存，只需要每次重新加载html即可
::: info 提示（禁止缓存html，不会禁止缓存css，js文件等外部资源）
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```
:::

## 2024.12
### 当前项目使用gitlab、jenkins、harbor实现自动化部署镜像，在部署过程中遇到以下问题：
1. 代码推送到gitlab上后，触发jenkins拉取代码，然后再进行构建，前端代码补包使用的时公司镜像源，而项目中有些依赖包的间接依赖使用的是最新的版本依赖(一般是`^`的)，但是公司镜像源最新版本需要隔天才能同步，导致构建失败，如何解决？
我的代码中shell脚本如下：
```shell
#! /bin/bash
rm -rf build package-lock.json node_modules
npm cache clean --force
npm install --registry=镜像源地址 --verbose --no-audit --prefer-offline --legacy-peer-deps
npm run build

# 构建镜像使用的是公司依赖包，此处省略
tag_name=$([ "$1" ] && echo "$1" || echo "latest")
npm run buildoci $tag_name
```
为了确保每次都重新构建把`package-lock.json`和`node_modules`删除了，然后重新安装依赖包，但是这里拉不下去最新的依赖包，导致构建失败；
为了确保打包构建正常：
1. 保留`package-lock.json`锁文件以及`node_modules`,这样只要本地补包正常后，锁文件就会固定依赖，不会出现间接依赖包版本不一致的情况
2. 可以在本地构建好build包后，把build包上传到gitlab上，然后jenkins拉取build包，这样就不会出现间接依赖包版本不一致的情况（公司要求统一到jenkins上再构建）

### react项目中将svg转为react组件
1. 首先安装[vite-plugin-svgr](https://gitcode.com/gh_mirrors/vi/vite-plugin-svgr/overview)插件
2. 在vite.config.ts中配置插件
   ```ts vite.config.ts
   import { defineConfig } from 'vite';
   import svgr from 'vite-plugin-svgr';

   export default defineConfig({
     plugins: [svgr()],
   });
   ```
3. 封装一个Svg组件
   ```tsx
    import React, { forwardRef } from "react";
    import { ReactComponent as Xxx } from "./xxx.svg";

    export const XxxIcon = forwardRef<
    SVGSVGElement & { className: any },
    React.PropsWithChildren<{ className?: string; onClick?: Function }>
    >((props, ref) => {
    return <Xxx ref={ref} {...props} onClick={props.onClick} />;
    });
    ```
4. 关于svg文件，封装成组件的原因是希望可以直接通过修改组件的`className`来修改svg的样式，比如颜色、大小等，如果直接使用svg文件，需要通过`fill`、`width`、`height`等属性来修改样式，但是这样比较麻烦，而且如果需要修改样式，还需要重新生成svg文件，所以封装成组件后，只需要修改组件的`className`即可，比较方便
    ``` html
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Group 488">
    <rect id="Rectangle 231" x="5.75" y="5.75" width="12.5" height="13.5" rx="2.25" fill="white"
        stroke="currentColor" stroke-width="1.5" />
    <rect id="Rectangle 232" x="8.75" y="4.75" width="6.5" height="3.5" rx="1.25" fill="white" stroke="currentColor"
        stroke-width="1.5" />
    </g>
    </svg>
    ```
    `stroke="currentColor"，fill='currentColor'`可以实现text文字颜色和svg颜色一致，如果需要修改颜色，只需要修改`className`即可


