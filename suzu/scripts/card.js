const cardRenderer = {

    container: null,
    body: null,
    menu: null,
    card: null,
    settings : {

    },


    init() {

    },

    renderPage() {
        const node = document.createElement("div");
        node.id = "card-page-cont";
        this.container = node;

        const body = document.createElement("div");
        body.id = "card-body";
        this.body = body;
        node.append(body);

        const menu = document.createElement("div");
        menu.id = "card-menu";
        this.menu = menu;
        node.append(menu); 
        
        this.renderCard();
        this.renderMenu();
        
        return node;
    },

    renderCard() {
        const card = document.createElement("div");
        card.classList.add("profile-card");
        this.card = card;

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("profile-card-header");
        const cardHeaderBg = document.createElement("div");
        cardHeaderBg.classList.add("profile-card-header-bg");
        cardHeaderBg.style.setProperty("--bg", `url(${userInfos.bannerImage}`)
        card.append(cardHeaderBg);
        const cardHeaderTitle = document.createElement("span");
        cardHeaderTitle.classList.add("profile-card-header-title");
        cardHeaderTitle.innerText = userInfos.name;
        cardHeader.append(cardHeaderTitle);
        card.append(cardHeader);

        const cardIconCont = document.createElement("div");
        cardIconCont.classList.add("profile-card-icon-cont");
        const cardIcon = document.createElement("div");
        cardIcon.classList.add("profile-card-icon");
        cardIcon.style.setProperty("--bg", `url(${userInfos.avatar.medium})`);
        cardIconCont.append(cardIcon);
        const generatedDate = document.createElement("div");
        generatedDate.innerText = dateUtils.printDateISOithoutHours(new Date());
        generatedDate.classList.add("profile-card-date");
        cardIconCont.append(generatedDate);
        card.append(cardIconCont);

        const cardBody = document.createElement("div");
        cardBody.classList.add("profile-card-body");
        card.append(cardBody);

        const nbAnimeWatched = document.createElement("div");
        nbAnimeWatched.classList.add("profile-card-stat");
        nbAnimeWatched.innerHTML = `<span class="profile-card-stat-title">Animes watched</span><span class="profile-card-stat-value">${userInfos.statistics.anime.count}</span>`;
        cardBody.append(nbAnimeWatched);

        const nbEpisodesWatched = document.createElement("div");
        nbEpisodesWatched.classList.add("profile-card-stat");
        nbEpisodesWatched.innerHTML = `<span class="profile-card-stat-title">Episodes watched</span><span class="profile-card-stat-value">${userInfos.statistics.anime.episodesWatched}</span>`;
        cardBody.append(nbEpisodesWatched);

        const nbHoursWatchedStat = document.createElement("div");
        nbHoursWatchedStat.classList.add("profile-card-stat");
        nbHoursWatchedStat.innerHTML = `<span class="profile-card-stat-title">Watch time</span><span class="profile-card-stat-value">${dateUtils.formatMinutesIntoDisplay(userInfos.statistics.anime.minutesWatched)}</span>`;
        cardBody.append(nbHoursWatchedStat);

        const mostWatchedGenreStat = document.createElement("div");
        const mostWatchedGenre = userInfos.statistics.anime.genres.reduce((a, b) => (a && a.count > b.count) ? a : b) 
        mostWatchedGenreStat.classList.add("profile-card-stat");
        mostWatchedGenreStat.innerHTML = `<span class="profile-card-stat-title">Favorite genre</span><span class="profile-card-stat-value">${mostWatchedGenre.genre}</span>`;
        cardBody.append(mostWatchedGenreStat);

        const mostWatchedTagStat = document.createElement("div");
        const mostWatchedTag = userInfos.statistics.anime.tags.reduce((a, b) => (a && a.count > b.count) ? a : b) 
        mostWatchedTagStat.classList.add("profile-card-stat");
        mostWatchedTagStat.innerHTML = `<span class="profile-card-stat-title">Favorite tag</span><span class="profile-card-stat-value">${mostWatchedTag.tag.name}</span>`;
        cardBody.append(mostWatchedTagStat);

        const meanScoreStat = document.createElement("div");
        meanScoreStat.classList.add("profile-card-stat");
        meanScoreStat.innerHTML = `<span class="profile-card-stat-title">Mean score</span><span class="profile-card-stat-value">${Math.round(userInfos.statistics.anime.meanScore)}%</span>`;
        cardBody.append(meanScoreStat);

        cardBody.append(this.renderYearWatchGraph());

        this.body.append(card);
    },

    renderMenu() {
        const copyButton = document.createElement("button");
        copyButton.classList.add("button");
        copyButton.id = "copy-card-button";
        copyButton.innerHTML = ICONS.COPY + " Copy";
        copyButton.addEventListener("click", function() {
            cardRenderer.copyPicture();
        })
        this.menu.append(copyButton);

        const saveButton = document.createElement("button");
        saveButton.classList.add("button");
        saveButton.innerHTML = ICONS.PICTURE + " Save";
        saveButton.addEventListener("click", function() {
            cardRenderer.savePicture();
        })
        this.menu.append(saveButton);
    },

    copyPicture() {
        domtoimage.toBlob(this.card, {style: {"overflow": "hidden"}, height: 320, width: 480}).then(blob => {
            navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]).then(e => {
                const button = document.getElementById("copy-card-button");
                const before = button.innerHTML;
                button.innerHTML = ICONS.CHECKED + " Copied";
                setTimeout(function() {
                    document.getElementById("copy-card-button").innerHTML = before;
                }, 3000);
            });
        });
    },

    savePicture() {
        domtoimage.toBlob(this.card, {style: {"overflow": "hidden"}, height: 320, width: 480}).then(blob => {
            let now = new Date();
            const imagename = 'card_' + now.getFullYear() + (now.getMonth()+1) + now.getDate() + ".png";
            let blobUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.href = blobUrl;
            link.download = imagename;
            document.body.appendChild(link);
            link.click()
            document.body.removeChild(link);
        });
    },

    renderYearWatchGraph() {
        const nbActivitiesPerYear = activities.map(a => dateUtils.getDateFromALEpoch(a.createdAt).getFullYear()).reduce(function (acc, curr) {
            return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        }, {});
        const actualYear = new Date().getFullYear();
        const maxNb = Math.max(...Object.values(nbActivitiesPerYear));

        const node = document.createElement("div");
        node.classList.add("hist-cont");

        for(let i = actualYear - 6 ; i <= actualYear ; i++) {
            const histPointNode = document.createElement("div");
            histPointNode.classList.add("hist-point-node");

            const label = document.createElement("div");
            label.innerText = i;
            label.classList.add("hist-point-label");
            histPointNode.append(label);

            const bar = document.createElement("div");
            bar.classList.add("hist-point-bar");
            bar.style.setProperty("--size", Math.round((nbActivitiesPerYear[i] / maxNb * 100)) + "%");
            histPointNode.append(bar);
            node.append(histPointNode);
        }

        return node;
    }
}