const FOOTERMAX = 22;
const HEADERMAXCUSTOM = 26;
const HEADERMAX = 13;
const LINEMAX = 26;



/*  ##############################
    #########   TEXTS   ##########
    ##############################  */

const fr =
    {
        mail: {
            header_msg: "Message pour ",
            footer_msg: "--"
        },

        menu: {
            header_title: "En-tête",
            header_input_placeholder: "Message pour [...] !",
            header_input_placeholder_custom: "Entrez votre en-tête personnalisé.",
            body_title: "Corps",
            body_input_placeholder: "Entrez le corps de votre lettre.",
            footer_title: "Signature",
            footer_input_placeholder: "Entrez la signature de votre lettre",
            savePic_button: "Exporter en PNG"
        }
        
    };

const en =
    {
        mail: {
            header_msg: "Mail for ",
            footer_msg: "--"
        },

        menu: {
            header_title: "Header",
            header_input_placeholder: "Mail for [...] !",
            header_input_placeholder_custom: "Write your custom header.",
            body_title: "Body",
            body_input_placeholder: "Write your mail's body.",
            footer_title: "Footer",
            footer_input_placeholder: "Write your mail's footer.",
            savePic_button: "Save as PNG"
        }
        
    };


/*  ##############################
    #########   MAIN   ###########
    ##############################  */
window.onload = main();

function main() {
    let texts = fetchLanguage();
    fillTexts(texts);
    attachEvents(texts);
}


/*  ##############################
    #######   FUNCTIONS   ########
    ##############################  */

function fetchLanguage() {
    let lang = navigator.language || navigator.userLanguage;
    if(lang === "fr-FR")
        return fr;
    if(lang === "en-EN")
        return en;
}

function fillTexts(texts) {
    findID("headerTitle").innerText = texts.menu.header_title;
    findID("headerInput").placeholder = texts.menu.header_input_placeholder_custom;

    findID("bodyTitle").innerText = texts.menu.body_title;
    findID("bodyInput").placeholder = texts.menu.body_input_placeholder;

    findID("footerTitle").innerText = texts.menu.footer_title;
    findID("footerInput").placeholder = texts.menu.footer_input_placeholder;

    findID("savePic").innerText = texts.menu.savePic_button;
}

function attachEvents(texts) {
    findID("headerInput").addEventListener("input", function(){
        findID("mail-header").innerText = findID("headerInput").value;
    })

    findID("bodyInput").addEventListener("input", function(){
        emptyBody();
        fillBody();
    })

    findID("footerInput").addEventListener("input", function(){
        findID("mail-footer").innerText = findID("footerInput").value;
    })

    findID("savePic").addEventListener("click", function(){
        html2canvas(document.querySelector("#global-frame"), {
            width: 506,
            height: 345
          }).then(canvas => {
            let divNode = document.createElement("div");
            divNode.id = "saveNode";
            let instruNode = document.createElement("h5");
            instruNode.id = "instru-save";
            instruNode.innerText = "Clic pour enregistrer.";
            canvas.addEventListener("click", function(){
                let now = new Date();
                let a = document.createElement('a');
                a.href = canvas.toDataURL("image/png");
                a.download = 'AC_Mail_' + now.getFullYear() + "_" + (now.getMonth()+1) + "_" + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            divNode.style.margin = "auto";
            divNode.appendChild(canvas);
            divNode.appendChild(instruNode);
            
            findID("pic-fullCont").appendChild(divNode);
        });
    })

    findID("pic-fullCont").addEventListener("click", function(e){
        if (e.target !== this)
            return 0;
        findID("pic-fullCont").innerHTML = "";
    })
}

function emptyBody(){
    for(let i = 1; i<7 ; i++){
        findID("mail-l" + (i)).innerText = "";
    }
}

function fillBody() {
    let bodyStr = findID("bodyInput").value;
    let lines = bodyStr.split('\n');
    let linesToPrint = [];
    lines.forEach(function(e){
        for (var i = 0, charsLength = e.length; i < charsLength; i += LINEMAX) {
            linesToPrint.push(e.substring(i, i + LINEMAX));
        }
    });
    for(var i = 0;i < linesToPrint.length;i++){
        if(i<6)
            findID("mail-l" + (i+1)).innerText = linesToPrint[i];
        else{
            findID("bodyInput").value = findID("bodyInput").value.slice(0, -1);
        }
    }
}

function findID(id) {
    return document.getElementById(id);
}
