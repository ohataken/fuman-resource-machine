const Box = require('./box');
const BoxQueue = require('./box_queue');
const Register = require('./register');
const FloorInspector = require('./floor_inspector');

module.exports = class Floor {

  constructor(inbox, expected, size, insts) {
    this._inbox = new BoxQueue(inbox);
    this._outbox = new BoxQueue([]);
    this.expectedQueue = new BoxQueue(expected);
    this.memory = Array.isArray(size) ? size : new Array(size);
    this.insts = insts;
    this.pc = 0;
    this.register = new Register();
    this.inspector = new FloorInspector(this);
  }

  hasNextInbox() {
    return ! this._inbox.isEmpty();
  }

  hasNextInstruction() {
    if (this.insts.length - 1 < this.pc) {
      return false;
    } else if (this.insts.length - 1 == this.pc){
      switch (this.insts[this.pc].name) {
        case 'jump':
          return true;
        case 'jumpifzero':
          return true;
        case 'jumpifneg':
          return true;
        default:
          return false;
      }
    } else {
      return true;
    }
  }

  currentInstruction() {
    return this.insts[this.pc];
  }

  inbox(inst) {
    this.register.push(this._inbox.pop());
    ++this.pc;
  }

  outbox(inst) {
    this._outbox.push(this.register.pop());
    ++this.pc;
  }

  copyto(inst) {
    this.copyto(this.register.get(), inst.operands[0]);
    ++this.pc;
    if (addr < this.memory.length - 1) {
      this.memory[addr] = box;
    }
  }

  copyfrom(inst) {
    this.register.push(this.memory[inst.operands[0]]);
    ++this.pc;
    if (addr < this.memory.length - 1) {
      return this.memory[addr];
    }
  }

  add(inst) {
    const o1 = this.register.pop();
    const o2 = this.memory[inst.operands[0]];
    this.register.push(new Box(o1 + o2));
    ++this.pc;
  }

  sub(inst) {
    const o1 = this.register.pop();
    const o2 = this.memory[inst.operands[0]];
    this.register.push(new Box(o1 - o2));
    ++this.pc;
  }

  evalAndNext() {
    const inst = this.currentInstruction();
    return this[inst.name](inst);
  }

  isOutboxLongerThanExpected() {
    return this.expectedQueue.queue.length < this._outbox.queue.length;
  }

  isValid() {
    if (this._outbox.isEmpty()) {
      return true;
    } else if (this.isOutboxLongerThanExpected()) {
      return false;
    } else {
      var invalid = false;

      for (var i = 0; i < this._outbox.queue.length ; ++i) {
        const b1 = this._outbox.queue[i];
        const b2 = this.expectedQueue.queue[i];

        invalid = b1.value != b2.value;

        if (invalid) {
          return false;
        }
      }

      return true;
    }
  }

  isSuccess() {
    return this.outbox._queue.length == this.expectedQueue._queue.length && this.isValid();
  }

  toString() {
    return this.inspector.toString();
  }

};
