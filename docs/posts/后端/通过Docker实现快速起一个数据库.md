---
title: 通过Docker实现快速起一个数据库
date: 2025-01-23
abstract: 搭建博客后台管理时，存放文章需要使用数据库存放，这里通过docker快速起一个mysql并通过adminer实习图形化界面管理。
tags: [Docker,数据库]
---
# 通过Docker实现快速起一个数据库

## docker拉取镜像并创建容器
1. 拉取mysql8镜像、 phpmyadmin镜像
   ``` sh
   docker pull mysql:8.0
   docker pull phpmyadmin
   ```
2. 创建自定义网络
   ``` sh
   docker network create mysql-phpmyadmin-network
   ```
3. 启动mysql容器
   ``` sh
   # -e MYSQL_ROOT_PASSWORD=admin123 设置环境变量
   docker run --name mysql-container --network mysql-phpmyadmin-network -e MYSQL_ROOT_PASSWORD=admin123 -p 3306:3306 -d mysql:8.0
   ```
4. 启动 phpmyadmin 容器
   ``` sh
   # -p 宿主机端口：容器端口 映射
   # -d 镜像 后台运行 
   # run 运行 
   # --name 容器命名
   # --network 所在网络
   docker run --name phpmyadmin-container --network mysql-phpmyadmin-network -e PMA_HOST=mysql-container -p 8001:80 -d phpmyadmin:latest
   ```
5. 到这就可以通过`http:localhost:8001`访问数据库了
::: warning 注意
mysql使用3306作为默认端口，如果本地端口被占用的话，可以在管理员权限下
``` sh
# 查询3306端口信息
netstat -aon | findstr :3306
# 拿到PID，通过它终止进程
taskkill /PID 7528 /F
```
主要是我本地安装了mysql一直没有关掉，在使用docker起容器的时候给我整出了报错...
:::

## nest项目中集成数据库
prisma可以实现对数据库的快速操作，不再需要sql语句进行操作数据库.
[Nest中集成Prisma](./Nest中集成Prisma.md)