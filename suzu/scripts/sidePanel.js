const sidePanel = {
    sidepanel: null,
    body: null,
    hidden: false,
    hideButton: null,

    renderEmpty() {
        let node = document.createElement("div");
        node.classList.add("sidepanel-cont");

        let bodyNode = document.createElement("div");
        bodyNode.classList.add("sidepanel-body");
        node.append(bodyNode);

        node.append(this.renderHideButton());

        this.body = bodyNode;
        this.sidepanel = node;
        renderIn("app-cont", node);
        this.hide();
    },

    renderHideButton() {
        let node = document.createElement("button");
        node.id = "sidepanel-hide-button";
        node.innerHTML = ICONS.RIGHTARROW;

        node.addEventListener("click", function() {
            if(sidePanel.hidden) {
                sidePanel.show()
            } else {
                sidePanel.hide();
            }
        })

        this.hideButton = node;
        return node;
    },

    hide() {
        this.sidepanel.style.right = "calc(0px - 30em)";
        this.hideButton.innerHTML = ICONS.LEFTARROW;
        this.hidden = true;
    },

    show() {
        this.sidepanel.style.right = "1em";
        this.hideButton.innerHTML = ICONS.RIGHTARROW;
        this.hidden = false;
    },

    showAnimeDetails(anime) {
        this.clear();
        this.show();

        if(anime.score) {
            let noteNode = document.createElement("div");
            noteNode.classList.add("sidepanel-note-cont");
            noteNode.innerHTML = scoreUtils.displayScore(anime.score, userInfos.mediaListOptions.scoreFormat);
            this.body.append(noteNode);
        }

        if(anime.progress || anime.progress === 0) {
            let progressNode = document.createElement("div");
            progressNode.classList.add("sidepanel-progress-cont");
            progressNode.append(this.buildProgress(anime.progress, anime.status, anime.media.episodes));
            this.body.append(progressNode);
        }

        if(anime.media.coverImage) {
            let coverNode = document.createElement("img");
            coverNode.classList.add("sidepanel-cover");
            coverNode.src = anime.media.coverImage.large;
            this.body.append(coverNode);
        }

        if(anime.media.bannerImage) {
            this.sidepanel.style.backgroundImage = `url(${anime.media.bannerImage})`;
        }

        if(anime.media.title) {
            let titleNode = document.createElement("div");
            titleNode.classList.add("sidepanel-title");

            const primary = (anime.media.title.english) ? anime.media.title.english : anime.media.title.romaji;
            const secondary = (anime.media.title.english) ? anime.media.title.romaji : null;
            if(primary) {
                let primaryTitleNode = document.createElement("span");
                primaryTitleNode.classList.add("primary-title");
                primaryTitleNode.innerText = primary;
                titleNode.append(primaryTitleNode);
            }
            if(secondary) {
                let secondaryTitleNode = document.createElement("span");
                secondaryTitleNode.classList.add("secondary-title");
                secondaryTitleNode.innerText = secondary;
                titleNode.append(secondaryTitleNode);
            }
            this.body.append(titleNode);
        }

        if(anime.media.description) {
            let descriptionNode = document.createElement("div");
            descriptionNode.classList.add("sidepanel-desc");
            descriptionNode.innerHTML = textUtils.trim(anime.media.description, 250);
            this.body.append(descriptionNode);
        }

        let twoColumnsNode = document.createElement("div");
        twoColumnsNode.classList.add("sidepane-two-columns");

        let columnOneNode = document.createElement("div");
        columnOneNode.classList.add("sidepanel-column-one");

        if(anime.media.averageScore) {
            let avgScoreNode = document.createElement("div");
            avgScoreNode.classList.add("sidepanel-stat");
            avgScoreNode.innerHTML = `<span class="label">Avg. score</span><span class="value">${anime.media.averageScore}%</span>`;
            columnOneNode.append(avgScoreNode);
        }

        if(anime.media.rankings && anime.media.rankings.length > 0) {
            const highrank = anime.media.rankings.filter(r => r.context === CONST.RANKING_CONTEXT.HIGHEST_RATED && r.season === null);
            if(highrank && highrank.length > 0) {
                let highRankNode = document.createElement("div");
                highRankNode.classList.add("sidepanel-stat");
                highRankNode.innerHTML = `<span class="label">Year highest rank</span><span class="value">#${highrank[0].rank}</span>`;
                columnOneNode.append(highRankNode);
            }

            const mostPopular = anime.media.rankings.filter(r => r.context === CONST.RANKING_CONTEXT.MOST_POPULAR && r.season === null);
            if(mostPopular && mostPopular.length > 0) {
                let mostPopularNode = document.createElement("div");
                mostPopularNode.classList.add("sidepanel-stat");
                mostPopularNode.innerHTML = `<span class="label">Year most popular</span><span class="value">#${mostPopular[0].rank}</span>`;
                columnOneNode.append(mostPopularNode);
            }
        }
        twoColumnsNode.append(columnOneNode);

        let columnTwoNode = document.createElement("div");
        columnTwoNode.classList.add("sidepanel-column-two");

        if(anime.media.studios.nodes.length > 0) {
            let studioNode = document.createElement("div");
            studioNode.classList.add("sidepanel-stat");
            studioNode.innerHTML = `<span class="label">Studio</span><span class="value">${anime.media.studios.nodes[0].name}</span>`;
            columnTwoNode.append(studioNode);
        }

        if(anime.media.seasonYear) {
            let seasonText = ((anime.media.season)? textUtils.capitalize(anime.media.season) : "") + " " + anime.media.seasonYear;
            let seasonNode = document.createElement("div");
            seasonNode.classList.add("sidepanel-stat");
            seasonNode.innerHTML = `<span class="label">Season</span><span class="value">${seasonText}</span>`;
            columnTwoNode.append(seasonNode);
        }

        if(anime.media.episodes) {
            let episodesNode = document.createElement("div");
            episodesNode.classList.add("sidepanel-stat");
            episodesNode.innerHTML = `<span class="label">Episodes</span><span class="value">${anime.media.episodes}</span>`;
            columnTwoNode.append(episodesNode);
        }

        if(anime.media.duration) {
            let durationNode = document.createElement("div");
            durationNode.classList.add("sidepanel-stat");
            durationNode.innerHTML = `<span class="label">Duration</span><span class="value">${dateUtils.formatMinutesIntoDisplay(anime.media.duration)}</span>`;
            columnTwoNode.append(durationNode);
        }

        twoColumnsNode.append(columnTwoNode);

        this.body.append(twoColumnsNode);
    },

    buildProgress(progress, status, duration) {
        let node = document.createElement("div");
        node.classList.add("sidepanel-progress-body");

        let labelNode = document.createElement("span");
        labelNode.classList.add("sidepanel-progress-body-label");
        labelNode.innerText = CONST.STATUS_DISPLAY_PROGRESSION[status];
        node.append(labelNode);

        let progressBarNode = document.createElement("div");
        progressBarNode.classList.add("sidepanel-progress-body-progress");
        progressBarNode.classList.add("progress-bar-cont");

        let progressBarFullNode = document.createElement("div");
        progressBarFullNode.classList.add("progress-bar-full");
        let progressPercent = (progress) ? 33 : 0;
        if(duration) {
            progressPercent = Math.round(progress / duration * 100);
        }
        progressBarFullNode.style.setProperty("--progress", progressPercent + '%');
        progressBarNode.append(progressBarFullNode);
        node.append(progressBarNode);

        let progressLabelNode = document.createElement("span");
        progressLabelNode.classList.add("sidepanel-progress-body-progress-label");
        progressLabelNode.innerText = (progress + "/" + ((duration)?duration:"?"));
        node.append(progressLabelNode);

        return node;
    },

    clear() {
        this.sidepanel.style = null;
        this.body.innerText = "";
    },
}