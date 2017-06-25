module.exports = class Register {

  constructor() {
    this.value;
  }

  push(value) {
    return this.value = value;
  }

  pop() {
    const value = this.value;
    this.value = undefined;
    return value;
  }

};
