const navbar = {
    navItems: [
        {title:"Schedule", icon: ICONS.SCHEDULE, page: pages.pagesContent.schedule},
        {title:"Tierlists", icon: ICONS.TIERLIST, page: pages.pagesContent.tierlists},
        {title:"Stats", icon: ICONS.STATS, page: pages.pagesContent.stats}
    ],

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
                item.page.render();
            })
            top.append(itemNode);
        }

        return top;
    },

    renderBottom() {
        let bottom = document.createElement("div");
        bottom.id = "nav-bar-bottom";

        let buttonsNode = document.createElement("div");
        buttonsNode.classList.add("navbar-actions");

        let reloadDataButton = document.createElement("button");
        reloadDataButton.classList.add("button");
        reloadDataButton.innerHTML = ICONS.SYNC + " Sync";
        reloadDataButton.addEventListener("click", function() {
            resyncUser(userInfos.name);
        })
        buttonsNode.append(reloadDataButton);

        let logoutButton = document.createElement("button");
        logoutButton.classList.add("button");
        logoutButton.innerHTML = ICONS.LOGOUT + " Logout";
        logoutButton.addEventListener("click", function() {
            logout();
        })
        buttonsNode.append(logoutButton);
        bottom.append(buttonsNode);

        let infosNode = document.createElement("div");
        infosNode.classList.add("navbar-infos");

        let versionNode = document.createElement("span");
        versionNode.innerText = `Moka - v${CONST.VERSION}`;
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