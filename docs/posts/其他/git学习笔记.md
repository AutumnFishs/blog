---
title: git学习笔记
date: 2024-10-13
tags: [Git]
---
# git指令

1. 本地创建项目
2. git init 初始化 .git 文件
3. github 上创建一个项目，并复制仓库地址
4. git remote add origin 仓库地址 关联远程仓库
5. git add . 添加所有文件到暂存区
6. git commit -m 'first commit' 提交到本地仓库
7. git branch -M main 将当前分支重命名为 main
8. git push -u origin main 推送到远程仓库

## 创建分支

1. git branch dev 创建 dev 分支
2. git checkout dev 切换到 dev 分支
   
## 实现同时将代码推送到github和gitee上
我本地有个blog项目关联的github,现在想同时上传到gitee上
``` sh
# 查询关联地址
git remote -v
# 查询结果
# origin    https://github.com/yourusername/yourrepositoryname.git (fetch)
# origin    https://github.com/yourusername/yourrepositoryname.git (push)

# 添加gitee地址
git remote add gitee https://gitee.com/yourusername/yourrepositoryname.git

# 查询关联地址
git remote -v
# 查询结果
# origin    https://github.com/yourusername/yourrepositoryname.git (fetch)
# origin    https://github.com/yourusername/yourrepositoryname.git (push)
# gitee     https://gitee.com/yourusername/yourrepositoryname.git (fetch)
# gitee     https://gitee.com/yourusername/yourrepositoryname.git (push)

# 推送到gitee
git push gitee main

# 推送到github
git push origin main

# 同时推送多个URL
git remote set-url --add --push origin https://gitee.com/yourusername/yourrepositoryname.git

# 查询关联地址
# origin  https://github.com/AutumnFishs/blog.git (fetch)
# origin  https://gitee.com/heyingjie0805/blog.git (push)
# origin  https://gitee.com/heyingjie0805/blog.git (push)

# 清除关联地址
git remote remove origin

# 
```
