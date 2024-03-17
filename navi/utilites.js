function show_alert(alert_text, timeout=0) {
    clear_alert();
    const alert_cont = document.getElementById("alert-cont");
    let alert_node = document.createElement("div");
    alert_node.classList.add("alert-body");
    alert_node.innerHTML = alert_text;
    alert_cont.append(alert_node);
    if(timeout > 0) {
        setTimeout(function() {
            clear_alert();
        }, timeout);
    }
}

function clear_alert() {
    document.getElementById("alert-cont").replaceChildren();
}

function clear_app() {
    document.getElementById("app-cont").replaceChildren();
}

function clear_toots() {
    document.getElementById("toots-cont").replaceChildren();
}

function append_toot(node) {
    document.getElementById("toots-cont").appendChild(node);
}

function create_loader() {
    let loader_node = document.createElement("span");
    loader_node.classList.add("loader");
    return loader_node;
}

function append_to_app(node) {
    document.getElementById("app-cont").append(node);
}

function date_to_string(date) {
    return `${(date.getDate()+1 < 10)?'0':''}${date.getDate()}/${(date.getMonth()+1 < 10)?'0':''}${date.getMonth()+1}/${date.getFullYear()}`;
}

function date_to_locale_string(date) {
    return date.toLocaleString(navigator.language, {month: 'short', day: 'numeric', year: '2-digit'});
}

function uint8array_to_url(a, dataType) {
    let blob_image = new Blob([a], {type: dataType});
    return URL.createObjectURL(blob_image);
}

function dropHandler(ev) {  
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {

        if(ev.dataTransfer.items.length > 1) {
            show_alert("You should drop only one file.", 3000);
            return 1;
        }

        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();
          if (!/application\/.*zip.*/.test(file.type)) {
            show_alert("Your file isn't a compressed zip file.", 3000);
            return 1;
          }

          document.getElementById("drag-drop-statuses").innerHTML = `
                <div class="flex-center flex-column">
                    <span class="loader-drop"></span>
                </div>
          `;

          let zip = new JSZip();
          zip.loadAsync(file).then(function(z) {
            if(z.files["actor.json"] && z.files["outbox.json"] && z.files["avatar.png"]) {
                z.files["actor.json"].async("string").then(x => archive["actor"] = JSON.parse(x));
                z.files["outbox.json"].async("string").then(x => archive["outbox"] = JSON.parse(x));
                z.files["avatar.png"].async("uint8array").then(x => archive["avatar"] = uint8array_to_url(x, "image/png"));
                compressed_file = z.files;
            }
            else {
                show_alert("Your file seems to be corrupted. Reloading the page...", 2000);
                setTimeout(function() {
                    location.reload();
                }, 2000)
                return 1;
            }
          });
        }
    }
    document.getElementById("drag-drop-statuses").removeEventListener("drop", dropHandler);
    document.getElementById("drag-drop-statuses").removeEventListener("dragover", dragOverHandler);
    return 0;
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function onClickFileHanlder(ev) {
    let file_input = window._protected_reference = document.createElement("input");
    file_input.type = "file";
    file_input.accept = "application/zip";

    file_input.addEventListener('change', function(e) {
        if(file_input.files.length > 1) {
            show_alert("You should drop only one file.", 3000);
            return 1;
        }

        if (file_input.files[0]) {
            const file = file_input.files[0];
            if (!/application\/.*zip.*/.test(file.type)) {
                show_alert("Your file isn't a compressed zip file.", 3000);
                return 1;
              }
  
            document.getElementById("drag-drop-statuses").innerHTML = `
                  <div class="flex-center flex-column">
                      <span class="loader-drop"></span>
                  </div>
            `;
  
            let zip = new JSZip();
            zip.loadAsync(file).then(function(z) {
              z.files["actor.json"].async("string").then(x => archive["actor"] = JSON.parse(x));
              z.files["outbox.json"].async("string").then(x => archive["outbox"] = JSON.parse(x));
              z.files["avatar.png"].async("uint8array").then(x => archive["avatar"] = uint8array_to_url(x, "image/png"));
              compressed_file = z.files;
              file_input = window._protected_reference = undefined;
            });
          }

    });

    file_input.click();
}

function get_newest_status_id(l) {
    const status = l.reduce(function(prev, current) {
        return (prev && new Date(prev.created_at) > new Date(current.created_at)) ? prev: current
      });
    return status.id;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }