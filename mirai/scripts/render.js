/**
 * Renvoie une liste de nodes HTML à afficher pour les résultats de la recherche.
 * @param {Object} medias Liste des medias format MediaList d'AniList
 * @returns {Array} liste de nodes
 */
function renderMediasList(medias) {
    let nodes = [];
    if(!medias || medias.length < 1) {
        return nodes;
    }

    for(const media of medias) {
        let node = document.createElement("div");
        node.classList.add("search-results-element");
        node.id = media.media.id;
        
        if(media.media.coverImage) {
            let coverNode = document.createElement("img");
            coverNode.src = media.media.coverImage.large;
            node.append(coverNode);
        }

        if(media.media.title) {
            let titleNode = document.createElement("span");
            titleNode.innerText = (media.media.title.english) ? media.media.title.english : media.media.title.romaji;
            node.append(titleNode);
        }

        nodes.push(node);
    }

    return nodes;
}

function renderIn(id, node, erase=false) {
    if(erase) {
        document.getElementById(id).innerText = "";
    }
    document.getElementById(id).append(node);
}

const profile = {

    renderWithStats(userInfo, withActions=false) {
    
        if (!userInfo) {
            return null;
        }

        let node = document.createElement("div");
        node.classList.add("mini-profile-cont");

        // HEADER
        let headerNode = document.createElement("div");
        headerNode.classList.add("mini-profile-header");

        if(userInfo.bannerImage) {
            let bannerNode = document.createElement("div");
            bannerNode.classList.add("mini-profile-banner");
            bannerNode.style.backgroundImage = `url(${userInfo.bannerImage})`;
            headerNode.append(bannerNode);
        }
        
        if(userInfo.avatar && userInfo.avatar.medium) {
            let avatarNode = document.createElement("img");
            avatarNode.classList.add("mini-profile-avatar");
            avatarNode.src = userInfo.avatar.medium;
            headerNode.append(avatarNode);
        }

        if(userInfo.name) {
            let nameNode = document.createElement("span");
            nameNode.classList.add("mini-profile-username");
            nameNode.innerText = userInfo.name;
            headerNode.append(nameNode);
        }
        node.append(headerNode);

        // BODY
        let bodyNode = document.createElement("div");
        bodyNode.classList.add("mini-profile-body");

        if(userInfo.statistics && userInfo.statistics.anime) {
            const statistics = userInfo.statistics.anime;
            let statsNode = document.createElement("div");
            statsNode.classList.add("mini-profile-stats");
            
            if(statistics.meanScore) {
                let meanScoreNode = document.createElement("div");
                meanScoreNode.classList.add("mini-profile-stat");
                meanScoreNode.innerHTML = `<span class="mini-profile-stat-value">${statistics.meanScore}%</span><span class="mini-profile-stat-label">mean score</span>`;
                statsNode.append(meanScoreNode);
            }

            if(statistics.count) {
                let countNode = document.createElement("div");
                countNode.classList.add("mini-profile-stat");
                countNode.innerHTML = `<span class="mini-profile-stat-value">${statistics.count}</span><span class="mini-profile-stat-label">entries</span>`;
                statsNode.append(countNode);
            }

            if(statistics.episodesWatched) {
                let episodesWatchedNode = document.createElement("div");
                episodesWatchedNode.classList.add("mini-profile-stat");
                episodesWatchedNode.innerHTML = `<span class="mini-profile-stat-value">${statistics.episodesWatched}</span><span class="mini-profile-stat-label">episodes</span>`;
                statsNode.append(episodesWatchedNode);
            }
            bodyNode.append(statsNode);
        }

        if(withActions) {
            bodyNode.append(this.renderActions(userInfo));
        }

        node.append(bodyNode);

        return node;
    },

    renderActions(userInfo) {
        let node = document.createElement("div");
        node.classList.add("mini-profile-actions");

        let resyncButton = document.createElement("div");
        resyncButton.classList.add("button", "green");
        resyncButton.innerText = "Re-sync data";
        resyncButton.addEventListener("click", function() {
            resyncUser(userInfo.name);
        });
        node.append(resyncButton);

        let logoutButton = document.createElement("div");
        logoutButton.classList.add("button", "red");
        logoutButton.innerText = "Logout";
        node.append(logoutButton);


        return node;
    },

    renderHoverProfile(userInfo) {
        let node = document.createElement("div");
        node.id = "hover-profile";

        let hoverProfileNode = this.renderWithStats(userInfo, true);
        let navbarProfileNode = document.getElementById("nav-bar-profile");
        hoverProfileNode.style.top = navbarProfileNode.offsetTop + navbarProfileNode.clientHeight + 'px';
        hoverProfileNode.style.left = navbarProfileNode.offsetLeft + (navbarProfileNode.clientWidth/2) - 150 + 'px';
        
        node.append(hoverProfileNode);
        return node;
    }
}

function renderConfirmUser() {
    let node = document.createElement("div");
    node.id = "landing-confirm-user";

    let cancelButton = document.createElement("a");
    cancelButton.innerText = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", function(e) {
        window.location.reload();
    });
    node.append(cancelButton);

    let confirmButton = document.createElement("a");
    confirmButton.innerText = "Confirm";
    confirmButton.classList.add("button");
    confirmButton.addEventListener("click", (e) => confirmUser());
    node.append(confirmButton);

    return node;
}

function renderNavBar(userInfo) {
    let node = document.createElement("nav");
    node.id = "nav-bar";

    let left = document.createElement("div");
    left.id = "nav-bar-left";

    let middle = document.createElement("div");
    middle.id = "nav-bar-middle";

    let right = document.createElement("div");
    right.id = "nav-bar-right";


    let profileIcon = document.createElement("div");
    profileIcon.id = "nav-bar-profile";

    let profileIconImg = document.createElement("img");
    profileIconImg.src = userInfo.avatar.medium;

    profileIcon.appendChild(profileIconImg);
    left.appendChild(profileIcon);

    node.appendChild(left);
    node.appendChild(middle);
    node.appendChild(right);

    return node;
}