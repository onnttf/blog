# 10 分钟创建你的第一个 CocoaPods 公有库

想让你的代码被全世界的开发者使用吗？本文将手把手教你创建、配置并发布一个 `CocoaPods` 公有库。

## 注册 CocoaPods 账号

### 创建账号

```bash
# 使用 --verbose 参数可以看到详细的注册过程，方便排查问题
$ pod trunk register {你的邮箱} '{你的用户名}' --verbose
# ... 更多连接信息 ...
opening connection to trunk.cocoapods.org:443...
[!] Please verify the session by clicking the link in the verification email
```

### 验证邮箱

1. 打开邮箱查收标题为 **[CocoaPods] Confirm your session** 的验证邮件
2. 点击验证链接，完成注册

### 验证注册状态

```bash
$ pod trunk me
  - Name:     YOURNAME
  - Email:    YOURMAIL
  - Since:    May 23rd, 2018 03:02
  - Pods:
    - PodName
  - Sessions:
    - June 20th, 08:17     -        October 26th, 08:39. IP: xxx.xxx.xxx.xxx
```

## 创建公有 Pod 库

### 创建 GitHub 仓库

1. 在 `GitHub` 创建新仓库
2. 记录重要信息

   - 仓库主页：<<https://github.com/{GitHub> 用户名}/{Pod 名称}>
   - Clone 地址：<<https://github.com/{GitHub> 用户名}/{Pod 名称}.git>

### 使用 pod 脚手架创建 pod 库

```bash
$ pod lib create {YOURPODNAME}
Cloning `https://github.com/CocoaPods/pod-template.git` into `YOURPODNAME`.
Configuring YOURPODNAME template.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.

------------------------------

To get you started we need to ask a few questions, this should only take a minute.

If this is your first time we recommend running through with the guide:
 - https://guides.cocoapods.org/making/using-pod-lib-create.html
 ( hold cmd and click links to open in a browser. )


What platform do you want to use?? [ iOS / macOS ]
 > {iOS}

What language do you want to use?? [ Swift / ObjC ]
 > {ObjC}

Would you like to include a demo application with your library? [ Yes / No ]
 > {Yes}

Which testing frameworks will you use? [ Specta / Kiwi / None ]
 > {None}

Would you like to do view based testing? [ Yes / No ]
 > {No}

What is your class prefix?
 > {Prefix}
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.

Running pod install on your new library.

Analyzing dependencies
Fetching podspec for `YOURPODNAME` from `../`
Downloading dependencies
Installing YOURPODNAME (0.1.0)
Generating Pods project
Integrating client project
```

### 配置 .podspec

`.podspec` 文件是你的 `Pod` 库的核心配置信息，包含了版本、作者、依赖等重要元数据，需要仔细配置每一项：

```ruby
Pod::Spec.new do |s|
  s.name             = '{Pod 名称}'              # Pod 名称
  s.version          = '0.1.0'                # 版本号
  s.summary          = '一句话描述你的 Pod'      # 简短描述
  s.description      = <<-DESC                # 详细描述
                       详细描述你的 Pod 能做什么，
                       有什么特点和优势。
                       DESC
  s.homepage         = 'https://github.com/{GitHub 用户名}/{Pod 名称}'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { '{作者}' => '{邮箱}' }
  s.source           = { :git => '你的仓库地址.git', :tag => s.version.to_s }
  s.ios.deployment_target = '8.0'
  s.source_files = '{Pod 名称}/Classes/**/*'
end
```

### 验证与发布

1. 验证配置

   ```bash
   pod lib lint
   ```

2. 提交代码

   ```bash
   git add .
   git commit -m "初始化 Pod 库"
   git push
   ```

3. 创建发布版本

   ```bash
   git tag -a 0.1.0 -m '第一个版本'
   git push origin --tags
   ```

4. 发布到 `CocoaPods`

   ```bash
   $ pod trunk push

   [!] Found podspec `YOURPODNAME.podspec`
   Updating spec repo `master`
   Validating podspec
   -> YOURPODNAME (0.1.0)
       - NOTE  | xcodebuild:  note: Using new build system
       - NOTE  | [iOS] xcodebuild:  note: Planning build
       - NOTE  | [iOS] xcodebuild:  note: Constructing build description
       - NOTE  | xcodebuild:  note: Execution policy exception registration failed and was skipped: Error Domain=NSPOSIXErrorDomain Code=1 "Operation not permitted"
       - NOTE  | [iOS] xcodebuild:  warning: Skipping code signing because the target does not have an Info.plist file and one is not being generated automatically.

   Updating spec repo `master`

   --------------------------------------------------------------------------------
   🎉  Congrats

   🚀  YOURPODNAME (0.1.0) successfully published
   📅  June 18th, 10:30
   🌎  https://cocoapods.org/pods/YOURPODNAME
   👍  Tell your friends!
   --------------------------------------------------------------------------------
   ```

## 如何在项目中集成你的 Pod

至此，你已成功发布了自己的第一个 `CocoaPods` 公有库，让我们看看其他开发者如何使用它：

1. 在项目的 `Podfile` 中添加依赖

   ```ruby
   # 使用最新版本
   pod '{你的 Pod 名称}'

   # 或指定版本
   pod '{你的 Pod 名称}', '~> 0.1.0'
   ```

2. 执行安装命令

   ```bash
   pod install
   ```

3. 在代码中导入并使用

   ```objc
   // Objective-C
   #import <你的 Pod 名称/头文件名称.h>

   // Swift
   import 你的 Pod 名称
   ```

## 最后

你可以通过以下方式来持续改进你的库：

- 添加详细的文档说明和使用示例
- 不断优化代码质量
- 及时处理用户反馈和 `issue`
- 定期发布新版本修复问题和增加功能

希望你能在开源社区收获成长，让更多开发者受益于你的代码！
