module.exports = class Instruction {

  static parse(string) {
    const regexp = /(\w+)\s?(\d+)?;/g
    const array = [];

    while (regexp.lastIndex < string.length) {
      const result = regexp.exec(string);
      const name = result[1];
      const operand = result[2] ? parseInt(result[2]) : undefined;
      array.push(new this(name, [operand]));
    }

    return array;
  }

  constructor(name, operands) {
    this.name = name;
    this.operands = operands || [];
  }

};
