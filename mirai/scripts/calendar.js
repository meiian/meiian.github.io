const seasonCalendar = {
    calendarNode: null,
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    renderEmptyCalendar() {
        let node = document.createElement("div");
        node.classList.add("calendar-cont");

        let index = 1;
        for(const day of this.days) {
            let dayNode = document.createElement("div");
            dayNode.classList.add("calendar-day");

            let dayLabelNode = document.createElement("span");
            dayLabelNode.classList.add("calendar-day-label");
            dayLabelNode.innerText = day;
            dayNode.append(dayLabelNode);

            let dayBodyNode = document.createElement("div");
            dayBodyNode.id = "day-" + index + "-body";
            dayBodyNode.classList.add("calendar-day-body");
            dayNode.append(dayBodyNode);

            node.append(dayNode);
            index = (index + 1) % 7;
        }

        this.calendarNode = node;

        return node;
    },

    addAnime(anime, date) {
        let node = document.createElement("div");
        node.classList.add("calendar-day-body-hour");
        node.style.setProperty("--position", this.calculatePositionFromHour(date));

        let animeNode = document.createElement("div");
        animeNode.classList.add("calendar-day-body-hour-anime");

        let bgNode = document.createElement("div");
        bgNode.classList.add("calendar-day-body-hour-anime-bg");
        if(anime.media.coverImage) {
            bgNode.style.backgroundImage = `url(${anime.media.coverImage.large})`;
        }
        animeNode.appendChild(bgNode);

        let labelNode = document.createElement("div");
        labelNode.classList.add("calendar-day-body-hour-anime-label");

        let hourNode = document.createElement("span");
        hourNode.classList.add("calendar-day-body-hour-label-hour");
        hourNode.innerText = dateUtils.formatHourMinutes(date);
        labelNode.appendChild(hourNode);

        let titleNode = document.createElement("span");
        titleNode.classList.add("calendar-day-body-hour-label-title");
        if(anime.media.title.english) {
            titleNode.innerText = anime.media.title.english;
        } else {
            titleNode.innerText = anime.media.title.romaji;
        }      
        labelNode.appendChild(titleNode);
        animeNode.appendChild(labelNode);
        node.appendChild(animeNode);

        document.getElementById(`day-${date.getDay()}-body`).appendChild(node);
        
    },

    calculatePositionFromHour(date) {
        const minutes = (date.getHours()*60) + date.getMinutes();
        const position = Math.round((minutes * 100 / 1440));
        return position + '%';
    }
}