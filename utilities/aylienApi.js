const AylienNewsApi = require('aylien-news-api');
const epoch = require('epoch.js');

const formatStories = require('./aylienApiDataFormatter');

const getStories = (queryString, peaks, scope, callback) => {
  console.log('PARAMS HERE:', queryString, peaks, scope, callback)
  // Format date query for API
  // 604800000 is 1 week in milliseconds
  console.log(peaks[0][0])
  const peakDate = new Date(peaks[0][0] * 1000);
  const peakEndDate = new Date(peaks[0][0] * 1000 + 604800000);
  let formattedPeakDate = epoch(peakDate).format('YYYY[-]MM[-]DD[T]hh[:]mm[:]ss[Z]');
  let formattedPeakEndDate = epoch(peakEndDate).format('YYYY[-]MM[-]DD[T]hh[:]mm[:]ss[Z]');

  // Establish API instance and supply credentials
  const apiInstance = new AylienNewsApi.DefaultApi();

  let apiInfo;
  try {
    apiInfo = require('../lib/env/aylienApiKeys');
  } catch (e) {
    apiInfo = {};
  }

  let appId = apiInstance.apiClient.authentications['app_id'];
  if (process.env.AYLIEN_ID) {
    appId.apiKey = process.env.AYLIEN_ID;
  } else {
    appId.apiKey = apiInfo.id;
  }

  let appKey = apiInstance.apiClient.authentications['app_key'];
  if (process.env.AYLIEN_KEY) {
    appKey.apiKey = process.env.AYLIEN_KEY;
  } else {
    appKey.apiKey = apiInfo.key;
  }

  // Assign options for API query
  let opts = {
    'sortBy': 'source.links_in_count',
    'language': ['en'],
    'publishedAtStart': formattedPeakDate,
    'publishedAtEnd': formattedPeakEndDate,
    'perPage': 10
  };

  opts[scope] = queryString;
  console.log('OPTIONS GOING TO AYLIEN: ', opts)
  apiInstance.listStories(opts, (error, data, response) => {
    if (error) {
      callback(error, null);
    } else {
      //console.log('FROM AYLIEN: ', data)
      const formattedStories = formatStories(data);
      let finalData = [];
      finalData.push({
        date: peaks[0][0],
        stories: formattedStories
      });
      callback(null, finalData);
    }
  });
};

module.exports = getStories;
