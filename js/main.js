let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let eraser = document.getElementById('eraser');
let brush = document.getElementById('brush');
let reSetCanvas = document.getElementById("clear");
let save = document.getElementById("save");
/* let selectBg = document.querySelector('.bg-btn');
let bgGroup = document.querySelector('.color-group');
let bgcolorBtn = document.querySelectorAll('.bgcolor-item'); */
let penDetail = document.getElementById("penDetail");
let aColorBtn = document.getElementsByClassName("color-item");
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");


let range1 = document.getElementById('range1');
let range2 = document.getElementById('range2');
let showOpacity = document.querySelector('.showOpacity');
let closeBtn = document.querySelectorAll('.closeBtn');
let eraserEnabled = false;
let activeBgColor = '#fff';
let ifPop = false;
let lWidth = 2;
let opacity = 1;
let strokeColor = 'rgba(0,0,0,1)';
let radius = 5;


autoSetSize();

setCanvasBg('white');

listenToUser();


/* 下面是实现相关效果的函数，可以不用看 */

function autoSetSize(){
    canvasSetSize();
    function canvasSetSize(){
        // 把变化之前的画布内容copy一份，然后重新画到画布上
        let imgData = context.getImageData(0,0,canvas.width,canvas.height);
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        context.putImageData(imgData,0,0);
    }

    window.onresize = function(){
        canvasSetSize();
    }
}

