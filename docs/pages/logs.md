---
layout: doc
title: 日志
---
# 博客搭建日志

## 更新日志
### 2025-02-21
  - 主要变更：
    - 移除侧边栏
    - 重构上页下一页
    - fix：打包构建无法退出进程
      - 原因：定时器没有放在生命周期钩子里
      - 解决：间歇定时器移动到onMounted钩子里，并在销毁期销毁定时器
### 2025-01-14
  - 主要变更：
    - 侧边栏自定义实现
  - 需要修复的bug：
    - gitHub Actions自动部署工作流在自动构建完成后没有自动退出，导致构建时间过长，构建失败；临时解决方案：build构建设置超时时间，强制退出进程
### 2025-01-13
  - 主要变更：
    - 主页文章按时间降序
    - 文章页面自定义上一页下一页功能
    - 新增`tdesign-icons-vue-next`图标库，`tdesign-vue-next`库(目前主要使用图片预览功能组件),实现图片预览功能
    - 移除`element-plus`库、`@element-plus/icons-vue`图标库、`medium-zoom`图片预览插件、`vue-canvas-nest`背景插件、`canvas-confetti`撒花插件、`vitepress-plugin-search`&`flexsearch`离线搜索插件（使用本地搜索）
### 2025-01-12
  - 主要变更：
    - 回到顶部功能添加
    - ttf字体压缩为woff2格式，优化字体加载速度
  - 需要修复的bug：
    - 首页刷新页面字体正常，但切换到其他页面刷新后字体样式丢失(已修复)
  - 修复bug：
    ::: info BUG：修复其他页面刷新后字体样式丢失
    原因：主要是字体引入的文件地址没有绝对路径，导致刷新后无法找到字体文件
    - 修复前
    ``` css
    @font-face {
      font-family: 'HongLeiBanShuJianTi';
      src:
        url('./font/HongLeiBanShuJianTi-2.woff2') format('woff2'),
        url('./font/HongLeiBanShuJianTi-2.ttf') format('truetype');
    }
    ```
    - 修复后
    ``` css
    @font-face {
      font-family: 'HongLeiBanShuJianTi';
      src:
        url('/font/HongLeiBanShuJianTi-2.woff2') format('woff2'),
        url('/font/HongLeiBanShuJianTi-2.ttf') format('truetype');
    }
    ```
    :::
### 2025-01-11
  - 主要变更：
    - 字体样式更新,右上角导航栏标题使用`HongLeiBanShuJianTi`,其余博客字体样式使用`YangRenDongZhuShiTi-Light`
  
### 2025-01-10
  - 主要变更：
    - 主题变更由`sugarat/theme`变更为自定义实现
    - 博客迁移到posts目录下，方便后续实现归档、分类、标签等功能
    - 首页样式实现
    - 借鉴`ivestszheng.github.io`实现首页列表、归档页面、标签页面（主要是通过`createContentLoader`vitepress内置api实现获取文章信息）
  - 需要修复的bug：
    - 主页面在`width:100vw`样式下始终会有横滚无法移除（已修复）
  - 备注：主要是之前的主题感觉有点花哨，想做一个简约风的主题
    
  