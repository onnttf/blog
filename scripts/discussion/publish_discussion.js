const { publishDiscussion } = require('./data')
const { readFile } = require('./util')
const constant = require('./constant')

async function main() {
    const blogData = JSON.parse(await readFile('../../blog_data.json'))
    for (let index = 0; index < blogData.length; index++) {
        const element = blogData[index]
        const markdown = await readFile('../../' + element.markdown_file_path)
        const titleAndBelowRegex = /# (.+)([\s\S]+)/
        const match = markdown.match(titleAndBelowRegex)
        if (!match) {
            console.log(
                `Title and body not found, markdown_file_path: ${element.markdown_file_path}`
            )
            continue
        }
        const title = match[1].trim()
        const body = match[2].trim() + '\n'

        console.log('Title:', title)
        console.log('Body:', body)

        publishDiscussion(constant.GITHUB_TOKEN, element.id, title, body)
    }
}

main()
