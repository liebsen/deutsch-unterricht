  var Watcher  = require('feed-watcher'),
      feed     = 'https://www.neues-deutschland.de/rss/neues-deutschland.xml',
      interval = 30 // seconds

  // if not interval is passed, 60s would be set as default interval.
  var watcher = new Watcher(feed, interval)

  // Check for new entries every n seconds.
  watcher.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      console.log(entry.title)
    })
  })

  // Start watching the feed.
  watcher
    .start()
    .then(function (entries) {
      //console.log(entries)
      entries.forEach(function (entry) {
        console.log(entry.title)
      })      
    })
    .catch(function(error) {
      console.error(error)
    })

  // Stop watching the feed.
  //watcher.stop()