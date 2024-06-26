---
author: Zhang Peng
category: 🙌 Show and tell
labels: iOS
discussion: https://github.com/onnttf/blog/discussions/9
updatedAt: 2024-04-08T01:04:59+08:00
---

# WKWebView 使用及注意事项

`WKWebView` 是苹果提供的用于在 App 中进行网页浏览的控件，不过只能在 `iOS8` 后使用，如果还需要适配 `iOS7`，那我只能摆一张无奈脸了ㄟ ( ▔， ▔ ) ㄏ

## 为什么使用要用 `WKWebView`

它相对于 `UIWebView` 有以下几个优点：

1. 性能和稳定性的大幅提高
2. 内存占用的减少
3. 支持更多 HTML5 特性
4. 60fps 的刷新率以及内置手势的支持
5. 增加了新的代理方法，可控性更高

更多内容可以查看 [WebKit 苹果官方链接](https://developer.apple.com/documentation/webkit?language=objc)

## 如何使用

### 引入 `WebKit`

要想使用 `WKWebView`，一定要先引入：

```objc
#import <WebKit/WebKit.h>
```

### 添加 `WKWebView`

```objc
// WKUserContentController 对象为 JavaScript 提供了一种方式，可以将消息发送到 web 视图，并将用户脚本注入到 web 视图中。
WKUserContentController *userContentController = [[WKUserContentController alloc] init];

// 执行 js，添加 cookies
NSString *js = @"document.cookie='userId=zhangpeng'";
WKUserScript * cookieScript = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];
[userContentController addUserScript:cookieScript];

// 用于初始化 web 视图的配置
WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
config.userContentController = userContentController;
_config = config;

// 注入 JS 对象名称，当 JS 通过对象名称来调用时，我们可以在 WKScriptMessageHandler 代理中接收到
for (NSString *scriptMessage in self.scriptMessages) {
    [config.userContentController addScriptMessageHandler:self name:scriptMessage];
}

WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 0, kScreenW, kMainAreaHeightNoTab) configuration:config];
/*
    UIDelegate: web view 的用户界面代理。
    WKUIDelegate 类提供了代表网页呈现本地用户界面元素的方法。
*/
webView.UIDelegate = self;
/*
    navigationDelegate: web view 的导航代理。
    WKNavigationDelegate 协议的方法帮助您实现在 web view 接受、加载和完成导航请求过程中触发的自定义行为。
*/
webView.navigationDelegate = self;
[self.view addSubview:webView];
_webView = webView;
```

## 代理方法

### WKNavigationDelegate

`WKNavigationDelegate` 中基本都是生命周期相关的代理，下面会按照执行顺序进行介绍

```objc
// 1.是否允许跳转
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
    NSLog(@"%s", __func__);
    decisionHandler(WKNavigationActionPolicyAllow);
}

// 2.开始加载网页
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 3.知道返回内容之后，是否允许加载
- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler{
    NSLog(@"%s", __func__);
    decisionHandler(WKNavigationResponsePolicyAllow);
}

/// 4.当内容开始返回时调用
- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 5.页面加载完成之后调用
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}

// 当跳转失败时调用
- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"%s", __func__);
}

// 当 web view 加载内容失败时调用
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
}
```

下面还有几个不常用但是要知道的代理

```objc
//当由服务端进行重定向时触发
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(null_unspecified WKNavigation *)navigation{
    NSLog(@"%s", __func__);
}

//进行证书验证时触发
- (void)webView:(WKWebView *)webView didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
    NSLog(@"%s", __func__);
    NSURLCredential *card = [[NSURLCredential alloc]initWithTrust:challenge.protectionSpace.serverTrust];
    completionHandler(NSURLSessionAuthChallengeUseCredential, card);
}

//当因为某些问题，导致 webView 进程终止时触发
- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    NSLog(@"%s", __func__);
}
```

### WKUIDelegate

`WKUIDelegate` 中我们最常用的就是这个 `- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler` 代理了。我们可以在这个代理中，将前端中的 `alert()` 替换为我们自己的弹窗。

```objc
- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示" message:message preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:nil];
    [alert addAction:cancelAction];
    [self presentViewController:alert animated:YES completion:nil];
    completionHandler();
}
```

这个 `message` 就是前端通过 alert() 方法传递的内容。**一定要写上 `completionHandler();`**，否则在某些情况下会造成 Crash，详见 [WKWebView 那些坑](https://www.cnblogs.com/NSong/p/6489802.html)。

下面两个方法，和上面的蕾丝，如有需要，可以看情况使用。

```objc
- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL result))completionHandler;

- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * _Nullable result))completionHandler;
```

## 与 js 交互

客户端与 `JS` 交互，有两种方案：

1. 通过 `webkit.messageHandlers` 进行交互；
2. 通过拦截跳转地址进行交互；

下面我们来分别讲讲如何实现：

### 通过 `webkit.messageHandlers` 进行交互

这种方案需要我们客户端提前在端上做些准备。我们需要在 `- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message` 代理中写好路由方法，简单来讲就是什么消息体该做什么事。当前端同学通过特定方法调用功能时，我们可以在此代理中接收到消息体，然后我们根据不同的消息内容，进行不同的操作即可。

```objc
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // 打印所传过来的参数，只支持 NSNumber, NSString, NSDate, NSArray, NSDictionary, NSNull 类型
    if ([message.name isEqualToString:@"test1"]) {
        NSLog(@"触发了 test1");
    } else if ([message.name isEqualToString:@"test2"]) {
        NSLog(@"触发了 test2");
    } else {

    }
}
```

通过查看 `WKScriptMessage`，我们可以看到 `name` 和 `body` 两个属性，`name` 就是注入的 `js` 对象名称，`body` 就是前端传给我们的参数。我们根据不同的 `name` 进行判断，执行不同的操作。
**举个例子：**
当前端同学调用 `test1` 时就会打印 `触发了test1`，而调用 `test2` 时就会打印 `触发了test2`。

而前端同学就简单了，当需要调用客户端中的方法时，通过下面的方式进行调用及传参：
**`window.webkit.messageHandlers.对象.postMessage(参数);`**

> **对象：**就是我们在初始化`WKWebView`时，通过`addScriptMessageHandler` 注入的 `js` 对象名称； **参数：**建议用 json 进行参数的传递，两边约定好的规范，可以提高开发的效率

**举个例子：**

```javascript
window.webkit.messageHandlers.test1.postMessage({msg: "test1"});
```

### 通过拦截跳转地址进行交互

拦截跳转地址的玩法，和 `UIWebView` 的玩法一致，在代理中进行拦截，如果有特定的表示，则停止跳转，然后解析 `url`，做不同的事情。

## 常见问题

### 添加 Cookies

* `JS` 注入的 `Cookie`，比如 `PHP` 代码在 `Cookie` 容器中取是取不到的，`javascript` 中的 `document.cookie` 能读取到，浏览器中也能看到。
* `NSMutableURLRequest` 注入的 `PHP` 等动态语言直接能从 `$_COOKIE` 对象中获取到，但是 `js` 读取不到，浏览器也看不到。

所以我们的解决办法是：

1. 在初始化时，通过 `js` 注入添加 `cookies`

   ```objc
    // WKUserContentController 对象为 JavaScript 提供了一种方式，可以将消息发送到 web 视图，并将用户脚本注入到 web 视图中。
    WKUserContentController *userContentController = [[WKUserContentController alloc] init];

    // 执行js，添加cookies
    NSString *js = @"document.cookie='userId=zhangpeng'";
    WKUserScript * cookieScript = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];
    [userContentController addUserScript:cookieScript];
   ```

2. 给发出的 `request` 也添加上 `cookies`

   ```objc
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:20.0f];
    [request setValue:@"userId=zhangpeng" forHTTPHeaderField:@"Cookie"];
    [_webView loadRequest:request];
   ```

### WKWebView 内存泄漏

#### 问题描述

通过持有 `WKWebView` 在 `dealloc` 方法打断点，可以看到控制器并没有走到该方法，猜想是由于 `WKUserContentController` 对象的 `addScriptMessageHandler` 方法强引用了控制器本身，而控制器又强引用了 `webView`，然后 `webView` 又强引用了 `configuration`， `configuration` 又强引用了 `WKUserContentController` 对象，最终造成了不能释放。
通过搜索看到了[stackoverflow 中的一个解决方案](https://stackoverflow.com/questions/26383031/wkwebview-causes-my-view-controller-to-leak)，最终解决了问题。

#### 解决方案

1.创建一个新类`WeakScriptMessageDelegate`

```objc
#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

@interface WeakScriptMessageDelegate : NSObject
@property (nonatomic, weak) id<WKScriptMessageHandler> scriptDelegate;
- (instancetype)initWithDelegate:(id<WKScriptMessageHandler>)scriptDelegate;
@end
```

```objc
@implementation WeakScriptMessageDelegate
- (instancetype)initWithDelegate:(id<WKScriptMessageHandler>)scriptDelegate {
    self = [super init];
    if (self) {
        _scriptDelegate = scriptDelegate;
    }
    return self;
}
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    [self.scriptDelegate userContentController:userContentController didReceiveScriptMessage:message];
}
@end
```

2.在我们使用 `WKWebView` 的控制器中引入我们创建的那个类，将注入 `js` 对象的代码改为：

```objc
[config.userContentController addScriptMessageHandler:[[WeakScriptMessageDelegate alloc] initWithDelegate:self] name:scriptMessage];
```

3.在 `delloc` 方法中通过下面的方式移除注入的 `js` 对象

```objc
[self.config.userContentController removeScriptMessageHandlerForName:scriptMessage];
```

上面三步就可以解决控制器不能被释放的问题了。O(∩_∩)O~~

## 参考资料

1.[WKWebView 那些坑](https://www.cnblogs.com/NSong/p/6489802.html)

本文的所有代码均以上传至 `GitHub`，如需[自取](https://github.com/onnttf/P_App_OC.git)～
