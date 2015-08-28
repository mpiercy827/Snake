(function () {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  var Apple = Snake.Apple = function (options) {
    this.vector = new Vector(options.pos);
    this.pos = this.vector.pos;
    this.type = options.type;
  };
})();
