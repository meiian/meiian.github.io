const statsRenderer = {
    container: null,
    menu: null,
    body: null,
    maxMonth: 0,
    maxYear: 0,
    activeMonthMenuNode: null,

    init() {
        const today = new Date();
        this.maxMonth = today.getMonth();
        this.maxYear = today.getFullYear();
    },

    renderPage() {
        const node = document.createElement("div");
        node.id = "stats-page-cont";
        this.container = node;

        const body = document.createElement("div");
        body.id = "stats-body";
        this.body = body;
        node.append(body);

        const menu = document.createElement("div");
        menu.id = "stats-menu";
        this.menu = menu;
        node.append(menu);

        const today = new Date();
        const maxMonth = today.getMonth();
        const maxYear = today.getFullYear();

        for(let y = 2020; y <= maxYear; y++) {
            for(let m = 0; m <= 11; m++) {
                this.renderActivities(y, m);
                if(y === maxYear && m === maxMonth) {
                    break;
                }
            }
        }
        
        return node;
    },

    addToMenuAndBody(node, title, menuId) {
        const navItem = document.createElement("div");
        navItem.classList.add("stats-menu-item");
        navItem.innerText = title;
        navItem.id = menuId;
        navItem.addEventListener("click", function(e) {
            node.scrollIntoView({behavior: "smooth"});
            navItem.classList.add("active");
            if(statsRenderer.activeMonthMenuNode && statsRenderer.activeMonthMenuNode !== navItem) {
                statsRenderer.activeMonthMenuNode.classList.remove("active");
            }
            statsRenderer.activeMonthMenuNode = navItem;
        })

        this.menu.append(navItem);

        this.body.append(node);
    },

    renderActivities(year, month) {
        const node = document.createElement("div");
        node.classList.add("stats-activities-month");
        const nbDaysInMonth = dateUtils.getNumberOfDaysInMonth(year, month);
        let firstDayOfMonth = new Date(year, month, 1).getDay();
        if(firstDayOfMonth === 0) {
            firstDayOfMonth = 7;
        }

        let nbRows = (firstDayOfMonth >= 6 && nbDaysInMonth >= 30 || firstDayOfMonth == 7 && nbDaysInMonth == 31) ? 6 : 5;
        // Feb month when starting monday
        if(firstDayOfMonth == 1 && nbDaysInMonth == 28) {
            nbRows = 4;
        }
        node.style.gridTemplateRows = `repeat(${nbRows}, ${100 / nbRows}%)`

        for(let i = 0; i < nbRows*7; i++) {
            const square = document.createElement("div");
            square.classList.add("stats-activities-day");
            const dayIndex = i + 1 - (firstDayOfMonth - 1);
            if(dayIndex <= nbDaysInMonth && dayIndex >= 1) {
                const day = new Date(year, month, dayIndex);
                square.classList.add("trueday");
                const dayLabel = document.createElement("span");
                dayLabel.innerText = dayIndex;
                dayLabel.classList.add("stats-activities-day-label");
                square.append(dayLabel);
                const squareBody = document.createElement("div");
                squareBody.classList.add("stats-activities-day-body");

                let activitiesOfDay = activities.filter(a => a.status && a.status !== "plans to watch"
                    && dateUtils.checkSameDay(day, dateUtils.getDateFromALEpoch(a.createdAt)));
                for (const activityOfDay of activitiesOfDay) {
                    const anim = animeUtils.getAnimeById(activityOfDay.media.id);
                    if(anim) {
                        const animeNode = document.createElement("div");
                        animeNode.classList.add("stats-activities-day-anime");
                        const animeCover = document.createElement("img");
                        animeCover.classList.add("stats-activities-day-anime-cover");
                        animeCover.src = anim.media.coverImage.large;
                        animeNode.append(animeCover);
                        const animeBody = document.createElement("div");
                        animeBody.classList.add("stats-activities-day-anime-body");
                        const animeTitle = document.createElement("span");
                        animeTitle.classList.add("stats-activities-day-anime-body-title");
                        animeTitle.innerText = (anim.media.title.english) ? anim.media.title.english : anim.media.title.romaji;
                        animeBody.append(animeTitle);
                        if(activityOfDay.progress) {
                            animeTitle.classList.add("hover-hide");
                            const animeEps = document.createElement("span");
                            animeEps.classList.add("stats-activities-day-anime-body-eps");
                            animeEps.innerText = (activityOfDay.progress)?"Ep. "+activityOfDay.progress:"";
                            animeBody.append(animeEps);
                        }
                        animeNode.append(animeBody);
                        animeNode.addEventListener("click", function() {
                            sidePanel.showAnimeDetails(anim);
                        })
                        squareBody.append(animeNode);
                    }
                }
                square.append(squareBody);
            } else {
                square.classList.add("placeholder");
            }
        
            node.append(square);
        }


        const menuLabel = dateUtils.formatToMonth(month) + " " + year;
        const menuId = "menu" + month + year;
        this.addToMenuAndBody(node, menuLabel, menuId);        
    },

    scrollToToday() {
        const menuMonth = document.getElementById("menu" + this.maxMonth + this.maxYear);
        menuMonth.scrollIntoView();
        menuMonth.click();
    }
}