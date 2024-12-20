---
hidden: true
tags: ["其他"]
---

# 工作环境配置

## 配置 node 环境

1. 使用 nvm 作为版本控制器，安装 nvm[https://nvm.uihtm.com/](https://nvm.uihtm.com/)

   - nvm 常用指令

   ```bash
   nvm install 版本号 # 安装指定版本
   nvm use 版本号 # 使用指定版本
   nvm ls # 查看已安装的版本
   nvm uninstall 版本号 # 卸载指定版本
   nvm list available  # 显示可以安装的所有node.js的版本
   nvm current # 显示当前使用的node.js版本
   ```

   - 常用的几个node版本（适配公司项目的几个版本）
     - 20.13.1
     - 18.20.2
     - 16.14.0
     - 16.13.0
     - 14.21.1

2. 使用 nrm 作为镜像源控制器

   - 直接通过 npm 全局安装 nrm

   ```bash
   npm i nrm -g
   ```

   - nrm 常用指令

   ```bash
   nrm ls # 查看所有可用的镜像源
   nrm use 镜像源别名 # 使用指定镜像源
   nrm add 镜像源别名 url # 添加新的镜像源
   nrm del 镜像源别名 # 删除指定的镜像源
   nrm current # 查看当前使用的镜像源
   ```

   - 常用的镜像源（不包括公司镜像源）
     - npm ---------- https://registry.npmjs.org/
     - yarn --------- https://registry.yarnpkg.com/
     - tencent ------ https://mirrors.cloud.tencent.com/npm/
     - cnpm --------- https://r.cnpmjs.org/
     - taobao ------- https://registry.npmmirror.com/
     - npmMirror ---- https://skimdb.npmjs.com/registry/
     - huawei ------- https://repo.huaweicloud.com/repository/npm/

3. vscode 常用插件

   - 主题样式

     - Ayu (vscode 主题)
     - vscode-icons (vscode 图标)
     - Highlight Matching Tag（高亮匹配标签）

   - 代码格式化

     - ESLint (代码规范检查)
     - Prettier - Code formatter (代码格式化)
     - Code Spell Checker（代码拼写检查）
     - SVG（svg格式化）

   - 代码补全

     - Auto Rename Tag (自动重命名标签)
     - A-super-comprehensive(代码补全)
     - JSX HTML <tags/>（JSX标签自动补全）
     - Path Autocomplete（引入文件路径自动补全）
     - CodeGeeX (代码生成插件)
     - Tailwind CSS IntelliSense（tailwind代码提示）

   - react 插件

     - ES7 React/Redux/GraphQL/React-Native snippets (react 代码片段)
     - Reactjs code snippets（react代码片段）

   - vue 插件

     - Vue-Official (Vue 官方插件)
     - Vue VSCode Snippets（vue代码片段）

   - 图片预览

     - Image Preview (图片预览)
     - SVG Previewer（svg预览）

   - 其他插件

     - Chinese (Simplified) (简体中文)
     - any-rule (正则表达式查询)
     - Live Server (实时服务器)
     - Open in Browser (在浏览器中打开)
     - Open In Default Browser (在默认浏览器中打开)

4. hosts 配置公司相关 ip 地址映射（加速访问,不配置可能无法访问）

5. 安装 git

   - git 配置 ssh 密钥

6. vscode 设置 自动保存（没有自动保存很不习惯）

7. vscode 常用的快捷键
   - ctrl+k ctrl+j：当前文件代码块完全展开
