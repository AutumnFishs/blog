---
title: Docker 部署博客
date: 2023-04-17
tags: ["Docker"]
---
# Docker 部署 vitepress 博客

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

## docker 指令
docker login --username=yourname 镜像源

docker pull 镜像 拉取镜像
docker pull crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest 拉取远程docker hub 的镜像仓库

docker run 镜像/容器 启动
docker run -d -p 8080：3000(映射端口) image/容器：标签

docker tag 打标签

docker push 推送到仓库

docker rmi 删除本地镜像

docker ps 查看运行的容器

docker stop 停止容器运行

docker rm 删除容器


## 本地镜像推送 docker hub 私有仓库
1. **查看本地镜像**
docker images

2. **给镜像打标签**
docker tag my-blog:latest crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest

3. **登录阿里云私有仓库**
docker login crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com

4. **推送镜像**
docker push crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest

5. **拉取遠程images**
   docker pull crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest
6. **修改tag**
   docker tag crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest my-blog:v1.0
7. **刪除原images**
   docker rmi crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/hyj_docker_store/my-blog:latest

## docker ce 安装
 
### 准备工作

1. **更新系统**：
   ```bash
   sudo yum update -y
   ```

2. **安装必要的依赖**：
   ```bash
   sudo yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

### 安装Docker CE

1. **设置Docker的yum仓库**：
   ```bash
   # 安装前配置国内镜像源
   sudo yum install -y yum-utils
   sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   sudo yum makecache fast
   ```

2. **安装Docker CE**：
   ```bash
   sudo yum install -y docker-ce docker-ce-cli containerd.io
   ```

3. **启动Docker服务**：
   ```bash
   sudo systemctl start docker
   ```

4. **设置Docker开机自启**：
   ```bash
   sudo systemctl enable docker
   ```

5. **验证Docker安装**：
   ```bash
   sudo docker run hello-world
   ```

## 安装Kubernetes
1. **添加Kubernetes的yum仓库：**
``` bash
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
   enabled=1
   gpgcheck=1
   repo_gpgcheck=1
   gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
   EOF
```
2. **安装Kubernetes组件：**
``` bash
   sudo yum install -y kubectl-1.26.3 kubeadm-1.26.3 kubelet-1.26.3
```
3. **启动并启用kubelet服务：**
```bash
   sudo systemctl start kubelet
   sudo systemctl enable kubelet
```

4. **禁用Swap分区：**
Kubernetes在某些情况下要求关闭Swap分区。你可以通过以下命令临时关闭Swap：
```bash
   sudo swapoff -a
```
若要永久关闭Swap，请编辑/etc/fstab文件，注释掉或删除与Swap相关的行。
5. **加载必要的内核模块：**
```bash
   sudo modprobe br_netfilter
```
6. **配置内核参数：**
编辑/etc/sysctl.conf文件,添加或修改以下内容:(网络桥接、网络地址转换)
```bash
# ipv6
net.bridge.bridge-nf-call-ip6tables = 1
# ipv4
net.bridge.bridge-nf-call-iptables = 1
```
7. **应用更改：**
```bash
# 更新上面的配置，使之生效
sudo sysctl -p
```
8. **初始化Kubernetes集群**????????
初始化Kubernetes主节点：
```bash
# 检查 containerd 是否运行
sudo systemctl status containerd

# 编辑 containerd 配置文件
# 打开 /etc/containerd/config.toml 文件，确保以下内容存在并正确配置：
# k8s需要 启用cri
# disabled_plugins = ["cri"]
[plugins."io.containerd.grpc.v1.cri".registry.mirrors]
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
    endpoint = ["https://crpi-ube8pjvmnwjq8o5k.cn-hangzhou.personal.cr.aliyuncs.com/"]

# 重启containerd
sudo systemctl restart containerd

# 配置 crictl 配置文件 /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false

# 查看镜像是否安装成功
crictl images

# 我的内网ip地址（10.1.20.15）
kubeadm init --image-repository registry.aliyuncs.com/google_containers  --kubernetes-version v1.26.3 --apiserver-advertise-address 10.1.20.15 --pod-network-cidr=10.0.0.0/16 --token-ttl 0
```
这个命令会输出一些重要的信息，包括如何配置kubectl命令行工具以及如何加入其他节点到集群中。
9. **配置kubectl：**
根据kubeadm init命令的输出，配置kubectl命令行工具：
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
10. **安装Pod网络插件：**
Kubernetes集群需要一个Pod网络插件才能使Pod之间相互通信。这里以Flannel为例：
```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
加入其他节点
如果你有额外的节点要加入到集群中，可以在每个节点上执行kubeadm init命令输出中的kubeadm join命令。

11. 验证集群状态
检查节点状态：
bash
kubectl get nodes
12. 检查Pod状态：
bash
kubectl get pods --all-namespaces
以上步骤应该能够帮助你在CentOS上成功安装和配置Docker CE和Kubernetes。如果有任何问题或错误，请确保仔细检查每一步的输出，并参考官方文档获取更多帮助。