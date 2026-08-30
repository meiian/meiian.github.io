class Modal {
    title = "";
    body = [];
    node = null;

    constructor(title, bodyNodes) {
        this.title = title;
        this.body = bodyNodes;
    }

    getTitle() {
        return this.title;
    }

    getBody() {
        return this.body;
    }

    setBody(bodyNodes) {
        this.body = bodyNodes;
    }

    render() {
        let self = this;
        const cont = document.createElement("div");
        cont.id = "popup-cont";
        cont.addEventListener("click", function(ev) {
            ev.stopPropagation();
            if(ev.target !== ev.currentTarget) {
                return ;
            }
            self.close();
        })

        const popup = document.createElement("div");
        popup.classList.add("modal");

        const title = document.createElement("span");
        title.classList.add("modal-title");
        title.innerText = this.getTitle();
        popup.appendChild(title);

        for(const bodyNode of this.getBody()) {
            popup.appendChild(bodyNode);
        }

        cont.appendChild(popup);
        this.node = cont;

        renderIn("page-cont", cont, false);
    }

    close() {
        this.node.remove();
        this.node = null;
    }
}