function show_alert(alert_text) {
    clear_alert();
    const alert_cont = document.getElementById("alert-cont");
    let alert_node = document.createElement("div");
    alert_node.classList.add("alert-body");
    alert_node.innerHTML = alert_text;
    alert_cont.append(alert_node);
}

function clear_alert() {
    document.getElementById("alert-cont").replaceChildren();
}

function clear_app() {
    document.getElementById("app-cont").replaceChildren();
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

function dropHandler(ev) {  
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {

        if(ev.dataTransfer.items.length > 1) {
            show_alert("You should drop only one file.");
            return 1;
        }

        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();

          if(file.type !== 'application/json') {
            show_alert("File dropped isn't a correct statuses file.");
            return 1;
          }

          document.getElementById("drag-drop-statuses").innerHTML = `
                <div class="flex-center flex-column">
                    <span class="loader-drop"></span>
                </div>
          `;

          let reader = new FileReader();
          
          reader.onload = function(e){
            const buf = JSON.parse(e.target.result);
            if(buf.acc_id === undefined || buf.account_json === undefined || buf.created === undefined || buf.instance_name === undefined || buf.statuses === undefined) {
                show_alert("File dropped isn't a correct statuses file.");
                return 1;
            }
            loaded_save = buf;
          };
          reader.readAsText(file);
        }
    } else {
        if(ev.dataTransfer.files.length > 1) {
            show_alert("You should drop only one file.");
            return 1;
        }
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
    document.getElementById("drag-drop-statuses").removeEventListener("drop", dropHandler);
    document.getElementById("drag-drop-statuses").removeEventListener("dragover", dragOverHandler);
    return 0;
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function get_newest_status_id(l) {
    const status = l.reduce(function(prev, current) {
        return (prev && new Date(prev.created_at) > new Date(current.created_at)) ? prev: current
      });
    return status.id;
}