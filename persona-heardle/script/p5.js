document.addEventListener("DOMContentLoaded", function() {
    let heardle_title = document.getElementById("heardle-title");

    const title_text = heardle_title.innerText;

    heardle_title.innerHTML = `
        ${title_text.split("").map(ch => {
            let display_block = "display: inline-block;";
            if(!ch.trim()) display_block = "";
            return(`<span style="transform: rotate(${Math.random()*5}deg); font-size: ${Math.random()*0.10 + 1}em; ${display_block}">` + ch + '</span>')
        }).join("")}
    `;
});