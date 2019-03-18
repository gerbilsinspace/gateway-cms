const https = require('https');
const fetch = require('isomorphic-fetch');
const sound = require('music-metadata');
const fs = require('fs');
const util = require('util');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, async function(res) {
      switch (res.statusCode) {
        case 200:
          return resolve(res);
        case 302:
          return httpGet(res.headers.location);
        default:
          return reject(new Error('Unexpected statusCode: ' + res.statusCode));
      }
    });
  });
}

(async () => {
  const wordsRequest = await fetch(
    'http://gateway-cms.netlify.com/data/words/index.json',
  );
  const wordsData = await wordsRequest.json();
  const podcasts = Object.entries(wordsData).filter(
    word => word[1].data.showOnPodcast,
  );

  // Setting podcastFile section
  podcasts.forEach(word => {
    const wordData = word[1];
    const localDirectory = `./data/words/${word[0]}`;

    if (
      !wordData.podcastFile ||
      wordData.podcastFile !== (wordData.audioFile || wordData.file)
    ) {
      const fileData = JSON.parse(fs.readFileSync(localDirectory, 'utf-8'));

      fileData.podcastFile = fileData.audioFile || fileData.file;

      fs.writeFileSync(
        localDirectory,
        JSON.stringify(fileData, null, 2),
        'utf-8',
      );
    }
  });

  let showData = false;
  podcasts.forEach(async (podcast, index) => {
    const item = podcast[1];

    const podcastFile = item.data.podcastFile || '';

    if (podcastFile.length && podcastFile.includes('aws')) {
      const httpData = await httpGet(podcastFile).catch(e => e);
      if (httpData.statusCode === 200) {
        const contentLength = httpData.headers['content-length'];
        const contentType = httpData.headers['content-type'];

        const data = JSON.parse(
          fs.readFileSync('./data/words/' + podcast[0], 'utf-8'),
        );

        const {
          format: {duration},
        } = await sound.parseStream(httpData, contentType);
        data.contentLength = contentLength;
        data.contentType = contentType;
        data.duration = duration;
        fs.writeFileSync(
          './data/words/' + podcast[0],
          JSON.stringify(data, null, 2),
          'utf-8',
        );
      }
    }
  });
})();
