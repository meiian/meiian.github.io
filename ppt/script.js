const icons =
    {
        warning: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>`
    };

const accepted_file_types = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function remove_upload_zone() {
    document.getElementById("central-bloc").remove();
}

function square_form() {
    let circled_pfps = document.getElementsByClassName("circled-pfp");
    for(i = 0 ; i < circled_pfps.length ; i++) {
        circled_pfps[i].classList.remove("circled-pfp");
        i--;
    }
    if(!document.getElementById("squared-pfp").classList.contains("option-active")){
        document.getElementById("circle-pfp").classList.remove("option-active");
        document.getElementById("squared-pfp").classList.add("option-active");
    }
}

function circle_form(){
    let pfps = document.getElementsByClassName("pfp");
    for(i = 0 ; i < pfps.length ; i++) {
        pfps[i].classList.add("circled-pfp");
    }
    if(!document.getElementById("circle-pfp").classList.contains("option-active")){
        document.getElementById("squared-pfp").classList.remove("option-active");
        document.getElementById("circle-pfp").classList.add("option-active");
    }
}

function preview_profile_picture(pfp) {
    document.getElementById("global-cont").innerHTML =
        `
        <div style='height: max-content;'>
        <h2>Preview of your profile picture</h2>
        <div id="options">
            <div id="squared-pfp" class="option-active">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-app" viewBox="0 0 16 16">
                    <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/>
                </svg>
            </div>
            <div id="circle-pfp">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                </svg>
            </div>
        </div>
    </div>
        <div id="pictures-preview-cont">
            <div id="preview-500">
                <img class="pfp" src="">
                <p>Large (500x500)</p>
            </div>
            <div id="preview-250">
                <img class="pfp" src="">
                <p>Medium (250x250)</p>
            </div>
            <div id="preview-100">
                <img class="pfp" src="">
                <p>Small (100x100)</p>
            </div>
            <div id="preview-64">
                <img class="pfp" src="">
                <p>Very Small (64x64)</p>
            </div>
            <div id="preview-32">
                <img class="pfp" src="">
                <p>Extra Small (32x32)</p>
            </div>
        </div>

    <div id="footer">
        <div id="footer-cont">
            <div class="line"></div>
            <div id="footer-text">
                <h1 class="mobile-hidden">Profil Picture Tester</h1>
                <h1 class="mobile-only">PPT</h1>
            </div>
        </div>
    </div>
        `;
    let pfp_to_replace = document.getElementsByClassName("pfp");
    for(i = 0 ; i < pfp_to_replace.length ; i++) {
        pfp_to_replace[i].src = pfp;
    }

    document.getElementById("squared-pfp").addEventListener("click", square_form);
    document.getElementById("circle-pfp").addEventListener("click", circle_form);
}

function clickHandler() {
    document.getElementById("pfp-upload").click();
}

function uploadHandler() {
    files = document.getElementById("pfp-upload").files;
    if(files && files[0]) {
        if(files.length == 1){
            file = files[0];
            if(accepted_file_types.indexOf(file.type) >= 0){
                let reader = new FileReader();
                
                reader.onload = function(){
                    remove_upload_zone();
                    preview_profile_picture(reader.result);
                };
                reader.readAsDataURL(file);
                document.body.removeEventListener("drop", dropHandler);
                document.body.removeEventListener("dragover", dragOverHandler);
            } else alert_message("warning", "Your file isn't a supported image format. :(")
        }
        else alert_message("warning", "Upload just one (1) profile picture please.")
    } else alert_message("warning", "Something went wrong. :(")
}

function dropHandler(ev) {  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      if(ev.dataTransfer.items.length == 1) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();
          if(accepted_file_types.indexOf(file.type) >= 0){
            let reader = new FileReader();
            
            reader.onload = function(){
                remove_upload_zone();
                preview_profile_picture(reader.result);
            };
            reader.readAsDataURL(file);
            document.body.removeEventListener("drop", dropHandler);
            document.body.removeEventListener("dragover", dragOverHandler);
          }
          else alert_message("warning", "Your file isn't a supported image format. :(")
        }
      }
      else alert_message("warning", "Upload just one (1) profile picture please.")
    } else alert_message("warning", "Something went wrong. :(")
  }

  function dragOverHandler(ev) {
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

function alert_message(icon_name, msg) {
    let alert_node = document.createElement("div");
    alert_node.id = "alert-cont";
    alert_node.innerHTML = `
    <div id="alert-msg" class="m-auto">
        <div class="mx-auto">${icons[icon_name]}</div>
        <p>${msg}</p>
    <div>
    `;
    alert_node.addEventListener("click", function(e){
        if (e.target !== this)
        return;
        document.getElementById("alert-cont").remove();
    })
    document.body.appendChild(alert_node);
}

upload_zone = document.getElementById("upload-bloc");

document.body.addEventListener("drop", dropHandler);

document.body.addEventListener("dragover", dragOverHandler);

upload_zone.addEventListener("click", clickHandler);

document.getElementById("pfp-upload").addEventListener("change", uploadHandler);