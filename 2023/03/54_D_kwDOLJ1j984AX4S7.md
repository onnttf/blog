---
author: Zhang Peng
category: 🙌 Show and tell
labels: Docker
discussion: https://github.com/onnttf/blog/discussions/54
updatedAt: 2024-04-08T01:04:58+08:00
---

# 如何构建 docker 镜像

## 镜像是什么

要构建一个镜像，首先要清楚镜像是什么。[docker 文档](https://docs.docker.com/get-started/overview/) 对镜像的解释如下：

> An image is a read-only template with instructions for creating a Docker container. Often, an image is based on another image, with some additional customization. For example, you may build an image which is based on the ubuntu image, but installs the Apache web server and your application, as well as the configuration details needed to make your application run.

简单来讲就是：镜像就是一个带有创建 `Docker` 容器指令的**只读模板**。镜像中可以包含着系统、应用及应用配置等。

## 如何构建镜像

构建镜像的方法有：

1. 使用 `Dockerfile` 构建镜像（推荐）
2. 基于已有镜像构建镜像
3. 基于已有容器构建镜像

### 使用 `Dockerfile` 构建镜像（推荐）

`Dockerfile` 是一个普通的文本文件，其中包含构建镜像所需的一组[指令](https://docs.docker.com/engine/reference/builder/)。当我们编写完成后，使用 [docker build](https://docs.docker.com/engine/reference/commandline/build/) 命令来构建镜像，这个命令会读取 `Dockerfile` 中的指令来自动构建镜像。

口说无凭，这里我们以创建一个 `vim` 镜像举例，完成一次镜像的构建。

#### 创建 Dockerfile

步骤 1、创建一个文件夹 `vim` 用于存储镜像相关的文件

```shell
➜  Desktop mkdir vim && cd vim
➜  vim
```

步骤 2、创建一个名字为 `Dockerfile` 的文件，里面填充我们构建镜像所需的指令。

```shell
➜  vim touch Dockerfile
```

下面是构建一个 `vim` 镜像的 `Dockerfile`，可以将它直接复制到我们创建的 `Dockerfile` 文件中。

```shell
# 指定基础镜像
FROM ubuntu:latest
# 镜像作者及联系方式
LABEL author="zhangpeng" \
      mail="onnttf@gmail.com"
# 更新源
RUN sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
RUN sed -i 's/security.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
# 更新可用包
RUN apt update \
    && apt full-upgrade -y
# 安装 vim
RUN apt -y install vim
# 清理 apt 缓存
RUN apt autoremove -y \
    && apt clean -y \
    && rm -rf /var/lib/apt/lists/*
```

`Dockerfile` 支持的指令还有很多，例如：`CMD`、`ENV`、`ENTRYPOINT` 等，有兴趣可以去[官方文档](https://docs.docker.com/engine/reference/builder/)中学习。

#### 构建镜像

使用 `docker build` 命令构建镜像。

```shell
➜  vim docker build -t vim .
[+] Building 0.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile               0.0s
 => => transferring dockerfile: 37B                                0.0s
 => [internal] load .dockerignore                                  0.0s
 => => transferring context: 2B                                    0.0s
 => [internal] load metadata for docker.io/library/ubuntu:latest   0.0s
 => [1/6] FROM docker.io/library/ubuntu:latest                     0.0s
 => CACHED [2/6] RUN sed -i 's/archive.ubuntu.com/mirrors.ustc.ed  0.0s
 => CACHED [3/6] RUN sed -i 's/security.ubuntu.com/mirrors.ustc.e  0.0s
 => CACHED [4/6] RUN apt update     && apt full-upgrade -y         0.0s
 => CACHED [5/6] RUN apt -y install vim                            0.0s
 => CACHED [6/6] RUN apt autoremove -y     && apt clean -y     &&  0.0s
 => exporting to image                                             0.0s
 => => exporting layers                                            0.0s
 => => writing image sha256:0350ae574b3e008092a110a818d266ab1dc45  0.0s
 => => naming to docker.io/library/vim                             0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

看到上面的输出时，就代表我们的镜像构建完成了。

### 基于已有镜像构建镜像

首先，我们需要弄清楚已有镜像是什么镜像？镜像大概可以分为两种：

- 带有文件系统的镜像
- 普通镜像

#### 带有文件系统的镜像

带有文件系统的镜像是指通过 [docker export](https://docs.docker.com/engine/reference/commandline/export/) 导出的容器镜像。如果想使用这类镜像构建镜像，需要使用 [docker import](https://docs.docker.com/engine/reference/commandline/import/) 命令。

##### 举个例子

准备一个带有文件系统的镜像。

1. 运行一个容器，这里我们使用上文构建的 `vim` 镜像运行容器

    ```shell
    ➜  vim docker run -it vim
    root@4db72433b66d:/#
    ```

2. 打开一个新的终端，导出容器镜像

    ```shell
    #显示容器列表
    ➜  ~ docker container list
    CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS          PORTS     NAMES
    c2a7ceb30f33   vim       "bash"    36 seconds ago   Up 35 seconds             objective_heyrovsky
    #导出容器镜像
    ➜  vim docker export c2a7ceb30f33 -o vim_export.tar.gz | ls
    Dockerfile           vim_export.tar.gz
    ```

使用 `docker import` 构建镜像。

```shell
➜  vim docker import vim_export.tar.gz vim_export
sha256:54f4b7fcf9dbb987d439c2bcd05dadbdae139729c11211340c75374c063e5cc8
➜  vim docker image list
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
vim_export       latest    54f4b7fcf9db   25 seconds ago   136MB
```

#### 普通镜像

普通镜像是指通过 [docker save](https://docs.docker.com/engine/reference/commandline/save/) 打包的镜像。如果想使用这类镜像构建镜像，需要使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 命令。

##### 举个例子

准备一个普通镜像。

```shell
➜  vim docker save vim -o vim_save.tar.gz | ls
Dockerfile        vim_export.tar.gz vim_save.tar.gz
```

为了方便显示效果，我们将原有的 `vim` 镜像删除掉。

```shell
➜  vim docker image rm vim
Untagged: vim:latest
➜  vim docker image list
REPOSITORY          TAG       IMAGE ID       CREATED             SIZE
```

使用 `docker load` 构建镜像。

```shell
➜  vim docker load -i vim_save.tar.gz
Loaded image: vim:latest
➜  vim docker image list
REPOSITORY          TAG       IMAGE ID       CREATED             SIZE
vim                 latest    0350ae574b3e   About an hour ago   174MB
```

### 基于已有容器构建镜像

基于已有容器构建镜像主要用于跟进一些异常情况，如：`cpu`或内存异常突增、异常 `bug` 现场等。这时我们就可以通过保存容器的即时镜像，方便复现问题。

这里用到的是 [docker commit](https://docs.docker.com/engine/reference/commandline/commit/) 命令。伪代码如下：

```shell
$ docker commit \
    --author "Zhang Peng <onnttf@gmail.com>" \
    --message "保存容器镜像" \
    容器名字 \
    新的镜像名字:新的镜像tag
```

#### 举个例子

运行一个容器，这里我们使用上文构建的 `vim` 镜像运行容器。

```shell
➜  vim docker run -it vim
root@4db72433b66d:/#
```

打开一个新的终端，使用 `docker commit` 构建镜像。

```shell
➜  vim docker container list
CONTAINER ID   IMAGE     COMMAND   CREATED         STATUS         PORTS     NAMES
2a9daf7512f2   vim       "bash"    3 minutes ago   Up 3 minutes             serene_bardeen
➜  vim docker commit \
    --author "Zhang Peng <onnttf@gmail.com>" \
    --message "commit vim image" \
    serene_bardeen \
    vim_commit:latest
sha256:02f4e20da7c3302bf61c8d9e526ba039644ec813506cdb6029a823fc864ab97e
➜  vim docker image list
REPOSITORY          TAG       IMAGE ID       CREATED             SIZE
vim_commit          latest    02f4e20da7c3   5 seconds ago       174MB
```

## 总结

本篇文章介绍了三种构建镜像的方式，**最推荐的是使用 `Dockerfile` 构建镜像**。如果大家学会了，那就赶紧去构建一个属于自己的镜像吧！

## 参考资料

1. [Create a base image](https://docs.docker.com/develop/develop-images/baseimages/)
2. [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
3. [docker save 与 docker export 的区别](https://jingsam.github.io/2017/08/26/docker-save-and-docker-export.html)
4. [Difference Between Docker Save and Export](https://www.baeldung.com/ops/docker-save-export)
5. [Docker import/export vs. load/save](https://pspdfkit.com/blog/2019/docker-import-export-vs-load-save/)
