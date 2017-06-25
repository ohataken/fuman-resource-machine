module.exports = class Register {

  constructor() {
    this.value;
  }

  push(value) {
    return this.value = value;
  }

  get() {
    return this.value;
  }

  pop() {
    const value = this.value;

    if (value) {
      this.value = undefined;
      return value;
    } else {
      throw 'no box in the register';
    }
  }

};
