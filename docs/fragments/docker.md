# 在本地 docker 上部署项目运行时遇到的一些问题

## 使用 docker + ngrok 部署项目

1. `docker` 镜像源问题，配置`registry.docker-cn.com`镜像源
   - 使用`nslookup registry.docker-cn.com`DNS 解析正常(?不知道为啥)
   - 解决方法：开通阿里云容器镜像服务，配置生成的镜像加速地址
   - 然后登录`docker login --username=yourname 阿里云镜像地址`
   - 然后就可以使用 `dockerfile` 构建镜像了(有个问题，有些镜像（比如 `node:18-alpine`）不知道为啥，直接构建会报错，需要先手动拉取镜像，然后构建)
2. `vitepress` 中用到了 `git` 去获取 `commit` 信息，但是 `docker` 容器中并没有 `git`，所以需要安装 `git`
   - 解决方法：在 `dockerfile` 中添加`RUN apk add --no-cache git`
3. 配置好 `dockerfile` 文件后，使用`docker build -t blog .`构建镜像，然后使用`docker run -d -p 3000:3000 blog`运行容器，然后访问`http://localhost:3000`就可以看到博客了
4. `docker` 安装 `ngrok`,`docker pull ngrok/ngrok`,运行镜像`docker run --net=host -it -e NGROK_AUTHTOKEN=yourngrokauthtoken ngrok/ngrok:latest http --url=tightly-gorgeous-asp.ngrok-free.app 8080`,这里我使用的是免费版，域名是自动生成的，然后 `blog` 运行在 `docker80` 端口暴露在 8080，所以这里运行 `ngrok` 向外暴露的端口也要设置为 8080，然后访问`http://tightly-gorgeous-asp.ngrok-free.app`就可以看到博客了（访问速度也就和 `github page`速度差不多，甚至还要慢，不花钱好像有点不太现实）
5. `docker-compose.yml` 配置文件遇到一个问题，单独运行 `blog`、`ngrok` 镜像时可以正常运行，但是配置 `docker-compose.yml` 后运行 `blog` 可以正常运行，`ngrok` 镜像就运行不起来，初步推测是 `command` 变量的问题，可能是静态域变量的问题
   - 修复：`network_mode: host` # 使用 `host` 模式，使 `ngrok` 容器可以直接访问主机网络
   - `stdin_open: true` # 等价于 -i # 保持标准输入开启，可以接收用户输入
   - `tty: true` # 等价于 -t # 分配一个伪终端，可以与容器进行交互
   - 然后就可以正常运行了
6. 配置`.dockerignore`文件，避免将不必要的文件复制到镜像中，加快`dockerfile`构建速度

## 运行部署 blog

1. `docker-compose down`停止之前运行的容器
2. `docker build -t my-blog:latest .`确保每次构建镜像时，镜像名和版本号都是最新的
   - 执行完后会创建一个新的镜像，镜像名为 `my-blog`，版本号为 `latest`；它会替换原来的镜像，但是不会删除原来的镜像，原来的镜像会变为` 未标记的悬空镜像``<none>:<none> `
3. `docker-compose up -d`后台运行容器
