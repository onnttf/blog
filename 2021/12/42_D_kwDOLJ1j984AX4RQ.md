---
author: Zhang Peng
category: 🙌 Show and tell
labels: MacOS
discussion: https://github.com/onnttf/blog/discussions/42
updatedAt: 2024-04-08T01:04:58+08:00
---

# 解除 MacOS 系统的密码限制

![image](https://file.onnttf.site/2021/12/01/1.png)

在 `MacOS Mojave 10.14` 以后，苹果系统升级了对账户密码的要求。强制要求用户为账户设置一个至少四个字符的密码。而很多人已经习惯了使用一位的密码，比如我就喜欢用空格当密码，键位好找且方便。

如何解决这个恼人的问题呢？本篇文章带给你答案。

## 修改密码策略

第一步，我们需要清除当前的密码策略。打开我们的终端应用（或者随便一个您常用的命令行工具），输入下面的命令，并点击回车键。

```shell
pwpolicy -clearaccountpolicies
```

当执行命令后，会看到如下界面。如图中提示所示，我们需要输入我们当前的密码。此时输入的密码不会回显，当我们输入完成后，直接点击回车即可。

![image](https://file.onnttf.site/2021/12/01/2.png)

当界面中提示 `Clearing global account policies` 时，代表我们已经成功的清除了密码策略。如下图所示：

![image](https://file.onnttf.site/2021/12/01/3.png)

## 设置新密码

点击屏幕左上角的苹果标志，选择**系统偏好设置->用户与群组->更改密码**，然后按提示修改密码即可。可以看到此时已经没有了对于密码要求了。

![image](https://file.onnttf.site/2021/12/01/4.png)

######

如果觉得本篇文章不错，麻烦给个**点赞👍、收藏🌟、分享👊、在看👀**四连！

![干货输出机](https://file.onnttf.site/wechat/qrcode.jpg)
