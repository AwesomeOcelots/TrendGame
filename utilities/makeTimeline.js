const queryTrend = require('./trendQuery.js');
const findPeaks = require('./peakAlgo.js');
const getNews = require('./aylienApi');
const makeFinalData = require('./stitchData');
const queryRelated = require('./relatedTrendQuery');

const makeTimeline = (searchString, callback) => {
  
  queryTrend(searchString, (err, timeSeries) => {
    if (err) {
      callback(err, null);
    } else {
      queryRelated(searchString, (err, related) => {
        if (err) {
          callback(err, null);
        } else {
          const peaks = findPeaks(timeSeries);       
          getNews(searchString, peaks, 'title', (err, peakStories) => {
            if (err) {
              callback(err, null);
            } else if (peakStories[0].stories[0] === undefined) {
              getNews(searchString, peaks, 'body', (err, peakStories) => {
                if (err) {
                  callback(err, null);
                } else {
                  const response = makeFinalData(timeSeries, peakStories, searchString, related);
                  callback(null, response);
                }
              });
            } else {
              const response = makeFinalData(timeSeries, peakStories, searchString, related);
              callback(null, response);
            }
          });
        }
      })
    }
  });
};

module.exports = makeTimeline;
