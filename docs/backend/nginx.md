# nginx配置

## nginx常用

### http代理，反向代理
客户端请求到nginx，nginx将请求转发到后端服务器,并返回后端服务器的响应给客户端

### 负载均衡
nginx将请求按权重判断分发到多个后端服务器，实现负载均衡,比如下面配置：
``` conf
upstream backend {
    server backend1.example.com weight=5;
    server backend2.example.com weight=3;
    server backend3.example.com weight=2;
}
```

### web缓存
Nginx 支持 HTTP 响应的缓存，可以显著减少对外部服务器的请求次数，从而提高性能。配置如下：
``` conf
http {
    # proxy_cache_path 用于定义缓存区域的位置和配置参数
    # path 表示根目录
    # levels 表示目录层级结构 通常为 1:2 表示两级目录
    # max_size=size：指定缓存区域的最大大小（可选）。
    # keys_zone=zone_name:size：指定缓存键的存储区域及其大小。
    # inactive=time：指定缓存条目在未被使用时的存活时间。
    # proxy_cache_path path levels=levels [max_size=size] [keys_zone=zone_name:size] [inactive=time];
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m inactive=60m;# 60分钟未使用删除
    # proxy_temp_path 用于指定缓存过程中临时文件的存放位置。
    # 当缓存条目过大无法完全放入内存时，Nginx 会将部分数据写入临时文件。
    proxy_temp_path /var/tmp/nginx;

    server {
        location / {
            proxy_pass http://backend;

            # 缓存配置
            # 指定使用哪个缓存区，或者说缓存区的名称
            proxy_cache my_cache;
            # 当响应包含 Pragma:no-cache 头时，绕过缓存。
            proxy_cache_bypass $http_pragma;
            # 控制缓存的有效时间 表示状态码为200、302的缓存30分钟，404的缓存1分钟
            proxy_cache_valid 200 302 30m;
            proxy_cache_valid 404 1m;
            # 在某些情况下使用陈旧的缓存数据，这里表示 当请求发生错误、超时或无效头时、以及状态码为500、502、503、504的时候，使用陈旧的缓存数据。
            proxy_cache_use_stale error timeout invalid_header http_500 http_502 http_503 http_504;
            # 使用锁机制来避免缓存竞争
            proxy_cache_lock on;
            # 设置缓存条目至少被使用多少次才不会被移除
            proxy_cache_min_uses 2;
        }
    }
}
```

## nginx.conf 文件配置

### nginx常见的基本配置
1. $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
2. $remote_user ：用来记录客户端用户名称；
3. $time_local ：用来记录访问时间与时区；
4. $request ：用来记录请求的url与http协议；
5. $status ：用来记录请求状态；成功是200；
6. $body_bytes_sent ：记录发送给客户端文件主体内容大小；
7. $http_referer ：用来记录从那个页面链接访问过来的；
8. $http_user_agent ：记录客户端浏览器的相关信息；

:::tip
1. 每个指令结束后必须以分号结束，否则nginx将无法运行，另外配置文件对大小写不敏感
2. 惊群现象：一个网路连接到来，多个睡眠的进程被同时叫醒，但只有一个进程能获得链接，这样会影响系统性能。（没有配置过，）
:::

### nginx配置文件结构
```
... #全局块 : 配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成的worker process数等。
events { #events块 ：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接,是否开启多个网络连接序列化等。
   ...
}
http { #http块 : 可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
    ... #http全局块
    server { #server块 ：配置虚拟主机的相关参数，一个http块中可以有多个server块，每个server块相当于一个虚拟主机。
        ... #server全局块
        location [pattern] { #location块 ：配置请求的路由，以及各种页面的处理情况。
        ...
        }
        location [pattern] {
        ...
        }
    }
    server {
        ...
    }
    ... #http全局块
}
```

### nginx配置文件示例

<<< ./default.conf

::: tip
当前笔记，主要参考[菜鸟教程-Nginx配置详解](https://www.runoob.com/w3cnote/nginx-setup-intro.html)以及**项目的部分配置
:::
