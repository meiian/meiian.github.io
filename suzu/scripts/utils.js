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
};

const animeFetchAnimationRenderer = {
    animesToShow: [],
    animesTreadmill: null,
    node: null,
    label: null,
    putAnimeOnTreadmill(url) {
        const node = document.createElement("img");
        node.classList.add("anime-on-treadmill");
        node.src = url;
        this.animesTreadmill.append(node);
        setTimeout(function() {
            node.remove();
        }, 20000);
    },
    launch() {
        const node = document.createElement("div");
        node.id = "sync-animation-cont";
        this.node = node;

        const label = document.createElement("span");
        label.classList.add("loader-label");
        label.id = "sync-animation-label";
        node.append(label);
        this.label = label;

        const treadmill = document.createElement("div");
        treadmill.classList.add("treadmill");
        node.append(treadmill);

        const treadmillBg = document.createElement("div");
        treadmillBg.classList.add("treadmill-bg");
        treadmill.append(treadmillBg);

        const animesTreadmill = document.createElement("div");
        animesTreadmill.id = "animes-on-treadmill";
        treadmill.append(animesTreadmill);
        this.animesTreadmill = animesTreadmill;


        setInterval(function() {
            if(animeFetchAnimationRenderer.animesToShow && animeFetchAnimationRenderer.animesToShow.length > 0) {
                animeFetchAnimationRenderer.putAnimeOnTreadmill(animeFetchAnimationRenderer.animesToShow.shift());
            }
        }, 1332);

        renderIn("app-cont", this.node, true);
    },

    setLabel(t) {
        if(this.label) {
            this.label.innerText = t;
        }
    },

    addAnime(url) {
        if(this.animesToShow) {
            this.animesToShow.push(url);
        }
    },

    addAnimes(urls) {
        for(const url of urls) {
            this.addAnime(url);
        }
    },

    close() {
        this.animesToShow = [];
        this.animesTreadmill = null;
        this.label = null;
        this.node.remove();
        this.node = null;
    }
    
};

const scoreUtils = {
    displayScore(score, scoreFormat) {
        let scoreDisplay = "";
        switch (scoreFormat) {
            case CONST.SCORE_FORMAT.POINT_10:
            case CONST.SCORE_FORMAT.POINT_10_DECIMAL:
                scoreDisplay = score + "/10";
                break;
            case CONST.SCORE_FORMAT.POINT_100:
                scoreDisplay = score/10 + "/10";
                break;
            case CONST.SCORE_FORMAT.POINT_5:
                scoreDisplay = score + "/5";
                break;
            case CONST.SCORE_FORMAT.POINT_3:
                switch (score) {
                    case 1:
                        scoreDisplay = ICONS.EMOJIS.NOT_HAPPY
                        break;
                    case 2:
                        scoreDisplay = ICONS.EMOJIS.NEUTRAL;
                        break;
                    case 3:
                        scoreDisplay = ICONS.EMOJIS.HAPPY;
                        break;
                }
                break;
        }
        return scoreDisplay;
    }
}

const dateUtils = {
    getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    },

    filterAnimesFromWeek(animes, weekDate) {
        return animes.filter(anime => {
            return anime.status !== CONST.STATUS.PAUSED && anime.status !== CONST.STATUS.DROPPED && (this.airDuringThisWeek(anime, weekDate) != null);
        })
    },

    getMondayOfCurrentWeek(date) {
        const clone = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        clone.setDate(diff);
        return clone;
    },

    getSundayOfCurrentWeek(date) {
        const clone = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() + 7 - day + (day === 0 ? -7 : 0);
        clone.setDate(diff);
        return clone;
    },

    airDuringThisWeek(anime, weekDate) {
        let airDuringThisWeek = null;
        const weekNumber = this.getWeekNumber(weekDate);
        const mondayOfWeek = this.getMondayOfCurrentWeek(weekDate);
        mondayOfWeek.setHours(0);
        mondayOfWeek.setHours(0);
        const sundayOfWeek = this.getSundayOfCurrentWeek(weekDate);
        sundayOfWeek.setHours(23);
        sundayOfWeek.setMinutes(59);
            if(anime.media.airingSchedule && anime.media.airingSchedule.nodes
                && anime.media.airingSchedule.nodes.length > 1) {
                for (const node of anime.media.airingSchedule.nodes) {
                    const nodeDate = new Date(node.jsDate);
                    if(nodeDate.getFullYear() === weekDate.getFullYear()
                    && this.getWeekNumber(nodeDate) === weekNumber && nodeDate >= mondayOfWeek && nodeDate <= sundayOfWeek) {
                        airDuringThisWeek = nodeDate;
                        break;
                    }
                }
            }
        return airDuringThisWeek;
    },

    formatHourMinutes(date) {
        return `${(date.getHours()<10)?'0':''}${date.getHours()}:${(date.getMinutes()<10)?'0':''}${date.getMinutes()}`
    },

    formatToDatePrintable(date) {
        return date.toLocaleString(undefined, {year: "numeric", month: "long", day: "numeric"})
    },

    formatToMonth(month) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[month];
    },

    formatMinutesIntoDisplay(nbMinutes) {
        const days = Math.floor(nbMinutes / 60 / 24);
        const hours = Math.floor((nbMinutes - (days * 24 * 60)) / 60);
        const minutes = nbMinutes % 60;
        return `${(days > 1) ? days + "d" : ""} ${(hours > 0) ? hours+"h" : ""} ${minutes}min`
    },

    getCurrentYear() {
        return new Date().getFullYear();
    },

    getDateFromALEpoch(epoch) {
        return new Date(epoch * 1000);
    },

    checkSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },

    getNumberOfDaysInMonth(year, month) {
        return new Date(year, month+1, 0).getDate();
    },

    printDateISOithoutHours(date) {
        return date.toLocaleString(undefined, {year: "numeric", month:"numeric", day:"numeric"});
    }
};

const textUtils = {
    trim(text, nbcharacters) {
        return text.substring(0, nbcharacters) + ((text.length > nbcharacters)?"...":"");
    },

    capitalize(text) {
        let words = text.split(" ");
        return words.map(w => w.substring(0, 1).toUpperCase() + w.substring(1).toLowerCase()).join(" ");
    }
}

const animeUtils = {
    getAnimeById(id) {
        let result = animes.filter(a => a.media.id === id);
        if(result && result.length > 0) {
            return result[0];
        }
        return null;
    },

    getAnimesWithIncompleteAiring() {
        return animes.filter(a => a.media.airingSchedule.pageInfo.hasNextPage);
    }
}

const randomUtils = {
    shuffle(l) {
        return l.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }
}

function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}