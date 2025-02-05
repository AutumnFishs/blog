---
title: VitePress项目部署
date: 2024-10-23
abstract: 记录一下博客部署的过程，这里暂时使用vercel和github page两种方式，docker部署当时没想起来记录，以后再补上
tags: [Vitepress]
---
# 关于 vitePress 的部署
## vercel简单部署
1. vercel注册一下账号
![第1~4步](/vercel部署github项目1.png)
2. 添加一下github账号
3. 选中添加的github账号
4. 在需要构建的项目后点击import
![第5~8步](/vercel部署github项目2.png)
5. project name 命名
6. 根目录它也会自动识别
7. 构建设置把前两项选上
8. 环境变量暂时用不上就直接点击部署

在vercel.json中添加,禁止dev分支自动部署
```json
{
    "git": {
      "deploymentEnabled": {
        "dev": false
      }
    }
}
```


## github page 部署
1. 在项目中添加.github文件夹，创建workflows子文件夹，并创建deploy.yml部署文件

```yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
# 工作流命名
name: 部署vitePress到pages
# 触发器 ，这里是当我们像main分支push的时候触发工作流
on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
# 允许工作流程读取仓库的内容
  contents: read
# 使得工作流程可以部署构建结果到 GitHub Pages
  pages: write
# write 允许工作流程生成和使用 ID token 进行安全的身份验证
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
# 所有属于 pages 组的工作流程将会受到相同的并发控制规则
  group: pages
  # 即使有新的实例也不会打断当前工作流，如果为true的话，当前实例会停止运行，立刻执行新的实例
  cancel-in-progress: false
# 任务
jobs:
  # 构建工作
  build:
    # 运行环境
    runs-on: ubuntu-latest
    # 步骤
    steps:
    # 步骤名
      - name: 获取提交记录
        # repository: <your-repo> # 可选参数，如果要检出不同于当前工作流程所在仓库的其他仓库，可以使用此参数指定仓库名称。
        # ref: <branch-or-tag> # 可选参数，指定要检出的分支或标签，默认情况下，它会检出触发工作流程的分支
        # github自动化提供的操作，用于从 Git 仓库中检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 0获取所有git提交历史记录，默认为1，1表示只获取最近的一次提交记录
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: 设置 node.js环境
        uses: actions/setup-node@v4
        with:
        #安装的node版本
          node-version: 20
          # 缓存管理器设置为npm
          cache: npm # 或 pnpm / yarn
      - name: 设置 GitHub Pages 的环境
        uses: actions/configure-pages@v4
      - name: 安装项目依赖
      # 运行命令行指令，这里使用npm ci表示的是check install,比传统的npm install更快
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: 打包 vitePress
        # 运行vitePress中的构建指令
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
        # 将构建好的包上传为流水线的工件（artifact）
      - name: 上传 artifact
        uses: actions/upload-pages-artifact@v3
        with:
        # 可选参数 retention-days: 7 指定工件保留的天数。默认为 90 天。
        # 可选参数 if-no-files-found: warn（默认行为 发出警告）/ error (抛出错误，终止工作流程。)/ignore(忽略，继续执行。)指定如果没有找到任何文件时的行为。
        # 指定要上传的文件或目录的路径
            path: docs/.vitepress/dist

  # 部署工作
  deploy:
  # 定义一个环境变量，名称为 github-pages , 设置一个 URL变量，该变量引用了 deployment 步骤输出中的 page_url
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    # 表示当前这个部署工作依赖于 上面的 jobs build 构建完成后才会执行
    needs: build
    # 运行环境
    runs-on: ubuntu-latest
    # 部署
    name: Deploy
    steps:
      - name: 部署到github pages上
        id: deployment
        uses: actions/deploy-pages@v4
```
::: warning 注意
这里的文件名并不一定要命名为deploy，只要和文件里命名一样即可
:::