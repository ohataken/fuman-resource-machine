const Floor = require('../floor');

module.exports = class Floor1 extends Floor {

  constructor(insts) {
    super(
      [1, 2, 3],
      [1, 2, 3],
      insts
    );
  }

}
