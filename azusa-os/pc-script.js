

const svgs = {
    "close" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`,
    "about-me" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>`,
    "countdown" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>`,
    "links" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/></svg>`,
    "day" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>`,
    "night" : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/></svg>`
}

const windows_html = {
    "about-me" : {
        title: "About me",
        icon: svgs["about-me"],
        html: `<div class="centered"> <div class="pfp"> <img src="./images/pc/yes.jpg"/> </div><h2 class="centered-text colored-text" style="font-size: 48px;">Azusa</h2> <p class="centered centered-text colored-text" style="font-size: 32px; max-width: 90%;">I'm too lazy to describe myself, just know I've a world record of speedrunning Adiboo and the Green Shadow.</p><p class="centered-text colored-text" style="font-size: 16px;">(also my pronouns are she/her)</p></div>`
    },

    "countdown" : {
        title: "Countdowns",
        icon: svgs["countdown"],
        html: `<div id="countdown-background" class="centered"> <div id="countdown-list"> <div class="countdown-cont"> <video autoplay muted loop class="countdown-video"> <source src="../pokemon-sv/video.webm" type="video/mp4"> </video> <div class="countdown-multi-logos"> <img src="../pokemon-sv/s-logo.webp"/> <img src="../pokemon-sv/v-logo.webp"/> </div><div class="countdown-count-cont" id="pokemon-sv-count"> <div class="countdown-part" id="pokemon-sv-days"></div><div class="countdown-part" id="pokemon-sv-hours"></div><div class="countdown-part" id="pokemon-sv-mins"></div><div class="countdown-part" id="pokemon-sv-secs"></div></div></div></div></div>`
    },

    "links" : {
        title: "Links",
        icon: svgs["links"],
        html: `<div id="links-background" class="centered"> <div id="links-list"> <a href="https://twitter.com/azusa_chi" class="link-a" style="--color: #1da1f2"> <p>Twitter</p></a> <a href="https://www.youtube.com/channel/UC2f2jKVzXycgYqXpqXZu6IA" class="link-a" style="--color: red"> <p>YouTube</p></a> <a href="https://www.twitch.tv/alice_meios" class="link-a" style="--color: #9c2bfd"> <p>Twitch</p></a> <a href="https://asuka-r1n.tumblr.com/" class="link-a" style="--color: #8a8fd0"> <p>Tumblr</p></a> </div></div>`
    }
}

const countdowns = [
    {
        id:"pokemon-sv",
        date: new Date(2022, 12, 31, 23, 59, 59),
        finish_str: "¡¡¡¡¡¡vamos!!!!!!",
        interval : false
    }
];

let day_theme = 'true';

if(localStorage.getItem('azusa-os-light-theme') !== null){
    day_theme = localStorage.getItem('azusa-os-light-theme')
}
else {
    localStorage.setItem('azusa-os-light-theme', true)
}





let active_windows = [];

let windows_position = [];

fill_svgs("window-header-close", svgs["close"]);
fill_svgs("dock-apps-about-me", svgs["about-me"]);
fill_svgs("dock-apps-countdown", svgs["countdown"]);
fill_svgs("dock-apps-links", svgs["links"]);
if(day_theme === 'true'){
    fill_svgs("dock-day-night", svgs["day"]);
    document.documentElement.style.setProperty('--background-color', 'white');
}
else{
    fill_svgs("dock-day-night", svgs["night"]);
    document.documentElement.style.setProperty('--background-color', '#050505');
}

document.getElementById("dock-space").style.width = document.getElementById("dock-hour-date").scrollWidth;

let dock_apps = document.getElementsByClassName("dock-app");

document.getElementById("day-night-button").addEventListener("click", function(){
    change_theme();
});

for (i = 0; i < dock_apps.length ; i++) {
    dock_apps[i].addEventListener("click", function(e){
        let window_name = e.target.id.replace("dock-app-", "");
        show_window(window_name);
    });
}

