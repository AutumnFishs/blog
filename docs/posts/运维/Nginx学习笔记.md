---
title: Nginx学习笔记
date: 2025-01-13
abstract: 
    - 在学习背景方面，由于之前遇到页面无法正常显示的问题，公司运维团队检查配置后反馈是前端代码存在缺陷。领导也认为我在前端技术上的掌握还不够深入，未能透彻理解相关概念。面对这种情况，内心确实感到无奈;为了更好地解决问题，我决定去了解一下Nginx的相关配置。考虑到日常工作中接触Nginx的机会不多,为了便于日后复习和查阅，决定还是写一下笔记记录一下。
tags: [Nginx]
---
# Nginx学习笔记

## nginx常用

### http代理，反向代理
客户端请求到nginx，nginx将请求转发到后端服务器,并返回后端服务器的响应给客户端

### 负载均衡
nginx将请求按权重判断分发到多个后端服务器，实现负载均衡,比如下面配置：
``` txt
upstream backend {
    server backend1.example.com weight=5;
    server backend2.example.com weight=3;
    server backend3.example.com weight=2;
}
```

### web缓存
Nginx 支持 HTTP 响应的缓存，可以显著减少对外部服务器的请求次数，从而提高性能。配置如下：
``` txt
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
```txt
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
::: info nginx配置文件示例
```txt
# 在http区域内一定要添加下面配置, 支持websocket
# 这里是创建一个映射，当客户端发起请求的时候会把$http_upgrade的值设置为$connection_upgrade的值
# 这里表示 设置 变量$connection_upgrade的值为 $http_upgrade,并且当 $http_upgrade为 "" 时，
# $connection_upgrade的值为 close，默认情况下则是 $http_upgrade
map $http_upgrade $connection_upgrade {
	default upgrade;
	'' close;
}

# office
# 这里表示 设置 变量$this_host的值为 $http_host,并且当 $http_host为 "" 时，$this_host的值为 $host，默认情况下则是 $http_host
map $http_host $this_host {
    "" $host;
    default $http_host;
}
# 这里表示 设置 变量$the_scheme的值为 $http_x_forwarded_proto,并且当 $http_x_forwarded_proto为 "" 时，$the_scheme的值为 $scheme，默认情况下则是 $http_x_forwarded_proto
map $http_x_forwarded_proto $the_scheme {
default $http_x_forwarded_proto;
"" $scheme;
}
map $http_x_forwarded_host $the_host {
default $http_x_forwarded_host;
"" $this_host;
}
#upstream 定义一个上有服务器组，可以包含多个服务器，负载均衡的时候使用
# 这里只有一个服务器，当有多个服务器的时候，可以按照权重进行分配，权重越高，分配的越多
upstream xxx.com {   #此处是一个巨坑，这里的名字必须和server_name一致
    server xxx.xxx.xxx.xxx:8701 max_fails=1 fail_timeout=10s weight=1;
}

# 定义一个server，监听3001端口，当访问xxx.com的时候，会转发到上面定义的上游服务器组
server {
	listen 3001;
	server_name xxx.com;

	# 加速配置
    # 用于设置客户端请求体的最大允许大小,请求体超过这个大小，nginx会返回413错误
	client_max_body_size 1024M; 
    # 用于设置读取客户端请求体时的缓冲区大小。
    # 如果请求体的一部分无法放入缓冲区中，Nginx 将临时写入磁盘。这个设置影响了请求体的读取效率。
    client_body_buffer_size 1M; 
    # 用于设置客户端请求头的最大缓冲区大小。如果请求头过大，Nginx 可能会返回错误。
    client_header_buffer_size 8K;

#   gzip压缩配置

	gzip on;  # 启用 gzip 压缩功能
# 	gzip_comp_level  2;
    # 加速配置
    # 设置 gzip 压缩级别。gzip_comp_level 的范围是 1 到 9，其中 1 表示最快的压缩速度（但压缩率较低），
    # 9 表示最高的压缩率（但压缩速度较慢）。默认值通常是 6。这里设置为 5，表示一个适中的压缩级别。
	gzip_comp_level  5; 
    # 设置 gzip 压缩适用于代理请求。gzip_proxied 指令可以指定 gzip 压缩是否应用于经过代理的请求。
    # any 表示对所有类型的代理请求都启用 gzip 压缩。
	gzip_proxied any;

    # 设置最小响应长度以启用 gzip 压缩。只有响应体大小超过 gzip_min_length 指定的字节数时，
    # 才会启用 gzip 压缩。这里设置为 1000 字节。
	gzip_min_length  1000;
# 	gzip_types  text/xml text/css;

	# 加速配置
    # 指定哪些 MIME 类型的内容应被 gzip 压缩
	gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 设置 gzip 压缩使用的 HTTP 版本，这里设置为 1.1，表示使用 HTTP/1.1 版本。
	gzip_http_version 1.1;
    # 设置是否在 Vary 响应头中包含 Accept-Encoding。这允许下游缓存系统根据客户端是否支持 gzip 压缩来缓存不同的响应。
	gzip_vary  on;
    # 禁用对特定用户代理的 gzip 压缩。这里禁用了对 Internet Explorer 4 到 6 版本的支持，
    # 因为这些浏览器在处理 gzip 压缩时可能存在兼容性问题。
	gzip_disable "MSIE [4-6] \.";

    # 证书配置 for office (指定证书所在位置)
    ssl_certificate /usr/share/nginx/html/xxx/xxx.com.crt;
    ssl_certificate_key /usr/share/nginx/html/xxx/xxx.com.key;

    # 路由块
	location /ims {
        
        # 配置别名，将请求的路径映射到指定的目录，这里是当请求路径为 /ims 时，
        # 将请求映射到 /usr/share/nginx/html 目录
	    alias /usr/share/nginx/html;

        # 如果使用 root 指令，Nginx 会将所有请求解析为相对于 root 目录的路径。
        # 在这个例子中，alias 更适合用于指定文件的绝对路径。
# 		root /usr/share/nginx/html/;

        # index指令指定了索引文件列表，当请求目录时，Nginx 会尝试按顺序返回这些索引文件之一。
        # 在这个例子中，Nginx 会首先尝试返回 index.html，如果不存在，则尝试返回 index.htm。
		index index.html index.htm;

        # try_files 这条指令告诉 Nginx 按照以下顺序处理请求：
        # 如果请求的文件或目录 $uri 存在，则直接返回该文件或目录。
        # 如果 $uri 是一个目录，则尝试返回 $uri/（即附加斜杠）。
        # 如果 $uri 和 $uri/ 都不存在，则尝试返回 /index.html。
        # 如果以上所有尝试都失败，则返回 404 错误。
		try_files $uri $uri/ /index.html =404;

        # add_header指令用于设置 HTTP 响应头，以提高安全性。
        # X-Frame-Options 用于防止点击劫持攻击
        # Content-Security-Policy 用于限制哪些源可以嵌入页面。

        # 设置 X-Frame-Options 头，防止点击劫持
        # add_header X-Frame-Options SAMEORIGIN;

        # 在代理请求时隐藏 X-Frame-Options 头
        # proxy_hide_header X-Frame-Options;

        # frame-ancestors 指令用于指定哪些来源的页面可以将当前页面嵌入到 <iframe>、<frame> 或 <object> 标签中。
        # self 表示只允许当前域名嵌入页面。
        # add_header Content-Security-Policy "frame-ancestors 'self' https://xxx.com 
        # https://ips.inspuriip.com http://localhost:5002 http://gctest.yunzhouiip.com:8018 
        # http://sdscpre.inspuriip.com:8081  http://10.73.40.118:5002/;";
	}

	location /ims/api {
        # 代理到的请求路径
		proxy_pass http://backend:123/api;

        # 响应时长最大为 300 秒，超过这个时间请求超时
		proxy_read_timeout 300s;

        # proxy_set_header 设置了一系列HTTP头传递到后端服务器，这样后端服务器可以知道原始请求的主机名、
        # 真实客户端IP以及通过任何代理传递的其他IP地址。

        # Host 为主机名
		proxy_set_header Host $host;

        # X-Real-IP 为 客户端的真实IP
		proxy_set_header X-Real-IP $remote_addr;

        # X-Forwarded-For 为 请求头中的 X-Forwarded-For，用于记录客户端IP地址
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 指定了使用HTTP/1.1版本进行代理连接。
		proxy_http_version 1.1;

        # Upgrade 和 Connection 头用于处理WebSocket连接。
        # Upgrade 头用于升级HTTP连接到WebSocket连接。
		proxy_set_header Upgrade $http_upgrade;

        # Connection 头用于保持连接打开，直到WebSocket连接关闭。
		proxy_set_header Connection $connection_upgrade;

        # 设置客户端请求体的最大大小为 50MB
		client_max_body_size 50m;

        # 设置响应头 Access-Control-Allow-Origin 值为 $host
		add_header Access-Control-Allow-Origin $host;

        # 设置响应头 X-Frame-Options 值为 SAMEORIGIN
		add_header X-Frame-Options SAMEORIGIN;
	}
    location /ims/office/ {
        proxy_pass http://xxx.xxx.xxx.xxx:8701/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        # proxy_set_header Host $proxy_host;
        proxy_set_header X-Forwarded-Host $the_host;

        # 设置X-Forwarded-Proto HTTP头部，该头部包含了客户端请求所使用的协议（HTTP 或 HTTPS）
        proxy_set_header X-Forwarded-Proto $the_scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
:::

当前笔记，主要参考[菜鸟教程-Nginx配置详解](https://www.runoob.com/w3cnote/nginx-setup-intro.html)以及**项目的部分配置
