import _path from 'path-browserify'
import AsyncEventEmitter from './async-event-emitter'

class ChildNode extends AsyncEventEmitter {
  constructor({parent, root, path, headers={}}) {
    super();

    this._parent = parent;
    this._root = root;
    this._path = path;
    this._headers = headers;
  }

  child(path) {
    let child = new ChildNode({
      parent: this,
      root: this.isRoot() ? this : this.root,
      headers: {},
      path: path.toString(),
    });

    return child;
  }

  async fetch({type, data={}}) {
    let root = this.root;
    let path = this.path;
    let endpoint = root._baseURL + '/' + path;
    type = type.toUpperCase();

    try {
      await this.root.emitAsync('prefetch', {
        self: this,
        path,
        endpoint,
        type,
      });
    }
    catch (e) {
      console.error('--- prefetch error ---', e);
    }

    let headers = this.headers();
    let query = '';
    let body = null;
    let temp_fetch = root._fetch;

    if (type === 'GET' || type === 'DELETE') {
      let params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          key = key + '[]';
          value.forEach(v => {
            params.append(key, v);
          });
        }
        else if (typeof value === 'object') {
          Object.entries(value).forEach(([child_key, child_value]) => {
            params.append(`${key}[${child_key}]`, child_value);
          });
        }
        else {
          params.append(key, value);
        }
      });

      let search = params.toString();
      if (search) {
        query = '?' + search;
      }
    }
    else {
      if (data.constructor !== globalThis.FormData) {
        headers['Content-Type'] = 'application/json; charset=utf-8';
        body = JSON.stringify( data );
      }
      else {
        // for form
        body = data;
      }
    }

    try {

      let res = await temp_fetch(endpoint + query, {
        method: type,
        headers,
        body,
      });

      let result = await res.json();

      if (!res.ok) {
        throw {
          res,
          result,
        };
      }

      if (root._debug) {
        console.groupCollapsed('## firerest: %s', endpoint);
        console.log('payload:', data);
        console.log('response:', result);
        console.groupEnd();
      }

      await this.root.emitAsync('postfetch', {
        self: this,
        path,
        endpoint,
        type,
        res,
        status: res.status,
        result,
      });

      return result;

    } catch(error) {
      await this.root.emitAsync('fail', {
        self: this,
        path,
        endpoint,
        type,
        res: error.res,
        status: error.res.status,
        result: error.result,
      });
    }
  }

  get(data) {
    return this.fetch({
      type: 'GET',
      data,
    });
  }

  post(data) {
    return this.fetch({
      type: 'POST',
      data,
    });
  }

  put(data) {
    return this.fetch({
      type: 'PUT',
      data,
    });
  }

  del(data) {
    return this.fetch({
      type: 'DELETE',
      data,
    });
  }

  get root() {
    return this._root;
  }

  get parent() {
    return this._parent;
  }

  get path() {
    if (this.isRoot()) {
      debugger;
      return this._baseURL;
    }

    let pathes = [];
    let node = this;
    do {
      if (node._path) {
        pathes.unshift(node._path);
      }
    } while(node = node.parent);

    let path = _path.join(...pathes);

    return _path.normalize(path);
  }

  headers(...args) {
    if (args.length === 1) {
      let type = typeof args[0];
      if (type === 'string') {
        return this._headers[args[0]];
      }
      else if (type === 'object') {
        Object.assign(this._headers, args[0]);
        return this;
      }
    }
    else if (args.length === 2) {
      this._headers[args[0]] = args[1];
      return this;
    }

    let headers = this.parent ? this.parent.headers() : {};

    return {
      ...headers,
      ...this._headers,
    };
  }

  isRoot() {
    // root が null だったら root
    return this.root === null;
  }
}

export default ChildNode;