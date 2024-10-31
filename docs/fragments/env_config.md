---
hidden: true
tags: ["其他"]
---

# 工作环境配置

## 关于 node 环境

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
3. vscode 常用插件

   - 主题

     - Ayu (vscode 主题)
     - vscode-icons (vscode 图标)

   - 代码格式化

     - ESLint (代码规范检查)
     - Prettier - Code formatter (代码格式化)

   - 代码补全

     - Auto Rename Tag (自动重命名标签)
     - A-super-comprehensive(代码补全)
     - CodeGeeX (代码生成插件)

   - react 插件

     - ES7 React/Redux/GraphQL/React-Native snippets (react 代码片段)

   - vue 插件

     - Vue-Official (Vue 官方插件)

   - 其他插件
     - Chinese (Simplified) (简体中文)
     - any-rule (正则表达式查询)
     - Image Preview (图片预览)
     - Live Server (实时预览)
     - Open in Browser (在浏览器中打开)
     - Open In Default Browser (在默认浏览器中打开)

4. hosts 配置公司相关 ip 地址映射（加速访问,不配置可能无法访问）

5. 安装 git

   - git 配置 ssh 密钥

6. vscode 设置 自动保存（没有自动保存很不习惯）
