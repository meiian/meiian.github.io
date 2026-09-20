const navbar = {
    navItems: [
        {title:"Schedule", icon: ICONS.SCHEDULE, page: pages.pagesContent.schedule},
        {title:"Tierlists", icon: ICONS.TIERLIST, page: pages.pagesContent.tierlists},
        {title:"Activity", icon: ICONS.WRITING, page: pages.pagesContent.activity},
        {title:"Recap", icon: ICONS.STATS, page: pages.pagesContent.wrapped},
        {title:"Card", icon: ICONS.CARD, page: pages.pagesContent.card},
        {title:"Settings", icon: ICONS.SETTINGS, page: pages.pagesContent.settings}
    ],

    navbarModal: null,
    itemsNodes: [],

    renderTop(userInfo) {
        let top = document.createElement("div");
        top.id = "nav-bar-top";

        let profileIcon = document.createElement("div");
        profileIcon.id = "nav-bar-profile";

        let profileIconImg = document.createElement("img");
        profileIconImg.src = userInfo.avatar.medium;

        profileIcon.appendChild(profileIconImg);

        let profileName = document.createElement("span");
        profileName.innerText = userInfo.name;
        profileIcon.append(profileName);

        profileIcon.classList.add("nav-bar-item");

        top.appendChild(profileIcon);

        for(const item of this.navItems) {
            let itemNode = document.createElement("div");
            itemNode.classList.add("nav-bar-item");

            if(item.icon) {
                let itemIconNode = document.createElement("div");
                itemIconNode.classList.add("nav-bar-item-icon");
                itemIconNode.innerHTML = item.icon;
                itemNode.append(itemIconNode);
            }

            let itemLabelNode = document.createElement("div");
            itemLabelNode.classList.add("nav-bar-item-label");
            itemLabelNode.innerText = item.title;
            itemNode.append(itemLabelNode);
            itemNode.addEventListener("click", function() {
                pages.goToPage(item.page, itemNode);
            })
            top.append(itemNode);
            this.itemsNodes.push(itemNode);
        }

        this.itemsNodes[0].classList.add("active");

        return top;
    },

    renderBottom() {
        let bottom = document.createElement("div");
        bottom.id = "nav-bar-bottom";

        let buttonsNode = document.createElement("div");
        buttonsNode.classList.add("navbar-actions");

        let reloadDataButton = document.createElement("button");
        reloadDataButton.classList.add("button");
        reloadDataButton.innerHTML = ICONS.SYNC + "<span class='navbar-button-label'> Sync</span>";
        reloadDataButton.addEventListener("click", function() {
            if(!this.navbarModal || !this.navbarModal.node) {
                this.navbarModal = showSyncModal(userInfos.name);
            } 
        })
        buttonsNode.append(reloadDataButton);

        let logoutButton = document.createElement("button");
        logoutButton.classList.add("button");
        logoutButton.innerHTML = ICONS.LOGOUT + "<span class='navbar-button-label'> Logout</span>";
        logoutButton.addEventListener("click", function() {
            logout();
        })
        buttonsNode.append(logoutButton);
        bottom.append(buttonsNode);

        let infosNode = document.createElement("div");
        infosNode.classList.add("navbar-infos");

        let logoNode = document.createElement("img");
        logoNode.src = "./suzu.ico";
        logoNode.classList.add("suzu-logo");
        infosNode.append(logoNode)

        let versionNode = document.createElement("div");
        versionNode.classList.add("version-infos");
        versionNode.innerHTML = `<span class="version-infos-title">Suzu</span><span class="version-infos-subtitle">v${CONST.VERSION}</span>`;
        infosNode.append(versionNode);

        let linksNode = document.createElement("div");
        linksNode.classList.add("navbar-links");
        let sourceCodeLink = document.createElement("a");
        sourceCodeLink.classList.add("navbar-link");
        sourceCodeLink.innerHTML = ICONS.CODEBERG;
        sourceCodeLink.href = CONST.SOURCE; 
        sourceCodeLink.target = "_blank";
        linksNode.append(sourceCodeLink);
        infosNode.append(linksNode);

        bottom.append(infosNode);

        return bottom;
    },


    render(userInfo) {
        let node = document.createElement("nav");
        node.id = "nav-bar";

        let top = this.renderTop(userInfo);

        let bottom = this.renderBottom();

        node.appendChild(top);
        node.appendChild(bottom);

        return node;
    }
}