(function () {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  Apple = Snake.Apple = function(pos) {
    this.pos = pos;
  };
})();
