const fs = require('fs');
const glob = require('glob'); // Not available by default, I'll use recursive function

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('https://motionbite.com')) {
        // Only replace literal 'https://motionbite.com' strings in metadata
        content = content.replace(/https:\/\/motionbite\.com/g, 'https://www.motionbite.com');
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('./app');
