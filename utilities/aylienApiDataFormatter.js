const dateFormat = require('dateformat');

const formatAylienData = (data) => {

  let dataParsed = {};

  try {
    dataParsed = JSON.parse(data);
  } catch (e) {
    dataParsed = data;
  }

  return dataParsed.stories.map((story) => {
    let formattedStory = {};
    formattedStory.headline = story.title;
    formattedStory.date = dateFormat(story.publishedAt, 'mmmm dS, yyyy');
    formattedStory.url = story.links.permalink;
    if (story.media && story.media.length > 0) {
      formattedStory.media = story.media[0].url;
    }
    formattedStory.summary = story.summary.sentences[0];
    return formattedStory;
  });

};

module.exports = formatAylienData;
