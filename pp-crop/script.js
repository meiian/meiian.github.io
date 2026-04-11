let timeout_render_preview_1 = null;
let timeout_render_preview_2 = null;

function dropHandler(ev) {
    console.log('File(s) dropped');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log(file);
          let reader = new FileReader();
          
          reader.onload = function(){
              document.getElementById("preview").src = reader.result;
              document.getElementById("preview2").src = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
    document.body.removeEventListener("drop", dropHandler);
    document.body.removeEventListener("dragover", dragOverHandler);
    document.getElementById("drop-disclaimer").remove();
    if(timeout_render_preview_1 === null) {
      timeout_render_preview_1 = setTimeout(function() {
        add_preview_icon_1();
        timeout_render_preview_1 = null;
      }, 500);
    }
    if(timeout_render_preview_2 === null) {
      timeout_render_preview_2 = setTimeout(function() {
        add_preview_icon_2();
        timeout_render_preview_2 = null;
      }, 500);
    }
  }

  function dragOverHandler(ev) {
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

function savePic() {
    let circle = document.getElementById("circle").cloneNode(true);
    let circle2 = document.getElementById("circle2").cloneNode(true);
    document.getElementById("circle").remove()
    document.getElementById("circle2").remove()
    html2canvas(document.querySelector("#pfp-zone")).then(canvas => {
      let now = new Date();
      let resizedCanvas = document.createElement("canvas");
      let resizedContext = resizedCanvas.getContext("2d");
      resizedCanvas.height = "500";
      resizedCanvas.width = "500";
      resizedContext.drawImage(canvas, 0, 0, 500, 500);
      let a = document.createElement('a');
      a.href = resizedCanvas.toDataURL();
      a.download = 'LinkedPP_' + now.getFullYear() + "_" + (now.getMonth()+1) + "_" + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + "_1";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    html2canvas(document.querySelector("#pfp-zone2")).then(canvas => {
      let now = new Date();
      let resizedCanvas = document.createElement("canvas");
      let resizedContext = resizedCanvas.getContext("2d");
      resizedCanvas.height = "500";
      resizedCanvas.width = "500";
      resizedContext.drawImage(canvas, 0, 0, 500, 500);
      let a = document.createElement('a');
      a.href = resizedCanvas.toDataURL();
      a.download = 'LinkedPP_' + now.getFullYear() + "_" + (now.getMonth()+1) + "_" + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + "_2";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    document.getElementById("pfp-zone").appendChild(circle);
    document.getElementById("pfp-zone2").appendChild(circle2);
}

function scroll_pfp1() {
  hscroll_value = (parseInt(document.getElementById("scroll-h1").value) / 100) * document.getElementById("pfp-zone").scrollLeftMax;
  vscroll_value = (parseInt(document.getElementById("scroll-v1").value) / 100) * document.getElementById("pfp-zone").scrollTopMax;
  document.getElementById("pfp-zone").scrollTo(hscroll_value, vscroll_value);
  if(timeout_render_preview_1 === null) {
    timeout_render_preview_1 = setTimeout(function() {
      add_preview_icon_1();
      timeout_render_preview_1 = null;
    }, 500);
  }
}

function scroll_pfp2() {
  hscroll_value = (parseInt(document.getElementById("scroll-h2").value) / 100) * document.getElementById("pfp-zone2").scrollLeftMax;
  vscroll_value = (parseInt(document.getElementById("scroll-v2").value) / 100) * document.getElementById("pfp-zone2").scrollTopMax;
  document.getElementById("pfp-zone2").scrollTo(hscroll_value, vscroll_value);
  if(timeout_render_preview_2 === null) {
    timeout_render_preview_2 = setTimeout(function() {
      add_preview_icon_2();
      timeout_render_preview_2 = null;
    }, 500);
  }
}

function add_preview_icon_1() {
    let circle = document.getElementById("circle").cloneNode(true);
    document.getElementById("circle").remove()
    html2canvas(document.querySelector("#pfp-zone")).then(canvas => {
      let resizedCanvas = document.createElement("canvas");
      let resizedContext = resizedCanvas.getContext("2d");
      resizedCanvas.height = "64";
      resizedCanvas.width = "64";
      resizedContext.drawImage(canvas, 0, 0, 64, 64);
      document.getElementById("preview-1").innerHTML = '';
      document.getElementById("preview-1").appendChild(resizedCanvas);
    });
    document.getElementById("pfp-zone").appendChild(circle);
}

function add_preview_icon_2() {
    let circle = document.getElementById("circle2").cloneNode(true);
    document.getElementById("circle2").remove()
    html2canvas(document.querySelector("#pfp-zone2")).then(canvas => {
      let resizedCanvas = document.createElement("canvas");
      let resizedContext = resizedCanvas.getContext("2d");
      resizedCanvas.height = "64";
      resizedCanvas.width = "64";
      resizedContext.drawImage(canvas, 0, 0, 64, 64);
      document.getElementById("preview-2").innerHTML = '';
      document.getElementById("preview-2").appendChild(resizedCanvas);
    });
    document.getElementById("pfp-zone2").appendChild(circle);
}

document.body.addEventListener("drop", dropHandler);

document.body.addEventListener("dragover", dragOverHandler);

var slider = document.getElementById("zoom");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  new_zoom = 100 + parseInt(this.value)
  document.getElementById("preview").style.height = new_zoom + '%';
  document.getElementById("preview2").style.height = new_zoom + '%';
  scroll_pfp1();
  scroll_pfp2();
}

document.getElementById("save-button").addEventListener("click", savePic);
document.getElementById("scroll-h1").oninput = scroll_pfp1;
document.getElementById("scroll-v1").oninput = scroll_pfp1;
document.getElementById("scroll-h2").oninput = scroll_pfp2;
document.getElementById("scroll-v2").oninput = scroll_pfp2;