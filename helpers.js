const fs = require('fs');
const path = require('path');
const glob = require('glob');

const getDataPromise = (filename, includeIndex = false) =>
  new Promise(resolve => {
    if (!includeIndex && filename.includes('index.json')) {
      return resolve();
    }

    if (includeIndex) {
      const data = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, 'data', filename, 'index.json'),
          'utf8',
        ),
      );
      return resolve(data);
    } else {
      const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

      const slug = data.title
        .toLowerCase()
        .split('(')
        .join('')
        .split(')')
        .join('')
        .split('%26')
        .join('')
        .split('%27')
        .join('')
        .split('.')
        .join('')
        .split('?')
        .join('')
        .split(',')
        .join('')
        .split("'")
        .join('')
        .split('!')
        .join('')
        .trim()
        .split(' ')
        .join('-');

      const result = {
        ...data,
        slug,
      };

      return resolve(result);
    }
  });

const getFileNamesPromise = type =>
  new Promise((resolve, reject) => {
    glob(path.join(__dirname, 'data', type, '*'), (error, files) => {
      if (error) {
        return reject();
      }
      return resolve(files);
    });
  });

const writeFile = (type, fileName, data) => {
  fs.writeFileSync(
    path.join(__dirname, 'data', type, fileName),
    JSON.stringify(data, null, 2),
    'utf8',
  );
};

const flatten = arr => {
  return [].concat(...arr);
};

exports.getDataPromise = getDataPromise;
exports.getFileNamesPromise = getFileNamesPromise;
exports.writeFile = writeFile;
exports.flatten = flatten;
