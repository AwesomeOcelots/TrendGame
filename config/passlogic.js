var db = require('../db/config');

db('facebook').select('*').then((data)=> {
  console.log(data.length);
})

