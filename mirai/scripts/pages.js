const pages = {
    pagesContent : {
        schedule: {
            render() {
                renderIn("page-cont", seasonCalendar.renderEmptyCalendar(), true);
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