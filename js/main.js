let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let eraser = document.getElementById('eraser');
let brush = document.getElementById('brush');
let reSetCanvas = document.getElementById("clear");
let save = document.getElementById("save");
let selectBg = document.querySelector('.bg-btn');
let bgGroup = document.querySelector('.color-group');
let bgcolorBtn = document.querySelectorAll('.bgcolor-item');
let penDetail = document.getElementById("penDetail");
let eraserEnabled = false;
let activeBgColor = '#fff';

// 实现了切换背景颜色
for (let i = 0; i < bgcolorBtn.length; i++) {
    bgcolorBtn[i].onclick = function (e) {
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




// bgGroup.
// bg-btn color-group
autoSetSize();

setCanvasBg('white');

listenToUser();

function autoSetSize(){
    canvasSetSize();
    function canvasSetSize(){
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
    window.onresize = function(){
        canvasSetSize();
    }
}


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
        if(eraserEnabled){//要使用eraser
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            ctx.clip();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.restore();
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
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            ctx.clip();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.restore();
        }else{
            var newPoint = {'x':x,'y':y};
            drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
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
    // 保存默认的状态
    ctx.save();
    // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    ctx.beginPath();
    // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
    // 从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
    ctx.arc(x,y,radius,0,Math.PI*2);
    // 通过填充路径的内容区域生成实心的图形
    ctx.fill();
    // 闭合路径之后图形绘制命令又重新指向到上下文中。
    ctx.closePath();
}

function drawLine(x1,y1,x2,y2){
    ctx.beginPath();
    // 设置线条宽度
    ctx.lineWidth = 10;
    // 设置线条末端样式。
    ctx.lineCap = "round";
    // 设定线条与线条间接合处的样式
    ctx.lineJoin = "round";
    // moveTo(x,y)将笔触移动到指定的坐标x以及y上
    ctx.moveTo(x1,y1);
    // lineTo(x, y) 绘制一条从当前位置到指定x以及y位置的直线
    ctx.lineTo(x2,y2);
    // 通过线条来绘制图形轮廓
    ctx.stroke();
    ctx.closePath();
}

// 点击橡皮檫
eraser.onclick = function(){
    eraserEnabled = true;
    eraser.classList.add('active');
    brush.classList.remove('active');
}
// 点击画笔
brush.onclick = function(){
    eraserEnabled = false;
    brush.classList.add('active');
    eraser.classList.remove('active');
}

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


/* range1.onchange = function(){
    console.log(range1.value);
    console.log(typeof range1.value)
    thickness.style.transform = 'scale('+ parseInt(range1.value) +')'
    // console.log(penWidth.width)
} */


/* 对canvas中特定元素的旋转平移等操作实际上是对整个画布进行了操作，
所以如果不对canvas进行save以及restore，那么每一次绘图都会在上一次的基础上进行操作，
最后导致错位。比如说你相对于起始点每次30度递增旋转，30，60，90.
如果不使用save 以及 restore 就会变成30, 90, 150，每一次在前一次基础上进行了旋转。
save是入栈，restore是出栈。 */