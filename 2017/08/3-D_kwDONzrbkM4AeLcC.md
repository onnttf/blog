# iOS Widget 开发指南

在 `iOS` 应用中，`Widget` 是一种小型的应用扩展，它允许用户通过设备的通知中心或主屏幕直接访问应用中的关键信息。开发一个 `Widget` 需要进行一系列的配置和代码实现。在本文中，我们将逐步介绍如何开发一个 `Widget`，从账号配置到实际开发的每个步骤，帮助你顺利完成开发。

## 账号配置

### 申请 `GroupID`

1. 在开发者账户中，进入 `App Groups` 配置页

   ![image](https://file.onnttf.site/2017/08/29/1.jpeg)

2. 根据页面提示，按要求填写相关信息

   - **`Description`**

     填写这个 `App Group` 的描述。示例：`Shared Resources for MyApp Widget`

   - **`ID`**

     填写这个 `App Group` 的标识，建议以 `com.{aaa}.{bbb}` 命名，填写完毕时，会默认在前面加上 `group`。示例：`com.mycompany.myapp`

完成创建后，如图：

![image](https://file.onnttf.site/2017/08/29/2.jpeg)

### 将 `App Group` 添加到 `App ID` 中

1. 打开你的 `App ID` 配置页面
2. 找到 `App Groups` 选项，将之前创建的 `GroupID` 勾选启用

![image](https://file.onnttf.site/2017/08/29/3.jpeg)

### 重新激活 Provisioning Profile

操作过 `App ID` 后，需要重新激活或更新关联的 `Provisioning Profile` 以同步新的权限。

1. 在 `Apple Developer Account` 中找到对应的 `Provisioning Profile`
2. 点击 Edit 或重新生成

## 项目配置

### App Target 配置

1. 打开项目设置，进入 `App Target` 的 `Capabilities` 页签
2. 找到 `App Groups` 选项
3. 勾选之前创建的 `App Group`

   ![image](https://file.onnttf.site/2017/08/29/5.jpeg)

### Widget Target 配置

1. 打开项目设置，进入 `Widget Target` 的 `General` 页签
2. 设置 `Bundle Identifier`，需遵循以下规则

   - 前缀必须包含主应用的 `Bundle Identifier`
   - 后缀可以自定义，但不能是 `widget`

示例：

如果主项目的 `Bundle Identifier` 是 `com.mycompany.myapp`。那 `Widget` 的 `Bundle identifier` 可以是 `com.mycompany.myapp.today`。

## 开发阶段

在完成基础配置后，我们进入 `Widget` 的开发阶段。

### 创建 Widget Target

1. 在主项目中创建一个新的 `Target`，选择 `Today Extension`

   ![image](https://file.onnttf.site/2017/09/07/1.jpeg)

2. 完成后会自动生成如下文件

   ![image](https://file.onnttf.site/2017/09/07/2.jpeg)

### 修改 Widget Target 配置

按需对 `Widget` 的 `Info.plist` 进行修改。

- 修改 `Widget` 在通知栏中显示的名称

  通过修改 `Bundle Display Name` 内容，给 `Widget` 名称设置一个简洁易懂的名字

- 使用纯代码开发

  1. 删除 `NSExtensionMainStoryboard` 键值对，并移除默认生成的 `MainInterface.storyboard` 文件
  2. 添加 `NSExtensionPrincipalClass` 键，将值设为主控制器类名（如 `TodayViewController`）

### 开发工作

在配置完成之后，进入开发阶段。`Widget` 开发不复杂，遵循文档即可开发出美观实用的 `Widget`，但需要留意一些版本差异和细节问题。

#### 兼容适配

##### iOS8

- 没有折叠和展开功能
- 默认 Widget 高度由 `self.preferredContentSize` 控制

  ```objc
  self.preferredContentSize = CGSizeMake(kScreenW, 100);
  ```

- 组件布局默认向右偏移 30 单位，可以通过 `widgetMarginInsetsForProposedMarginInsets` 方法进行调整

  ```objc
  - (UIEdgeInsets)widgetMarginInsetsForProposedMarginInsets:(UIEdgeInsets)defaultMarginInsets {
     return UIEdgeInsetsMake(0, 0, 0, 0);
  }
  ```

##### iOS 10 及之后

- `Widget` 支持了两种显示模式

  - NCWidgetDisplayModeCompact

    高度固定，最低高度为 `110`

  - NCWidgetDisplayModeExpanded

    高度可变

- 设置显示模式

  **需要在设定 `Size` 前设定这个属性**

  ```objc
  - (void)viewDidLoad {
      [super viewDidLoad];
      if ([[UIDevice currentDevice] systemVersion].intValue >= 10) {
          self.extensionContext.widgetLargestAvailableDisplayMode = NCWidgetDisplayModeCompact; // 或 NCWidgetDisplayModeExpanded
      }
      self.preferredContentSize = CGSizeMake(kScreenW, 100);
      [self setupUI];
  }
  ```

- 监听显示模式变化

  当显示模式设置为 `NCWidgetDisplayModeExpanded` 时，点击折叠和打开时，会触发下面这个方法，在这个方法中可以修改对应状态的高度。修改完毕后，更新视图即可看到最新的布局。

  ```objc
  - (void)widgetActiveDisplayModeDidChange:(NCWidgetDisplayMode)activeDisplayMode withMaximumSize:(CGSize)maxSize {
      if (activeDisplayMode == NCWidgetDisplayModeCompact) {
          self.preferredContentSize = CGSizeMake(maxSize.width, 110);
      } else {
          self.preferredContentSize = CGSizeMake(maxSize.width, 200);
      }
   }

   //在下面的方法中更新视图
   -(void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
   //    NCUpdateResultNewData   新的内容需要重新绘制视图
   //    NCUpdateResultNoData    部件不需要更新
   //    NCUpdateResultFailed    更新过程中发生错误
     completionHandler(NCUpdateResultNoData);
   }
  ```

#### 代码共享

常用的四种代码共享方法：

1. 将代码打包成 `Framework`，然后 `link` 到主 `App`和 `Widget` 中 **（推荐）**
2. 不怕安装包变大的话，可以考虑将需要的第三方库在主 `App` 和 `Widget` 中分别复制一份 **（推荐）**
3. 将需要共享的文件按图中进行勾选配置

   ![image](https://file.onnttf.site/2017/09/07/4.jpeg)

4. 通过 `Pods` 导入，不太建议通过 `Pods` 分别向两个 `Target` 中导入第三方库，因为很容易发生一些不好处理的问题

#### 数据共享

常用的两种数据共享方法：

1. NSUserDefaults

   和我们常用的方法一样，不过在创建 `NSUserDefaults` 时，需要填写我们之前的 `GroupID`。通过 `GroupID`，我们就可以进行主 `App` 和 `Widget` 之间的数据共享了。

   ```objc
   // 写入数据
   NSString *groupID = @"group.com.aaa.bbb";
   NSUserDefaults *ud = [[NSUserDefaults alloc] initWithSuiteName:groupID];[ud setObject:@"我是测试的数据" forKey:@"test"];
   [ud synchronize];

   // 读取数据
   NSString *groupID = @"group.com.aaa.bbb";
   NSUserDefaults *ud = [[NSUserDefaults alloc] initWithSuiteName:groupID];
   NSString *value = [ud objectForKey:@"test"];
   ```

2. NSFileManager

   ```objc
   // 写入数据
   NSString *groupID = @"group.com.aaa.bbb";
   NSError *err = nil;
   NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:groupID];
   containerURL = [containerURL URLByAppendingPathComponent:@"Library/Caches/test"];
   NSString *value = @"我是测试的数据";
   BOOL result = [value writeToURL:containerURL atomically:YES encoding:NSUTF8StringEncoding error:&err];
   if(result){
       NSLog(@"写入成功");
   }

   // 读取数据
   NSString *groupID = @"group.com.aaa.bbb";
   NSError *err = nil;
   NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:groupID];
   containerURL = [containerURL URLByAppendingPathComponent:@"Library/Caches/test"];
   NSString *value = [NSString stringWithContentsOfURL:containerURL encoding:NSUTF8StringEncoding error:&err];
   ```

#### 数据刷新

- `Widget` 从屏幕上消失 2s 左右后，再次出现在屏幕中时，会执行 `viewDidLoad` 方法
- `Widget` 在短时间内频繁地消失显示，会执行 `viewWillAppear` 方法

如果需要刷新数据，可以根据需求在不同的方法中获取最新数据。

#### 打开 App

1. 设置 `App` 的 `URLSchemes`，打开 `APP` 主要通过 `URLScheme` 打开和传递参数值。设置 `URLSchemes` 时，要独特一些，避免与其他 `App` 重复
   ![image](https://file.onnttf.site/2017/09/07/5.jpeg)
2. 在 `Widget` 中添加点击事件，用于触发打开 `App` 的操作和传递参数

   ```objc
   NSString *schemeString = @"test_scheme://actionName?paramName=paramValue";
   [self.extensionContext openURL:[NSURL URLWithString:schemeString] completionHandler:^(BOOL success) {

   }];
   ```

3. `Appdelegate` 的代理方法中，截取 `URL`，做响应处理：

   ```objc
    // 所有版本的都可以使用
    - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
        [self appCallbackWithOpenUrl:url];
        return YES;
    }

    // iOS 8 以后
    - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
        [self appCallbackWithOpenUrl:url];
        return YES;
    }

    // iOS 7
    - (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
        [self appCallbackWithOpenUrl:url];
        return YES;
    }

    - (void)appCallbackWithOpenUrl:(NSURL *)url{
        NSLog(@"url: %@", url.host);
        // 针对 url 进行不同的操作
    }
   ```

## 最后

随着 `iOS` 生态的持续发展，`Widget` 不仅扩展了应用的功能，还为用户提供了更加直观和便捷的互动方式。

通过合理利用 `Widget`，开发者能够提升应用的用户体验，使用户能够快速访问重要信息，并通过互动更加流畅地与应用进行连接。
