let animes = [
    {
        name:"Kiznaiver",
        folder:"kiznaiver",
        note:5
    },
    {
        name:"Yuru Yuri",
        folder:"yuruyuri",
        note:4
    },
    {
        name:"Gochuumon wa Usagi desu ka? BLOOM",
        folder:"gochiusa-s3",
        note:5
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
            animes.forEach(element => {
                printAnime(element);
            });
            console.log("Tri par date : ");
            console.log(animes);
            break;
        case "2":
            init();
            let animsname = filtered.sort(function(a, b){var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;});
            console.log("Tri par nom : ");
            console.log(animsname);
            animsname.forEach(element => {
                printAnime(element);
            });
            break;
        case "3":
            init();
            let animsnote = filtered.sort(function(a, b){
                return b.note - a.note;
            });
            console.log("Tri par note : ");
            console.log(animsnote);
            animsnote.forEach(element => {
                printAnime(element);
            });
            break;
    }
}

function printAnime(anim) {
    let color = "black";
    console.log(anim.note);
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
    console.log(color);
    document.getElementById("animlist").innerHTML += `
    <div class="col mb-4">
                <div class="card bg-transparent text-right text-bottom mx-auto" style="width: max-content; word-wrap:normal;">
                    <a href="./${anim.folder}/critique.html">
                        <img src="./${anim.folder}/affiche.jpg" class="card-img" alt="...">
                        <div id="perso" class="card-img-overlay ${color}">
                        <h4 class="mb-0 text-white">${anim.name}</h4>
                        </div>
                    </a>
                </div>
    </div>
    `;
}



function checkName(anim) {

    return anim.name.toUpperCase().includes(document.getElementById("searchinput").value.toUpperCase());
}

document.getElementById("searchinput").addEventListener('input', function() {
    filtered = animes.filter(checkName);
    sortAnime();
});