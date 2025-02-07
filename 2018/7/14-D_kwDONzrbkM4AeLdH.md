# 动态更换 App 图标

从 `iOS 10.3` 开始，Apple 提供了动态更换应用图标的功能。这个功能让我们可以在不发版的情况下更换 App 图标，但也有一些限制需要注意：

1. 所有可替换的图标必须预先打包到项目中
2. 更换图标时需要获得用户授权（虽然有绕过方法但不建议使用）

尽管存在这些限制，但这个功能仍然能为用户体验带来显著提升：

1. 在节假日期间可以无需发版即可更换应季图标
2. 在重大活动期间可以及时更换营销图标，无需担心发版风险

**注意**：更换图标会同步更新应用在通知栏、设置界面等所有场景下的图标。

## 准备替换图标

需要将待替换的图标文件放在项目目录下（不能放在 `.xcassets` 中）。建议按如下格式命名图标文件：
例如 `<xx20x20@2x.png>`、`<xx20x20@3x.png>` 等，这样在配置 `Info.plist` 时会更方便。

![image](https://file.onnttf.site/2018/07/10/1.jpg)

**提示**：理论上也可以只提供一套图标文件，命名为 `<xx@2x.png>`、`<xx@3x.png>` 等。但为了更好的显示效果，建议提供完整的尺寸系列。因为系统会对大尺寸图标进行压缩来适配小尺寸场景。

## 修改 `Info.plist`

要实现动态换图标功能，需要在 `Info.plist` 中进行必要的配置：

![image](https://file.onnttf.site/2018/07/10/2.jpg)

- CFBundleIcons

  包含所有应用图标信息的字典

- CFBundlePrimaryIcon

  主图标配置，如果在 `Assets.xcassets` 中已配置则会被自动使用

- CFBundleAlternateIcons

  可替换图标的配置数组

- UIPrerenderedIcon

  是否预渲染，若未设置或设为 `NO` 则系统会自动添加光泽效果

详细的配置说明请参考 [CFBundleIcons, CFBundlePrimaryIcon, CFBundleAlternateIcons](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/TP40009249-SW10)。

**注意**：如需支持 iPad，需要在 `CFBundleIcons~ipad` 中进行相同配置。

## 编写代码

系统提供了以下几个关键 `API`：

```objc
// If false, alternate icons are not supported for the current process.
// 检查是否支持更换图标
@property (readonly, nonatomic) BOOL supportsAlternateIcons NS_EXTENSION_UNAVAILABLE("Extensions may not have alternate icons") API_AVAILABLE(ios(10.3), tvos(10.2));

// Pass `nil` to use the primary application icon. The completion handler will be invoked asynchronously on an arbitrary background queue; be sure to dispatch back to the main queue before doing any further UI work.
// 更换图标
- (void)setAlternateIconName:(nullable NSString *)alternateIconName completionHandler:(nullable void (^)(NSError *_Nullable error))completionHandler NS_EXTENSION_UNAVAILABLE("Extensions may not have alternate icons") API_AVAILABLE(ios(10.3), tvos(10.2));

// If `nil`, the primary application icon is being used.
// 当前图标的名称
@property (nullable, readonly, nonatomic) NSString *alternateIconName NS_EXTENSION_UNAVAILABLE("Extensions may not have alternate icons") API_AVAILABLE(ios(10.3), tvos(10.2));
```

这些 `API` 使用起来相对简单，需要特别注意的是：

```objc
- (void)setAlternateIconName:(nullable NSString *)alternateIconName completionHandler:(nullable void (^)(NSError *_Nullable error))completionHandler
```

其中的 `alternateIconName` 参数需要与 `Info.plist` 中配置的名称保持一致，如示例中的 `female` 或 `male`。

## 代码示例

以下是一个完整的图标管理工具类实现。您也可以在 [DynamicAppIconDemo](https://github.com/onnttf/DynamicAppIconDemo) 查看 `FSAppIconManager` 的源码：

```objc
+ (NSString *)getCurrentAppIconName {
    if (@available(iOS 10.3, *)) {
        return ([UIApplication sharedApplication].alternateIconName.length == 0) ? @"" : [UIApplication sharedApplication].alternateIconName;
    } else {
        // Fallback on earlier versions
        return @"";
    }
}

+ (BOOL)canChangeAppIcon {
    if (@available(iOS 10.3, *)) {
        return [[UIApplication sharedApplication] supportsAlternateIcons];
    } else {
        // Fallback on earlier versions
        return NO;
    }
}

+ (void)changeAppIconWithIconName:(NSString *)iconName completionHandler:(void (^)(NSError * _Nullable))completionHandler {
    if (@available(iOS 10.3, *)) {
        [[UIApplication sharedApplication] setAlternateIconName:iconName completionHandler:^(NSError * _Nullable error) {
            if (!error) {
                completionHandler(nil);
            } else {
                completionHandler(error);
            }
        }];
    } else {
        // Fallback on earlier versions
        NSDictionary *userInfo = @{
            NSLocalizedDescriptionKey: NSLocalizedString(@"AppIcon change failed", nil),
            NSLocalizedFailureReasonErrorKey: NSLocalizedString(@"The current system version does not support replacing the AppIcon.", nil),
            NSLocalizedRecoverySuggestionErrorKey: NSLocalizedString(@"", nil)
        };
        NSError *error = [NSError errorWithDomain:@""
                                             code:34001
                                         userInfo:userInfo];
        completionHandler(error);
    }
}
```

## App Icon 相关的资料

### 属性要求

| Attribute   | Value                                                                                                                                                  |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format      | PNG                                                                                                                                                    |
| Color space | sRGB or P3 (see [Color Management](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/#color-management))           |
| Layers      | Flattened with no transparency                                                                                                                         |
| Resolution  | Varies. See [Image Size and Resolution](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/image-size-and-resolution/) |
| Shape       | Square with no rounded corners                                                                                                                         |

### 尺寸规格

| Device or context | Icon size                             |
| :---------------- | :------------------------------------ |
| iPhone            | 180px × 180px (60pt × 60pt @3x)       |
|                   | 120px × 120px (60pt × 60pt @2x)       |
| iPad Pro          | 167px × 167px (83.5pt × 83.5pt @2x)   |
| iPad, iPad mini   | 152px × 152px (76pt × 76pt @2x)       |
| App Store         | 1024px × 1024px (1024pt × 1024pt @1x) |

### Spotlight、Settings 和 Notification 图标尺寸

| Device or context         | Spotlight icon size             | Settings icon size            | Notification icon size        |
| :------------------------ | :------------------------------ | :---------------------------- | :---------------------------- |
| iPhone                    | 120px × 120px (40pt × 40pt @3x) | 87px × 87px (29pt × 29pt @3x) | 60px × 60px (20pt × 20pt @3x) |
|                           | 80px × 80px (40pt × 40pt @2x)   | 58px × 58px (29pt × 29pt @2x) | 40px × 40px (20pt × 20pt @2x) |
| iPad Pro, iPad, iPad mini | 80px × 80px (40pt × 40pt @2x)   | 58px × 58px (29pt × 29pt @2x) | 40px × 40px (20pt × 20pt @2x) |

### 注意事项

关于 `Settings` 图标的特别说明：请勿手动为其添加边框或遮罩效果，因为系统会自动为图标添加 1 像素宽的描边，以确保图标在白色背景上能够清晰显示。这样的自动处理可以保证图标在系统设置界面中有统一的展示效果。

## 最后

本文详细介绍了 `iOS` 动态更换应用图标的实现方法，从准备图标文件、配置 `Info.plist` 到编写代码，为开发者提供了完整的技术指南。

虽然这个功能有一些使用限制，但它为提升用户体验提供了灵活的解决方案。通过合理运用这一功能，我们可以在节假日或营销活动期间，无需发版即可动态更新应用图标，让应用界面更具吸引力和时效性。

希望这篇文章能帮助开发者更好地运用这一功能，为用户带来更丰富的应用体验。
