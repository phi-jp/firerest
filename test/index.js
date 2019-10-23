var Firerest = require('../firerest');

var ref = Firerest.create({
  api: 'http://jsonplaceholder.typicode.com',
  cacheKey: '_token',
  tokenKey: 'Token',
  debug: true,
});

// fetch 前に共通処理を仕込める( Promise にも対応 )
ref.on('prefetch', () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log('共通に2秒待ってから表示する')
    }, 2000);
  });
});

ref.child('posts').get().then(function(res) {
  console.log(res.slice(0, 4));
});
