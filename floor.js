const Box = require('./box');
const BoxQueue = require('./box_queue');
const Register = require('./register');
const FloorInspector = require('./floor_inspector');

module.exports = class Floor {

  constructor(inbox, expected, size, insts, availableInsts) {
    this._inbox = new BoxQueue(inbox);
    this._outbox = new BoxQueue([]);
    this.expectedQueue = new BoxQueue(expected);
    this.memory = Array.isArray(size) ? size : new Array(size);
    this.insts = insts;
    this.pc = 0;
    this.register = new Register();
    this.availableInsts = availableInsts;
    this.inspector = new FloorInspector(this);
  }

  validateStatically() {
    this.insts.forEach((inst) => {
      if (!this.availableInsts.includes(inst.name)) {
        throw 'unavailable instruction ' + inst.name;
      }
    });
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

  isSegv(p) {
    return p < 0 || this.memory.length < p;
  }

  getMemoryAt(p) {
    if (isSegv(p)) {
      throw 'segmentation fault';
    } else {
      return this.memory[p];
    }
  }

  setMemoryAt(p, box) {
    if (isSegv(p)) {
      throw 'segmentation fault';
    } else {
      return this.memory[p] = box;
    }
  }

  inbox(inst) {
    const box = this._inbox.pop();

    if (!box) {
      throw 'no box in the inbox';
    }

    this.register.push(box);
    ++this.pc;
  }

  outbox(inst) {
    const box = this.register.pop();

    if (!box) {
      throw 'no box in the register';
    }

    this._outbox.push(box);
    ++this.pc;
  }

  copyto(inst) {
    const box = this.register.get();

    if (!box) {
      throw 'no box in the register';
    }

    this.setMemoryAt(p, box);
    ++this.pc;
  }

  copyfrom(inst) {
    const box = this.getMemoryAt(inst.operands[0]);

    if (!box) {
      throw 'no box in the memory cell';
    }

    this.register.push(box);
    ++this.pc;
  }

  add(inst) {
    const o1 = this.register.pop();
    const o2 = this.getMemoryAt(inst.operands[0]);
    this.register.push(new Box(o1 + o2));
    ++this.pc;
  }

  sub(inst) {
    const o1 = this.register.pop();
    const o2 = this.getMemoryAt(inst.operands[0]);
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
