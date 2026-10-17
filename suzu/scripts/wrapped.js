const wrapperRenderer = {
    container: null,
    body: null,
    menu: null,
    maxYear: null,
    minYear: null,
    currentYearNode: null,
    currentYear: null,
    leftArrow: null,
    rightArrow: null,
    renderPageForYear(year) {
        const wrappedStats = wrappedCalculator.computeAllStats(year);

        let body = this.body;
        if(!body) {
            body = document.createElement("div");
            body.id = "wrapped-body";
            this.body = body;
            this.container.append(body);
        }
    
        const header = document.createElement("div");
        header.classList.add("wrapped-header");
        const headerProfile = document.createElement("div");
        headerProfile.classList.add("wrapped-header-profile");
        const icon = document.createElement("img");
        icon.classList.add("wrapped-header-icon");
        icon.src = userInfos.avatar.medium;
        headerProfile.append(icon);
        const headerTitle = document.createElement("div");
        headerTitle.classList.add("wrapped-header-titles");
        headerTitle.innerHTML = `<span class="wrapped-header-title">${userInfos.name}</span><span class="wrapped-header-subtitle">${year}</span>`;
        headerProfile.append(headerTitle);
        header.append(headerProfile);
        header.append(this.renderYearActivityGraph(wrappedStats.nbActivitiesByDay));
        body.append(header);

        body.append(this.renderActivitiesMonthGraph(wrappedStats.nbActivitiesByMonth));

        const bentoGrid = document.createElement("div");
        bentoGrid.classList.add("wrapped-bento");
        body.append(bentoGrid);

        bentoGrid.append(this.renderStatBlock(wrappedStats.nbAnimesWatched.total, "titles watched", `approx. ${wrappedStats.nbAnimesWatched.freq1} title every ${wrappedStats.nbAnimesWatched.freq2} days`));
        bentoGrid.append(this.renderStatBlock(wrappedStats.nbDaysWithActivity.total, "days with at least one episode watched", `approx. 1 day out of ${wrappedStats.nbDaysWithActivity.freq}`));
        bentoGrid.append(this.renderStatBlock(wrappedStats.watchTime.hours, "hours of watchtime", `approx. ${wrappedStats.watchTime.days} days of watchtime`));

        const doubleBlock = document.createElement("div");
        doubleBlock.classList.add("wrapped-bento-double");
        const meanBlock = this.renderStatBlock(wrappedStats.meanScore.mean, "mean score", wrappedStats.meanScore.message);
        meanBlock.style.backgroundColor = `var(${wrappedStats.meanScore.color})`;
        meanBlock.classList.add("text-colored");
        doubleBlock.append(meanBlock);
        doubleBlock.append(this.renderStatBlock(wrappedStats.nbRewatch.total, "titles rewatched", `approx. ${wrappedStats.nbRewatch.freq}% of all titles watched`));
        bentoGrid.append(doubleBlock);

        bentoGrid.append(this.renderListBlock("Genres", wrappedStats.mostWatchedGenres, 10));
        bentoGrid.append(this.renderListBlock("Tags", wrappedStats.mostWatchedTags, 10));
        
        return body;
    },

    renderYearActivityGraph(days) {
        const node = document.createElement("div");
        node.classList.add("wrapped-days-activity-graph");
        for(let week = 0; week < 52; week++) {
            const weekNode = document.createElement("div");
            weekNode.classList.add("wrapped-days-activity-graph-column");
            for(let day = 0; day < 7; day++) {
                const index = (week * 7) + day;
                if(index > days.length) {
                    break;
                }
                const dayValue = days[index];
                const dayNode = document.createElement("div");
                dayNode.classList.add("wrapped-days-activity-square");
                dayNode.classList.add(`color-${dayValue}`);
                dayNode.style.setProperty("--color", ( 1 +(dayValue / 2)));
                weekNode.append(dayNode); 
            }
            node.append(weekNode);
        }

        return node;
    },

    clearBody() {
        this.body.innerText = "";
    },

    clear() {
        this.container.remove();
        this.container = null;
        this.body = null;
        this.menu = null;
        this.maxYear = null;
        this.minYear = null;
        this.currentYearNode = null;
        this.currentYear = null;
        this.leftArrow = null;
        this.rightArrow = null;
    },

    renderPage() {
        const container = document.createElement("div");
        container.id = "wrapped-page-cont";
        this.container = container;
        const actualYear = new Date().getFullYear();
        this.maxYear = actualYear;
        this.currentYear = actualYear;
        this.minYear = activityUtils.getMinYear();

        this.renderPageForYear(actualYear);

        this.renderMenu();

        return this.container;
    },

    renderMenu() {
        const node = document.createElement("div");
        node.classList.add("wrapped-year-selector-cont");
        this.menu = node;
        this.container.append(node); 

        let leftArrow = document.createElement("button");
        leftArrow.innerHTML = ICONS.LEFTARROW;
        leftArrow.addEventListener("click", function() {
            wrapperRenderer.previousYear();
        })
        node.append(leftArrow);
        this.leftArrow = leftArrow;

        let labelNode = document.createElement("div");
        labelNode.innerText = this.maxYear;
        node.append(labelNode);
        this.currentYearNode = labelNode;

        let rightArrow = document.createElement("button");
        rightArrow.innerHTML = ICONS.RIGHTARROW;
        rightArrow.classList.add("inactive");
        rightArrow.addEventListener("click", function() {
            wrapperRenderer.nextYear();
        })
        node.append(rightArrow);
        this.rightArrow = rightArrow;
    },

    previousYear() {
        if(this.currentYear === this.minYear) {
            return;
        }
        this.currentYear = this.currentYear - 1;
        this.clearBody();
        this.currentYearNode.innerText = this.currentYear;
        this.renderPageForYear(this.currentYear);
        this.updateArrows();
    },

    nextYear() {
        if(this.currentYear === this.maxYear) {
            return;
        }
        this.currentYear = this.currentYear + 1;
        this.clearBody();
        this.currentYearNode.innerText = this.currentYear;
        this.renderPageForYear(this.currentYear);
        this.updateArrows();
    },

    updateArrows() {
        this.leftArrow.classList.remove("inactive");
        this.rightArrow.classList.remove("inactive");
        if(this.currentYear === this.maxYear) {
            this.rightArrow.classList.add("inactive");
        }
        if(this.currentYear === this.minYear) {
            this.leftArrow.classList.add("inactive");
        }
    },

    renderActivitiesMonthGraph(nbPerMonth) {
        const globalNode = document.createElement("div");
        globalNode.classList.add("wrapped-graph-cont");
        
        const node = document.createElement("div");
        node.classList.add("wrapped-graph");

        const nbMax = Math.max(...nbPerMonth);

        for(const nb of nbPerMonth) {
            const monthBar = document.createElement("div");
            monthBar.classList.add("wrapped-graph-node-bar");
            monthBar.style.setProperty("--height", `${Math.round((nb / nbMax) * 100)}%`);

            const monthBarLabel = document.createElement("span");
            monthBarLabel.classList.add("wrapped-graph-node-bar-label");
            monthBarLabel.innerText = nb;
            monthBar.append(monthBarLabel);

            node.append(monthBar);
        }

        globalNode.append(node);

        const title = document.createElement("div");
        title.innerText = "Monthly activities";
        title.classList.add("wrapped-graph-title");
        globalNode.append(title);

        return globalNode;
    },

    renderStatBlock(number, title, subtitle) {
        const node = document.createElement("div");
        node.classList.add("wrapped-stat-block");

        const numberNode = document.createElement("div");
        numberNode.classList.add("wrapped-stats-block-number");
        numberNode.innerText = number;
        node.append(numberNode);

        const titleNode = document.createElement("div");
        titleNode.classList.add("wrapped-stats-block-title");
        titleNode.innerText = title;
        node.append(titleNode);

        const subtitleNode = document.createElement("div");
        subtitleNode.classList.add("wrapped-stats-block-subtitle");
        subtitleNode.innerText = subtitle;
        node.append(subtitleNode);

        return node;
    },

    renderListBlock(title, list, nbMax) {
        const node = document.createElement("div");
        node.classList.add("wrapped-stat-block", "wrapped-stat-list");

        const titleNode = document.createElement("div");
        titleNode.classList.add("wrapped-stats-block-title");
        titleNode.innerText = title;
        node.append(titleNode);

        const listNode = document.createElement("div");
        listNode.classList.add("wrapped-stats-block-list");
        let i = 1;
        for(const entry of list) {
            if(i > nbMax) {
                break;
            }

            const line = document.createElement("div");
            line.classList.add("wrapped-stats-block-list-item");
            
            const rank = document.createElement("span");
            rank.classList.add("wrapped-stats-block-list-item-rank");
            rank.innerText = i;
            line.append(rank);

            const label = document.createElement("span");
            label.classList.add("wrapped-stats-block-list-item-label");
            label.innerText = entry[0];
            line.append(label);

            const nb = document.createElement("span");
            nb.classList.add("wrapped-stats-block-list-item-nb");
            nb.innerText = entry[1];
            line.append(nb);

            i++;
            listNode.append(line);
        }
        node.append(listNode);

        return node;
    }
}


