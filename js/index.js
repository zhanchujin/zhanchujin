// ----------------------Tools---------------------------
// 自调用函数传入window的目的，是让变量名可以被压缩
// 在老版本的浏览器中 undefined 可以被重新赋值
;
(function (window, undefined) {
  var Tools = {
    getRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
  window.Tools = Tools
})(window, undefined)

// ------------------------------parent------------------------
;(function (window) {
  function Parent(options) {
    options = options || {}
    this.width = options.width || 20
    this.height = options.height || 20
  }
  Parent.prototype.test = function () {
    console.log('test')
  }
  window.Parent = Parent
})(window, undefined)



// -------------------------Food------------------------------
;
(function (window, undefined) {
  var position = 'absolute'
  // 记录上一次创建的食物，为删除做准备
  var elements = []


  function Food(options) {
    options = options || {}

    this.x = options.x || 0
    this.y = options.y || 0

    // 借用构造函数
    Parent.call(this, options)
    this.color = options.color || 'green'
  }

  Food.prototype = new Parent()
  Food.prototype.constructor = Food

  Food.prototype.render = function (map) {
    // 删除之前创建的食物
    remove()

    // 随机设置x和y的值
    this.x = Tools.getRandom(0, map.offsetWidth / this.width - 1) * this.width
    this.y = Tools.getRandom(0, map.offsetHeight / this.height - 1) * this.height

    // 动态创建div，页面显示的食物
    var div = document.createElement('div')
    // 渲染到地图中
    map.append(div)

    // 记录食物
    elements.push(div)

    // 设置样式
    div.style.position = position
    div.style.width = this.width + 'px'
    div.style.height = this.height + 'px'
    div.style.left = this.x + 'px'
    div.style.top = this.y + 'px'
    div.style.backgroundColor = this.color
  }

  function remove() {
    for (var i = elements.length - 1; i >= 0; i--) {
      // 删除div
      elements[i].parentNode.removeChild(elements[i])
      // 删除数组元素
      elements.splice(i, 1)
    }
  }
  window.Food = Food
})(window, undefined)

// -------------------------Snake------------------------------
;
(function (window, undefined) {

  var position = 'absolute'
  var elements = []

  function Snake(options) {
    options = options || {}
    // 借用构造函数
    Parent.call(this, options)

    // 蛇整个身体，第一个是蛇头，其余的是蛇节
    this.body = [{
        x: 3,
        y: 2,
        color: 'red'
      },
      {
        x: 2,
        y: 2,
        color: 'blue'
      },
      {
        x: 1,
        y: 2,
        color: 'blue'
      }
    ]

    // 蛇运动的方向
    this.direction = options.direction || 'right'

  }
  Snake.prototype = new Parent()
  Snake.prototype.constructor = Snake

  Snake.prototype.render = function (map) {
    // 删除之前的蛇
    remove()

    // 把每一个蛇节渲染到地图上
    for (var i = 0, len = this.body.length; i < len; i++) {
      // 蛇节
      var object = this.body[i]

      var div = document.createElement('div')
      map.appendChild(div)

      // 记录蛇节
      elements.push(div)

      // 设置样式
      div.style.width = this.width + 'px'
      div.style.height = this.height + 'px'
      div.style.position = 'absolute'

      div.style.left = object.x * this.width + 'px'
      div.style.top = object.y * this.height + 'px'

      div.style.backgroundColor = object.color

    }
  }

  function remove() {
    for (var i = elements.length - 1; i >= 0; i--) {
      // 删除div
      elements[i].parentNode.removeChild(elements[i])

      // 删除数组元素
      elements.splice(i, 1)
    }
  }

  // 控制蛇移动的方法
  Snake.prototype.move = function (food, map) {
    // 控制蛇的身体移动，当前蛇节到上一个蛇节的位置
    for (var i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x
      this.body[i].y = this.body[i - 1].y
    }

    var head = this.body[0]
    // 控制蛇头的移动
    switch (this.direction) {
      case 'right':
        head.x += 1
        break;
      case 'left':
        head.x -= 1
        break;
      case 'top':
        head.y -= 1
        break;
      case 'bottom':
        head.y += 1
        break;
    }

    // 获取食物的坐标
    var foodX = food.x
    var foodY = food.y
    var headX = head.x
    var headY = head.y


    // 2.4 当蛇遇到食物做相应的处理
    if (foodX == headX * this.width && foodY == headY * this.height) {

      // 让蛇增加一节
      // 获取蛇的最后一节

      var last = this.body[this.body.length - 1]
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color
      })

      // 让食物消失再渲染
      food.render(map)
    }
  }
  window.Snake = Snake
})(window, undefined)

// -------------------------Game------------------------------
;
(function (window, undefined) {
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
    document.addEventListener('keydown', function (e) {
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
})(window, undefined)

// -------------------------main------------------------------
;
(function (window, undefined) {
  var map = document.getElementById('map')
  var game = new Game(map)
  game.start()
})(window, undefined)