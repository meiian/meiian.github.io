let animes = [
    {
        name:"Kiznaiver",
        folder:"kiznaiver",
        note:5,
        tags:["Drama","Romance","Sci-Fi"]
    },
    {
        name:"Yuru Yuri",
        folder:"yuruyuri",
        note:4,
        tags:["Slice of Life","Comedy"]
    },
    {
        name:"Gochuumon wa Usagi desu ka? BLOOM",
        folder:"gochiusa-s3",
        note:5,
        tags:["Slice of Life","Comedy"]
    },
    {
        name:"Ochikobore Fruit Tart",
        folder:"ochikobore",
        note:3,
        tags:["Slice of Life","Comedy","Music","Ecchi"]
    },
    {
        name:"Hitoribocchi no ○○ Seikatsu",
        folder:"hitoribocchi",
        note:5,
        tags:["Slice of Life","Comedy"]
    },
    {
        name:"Comic Girls",
        folder:"comicgirls",
        note:5,
        tags:["Slice of Life","Comedy"]
    },
    {
        name:"Watashi ni Tenshi ga Maiorita!",
        folder:"wataten",
        note:1,
        tags:["Slice of Life","Comedy"]
    },
    {
        name:"Princess Connect! Re:Dive",
        folder:"priconne",
        note:4,
        tags:["Fantasy","Comedy","Adventure"]
    },
    {
        name:"Kono Subarashii Sekai ni Shukufuku wo!",
        folder:"konosuba",
        note:5,
        tags:["Fantasy","Comedy","Adventure"]
    },
    {
        name:"Majo no Tabitabi",
        folder:"majonotabitabi",
        note:4,
        tags:["Fantasy","Adventure","Slice of Life"]
    }
];

let notes = ["Pas bon", "Moyen", "Bon", "Très bon", "Excellent"];

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

console.log(animes);
console.log(getCookie("video"));

let filtered = animes;

sortAnime();

document.getElementById("triSelect").addEventListener('change', sortAnime);

document.getElementById("videocheck").addEventListener('change', function() {
    document.cookie = "video=" + document.getElementById("videocheck").checked;
    console.log(getCookie("video"));
    sortAnime()});

function init() {
    document.getElementById("animlist").innerHTML = "";
    document.getElementById("videocheck").checked = getCookie("video");
    console.log(document.getElementById("videocheck").checked);
}

function sortAnime() {
    let trivalue = document.getElementById("triSelect").value;
    switch(trivalue) {
        case "1":
            init();
            let animstag = filtered.sort(function(a, b){var x = a.tags[0].toLowerCase();
                var y = b.tags[0].toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;});
            animstag.forEach(element => {
                printAnime(element);
            });
            break;
        case "2":
            init();
            let animsname = filtered.sort(function(a, b){var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;});
            animsname.forEach(element => {
                printAnime(element);
            });
            break;
        case "3":
            init();
            let animsnote = filtered.sort(function(a, b){
                return b.note - a.note;
            });
            animsnote.forEach(element => {
                printAnime(element);
            });
            break;
    };
}

function printAnime(anim) {
    let color = "black";
    switch(anim.note) {
        case 1:
            color = "red";
            break;
        case 2:
            color = "orange";
            break;
        case 3:
            color = "yellow";
            break;
        case 4:
            color = "green";
            break;
        case 5:
            color = "blue";
            break;
    }
    let badgecolor = "badge-primary";
    switch(anim.tags) {
        case "Slice of Life":
            badgecolor="badge-success";
            break;
        case "Drama":
            badgecolor="badge-danger";
            break;
    }
    let critiqueurl = `./${anim.folder}/critique.html`;
    if(document.getElementById("videocheck").checked)
        critiqueurl += '?video';
    document.getElementById("animlist").innerHTML += `
    <div class="col mb-4">
                <div onmouseout="resetFooter()" onmouseover="fillFooter('${anim.folder}','${anim.name}','${anim.tags}','${color}','${anim.note}')" class="card bg-transparent text-right text-bottom mx-auto animvign" style="width: max-content; word-wrap:normal;">
                    <a href="${critiqueurl}">
                        <img src="./${anim.folder}/affiche.jpg" class="card-img" alt="...">
                        <div id="perso" class="card-img-overlay ${color} desc">
                        <h4 class="mb-0 text-white">${anim.name}<br/> <span style="text-shadow: 0 0 0 black" class="mt-1 badge ${badgecolor}">${anim.tags[0]}</span></h4>
                        
                        </div>
                    </a>
                </div>
    </div>
    `;
}

function fillFooter(folder, name, tags, color, note) {
    let fulltags = "";
    let tagsarray = tags.split(',');
    tagsarray.forEach((element,index) => {
        fulltags += element;
        if(index+1 < tagsarray.length)
            fulltags += ", "; 
    });
    document.getElementById("animefooter").innerHTML = `
        <img style="height:20vh; width: auto;" id="animefooterimg" src="./${folder}/affiche.jpg" class="card-img" alt="Affiche de ${name}">
        <h4 id="animefootertitle" class="text-white">${name}<br/> <span style="text-shadow: 0 0 0 black; font-size: 12px;" class="mt-1">${fulltags} • ${notes[note-1]}</span></h4>
    `;
    document.getElementById("animefootertitle").style.marginLeft = document.getElementById("animefooterimg").scrollWidth + 15 + window.innerWidth*0.15;
    document.getElementById("searchbar").className= `${color}`;
}

function resetFooter() {
    document.getElementById("animefooter").innerHTML = '';
    document.getElementById("searchbar").className = '';
}




function checkName(anim) {
    let tagfound = anim.tags.find(element => element.toUpperCase().includes(document.getElementById("searchinput").value.toUpperCase()));
    return (anim.name.toUpperCase().includes(document.getElementById("searchinput").value.toUpperCase()) || tagfound);
}

document.getElementById("searchinput").addEventListener('input', function() {
    filtered = animes.filter(checkName);
    sortAnime();
});

