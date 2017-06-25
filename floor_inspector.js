module.exports = class FloorInspector {

  constructor(floor) {
    this.floor = floor;
  }

  unlessUndefined(obj, callback) {
    if (obj) {
      return callback(obj);
    } else {
      return undefined;
    }
  }

  toString() {
    var s = '';

    s += `pc = ${this.floor.pc} / ${this.floor.insts.length}\n`;
    s += `register = ${this.unlessUndefined(this.floor.register.value, (o) => { return o.value; })}\n`;
    s += `instruction = ${this.unlessUndefined(this.floor.currentInstruction(), (o) => { return o.name })}\n`;
    s += `inbox = ${this.floor._inbox.toString()}\n`;
    s += `outbox = ${this.floor._outbox.toString()}\n`;
    s += `expected = ${this.floor.expectedQueue.toString()}\n`;

    return s;
  }

};
