const failed = require('./failed.json');
const fs = require('fs');

const result = failed.urls.map(f => ({ old: f, n: '' }))
console.log(fledailed);
fs.writeFileSync('./failed.json', JSON.stringify(result, null, 2), 'utf8');
