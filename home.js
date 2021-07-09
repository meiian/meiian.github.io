/////////////////////////////////////
//            FUNCTIONS            //
/////////////////////////////////////

// Get a color based on a date.
// param : day (Date object).
// return : Color in hex format.
function getColorOfTheDay(day) {
    let color =
        {
            red: 0,
            blue: 0,
            green: 0
        };
    let colorHex = "#";
    let colorToSaturate = (day.getFullYear() + day.getMonth() + day.getDate())%3;
    color.red = color.red + ((day.getFullYear() + day.getMonth()*2 + day.getDate()*3)%100) + ((colorToSaturate==0)?50:0);
    color.blue = color.blue + ((day.getFullYear()*2 + day.getMonth()*3 + day.getDate())%100) + ((colorToSaturate==1)?50:0);
    color.green = color.green + ((day.getFullYear()*3 + day.getMonth() + day.getDate()*2)%100) + ((colorToSaturate==2)?50:0);
    colorHex += ((color.red.toString(16).length<2)?'0':'') + color.red.toString(16) + ((color.blue.toString(16).length<2)?'0':'') + color.blue.toString(16) + ((color.green.toString(16).length<2)?'0':'') + color.green.toString(16);
    document.getElementById("word-cotd").innerHTML = ntc.name(colorHex)[1];
    return colorHex;
}

// Show a hidden element.
// param : id The id of the element to show.
function showElement(id) {
    let element = document.getElementById(id);
    element.style.display = null;
    setTimeout(function(){element.style.opacity = 1;}, 550);
}

function showElementWithoutAnim(id) {
    let element = document.getElementById(id);
    element.style.display = null;
    element.style.opacity = 1;
}


// Hide a element.
// param : id The id of the element to hide.
function hideElement(id) {
    let element = document.getElementById(id);
    element.style.opacity = 0;
    setTimeout(function(){element.style.display = "none";}, 550);
}

function hideElementWitouthAnim(id) {
    let element = document.getElementById(id);
    element.style.opacity = 0;
    element.style.display = "none";
}

function changeName(name) {
    let namespan = document.getElementById("name");
    namespan.style.opacity = 0;
    setTimeout(function(){namespan.innerHTML = name;},210);
    setTimeout(function(){namespan.style.opacity = 1;},220);
}

function scrollHandle(lastScrollTop) {
    console.log(document.body.scrollTop);
    if (document.body.scrollTop > 10) {
        hideElementWitouthAnim("whoami");
        hideElementWitouthAnim("likes");
        hideElementWitouthAnim("pronuns");
        hideElementWitouthAnim("mbti");
        hideElementWitouthAnim("langs");
        document.getElementById("about-me").style.height = "10vh";
        document.getElementById("arrow").style.marginTop = "0vh";
        document.getElementById("projects").style.marginTop = "15vh";
        document.getElementById("projects").style.paddingBottom = "60vh";
        document.getElementById("informations").style.height = "9vh";
        document.getElementById("informations").style.padding = "0px";
        document.getElementById("informations").style.paddingTop = "5px";
        document.getElementById("pfp").style.height = "8vh";
        document.getElementById("pfp").style.width = "auto";    
    } else {
        document.getElementById("about-me").style.height = null;
        document.getElementById("arrow").style.marginTop = null;
        document.getElementById("informations").style.height = null;
        document.getElementById("informations").style.paddingTop = null;
        document.getElementById("informations").style.padding = null;
        document.getElementById("pfp").style.height = null;
        document.getElementById("pfp").style.width = null;
        showElementWithoutAnim("whoami");
        showElementWithoutAnim("likes");
        showElementWithoutAnim("pronuns");
        showElementWithoutAnim("mbti");
        showElementWithoutAnim("langs");
    }
    return document.body.scrollTop;
  }

/////////////////////////////////////
//              MAIN               //
/////////////////////////////////////

let debug = false;
let names = ["Lucie", "Laïka", "Margot", "Alice"];

let today = new Date();
let colorOfTheDay = getColorOfTheDay(today);
let primaryBg = document.getElementsByClassName("primary-bg");
for (let i=0 ; i < primaryBg.length ; i++) {
    primaryBg[i].style.backgroundColor = colorOfTheDay;
}
var lastScrollTop = 0;
let canScroll = true;
window.onscroll = function() {
    setTimeout(function(){canScroll = true}, 0);
    if(canScroll)
        lastScrollTop = scrollHandle(lastScrollTop);
    canScroll = false;
};

if(!debug){
    document.getElementById("about-me").style.height = "100vh";
    let initHidden = ["informations", "arrow", "projects"];
    initHidden.forEach(function(e) {
        let elem = document.getElementById(e);
        elem.style.opacity = 0;
        elem.style.display = "none";
    });

    let infosTimeout = setTimeout(function(){
        document.getElementById("about-me").style.height = null;
        hideElement("hello");
        setTimeout(function(){showElement("informations"); showElement("arrow"), showElement("projects")},450);
    }, 1000);

    let nameInc = 0;
    let nameInterval = setInterval(function() {
        if(nameInc >= names.length)
            nameInc = 0;
        changeName(names[nameInc]);
        nameInc++;
    }, 4000);
}
else{
    let debugHidden = ["hello"];
    debugHidden.forEach(function(e) {
        let elem = document.getElementById(e);
        elem.style.opacity = 0;
        elem.style.display = "none";
    });
}
