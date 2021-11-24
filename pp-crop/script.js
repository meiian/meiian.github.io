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

document.body.addEventListener("drop", dropHandler);

document.body.addEventListener("dragover", dragOverHandler);

var slider = document.getElementById("zoom");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  new_zoom = 100 + parseInt(this.value)
  document.getElementById("preview").style.height = new_zoom + '%';
  document.getElementById("preview2").style.height = new_zoom + '%';
}

document.getElementById("save-button").addEventListener("click", savePic);