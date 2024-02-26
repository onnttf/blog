const { promises: fs } = require('fs')
const path = require('path')

async function writeFile(filePath, data) {
    try {
        const directory = path.dirname(filePath)
        await fs.mkdir(directory, { recursive: true })
        await fs.writeFile(filePath, data)
    } catch (error) {
        console.error(`Error writing file ${filePath}, error: ${error.message}`)
        throw error
    }
}

async function readFile(filePath) {
    try {
        const absolutePath = path.resolve(__dirname, filePath)
        const fileData = await fs.readFile(absolutePath, 'utf-8')
        return fileData
    } catch (error) {
        console.error(`Error reading file ${filePath}, error: ${error.message}`)
        throw error
    }
}

module.exports = {
    writeFile: writeFile,
    readFile: readFile
}
