const pages = {
    pagesContent : {
        schedule: {
            render() {
                renderIn("page-cont", seasonCalendar.renderEmptyCalendar(), true);
                let today = new Date();
                seasonCalendar.addAnimes(dateUtils.filterAnimesFromWeek(animes, today), today);
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