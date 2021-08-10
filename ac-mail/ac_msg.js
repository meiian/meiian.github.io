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
            site_title: "Créateur de Lettres AC",
            frames_title: "Cadres",
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
            site_title: "AC Mail Maker",
            frames_title: "Frames",
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
    #########   FRAMES   ##########
    ##############################  */

let frames = [
    {
        id: "roses",
        url: "./ac-mail/frames/roses.png",
        mainColor: "#633c00",
        secondaryColor: "#087100"
    },
    {
        id: "hello-kitty",
        url: "./ac-mail/frames/hello-kitty.png",
        mainColor: "#212121",
        secondaryColor: "#532542"
    },
    {
        id: "piano",
        url: "./ac-mail/frames/piano.png",
        mainColor: "#3e372b",
        secondaryColor: "#023384"
    },
    {
        id: "butterfly",
        url: "./ac-mail/frames/butterfly.png",
        mainColor: "#655334",
        secondaryColor: "#dc6ff1"
    },
    {
        id: "sea-stars",
        url: "./ac-mail/frames/sea-stars.png",
        mainColor: "#002e7b",
        secondaryColor: "#12aec3"
    },
    {
        id: "sea-mosaic",
        url: "./ac-mail/frames/sea-mosaic.png",
        mainColor: "#8a6230",
        secondaryColor: "#ff97fe"
    },
    {
        id: "mosaic",
        url: "./ac-mail/frames/mosaic.png",
        mainColor: "#002b7a",
        secondaryColor: "#00a6ec"
    },
    {
        id: "luxure",
        url: "./ac-mail/frames/luxure.png",
        mainColor: "#ffd6bd",
        secondaryColor: "#fca84f"
    }
]

/*  ##############################
    #########   MAIN   ###########
    ##############################  */
window.onload = main();

function main() {
    let texts = fetchLanguage();
    fillTexts(texts);
    fillFrames();
    attachEvents(texts);
}


/*  ##############################
    #######   FUNCTIONS   ########
    ##############################  */

function fetchLanguage() {
    let lang = navigator.language || navigator.userLanguage;
    if(lang === "fr-FR")
        return fr;
    else
        return en;
}

function fillTexts(texts) {
    findID("site-title").innerText = texts.menu.site_title;

    findID("framesTitle").innerText = texts.menu.frames_title;

    findID("headerTitle").innerText = texts.menu.header_title;
    findID("headerInput").placeholder = texts.menu.header_input_placeholder_custom;

    findID("bodyTitle").innerText = texts.menu.body_title;
    findID("bodyInput").placeholder = texts.menu.body_input_placeholder;

    findID("footerTitle").innerText = texts.menu.footer_title;
    findID("footerInput").placeholder = texts.menu.footer_input_placeholder;

    findID("savePic").innerText = texts.menu.savePic_button;
}

function fillFrames() {
    findID("framesMenu").style.maxWidth = findID("headerMenu").scrollWidth - 20 + "px";
    frames.forEach(function(frame){
        let frameNode = document.createElement("div");
        frameNode.classList.add("frame-minia-cont");
        frameNode.id = frame.id;
        frameNode.innerHTML = `
            <img id="${frame.id}-img" class="frame-minia" src="${frame.url}" href="${frame.id}"/>
        `;
        frameNode.addEventListener("click", function(){
            findID("mail-frame").style.backgroundImage = "url(" + frame.url + ")";
            console.log(frame.mainColor);
            document.documentElement.style.setProperty('--main-color', frame.mainColor);
            document.documentElement.style.setProperty('--secondary-color', frame.secondaryColor);
        });
        findID("framesGallery").appendChild(frameNode);
    });
    
}

function attachEvents(texts) {
    window.onresize = function(){findID("framesMenu").style.maxWidth = findID("headerMenu").scrollWidth - 20 + "px";};

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
            instruNode.innerText = "Click on picture to save.";
            canvas.addEventListener("click", function(){
                let now = new Date();
                let resizedCanvas = document.createElement("canvas");
                let resizedContext = resizedCanvas.getContext("2d");

                resizedCanvas.height = "345";
                resizedCanvas.width = "506";

                resizedContext.drawImage(canvas, 0, 0, 506, 345);
                let a = document.createElement('a');
                a.href = resizedCanvas.toDataURL();
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
