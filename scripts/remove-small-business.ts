import fs from 'fs'
import path from 'path'

const DIRECTORIES = ['app', 'lib', 'data', 'components', 'sanity']
const FILE_EXTENSIONS = ['.ts', '.tsx']

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    if (isDirectory) {
      walkDir(dirPath, callback)
    } else {
      callback(dirPath)
    }
  })
}

function processFile(filePath: string) {
  if (!FILE_EXTENSIONS.some((ext) => filePath.endsWith(ext))) return

  const originalContent = fs.readFileSync(filePath, 'utf-8')
  
  let newContent = originalContent
    // Plural replacements
    .replace(/Small Businesses/g, 'Businesses')
    .replace(/Small businesses/g, 'Businesses')
    .replace(/small businesses/g, 'businesses')
    // Singular replacements
    .replace(/Small Business/g, 'Business')
    .replace(/Small business/g, 'Business')
    .replace(/small business/g, 'business')

  if (originalContent !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`Updated: ${filePath}`)
  }
}

DIRECTORIES.forEach((dir) => {
  walkDir(path.join(process.cwd(), dir), processFile)
})

console.log('Finished updating files.')
