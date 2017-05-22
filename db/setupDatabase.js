//set up the database if not exist
// This file should be run once from the command line to initialize the db schema.  Be sure to edit the url const with the target url.
const pg = require('pg');

const url = '127.0.0.1';

var db = require('knex')({
  client: 'pg',
  connection: {
  host: '127.0.0.1',
  user: 'sim',
  password: '',
  database: 'trendgame'
}
});

db.schema.hasTable('trends').then(function (exists) {
  if (!exists) {
    db.schema.createTable('trends', function (trend) {
      trend.increments('id').primary();
      trend.string('name');
      trend.timestamps(true, true);
    }).then(function (table) {
      console.log('Created Table trends');
    });
  }
});
db.schema.hasTable('weeks').then(function (exists) {
  if (!exists) {
    db.schema.createTable('weeks', function (week) {
      week.increments('id').primary();
      week.string('startDate');
      week.integer('popularity');
      week.integer('trendId').unsigned();
      week.foreign('trendId').references('trends.id');
    }).then(function (table) {
      console.log('created Table weeks');
    });
  }
});
db.schema.hasTable('stories').then(function (exists) {
  if (!exists) {
    db.schema.createTable('stories', function (story) {
      story.increments('id').primary();
      story.string('articleName', 500);
      story.string('mediaUrl', 200);
      story.string('url', 500);
      story.string('previewText', 1000);
      story.integer('weeksId').unsigned();
      story.foreign('weeksId').references('weeks.id');
    }).then(function (table) {
      console.log('created Table stories');
    });
  }
});
//authentication table user storage thing a ma jig
db.schema.hasTable('facebook').then((exists)=> {
 if(!exists) {
   db.schema.createTable('facebook', (facebook) => {
     facebook.string('id');
     facebook.string('token');
     facebook.string('name');
     facebook.string('email');
   }).then( (table) =>{
     console.log('created Table facebook');
   });
 }
});

db.schema.hasTable('google').then((exists)=> {
 if(!exists) {
   db.schema.createTable('google', (google) => {
     google.string('id');
     google.string('token');
     google.string('name');
     google.string('email');
   }).then( (table) =>{
     console.log('created Table google');
   });
 }
});

db.schema.hasTable('twitter').then((exists)=> {
 if(!exists) {
   db.schema.createTable('twitter', (twitter) => {
     twitter.string('id');
     twitter.string('token');
     twitter.string('name');
     twitter.string('displayName');
   }).then( (table) =>{
     console.log('created Table twitter');
   });
 }
});