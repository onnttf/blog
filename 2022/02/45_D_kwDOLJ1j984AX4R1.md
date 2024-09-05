---
author: Zhang Peng
category: 🙌 Show and tell
labels: Golang
discussion: https://github.com/onnttf/blog/discussions/45
updatedAt: 2024-08-30T15:50:07+08:00
---

# 初识 Go Modules

在软件开发中,依赖管理一直是一个棘手的问题。无论你是使用 `Python`、`JavaScript` 还是 `Java`，可能都遇到过**依赖地狱**的问题，`Go` 语言也不例外，因此在 `Go 1.11` 新增了对 `Go Modules` 这一新概念的初步支持。

## Go Modules 是什么

`Go Modules` 是 `Go` 的依赖管理系统，它是 `GOPATH` 的替代品，旨在解决之前依赖管理中的诸多痛点，于 `Go 1.11` 版本引入,并在 `Go 1.13` 版本成为默认选项。

### Go Modules 的优点

1. **自动依赖下载**：告别手动管理，让依赖获取变得轻松自如。
2. **灵活的项目位置**：项目不再被束缚在`$GOPATH/src`目录中，给予开发者更多自由。
3. **清晰的依赖声明**：通过`go.mod`文件，项目依赖一目了然。
4. **版本控制**：精确控制依赖版本，确保项目的稳定性和可重现性。

## Go Modules 实践

现在我们通过一个实际的例子，一步步探索 `Go Modules` 的使用方法。

### 创建 lib 库

首先，创建一个名为 `greetings` 的 `lib` 库。

1. 创建并初始化 `greetings`

    ```shell
    #创建并进入 greetings 文件夹
    $ mkdir greetings && cd greetings
    #初始化 greetings
    $ go mod init github.com/onnttf/greetings
    go: creating new go.mod: module github.com/onnttf/greetings
    #查看 go.mod 文件
    $ cat go.mod 
    module github.com/onnttf/greetings

    go 1.22.6
    ```

    > `go mod init` 命令会创建一个 `go.mod` 文件，该文件包含模块名称和代码支持的 `Go` 版本，用于跟踪代码的依赖关系。

2. 编写 `greetings.go` 文件

    ```go
    package greetings

    import "fmt"

    // Hello returns a greeting for the named person.
    func Hello(name string) string {
        // Return a greeting that embeds the name in a message.
        message := fmt.Sprintf("Hi, %v. Welcome!", name)
        return message
    }
    ```

### 创建项目

接下来，创建一个使用 `greetings` 模块的主项目 `hello`。

1. 创建并初始化 `hello`

    ```shell
    $ cd ..
    #创建并进入 hello 文件夹
    $ mkdir hello && cd hello
    #初始化 hello 
    $ go mod init github.com/onnttf/hello
    go: creating new go.mod: module github.com/onnttf/hello
    ```

2. 编写 `hello.go` 文件

    ```go
    package main

    import (
        "fmt"

        "github.com/onnttf/greetings"
    )

    func main() {
        // Get a greeting message and print it.
        message := greetings.Hello("Mike")
        fmt.Println(message)
    }
    ```

    > 上面代码中导入两个包：`github.com/onnttf/greetings` 和 `fmt`

3. 运行 `hello.go`

    ```shell
    $ go run hello.go 
    hello.go:6:2: no required module provides package github.com/onnttf/greetings; to add it:
            go get github.com/onnttf/greetings
    ```

    > 可以看到，代码无法成功运行。因为没有添加 `github.com/onnttf/greetings` 的依赖，需要使用 `go get github.com/onnttf/greetings` 进行添加。
    >
    > 实际开发过程中，需要先发布 `github.com/onnttf/greetings`，才能通过 `go get` 进行添加。

4. 将 `github.com/onnttf/greetings` 指向本地的 `greetings`

    ```shell
    $ go mod edit -replace github.com/onnttf/greetings=../greetings
    $ cat go.mod
    module github.com/onnttf/hello

    go 1.22.6

    replace github.com/onnttf/greetings => ../greetings
    ```

    可以看到 go.mod 多了一行 `replace` 开头的内容。但此时运行 `hello.go` 还是会报错，内容如下：

    ```shell
    $ go run hello.go
    hello.go:6:2: module github.com/onnttf/greetings provides package github.com/onnttf/greetings and is replaced but not required; to add it:
            go get github.com/onnttf/greetings
    ```

