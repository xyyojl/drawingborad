range1.onchange = function(){
    console.log(range1.value);
    console.log(typeof range1.value)
    thickness.style.transform = 'scale('+ parseInt(range1.value) +')'
    // console.log(penWidth.width)
}