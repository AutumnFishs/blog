---
hidden: true
---
# 关于前段时间网卡驱动损坏导致我不得重置电脑而重新配置常用的配置
2024.9.27 电脑无线网卡驱动、以太网网卡驱动异常，无法连接网络，更换驱动后还是不好使，迫不得已我重置了电脑；这不可避免的要重新配置我的环境，正好把以前的配置记录一下，方便以后查阅。
## 关于node环境
1. 使用nvm作为版本控制器，安装nvm[https://nvm.uihtm.com/](https://nvm.uihtm.com/)
    - nvm常用指令
    ```bash
    nvm install 版本号 # 安装指定版本
    nvm use 版本号 # 使用指定版本
    nvm ls # 查看已安装的版本
    nvm uninstall 版本号 # 卸载指定版本
    nvm list available  # 显示可以安装的所有node.js的版本
    nvm current # 显示当前使用的node.js版本
    ```
2. 使用nrm作为镜像源控制器
    - 直接通过npm全局安装nrm
    ``` bash
    npm i nrm -g
    ```
    - nrm 常用指令
    ``` bash
    nrm ls # 查看所有可用的镜像源
    nrm use 镜像源别名 # 使用指定镜像源
    nrm add 镜像源别名 url # 添加新的镜像源
    nrm del 镜像源别名 # 删除指定的镜像源
    nrm current # 查看当前使用的镜像源
    ```
3. vscode常用插件
    - Chinese (Simplified) (简体中文)
    - Ayu (vscode主题)
    - vscode-icons (vscode图标)
    - Vue-Official (Vue官方插件)
    - CodeGeeX (代码生成插件)
    - ESLint (代码规范检查)
    - Prettier - Code formatter (代码格式化)
    - Auto Rename Tag (自动重命名标签)
    - A-super-comprehensive(代码补全)
    - any-rule (正则表达式查询)
    - ES7 React/Redux/GraphQL/React-Native snippets (react代码片段)
    - Image Preview (图片预览)
    - Live Server (实时预览)
    - Open in Browser (在浏览器中打开)
    - Open In Default Browser (在默认浏览器中打开)
4. host配置公司相关ip地址映射
5. git 配置ssh密钥
6. vscode 设置 自动保存（没有自动保存很不习惯）

