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

  var setFromPath = function(obj, key, value) {
    key.split('/').reduce(function(t, v, i, arr) {
      if (i === (arr.length-1)) {
        t[v] = value;
      }
      else {
        if (!t[v]) t[v] = {};
        return t[v];
      }
    }, obj);
  };

  var getFromPath = function(obj, key) {
    return key.split('/').reduce(function(t, v) {
      return t && t[v];
    }, obj);
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
          query = qs.stringify(options.data, null, null, true);
          api += '?';
        }
      }
      else {
        if (options.data && options.data.constructor !== FormData) {
          headers['Content-Type'] = 'application/json; charset=utf-8';
          data = JSON.stringify( extend(this.data(), options.data) );
        }
        else {
          data = options.data;
        }
      }

      var p = fetch(api + query, {
        method: options.type,
        headers: headers,
        body: data || undefined,
      }).then(function(res) {
        // fire always
        root.fire('always', res);

        var json = res.json();
        if (!res.ok) {
          // http://stackoverflow.com/questions/29473426/fetch-reject-promise-with-json-error-object
          return json.then(Promise.reject.bind(Promise));
        }
        else {
          return json;
        }
      });
      p.then(function(res) {
        if (root.debug) {
          console.log(options.type, api, res);
        }

        root.fire('success', res);
        return res;
      });
      p.catch(function(res) {
        root.fire('fail', res);
        return res;
      });

      return p;
    },
    _fetchFromLocal: function(options) {
      var self = this;
      var api = this.api;
      var root = this.root;
      var localData = this.root.localData;

      if(!localData) {
        return Promise.reject('not found local items');
      }

      var func = null;

      switch(options.type) {
        case 'GET':
          func = function(resolve) {
            var data = getFromPath(localData, api);
            resolve(data);
          };
          break;
        case 'PUT':
          func = function(resolve) {
            var data = getFromPath(localData, api);
            extend(r.data, options.data);
            resolve(data);
          };
          break;
        case 'POST':
          func = function(resolve) {
            id = options.data.id;
            setFromPath(localData, api+'/'+id, options.data);
            resolve(options.data);
          };
          break;
        case 'DELETE':
          func = function(resolve) {
            var pathes = api.split('/');
            var key = pathes.pop();
            var path = pathes.join('/');
            var obj = getFromPath(localData, path);

            delete obj[key];

            resolve(null);
          };
          break;
      }

      var p = new Promise(func);

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
      var child = new Child({
        api: this.api + '/' + api,
      });
      child.root = this.root;
      child.parent = this;

      return child;
    },

    log: function() {
      console.log(this.api);
    },

    migrate: function(data) {
      var key = this.api;
      setFromPath(this.root.localData, key, data);
      return this;
    },

    fetch: function(options) {
      if(this.root.local) {
        return this._fetchFromLocal(options);
      }else{
        return this._fetch(options);
      }
    }
  };


  /*
   * Auth
   */
  var Auth = function(firerest) {
    this.firerest = firerest;
    this._token = null;
    this._user = null;
  };

  Object.defineProperty(Auth.prototype, 'token', {
    set: function(v) {
      this._token = v;
      localStorage.setItem(this.firerest.cacheKey + '.token', this._token);
      this.firerest.headers(this.firerest.tokenKey, this._token);
    },
    get: function() {
      return this._token;
    },
  });

  Object.defineProperty(Auth.prototype, 'user', {
    set: function(v) {
      this._user = v;
      localStorage.setItem(this.firerest.cacheKey + '.user', JSON.stringify(this._user));
    },
    get: function() {
      return this._user;
    },
  });

  Auth.prototype.login = function(token, user) {
    this.token = token;
    this.user = user;
  };

  Auth.prototype.logout = function() {
    this._token = null;
    this._user = null;
    localStorage.removeItem(this.firerest.cacheKey + '.token');
    localStorage.removeItem(this.firerest.cacheKey + '.user');
    this.firerest.headers(this.firerest.tokenKey, undefined);
  };

  Auth.prototype.isLogin = function() {
    return !!this._token;
  };

  Auth.prototype._sync = function() {
    var token = localStorage.getItem(this.firerest.cacheKey + '.token');
    var user = localStorage.getItem(this.firerest.cacheKey + '.user');

    if (token) {
      this.token = token;
    }
    if (user) {
      this.user = JSON.parse(user);
    }

    return this;
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
    this.localData = {};
    this._listeners = [];

    this.auth = new Auth(this);
    this.auth._sync();
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


