async function syncNewUser(e) {
    if(event.key === 'Enter') {
        animes = [];
        const userName = document.getElementById("landing-username-field").value;

        userInfos = await fetchUserInfo(userName);
        document.getElementById("landing-page-form").append(profile.renderWithStats(userInfos));
        document.getElementById("landing-page-form").append(renderConfirmUser());
    }
}


async function syncAnimesFromUser(userName) {
    let finishedSync = false;
    let pageIndex = 1;
    animes = [];
    while (!finishedSync) {
        const currentPage = await fetchPageOfAnimeListByUser(userName, pageIndex);
        if (!currentPage || currentPage.length < 1) {
            finishedSync = true;
        } else {
            animes.push(...currentPage);
            pageIndex++;
        }
    }


    storage.writeAnimesCollection(animes);
}

async function resyncUser(name) {
    let userInfos = await fetchUserInfo(name);
    storage.writeUserInfo(userInfos);
    await syncAnimesFromUser(name);
    window.location.reload();
}

async function confirmUser() {
    storage.writeUserInfo(userInfos);
    await syncAnimesFromUser(userInfos.name);
    storage.writeAnimesCollection(animes);
    window.location.reload();
}

function clearLanding() {
    document.getElementById("landing-page").remove();
}