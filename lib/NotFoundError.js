var util = require("util");

function NotFoundError(message) {
  Error.call(this);
  this.name = "NotFound"
  this.message = message;
}

util.inherits(NotFoundError, Error);

module.exports = NotFoundError;