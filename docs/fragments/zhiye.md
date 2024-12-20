---
hidden: true
---

# 知业大模型依赖

## 生产依赖

### 绘制可视化图谱

- "@antv/g6": "^5.0.7"

### 废弃（该依赖主要是用来提供一些 css 样式）

- "@emotion/react": "^11.11.1",
- "@emotion/styled": "^11.11.0",

### 主要使用该 ui 的过渡动画组件 Transition

- "@headlessui/react": "^1.7.17",

### icon 图标(select 组件下拉图标)

- "@heroicons/react": "^2.0.18",

### 主要使用 Tooltip 组件

- "@mui/material": "^5.14.7",

### 废弃 ui 库

- "@popperjs/core": "^2.11.8",

### 该项目主要使用的 ui 库

- "@radix-ui": "^1.1.2",

### tailwind 针对表单和文本行数的实用类

- "@tailwindcss/forms": "^0.5.6",
- "@tailwindcss/line-clamp": "^0.4.4",

### 水印（不再使用）

- "@uiw/react-watermark": "^1.0.1",

### 一个手风琴组件（不再使用）

- "accordion": "^3.0.2",

### 编辑器

- "ace-builds": "^1.24.1",

### 累加器 第三方库，用来保证数据一致性（精度）

- "add": "^2.0.6",

### react 的一些常用 hooks

- "ahooks": "^3.8.0",

### 用来将 ANSI 码转换为 html

- "ansi-to-html": "^0.7.2",

### axios 请求

- "axios": "^1.5.0",

### 在 js 中对 base64 进行编码和解码

- "base64-js": "^1.5.1",

### 用来定义组件 variant 的库 （比如按钮的 variant，通过 cva 这个 api 实现）

- "class-variance-authority": "^0.6.1",

### 用来动态拼接类名

- "clsx": "^2.0.0",

### 一个特殊的组件库

- "cmdk": "^0.2.0",

### tailwind 组件样式库，可以理解为工具类的升级版

- "daisyui": "^3.6.3",

### 用于清理潜在不安全的 HTML 内容的安全库，可以防止 XSS（跨站脚本）攻击

- "dompurify": "^3.0.5",

### 打包工具

- "esbuild": "^0.17.19",

### 国际化库

- "i18next": "^23.6.0",
- "i18next-http-backend": "^2.2.2",
- "react-i18next": "^13.3.1",

### iip-toolkit 公司私有库

- "iip-toolkit": "^1.0.1",

### 数据加密解密库

- "jsencrypt": "^3.3.2",

### 常用的方法库

- "lodash-es": "^4.17.21",

### icon 图标库

- "lucide-react": "^0.352.0",
- "react-icons": "^4.10.1",
- "@tabler/icons-react": "^2.32.0",

### pdf 预览库

- "pdfjs-dist": "^3.10.111",

### react

- "react": "^18.2.0",

### 一款 react 的编辑器

- "react-ace": "^10.1.0",

### react 的拖拽库

- "react-beautiful-dnd": "^13.1.1",

### 用于管理 cookie 的库

- "react-cookie": "^4.1.1",

### react 的 dom 库

- "react-dom": "^18.2.0",

### 文件上传库

- "react-dropzone": "^14.2.3",

### react 的错误边界库

- "react-error-boundary": "^4.0.11",

### 一些特殊的样式库（比如，鼠标右键菜单、鼠标移入提示框、旋转菜单..）

- "react-laag": "^2.0.5",

### 将 markdown 渲染到页面上

- "react-markdown": "^8.0.7",

### react 的路由库

- "react-router-dom": "6.17.0",

### 代码高亮

- "react-syntax-highlighter": "^15.5.0",

### tabs 组件

- "react-tabs": "^6.0.2",

### tooltip 组件

- "react-tooltip": "^5.21.1",

### react-window 用于优化大型列表渲染性能的 React 库，这里配合 pdf 实现 pdf 的虚拟列表展示）

- "react-window": "^1.8.9",

