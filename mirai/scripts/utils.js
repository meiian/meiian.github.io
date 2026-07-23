const spinner = {
    label: "",
    isShown: false,
    show(label) {
        if(!this.isShown) {
            document.getElementById("loading-cont").innerHTML = `<span class="loader-label">${(label)? label : ""}</span> <span class="loader"></span>`;
            this.label = label;
        }
    },

    hide() {
        document.getElementById("loading-cont").innerText = "";
    }
}