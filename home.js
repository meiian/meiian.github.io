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

function goToTitle() {
    document.getElementById("about-me").style.height = null;
    document.getElementById("arrow").style.marginTop = null;
    document.getElementById("informations").style.height = null;
    document.getElementById("informations").style.paddingTop = null;
    document.getElementById("informations").style.padding = null;
    document.getElementById("pfp").style.height = null;
    document.getElementById("pfp").style.width = null;
    document.getElementById("arrowback").style.opacity = null;
    document.getElementById("arrow").style.marginBottom = null;
    showElementWithoutAnim("whoami");
    showElementWithoutAnim("likes");
    showElementWithoutAnim("pronuns");
    showElementWithoutAnim("langs");
}

function scrollHandle(direction) {
    if (direction > 0) {
        hideElementWitouthAnim("whoami");
        hideElementWitouthAnim("likes");
        hideElementWitouthAnim("pronuns");
        hideElementWitouthAnim("langs");
        document.getElementById("about-me").style.height = "10vh";
        document.getElementById("arrow").style.marginTop = "0vh";
        document.getElementById("arrow").style.marginBottom = "0vh";
        document.getElementById("arrowback").style.opacity = "1";
        document.getElementById("projects").style.marginBottom = "auto";
        document.getElementById("informations").style.height = "9vh";
        document.getElementById("informations").style.padding = "0px";
        document.getElementById("informations").style.paddingTop = "5px";
        document.getElementById("pfp").style.height = "8vh";
        document.getElementById("pfp").style.width = "auto";    

    }
  }

  function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

function addProject(project) {
    let projcont = document.getElementById("projects");
    let projectNode = document.createElement("div");
    projectNode.id = project.id;
    projectNode.className = "project";
    projectNode.innerHTML = 
        `  
        <div class="backdrop-desc">
            <div class="proj-desc" style="background-color: #4ed0e8">
                <h3><i class="bi bi-chevron-double-right"></i> ${project.name}</h3>
                <p><i class="bi bi-card-text"></i> ${project.desc}</p>
                <a href="${project.link}"><span class="tag">Accéder</span></a>
            </div>
        </div>
        `;
    projectNode.style.background = `url(${project.img}) 50% 50% no-repeat`;
    projectNode.style.backgroundSize = "cover";
    projectNode.addEventListener("mouseenter", function(){
        document.querySelector("#" + project.id + " .backdrop-desc").style.opacity = 1;
    });
    projectNode.addEventListener("mouseleave", function(){
        document.querySelector("#" + project.id + " .backdrop-desc").style.opacity = 0;
    });
    projectNode.addEventListener("touchstart", function(){
        document.querySelector("#" + project.id + " .backdrop-desc").style.opacity = 1;
    });
    projectNode.addEventListener("touchend", function(){
        document.querySelector("#" + project.id + " .backdrop-desc").style.opacity = 0;
    });
    projcont.appendChild(projectNode);
}

/////////////////////////////////////
//              MAIN               //
/////////////////////////////////////

let debug = false;
let names = ["Lucie", "Laïka", "Margot", "Alice"];
let projects = [
    {
        id:"ac-mail",
        name:"Créateur de lettres AC",
        desc:"Pour créer des lettres comme dans Animal Crossing New Leaf sauf que c'est sur votre navigateur.",
        link:"./ac-mail.html",
        img:"./ac-mail/twitter-card.png",
        size: 1
    },
    {
        id:"ew-countdown",
        name:"Compte à rebours Endwalker",
        desc:"Un compte à rebours pour la sortie d'Endwalker, l'extension du MMO Final Fantasy XIV sortie en Novembre 2021.",
        link:"./Endwalker.html",
        img:"./images/endwalker.webp",
        size: 1
    },
    
    {
        id:"critiques-animes",
        name:"Mini-critiques d'animes",
        desc:"Un site créé pour accueillir des mini-critiques sur des animes que j'ai regardé. En pause pour le moment.",
        link:"./animes.html",
        img:"./images/critiques_anime.webp",
        size: 1
    },
    {
        id:"pokemon-y-lp",
        name:"Playthrough Pokémon Y Random",
        desc:"Un (petit) thread Twitter que j'ai fait sur ma partie de Pokémon Y en full randomisé.",
        link:"https://twitter.com/Azusa471/status/1334810551038464002",
        img:"./images/pokemony.webp",
        size: 0
    },
    {
        id:"pokemon-moon-lp",
        name:"Playthrough Pokémon Ultra-Lune Random",
        desc:"Un autre (petit) thread Twitter que j'ai fait sur ma partie de Pokémon Ultra-Lune en full randomisé.",
        link:"https://twitter.com/Azusa471/status/1358154808918749184",
        img:"./images/pokemonmoon.webp",
        size: 0
    },
    {
        id:"adibou-sr",
        name:"WR Adibou et l'Ombre Verte",
        desc:"J'ai remporté 2 fois le World Record de speedrun sur Adibou et l'Ombre Verte sur PSX (emulée).",
        link:"https://www.speedrun.com/adiboo_and_the_green_shadow",
        img:"./images/adibousr.webp",
        size: 2
    }
]

let today = new Date();
let colorOfTheDay = getColorOfTheDay(today);
colorOfTheDay = "#4ed0e8";
let primaryBg = document.getElementsByClassName("primary-bg");
for (let i=0 ; i < primaryBg.length ; i++) {
    primaryBg[i].style.backgroundColor = colorOfTheDay;
}

projects.sort(function(a,b) {
    return b.size - a.size;
});

projects.forEach( e => addProject(e) );

let spaceDiv = document.createElement("div");
spaceDiv.className = "space";
document.getElementById("projects").appendChild(spaceDiv);

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
        setTimeout(function(){showElement("informations"); showElement("arrow"); showElement("projects")},450);
        document.body.addEventListener("wheel",function(event) {
            scrollHandle(event.deltaY);
        });
        
        document.querySelector("#arrow > i").addEventListener("click", function() {
            scrollHandle(1);
        });

        
        
        document.querySelector("#arrowback").addEventListener("click", function() {
            goToTitle();
        });

        swipedetect(document.getElementById("arrow"), function(swipedir) {
            if(swipedir == 'up')
                scrollHandle(1);
        });

        document.querySelector("#arrow > i").addEventListener("touchend", function() {
            scrollHandle(1);
        });
        /*swipedetect(document.body, function(swipedir) {
            if(swipedir == "down")
                scrollHandle(-1);
        });*/
    }, 1000);

    let nameInc = 0;
    /*let nameInterval = setInterval(function() {
        if(nameInc >= names.length)
            nameInc = 0;
        changeName(names[nameInc]);
        nameInc++;
    }, 4000);*/
}
else{
    let debugHidden = ["hello"];
    debugHidden.forEach(function(e) {
        let elem = document.getElementById(e);
        elem.style.opacity = 0;
        elem.style.display = "none";
    });
}
