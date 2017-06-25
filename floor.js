const BoxQueue = require('./box_queue');
const Register = require('./register');
const FloorInspector = require('./floor_inspector');

module.exports = class Floor {

  constructor(inbox, expected, insts) {
    this.inbox = new BoxQueue(inbox);
    this.outbox = new BoxQueue([]);
    this.expectedQueue = new BoxQueue(expected);
    this.insts = insts;
    this.pc = 0;
    this.register = new Register();
    this.inspector = new FloorInspector(this);
  }

  hasNextInbox() {
    return ! this.inbox.isEmpty();
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

  evalAndNext() {
    const inst = this.currentInstruction();

    switch(inst.name) {
      case 'inbox':
        this.register.push(this.inbox.pop());
        ++this.pc;
        break;
      case 'outbox':
        this.outbox.push(this.register.pop());
        ++this.pc;
        break;
      case 'copyto':
        break;
      case 'copyfrom':
        break;
      case 'add':
        break;
      case 'sub':
        break;
      case 'jump':
        break;
      case 'jumpifzero':
        break;
      case 'jumpifneg':
        break;
    }
  }

  isOutboxLongerThanExpected() {
    return this.expectedQueue.queue.length < this.outbox.queue.length;
  }

  isValid() {
    if (this.outbox.isEmpty()) {
      return true;
    } else if (this.isOutboxLongerThanExpected()) {
      return false;
    } else {
      var invalid = false;

      for (var i = 0; i < this.outbox.queue.length ; ++i) {
        const b1 = this.outbox.queue[i];
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
    return this.outbox.queue.length == this.expectedQueue.queue.length && this.isValid();
  }

  toString() {
    return this.inspector.toString();
  }

};
