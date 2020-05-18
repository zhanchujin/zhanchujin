(function () {

  var position = 'absolute'
  var elements = []

  function Snake(options) {
    options = options || {}
    this.width = options.width || 20
    this.height = options.height || 20

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
      var obj = {}
      // 对象拷贝
      extend(last, obj)
      this.body.push(obj)

      // 让食物消失再渲染
      food.render(map)
    }
  }
  function extend(parent, child) {
    for (var key in parent) {
      if (child[key]) {
        continue
      }
      child[key] = parent[key]
    }
  }
  window.Snake = Snake
})()