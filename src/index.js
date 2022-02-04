import RootNode from './root-node'


let firerest = {
  create(params) {
    let node = new RootNode(params);
    return node;
  }
};

export default firerest;