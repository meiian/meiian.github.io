const pages = {
    currentPage: null,
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
                animeSelector.reset();
                renderIn("page-cont", tierlistRenderer.getInterface(), true);
                renderIn("page-cont", animeSelector.renderEmpty(), false);
                tierlistRenderer.openTierlist(tierlistRenderer.createDefaultTierlist());
                animeSelector.addOverflowGap();
            },

            warningModal(pageToGo, itemNode) {
                const infoModal = new Modal("Warning", [], true);
                const warningParagraph = document.createElement("div");
                warningParagraph.classList.add("modal-paragraph");
                warningParagraph.innerHTML = `
                    If you leave this page, you will lose your unsaved tierlist.<br>
                    Are you sure you want to leave?
                `;

                const buttons = document.createElement("div");
                buttons.classList.add("modal-buttons");

                const leaveButton = document.createElement("button");
                leaveButton.classList.add("button");
                leaveButton.innerText = "Leave";
                leaveButton.addEventListener("click", function() {
                    infoModal.close();
                    pages.goToPage(pageToGo, itemNode, true);
                })
                buttons.append(leaveButton);

                const stayButton = document.createElement("button");
                stayButton.classList.add("button");
                stayButton.innerText = "Stay";
                stayButton.addEventListener("click", function() {
                    infoModal.close();
                })
                buttons.append(stayButton);

                infoModal.setBody([warningParagraph, buttons]);
                infoModal.render();
            }
        },
        activity: {
            render() {
                statsRenderer.init();
                renderIn("page-cont", statsRenderer.renderPage(), true);
                statsRenderer.scrollToToday();
            }
        },
        wrapped: {
            render() {
                renderIn("page-cont", wip.render(), true);
            }
        },
        card: {
            render() {
                cardRenderer.init();
                renderIn("page-cont", cardRenderer.renderPage(), true);
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

    goToPage(pageToGo, itemNode, fromModal=false) {
        if(!fromModal) {
            switch(this.currentPage) {
                case this.pagesContent.tierlists:
                    if(tierlistRenderer.unsavedContent) {
                        this.currentPage.warningModal(pageToGo, itemNode);
                    } else {
                        pageToGo.render();
                        this.currentPage = pageToGo;
                        if(itemNode) {
                            navbar.itemsNodes.forEach(n => n.classList.remove("active"));
                            itemNode.classList.add("active");
                        }
                    }
                    break;
                default:
                    pageToGo.render();
                    this.currentPage = pageToGo;
                    if(itemNode) {
                        navbar.itemsNodes.forEach(n => n.classList.remove("active"));
                        itemNode.classList.add("active");
                    }
                    break;
            }
        } else {
            pageToGo.render();
            this.currentPage = pageToGo;
            if(itemNode) {
                navbar.itemsNodes.forEach(n => n.classList.remove("active"));
                itemNode.classList.add("active");
            }
        }
    }
}


const wip = {
    render() {
        let node = document.createElement("div");
        node.innerText = "Soon™";
        return node;
    }
}