update_hour_date();
let interval_update_time = setInterval(update_hour_date, 1000);


/*
###########################
#### F U N C T I O N S ####
###########################
*/

function change_theme() {
    if(day_theme === 'true'){
        fill_svgs("dock-day-night", svgs["night"]);
        day_theme = 'false';
        localStorage.setItem('azusa-os-light-theme', 'false');
        document.documentElement.style.setProperty('--background-color', '#050505');
    }
    else {
        fill_svgs("dock-day-night", svgs["day"]);
        day_theme = 'true';
        localStorage.setItem('azusa-os-light-theme', true);
        document.documentElement.style.setProperty('--background-color', 'white');
    }
}

function update_countdowns(id, ct_date, finish_str) {
    let nowDate = new Date();
    let diffTime = ct_date.getTime() - nowDate.getTime();
    if(diffTime>0){
        let diffDays = diffTime /  (1000 * 3600 * 24);
        let diffHours = (diffDays - Math.trunc(diffDays)) * (24);
        let diffMin = (diffHours - Math.trunc(diffHours)) * 60;
        let diffSec = (diffMin - Math.trunc(diffMin)) * 60;

        let printDiffDays = `${(Math.trunc(diffDays)>0)?(diffDays<10)?'0'+Math.trunc(diffDays):Math.trunc(diffDays):''}`;
        let printDiffHours = `${(Math.trunc(diffHours)>0 || printDiffDays.length > 0)?(diffHours<10)?'0'+Math.trunc(diffHours):Math.trunc(diffHours):''}`;
        let printDiffMin = `${(Math.trunc(diffMin)>0 || printDiffHours.length > 0)?(diffMin<10)?'0'+Math.trunc(diffMin):Math.trunc(diffMin):''}`;
        let printDiffSec = `${(Math.trunc(diffSec)>0 || printDiffMin.length > 0)?(diffSec<10)?'0'+Math.trunc(diffSec):Math.trunc(diffSec):''}`;
        let daysSub = `Day${(Math.trunc(diffDays)>1)?'s':''}`;
        let hoursSub = `Hour${(Math.trunc(diffHours)>1)?'s':''}`;
        let minSub = `Min.`;
        let secSub = `Sec.`;
        if(printDiffDays.length > 0)
            document.getElementById(id + "-days").innerHTML = `<span>${daysSub}</span><span>${printDiffDays}</span>`
        if(printDiffHours.length > 0)
            document.getElementById(id + "-hours").innerHTML = `<span>${hoursSub}</span><span>${printDiffHours}</span>`
        if(printDiffMin.length > 0)
            document.getElementById(id + "-mins").innerHTML = `<span>${minSub}</span><span>${printDiffMin}</span>`
        if(printDiffSec.length > 0)
            document.getElementById(id + "-secs").innerHTML = `<span>${secSub}</span><span>${printDiffSec}</span>`
    }
    else
        document.getElementById(id + "-count").innerHTML = `<div class="countdownPart">${countdownString}</div>`;
}

function activate_countdowns() {
    for(i = 0; i < countdowns.length ; i++) {
        let id = countdowns[i].id;
        let ct_date = countdowns[i].date;
        let finish_str = countdowns[i].finish_str;
        update_countdowns(id, ct_date, finish_str);
        countdowns[i].interval = setInterval(function(){update_countdowns(id, ct_date, finish_str)}, 1000);
    }
}

function desactivate_countdowns(){
    for(i = 0; i < countdowns.length ; i++) {
        clearInterval(countdowns[i].interval);
    }
}

function get_date_particule(nb) {
    let last_number = String(nb).slice(-1);
    switch(last_number) {
        case '1':
            return "st";
            break;
        case '2':
            return "nd";
            break;
        case '3':
            return "rd";
            break;
        default:
            return "th";
    }
}

