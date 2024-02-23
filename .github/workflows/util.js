const { promises: fs } = require('fs')
const path = require('path')

async function writeFile(filePath, data) {
    try {
        const directory = path.dirname(filePath)
        await fs.mkdir(directory, { recursive: true })
        await fs.writeFile(filePath, data)
    } catch (error) {
        console.log(`Error writing file ${filePath}, error: ${error.message}`)
        throw error
    }
}

module.exports = {
    writeFile: writeFile
}
