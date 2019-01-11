const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { "wordslist": oldData }
} = require("../old.json");

oldData = changeImage(oldData);

const newData = {};

newData.title = oldData.name;

newData.header = {};
newData.header.image = oldData.header_image.url;
newData.header.menuColour = changeColour(oldData.colour_scheme);

newData.subtitle = {};
newData.subtitle.subtitle = oldData.summary_content;
newData.subtitle.image = '';

newData.optionalContent = 'words';

fs.writeFileSync('./data/pages/words.json', JSON.stringify(newData, null, 2), 'utf8');