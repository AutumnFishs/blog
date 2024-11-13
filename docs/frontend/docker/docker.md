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

