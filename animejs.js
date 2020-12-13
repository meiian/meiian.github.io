function resize() {
    if(screen.width < 600){
        document.getElementById("leftcontainer").style.height = document.getElementById("rightcontainer").scrollHeight;
    }
    else {
        document.getElementById("syno").style.width = document.getElementById("rightcontainer").scrollWidth - document.getElementById("return").scrollWidth - document.getElementById("leftinfos").scrollWidth;
        document.getElementById("etc").style.height = document.getElementById("etc2").scrollHeight + document.getElementById("footer").scrollHeight*2;
    }
}