const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const constant = require('./constant')

function discussionToBlog(discussion) {
    const createdAtInCST = dayjs(discussion.createdAt).utcOffset(8)
    const updatedAtInCST = dayjs(discussion.updatedAt).utcOffset(8)

    const year = createdAtInCST.year()
    const month = createdAtInCST.month() + 1

    const key = `${discussion.number}_${discussion.id}`
    const category = discussion.category

    const blog = {
        key,
        title: discussion.title.trim(),
        category: {
            emoji: category.emoji,
            emojiHTML: category.emojiHTML,
            id: category.id,
            name: category.name,
            slug: category.slug,
            url: `${constant.GITHUB_SERVER_URL}/${constant.GITHUB_REPOSITORY}/discussions/categories/${category.slug}?discussions_q=`,
            display: `${category.emojiHTML ? category.emojiHTML.match(/>(.*?)</)?.[1] + ' ' : ''}${
                category.name || ''
            }`
        },
        labels: discussion.labels.nodes
            ? discussion.labels.nodes.map((label) => ({
                  id: label.id,
                  name: label.name,
                  url: `${constant.GITHUB_SERVER_URL}/${constant.GITHUB_REPOSITORY}/discussions?discussions_q=label%3A${label.name}`
              }))
            : [],
        group:
            category.slug !== constant.Discussion.Category.ANNOUNCEMENTS
                ? `${year}/${month}`
                : category.name,
        // author: discussion.author.login,
        author: 'ZHANG PENG',
        discussion_url: discussion.url,
        // discussion_file_path: `discussions/${year}/${month}/${key}.json`,
        // markdown_file_path: `${year}/${month}/${key}.md`,
        created_at: createdAtInCST.format(),
        updated_at: updatedAtInCST.format()
    }

    return blog
}

module.exports = {
    discussionToBlog: discussionToBlog
}