function get_date_text(date) {
    const days_text = ["sun.", "mon.", "tue.", "wed.", "thu.", "fri.", "sat."];
    const months_text = ["jan.", "feb.", "mar.", "apr.", "may.", "jun.", "jul.", "aug.", "sep.", "oct.", "nov.", "dec."];
    return days_text[date.getDay()] + " " + date.getDate() + get_date_particule(date.getDate()) + " " + months_text[date.getMonth()];
}

function update_hour_date() {
    let now = new Date();
    document.getElementById("dock-hour").innerText = ((now.getHours()>9)?"":"0") + now.getHours() + ":" + ((now.getMinutes()>9)?"":"0") + now.getMinutes();
    document.getElementById("dock-date").innerText = get_date_text(now);
}

function show_window(window_name) {
    if(!active_windows.includes(window_name)){
        let window = document.createElement("div");
        let window_info = windows_html[window_name];
        window.id = window_name + "-window";
        window.classList.add("window");
        window.innerHTML = `
            <div class="window-header" id="${window_name}-window-header">
                <span class="window-title">${window_info["icon"]} ${window_info["title"]}</span>
                <div class="window-header-icons">
                    <a id="${window_name}-close" class="window-header-close clickable">${svgs["close"]}</a>
                </div>
            </div>

            <div class="window-body" id="${window_name}-window-body">
                ${window_info["html"]}
            </div>
        `;
        window.style.top = Math.floor(Math.random() * (60 - 30)) + 30;
        window.style.left = Math.floor(Math.random() * (60 - 30)) + 30;
        document.getElementById("os-container").append(window);
        if(window_name === "countdown")
            activate_countdowns();
        active_windows.push(window_name);
        windows_position.push(window_name);
        document.getElementById(window_name + "-close").addEventListener("click", function(e){
            let window_to_close = e.target.id.replace("-close", "");
            close_window(window_to_close);
        })
        document.getElementById(window_name + "-window-header").addEventListener("mousedown", function(e){
            let window_to_active = e.target.id.replace("-window-header", "");
            handle_active_app(window_to_active);
        })
        document.getElementById(window_name + "-window-body").addEventListener("mousedown", function(e){
            let window_to_active = e.target.id.replace("-window-body", "");
            handle_active_app(window_to_active);
        })
        dragElement(window);
    }
    handle_active_app(window_name);
}

function handle_active_app(new_active_app, no_active_app=false) {
    let active_apps = document.getElementsByClassName("active-app");
    if(active_apps.length > 0)
        active_apps[0].classList.remove("active-app");
    if(!no_active_app){
        document.getElementById("dock-app-" + new_active_app).classList.add("active-app");
        let index = windows_position.indexOf(new_active_app);
        let temp = windows_position[index];
        if (index > -1) {
            windows_position.splice(index, 1);
        }
        windows_position.push(temp);
        for (i = 0; i < windows_position.length ; i++ ) {
            document.getElementById(windows_position[i] + "-window").style.zIndex = i;
        }
    }
}

function close_window(window_to_close) {
    let window = document.getElementById(window_to_close + "-window");
    window.remove();
    if(window_to_close === "countdown")
        desactivate_countdowns();
    let index = active_windows.indexOf(window_to_close);
    if (index > -1) {
        active_windows.splice(index, 1);
    }
    index = windows_position.indexOf(window_to_close);
    if (index > -1) {
        windows_position.splice(index, 1);
    }
    handle_active_app(window_to_close, true);
}


function fill_svgs(class_name, svg) {
    let all_svgs_to_fill = document.getElementsByClassName(class_name);
    for (i = 0; i < all_svgs_to_fill.length ; i++) {
        all_svgs_to_fill[i].innerHTML = svg;
    }
}



function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      if((elmnt.offsetTop - pos2) > 0)
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      else
        elmnt.style.top = "0px";
      if((elmnt.offsetLeft - pos1) > 0)
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      else
        elmnt.style.left = "0px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
