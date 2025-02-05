---
title: 通过Docker实现快速起一个gitlab
date: 2025-01-27
tags: [Docker,GitLab]
abstract:
---
# 通过Docker实现快速起一个gitlab
``` sh
docker run -d 
    -p 8080:80 
    -p 2222:22 
    --name gitlab-container 
    --restart always 
    --volume D:\gitlab\config:/etc/gitlab # 创建gitlab卷确保docker容器删除后数据也不会丢失
    --volume D:\gitlab\logs:/var/log/gitlab 
    --volume D:\gitlab\data:/var/opt/gitlab 
    gitlab/gitlab-ce:latest
```