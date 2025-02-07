# 如何构建 Docker 镜像

## Docker 镜像是什么

Docker 镜像是容器运行时的只读模板，它包含了运行应用程序所需的一切：代码、运行时环境、系统工具、系统库和设置等。[Docker 官方文档](https://docs.docker.com/get-started/overview/)对镜像的定义如下：

> An image is a read-only template with instructions for creating a Docker container. Often, an image is based on another image, with some additional customization. For example, you may build an image which is based on the ubuntu image, but installs the Apache web server and your application, as well as the configuration details needed to make your application run.

简单来说，Docker 镜像就像是一个"快照"，它可以保存并复制一个完整的运行环境。

## 三种构建镜像的方法

Docker 提供了三种主流的构建镜像方式：

1. 使用 `Dockerfile` 构建（推荐）
2. 基于已有镜像构建
3. 基于容器构建

让我们详细了解每种方法。

### 使用 Dockerfile 构建镜像（推荐）

`Dockerfile` 是一个文本文件，包含构建镜像所需的所有[命令](https://docs.docker.com/engine/reference/builder/)。它提供了一种简单且可重复的方式来创建镜像。

下面通过一个实例，演示如何使用 `Dockerfile` 构建一个包含 `vim` 编辑器的镜像：

1. 创建工作目录

   ```bash
   ~/Desktop
   ❯ mkdir vim && cd vim
   ~/Desktop/vim
   ❯
   ```

2. 编写 Dockerfile

   ```dockerfile
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

   > 提示：Dockerfile 还支持 `CMD`、`ENV`、`ENTRYPOINT` 等多种指令，详见[官方文档](https://docs.docker.com/engine/reference/builder/)。

3. 构建镜像

   执行 `docker build` 命令：

   ```bash
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

### 基于已有镜像构建

已有镜像可以分为两类：

- 带文件系统的镜像：通过 [docker export](https://docs.docker.com/engine/reference/commandline/export/) 导出，需使用 [docker import](https://docs.docker.com/engine/reference/commandline/import/) 导入

  ```bash
  ❯ docker import --help

  Usage:  docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]

  Import the contents from a tarball to create a filesystem image

  Aliases:
  docker image import, docker import

  Options:
  -c, --change list       Apply Dockerfile instruction to the created image
  -m, --message string    Set commit message for imported image
      --platform string   Set platform if server is multi-platform capable
  ```

- 普通镜像：通过 [docker save](https://docs.docker.com/engine/reference/commandline/save/) 导出，需使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 导入

  ```bash
  ❯ docker save --help

  Usage:  docker save [OPTIONS] IMAGE [IMAGE...]

  Save one or more images to a tar archive (streamed to STDOUT by default)

  Aliases:
  docker image save, docker save

  Options:
  -o, --output string   Write to a file, instead of STDOUT
  ```

### 基于容器构建镜像

这种方式主要用于保存容器的运行状态，比如：

- 调试异常问题
- 保存 CPU/内存异常现场
- 复现 Bug 场景

使用 [docker commit](https://docs.docker.com/engine/reference/commandline/commit/) 命令可以将容器保存为新的镜像：

```bash
❯ docker commit --help

Usage:  docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

Create a new image from a container's changes

Aliases:
  docker container commit, docker commit

Options:
  -a, --author string    Author (e.g., "John Hannibal Smith <hannibal@a-team.com>")
  -c, --change list      Apply Dockerfile instruction to the created image
  -m, --message string   Commit message
  -p, --pause            Pause container during commit (default true)
```

## 最后

本文详细介绍了构建 Docker 镜像的三种方法，其中[通过 Dockerfile 构建镜像](#使用-dockerfile-构建镜像推荐)是最推荐的方式，因为它：

- 过程清晰透明
- 易于维护和版本控制
- 可重复使用
- 适合自动化构建

建议你从编写简单的 `Dockerfile` 开始，逐步掌握 Docker 镜像的构建技巧。
