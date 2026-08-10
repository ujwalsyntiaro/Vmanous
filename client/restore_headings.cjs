const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  let finalContent = originalContent;
  finalContent = finalContent.replace(/<(h[1-6])([^>]*)>/g, (match, tag, attrs) => {
     // Remove the 4xl text classes
     let newAttrs = attrs.replace(/\btext-4xl\b/g, '');
     newAttrs = newAttrs.replace(/\bmd:text-4xl\b/g, '');
     newAttrs = newAttrs.replace(/\blg:text-4xl\b/g, '');
     newAttrs = newAttrs.replace(/\bsm:text-4xl\b/g, '');
     
     // Determine responsive classes based on tag
     let sizeClass = '';
     if (tag === 'h1') {
       sizeClass = 'text-3xl md:text-5xl';
     } else if (tag === 'h2') {
       sizeClass = 'text-2xl md:text-4xl';
     } else if (tag === 'h3') {
       sizeClass = 'text-xl md:text-2xl';
     } else if (tag === 'h4') {
       sizeClass = 'text-lg md:text-xl';
     } else if (tag === 'h5') {
       sizeClass = 'text-base font-bold';
     } else if (tag === 'h6') {
       sizeClass = 'text-sm font-bold uppercase';
     }
     
     if (newAttrs.includes('className=')) {
         newAttrs = newAttrs.replace(/className=["']/, 'className="' + sizeClass + ' ');
     } else {
         newAttrs += ' className="' + sizeClass + '"';
     }
     
     // clean up multiple spaces
     newAttrs = newAttrs.replace(/\s+/g, ' ');
     return '<' + tag + newAttrs + '>';
  });
  
  if (finalContent !== originalContent) {
    fs.writeFileSync(filePath, finalContent);
    console.log('Restored:', filePath);
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

processDirectory('./src/components');
processDirectory('./src/pages');
console.log('Done');
