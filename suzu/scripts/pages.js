const pages = {
    pagesContent : {
        schedule: {
            render() {
                renderIn("page-cont", seasonCalendar.renderEmptyCalendar(), true);
                let today = new Date();
                renderIn("page-cont", seasonCalendar.renderWeekSelector(today));
                seasonCalendar.addAnimes(dateUtils.filterAnimesFromWeek(animes, today));
            }
        },
        tierlists: {
            render() {
                tierlistRenderer.init();
                tierlistRenderer.openTierlist(tierlistRenderer.createDefaultTierlist());
                renderIn("page-cont", tierlistRenderer.getInterface(), true);
                renderIn("page-cont", animeSelector.renderEmpty(), false);
                animeSelector.addOverflowGap();
            }
        },
        activity: {
            render() {
                statsRenderer.init();
                renderIn("page-cont", statsRenderer.renderPage(), true);
                statsRenderer.scrollToToday();
            }
        },
        stats: {
            render() {
                renderIn("page-cont", wip.render(), true);
            }
        },
        settings: {
            render() {
                renderIn("page-cont", globalSettings.renderPage(), true);
            }
        }
    },


    initPageCont() {
        let node = document.createElement("div");
        node.id = "page-cont";
        
        return node;
    },

    goToPage(pageName) {
        this.pagesContent[pageName].render();
    }
}


const wip = {
    render() {
        let node = document.createElement("div");
        node.innerText = "Soon™";
        return node;
    }
}