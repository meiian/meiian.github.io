function resize() {
    if(screen.width < 600){
        document.getElementById("rightcontainer").style.paddingTop = document.getElementById("leftinfos").scrollHeight;
        document.getElementById("leftcontainer").style.height = document.getElementById("rightcontainer").scrollHeight + window.innerHeight*0.05;
        
    }
    else {
        document.getElementById("syno").style.width = document.getElementById("rightcontainer").scrollWidth - document.getElementById("return").scrollWidth - document.getElementById("leftinfos").scrollWidth;
        document.getElementById("etc").style.height = document.getElementById("etc2").scrollHeight + document.getElementById("footer").scrollHeight*2;
    }
}

var field = 'video';
var url = window.location.href;
if(url.indexOf('?' + field) != -1){
    console.log("Video enabled");
    let vid = document.createElement("div");
    vid.id = "videobg";
    vid.innerHTML = `<video src="op.webm" width="1920" loop autoplay muted>`;
    document.body.prepend(vid);
};
