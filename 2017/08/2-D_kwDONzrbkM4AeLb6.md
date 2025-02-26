# 如何在 iOS 系统中读取带加密印章的 PDF 文件

在与电子签章公司合作时，我们收到了一份带有加密印章的 `PDF` 文件。在测试过程中，无论通过 `UIWebView` 还是 `WKWebView` 打开，文件中的加密印章都无法成功展示。

经过不断地调研与实践，我们成功解决了这一问题。现在将解决方案分享给大家。

## 实现步骤

### 准备工作

首先，我们定义几个常用的宏，以便在后续代码中使用，提升代码的可读性和简洁性：

```objc
#define kScreenW [UIScreen mainScreen].bounds.size.width
#define kScreenH [UIScreen mainScreen].bounds.size.height

#define DOCUMENTS_DIRECTORY [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject]
```

### 添加 WKWebView

我们使用 `WKWebView` 来加载和展示 `PDF` 文件。

```objc
#import <WebKit/WebKit.h>

WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];

WKUserContentController *wkUController = [[WKUserContentController alloc]init];

config.userContentController = wkUController;

// 注入 JS 对象，名称为 AppModel
// 当 JS 通过 AppModel 来调用时，我们可以在 WKScriptMessageHandler 代理中接收到
// 此处是为了得到PDF加载完成或失败的反馈
[config.userContentController addScriptMessageHandler:self name:@"AppModel"];

// 改变页面内容宽度，适配屏幕大小
NSString *js = @"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width'); document.getElementsByTagName('head')[0].appendChild(meta);";

WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
[wkUController addUserScript:wkUserScript];

WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 0, kScreenW, kScreenH - 64) configuration:config];
webView.backgroundColor = [UIColor whiteColor];
webView.UIDelegate = self;
webView.navigationDelegate = self;
[self.view addSubview:webView];
```

### 下载 PDF 文件

```objc
NSString *urlStr = @"";

NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:urlStr]];
NSURLSession *session = [NSURLSession sharedSession];

NSURLSessionDataTask *sessionDataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    NSLog(@"从服务器获取到 pdf 数据");
    //对从服务器获取到的数据 data 进行相应的处理：
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *path = [DOCUMENTS_DIRECTORY stringByAppendingPathComponent:@"contract.pdf"];
        NSFileManager *fm = [NSFileManager defaultManager];
        if ([fm fileExistsAtPath:path]) {
            [fm removeItemAtPath:path error:nil];
        }
        BOOL success =  [data writeToFile:path atomically:YES];
        if (success) {
            NSLog(@"保存成功");
            NSURL *baseURL = [NSURL fileURLWithPath:[self getHtmlBasePath]];
            NSString *path = [self getHtmlPath];
            NSString *htmlStr = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];

            [self.webView loadHTMLString:htmlStr baseURL:baseURL];
        }
    });
}];
[sessionDataTask resume];
```

### 加载 `PDF` 文件

```objc
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    [self loadPDF];
}

- (void)loadPDF {
    NSString *path = [DOCUMENTS_DIRECTORY stringByAppendingPathComponent:@"contract.pdf"];
    NSData *data = [NSData dataWithContentsOfFile:path options:NSDataReadingMappedAlways error:nil];

    NSString *paraStr = [data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn];
    NSString *js = [NSString stringWithFormat:@"loadMyJS('%@')",paraStr];

    [self.webView evaluateJavaScript:js completionHandler:^(id _Nullable response, NSError * _Nullable error) {
        if (error) {
            NSLog(@"%@", error);
            NSLog(@"当前手机系统版本较低，不支持查看，请升级系统或者到 PC 端查看。");
        }
    }];
}
```

### 与 js 进行交互

与 `js` 的交互主要是为了在控制器中获取 `PDF` 文件的加载状态。通过这种交互，我们能够实时感知 `PDF` 文件是否加载完成，或者在加载失败时处理错误提示。

在 `js` 代码中，当 `PDF` 文件加载完成或失败时，调用已注册的接口将状态传递给原生代码。

示例代码如下：

```js
function handlePages(page) {
  //create new canvas
  var viewport = page.getViewport(1);
  var canvas = document.createElement("canvas");
  canvas.style.display = "block";

  var context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  //render page
  page.render({ canvasContext: context, viewport: viewport });

  //add canvas to body
  document.body.appendChild(canvas);

  //render new page
  pageNum++;
  if (pdfDoc != null && pageNum <= numPages) {
    pdfDoc.getPage(pageNum).then(handlePages);
    // PDF 加载失败
  } else {
    console.log("pdf load complete");
    // PDF 加载完毕，body 的内容可以根据具体的业务需求进行修改
    window.webkit.messageHandlers.AppModel.postMessage({
      code: "00000",
      msg: "pdf load complete",
    }); //和 wkWebView 交互
  }
}
```

在原生代码中，通过实现 `WKScriptMessageHandler` 协议的方法接收 `js` 传递的消息并处理：

