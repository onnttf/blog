---
author: Zhang Peng
category: 🙌 Show and tell
labels: 
discussion: 
updatedAt: 2023-11-20T19:54:49+08:00
---

# Ubuntu 安装 MySQL

## 下载安装

* 获取 `mysql-apt-config` 文件下载地址

  1. 进入 `MySQL` 官网，选择 **APT Repository**。 [>>>直达链接](https://dev.mysql.com/downloads/repo/apt/)
  2. 点击页面底部 **Download** 按钮，进入下载页。
  3. 复制页面底部 **No thanks, just start my download.** 的链接地址

  上面得到的链接地址即为 `mysql-apt-config` 的下载地址。

  本文发表之时的最新地址为：`https://dev.mysql.com/get/mysql-apt-config_0.8.12-1_all.deb`

* 安装 `mysql-apt-config`

  **在阅读下面的内容前，请先登录您的服务器。**

  ```shell
  #1.下载 mysql-apt-config
  sudo wget https://dev.mysql.com/get/mysql-apt-config_0.8.12-1_all.deb
  #2. 安装 mysql-apt-config
  sudo dpkg -i mysql-apt-config_0.8.12-1_all.deb
  ```

  这时会有一个可视化界面出现，如下图所示。

  ![图片](https://file.onnttf.site/2019/04/03/1.jpg)

  选择第一项，可以看到让我们选择 `MySQL` 的版本，我这边选择的是 5.7 版本。然后一路 `Ok` 下去就可以了。

* 安装其他 mysql 相关服务

  ```shell
  #1.升级列表中的软件包
  sudo apt-get update
  #2.安装 mysql-server mysql-common mysql-client
  sudo apt-get install mysql-server mysql-common mysql-client
  ```

  如果出现一个要求输入数据库密码的界面的话，那么按着提示进行操作（输入密码，再次输入密码，确认）。如果没有看到这个界面，也不必惊慌（反正我也没有看到这个界面…🙄️），下一小节会讲解如何设置密码。

**`MySQL` 安装完成后会自动启动**，可以通过 `sudo service mysql status` 检查运行状态，控制台中输下面的内容就表示 `MySQL` 正在运行。

```shell
$ service mysql status

- mysql.service - MySQL Community Server

Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: en

Active: active (running) since Tue 2019-04-02 23:43:54 CST; 23h ago

Process: 4434 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/my

Process: 4412 ExecStartPre=/usr/share/mysql/mysql-systemd-start pre (code=exit

Main PID: 4436 (mysqld)

Tasks: 28 (limit: 1113)

CGroup: /system.slice/mysql.service

└─4436 /usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/mysqld.pid

Apr 02 23:43:53 VM-0-15-ubuntu systemd[1]: Stopped MySQL Community Server.

Apr 02 23:43:53 VM-0-15-ubuntu systemd[1]: Starting MySQL Community Server...

Apr 02 23:43:54 VM-0-15-ubuntu systemd[1]: Started MySQL Community Server.
```

其他常用命令：

```shell
#查看 MySQL 运行状态
sudo service mysql status
#启动 MySQL 服务
sudo service mysql start
#停止 MySQL 服务
sudo service mysql stop
#重启 MySQL 服务
sudo service mysql restart
```

## 修改密码

`MySQL 5.7` 安装完成后普通用户不能进 mysql，原因：`root` 的 `plugin` 被修改成了 `auth_socket`，用密码登陆的 `plugin` 应该是 `mysql_native_password`，直接用 `root` 权限登录就不用密码，修改 `root` 密码和登录验证方式。

```shell
#切换到 root 用户，运行 MySQL 命令
$ sudo su & mysql

mysql> select user, plugin from mysql.user;

+------------------+-----------------------+

| user | plugin |

+------------------+-----------------------+

| root | auth_socket |

| mysql.session | mysql_native_password |

| mysql.sys | mysql_native_password |

| debian-sys-maint | mysql_native_password |

+------------------+-----------------------+

4 rows in set (0.00 sec)

mysql> update mysql.user set authentication_string=PASSWORD('123456'), plugin='mysql_native_password' where user='root';

mysql> flush privileges;

#退出 MySQL

mysql> exit

Bye

#重启 MySQL
$ sudo /etc/init.d/mysql restart
```

通过上面的代码，就将 `MySQL` 的密码设置成了 **123456**，我们可以检查下密码是否设置成功：

```shell
#登录 MySQL
$ mysql -uroot -p

Enter password:

Welcome to the MySQL monitor. Commands end with ; or \g.

Your MySQL connection id is 2

Server version: 5.7.22-0ubuntu18.04.1 (Ubuntu)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its

affiliates. Other names may be trademarks of their respective

owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

## 新增用户

执行新增用户的 `SQL` 语句

```shell
mysql> create user 'zhangpeng'@'%' identified by '123456';

Query OK, 0 rows affected (0.08 sec)
```

**注：** 'zhangpeng'@'%'表示 zhangpeng 这个账号允许远程登录。如果写成 'zhangpeng'@'localhost' ，那么只能本地登录。

## 设置字符集

`MySQL` 的默认字符集不是 utf8，因此我们需要修改 `MySQL` 的字符集。

编辑配置文件（`/etc/mysql/mysql.conf.d/mysqld.cnf`），将下面内容填入配置文件。

```text
[client]

port = 3306

socket = /var/lib/mysql/mysql.sock

default-character-set=utf8

[mysqld]

port = 3306

socket = /var/lib/mysql/mysql.sock

character-set-server=utf8

[mysql]

no-auto-rehash

default-character-set=utf8
```

修改完毕后，检查字符集是否设置成功

```shell
mysql> show variables like 'char%';

+--------------------------+----------------------------+

| Variable_name | Value |

+--------------------------+----------------------------+

| character_set_client | utf8 |

| character_set_connection | utf8 |

| character_set_database | utf8 |

| character_set_filesystem | binary |

| character_set_results | utf8 |

| character_set_server | utf8 |

| character_set_system | utf8 |

| character_sets_dir | /usr/share/mysql/charsets/ |

+--------------------------+----------------------------+

8 rows in set (0.17 sec)
```

## 远程登录

```shell
# 修改配置文件，注释掉 bind-address = 127.0.0.1
$ sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf

保存退出，然后进入 mysql 服务，执行授权命令：

$ mysql -uroot -p

mysql> grant all on *.* to root@'%' identified by '123456' with grant option;

Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> flush privileges;

Query OK, 0 rows affected (0.00 sec)

mysql> exit

Bye

$ sudo /etc/init.d/mysql restart
```

## 参考资料

1. [Linux 常用命令集合](http://www.runoob.com/w3cnote/linux-common-command.html)
2. [Ubuntu18.04 下安装 MySQL5.7](https://blog.csdn.net/u011026329/article/details/80835139>)
