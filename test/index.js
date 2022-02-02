let firerest = require('../dist/index');
let fetch = require('node-fetch');

global.fetch = fetch;

let api = firerest.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  fetch: fetch,
  debug: true,
});


let ref = api.child('posts').child(2);

ref.get({
  sort: 'hoge',
  tag_ids: ['1', '2'],
  temp: {
    hoge: 100,
    foo: 200,
  }
}).then(res => {
  console.log(res);
});