```objc
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.name isEqualToString:@"AppModel"]) {
        // 和 customview.js 文件交互，js 调 oc 的代码
        // 打印所传过来的参数，只支持 NSNumber, NSString, NSDate, NSArray, NSDictionary, and NSNull 类型
        if ([message.body[@"code"] isEqualToString:@"00000"]) {
            NSLog(@"%@", message.body[@"msg"]);
        }
    }
}
```

## 兼容 iOS8

到此为止，我们已经成功在 `iOS9` 及以上的系统中打开带有加密印章的 `PDF` 文件。

然而，在 `iOS8` 中，由于系统限制，`PDF` 文件无法正常加载。接下来，我们将详细说明原因并提供解决方案。

### 原因分析

在 `iOS9` 及以上版本，`WKWebView` 默认支持从 `NSBundle` 加载 `HTML`、`JS` 和其他静态资源。而在 `iOS8` 中，这些资源必须位于 `tmp` 目录或沙盒的其他可写路径中才能被访问。

### 兼容方案

为了解决上述问题，我们需要根据系统版本决定 `HTML` 和 `JS` 文件的存储位置。如果运行在 `iOS8` 上，我们将资源复制到 `tmp` 目录下；否则，直接从 `NSBundle` 加载。

以下是完整的兼容方案代码：

```objc
- (NSString*)getHtmlBasePath {
    NSString *basePath = @"";
    if ([[[UIDevice currentDevice]systemVersion]floatValue]<9.0) {
        basePath = NSTemporaryDirectory();
    }else{
        basePath = [[NSBundle mainBundle] bundlePath];
    }
    return basePath;
}

- (NSString*)getHtmlPath{
    NSString *path = @"";
    if ([[[UIDevice currentDevice]systemVersion] floatValue] < 9.0) {
        path = [self copyHtmlToTemp];
    } else {
        path = [[NSBundle mainBundle] pathForResource:@"index" ofType:@".html"];
    }
    return path;
}

//在 iOS8 上，html 及 js 文件要放到 tmp 目录下才能正常访问，iOS9 及以上不用
- (NSString*)copyHtmlToTemp {
    NSString* htmlPath = [[NSBundle mainBundle] pathForResource:@"index" ofType:@".html"];
    NSString *compatibilityJSPath = [[NSBundle mainBundle] pathForResource:@"compatibility" ofType:@".js"];
    NSString *customviewJSPath = [[NSBundle mainBundle] pathForResource:@"customview" ofType:@".js"];
    NSString *minimalCSSPath = [[NSBundle mainBundle] pathForResource:@"minimal" ofType:@".css"];
    NSString *pdfJSPath = [[NSBundle mainBundle] pathForResource:@"pdf" ofType:@".js"];
    NSString *pdfWorkerJSPath = [[NSBundle mainBundle] pathForResource:@"pdf.worker" ofType:@".js"];

    NSString *tempPath = NSTemporaryDirectory();

    NSString *htmlTempPath = [tempPath stringByAppendingPathComponent:@"index.html"];
    NSString *compatibilityJSTempPath = [tempPath stringByAppendingPathComponent:@"compatibility.js"];
    NSString *customviewJSTempPath = [tempPath stringByAppendingPathComponent:@"customview.js"];
    NSString *minimalCSSTempPath = [tempPath stringByAppendingPathComponent:@"minimal.css"];
    NSString *pdfJSTempPath = [tempPath stringByAppendingPathComponent:@"pdf.js"];
    NSString *pdfWorkerJSTempPath = [tempPath stringByAppendingPathComponent:@"pdf.worker.js"];

    NSFileManager *fm = [NSFileManager defaultManager];

    if (![fm fileExistsAtPath:htmlTempPath]) {
        [fm copyItemAtPath:htmlPath toPath:htmlTempPath error:nil];
    }
    if (![fm fileExistsAtPath:compatibilityJSTempPath]) {
        [fm copyItemAtPath:compatibilityJSPath toPath:compatibilityJSTempPath error:nil];
    }
    if (![fm fileExistsAtPath:customviewJSTempPath]) {
        [fm copyItemAtPath:customviewJSPath toPath:customviewJSTempPath error:nil];
    }
    if (![fm fileExistsAtPath:minimalCSSTempPath]) {
        [fm copyItemAtPath:minimalCSSPath toPath:minimalCSSTempPath error:nil];
    }
    if (![fm fileExistsAtPath:pdfJSTempPath]) {
        [fm copyItemAtPath:pdfJSPath toPath:pdfJSTempPath error:nil];
    }
    if (![fm fileExistsAtPath:pdfWorkerJSTempPath]) {
        [fm copyItemAtPath:pdfWorkerJSPath toPath:pdfWorkerJSTempPath error:nil];
    }
    return htmlTempPath;
}
```

## 最后

通过文中所述的方案，无论用户是在 `iOS8` 还是更新版本的系统中，都可以顺利打开带有加密印章的 `PDF` 文件了。
