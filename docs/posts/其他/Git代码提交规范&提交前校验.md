---
title: Git代码提交规范&提交前校验
date: 2025-03-07
tags:
  - husky
  - lint-staged
  - commitlint
abstract: 本文主要记录Git代码提交规范配置，以及提交前eslint校验。
---

# Git代码提交规范&提交前校验

## Husky
[https://github.com/typicode/husky/releases/tag/v9.0.1](https://github.com/typicode/husky/releases/tag/v9.0.1)
::: info Husky是一个Git钩子管理器
它允许你在Git的不同生命周期钩子上运行自定义脚本。

``` sh
# 安装 husky
npm i husky -D

# 初始化 .husky文件夹
npx husky init
```

初始化文件夹后会生成pre-commit文件，这个文件会在git commit 直接执行，默认初始化的时候生成的是npm test；可以在这里配置需要执行的命令行指令比如

```
npx lint 
```

:::

## Commitizen
[https://github.com/commitizen/cz-cli](https://github.com/commitizen/cz-cli)
Commitizen用来规范化git提交代码的提交信息；
一般直接使用 git commit -m '提交信息'是没有限制的，可以随意书写，而Commitizen可以帮我们规范化提交信息
比如：
![提交规范](/提交规范.png)
``` sh
# 安装 commitizen
npm install commitizen -D

# 初始化
commitizen init cz-conventional-changelog --save-dev --save-exact
```

初始化commitizen后会在package.json中生成
``` json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```
如果需要汉化，可以安装一下汉化包cz-conventional-changelog-zh；然后修改一下规范化依赖文件
``` josn
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog-zh"
    }
  }
}
```
## lint-staged
lint-staged 可以帮我们在git提交前实现对代码的校验，格式化；
``` sh
# 安装
npm i lint-staged -D
```
在package.json中配置一下需要校验的文件
``` json
{
  "lint-staged": {
    "docs/**/*.{jsx,txs,ts,js,json,css,vue}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```
这里执行指令格式化的对象是docs文件夹下的{jsx,txs,ts,js,json,css,vue}，会先执行prettier --write，在修复不符合eslint规范的代码；之前配置的pre-commit执行的脚本现在也可以改为npx lint-staged(默认项目中有eslint、prettier依赖)
``` 
# .husky/pre-commit

npx lint-staged
```