### 构建关系图

- "reactflow": "^11.9.2",

### 用于创建可复用的 React 图表组件的库

- "recharts": "^2.10.4",

### 用于在 Web 浏览器中显示数学公式，这里与 react-markdown 结合使用

- "rehype-mathjax": "^4.0.3",

### react-markdown 的插件，用来扩展 markdown 的功能，gfm、数学公式

- "remark-gfm": "^3.0.1",
- "remark-math": "^5.1.1",

### 项目中使用了 sass 预编译器

- "sass": "^1.77.2",
- "sass-loader": "^14.2.1",

### 可以无需下载依赖直接粘贴代码的组件库

- "shadcn-ui": "^0.2.3",

### 用于生成短唯一标识符（Short Unique ID）的库

- "short-unique-id": "^4.4.4",

### 组件（不再使用）

- "switch": "^0.0.0",
- "table": "^6.8.1",

### 用于生成 UUID 的库

- "uuid": "^9.0.0",

### 将 svg 图片转为 react 组件

- "vite-plugin-svgr": "^3.2.0",

### 用于测量网页关键性能指标（Core Web Vitals）的库

- "web-vitals": "^2.1.4",

### react 的状态管理库

- "zustand": "^4.5.2"

## 开发依赖

### 构建工具

#### swc 编译器的命令行工具

- "@swc/cli": "^0.1.62",

#### swc 类似与 babel 但是比 babel 功能更强，编译速度更快

- "@swc/core": "^1.3.80",

#### 在 vite 项目中使用 swc 编译器

- "@vitejs/plugin-react-swc": "^3.3.2",

### tailwindcss 样式预处理

- "tailwindcss": "^3.3.3",

#### 排版相关的工具类扩展

- "@tailwindcss/typography": "^0.5.9",

#### 编译时自动为 css 添加浏览器前缀

- "autoprefixer": "^10.4.15",

#### 用于按顺序合并 Tailwind CSS 类

- "tailwind-merge": "^2.4.0",

#### Tailwind CSS 中使用动画类

- "tailwindcss-animate": "^1.0.7",

### 测试工具（可移除）

- "@testing-library/react": "^13.4.0",
- "@testing-library/jest-dom": "^5.17.0",
- "@testing-library/user-event": "^13.5.0",

### ts 类型

- "@types/axios": "^0.14.0",
- "@types/jest": "^27.5.2",
- "@types/lodash-es": "^4.17.12",
- "@types/node": "^16.18.46",
- "@types/react": "^18.2.21",
- "@types/react-dom": "^18.2.7",
- "@types/uuid": "^9.0.2",

### 公司私有库

- "iip-container-image-builder": "^3.2.0",

### 可以理解为 css 的插件扩展器，这里使用 tailwindcss 作为插件

- "postcss": "^8.4.29",

### 自动格式化代码

- "prettier": "^2.8.8",

#### 扩展 prettier 的功能，格式化 tailwindcss 的样式、import 导入文件的格式化

- "prettier-plugin-organize-imports": "^3.2.3",
- "prettier-plugin-tailwindcss": "^0.3.0",

### 打包分析工具

- "rollup-plugin-visualizer": "^5.9.2",

### 图片处理工具（可移除）

- "sharp": "^0.33.4",

### 用来优化 svg 文件的工具（可移除）

- "svgo": "^3.3.2",

### 用来压缩 js 文件的插件

- "terser": "^5.31.2",

### ts 支持

- "typescript": "^5.2.2",

### vite 插件，构建工具

- "vite": "^4.5.3",

#### 将静态资源压缩成.gz 格式等，主要就是对文件进行压缩（可移除）

- "vite-plugin-compression": "^0.5.1",

#### 用于处理 html 文件

- "vite-plugin-html": "^3.2.2",

#### 用于优化图片

- "vite-plugin-image-optimizer": "^1.1.8",

#### 拷贝项目中的静态资源到打包目录

- "vite-plugin-static-copy": "^0.17.0"
