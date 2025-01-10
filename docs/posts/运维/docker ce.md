---
title: docker ce
date: 2023-03-29
tags:
 - 运维
 - docker
---
# CentOS7.8安装docker ce

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
