let grille = 
[ 
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0], 
]

let grille_img =
[ 
    ["rhythm", "foote", "kidicarus", "online", "mp4"],
    ["", "mhrise", "splatoon", "themes", "swsports"],
    ["bayonetta", "pkmn", "", "mario3d", "omt"],
    ["", "mother", "pikmin", "fireemblem", "wwhd"],
    ["dk", "zelda", "", "", "rabbids"], 
]

let grille_text =
[ 
    ["", "MAJ Gratuite", "", "GB / GBA", ""],
    ["Plein de trailers à la suite dont tout le monde osef", "", "<br><br><br>Splatfest", "Les<br>thèmes<br>???", "<br><br>Golf"],
    ["", "", "Libre", "Nouveau Mario 3D", "One more thing"],
    ["Nouveau BR 99", "", "", "<br><br><br>Nouveau<br>jeu", ""],
    ["", "Des news sur BOTW2", "Nouvelle franchise", "Un port<br>Wii U", ""], 
]

const current_direct = "Sept_2022";

// Mobile CSS adjustment

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });


const sum = (a, b) => a + b;

function check_if_bingo_stayed(grille, is_bingo) {
    for(i = 0 ; i < grille.length ; i++) {
        for(j = 0 ; j < grille.length ; j++) {
            if(is_bingo.filter(e => ((e.index == i && e.type == "line") || (e.index == j && e.type == "column") || (e.type == "diag" && e.index == 0 && (i == j)) || ( e.type == "diag" && e.index == 1 && (i == (grille.length - j - 1)))) ).length == 0){
                let actual_square = document.querySelector("#square-" + i + j + " .overlay");
                if(actual_square != null){
                    actual_square.classList.remove("bingo");
                    actual_square.classList.add("completed");
                }
            }
        }
    }
}

function change_grille_value(grille, position_x, position_y) {
    grille[position_x][position_y] = (grille[position_x][position_y]+1) %2;
    if(grille[position_x][position_y] == 1) {
        let actual_square = document.getElementById("square-" + position_x + position_y)
        let completed_overlay = document.createElement("div");
        completed_overlay.classList.add('completed');
        completed_overlay.classList.add('overlay');
        actual_square.append(completed_overlay);
    }
    else {
        document.querySelector("#square-" + position_x + position_y + " .overlay").remove();
    }
    let is_bingo = check_bingo(grille);
    for(i = 0 ; i < is_bingo.length ; i++) {
        switch (is_bingo[i].type) {
            case 'line':
                for(j = 0 ; j < grille.length ; j++) {
                    let overlay = document.querySelector("#square-" + is_bingo[i].index + j + " .overlay");
                    if(overlay.classList.contains("completed")){
                        overlay.classList.remove("completed");
                        overlay.classList.add("bingo");
                    }
                }
                break;
            case 'column':
                for(j = 0 ; j < grille.length ; j++) {
                    let overlay = document.querySelector("#square-" + j + is_bingo[i].index + " .overlay");
                    if(overlay.classList.contains("completed")){
                        overlay.classList.remove("completed");
                        overlay.classList.add("bingo");
                    }
                }
                break;
            case 'diag':
                for(j = 0 ; j < grille.length ; j++) {
                    if(is_bingo[i].index == 0){
                        let overlay = document.querySelector("#square-" + j + j + " .overlay");
                        if(overlay.classList.contains("completed")){
                            overlay.classList.remove("completed");
                            overlay.classList.add("bingo");
                        }
                    }
                    if(is_bingo[i].index == 1){
                        let overlay = document.querySelector("#square-" + (grille.length-j-1) + j + " .overlay");
                        if(overlay.classList.contains("completed")){
                            overlay.classList.remove("completed");
                            overlay.classList.add("bingo");
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
    check_if_bingo_stayed(grille, is_bingo);
}

function feed_grille(grille, grille_img, grille_text, current_direct) {
    let cont = document.getElementById("grille-cont");

    // Checking grid size
    if(grille_img.length != grille_text.length)
        return -1;
    
    for(i = 0 ; i < grille_img.length ; i++) {
        for(j = 0 ; j < grille_img.length ; j++) {
            let actual_square = document.createElement("div");
            actual_square.id = "square-" + i + j;
            actual_square.classList.add("square-cont");
            if(grille_img[i][j].length > 0)
                actual_square.style.backgroundImage = "url('./ninten-bingo/images/" + current_direct + "/" + grille_img[i][j] + ".webp')";
            actual_square.innerHTML =
            `
                <p class="square-label">${grille_text[i][j]}</p>
            `;
            if(grille_text[i][j].length > 0)
                actual_square.style.fontSize = 32 - grille_text[i][j].length / 8 + "px";
            actual_square.addEventListener("click", function(){
                positions = this.id.slice(-2).split('');
                change_grille_value(grille, positions[0], positions[1]);
            })
            cont.append(actual_square);
        }
    }

}

function check_bingo(grille) {
    /*
        Checks if there is a bingo.
    */

    let bingo_lines = [];
    let actual_sum = 0;
    let actuel_sum_2 = 0;

    // Checking lines
    for(i = 0; i < grille.length ; i++) {
        actual_sum = grille[i].reduce(sum);
        if(actual_sum == grille.length)
            bingo_lines.push({"type":"line", "index":i})
    }

    // Checking columns
    for(i = 0; i < grille.length ; i++) {
        actual_sum = 0;
        for(j = 0; j < grille.length ; j++) {
            actual_sum += grille[j][i]
        }
        if(actual_sum == grille.length)
            bingo_lines.push({"type":"column", "index":i})
    }

    // Checking diagonals
    actual_sum = 0;
    actual_sum_2 = 0;
    for(i = 0 ; i < grille.length ; i++) {
        actual_sum += grille[i][i]
        actual_sum_2 += grille[grille.length-i-1][i]
    }
    if(actual_sum == grille.length)
        bingo_lines.push({"type":"diag", "index":0})
    if(actual_sum_2 == grille.length)
        bingo_lines.push({"type":"diag", "index":1})

    if(bingo_lines.length <= 0)
        return([{"type":"no", "index":-1}])
    else
        return bingo_lines
}

function show_alert(text) {
    let alert_node = document.createElement("div");
    alert_node.id = "alert-msg";
    alert_node.innerHTML = text;
    document.getElementById("alert-cont").append(alert_node);
    document.getElementById("alert-cont").addEventListener("click", function(e){
        if(e.target != this)
            return 0;
        document.getElementById("alert-msg").remove()
    })
}

check_bingo(grille);
feed_grille(grille, grille_img, grille_text, current_direct);
document.getElementById("known-issues").addEventListener("click", function(){
    let text = 
    `Liste des bugs connus :
    <ul>
        <li>Aucun pour l'instant, mais si vous trouvez : mentionnez moi sur Twitter ! @azusa_chi</li>
    </ul>`;
    show_alert(text);
});