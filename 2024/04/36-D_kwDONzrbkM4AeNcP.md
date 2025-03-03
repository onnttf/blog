# 日历订阅源指北：创建、发布、使用

![image](https://file.onnttf.site/2024/4/18/1.jpg)

在数字化时代，日历不仅是规划日常的工具，更是提高生产力的伙伴，帮助我们合理规划时间，安排任务，及时提醒我们即将临近的重要事件。随着智能手机和电脑的普及，日历应用程序也已经发展成为我们生活中的必备工具。但是，随着信息量的激增，传统的手动日程管理方式已逐渐显得力不从心。因此，日历订阅源应运而生，它方便我们进行时间管理，帮助我们高效应对复杂日程，提升时间管理的效率。本文将详细介绍日历订阅源的概念，并阐释如何创建、发布以及使用日历订阅源。

## 什么是日历订阅源

日历订阅源是一种通过网络发布的日历数据，用户可以通过订阅链接，将各类日程事件自动同步到个人日历应用程序中，实现日程数据的自动更新和同步。用户可以按需订阅各种特定的日历，如个人日程、假期、体育赛事、会议等。这种方式让用户能轻松地将外部日程和事件与个人日历整合在一起，大大提高了时间管理和日程安排的效率。

## 常见的日历订阅源

### Exchange Calendar

[Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8) 是 Microsoft Exchange 提供的日历服务，通常与 Microsoft Outlook 配合使用。它提供了强大的团队协作功能，包括事件管理和日历共享等，使团队成员能够更加高效地协调和安排工作日程。

### CalDAV

[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 是 [WebDAV](https://en.wikipedia.org/wiki/WebDAV) 的扩展，它为客户端访问远程服务器上的日历信息提供了标准，用于客户端访问和管理日历数据。[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 可以与各种日历应用和服务集成，包括 Google Calendar、Apple Calendar 和 Microsoft Outlook 等。通过 [CalDAV](https://en.wikipedia.org/wiki/CalDAV)，用户可以实现实时更新、共享日历和访问权限管理等高级功能，为多人协作和组织日程带来了便利。

### iCalendar

[iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 是一种通用的日历数据交换格式，被广泛应用于日历应用程序之间的数据共享。[iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 文件的扩展名通常为 `.ical`、`.ics`、`.ifb` 或 `.iCalendar`。它优势在于简单易用，可以轻松地与各种日历应用程序和设备兼容。[iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 文件可以包含事件、任务、提醒以及其他日程安排，使其成为个人和团队日程管理的理想选择。

无论是 [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/)、[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 还是 [Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8)，这些都是针对日程管理和信息共享问题设计的不同的技术方案。

- [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 作为通用的日历数据交换格式，适用于简单的日程共享和导入导出操作
- [CalDAV](https://en.wikipedia.org/wiki/CalDAV) 通过 Web 协议实现了跨平台和远程访问的日历同步
- [Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8) 则提供了更加完整和高级的日历服务，适用于企业和组织内部的日程安排和协作

## 日历订阅源的制作及使用

接下来的内容中，我们将以油价调整时间为例，详细介绍如何创建一个 [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 格式的日历订阅源。

### iCalendar 的基本规范

`iCalendar` 文件由多个部分组成，其中的每个部分都以 `BEGIN:` 标识开启，并以 `END:` 标识结束。文件的主体部分是 `VCALENDAR`，它作为容器，容纳了文件中的其他所有部分。这些部分包括 `VEVENT`（用于描述事件）、`VTODO`（标记待办事项）、`VJOURNAL`（用于记录日记）以及 `VTIMEZONE`（表示时区信息）。值得一提的是，同一类型的部分可以在 `iCalendar` 文件中多次出现。举例来说，一个文件可能包含多个 `VEVENT` 部分，每个部分描述了一个独立的事件。

如果您希望更深入地理解 `iCalendar` 标准规范，我建议您查阅 [iCalendar - Design](https://en.wikipedia.org/wiki/iCalendar#Design) 和 [iCalendar (RFC 5545)](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/)，这两个链接内包含了丰富的内容。

### 编写日历订阅源

```text
BEGIN:VCALENDAR
PRODID:-//onnttf.site//油价调整时间表//CN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:油价调整时间表
X-WR-TIMEZONE:Asia/Shanghai
X-WR-CALDESC:油价调整时间表 更新时间：2024-04-18 16:12:34
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
X-LIC-LOCATION:Asia/Shanghai
BEGIN:STANDARD
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:CST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:20240103T000000_oilprice@onnttf.site
SUMMARY:油价调整
DESCRIPTION:第 1 次调整
DTSTART;VALUE=DATE:20240103
DTEND;VALUE=DATE:20240103
DTSTAMP:20240418T161234Z
STATUS:CONFIRMED
CREATED;TZID=Asia/Shanghai:20240418T161234
LAST-MODIFIED;TZID=Asia/Shanghai:20240418T161234
SEQUENCE:0
END:VEVENT
END:VCALENDAR
```

上面是一个简单的 `iCalendar` 文件，用来表示一次油价调整的情况。它包含了日历的基本信息、时区信息以及一个事件，让我们解读一下其中的信息：

- `PRODID`：这个属性用于指定生成该日历文件的产品标识符。这个标识符通常以 `-//` 作为前缀，后边跟随着的是组织名或网站域名，最后是产品或服务的名称以及语言代码。在我们的示例中，`PRODID` 的值为 `-//onnttf.site//油价调整时间表//CN`，说明该日历文件是由 `onnttf.site` 网站生成的，用于展示油价调整时间表。

- `VERSION`：这个属性代表 `iCalendar` 规范的版本，例如我们的示例中，它的版本为 `2.0`。

- `CALSCALE`：这部分定义了日历所采用的历法。在我们的示例中，`GREGORIAN` 表明我们正在使用公历作为基础。

- `METHOD`：这个字段定义了创建或更新日历数据的方法。在我们的例子中，它是 `PUBLISH`，意即是发布日历信息，将日历数据发送给订阅者。

- `VTIMEZONE`：这部分定义了时区信息。在我们的示例中，时区被设置为 `Asia/Shanghai`。

- `VEVENT`：这部分定义了事件的各种信息。在我们的示例中，这个事件是关于油价的调整。

  - `UID`：事件的唯一标识符
  - `SUMMARY`：事件的摘要，简要描述了事件的内容
  - `DESCRIPTION`：事件的详细描述
  - `DTSTART`：事件的开始时间
  - `DTEND`：事件的结束时间
  - `DTSTAMP`：事件的时间戳
  - `STATUS`：事件的状态，这里是 `CONFIRMED`，表示事件已确认
  - `CREATED`：事件的创建时间
  - `LAST-MODIFIED`：事件的最后修改时间
  - `SEQUENCE`：事件序列号

现在让我们进入下一步。首先，我们需要找出油价调整的准确时间。拿到这些信息后，我们就可以按照上文中 `VEVENT` 的格式来编写新的事件，最后将这些内容保存到 `oil_price_adjustment.ics` 文件中。完成后，可以在 [iCalendar Validator](https://iCalendar.org/validator.html) 进行格式校验，以保证我们的文件没有错误。

### 发布日历订阅源

为了更方便地让他人订阅油价调整时间表，我选择使用 GitHub 进行托管。步骤其实非常简单，只需要创建一个 `Public` 的仓库，然后将我们刚刚创建的 `oil_price_adjustment.ics` 文件上传进去。这样，任何人都可以轻松访问并订阅这份时间表了。

通过将日历订阅源发布至云端，我们能够带来更多的便利性和实时性。这种方式让用户随时随地浏览并订阅日历，一旦源文件发生更新，所有订阅者的日历就会自动进行同步，无需手动操作。无论用户所使用的设备和平台是什么，他们都可以轻松获取到这些日历订阅源，使得信息的共享和传播过程变得更加便捷和高效。

### 使用日历订阅源

下面以苹果日历应用为例：

1. 在您的苹果电脑上，找到并打开日历应用程序
2. 点击菜单栏中的"文件"选项
3. 在文件菜单中选择"新建日历订阅"
4. 在弹出的窗口中，输入想要订阅的链接，如：<https://raw.githubusercontent.com/onnttf/calendar/main/oil_price_adjustment.ics>
5. 输入完毕后，点击"订阅"即可
6. 可以根据您的个人需要调整一些设置，例如更新频率、提醒设置等
7. 在完成以上步骤后，点击"好"或"完成"按钮，即可完成订阅

现在，您可以在日历应用中查看油价调整信息了。

> 除了苹果日历应用，您也可以选择其他支持订阅功能的日历应用，例如 Google Calendar、Microsoft Outlook 等。

## 最后

2024 年油价调整时间表已创建完成并上传至[此仓库](https://github.com/onnttf/calendar)。该时间表将持续更新，您可通过订阅 <https://raw.githubusercontent.com/onnttf/calendar/main/oil_price_adjustment.ics> 获取最新的调整信息。
