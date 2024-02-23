const { graphql } = require('@octokit/graphql')
const { promises: fs } = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const { old_blog, fetchDiscussions } = require('./data')
const { writeFile } = require('./util')
const { discussionToBlog } = require('./format')
const constant = require('./constant')

dayjs.extend(utc)

const categoryOrder = {
    [constant.Discussion.Category.ANNOUNCEMENTS]: -1,
    [constant.Discussion.Category.SHOWANDTELL]: 1
}

async function main() {
    const [username, repoName] = constant.GITHUB_REPOSITORY.split('/')

    console.log('Fetching discussions...')
    const allDiscussions = await fetchDiscussions(constant.GITHUB_TOKEN, username, repoName)
    console.log('Fetched', allDiscussions.length, ' discussions.')

    const finalDiscussions = []
    for (const v of allDiscussions) {
        if (v.authorAssociation !== constant.Discussion.AuthorAssociation.OWNER) {
            continue
        }
        finalDiscussions.push(v)
    }

    const category2BlogList = {
        old: old_blog
    }
    const blogKey2Discussion = {}

    for (const v of finalDiscussions) {
        const blog = discussionToBlog(v)
        blogKey2Discussion[blog.key] = v

        const categorySlug = blog.category.slug || 'default'

        if (!category2BlogList[categorySlug]) {
            category2BlogList[categorySlug] = []
        }

        category2BlogList[categorySlug].push(blog)
    }

    for (const categorySlug in category2BlogList) {
        category2BlogList[categorySlug].sort((a, b) => {
            if (a.updated_at === b.updated_at) {
                const createdAtA = dayjs(a.created_at)
                const createdAtB = dayjs(b.created_at)
                return createdAtB.diff(createdAtA)
            }
            const updatedAtA = dayjs(a.updated_at)
            const updatedAtB = dayjs(b.updated_at)
            return updatedAtB.diff(updatedAtA)
        })
    }

    const sortedDiscussions = Object.keys(category2BlogList)
        .sort((a, b) => {
            const orderA = categoryOrder[a] || Number.MAX_SAFE_INTEGER
            const orderB = categoryOrder[b] || Number.MAX_SAFE_INTEGER
            return orderA - orderB
        })
        .map((category) => category2BlogList[category] || [])
        .flat()

    const writePromises = []
    const readmeContents = []
    const summaryContents = {}

    writePromises.push(writeFile('archive_data.json', JSON.stringify(sortedDiscussions, null, 2)))

    for (const v of sortedDiscussions) {
        const discussion = blogKey2Discussion[v.key]
        if (!discussion) {
            continue
        }

        writePromises.push(writeFile(v.discussion_file_path, JSON.stringify(discussion, null, 2)))

        const labels = v.labels.map((label) => label.name).join(', ')

        const metadata = {
            author: v.author,
            category: v.category.display,
            labels: labels,
            discussion: v.discussion_url,
            updatedAt: v.updated_at
        }

        const frontMatter = Object.entries(metadata)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')

        const markdownTitle = `# ${discussion.title.trim()}`
        const markdownBody = discussion.body.trim()

        const markdownData = `---\n${frontMatter}\n---\n\n${markdownTitle}\n\n${markdownBody}\n`

        writePromises.push(writeFile(v.markdown_file_path, markdownData))
    }

    for (const v of sortedDiscussions) {
        const categoryInREADME = v.category.id ? `[${v.category.display}](${v.category.url})` : '-'
        const labelsInREADME = v.labels.map((label) => `[${label.name}](${label.url})`).join(', ')
        readmeContents.push([
            categoryInREADME || '-',
            `[${v.title}](${v.markdown_file_path})`,
            labelsInREADME || '-',
            v.updated_at || '-'
        ])
        const contents = summaryContents[v.group] || []
        contents.push(`[${v.title}](${v.markdown_file_path})`)
        summaryContents[v.group] = contents
    }

    let README = '# README\n\n'
    README += 'Just a repository for blogs. :)\n\n'
    README += '## Table of Contents\n\n'
    README += '| Category | Article | Labels | Last Updated |\n'
    README += '| --- | --- | --- | --- |\n'

    readmeContents.forEach((v) => {
        README += `| ${v[0]} | ${v[1]} | ${v[2]} | ${v[3]} |\n`
    })

    README += '\n如果觉得文章不错，可以关注公众号哟！\n\n'
    README += '![干货输出机](https://file.onnttf.site/wechat/qrcode.jpg)\n'

    writePromises.push(writeFile('README.md', README))

    const groups = Object.keys(summaryContents).sort((a, b) => {
        return dayjs(b, { format: 'YYYY/MM' }).diff(dayjs(a, { format: 'YYYY/MM' }))
    })

    let SUMMARY = '# SUMMARY\n\n'
    let lastGroup = ''
    for (let index = 0; index < groups.length; index++) {
        const group = groups[index]
        if (lastGroup !== group) {
            SUMMARY += `- [${group}](${group})\n`
        }
        const contents = summaryContents[group]
        for (let j = 0; j < contents.length; j++) {
            const content = contents[j]
            SUMMARY += `  - ${content}\n`
        }
        lastGroup = group
    }

    writePromises.push(writeFile('SUMMARY.md', SUMMARY))

    await Promise.all(writePromises)

    console.log('Done. Total discussions:', finalDiscussions.length)
}

main()
