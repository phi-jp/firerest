import ChildNode from './child-node'

class RootNode extends ChildNode {
  constructor({baseURL, debug=false, fetch=globalThis.fetch}) {
    super({
      parent: null,
      root: null,
      headers: {},
      path: '',
    });

    // trailing slash
    this._debug = debug;
    this._baseURL = baseURL.replace(/\/$/, '');
    this._fetch = fetch;
  }

  // fetch 関数をセット
  setFetch(fetch) {
    this._fetch = fetch;
  }
}

export default RootNode;