;(function() {

  var extend = function(a, b) {
    for (var key in b) {
      var v = b[key];
      a[key] = v;
    }
    return a;
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

    ajax: function(options, ajaxOptions) {
      var self = this;
      var root = this.root;
      var token = root.token();
      options.url = this.api;

      if (options.type === 'GET') {
        options.data = this.data();
      }
      else {
        options.dataType = 'json';
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(this.data());
      }
      options.beforeSend = function(xhr) {
        var headers = self.headers();

        for (var key in headers) {
          var v = headers[key];
          xhr.setRequestHeader(key, v);
        }
      };

      var a = $.ajax(options);

      a.done(function(res) {
        if (root.debug) {
          console.log(options.type, self.api, res);
        }
      });

      return a;
    },
    get: function() {
      return this.ajax({
        type: 'GET',
      });
    },
    put: function() {
      return this.ajax({
        type: 'PUT',
      });
    },
    post: function() {
      return this.ajax({
        type: 'POST',
      });
    },
    del: function() {
      return this.ajax({
        type: 'DELETE',
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

  window.Firerest = Firerest;

})();


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


