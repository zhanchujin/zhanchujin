(function () {
  var that // 记录游戏对象

  function Game(map) {
    this.food = new Food()
    this.snake = new Snake()
    this.map = map
    that = this
  }

  // 开始游戏
  Game.prototype.start = function () {
    // 1.把蛇和食物对象渲染到地图
    this.food.render(this.map)
    this.snake.render(this.map)

    // 2.开始游戏的逻辑
    // 2.1 让蛇动起来
    runSnake()

    // 2.2 当蛇遇到边界游戏结束
    // 2.3 通过键盘控制蛇移动的方向
    bindKey()
    // 2.4 当蛇遇到食物做相应的处理
  }

  function bindKey() {      
    document.addEventListener('keydown', function(e) {   
      switch (e.keyCode) {
        case 38:
          this.snake.direction = 'top'
          break;
        case 39:
          this.snake.direction = 'right'
          break;
        case 40:
          this.snake.direction = 'bottom'
          break;
        case 37:
          this.snake.direction = 'left'
          break;
      }
    }.bind(that), false)
  }

  // 私有的函数
  function runSnake() {
    var timeId = setInterval(function () {
      // 让蛇走一格
      this.snake.move(this.food, this.map)
      this.snake.render(this.map)
      // 2.2 当蛇头遇到边界游戏结束
      // 获取蛇头的坐标
      var maxX = this.map.offsetWidth / this.snake.width
      var maxY = this.map.offsetHeight / this.snake.height

      var headX = this.snake.body[0].x
      var headY = this.snake.body[0].y
      if (headX < 0 || headX >= maxX || headY < 0 || headY >= maxY) {
        alert('游戏结束')
        clearInterval(timeId)
      }

      
    }.bind(that), 100)
  }
  window.Game = Game
})()



