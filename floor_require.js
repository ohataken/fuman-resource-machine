module.exports = function(path) {
  try {
    const mod = require(path);
    return mod;
  } catch(e) {
    if (e.message.match(/Cannot find module '.\/floors\/floor(\d+)'/)) {
      return undefined;
    } else {
      throw e;
    }
  }
};
