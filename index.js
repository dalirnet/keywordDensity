let vorpal = require('vorpal')();

vorpal
  .command('duck [path] [width] [height]', 'Outputs "rabbit"')
  .action(function (args, callback) {
    this.log('تست', args);
    callback();
  });

vorpal.delimiter('keywordDensity$').show();