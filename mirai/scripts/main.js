let searchResults = null;
let animes = storage.readAnimesCollection();
let userInfos = storage.readUserInfo();

async function whenLoaded() {
    if(userInfos) {
        clearLanding();
        if(!animes) {
            await syncAnimesFromUser(userInfos.name);
            storage.writeAnimesCollection(animes);
        }
        renderIn("app-cont", renderNavBar(userInfos));
        renderIn("nav-bar-profile", profile.renderHoverProfile(userInfos));
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
  whenLoaded();
});
