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
}

const dateUtils = {
    getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    },

    filterAnimesFromWeek(animes, weekDate) {
        return animes.filter(anime => {
            let airDuringThisWeek = false;
            if(anime.media.airingSchedule && anime.media.airingSchedule.nodes
                && anime.media.airingSchedule.nodes.length > 1) {
                for (const node of anime.media.airingSchedule.nodes) {
                    const nodeDate = new Date(node.jsDate);
                    if(nodeDate.getFullYear() === weekDate.getFullYear()
                    && this.getWeekNumber(nodeDate) === this.getWeekNumber(weekDate)) {
                        airDuringThisWeek = true;
                        break;
                    }
                }
            }
            return airDuringThisWeek;
        })
    },

    formatHourMinutes(date) {
        return `${(date.getHours()<10)?'0':''}${date.getHours()}:${(date.getMinutes()<10)?'0':''}${date.getMinutes()}`
    }
}