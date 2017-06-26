const Floor = require('../floor');

module.exports = class Floor2 extends Floor {

  constructor(insts) {
    super(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      0,
      insts,
      'bring each boxes to outbox.',
      [
        'inbox',
        'outbox',
        'jump',
      ],
    );
  }

}
