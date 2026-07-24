const sidePanel = {
    sidepanel: null,
    body: null,
    renderEmpty() {
        let node = document.createElement("div");
        node.classList.add("sidepanel-cont");

        let bodyNode = document.createElement("div");
        bodyNode.classList.add("sidepanel-body");
        node.append(bodyNode);

        this.body = bodyNode;
        this.sidepanel = node;
        renderIn("app-cont", node);
    },

    showAnimeDetails(anime) {
        this.clear();
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
        this.body.append(twoColumnsNode);
    },

    clear() {
        this.sidepanel.remove();
        this.sidepanel = null;
        this.body = null;
        this.renderEmpty();
    }
}