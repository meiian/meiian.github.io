function hide_mobile_conts() {
    document.getElementById("sidebar-l").classList.remove("mobile-visible");
    document.getElementById("sidebar-r").classList.remove("mobile-visible");
}

function create_mobile_buttons() {
    const mobile_cont = document.createElement("div");
    mobile_cont.classList.add("mobile-menu");

    const left_button = document.createElement("div");
    left_button.classList.add("mobile-button");
    left_button.id = "left-button-mobile";
    left_button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
    `;
    left_button.addEventListener("click", function() {
        document.getElementById("sidebar-l").classList.add("mobile-visible");
    })

    const right_button = document.createElement("div");
    right_button.classList.add("mobile-button");
    right_button.id = "right-button-mobile";
    right_button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
    `;
    right_button.addEventListener("click", function() {
        document.getElementById("sidebar-r").classList.add("mobile-visible");
    })

    mobile_cont.appendChild(left_button);
    mobile_cont.appendChild(right_button);
    return mobile_cont;
}