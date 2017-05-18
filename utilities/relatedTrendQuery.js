const googleTrends = require('google-trends-api');
const backDateByMonths = require('./backDate');
const sanitizeRelated = require('./sanitizeRelated');
const axios = require('axios');


// module.exports = (keyword, callback) => {
//   const options = {
//     keyword: keyword,
//     startTime: backDateByMonths(15),
//   };
//   googleTrends.interestOverTime(options)
//     .then(results => {
//       callback(null, sanitizeTrend(results));
//     })
//     .catch(err => {
//       console.log('ERROR HERE IS: ', err)
//       callback(err, null);
//     });
// }
module.exports = (trend, callback) => {
  startTime =  backDateByMonths(15)
  
  axios.get('http://dummytrend.herokuapp.com/', {
      params: {
        keyword: trend,
        startTime: startTime
      }
    })
    .then(result => {
      callback(null, sanitizeRelated(result.data));
    })
    .catch(err => {
      callback(err, null);
    })
};

