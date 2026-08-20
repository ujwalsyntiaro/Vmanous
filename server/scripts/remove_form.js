const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../../frontend/src/pages/Enroll.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const PROGRAM_OPTIONS = \[\s*\{ value: 'AI Summit'[\s\S]*?\];\s*/, '');

content = content.replace(/  const \[isDropdownOpen[\s\S]*?const handleSubmit = \(e\) => \{[\s\S]*?\}, 1200\);\n  };\n/, '');

content = content.replace(/setFormData\(prev => \(\{ \.\.\.prev, programInterest: 'AI Summit' \}\)\);\s*document\.getElementById\('enrollment-form'\)\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);/, "navigate('/payment');");

content = content.replace(/      \{\/\* 04 INTERACTIVE APPLICATION FORM \*\/\}[\s\S]*?<\/section>\s*/, '');

fs.writeFileSync(file, content);
console.log("File updated successfully.");
