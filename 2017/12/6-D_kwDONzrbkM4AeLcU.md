# 二维码生成与美化

在移动互联网时代，二维码作为信息传递的重要载体，已深度融入我们的日常生活。从移动支付、社交分享到身份验证，二维码以其快速便捷的特点，成为现代移动应用不可或缺的标配功能。

本文将系统讲解如何使用 [CIQRCodeGenerator](https://developer.apple.com/library/content/documentation/GraphicsImaging/Reference/CoreImageFilterReference/#//apple_ref/doc/filter/ci/CIQRCodeGenerator) 实现二维码的生成与美化。

## 需求背景

本文源于一个实际项目需求 - 开发类似支付宝红包的二维码分享功能。

具体要求包括：

1. 生成高清的二维码，确保稳定的识别效果
2. 在二维码中央嵌入品牌 `logo`，提升品牌辨识度
3. 支持添加精美背景图片，让二维码更具视觉吸引力
4. 实现二维码颜色的灵活定制，满足不同场景的设计需求

在接下来的内容中，将系统且详细地讲解实现二维码生成与美化的完整流程。

## 核心功能实现

在开始编码之前，我们先了解几个关键概念：

- **CIQRCodeGenerator**: `CoreImage` 框架提供的原生二维码生成器
- **纠错级别**: 二维码的容错能力，分为 L(7%)、M(15%)、Q(25%)、H(30%) 四个等级
- **清晰度处理**: 原生生成的二维码可能模糊，需要进行优化

### 生成二维码

生成二维码的场景非常广泛，为了实现二维码功能的灵活复用，我们将二维码生成逻辑封装为 `UIImage` 的扩展。

整个生成过程主要包含以下步骤：

1. 导入 `Core Image` 框架

   ```objc
   #import <CoreImage/CoreImage.h>
   ```

2. 利用 `CIFilter` 创建二维码

   ```objc
   // 创建 QR Code 生成器滤镜
   CIFilter *filter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
   // 将 filter 所有属性设置为默认值
   [filter setDefaults];

   // 将待编码的字符串转换为 UTF-8 格式的数据
   NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
   [filter setValue:data forKey:@"inputMessage"];

   // 设置二维码的纠错级别，纠错级别越高，二维码的抗损坏能力越强
   // L (7%): 适用于环境较好的场景
   // M (15%): 常规使用的推荐级别
   // Q (25%): 适合复杂场景或需要添加 Logo
   // H (30%): 对清晰度要求最高的场景
   [filter setValue:@"H" forKey:@"inputCorrectionLevel"];

   // 获取生成的二维码图像
   CIImage *outputImage = [filter outputImage];
   ```

### 清晰度优化

原生生成的二维码图像分辨率较低，为了获得更好的识别效果和视觉体验，我们提供两种优化方案。

#### CoreGraphics 优化方案

这种方案通过 `CoreGraphics` 框架对二维码图像进行重绘和缩放，能有效提升图像清晰度。

```objc
/**
 调整二维码清晰度

 @param img 原始二维码图片
 @param size 目标二维码尺寸
 @return 优化后的清晰二维码图片
 */
- (UIImage *)getHDImgWithCIImage:(CIImage *)img size:(CGSize)size {
    // 计算绘制区域和缩放比例
    CGRect extent = CGRectIntegral(img.extent);
    CGFloat scale = MIN(size.width / CGRectGetWidth(extent), size.height / CGRectGetHeight(extent));

    // 创建灰度色彩空间的位图上下文
    size_t width = CGRectGetWidth(extent) * scale;
    size_t height = CGRectGetHeight(extent) * scale;
    CGColorSpaceRef cs = CGColorSpaceCreateDeviceGray();
    CGContextRef bitmapRef = CGBitmapContextCreate(nil, width, height, 8, 0, cs, (CGBitmapInfo)kCGImageAlphaNone);

    // 将 CIImage 转换为 CGImage
    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef bitmapImage = [context createCGImage:img fromRect:extent];

    // 设置图像质量并执行缩放绘制
    CGContextSetInterpolationQuality(bitmapRef, kCGInterpolationNone);
    CGContextScaleCTM(bitmapRef, scale, scale);
    CGContextDrawImage(bitmapRef, extent, bitmapImage);

    // 生成最终图像
    CGImageRef scaledImage = CGBitmapContextCreateImage(bitmapRef);

    // 清理资源
    CGContextRelease(bitmapRef);
    CGImageRelease(bitmapImage);

    // 创建并返回 UIImage
    UIImage *outputImage = [UIImage imageWithCGImage:scaledImage];

    // 释放图像资源
    CGImageRelease(scaledImage);
    CGColorSpaceRelease(cs);

    return outputImage;
}
```

#### CIFilter 优化方案

这种方案通过 `CIFilter` 滤镜对二维码图像进行处理，可以有效提升图像清晰度。

```objc
/**
 使用 CIFilter 调整二维码清晰度

 @param img 原始二维码图片
 @param size 目标二维码尺寸
 @return 优化后的清晰二维码图片
 */
- (UIImage *)getHDImgWithCIFilterAndCIImage:(CIImage *)img size:(CGSize)size {
    // 设置二维码颜色
    UIColor *pointColor = [UIColor blackColor];
    UIColor *backgroundColor = [UIColor whiteColor];

    // 创建颜色滤镜
    CIFilter *colorFilter = [CIFilter filterWithName:@"CIFalseColor"
                                    keysAndValues:
                            @"inputImage", img,
                            @"inputColor0", [CIColor colorWithCGColor:pointColor.CGColor],
                            @"inputColor1", [CIColor colorWithCGColor:backgroundColor.CGColor],
                            nil];

    CIImage *qrImage = colorFilter.outputImage;

    // 绘制最终图像
    CGImageRef cgImage = [[CIContext contextWithOptions:nil] createCGImage:qrImage fromRect:qrImage.extent];
    UIGraphicsBeginImageContext(size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetInterpolationQuality(context, kCGInterpolationNone);
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextDrawImage(context, CGContextGetClipBoundingBox(context), cgImage);
    UIImage *codeImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    CGImageRelease(cgImage);

    return codeImage;
}
```

下面这张图片展示了经过清晰度处理后的二维码，你可以发现每个像素点都清晰可见，扫描识别也更加稳定可靠。

![image](https://file.onnttf.site/2017/12/15/1.jpeg)

经过优化后的图像质量完全可以满足大多数实际应用场景的需求。

### 美化二维码

创建基础二维码后，我们可以通过多种方式对其进行美化，主要包括颜色修改、添加 `logo` 和图片拼接等功能。

#### 修改二维码颜色

二维码颜色修改的核心原理是遍历并修改图像的每个像素点。我们通过位图上下文来处理图像数据：

```objc
/**
 修改二维码颜色

 @param image 原始二维码图片
 @param red 红色通道值 (0-255)
 @param green 绿色通道值 (0-255)
 @param blue 蓝色通道值 (0-255)
 @return 修改颜色后的二维码图片
 */
+ (UIImage *)changeColorWithQRCodeImg:(UIImage *)image
                                  red:(NSUInteger)red
                                green:(NSUInteger)green
                                 blue:(NSUInteger)blue {
    const int imageWidth = image.size.width;
    const int imageHeight = image.size.height;
    size_t bytesPerRow = imageWidth * 4;
    uint32_t *rgbImageBuf = (uint32_t *)malloc(bytesPerRow * imageHeight);

    // 创建 RGB 色彩空间和位图上下文
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(rgbImageBuf, imageWidth, imageHeight, 8, bytesPerRow, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaNoneSkipLast);

    // 绘制原始图像到位图上下文
    CGContextDrawImage(context, (CGRect){CGPointZero, image.size}, image.CGImage);

    int pixelNumber = imageHeight * imageWidth;
    // 修改像素颜色
    [self changeColorOnPixel:rgbImageBuf pixelNum:pixelNumber red:red green:green blue:blue];

    // 创建新的图像
    CGDataProviderRef dataProvider = CGDataProviderCreateWithData(NULL, rgbImageBuf, bytesPerRow, ProviderReleaseData);
    CGImageRef imageRef = CGImageCreate(imageWidth, imageHeight, 8, 32, bytesPerRow, colorSpace, kCGImageAlphaLast | kCGBitmapByteOrder32Little, dataProvider, NULL, true, kCGRenderingIntentDefault);
    UIImage *resultImage = [UIImage imageWithCGImage:imageRef];

    // 释放资源
    CGImageRelease(imageRef);
    CGColorSpaceRelease(colorSpace);
    CGContextRelease(context);

    return resultImage;
}

/**
 遍历并修改像素点颜色

 @param rgbImageBuf 像素数据缓冲区
 @param pixelNum 像素总数
 @param red 红色通道值 (0-255)
 @param green 绿色通道值 (0-255)
 @param blue 蓝色通道值 (0-255)
 */
+ (void)changeColorOnPixel:(uint32_t *)rgbImageBuf
                 pixelNum:(int)pixelNum
                      red:(NSUInteger)red
                   green:(NSUInteger)green
                    blue:(NSUInteger)blue {
    uint32_t *pCurPtr = rgbImageBuf;

    for (int i = 0; i < pixelNum; i++, pCurPtr++) {
        // 识别二维码的数据点
        if ((*pCurPtr & 0xffffff00) < 0xd0d0d000) {
            uint8_t *ptr = (uint8_t *)pCurPtr;
            ptr[3] = red;
            ptr[2] = green;
            ptr[1] = blue;
        } else {
            // 将背景设为透明
            uint8_t *ptr = (uint8_t *)pCurPtr;
            ptr[0] = 0;
        }
    }
}
```

![image](https://file.onnttf.site/2017/12/15/2.jpeg)

#### 添加 logo

为二维码添加 `logo` 可以提升品牌识别度。注意 `logo` 大小要适中，避免影响二维码的识别：

```objc
/**
 为二维码添加 logo

 @param img 原始二维码图片
 @param size 目标二维码尺寸
 @param logoImg logo 图片
 @return 添加 logo 后的二维码图片
 */
- (UIImage *)getHDImgWithCIImage:(CIImage *)img
                            size:(CGSize)size
                         logoImg:(UIImage *)logoImg {
    // 计算二维码缩放比例
    CGRect extent = CGRectIntegral(img.extent);
    CGFloat scale = MIN(size.width / CGRectGetWidth(extent), size.height / CGRectGetHeight(extent));

    // 创建位图上下文
    size_t width = CGRectGetWidth(extent) * scale;
    size_t height = CGRectGetHeight(extent) * scale;
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceGray();
    CGContextRef bitmapRef = CGBitmapContextCreate(nil, width, height, 8, 0, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaNone);

    // 绘制二维码图像到上下文
    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef bitmapImage = [context createCGImage:img fromRect:extent];
    CGContextSetInterpolationQuality(bitmapRef, kCGInterpolationNone);
    CGContextScaleCTM(bitmapRef, scale, scale);
    CGContextDrawImage(bitmapRef, extent, bitmapImage);

    // 生成二维码图像
    CGImageRef scaledImage = CGBitmapContextCreateImage(bitmapRef);
    UIImage *outputImage = [UIImage imageWithCGImage:scaledImage];

    // 开始绘制 logo
    UIGraphicsBeginImageContextWithOptions(outputImage.size, NO, [[UIScreen mainScreen] scale]);
    [outputImage drawInRect:CGRectMake(0, 0, size.width, size.height)];
    // logo 居中绘制
    [logoImg drawInRect:CGRectMake((size.width - logoImg.size.width) / 2.0,
                                   (size.height - logoImg.size.height) / 2.0,
                                   logoImg.size.width,
                                   logoImg.size.height)];
    UIImage *newPic = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    // 清理资源
    CGContextRelease(bitmapRef);
    CGImageRelease(bitmapImage);
    CGImageRelease(scaledImage);
    CGColorSpaceRelease(colorSpace);

    return newPic;
}
```

#### 拼接图片

我们还可以将二维码与其他图片灵活拼接，从而实现更丰富的视觉效果。

下面的代码演示了如何将二维码与其他图片按照指定位置组合在一起：

```objc
/**
 拼接两张图片

 @param img1 底图
 @param img2 上层图片
 @param location 上层图片相对于底图的位置
 @return 拼接后的图片
 */
+ (UIImage *)spliceImg1:(UIImage *)img1
                   img2:(UIImage *)img2
          img2Location:(CGPoint)location {
    CGSize img2Size = img2.size;

    // 创建绘图上下文
    UIGraphicsBeginImageContextWithOptions(img1.size, NO, [[UIScreen mainScreen] scale]);

    // 绘制底图
    [img1 drawInRect:CGRectMake(0, 0, img1.size.width, img1.size.height)];

    // 在指定位置绘制上层图片
    [img2 drawInRect:CGRectMake(location.x, location.y, img2Size.width, img2Size.height)];

    // 获取最终拼接后的图片
    UIImage *newPic = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return newPic;
}
```

下图展示了二维码与图片素材拼接后的效果。

![image](https://file.onnttf.site/2017/12/15/3.jpeg)

通过这种灵活的组合方式，我们不仅保持了二维码的功能性，还大大提升了其视觉表现力和品牌辨识度。

在实际应用中，你可以通过以下方式进一步优化拼接效果：

- 调整图片尺寸比例，确保视觉重点突出
- 精心设计图片位置，打造合理的视觉层次
- 选择合适的背景图片，提升整体美感
- 注意保持二维码识别区域的清晰度

## 最后

本文详细介绍了如何使用苹果原生框架实现二维码的生成和美化，希望这些内容对你的工作有所帮助。
