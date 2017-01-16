var express = require('express');
var router = express.Router();
var StreamZip = require('node-stream-zip');
var ansilove = require('../lib/ansilove');
exports.AnsiLove = ansilove;

/* GET home page. */
router.get('/', function(req, res, next) {
  var source = '\\projects\\sixteencolors-archive\\2013\\blocktronics_AWAKEN.zip';
  var destination = '\\projects\\sixteencolors-cache\\2013\\blocktronics_AWAKEN';
  var zip = new StreamZip({
    file: source,
    storeEntries: true
  });

  zip.on('error', function(err) { console.log(err); });
  zip.on('ready', function() {
    console.log('Entries read: ' + zip.entriesCount);
    // extract all
    zip.extract(null, destination, function(err, count) {
        console.log('Extracted ' + count + ' entries ');
    });

        // var filenames = zip.entries().map(function(file) {
    //   return file.key;
    // })
    var filenames = new Array();
    for (var entry in zip.entries()) {
      filenames.push(entry);
    }

    console.log(JSON.stringify(filenames));
    // read file as buffer in sync way
    // var data = zip.entryDataSync('README.md');
  });

  zip.on('extract', function(entry, file) {
    console.log('Extracted ' + entry.name + ' to ' + file);    
  });
  zip.on('entry', function(entry) {
      // called on load, when entry description has been read
      // you can already stream this entry, without waiting until all entry descriptions are read (suitable for very large archives)
      console.log('Read entry ', entry.name);
      console.log(zip.entryDataSync(entry));
      console.log(AnsiLove.sauceBytes(zip.entryDataSync(entry)));
  });

  res.render('importer', { title: 'Express' });
});


module.exports = router;
