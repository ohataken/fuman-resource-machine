module.exports = class Instruction {

  constructor(name, operands) {
    this.name = name;
    this.operands = operands || [];
  }

};
