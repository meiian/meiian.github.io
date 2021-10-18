let pages = [
    {
        title: "",
        text: "",
        image: ""
    }
]

function calculate_switch_size() {
    if (document.body.scrollWidth > 1000*100/60) {
        return 0.7;
    }
    return Math.abs(document.body.scrollWidth/(1000*100/60) - 0.3);
}

function resize_switch() {
    if (screen.width <= 600) {
        document.getElementById("picture-frame").style.marginRight = `0px`;
        document.getElementById("picture-frame").style.width = `${document.getElementById("main-container").offsetWidth - calculate_switch_size()*1219 + 20}px`
        document.getElementById("picture-frame").style.transform = `scale(${calculate_switch_size()})`
    }
    else{
        document.getElementById("picture-frame").style.marginRight = `${calculate_switch_size()*1219}px`
        document.getElementById("picture-frame").style.transform = `scale(${calculate_switch_size()})`
    }
}
resize_switch()
window.onresize = function(){
    resize_switch()
}