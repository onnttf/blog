---
author: Zhang Peng
category: 🙌 Show and tell
labels: Ubuntu
discussion: https://github.com/onnttf/blog/discussions/38
updatedAt: 2024-04-08T01:04:58+08:00
---

# Ubuntu 安装 NodeJS

为了省事儿，麻烦少，本文所有操作都是使用 **ubuntu** 用户操作。

## 安装 NodeJS

1. 下载脚本

   ```shell
   curl -sL https://deb.nodesource.com/setup_15.x | sudo bash -
   ```

   如需安装其他版本的 `NodeJS`，脚本下载地址可以在[常用的 NodeJS 版本以及脚本下载地址](install-nodejs.md#附录)中找到，替换上面命令中的 `https://deb.nodesource.com/setup_15.x` 即可。

2. 更新可用包的列表

   ```shell
   sudo apt update
   ```

3. 安装 `NodeJS`

   ```shell
   sudo apt install nodejs
   ```

   中途会提示一个 `Do you want to continue? [Y/n]`，直接回车就行。

4. 确认是否安装成功

   ```shell
   $ node -v
   v15.3.0
   $ npm -v
   7.0.14
   ```

## 常用 `NodeJS` 版本以及脚本下载地址

目前常用的 `NodeJS` 版本以及脚本下载地址如下：

| 版本           | 脚本下载地址                            |
| :------------- | :-------------------------------------- |
| Node.js 10 LTS | `https://deb.nodesource.com/setup_10.x` |
| Node.js 12 LTS | `https://deb.nodesource.com/setup_12.x` |
| Node.js 14 LTS | `https://deb.nodesource.com/setup_14.x` |
| Node.js 15     | `https://deb.nodesource.com/setup_15.x` |
