## 前言

本文主要介绍：

1. 项目介绍
2. 项目效果展示
3. 一步步实现项目效果
4. 踩坑

## 一、项目介绍

**名称：** 智绘画板

**技术栈：** HTML5，CSS3，JavaScript，移动端

**功能描述：**

- 支持PC端和移动端在线绘画功能
- 实现任意选择画笔颜色、调整画笔粗细以及橡皮檫擦除等绘画功能
- 实现在线画板的本地保存功能
- 支持撤销和返回操作
- ~~自定义背景颜色~~[这个功能尚未完善好]

## 二、项目效果展示

[项目地址](https://github.com/xyyojl/drawingborad) [预览地址](https://xyyojl.github.io/drawingborad/index.html)

### 预览图

PC端的预览图：


![](https://user-gold-cdn.xitu.io/2019/3/3/16944271120d4aca?w=1366&h=664&f=png&s=13244)

移动端的预览图：


![](https://user-gold-cdn.xitu.io/2019/3/3/169442736b704a5d?w=248&h=443&f=png&s=6192)



看完上面的预览图和体验过**智绘画板**觉得还可以的，记得点个赞哦，不管你是否十分激动，反正我是挺激动的，毕竟自己实现出现的项目效果，挺自豪的，说了一堆废话，下面就可以动起手来敲代码，实现自己想要的效果！！！

注：下面实现项目效果主要是关于JavaScript方面的，下面仅仅是提供**实现思路的代码**，**并非全部代码**。

## 三、一步步实现项目效果

### （一）分析页面

通过**用例图**，我们知道用户进入我们这个网站有哪些功能？ 

用户可以进行的操作： 

- 画画
- 改变画笔的粗细
- 切换画笔的颜色
- 使用橡皮檫擦除不想要的部分
- 清空画板
- 将自己画的东西保存成图片
- 进行撤销和重做操作
- ~~切换画板背景颜色~~
- 兼容移动端（支持触摸） 

### （二）进行HTML布局

我书写html的同时，引入了css文件和js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>智绘画板</title>
    <link rel="shortcut icon" href="./image/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>
    <canvas id="canvas"></canvas>
    <!-- 自定义背景颜色功能尚未完善好 -->
    <!--<div class="bg-btn"></div>
    <div class="color-group" id="bgGroup">
        <h3>选择背景颜色:</h3>
        <ul class="clearfix">
            <li class="bgcolor-item" style="background-color: blue;"></li>
            <li class="bgcolor-item" style="background-color: black;"></li>
            <li class="bgcolor-item" style="background-color: #FF3333;"></li>
            <li class="bgcolor-item" style="background-color: #0066FF;"></li>
            <li class="bgcolor-item" style="background-color: #FFFF33;"></li>
            <li class="bgcolor-item" style="background-color: #33CC66;"></li>
            <li class="bgcolor-item" style="background-color: gray;"></li>
            <li class="bgcolor-item" style="background-color: #F34334;"></li>
            <li class="bgcolor-item" style="background-color: #fff;box-shadow: 0 1px 2px 0 rgba(32,33,36,0.28);"></li>
            <li class="bgcolor-item" style="background-color: #9B27AC;"></li>
            <li class="bgcolor-item" style="background-color: #4CB050;"></li>
            <li class="bgcolor-item" style="background-color: #029688;"></li>
        </ul>
        <i class="closeBtn"></i>
    </div>-->
    <div class="tools">
        <div class="container">
            <button class="save"  id="save" title="保存"></button>
            <button class="brush active" id="brush" title="画笔"></button>
            <button class="eraser" id="eraser" title="橡皮擦"></button>
            <button class="clear" id="clear" title="清屏"></button>
            <button class="undo"  id="undo" title="撤销"></button>
            <button class="redo"  id="redo" title="再做"></button>
        </div>
    </div>
    <div class="pen-detail" id="penDetail">
        <i class="closeBtn"></i>
        <p>笔大小</p>
        <span class="circle-box"><i id="thickness"></i></span> <input type="range" id="range1" min="1" max="10" value="1">
        <p>笔颜色</p>
        <ul class="pen-color clearfix">
            <li class="color-item active" style="background-color: black;"></li>
            <li class="color-item" style="background-color: #FF3333;"></li>
            <li class="color-item" style="background-color: #99CC00;"></li>
            <li class="color-item" style="background-color: #0066FF;"></li>
            <li class="color-item" style="background-color: #FFFF33;"></li>
            <li class="color-item" style="background-color: #33CC66;"></li>
        </ul>
        <p>不透明度</p>
        <i class="showOpacity"></i> <input type="range" id="range2" min="1" max="10" value="1">
    </div>
    <script src="./js/main.js"></script>
</body>
</html>
```

### （三）用CSS美化界面

css代码可以根据个人习惯进行美化界面，所以这里就不写css的代码了，大家可以直接看**项目代码**或者从开发者工具中审查元素观看。如果有问题可以私聊我，我觉得问题不大。 

### （四）使用JS实现项目的具体功能

#### 1.准备工作

首先，准备个容器,也就是画板了，前面的html已经书写好这个容器，这里纯属是废话。 

```html
<canvas id="canvas"></canvas>
```

然后初始化js 

```js
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
```

我打算把画板做成全屏的，所以接下来设置一下canvas的宽高 

```js
let pageWidth = document.documentElement.clientWidth;
let pageHeight = document.documentElement.clientHeight;

canvas.width = pageWidth;
canvas.height = pageHeight;
```

由于部分IE不支持canvas，如果要兼容IE，我们可以创建一个canvas，然后使用`excanvas`初始化，针对IE加上[exCanvas.js](http://code.google.com/p/explorercanvas/)，这里我们明确不考虑IE。 

但是我在电脑上对浏览器的窗口进行改变，画板不会自适应的放缩。解决办法：

```js
// 记得要执行autoSetSize这个函数哦
function autoSetSize(){
    canvasSetSize();
    // 当执行这个函数的时候，会先设置canvas的宽高
    function canvasSetSize(){
        // 把变化之前的画布内容copy一份，然后重新画到画布上
        let imgData = context.getImageData(0,0,canvas.width,canvas.height);
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        context.putImageData(imgData,0,0);
    }
    // 在窗口大小改变之后,就会触发resize事件，重新设置canvas的宽高
    window.onresize = function(){
        canvasSetSize();
    }
}
```

#### 2.实现画画的功能

实现思路：监听鼠标事件， 用`drawLine()`方法把记录的数据画出来。 

1. 初始化当前画板的画笔状态，`painting = false`。
2. 当鼠标按下时（`mousedown`），把`painting`设为`true`，表示正在画，鼠标没松开。把鼠标点记录下来。
3. 当按下鼠标的时候，鼠标移动（`mousemove`）就**把点记录**下来并画出来。
4. 如果鼠标移动过快，浏览器跟不上绘画速度，点与点之间会出现间隙，所以我们需要将画出的点用线连起来（`lineTo()`）。
5. 鼠标松开的时候（`mouseup`），把`painting`设为`false`。

注：`drawCircle`这个方法其实可以不用书写，这个只是为了让大家能够理解开始点击的位置在哪里？

```js
function listenToUser() {
    // 定义一个变量初始化画笔状态
    let painting = false;
    // 记录画笔最后一次的位置
    let lastPoint = {x: undefined, y: undefined};

    // 鼠标按下事件
    canvas.onmousedown = function(e){
        painting = true;
        let x = e.clientX;
        let y = e.clientY;
        lastPoint = {'x':x,'y':y};
        drawCircle(x,y,5);
    }

    // 鼠标移动事件
    canvas.onmousemove = function(e){
        if(painting){
            let x = e.clientX;
            let y = e.clientY;
            let newPoint = {'x':x,'y':y};
            drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
            lastPoint = newPoint;
        }
    }

    // 鼠标松开事件
    canvas.onmouseup = function(){
        painting = false;
    }
}

// 画点函数
function drawCircle(x,y,radius){
    // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    context.beginPath();
    // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
    // 从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
    context.arc(x,y,radius,0,Math.PI*2);
    // 通过填充路径的内容区域生成实心的图形
    context.fill();
    // 闭合路径之后图形绘制命令又重新指向到上下文中。
    context.closePath();
}

function drawLine(x1,y1,x2,y2){
    // 设置线条宽度
    context.lineWidth = 10;
    // 设置线条末端样式。
    context.lineCap = "round";
    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    // moveTo(x,y)将笔触移动到指定的坐标x以及y上
    context.moveTo(x1,y1);
    // lineTo(x, y) 绘制一条从当前位置到指定x以及y位置的直线
    context.lineTo(x2,y2);
    // 通过线条来绘制图形轮廓
    context.stroke();
    context.closePath();
}
```

#### 3.实现橡皮擦功能

实现思路：

1. 获取橡皮擦元素
2. 设置橡皮擦初始状态，`eraserEnabled = false`。
3. 监听橡皮擦`click`事件，点击橡皮擦，改变橡皮擦状态，`eraserEnabled = true`，并且切换class，实现**被激活**的效果。
4. `eraserEnabled`为`true`，移动鼠标用`context.clearRect()`实现了橡皮檫。

但是我发现canvas的API中，可以清除像素的就是`clearRect`方法，但是`clearRect`方法的清除区域矩形，毕竟大部分人的习惯中的橡皮擦都是圆形的，所以就引入了剪辑区域这个强大的功能，也就是`clip`方法。下面的代码是使用`context.clearRect()`实现了 橡皮檫。请看踩坑部分，了解如何更好的实现橡皮檫。

```js
let eraser = document.getElementById("eraser");
let eraserEnabled = false;

// 记得要执行listenToUser这个函数哦
function listenToUser() {
   	// ... 代表省略了之前写的代码
    // ...

    // 鼠标按下事件
    canvas.onmousedown = function(e){
        // ...
        if(eraserEnabled){//要使用eraser
            context.clearRect(x-5,y-5,10,10)
        }else{
            lastPoint = {'x':x,'y':y}
        }
    }

    // 鼠标移动事件
    canvas.onmousemove = function(e){
        let x = e.clientX;
        let y = e.clientY;
        if(!painting){return}
        if(eraserEnabled){
            context.clearRect(x-5,y-5,10,10);
        }else{
            var newPoint = {'x':x,'y':y};
            drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
            lastPoint = newPoint;
        }  
    }

    // ...
}


// 点击橡皮檫
eraser.onclick = function(){
    eraserEnabled = true;
    eraser.classList.add('active');
    brush.classList.remove('active');
}
```

### 4.实现清屏功能

实现思路：

1. 获取元素节点。
2. 点击清空按钮清空canvas画布。

```js
let reSetCanvas = document.getElementById("clear");

// 实现清屏
reSetCanvas.onclick = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBg('white');
}

// 重新设置canvas背景颜色
function setCanvasBg(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
```

#### 5.实现保存成图片功能

实现思路：

1. 获取`canvas.toDateURL`
2. 在页面里创建并插入一个a标签
3. a标签href等于`canvas.toDateURL`，并添加download属性
4. 点击保存按钮，a标签触发`click`事件

```js
let save = document.getElementById("save");

// 下载图片
save.onclick = function(){
    let imgUrl = canvas.toDataURL('image/png');
    let saveA = document.createElement('a');
    document.body.appendChild(saveA);
    saveA.href = imgUrl;
    saveA.download = 'mypic'+(new Date).getTime();
    saveA.target = '_blank';
    saveA.click();
}
```

#### ~~6.实现改变背景颜色的功能~~ 

~~实现思路：~~

1. ~~获取相应的元素节点。~~
2. ~~给每一个class为bgcolor-item的标签添加点击事件，当点击事件触发时，改变背景颜色。~~
3. ~~点击设置背景颜色的div之外的地方，实现隐藏那个div。~~

```js
let selectBg = document.querySelector('.bg-btn');
let bgGroup = document.querySelector('.color-group');
let bgcolorBtn = document.querySelectorAll('.bgcolor-item');
let penDetail = document.getElementById("penDetail");
let activeBgColor = '#fff';


// 实现了切换背景颜色
for (let i = 0; i < bgcolorBtn.length; i++) {
    bgcolorBtn[i].onclick = function (e) {
        // 阻止冒泡
        e.stopPropagation();
        for (let i = 0; i < bgcolorBtn.length; i++) {
            bgcolorBtn[i].classList.remove("active");
            this.classList.add("active");
            activeBgColor = this.style.backgroundColor;
            setCanvasBg(activeBgColor);
        }
    }
}

document.onclick = function(){
    bgGroup.classList.remove('active');
}

selectBg.onclick = function(e){
    bgGroup.classList.add('active');
    e.stopPropagation();
}
```

#### 7.实现改变画笔粗细的功能

实现思路：

1. 实现让设置画笔的属性的对话框出现。
2. 获取相应的元素节点。
3. 当input=range的元素发生改变的时候，获取到的值赋值给lWidth。
4. 然后设置`context.lineWidth = lWidth`。

```js
let range1 = document.getElementById('range1');
let lWidth = 2;
let ifPop = false;

range1.onchange = function(){
    console.log(range1.value);
    console.log(typeof range1.value)
    thickness.style.transform = 'scale('+ (parseInt(range1.value)) +')';
    console.log(thickness.style.transform )
    lWidth = parseInt(range1.value*2);
}


// 画线函数
function drawLine(x1,y1,x2,y2){
    // ...
    context.lineWidth = lWidth;
    // ...
}

// 点击画笔
brush.onclick = function(){
    eraserEnabled = false;
    brush.classList.add('active');
    eraser.classList.remove('active');
    if(!ifPop){
        // 弹出框
        console.log('弹一弹')
        penDetail.classList.add('active');
    }else{
        penDetail.classList.remove('active');
    }
    ifPop = !ifPop;
}
```

#### 8.实现改变画笔颜色的功能

实现思路跟**改变画板背景颜色**的思路类似。

```js
let aColorBtn = document.getElementsByClassName("color-item");

getColor();

function getColor(){
    for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].onclick = function () {
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                ctx.fillStyle = activeColor;
                ctx.strokeStyle = activeColor;
            }
        }
    }
}
```

#### 9.实现改变撤销和重做的功能

实现思路：

1. 保存快照：每完成一次绘制操作则保存一份 canvas 快照到 `canvasHistory` 数组（生成快照使用 canvas 的 `toDataURL()` 方法，生成的是 base64 的图片）；
2. 撤销和反撤销：把 `canvasHistory` 数组中对应索引的快照使用 canvas 的 `drawImage()` 方法重绘一遍；
3. 绘制新图像：执行新的绘制操作时，删除当前位置之后的数组记录，然后添加新的快照。

```js
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");

