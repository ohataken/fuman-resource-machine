const http = require('http');
const https = require('https');
const floorRequire = require('./floor_require');
const Instruction = require('./instruction');

const protocol = process.env.SSL === 'true' ? https : http;

protocol.createServer((request, response) => {

  var buffer = '';

  request.on('data', (data) => {
    buffer += data;
  });

  request.on('end', () => {
    var result = /^\/floors\/(\d+)/.exec(request.url);

    if (result == null || result == undefined) {
      response.write(JSON.stringify({
        message: 'not matched any routes',
      }));
      return response.end();
    }

    const Floor = floorRequire('./floors/floor' + result[1]);

    if (!Floor) {
      response.write(JSON.stringify({
        message: 'Sorry, we have not implemented the floor!',
      }));
      return response.end();
    }

    var floor;

    try {
      floor = new Floor(Instruction.parse(buffer));
      floor.validateStatically();

      while(floor.currentInstruction() && floor.isValid() && !floor.isOutboxFilled()) {
        floor.evalAndNext();
      }

      floor.isSuccess();

      response.write(JSON.stringify({
        message: 'You cleared!',
        inspect: floor.toJSON(),
      }));
      response.write('\n');
      return response.end();
    } catch (e) {
      response.statusCode = 404;
      response.write(JSON.stringify({
        message: 'You failed!',
        error: e.message,
        inspect: floor ? floor.toJSON() : '',
      }));
      response.write('\n');
      return response.end();
    }
  });

}).listen(process.env.PORT || 8080);
