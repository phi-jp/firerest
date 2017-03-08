;(function(exports) {

  var fetch = (typeof module === "object" && typeof module.exports === "object" ) ? require('node-fetch') : window.fetch;

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./firerest');
  }

  var extend = function(a, b) {
    for (var key in b) {
      var v = b[key];
      a[key] = v;
    }
    return a;
  };

  var qs = {
    parse: function(text, sep, eq, isDecode) {
      text = text || location.search.substr(1);
      sep = sep || '&';
      eq = eq || '=';
      var decode = (isDecode) ? decodeURIComponent : function(a) { return a; };
      return text.split(sep).reduce(function(obj, v) {
        var pair = v.split(eq);
        obj[pair[0]] = decode(pair[1]);
        return obj;
      }, {});
    },
    stringify: function(value, sep, eq, isEncode) {
      sep = sep || '&';
      eq = eq || '=';
      var encode = (isEncode) ? encodeURIComponent : function(a) { return a; };
      return Object.keys(value).map(function(key) {
        return key + eq + encode(value[key]);
      }).join(sep);
    },
  };


  var Child = function(options) {
    this.init(options);
  };

  Child.prototype = {
    init: function(options) {
      this.api = options.api;
      this._data = {};
      this._headers = {};
    },

    headers: function(headers) {
      if (headers) {
        if (typeof headers === 'object') {
          extend(this._headers, headers);
        }
        else {
          this._headers[arguments[0]] = arguments[1];
        }
        return this;
      }
      else {
        headers = {};

        if (this.parent) {
          extend(headers, this.parent.headers());
        }
        extend(headers, this._headers);

        return headers;
      }
    },
    data: function(data) {
      if (data) {
        extend(this._data, data);
        return this;
      }
      else {
        data = {};

        if (this.parent) {
          extend(data, this.parent.data());
        }
        extend(data, this._data);

        return data;
      }
    },

    _fetch: function(options) {
      var self = this;
      var root = this.root;
      var headers = this.headers();
      var api = this.api;
      var query = '';
      var data = null;

      if (options.type === 'GET') {
        if (options.data) {
          query = qs.stringify(options.data);
          api += '?';
        }
      }
      else {
        headers['Content-Type'] = 'application/json; charset=utf-8';
        data = JSON.stringify( extend(this.data(), options.data) );
      }

      var p = fetch(api + query, {
        method: options.type,
        headers: headers,
        body: data,
      }).then(function(res) {
        return res.json();
      });

      p.then(function(res) {
        root.fire('success', res);
        return res;
      });
      p.catch(function(res) {
        root.fire('fail', res);
        return res;
      });
      p.then(function(res) {
        if (root.debug) {
          console.log(options.type, api, res);
        }
        root.fire('always', res);

        return res;
      });

      return p;
    },
    _fetchByUrl: function(options) {
      var self = this;
      var category = this.api.split('/')[0];
      var id  = this.api.split('/')[1];
      var root = this.root;
      var r = { data:[] }
      var localItems = this.root.localItems[category];

      if(!localItems) {
        return Promise.reject('not found local items');
      }

      var promise = function(f){
        return new Promise(function(resolve){
          var res = f();
          if( res.status === 200 || res.status === 201 ) {
            resolve(res);
          }
        });
      }

      switch(options.type) {
        case 'GET':
          var p = promise(function(){
            if(id && localItems[id]) {
              r.data = localItems[id];
            }else{
              Object.keys(localItems).forEach(function(key){
                r.data.push(localItems[key]);
              });
            }
            r.status = 200;
            return r;
          });
          break;
        case 'PUT':
          var p = promise(function(){
            if(id && localItems[id]) {
              localItems[id] = options.data;
              r.data = localItems[id];
              r.status = 200;
              return r;
            }
          });
          break;
        case 'POST':
          id = options.data.id;
          var p = promise(function() {
            localItems[id] = options.data;
            r.data = localItems[id];
            r.status = 201;
            return r;
          });
          break;
        case 'DELETE':
          var p = promise(function() {
            if(id && localItems[id]) {
              delete localItems[id];
              r.data = localItems[id];
              r.status = 200;
              return r;
            }
          });
          break;
      }

      p.then(function(res) {
        root.fire('success', res);
        return res;
      });
      p.catch(function(res) {
        root.fire('fail', res);
        return res;
      });
      p.then(function(res) {
        root.fire('always', res)
        if (root.debug) {
          console.log(options.type, self.api, res);
        }
        return res;
      });

      return p;
    },

    get: function(data) {
      return this.fetch({
        type: 'GET',
        data: data,
      });
    },
    put: function(data) {
      return this.fetch({
        type: 'PUT',
        data: data,
      });
    },
    post: function(data) {
      return this.fetch({
        type: 'POST',
        data: data,
      });
    },
    del: function(data) {
      return this.fetch({
        type: 'DELETE',
        data: data,
      });
    },

    child: function(api) {
      if(!this.root.local) {
        var child = new Child({
          api: this.api + '/' + api,
        });
      }else{
        var child = new Child({
          api: api,
        });
      }
      child.root = this.root;
      child.parent = this;

      return child;
    },

    log: function() {
      console.log(this.api);
    },

    migrate: function(options) {
      var key = this.api;
      this.root.localItems[key] = options;
      return this;
    },

    fetch: function(options) {
      if(this.root.local) {
        return this._fetchByUrl(options);
      }else{
        return this._fetch(options);
      }
    }
  };

  /*
   * Firerest
   */
  var Firerest = function(options) {
    this.init(options);
  };

  Firerest.prototype = Object.create(Child.prototype);

  Firerest.prototype.init = function(options) {
    Child.prototype.init.call(this, options);

    this.root = this;
    this.cacheKey = options.cacheKey;
    this.tokenKey = options.tokenKey;
    this.debug = options.debug;
    this.local = options.local;
    this.localItems = {};
    this._listeners = [];

    this._sync();
  };

  Firerest.prototype.token = function(v) {
    if (v) {
      this._token = v;
      this.headers(this.tokenKey, this._token);
      localStorage.setItem(this.cacheKey, v);
      return this;
    }
    else {
      return this._token;
    }
  };
  Firerest.prototype.isLogin = function() {
    return !!this._token;
  };
  Firerest.prototype.logout = function() {
    localStorage.removeItem(this.cacheKey);
    this._token = null;
  };
  Firerest.prototype._sync = function() {
    var token = localStorage.getItem(this.cacheKey);
    if (token) {
      this.token(token);
      return true;
    }
    else {
      return false;
    }

    return this;
  };

  // events
  Firerest.prototype.on = function(type, func) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(func);

    return this;
  };
  Firerest.prototype.fire = function(type, options) {
    if (!this._listeners[type]) return ;

    this._listeners[type].forEach(function(func) {
      func.call(this, options);
    });

    return this;
  };

  exports.create = function(options) {
    return new Firerest(options);
  };

})(typeof exports === 'undefined' ? this.Firerest = {} : exports);

// test
;(function() {
  return ;
  var ref = new Firerest({
    api: 'http://jsonplaceholder.typicode.com',
    cacheKey: 'hoge.foo.bar', // localstorage に保存するためのキー
    tokenKey: 'abcdefg', // header に付与して送るキー
    debug: true,
  });
  ref.log();
  ref.child('posts').log();
  ref.child('posts').get().done();
  ref.child('posts').child(10).get().done();
  ref.child('posts').child(10).child('comments').get().done();
})();


