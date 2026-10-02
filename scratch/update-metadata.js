const fs = require('fs');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Skip if it doesn't have openGraph or already has images explicitly defined
      if (!content.includes('openGraph: {') || content.includes('images: [')) continue;
      
      content = content.replace(/openGraph: \{([\s\S]*?)\}(,)?/g, (match, p1, p2) => {
         return `openGraph: {${p1}  images: ['/opengraph-image'],\n  }${p2 || ''}`;
      });
      content = content.replace(/twitter: \{([\s\S]*?)\}(,)?/g, (match, p1, p2) => {
         return `twitter: {${p1}  images: ['/opengraph-image'],\n  }${p2 || ''}`;
      });

      fs.writeFileSync(fullPath, content);
      console.log('Updated ' + fullPath);
    }
  }
}

processDir('./app');
