const getNews = require('./aylienApi');

module.exports = (direction, queryString, time, callback) => {
  if (direction === 'prev') {
    time = parseInt(time) - 604800;
  } else {
    time = parseInt(time) + 604800;
  }
  time = [[time]];
  queryString = '"' + queryString.toLowerCase() + '"';

  getNews(queryString, time, 'title', (err, newStories) => {
    if (err) {
      callback(err, null);
    } else if (newStories[0].stories[0] === undefined) {
      getNews(queryString, time, 'body', (err, newStories) => {
        if (err) {
          callback(err, null);
        } else {
          console.log('NEW BODY STORIES: ', newStories)
          callback(null, newStories);
        }
      })
    } else {
      console.log('NEW TITLE STORIES: ', newStories)
      callback(null, newStories);
    }
  })
}