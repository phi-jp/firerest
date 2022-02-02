import EventEmitter from 'events'

class AsyncEventEmitter extends EventEmitter {
  constructor() {
    super();
  }

  // 非同期版 emit
  emitAsync(event, ...args) {
    let promises = [];
    
    this.listeners(event).forEach(listener => {
      var res = listener(...args);
      promises.push(res);

      // if (res instanceof Promise) {
      //   promises.push(res);
      // }
    });

    return Promise.all(promises);
  }
}

export default AsyncEventEmitter;
