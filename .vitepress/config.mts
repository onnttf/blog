import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import fs from 'fs'

interface Post {
    group: string
    title: string
    markdown_file_path: string
}

interface SidebarItem {
    text: string
    link: string
}

interface Sidebar {
    text: string
    items: SidebarItem[]
}

function loadPostsFromJSON(jsonPath: string): Post[] {
    const data = fs.readFileSync(jsonPath, 'utf8')
    return JSON.parse(data) as Post[]
}

function generateSidebar(postList: Post[]): Sidebar[] {
    const sidebar: Sidebar[] = []
    const sidebarItems: { [group: string]: SidebarItem[] } = {}

    postList.forEach((post) => {
        const item = { text: post.title, link: `/${post.markdown_file_path}` }
        if (sidebarItems[post.group]) {
            sidebarItems[post.group].push(item)
        } else {
            sidebarItems[post.group] = [item]
        }
    })

    const sortedGroups = Object.keys(sidebarItems).sort().reverse()

    sortedGroups.forEach((group) => {
        sidebar.push({ text: group, items: sidebarItems[group] })
    })

    return sidebar
}

const postList = loadPostsFromJSON('blog_data.json')
const sidebar = generateSidebar(postList)

export default defineConfig({
    title: "Zhang Peng's Blog",
    description: 'Just a site for blogs. :) ',
    appearance: false,
    lastUpdated: true,
    cleanUrls: true,
    rewrites: {},
    ignoreDeadLinks: true,
    themeConfig: {
        nav: [],
        sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/onnttf' }],
        search: {
            provider: 'local'
        },
        editLink: {
            text: 'Reply this post on GitHub',
            pattern: ({ filePath }) => {
                let path = 'https://github.com/onnttf/blog/discussions'
                const match = filePath.match(/\/(\d+)_/)
                if (match) {
                    const extractedNumber = match[1]
                    path += `/${extractedNumber}`
                }
                return path
            }
        },
        footer: {
            copyright: 'Copyright © 2017-present <a href="https://github.com/onnttf">Zhang Peng</a>'
        }
    },
    markdown: {
        config: (md) => {
            md.use(footnote)
        }
    }
})
