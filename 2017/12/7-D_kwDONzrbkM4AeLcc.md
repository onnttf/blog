# WKWebView 实战指南

`WKWebView` 是苹果提供的现代化网页浏览控件，用于在 `iOS` 应用中展示网页内容。它从 `iOS 8` 开始支持使用。

## 为什么选择 `WKWebView`

相比于传统的 `UIWebView`，`WKWebView` 具有以下显著优势：

1. 卓越的性能表现和稳定性
2. 显著降低内存占用
3. 完整支持现代 `HTML5` 特性
4. 流畅的 `60fps` 渲染和原生手势支持
5. 丰富的代理方法，提供更强大的控制能力
6. 支持进程间通信，更安全可靠

更多技术细节可以查看 [WebKit 官方文档](https://developer.apple.com/documentation/webkit)

## 基本使用

### 引入框架

首先需要导入 `WebKit` 框架：

```objc
#import <WebKit/WebKit.h>
```

### 创建和配置 WKWebView

```objc
// 创建 WKUserContentController 用于 JS 交互
WKUserContentController *userContentController = [[WKUserContentController alloc] init];

// 注入 cookies
NSString *js = @"document.cookie='user=zhangpeng'";
WKUserScript *cookieScript = [[WKUserScript alloc] initWithSource:js
                                                    injectionTime:WKUserScriptInjectionTimeAtDocumentStart
                                                 forMainFrameOnly:NO];
[userContentController addUserScript:cookieScript];

// 配置 WKWebView
WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
config.userContentController = userContentController;
_config = config;

// 注册 JS 调用处理器
for (NSString *scriptMessage in self.scriptMessages) {
    [config.userContentController addScriptMessageHandler:self name:scriptMessage];
}

// 创建 WKWebView 实例
WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 0, kScreenW, kMainAreaHeightNoTab)
                                        configuration:config];
webView.UIDelegate = self;        // UI 交互代理
webView.navigationDelegate = self; // 导航代理
[self.view addSubview:webView];
_webView = webView;
```

## 代理方法

### WKNavigationDelegate

`WKNavigationDelegate` 提供页面加载生命周期的回调方法：

```objc
// 1. 决定是否允许导航
- (void)webView:(WKWebView *)webView
decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction
  decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSLog(@"%s", __func__);
    decisionHandler(WKNavigationActionPolicyAllow); // 允许导航
}

// 2. 开始加载
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 3. 收到响应后决定是否继续
- (void)webView:(WKWebView *)webView
decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse
   decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler {
    NSLog(@"%s", __func__);
    decisionHandler(WKNavigationResponsePolicyAllow); // 允许继续加载
}

// 4. 开始接收内容
- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 5. 加载完成
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 6. 加载失败
- (void)webView:(WKWebView *)webView
didFailNavigation:(WKNavigation *)navigation
       withError:(NSError *)error {
    NSLog(@"%s", __func__);
}

// 7. 加载内容失败
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}
```

其他重要的代理方法：

```objc
// 处理重定向
- (void)webView:(WKWebView *)webView
didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 处理 SSL 证书认证
- (void)webView:(WKWebView *)webView
didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge
completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
    NSLog(@"%s", __func__);
    // 创建凭证并信任服务器证书
    NSURLCredential *credential = [[NSURLCredential alloc] initWithTrust:challenge.protectionSpace.serverTrust];
    completionHandler(NSURLSessionAuthChallengeUseCredential, credential); // 使用凭证继续认证
}

// 进程终止处理
- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    NSLog(@"%s", __func__);
}
```

### WKUIDelegate

`WKUIDelegate` 主要用于处理 `JavaScript` 的 `UI` 交互，最常用的是 `alert` 弹窗：

```objc
// 处理 JavaScript 弹窗警告
- (void)webView:(WKWebView *)webView
runJavaScriptAlertPanelWithMessage:(NSString *)message
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(void))completionHandler {
    // 创建警告弹窗
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示"
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];

    // 添加确定按钮
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定"
                                                     style:UIAlertActionStyleDefault
                                                   handler:nil];
    [alert addAction:action];

    // 显示弹窗
    [self presentViewController:alert animated:YES completion:nil];

    // 调用完成处理
    completionHandler();
}
```

还有两个用于处理确认框和输入框的方法：

```objc
// 处理 JavaScript 确认框
- (void)webView:(WKWebView *)webView
runJavaScriptConfirmPanelWithMessage:(NSString *)message
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(BOOL result))completionHandler {
    // 显示确认框
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"确认"
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];

    // 确定按钮
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确定"
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction * _Nonnull action) {
                                                             completionHandler(YES); // 确定时返回 YES
                                                         }];

    // 取消按钮
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                          style:UIAlertActionStyleCancel
                                                        handler:^(UIAlertAction * _Nonnull action) {
                                                            completionHandler(NO); // 取消时返回 NO
                                                        }];

    [alert addAction:confirmAction];
    [alert addAction:cancelAction];

    // 显示弹窗
    [self presentViewController:alert animated:YES completion:nil];
}

// 处理 JavaScript 输入框
- (void)webView:(WKWebView *)webView
runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt
defaultText:(nullable NSString *)defaultText
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(NSString * _Nullable result))completionHandler {
    // 创建输入框弹窗
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:nil
                                                                   message:prompt
                                                            preferredStyle:UIAlertControllerStyleAlert];

    // 添加文本输入框
    [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.text = defaultText; // 设置默认文本
    }];

    // 确定按钮
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确定"
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction * _Nonnull action) {
                                                             // 返回输入的文本
                                                             completionHandler(alert.textFields.firstObject.text);
                                                         }];

    // 取消按钮
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                          style:UIAlertActionStyleCancel
                                                        handler:^(UIAlertAction * _Nonnull action) {
                                                            // 取消时返回 nil
                                                            completionHandler(nil);
                                                        }];

    [alert addAction:confirmAction];
    [alert addAction:cancelAction];

    // 显示弹窗
    [self presentViewController:alert animated:YES completion:nil];
}
```

## JavaScript 交互

`WKWebView` 提供两种与 `JavaScript` 交互的方式。

### MessageHandler 方式

通过 `WKScriptMessageHandler` 接收 `JavaScript` 消息：

```objc
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // 处理JS传来的消息
    // 通过查看 `WKScriptMessage`，可以看到 `name` 和 `body` 两个属性，`name` 就是注入的 `js` 对象名称，`body` 就是前端传给我们的参数
    if ([message.name isEqualToString:@"test1"]) {
        NSLog(@"收到test1消息：%@", message.body);
    } else if ([message.name isEqualToString:@"test2"]) {
        NSLog(@"收到test2消息：%@", message.body);
    }
}
```

`JavaScript` 调用示例：

```javascript
window.webkit.messageHandlers.test1.postMessage({ data: "Hello" });
```

### URL Schema 方式

通过拦截导航请求来处理自定义 `URL`：

```objc
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *url = navigationAction.request.URL;
    if ([url.scheme isEqualToString:@"myapp"]) {
        // 处理自定义URL
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
    }
    decisionHandler(WKNavigationActionPolicyAllow);
}
```

## 注意事项

### Cookie 处理

`WKWebView` 的 `Cookie` 需要同时处理两个方面：

1. `JavaScript` 侧：通过注入脚本设置

   ```objc
   NSString *js = @"document.cookie='key=value'";
   WKUserScript *script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];
   [userContentController addUserScript:script];
   ```

2. `Native` 请求：添加 `Cookie` 头

   ```objc
   NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
   [request setValue:@"key=value" forHTTPHeaderField:@"Cookie"];
   [webView loadRequest:request];
   ```

需要注意 `Cookie` 注入的两种方式有不同的作用范围：

1. `JavaScript` 注入的 `Cookie`:

   - 可以通过 `document.cookie` 在 `JavaScript` 中读取
   - 在浏览器开发者工具中可以看到
   - 服务端代码 (如 `PHP`) 无法直接读取

2. `NSMutableURLRequest` 注入的 `Cookie`:

   - 可以被服务端代码 (如 `PHP` 的 `$_COOKIE`) 直接读取
   - `JavaScript` 无法通过 `document.cookie` 访问
   - 在浏览器开发者工具中不可见

因此在实际开发中，需要根据具体使用场景选择合适的注入方式。如果需要同时支持前端和后端访问，则需要同时使用这两种方式注入 `Cookie`。

### 内存泄漏问题

`WKWebView` 可能造成循环引用导致内存泄漏，解决方案：

1. 创建弱引用代理类：

   ```objc
   @interface WeakScriptMessageDelegate : NSObject
   @property (nonatomic, weak) id<WKScriptMessageHandler> scriptDelegate;
   @end
   ```

2. 使用弱引用代理注册消息处理：

   ```objc
   [config.userContentController addScriptMessageHandler:[[WeakScriptMessageDelegate alloc] initWithDelegate:self] name:scriptMessage];
   ```

3. 在 dealloc 中移除消息处理：

   ```objc
   [self.config.userContentController removeScriptMessageHandlerForName:scriptMessage];
   ```

## 最后

通过本文，我们详细介绍了 `WKWebView` 的以下几个重要方面：

1. 基本使用方法和配置选项
2. 代理回调的完整生命周期
3. `JavaScript` 交互的两种实现方式
4. `Cookie` 处理的注意事项
5. 内存管理的最佳实践

`WKWebView` 作为 `iOS` 现代化的 `Web` 容器，具有性能优越、功能丰富的特点。合理使用其提供的各项功能，可以帮助我们构建高质量的 `Web` 混合应用。
