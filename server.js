var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var express = require('express')
var app = express()
var db = null

// watcher

var Watcher  = require('feed-watcher'),
  feed     = 'https://www.neues-deutschland.de/rss/neues-deutschland.xml',
  interval = 60 * 60 * 6 // hours

// if not interval is passed, 60s would be set as default interval.
var watcher = new Watcher(feed, interval)

// Check for new entries every n seconds.
watcher.on('new entries', (entries) => {
  entries.forEach((entry) => {
    try {
      db.collection('news').updateOne({title:entry.title},{$set:entry},{upsert:true})
    } catch (e) {
      console.log(e);
    }
  })      
})


// routes
MongoClient.connect(process.env.mongourl,(err,database) => {
  assert.equal(err,null)
  db = database.db('deutschunterricht')
  //db = database.db('deutschunterricht')

  // Start watching the feed.
  watcher
    .start()
    .then((entries) => {
      entries.forEach((entry) => {
        try {
          db.collection('news').updateOne({title:entry.title},{$set:entry},{upsert:true})
        } catch (e) {
          console.log(e);
        }
      })      
    })
    .catch((error) => {
      console.error(error)
    })    
})

app.get('/', (req,res) => {
  db.collection('news').find({}).toArray((err,doc) => {
    assert.equal(err,null)
    res.send(JSON.stringify(doc))
  })
})

app.listen(3000,() => {
  console.log('Listening on port 3000')
})