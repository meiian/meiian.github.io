let animes = [
    {
        name:"Kiznaiver",
        folder:"kiznaiver",
        note:5,
        tags:"Drama"
    },
    {
        name:"Yuru Yuri",
        folder:"yuruyuri",
        note:4,
        tags:"Slice of Life"
    },
    {
        name:"Gochuumon wa Usagi desu ka? BLOOM",
        folder:"gochiusa-s3",
        note:5,
        tags:"Slice of Life"
    },
    {
        name:"Ochikobore Fruit Tart",
        folder:"ochikobore",
        note:3,
        tags:"Slice of Life"
    },
    {
        name:"Hitoribocchi no ○○ Seikatsu",
        folder:"hitoribocchi",
        note:5,
        tags:"Slice of Life"
    },
];

console.log(animes);


let filtered = animes;

sortAnime();

document.getElementById("triSelect").addEventListener('change', sortAnime);


function init() {
    document.getElementById("animlist").innerHTML = "";
}

function sortAnime() {
    let trivalue = document.getElementById("triSelect").value;
    switch(trivalue) {
        case "1":
            init();
            let animstag = filtered.sort(function(a, b){var x = a.tags.toLowerCase();
                var y = b.tags.toLowerCase();
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
    if(screen.width >= 600) {
        document.querySelectorAll('.animvign').forEach(item => {
            item.addEventListener('mouseenter', event => {
              event.target.getElementsByClassName("desc")["perso"].style.height = event.target.scrollHeight;
            });
            item.addEventListener('mouseleave', event => {
                event.target.getElementsByClassName("desc")["perso"].style.height = "0";
              });
        });
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
    document.getElementById("animlist").innerHTML += `
    <div class="col mb-4">
                <div class="card bg-transparent text-right text-bottom mx-auto animvign" style="width: max-content; word-wrap:normal;">
                    <a href="./${anim.folder}/critique">
                        <img src="./${anim.folder}/affiche.jpg" class="card-img" alt="...">
                        <div id="perso" class="card-img-overlay ${color} desc">
                        <h4 class="mb-0 text-white">${anim.name}<br/> <span style="text-shadow: 0 0 0 black" class="mt-1 badge ${badgecolor}">${anim.tags}</span></h4>
                        
                        </div>
                    </a>
                </div>
    </div>
    `;
}




function checkName(anim) {

    return (anim.name.toUpperCase().includes(document.getElementById("searchinput").value.toUpperCase()) || anim.tags.toUpperCase().includes(document.getElementById("searchinput").value.toUpperCase()));
}

document.getElementById("searchinput").addEventListener('input', function() {
    filtered = animes.filter(checkName);
    sortAnime();
});

