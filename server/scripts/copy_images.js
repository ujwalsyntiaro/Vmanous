const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\a\\.gemini\\antigravity-ide\\brain\\b1b7c8a9-98f4-4211-b744-d2738eb7dabf';
const destDir = path.join(__dirname, '../../frontend/public/images/home-gallery');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.startsWith('ai_summit_keynote_jpg_') && file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'ai-summit-keynote.png'));
  } else if (file.startsWith('ai_research_lab_jpg_') && file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'ai-research-lab.png'));
  } else if (file.startsWith('neural_network_lab_jpg_') && file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'neural-network-lab.png'));
  } else if (file.startsWith('cloud_ai_datacenter_jpg_') && file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'cloud-ai-datacenter.png'));
  }
});

console.log("Images copied successfully.");
