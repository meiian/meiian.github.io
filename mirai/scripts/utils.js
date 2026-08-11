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
        const sundayOfWeek = this.getSundayOfCurrentWeek(weekDate);
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

    formatMinutesIntoDisplay(nbMinutes) {
        const hours = Math.floor(nbMinutes / 60);
        const minutes = nbMinutes % 60;
        return `${(hours > 0) ? hours+"h" : ""}${minutes}min`
    },

    getCurrentYear() {
        return new Date().getFullYear();
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

function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}