// 监听用户鼠标事件
function listenToUser() {
    // 定义一个变量初始化画笔状态
    let painting = false;
    // 记录画笔最后一次的位置
    let lastPoint = {x: undefined, y: undefined};

    if(document.body.ontouchstart !== undefined){
        canvas.ontouchstart = function (e) {
            painting = true;
            let x1 = e.touches[0].clientX;
            let y1 = e.touches[0].clientY;
            if(eraserEnabled){//要使用eraser
                context.save();
                context.globalCompositeOperation = "destination-out";
                context.beginPath();
                radius = (lWidth/2) > 5? (lWidth/2) : 5;
                context.arc(x1,y1,radius,0,2*Math.PI);
                context.clip();
                context.clearRect(0,0,canvas.width,canvas.height);
                context.restore();
                lastPoint = {'x': x1,'y': y1}
            }else{
                lastPoint = {'x': x1,'y': y1}
            }
        };
        canvas.ontouchmove = function (e) {
            let x1 = lastPoint['x'];
            let y1 = lastPoint['y'];
            let x2 = e.touches[0].clientX;
            let y2 = e.touches[0].clientY;
            if(!painting){return}
            if(eraserEnabled){
                moveHandler(x1,y1,x2,y2);
                //记录最后坐标
                lastPoint['x'] = x2;
                lastPoint['y'] = y2;
            }else{
                let newPoint = {'x': x2,'y': y2};
                drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }  
        };

        canvas.ontouchend = function () {
            painting = false;
            canvasDraw();
        }
    }else{
        // 鼠标按下事件
        canvas.onmousedown = function(e){
            painting = true;
            let x1 = e.clientX;
            let y1 = e.clientY;
            if(eraserEnabled){//要使用eraser
                //鼠标第一次点下的时候擦除一个圆形区域，同时记录第一个坐标点
                context.save();
                context.globalCompositeOperation = "destination-out";
                context.beginPath();
                radius = (lWidth/2) > 5? (lWidth/2) : 5;
                context.arc(x1,y1,radius,0,2*Math.PI);
                context.clip();
                context.clearRect(0,0,canvas.width,canvas.height);
                context.restore();
                lastPoint = {'x': x1,'y': y1}
            }else{
                lastPoint = {'x': x1,'y': y1}
            }
        }

        // 鼠标移动事件
        canvas.onmousemove = function(e){
            let x1 = lastPoint['x'];
            let y1 = lastPoint['y'];
            let x2 = e.clientX;
            let y2 = e.clientY;
            if(!painting){return}
            if(eraserEnabled){
                moveHandler(x1,y1,x2,y2);
                //记录最后坐标
                lastPoint['x'] = x2;
                lastPoint['y'] = y2;
            }else{
                let newPoint = {'x': x2,'y': y2};
                drawLine(lastPoint.x, lastPoint.y,newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }  
        }

        // 鼠标松开事件
        canvas.onmouseup = function(){
            painting = false;
            canvasDraw();
        }
    }


    
}

// 
function moveHandler(x1,y1,x2,y2){
    //获取两个点之间的剪辑区域四个端点
    var asin = radius*Math.sin(Math.atan((y2-y1)/(x2-x1)));
    var acos = radius*Math.cos(Math.atan((y2-y1)/(x2-x1)))
    var x3 = x1+asin;
    var y3 = y1-acos;
    var x4 = x1-asin;
    var y4 = y1+acos;
    var x5 = x2+asin;
    var y5 = y2-acos;
    var x6 = x2-asin;
    var y6 = y2+acos;
    
　　//保证线条的连贯，所以在矩形一端画圆
    context.save()
    context.beginPath()
    context.globalCompositeOperation = "destination-out";
    radius = (lWidth/2) > 5? (lWidth/2) : 5;
    context.arc(x2,y2,radius,0,2*Math.PI);
    context.clip()
    context.clearRect(0,0,canvas.width,canvas.height);
    context.restore();

　　//清除矩形剪辑区域里的像素
    context.save()
    context.beginPath()
    context.globalCompositeOperation = "destination-out";
    context.moveTo(x3,y3);
    context.lineTo(x5,y5);
    context.lineTo(x6,y6);
    context.lineTo(x4,y4);
    context.closePath();
    context.clip();
    context.clearRect(0,0,canvas.width,canvas.height);
    context.restore();
}


// 画线函数
function drawLine(x1,y1,x2,y2){
    context.beginPath();
    context.lineWidth = lWidth;
    // context.strokeStyle = strokeColor;
    // context.globalAlpha = opacity;
    // 设置线条末端样式。
    context.lineCap = "round";
    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
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
    if(!ifPop){
        // 弹出框
        penDetail.classList.add('active');
    }else{
        penDetail.classList.remove('active');
    }
    ifPop = !ifPop;
}

// 实现清屏
reSetCanvas.onclick = function(){
    context.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBg('white');
    canvasHistory = [];
    undo.classList.remove('active');
    redo.classList.remove('active');
}

// 重新设置canvas背景颜色
function setCanvasBg(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
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


// 实现了切换背景颜色
/* for (let i = 0; i < bgcolorBtn.length; i++) {
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
} */

// 实现改变画笔粗细的功能 1-20 放大的倍数 1 10 实际大小呢？ 2-20

range1.onchange = function(){
    thickness.style.transform = 'scale('+ (parseInt(range1.value)) +')';
    lWidth = parseInt(range1.value*2);
}

range2.onchange = function(){
    opacity = 1 - parseInt(this.value)/10;
    if(opacity !== 0){
        showOpacity.style.opacity = opacity;
    }  
}

// 改变画笔颜色
getColor();

function getColor(){
    for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].onclick = function (e) {
            // e.stopPropagation();
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                context.fillStyle = activeColor;
                context.strokeStyle = activeColor;
            }
            penDetail.classList.remove('active');
            ifPop = false;
        }
    }
}

// 实现撤销和重做的功能
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
    if(step > 0){
        undo.classList.add('active');
    }
}

// 撤销方法
function canvasUndo(){
    if(step > 0){
        step--;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[step];
        canvasPic.onload = function () { context.drawImage(canvasPic, 0, 0); }
        undo.classList.add('active');
        redo.classList.add('active');
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
            context.drawImage(canvasPic, 0, 0);
        }
        // redo.classList.add('active');
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



for (let index = 0; index < closeBtn.length; index++) {
    closeBtn[index].onclick = function(e){
        let btnParent = e.target.parentElement;
        btnParent.classList.remove('active');
    }
    
}

window.onbeforeunload = function(){
    return "Reload site?";
};
