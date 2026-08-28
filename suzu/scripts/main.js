let searchResults = null;
let animes = storage.readAnimesCollection();
let userInfos = storage.readUserInfo();

async function whenLoaded() {
    globalSettings.init();
    if(userInfos) {
        clearLanding();
        if(!animes) {
            await syncAnimesFromUser(userInfos.name);
            storage.writeAnimesCollection(animes);
        }
        renderIn("app-cont", navbar.render(userInfos));
        renderIn("app-cont", pages.initPageCont());
        pages.goToPage("schedule");
        sidePanel.renderEmpty();
        const lastVersion = storage.readLastVersion();
        if(lastVersion) {
            changelog.lastVersion = lastVersion;
            changelog.renderNewVersionsSince();
        }
        storage.writeLastVersion(CONST.VERSION);
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
  whenLoaded();
});
