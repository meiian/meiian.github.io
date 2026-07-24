const navbar = {
    navItems: [
        {title:"Schedule", icon: ICONS.SCHEDULE},
        {title:"Tierlists", icon: ICONS.TIERLIST},
        {title:"Stats", icon: ICONS.STATS}
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
            top.append(itemNode);
        }

        return top;
    },

    renderBottom() {
        let bottom = document.createElement("div");
        bottom.id = "nav-bar-bottom";

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