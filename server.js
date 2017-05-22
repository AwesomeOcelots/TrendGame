const makeTimeline = require('./utilities/makeTimeline');
const queries = require('./db/queries');
const cleanData = require('./utilities/cleanSearch');
const changeStories = require('./utilities/changeStories');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var worker = require('./workers/worker');

const app = express();
const IP = '127.0.0.1';
const PORT = process.env.PORT || 8080;

//sessions and oauth passport stuff
const passport = require('passport');
const session = require('express-session');
const Router = require('react-router');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/public'));
app.use(morgan('tiny'));

//passport config and implementation
app.use(session({secret: 'dogsareawesome',
				 saveUninitialized: true,
				 resave: true}));
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());

worker.worker(`http://${IP}:${PORT}/api/worker`);

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Listening on ${IP}:${PORT}`);
  });
}

app.get('/api', (req, res) => {
  res.send({
    version: '0.0.1'
  });
})

app.get('/api/timeline', (req, res) => {
  let trend = req.query.q;
  trend = cleanData.prepForAylien(trend);
  
  makeTimeline(trend, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  })
});

app.get('/api/stories', (req, res) => {
  var direction = req.query.direction;
  var trend = req.query.trend;
  var time = req.query.time; 
  changeStories(direction, trend, time, (err, data) => {
    if (err) {
      res.send(500, err);
    } else {
      res.send(200, data);
    }
  })
});

app.post('/api/history', (req, res) => {
  let trend = req.body.search;

  if (cleanData.checkIsReadyForDb(trend)) {
    trend = cleanData.prepForDb(trend);

    queries.insertSearch(trend, (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    });
  } else {
    res.status(400).send();
  }
});

app.get('/api/history', (req, res) => {
  queries.getSearches(10, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/api/worker', (req, res) => {
  res.send("Im awake!!");
});

//The following are authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/home',
	                                      failureRedirect: '/login' }));

app.get('/auth/google', passport.authenticate('google', {scope: ['profile','email']}));

app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/home',
	                                      failureRedirect: '/login' }));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
	  passport.authenticate('twitter', { successRedirect: '/home',
	                                      failureRedirect: '/login' }));


app.use((req, res) => {
  res.status(404);
  res.sendFile(__dirname + '/client/public/404.html');
});
module.exports = app;
