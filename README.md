# firerest
ajax library for rest like firebase



```
var ref = Firerest.create({
  api: 'http://jsonplaceholder.typicode.com',
  cacheKey: '_token',
  tokenKey: 'Token',
  debug: true,
});

ref.child('posts').get().then(function(res) {
  console.log(res);
});
```
