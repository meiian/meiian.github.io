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
        {msg: "Voici la liste des réseaux sur lesquels vous pouvez me trouver :", id:"liens", face: faces.neutral},
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
    console.log(message_object)
    console.log(message)
    message_node.innerHTML = `${message_object.face} <h3 class="message-body">${message_object.msg}</h3>`
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
                question_node.style.color = "gray";
            question_node.innerHTML = `<h3>${FR.questions[i].msg}</h3>`;
            questions_node.append(question_node)
        }
        document.getElementById("messages").appendChild(questions_node);
    }
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

showMessage("start")


