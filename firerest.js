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
        extend(this._headers, headers);
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

  var Rest = function(options) {
    this.init(options);
  };


  /*
   * Rest
   */
  Rest.prototype = Object.create(Child.prototype);

  Rest.prototype.init = function(options) {
    Child.prototype.init.call(this, options);

    this.root = this;
    this.tokenKey = options.tokenKey;
    this.debug = options.debug;

    this.sync();
  };
  Rest.prototype.token = function(v) {
    if (v) {
      this._token = v;
      localStorage.setItem(this.tokenKey, v);
      return this;
    }
    else {
      return this._token;
    }
  };
  Rest.prototype.logout = function() {
    localStorage.removeItem(this.tokenKey);
    this._token = null;
  };
  Rest.prototype.isLogin = function() {
    return !!this._token;
  };
  Rest.prototype.sync = function() {
    var token = localStorage.getItem(this.tokenKey);
    if (token) this.token(token);
  };

  window.Rest = Rest;

})();


// test
;(function() {
  return ;
  var rest = new Rest({
    api: 'http://jsonplaceholder.typicode.com',
    tokenKey: 'marcle.auth.token',
    debug: true,
  });
  rest.log();
  rest.child('posts').log();
  rest.child('posts').get().done();
  rest.child('posts').child(10).get().done();
  rest.child('posts').child(10).child('comments').get().done();
})();


