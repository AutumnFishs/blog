---
title: Tailwindcss学习笔记
date: 2024-01-14
abstract: tailwindcss写样式可以直接在html里面写，在vitepress中配和.md文件写html代码有一定的优势，不过需要配置tailwind @apply 实用类，不配置的话写起来html就是一坨，看起来非常的不舒服（个人意见）。vitepress中配置了tailwindcss，现在不需要了，还是沿用scss。删除配置前，先记录一下tailwindcss的配置，方便后续查阅。
tags: [Tailwindcss]
---
# Tailwindcss学习笔记
## 快速使用
1. 安装依赖
``` bash
npm install -D tailwindcss postcss autoprefixer
```
2. 初始化配置文件
```bash
npx tailwindcss init
```
3. 配置文件
- `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
// 配置使用tailwindcss的文件
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
- `postcss.config.js`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
4. 创建`tailwind.css`文件
``` css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 添加自己的样式 */
  .xxx {
    @apply text-center text-2xl text-red-500;
  }
}

```
5. 在项目如可文件中引入这个css文件即可在html中使用tailwindcss的样式了

## 结尾
- [tailwindcss官网](https://www.tailwindcss.cn/docs/installation/using-postcss)
- 后续有时间补充
