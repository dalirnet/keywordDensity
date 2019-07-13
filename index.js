let vorpal = require('vorpal')();
let figlet = require('figlet');

vorpal
  .command('http <url>', 'Find keyword')
  .action(function (args, callback) {
    callback();
  });



figlet('K e y w o r d', function (err, data) {
  if (err) {
    return;
  } else {
    console.log(data);
  }
  vorpal.delimiter('#').show();
});