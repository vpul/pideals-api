/* eslint-disable global-require */
const metascraper = require('metascraper')([
  require('metascraper-image')(),
  require('metascraper-logo')(),
]);

const axios = require('axios');

const getPreviewImage = async (targetUrl) => {
  try {
    if (targetUrl.substring(0, 4) !== 'http') {
      targetUrl = 'http://' + targetUrl;
    }

    const response = await axios(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:77.0) Gecko/20100101 Firefox/77.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip',
        DNT: '1',
        Connection: 'close',
      },
      maxContentLength: 10000000, // 10 mb
      timeout: 12000, // 12 second timeout
    });
    const url = response.request.res.responseUrl;
    const html = response.data;
    const metadata = await metascraper({ html, url });
    return metadata.image || metadata.logo;
  } catch (err) {
    // sentry logger
    return null;
  }
};

module.exports = getPreviewImage;
