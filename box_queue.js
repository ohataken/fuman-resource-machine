const Box = require('./box');

module.exports = class BoxQueue {

  constructor(boxes) {
    this.queue = boxes.map((b) => {
      return new Box(b);
    });
  }

  push(box) {
    return this.queue.push(box);
  }

  pop() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length == 0;
  }

  toString() {
    return this.queue.reduce((acc, box) => {
      return acc + box.value.toString() + ', ';
    }, '');
  }

};
