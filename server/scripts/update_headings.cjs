const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  let finalContent = originalContent;
  finalContent = finalContent.replace(/<(h[1-6])([^>]*)>/g, (match, tag, attrs) => {
     let newAttrs = attrs.replace(/\btext-\w+xl\b/g, '');
     newAttrs = newAttrs.replace(/\bmd:text-\w+xl\b/g, '');
     newAttrs = newAttrs.replace(/\blg:text-\w+xl\b/g, '');
     newAttrs = newAttrs.replace(/\bsm:text-\w+xl\b/g, '');
     
     // add text-3xl md:text-4xl to className
     if (newAttrs.includes('className=')) {
         newAttrs = newAttrs.replace(/className=["']/, 'className="text-4xl md:text-4xl ');
     } else {
         newAttrs += ' className="text-4xl md:text-4xl"';
     }
     
     // clean up multiple spaces
     newAttrs = newAttrs.replace(/\s+/g, ' ');
     return '<' + tag + newAttrs + '>';
  });
  
  if (finalContent !== originalContent) {
    fs.writeFileSync(filePath, finalContent);
    console.log('Updated:', filePath);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

processDirectory('../frontend/src/components');
processDirectory('../frontend/src/pages');
console.log('Done');
