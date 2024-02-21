# 掌握书签文件：高效管理收藏

在我们日常的网络活动中，我们每天都会浏览大量的网页，为了方便管理和保存这些网址，几乎所有现代浏览器都提供了“书签”功能。而导出书签文件，是一种备份和共享书签的常见做法。本文将带您了解浏览器导出的书签文件的结构和内容，帮助您更好地理解书签文件的格式、内容和可能的应用场景。

## 书签文件的格式

书签文件是一种用于存储浏览器书签数据的文本文件，其通常采用 `HTML` 格式。它包含了您在浏览器中收藏的所有网址的标题、`URL` 和其他相关信息。下面是一个典型的书签文件的示例：

```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. -->
<DL><p>
    <DT><H3 ADD_DATE="1634454000" LAST_MODIFIED="1634454200" PERSONAL_TOOLBAR_FOLDER="true">书签栏</H3>
    <DL><p>
        <DT><A HREF="https://www.example.com" ADD_DATE="1634454300" ICON="data:image/png;base64,..." LAST_MODIFIED="1634454320">示例网站</A>
        <!-- 更多书签... -->
    </DL><p>
</DL><p>
```

主要的标签及其含义如下：

- `<DL>`：表示包含书签列表的大标签
- `<DT>`：在 `<DL>` 内，每个条目一个 `<DT>` 标签
- `<H3>`：表示书签文件夹标题的标签
- `<A>`：表示单个书签的标签，包括书签名称、`URL` 等信息

`<H3>` 和 `<A>` 标签中还包含添加时间、最后修改时间等元信息。

## 如何解析书签文件

解析书签文件时，大致分为以下几个步骤：

1. 解析书签文件，遍历每个 `<H3>` 标题标签，获得文件夹信息
2. 检查其相邻的 `<DL>` 标签，获得文件夹内的书签列表
3. 遍历 `<DL>` 内每个 `<DT>` 标签，获得书签详情
4. 检查父标签，寻找文件夹的上级目录
5. 通过递归，建立书签的目录树结构

最终，我们将得到一个类似以下结构的 `JSON` 数据：

```json
{
	"title": "书签栏",
	"bookmarks": [{
		"title": "示例网站",
		"url": "https://www.example.com",
		"addAt": "2021-10-17T15:05:00+08:00",
		"updateAt": "2021-10-17T15:05:20+08:00"
	}],
	"addAt": "2021-10-17T15:00:00+08:00",
	"updateAt": "2021-10-17T15:03:20+08:00"
}
```

### 解析书签文件

```go
// parseBookmarks extracts bookmarks from the goquery document and returns a slice of bookmark entries.
func parseBookmarks(doc *goquery.Document) []Bookmark {
	// initialize a map to store bookmarks with their titles as keys.
	bookmarkMap := make(map[string]*Bookmark)

	// helper function to parse timestamp.
	parseTime := func(timestamp string) *time.Time {
		if len(timestamp) == 0 {
			return nil
		}
		ts, err := strconv.ParseInt(timestamp, 10, 64)
		if err != nil {
			fmt.Println("error parsing timestamp:", err.Error())
			return nil
		}
		t := time.Unix(ts, 0)
		return &t
	}

	// iterate over each H3 element in the document representing bookmark titles.
	doc.Find("H3").Each(func(i int, header *goquery.Selection) {
		// create a bookmark entry for the current H3 element.
		bookmark := Bookmark{
			Title:    header.Text(),
			AddAt:    parseTime(header.AttrOr("add_date", "")),
			UpdateAt: parseTime(header.AttrOr("last_modified", "")),
		}

		// check if the header has a sibling DL element containing bookmarks.
		if dlNode := header.Next(); dlNode.Is("DL") {
			// iterate over each DT element representing sub-bookmark titles.
			dlNode.ChildrenFiltered("DT").Each(func(j int, dtNode *goquery.Selection) {
				if aNode := dtNode.Children().First(); aNode.Is("A") {
					// create a bookmark entry for each bookmark within the DL element.
					subBookmark := Bookmark{
						Title:    aNode.Text(),
						URL:      aNode.AttrOr("href", ""),
						AddAt:    parseTime(aNode.AttrOr("add_date", "")),
						UpdateAt: parseTime(aNode.AttrOr("last_modified", "")),
					}
					bookmark.Bookmarks = append(bookmark.Bookmarks, subBookmark)
				}
			})
		}

		// check if the bookmark has a parent folder (H3 element).
		if parentDL := header.Parent().Parent(); parentDL.Is("DL") && parentDL.Prev().Is("H3") {
			// set the parent field for the current bookmark.
			bookmark.Parent = parentDL.Prev().Text()
		}

		// add the bookmark to the map.
		bookmarkMap[bookmark.Title] = &bookmark
	})

	// convert the map values to a slice and return.
	bookmarks := make([]Bookmark, 0, len(bookmarkMap))
	for _, bookmark := range bookmarkMap {
		bookmarks = append(bookmarks, *bookmark)
	}
	return bookmarks
}
```

### 建立书签的目录树结构

```go
// buildTree constructs the bookmark tree by finding the root folder and building the sub-trees.
func buildTree(bookmarks []Bookmark) Bookmark {
	// function to find the root folder by looking for a bookmark without a parent.
	findRootFolder := func(bookmarks []Bookmark) *Bookmark {
		for i := range bookmarks {
			if bookmarks[i].Parent == "" {
				return &bookmarks[i]
			}
		}
		return nil
	}

	root := findRootFolder(bookmarks)
	if root == nil {
		fmt.Println("root folder not found")
		return Bookmark{}
	}

	// function to build the sub-tree recursively.
	var buildSubTree func(parent *Bookmark)
	buildSubTree = func(parent *Bookmark) {
		for i := range bookmarks {
			if bookmarks[i].Parent == parent.Title {
				parent.Bookmarks = append(parent.Bookmarks, bookmarks[i])
				buildSubTree(&parent.Bookmarks[len(parent.Bookmarks)-1])
			}
		}
	}

	// build the sub-tree for the root folder.
	buildSubTree(root)
	return *root
}
```

完整实现代码已经提交到 `GitHub`，[点此查看](https://github.com/onnttf/parse-bookmarks/blob/main/parse-bookmarks.go)。

## 解析后的书签数据能做什么

一旦您成功解析了书签文件，您可以根据自己的需求将数据应用于其他用途，比如：

- 分类和整理

   更好地组织和管理我们的书签库，帮助我们了解自己的浏览兴趣和偏好，进而优化收藏和整理方式。

- 备份和恢复

   将书签备份到本地，以防浏览器故障或更换设备时丢失书签。

- 跨浏览器同步

   如果您在多个浏览器上使用不同账号，可以将书签从一个浏览器导出，然后导入到另一个浏览器，方便同步书签。

- 分享和协作

   将书签导出后，您可以将书签文件发送给朋友或同事，让他们也能快速访问到您推荐的网页。

## 总结

书签是我们日常网络浏览不可或缺的辅助工具，了解书签文件的结构和内容可以帮助我们更好地管理、处理和利用这些书签数据。本文讲解了书签文件的格式及内容解析方法，希望可以帮助读者更好地管理浏览器中的书签数据。感谢您的阅读！

######

如果觉得本篇文章不错，麻烦给个**点赞👍、收藏🌟、分享👊、在看👀**四连！

![干货输出机](https://file.onnttf.site/wechat/qrcode.jpg)
