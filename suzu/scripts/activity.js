const statsRenderer = {
    container: null,
    menu: null,
    menuLabel: null,
    body: null,
    maxMonth: 0,
    maxYear: 0,
    activeMonthMenuNode: null,
    activeMonthIndicator: [],
    activeMonthsId: [],
    previousMonthId: -1,

    observer: new IntersectionObserver((entiers, observer) => {
            entiers.forEach(entry => {
                if(entry.isIntersecting) {
                        statsRenderer.activeMonthIndicator[entry.target.getAttribute("mindex")] = true;
                        //statsRenderer.showDaysOfMonth();
                } else {
                        statsRenderer.activeMonthIndicator[entry.target.getAttribute("mindex")] = false;
                        //statsRenderer.hideDaysOfPastMonth();
                } 
                statsRenderer.showDaysOfMonth();
            })
        }, {root: null, rootMargin: "0px", threshold:0}),

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

        this.renderNav();
        this.renderFullActivities();
        
        
        return node;
    },

    renderNav() {
        const left = document.createElement("div");
        left.classList.add("stats-menu-actions");
        const bigup = document.createElement("button");
        bigup.innerHTML = ICONS.DOUBLEUPARROW;
        bigup.addEventListener("click", function() {
            statsRenderer.scrollToBeginning();
        })
        left.append(bigup);
        const up = document.createElement("button");
        up.innerHTML = ICONS.UPARROW;
        up.addEventListener("click", function() {
            statsRenderer.scrollUp();
        })
        left.append(up);
        this.menu.append(left);

        const label = document.createElement("div");
        label.id = "stats-menu-label";
        this.menuLabel = label;
        this.menu.append(label);

        const right = document.createElement("div");
        right.classList.add("stats-menu-actions");
        const down = document.createElement("button");
        down.innerHTML = ICONS.DOWNARROW;
        down.addEventListener("click", function() {
            statsRenderer.scrollDown();
        })
        right.append(down);
        const bigdown = document.createElement("button");
        bigdown.innerHTML = ICONS.DOUBLEDOWNARROW;
        bigdown.addEventListener("click", function() {
            statsRenderer.scrollToToday();
        })
        right.append(bigdown);
        this.menu.append(right);
    },

    renderFullActivities() {
        const firstActivityDate = dateUtils.getDateFromALEpoch(Math.min(...activities.map(x => x.createdAt)));
        let squares = [];

        for(let y = firstActivityDate.getFullYear(); y <= this.maxYear; y++) {
            for(let m = 0; m <= 11; m++) {
                if(y === firstActivityDate.getFullYear() && m < firstActivityDate.getMonth()) {
                    continue;
                }
/*                 if(y === firstActivityDate.getFullYear() && m === firstActivityDate.getMonth()) {
                    this.fillEmptyStart(y, m);
                } */
                squares.push(...this.renderMonthActivities(y, m, (y === firstActivityDate.getFullYear() && m === firstActivityDate.getMonth())));
                if(y === this.maxYear && m === this.maxMonth) {
                    break;
                }
            }
        }

        this.fillBody(squares);
    },

    fillBody(squares) {
        for(let i = 0; i < squares.length; i += 7) {
            const row = squares.slice(i, i + 7);
            this.body.append(this.createRow(row));
        }
    },

    createRow(squares) {
        const node = document.createElement("div");
        node.classList.add("stats-body-row");
        node.append(...squares);
        return node;
    },

    fillEmptyStart(year, month) {
        let firstDayOfMonth = new Date(year, month, 1).getDay();
        if(firstDayOfMonth === 0) {
            firstDayOfMonth = 7;
        }
        let squares = [];
        for(let i = 0; i < firstDayOfMonth-1; i++) {
            const square = document.createElement("div");
            square.classList.add("stats-activities-day");
            square.classList.add("placeholder")
            squares.push(square);
        }
        return squares;
    },

    renderMonthActivities(year, month, isFirstMonth) {
        let squares = [];
        if(isFirstMonth) {
            squares.push(...this.fillEmptyStart(year, month));
        }
        const nbDaysInMonth = dateUtils.getNumberOfDaysInMonth(year, month);
        for(let i = 0; i < nbDaysInMonth; i++) {
            const square = document.createElement("div");
            square.classList.add("stats-activities-day");
                const day = new Date(year, month, i+1);
                const dayLabel = document.createElement("span");
                dayLabel.innerText = i+1;
                dayLabel.classList.add("stats-activities-day-label");
                square.append(dayLabel);
                square.classList.add(this.calculateIdMonth(year, month));
                const squareBody = document.createElement("div");
                squareBody.classList.add("stats-activities-day-body");

                if(i == 0) {
                    square.id = this.calculateIdMonth(year, month);
                    square.setAttribute("mindex", this.activeMonthIndicator.length);
                    this.activeMonthIndicator.push(false);
                    this.activeMonthsId.push(this.calculateIdMonth(year, month));
                    this.observeFirstDayOfMonth(square);
                }

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
        
            squares.push(square);
        }    
        return squares;
    },

    scrollToBeginning() {
        const el = document.getElementById(this.activeMonthsId[0]);
        el.scrollIntoView();
    },

    scrollUp() {
        if(this.getMonthToShow() > 0) {
            const el = document.getElementById(this.activeMonthsId[this.getMonthToShow() - 1]);
            el.scrollIntoView({behavior: "smooth"});
        }
    },

    scrollDown() {
        if(this.getMonthToShow() < this.activeMonthsId.length - 1) {
            const el = document.getElementById(this.activeMonthsId[this.getMonthToShow() + 1]);
            el.scrollIntoView({behavior: "smooth"});
        }
    },

    scrollToToday() {
        const el = document.getElementById(this.activeMonthsId[this.activeMonthsId.length - 1]);
        el.scrollIntoView();
    },

    calculateIdMonth(year, month) {
        return `${dateUtils.formatToMonth(month)}-${year}`;
    },

    observeFirstDayOfMonth(element) {
        this.observer.observe(element);
    },

    showDaysOfMonth() {
        this.hideDaysOfPastMonth();
        this.previousMonthId = this.getMonthToShow();
        const className = this.activeMonthsId[this.getMonthToShow()];
        const squares = document.getElementsByClassName(className);
        for(const square of squares) {
            square.classList.add("active");
        }
        this.changeMenuLabel(className);
    },

    hideDaysOfPastMonth() {
        if(this.previousMonthId >= 0) {
            const className = this.activeMonthsId[this.previousMonthId];
            const oldActives = document.getElementsByClassName(className);
            for(const oldActive of oldActives) {
                oldActive.classList.remove("active");
            }
        }
    },

    getMonthToShow() {
        return this.activeMonthIndicator.indexOf(true);
    },

    changeMenuLabel(label) {
        if(label) {
            this.menuLabel.innerText = label.replaceAll("-", " ");
        }
    }
}