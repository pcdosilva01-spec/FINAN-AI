const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const matches = js.match(/el\("([^"]+)"\)/g) || [];
const ids = [...new Set(matches.map(m => m.replace(/el\("|"\)/g, '')))];
const missing = ids.filter(id => !html.includes('id="' + id + '"'));
console.log('Total IDs no JS:', ids.length);
console.log('Ausentes no HTML:', missing.length ? missing.join(', ') : 'nenhum');
