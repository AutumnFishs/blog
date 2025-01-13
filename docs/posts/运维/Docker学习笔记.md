---
title: Docker学习笔记
date: 2024-07-03
tags: [Docker]
---
# docker 的使用

## docker Desktop 安装

1. `docker -v` 查看版本
2. `docker info` 查看 docker 信息
3. `docker ps` 查看是否运行，可能会报错提醒安装 wsl(wsl 是 window 中运行 linux 的子程序)
   - 安装/更新 `wsl：wsl --update`
4. `docker pull nginx` 拉取 nginx 镜像
   - 拉取失败：docker hub 无法访问，需要配置镜像源
   - 配置镜像源：在设置里找到 Docker Engine，然后配置
   ```json
   {
     "builder": {
       // 构建器配置
       "gc": {
         // 构建器垃圾回收配置
         "defaultKeepStorage": "20GB", // 默认保留存储量,超过该存储量后,构建器会自动清理旧的构建缓存
         "enabled": true //默认开启构建器垃圾回收
       }
     },
     "experimental": false, //控制是否启用实验性功能。
     "registry-mirrors": [
       //拉取镜像的镜像加速器 URL 列表
       "https://get.docker.com",
       "https://download.docker.com",
     ]
   }
   ```
   - 配置好后重新运行，ping url 测试一下是否可以正常访问
   - docker 镜像源最近不生效
   - 暂时使用 `docker pull docker.fxxk.dedyn.io/library/nginx` 指定源拉取镜像
   - 有时间可以尝试 搭建自己的镜像源 [https://github.com/Mingxiangyu/CF-Workers-docker.io](https://github.com/Mingxiangyu/CF-Workers-docker.io)
   
## docker 基本命令
- `docker run -d -p 8080:80 --name docker-nginx nginx` 启动一下镜像 run 运行，-d 后台运行，-p 端口映射 这里是将容器的 80 端口映射到主机的 8080 端口，--name docker-nginx 创建一个名为 docker-nginx 容器，nginx 在这个容器里运行 nginx
- `docker stop docker-nginx` 停止容器运行
- `docker ps` 查看正在运行的容器
- `docker ps -a` 查看所有容器
- `docker rm` 容器名称或者 Id 删除容器（删除前先 docker stop 停止运行该容器）
- ``


## CentOS7.8安装docker ce

在 CentOS 7.6 64-bit 上安装 Docker 可以按照以下步骤进行。请注意，这里提供的步骤适用于安装 Docker 的稳定版本。

### 准备工作

1. **更新系统**

   首先确保你的系统是最新的。打开终端并运行以下命令来更新现有的软件包：
   ```bash
   sudo yum update -y
   ```

2. **移除旧版 Docker（如果已安装）**

   如果你的系统上已经安装了旧版本的 Docker，你需要先卸载它们：
   ```bash
   sudo yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-engine
   ```

3. **安装必要的依赖**

   安装一些必要的工具，比如 `yum-utils`，它提供了 `docker-ce` 安装所需的 `yum-config-manager` 工具：
   ```bash
   sudo yum install -y yum-utils
   ```

### 安装 Docker

1. **设置 Docker 的仓库**

   使用 `yum-config-manager` 命令来添加 Docker 的官方仓库：
   ```bash
   sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   ```

2. **安装 Docker CE**

   接下来，安装最新版本的 Docker CE：
   ```bash
   sudo yum install docker-ce docker-ce-cli containerd.io
   ```

3. **启动 Docker**

   安装完成后，启动 Docker 服务并将其设置为开机自启：
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

4. **验证安装**

   最后，通过运行一个测试容器来验证 Docker 是否正确安装：
   ```bash
   sudo docker run hello-world
   ```

### 其他配置

- **用户权限**

  默认情况下，只有 root 用户或属于 docker 组的用户才能运行 Docker 命令。为了让你的非 root 用户能够运行 Docker 命令，可以将该用户添加到 docker 组中：
  ```bash
  sudo usermod -aG docker your-user
  ```
  之后，你需要注销并重新登录，以便使组更改生效。

- **防火墙配置**

  如果你的服务器启用了防火墙，你可能需要配置防火墙规则来允许 Docker 容器访问网络。这通常涉及到允许特定端口或服务通过防火墙。
