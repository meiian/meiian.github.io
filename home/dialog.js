svgs = {
    chevron_left : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>`
}


flags = []

faces = {
    happy : "<img class='face' src='./home/faces/happy.png'/>",
    neutral : "<img class='face' src='./home/faces/neutral.png'/>"
}

FR = {
    questions : [
        {msg: "Qui es-tu ?", go_to: "présentation"},
        {msg: "Que fais-tu ?", go_to: "occupations"},
        {msg: "Tu es sur quel réseau ?", go_to: "liens"},
        {msg: "Es-tu vraiment détentrice du World Record sur Adibou et l'Ombre Verte en émulation de PSX ?", go_to: "adibou"},
        {msg: "Rien du tout, merci.", go_to:"fin"}
    ],
    messages : [
        {msg: "Hello !", id:"start", face: faces.happy},
        {msg: "Je suis connue sous le pseudonyme d'Azusa, cependant on m'appelle généralement Alice.<br>Mes pronoms sont 'elle/she/her'.", id:"présentation", face: faces.neutral},
        {msg: "Je profite de la vie en regardant des streams sur Twitch, en jouant à des jeux (les principaux étant Pokémon, FFXIV et diverses licences Nintendo) ainsi qu'en regardant des animes qui détendent.", id:"occupations", face: faces.neutral},
        {msg: "Voici la liste des réseaux sur lesquels vous pouvez me trouver :<ul><li>Twitter : <a href='https://twitter.com/azusa_chi'>@azusa_chi</a></li><li>Twitch : <a href='https://twitch.tv/aliss_n'>aliss_n</a></li></ul>", id:"liens", face: faces.neutral},
        {msg: "Tout à fait ! En tout cas pour l'instant.<br>J'ai déjà été battue 1 fois, et peut-être que ça arrivera à nouveau !<br><i>Source : <a href='https://www.speedrun.com/adiboo_and_the_green_shadow'>speedrun.com</a></i>", id:"adibou", face: faces.happy},
        {msg: "D'acc ! Merci d'être passé‧e !", id:"fin", face: faces.happy}
    ]
}

function showMessage(message) {
    let global = document.getElementById("messages");
    let globalClone = global.cloneNode(true);
    global.parentNode.replaceChild(globalClone, global);
    
    let message_node = document.createElement("div");
    message_node.classList.add("message");
    message_object = FR.messages.find(element => element.id == message);
    message_node.innerHTML = `${faces.neutral} <h3 class="message-body">...</h3>`
    flags.push(message)
    document.getElementById("messages").appendChild(message_node);
    let questions_node = document.createElement("div");
        questions_node.classList.add("questions-list")
        questions_node.id = "actual-question-list"
        if(message !== "fin"){
            for(i=0; i<FR.questions.length; i++) {
                let question_node = document.createElement("a");
                let question_to_go = FR.questions[i].go_to;
                let question_msg = FR.questions[i].msg;
                if(!flags.includes(question_to_go))
                    question_node.addEventListener("click", function(){
                        showMessage(question_to_go);
                        document.getElementById("actual-question-list").innerHTML = '<h3 class="message-body">' + question_msg + "</h3>";
                        document.getElementById("actual-question-list").classList.remove("questions-list");
                        document.getElementById("actual-question-list").classList.add("message");
                        document.getElementById("actual-question-list").classList.add("reply");
                        document.getElementById("actual-question-list").id = null;
                    });
                else
                    question_node.classList.add("already")
                question_node.innerHTML = `<h3>${FR.questions[i].msg}</h3>`;
                questions_node.append(question_node)
            }
            document.getElementById("messages").appendChild(questions_node);
        }
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    message_timeout = setTimeout(function(){
        message_node.innerHTML = `${message_object.face} <h3 class="message-body">${message_object.msg}</h3>`;
        questions_node.style.opacity = 1;
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    },500);
    
}

for (const [key, value] of Object.entries(svgs)) {
    let svgs_to_replace = document.getElementsByClassName(key);
    for (i=0; i<svgs_to_replace.length; i++) {
        svgs_to_replace[i].innerHTML = value;
    }
}

showMessage("start")


