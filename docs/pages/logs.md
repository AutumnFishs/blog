---
layout: doc
title: 日志
---
# 博客搭建日志

## 更新计划
1. 分类页面实现
2. 关于页面自定义
3. 日志页面自定义
4. 导航页面样式设计
5. 首页样式设计
6. doc页面上一页下一页功能实现（实现）
7. 回到顶部功能实现（实现）
8. 图片预览功能实现
9. 评论功能支持（考虑使用`giscus`，样式希望重新实现）
10. 后续移除项目中的 `tailwindcss`样式，使用 `sass`
11. 搜索功能实现（且搜索样式变更）
12. 博客页面样式优化
13. 字体样式优化


## 更新日志
### 2025-01-13
  - 主要变更：
    - 主页文章按时间降序
    - 文章页面自定义上一页下一页功能
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
    
  