// ...
canvas.ontouchend = function () {
        painting = false;
        canvasDraw();
}

// ...
canvas.onmouseup = function(){
        painting = false;
        canvasDraw();
}

let canvasHistory = [];
let step = -1;

// 绘制方法
function canvasDraw(){
    step++;
    if(step < canvasHistory.length){
        canvasHistory.length = step;  // 截断数组
    }
    // 添加新的绘制到历史记录
    canvasHistory.push(canvas.toDataURL());
}

// 撤销方法
function canvasUndo(){
    if(step > 0){
        step--;
        // ctx.clearRect(0,0,canvas.width,canvas.height);
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[step];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        undo.classList.add('active');
    }else{
        undo.classList.remove('active');
        alert('不能再继续撤销了');
    }
}
// 重做方法
function canvasRedo(){
    if(step < canvasHistory.length - 1){
        step++;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[step];
        canvasPic.onload = function () { 
            // ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
        }
        redo.classList.add('active');
    }else {
        redo.classList.remove('active')
        alert('已经是最新的记录了');
    }
}
undo.onclick = function(){
    canvasUndo();
}
redo.onclick = function(){
    canvasRedo();
}
```

#### 10.兼容移动端

实现思路：

1. 判断设备是否支持触摸
2. `true`，则使用`touch`事件；`false`，则使用`mouse`事件

```js
// ...
if (document.body.ontouchstart !== undefined) {
    // 使用touch事件
    anvas.ontouchstart = function (e) {
        // 开始触摸
    }
    canvas.ontouchmove = function (e) {
        // 开始滑动
    }
    canvas.ontouchend = function () {
        // 滑动结束
    }
}else{
    // 使用mouse事件
    // ...
}
// ...
```

## 四、踩坑

### 问题1：在电脑上对浏览器的窗口进行改变，画板不会自适应

解决办法：

onresize响应事件处理中，获取到的页面尺寸参数是变更后的参数 。

当窗口大小发生改变之后，重新设置canvas的宽高，简单来说，就是窗口改变之后，给canvas.width和canvas.height重新赋值。

```js
// 记得要执行autoSetSize这个函数哦
function autoSetSize(){
    canvasSetSize();
    // 当执行这个函数的时候，会先设置canvas的宽高
    function canvasSetSize(){
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
    // 在窗口大小改变之后,就会触发resize事件，重新设置canvas的宽高
    window.onresize = function(){
        canvasSetSize();
    }
}
```

### 问题2：当绘制线条宽度比较小的时候还好,一旦比较粗就会出现问题

解决办法：看一下文档，得出方法，只需要简单修改一下**绘制线条的代码**就行

```js
 // 画线函数
function drawLine(x1,y1,x2,y2){
    context.beginPath();
    context.lineWidth = lWidth;
    //-----加入-----
    // 设置线条末端样式。
    context.lineCap = "round";
    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    //-----加入-----
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
}
```

### 问题3：如何实现圆形的橡皮檫？

解决办法：

canvas的API中，可以清除像素的就是`clearRect`方法，但是`clearRect`方法的清除区域矩形，毕竟大部分人的习惯中的橡皮擦都是圆形的，所以就引入了剪辑区域这个强大的功能，也就是`clip`方法。用法很简单：　 

```js
ctx.save()
ctx.beginPath()
ctx.arc(x2,y2,a,0,2*Math.PI);
ctx.clip()
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.restore();
```

上面那段代码就实现了圆形区域的擦除，也就是先实现一个圆形路径，然后把这个路径作为剪辑区域，再清除像素就行了。有个注意点就是需要先保存绘图环境，清除完像素后要重置绘图环境，如果不重置的话以后的绘图都是会被限制在那个剪辑区域中。 

### 问题4：如何兼容移动端？

#### 1.添加meta标签

因为浏览器初始会将页面现在手机端显示时进行缩放，因此我们可以在meta标签中设置meta viewport属性，告诉浏览器不将页面进行缩放，页面宽度=用户设备屏幕宽度 

```js
<meta name="viewport" content="width=device-width,
initial-scale=1,user-scalable=no,
maximum-scale=1.0,minimum-scale=1.0"/>

/*
页面宽度=移动宽度 ：width=device-width
用户不可以缩放：user-scalable=no
缩放比例：initial-scale=1
最大缩放比例：maximum-scale=1.0
最小缩放比例：minimum-scale=1.0
*/
```

#### 2.在移动端几乎使用的都是touch事件，与PC端不同

由于移动端是触摸事件，所以要用到H5的属性touchstart/touchmove/touchend,但是PC端只支持鼠标事件，所以要进行特性检测。

在`touch`事件里，是通过`.touches[0].clientX`和`.touches[0].clientY`来获取坐标的，这点要和`mouse`事件区别开。 

### 问题5：当浏览器大小变化时，画布被清空
解决办法1：http://js.jirengu.com/dafic/2/edit

解决办法2：http://js.jirengu.com/worus/2/edit

参考链接：[canvas长宽变化时，画布内容消失](https://blog.csdn.net/vuturn/article/details/47807899)
### 问题6：当橡皮擦移动很快时会变成圆点
参考链接：
[HTML5 实现橡皮擦的擦除效果](https://www.cnblogs.com/axes/p/3850309.html)

### 问题7：橡皮擦把背景层都给擦掉了，橡皮擦需要优化
嗯嗯，这个问题尚未解决，所以我就先把自定义背景颜色的功能取消掉

### 问题8：出现一个问题就是清空之后，重新画，然后出现原来的画的东西

这个嘛，问题不大，只不过是我漏写context.beginPath(); ，也花了一点时间在上面解决bug，让我想起“代码千万行,注释第一行;编程不规范,同事两行泪 ”，还是按照文档操作规范操作好，真香！！！

>本文作者 **xyyojl**
>
>本文如有错误之处，请留言，我会及时更正
>
>或者提bug、提需求也是可以的
>
>觉得对您有帮助的话就**点个赞**或**收藏**吧！
>
>*欢迎转载或分享，转载时请注明出处*