const wrappedCalculator = {

    computeAllStats(year) {
        const wrappedStats = {
            nbAnimesWatched: this.computeNbAnimesWatched(year),
            watchTime: this.computeWatchTime(year),
            nbDaysWithActivity: this.computeNbDaysWithAnimeWatched(year),
            nbActivitiesByDay: this.computeNbActivitiesByDay(year),
            nbRewatch: this.computeNbRewatch(year),
            meanScore: this.computeMeanScore(year),
            mostWatchedGenres: this.computeListOfMostWatchedGenre(year),
            mostWatchedTags: this.computeListOfMostWatchedTags(year),
            nbActivitiesByMonth: this.computeNbActivitiesByMonth(year)
        };
        return wrappedStats;
    },


    computeNbAnimesWatched(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const animesId = new Set(activitiesOfYear.map(a => a.media.id));
        const total = animesId.size;
        let freq1 = 1;
        let freq2 = 1;
        if(total > 365) {
            freq1 = Math.round(total / 365);
        } else {
            freq2 = Math.round(365 / total);
        }
        return {total:total, freq1:freq1, freq2:freq2};
    },

    computeWatchTime(year) {
        const getEpisodeDuration = function(id) {
            const animeOfActivity = animeUtils.getAnimeById(id);
            if(!animeOfActivity) {
                return 0;
            }
            return animeOfActivity.media.duration;
        };
        const getNbOfEpisodesWatched = function(progress) {
            const singleEpisodeMatch = progress.match(/^(\d+)$/);
            const multipleEpisodeMatch = progress.match(/^(\d+) - (\d+)$/);
            if(singleEpisodeMatch) {
                return 1;
            } else if (multipleEpisodeMatch) {
                return parseInt(multipleEpisodeMatch[2]) - parseInt(multipleEpisodeMatch[1]);
            }
            return 0;
        }
        let total = 0;
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        for(const activity of activitiesOfYear) {
            switch(activity.status) {
                case "watched episode":
                    const episodeDuration = getEpisodeDuration(activity.media.id);
                    total += getNbOfEpisodesWatched(activity.progress) * episodeDuration;
                    break;
                case "completed":
                    total += getEpisodeDuration(activity.media.id);
                    break;
                default:
                    break;
            }
        }
        return {minutes:total, hours:Math.floor(total/60), days:Math.floor(total/60/24)};
    },

    computeNbDaysWithAnimeWatched(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const total = new Set(activitiesOfYear.map(a => dateUtils.printDateISOithoutHours(dateUtils.getDateFromALEpoch(a.createdAt)))).size;
        const freqOnDays = Math.round(365 / total);
        return {total:total, freq:freqOnDays};
    },

    computeNbActivitiesByDay(year) {
        const nbPerDay = [];
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const dates = activitiesOfYear.map(a => dateUtils.getDateWithoutHours(dateUtils.getDateFromALEpoch(a.createdAt)));
        const dayToFind = new Date(year, 0, 1, 0, 0, 0, 0);
        for(let i = 0; i < 365 ; i++) {
            nbPerDay.push(dates.filter(d => dateUtils.checkSameDay(dayToFind, d)).length);
            dayToFind.setDate(dayToFind.getDate() + 1);
        }
        return nbPerDay;
    },

    computeNbRewatch(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const total = new Set(activitiesOfYear.filter(a => a.status.includes("rewatched")).map(a => a.media.id)).size;
        const freq = Math.round(total / this.computeNbAnimesWatched(year).total * 100);
        return {total: total, freq: freq};
    },

    computeMeanScore(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const completionsOfYear = new Set(activitiesOfYear.filter(a => a.status.includes("completed")).map(a => a.media.id));
        let totalScore = 0;
        for(const id of completionsOfYear) {
            const currentAnime = animeUtils.getAnimeById(id);
            if(currentAnime && currentAnime.score) {
                totalScore += currentAnime.score;
            }
        }
        const mean = Math.round(totalScore / completionsOfYear.size*100)/100;
        const deviation = (mean*10) - userInfos.statistics.anime.meanScore;
        let message = "near your global mean score";
        let color = "--average-wrapped-block";
        if(deviation >= 2.5) {
            message = "greater than your global mean score";
            color = "--positive-wrapped-block";
        } else if(deviation <= -2.5) {
            message = "lesser than your global mean score";
            color = "--negative-wrapped-block";
        }
        return {mean: mean, message:message, color:color};
    },

    computeListOfMostWatchedGenre(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const animesId = new Set(activitiesOfYear.map(a => a.media.id));
        const animesOfYear = Array.from(animesId).map(id => animeUtils.getAnimeById(id));
        const genresOfYear = animesOfYear.filter(a => a && a.media && a.media.genres).map(a => a.media.genres).flat();

        const genresFreq = {};
        for(const genre of genresOfYear) {
            if(Object.hasOwn(genresFreq, genre)) {
                genresFreq[genre] = genresFreq[genre] + 1;
            } else {
                genresFreq[genre] = 1;
            }
        }

        const genresSorted = Object.entries(genresFreq).sort((a,b) => b[1] - a[1]);
        
        return genresSorted;
    },

    computeListOfMostWatchedTags(year) {
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const animesId = new Set(activitiesOfYear.map(a => a.media.id));
        const animesOfYear = Array.from(animesId).map(id => animeUtils.getAnimeById(id));
        const tagsOfYear = animesOfYear.filter(a => a && a.media && a.media.tags).map(a => a.media.tags.map(t => t.name).flat()).flat();

        const tagsFreq = {};
        for(const tag of tagsOfYear) {
            if(Object.hasOwn(tagsFreq, tag)) {
                tagsFreq[tag] = tagsFreq[tag] + 1;
            } else {
                tagsFreq[tag] = 1;
            }
        }

        const tagsSorted = Object.entries(tagsFreq).sort((a,b) => b[1] - a[1]);
        
        return tagsSorted;
    },

    computeNbActivitiesByMonth(year) {
        const nbPerMonth = [];
        const activitiesOfYear = activityUtils.getActivitiesOfYear(year);
        const dates = activitiesOfYear.map(a => dateUtils.getDateWithoutHours(dateUtils.getDateFromALEpoch(a.createdAt)));
        let monthToFind = new Date(year, 0, 1, 0, 0, 0, 0);
        for(let i = 0; i < 12 ; i++) {
            nbPerMonth.push(dates.filter(d => dateUtils.checkSameMonth(monthToFind, d)).length);
            monthToFind.setMonth(monthToFind.getMonth() + 1);
        }
        return nbPerMonth;
    }
}