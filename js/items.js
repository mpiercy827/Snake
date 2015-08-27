(function () {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  Apple = Snake.Apple = function(pos) {
    this.pos = pos;
  };

  GoldenApple = Snake.GoldenApple = function(pos) {
    this.pos = pos;
  }

  PoisonApple = Snake.PoisonApple = function(pos) {
    this.pos = pos;
  }
})();
