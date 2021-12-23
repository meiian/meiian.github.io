LINK_SIZE = 23;

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');

    } catch (err) {

    }
  
    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {

    }, function(err) {

    });
}

function update_counters(counts) {
    for (const key in counts) {
        document.getElementById('nb-' + key).innerText = counts[key];
    }
}

function print_thread_parts(thread_parts) {
    parts_list = document.getElementById("thread-parts");
    printed_parts_number = parts_list.childElementCount;
    for(i = 0; i < printed_parts_number ; i++) {
        actual_part = document.getElementById(`thread-part-${i}-text`);
        if(i < thread_parts.length){
            actual_part.innerText = thread_parts[i];
            document.getElementById(`thread-part-${i}-chara-count`).innerText = '(' + thread_parts[i].length + " character" + ((thread_parts[i].length>1)?"s)":")");
        }
        else 
            document.getElementById(`thread-part-${i}`).remove();
    }
    for(i = printed_parts_number; i < thread_parts.length ; i++) {
        thread_part = document.createElement("div");
        thread_part.id = `thread-part-${i}`;
        thread_part.classList.add(`thread-part`)
        string_chara = '(' + thread_parts[i].length + " character" + ((thread_parts[i].length>1)?"s)":")");
        thread_part.innerHTML = `<div class="text-medium text-strong">Part ${i+1} <span id="thread-part-${i}-chara-count" class="text-small">${string_chara}</span></div>
        <div id="thread-part-${i}-card" class="card card-horizontal">
            <div class="text-medium" id="thread-part-${i}-text">${thread_parts[i]}</div>
        </div>`;
        thread_part.addEventListener("click", function(){
            card = this.lastChild;
            copyTextToClipboard(card.innerText)
            copied_alert = document.createElement("div");
            copied_alert.className = "copied";
            copied_alert.id = `thread-part-${i}-copied`;
            copied_alert.innerHTML = "<div class='text-medium text-strong my-auto'>Copied !</div>";
            card.append(copied_alert);
            setTimeout(function(){
                document.getElementById(`thread-part-${i}-copied`).remove()
            },3000);
        })
        parts_list.append(thread_part);
    }
}


function create_thread_parts(text) {
    reg = 
    thread_parts = text.match(/([\s\S]{1,280})(?<!\s)(?!\w)/g);
    console.log(text)
    console.log(thread_parts)
    if (thread_parts == null)
        thread_parts = [];
    print_thread_parts(thread_parts);
    update_counters({
        characters: text.length,
        parts: thread_parts.length
    });
}



let text_input = document.getElementById("text-input");

text_input.addEventListener("input", function(){
    create_thread_parts(text_input.value);
});