5. 使用 `go mod tidy` 整理依赖，添加代码所需但尚未在模块中跟踪的依赖项

    ```shell
    $ go mod tidy
    go: found github.com/onnttf/greetings in github.com/onnttf/greetings v0.0.0-00010101000000-000000000000
    $ cat go.mod
    module github.com/onnttf/hello

    go 1.22.6

    replace github.com/onnttf/greetings => ../greetings

    require github.com/onnttf/greetings v0.0.0-00010101000000-000000000000
    ```

    现在 `hello.go` 就可以成功运行了。

    ```shell
    $ go run hello.go 
    Hi, Mike. Welcome!
    ```

### 发布 lib 库

要让其他人使用 `greetings` 模块，需要将它发布到远程仓库中，如 `GitHub`、`GitLab` 等。

1. 进入 `greetings` 文件夹

    ```shell
    cd ../greetings/
    ```

2. 初始化 `git` 仓库，并推送代码至远程仓库

    ```shell
    git init
    git add .
    git commit -m "初始化 greetings 模块"
    git branch -M main
    git remote add origin git@github.com:onnttf/greetings.git
    git push -u origin main
    ```

3. 创建版本 `tag`，并推送 `tag`

    ```shell
    git tag v0.1.0
    git push origin v0.1.0
    ```

4. 运行 `go list` 命令，促使 `Go` 更新模块索引，将 `greetings` 的加入其中

    ```shell
    $ GOPROXY=proxy.golang.org go list -m github.com/onnttf/greetings@v0.1.0
    github.com/onnttf/greetings v0.1.0
    ```

大功告成！已经在 [pkg.go.dev](https://pkg.go.dev/) 搜索到 `github.com/onnttf/greetings` 模块了。

## go mod 是什么

`go mod` 是 `Go` 语言中的一组命令，用于管理 `Go Modules`。

```shell
$ go mod
Go mod provides access to operations on modules.

Note that support for modules is built into all the go commands,
not just 'go mod'. For example, day-to-day adding, removing, upgrading,
and downgrading of dependencies should be done using 'go get'.
See 'go help modules' for an overview of module functionality.

Usage:

        go mod <command> [arguments]

The commands are:

        download    download modules to local cache
        edit        edit go.mod from tools or scripts
        graph       print module requirement graph
        init        initialize new module in current directory
        tidy        add missing and remove unused modules
        vendor      make vendored copy of dependencies
        verify      verify dependencies have expected content
        why         explain why packages or modules are needed

Use "go help mod <command>" for more information about a command.
```

比较常用的有 `go mod init`、`go mod tidy` 等。

## go.mod 是什么

`go.mod` 文件描述了模块的属性，包括模块对其他模块和 `Go` 版本的依赖性。语法可以查看 [go.mod file reference](https://go.dev/doc/modules/gomod-ref)。

## 常用的 lib 库

- [yaml](https://github.com/go-yaml/yaml) - 解析 yaml
- [json-iterator](https://github.com/json-iterator/go) - 解析 json
- [lancet](https://github.com/duke-git/lancet) - 一个全面、高效、可重用的 Go 函数库
- [casbin](https://github.com/casbin/casbin) - 一个支持 `ACL`、`RBAC`、`ABAC` 等访问控制模型的授权库

## 修改模块代理服务器

当你使用 `Go` 工具操作模块时，工具默认从 `proxy.golang.org`（谷歌运营的公共模块镜像）或直接从模块库下载模块，所以极有可能会下载失败，这时可以指定 `Go` 工具使用另一个代理服务器来下载和验证模块，如 [goproxy.cn](https://goproxy.cn/)。

```shell
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

## 私有模块如何处理

有些内部模块是不希望被外部使用或者收录的，因此会将它们存储至公司的 `git` 仓库中。这种模块无法直接通过 `go get` 进行安装，需要配置 `GOPRIVATE` 变量解决。

```shell
go env -w GOPRIVATE="*.abc.com"
```

表示所有模块路径以 `abc.com` 的下一级域名 (如 `git.abc.com` ) 为前缀的模块版本都将绕过公共代理，直接从源下载。

## 结论

`Go Modules` 简化了 `Go` 项目中的依赖管理，提供了更好的版本控制和更简单的项目设置。

## 参考资料

1. [Go Modules Reference](https://go.dev/ref/mod)
2. [Using Go Modules](https://go.dev/blog/using-go-modules)
3. [Managing dependencies](https://go.dev/doc/modules/managing-dependencies)
4. [Developing and publishing modules](https://go.dev/doc/modules/developing)
5. [Create a Go module](https://go.dev/doc/tutorial/create-module)
6. [Call your code from another module](https://go.dev/doc/tutorial/call-module-code)
7. [go.mod file reference](https://go.dev/doc/modules/gomod-ref)

## 作业

1. 创建 `lib` 库
2. 了解一个服务端项目由哪些部分组成
