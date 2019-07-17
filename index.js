const open = require('open');
const server = require('server');
const { get, post } = server.router;
const { status, render, json } = server.reply;
const figlet = require('figlet');
const request = require('request-promise');
const _ = require('lodash');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const ignoreWords = require('./keyword.ignore.json');


figlet('Keyword', (err, data) => {
  if (!err) {
    console.log(data);
  }
  server({ port: 8085, views: 'template', engine: 'html' }, [
    get('/', ctx => {
      return render('index.html');
    }),
    post('/', ctx => request.get(ctx.data).then((html) => {
      const { document } = (new JSDOM(html)).window;
      let words = [];
      let keepWords = [];
      let most = {};
      let keyword = {
        string: '',
        array: []
      };
      _.forEach(document.getElementsByTagName('meta'), (item) => {
        if (item.getAttribute('name') === 'Keywords') {
          keyword.string = item.getAttribute('content');
        }
      });
      _.forEach(_.split(keyword.string, ','), (item) => {
        _.forEach(_.split(item, ' '), (word) => {
          if (_.indexOf(keyword.array, word) === -1) {
            let thisWord = word.trim();
            if (thisWord.length > 1 && _.indexOf(ignoreWords, thisWord) === -1) {
              keyword.array.push(thisWord);
            }
          }
        });
      });
      let content = document.getElementsByTagName('body')[0].innerHTML.replace(/<\s*(script|style)[^>]*>([\s\S]*?)<\s*\/\s*(script|style)>/igm, '').replace(/<(.)[^>]{0,}>/g, '').replace(/[\s|\n|\t|\r|\s+]/gm, ' ').replace(/[!@#$%^&*-,.،:'"?_()]/g, '');
      _.forEach(_.split(content, ' '), (item) => {
        let thisWord = item.trim();
        if (thisWord.length > 2 && _.indexOf(ignoreWords, thisWord) === -1) {
          let id = encodeURI(thisWord).replace(/%/g, '');
          if (_.has(most, id)) {
            if (most[id] > 30) {
              keyword.array.push(thisWord);
            }
            most[id] += 1;
          }
          else {
            most[id] = 0;
          }
          keepWords.push(thisWord);
        }
      });
      _.forEach(keepWords, (item) => {
        let isKeyword = false;
        if (_.indexOf(keyword.array, item) !== -1) {
          isKeyword = true;
        }
        words.push([item, isKeyword]);
      });
      return json(words);
    }).catch((err) => {
      console.error(err.message);
      return status(400);
    }))
  ]);
  open('http://localhost:8085/');
});