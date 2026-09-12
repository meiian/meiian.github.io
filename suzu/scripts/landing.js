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
    animeFetchAnimationRenderer.setLabel("Fetching anime entries...");
    while (!finishedSync) {
        const currentPage = await fetchPageOfAnimeListByUser(userName, pageIndex);
        if (!currentPage || currentPage.length < 1) {
            finishedSync = true;
        } else {
            animes.push(...currentPage);
            animeFetchAnimationRenderer.addAnimes(randomUtils.shuffle(currentPage.map(a => a.media.coverImage.large)));
            pageIndex++;
        }
    }

    let incompleteAiring = animeUtils.getAnimesWithIncompleteAiring();
    for(const anime of incompleteAiring) {
        const airingSchedule = await fetchAllAiringScheduleOfAnime(anime.media.id);
        anime.media.airingSchedule.nodes = airingSchedule;
    }

    storage.writeAnimesCollection(animes);
}

async function resyncUser(name, activitiesFullSync=false) {
    animeFetchAnimationRenderer.launch();
    animeFetchAnimationRenderer.setLabel("...");
    let userInfos = await fetchUserInfo(name);
    storage.writeUserInfo(userInfos);
    await syncAnimesFromUser(name);
    if(userInfos) {
        if(activitiesFullSync) {
            await syncActivitesFull(userInfos.id);
        } else {
            await syncActivitesFromLastSync(userInfos.id);
        }
    }
    animeFetchAnimationRenderer.close();
    window.location.reload();
}

function showActivitiesSyncModal(name) {
    const infoModal = new Modal("Activity Sync", []);
    const explaination = document.createElement("div");
    explaination.classList.add("modal-paragraph");
    explaination.innerHTML = `Do you want to synchronize your activity since last sync? Or would you rather erase and resync all your activity?`

    const buttons = document.createElement("div");
    buttons.classList.add("modal-buttons");

    const partialButton = document.createElement("button");
    partialButton.classList.add("button");
    partialButton.innerText = "Since last time";
    partialButton.addEventListener("click", function() {
        infoModal.close();
        resyncUser(name, false);
    })
    buttons.append(partialButton);

    const fullButton = document.createElement("button");
    fullButton.classList.add("button");
    fullButton.innerText = "Erase and resync";
    fullButton.addEventListener("click", function() {
        infoModal.close();
        resyncUser(name, true);
    })
    buttons.append(fullButton);

    infoModal.setBody([explaination, buttons]);
    infoModal.render();
    return infoModal;
}

async function syncActivitesFromLastSync(userId) {
    let fullActivities = storage.readActivities();
    let today = new Date();
    // One month before
    let epochSince = Math.round((today.getTime() - 2678400000) / 1000);
    if(!fullActivities) {
        fullActivities = [];
    } else {
        epochSince = Math.max(...fullActivities.map(a => a.createdAt)) 
    }
    const newActivities = await fetchActivitySince(userId, epochSince);
    fullActivities.push(...newActivities);
    storage.writeActivities(fullActivities);
    activities = fullActivities;
}

async function syncActivitesFull(userId) {
    let epochSince = 0;
    const newActivities = await fetchActivitySince(userId, epochSince);
    storage.writeActivities(newActivities);
    activities = newActivities;
}

function logout() {
    storage.clearAllStorage();
    window.location.reload();
}

async function confirmUser() {
    animeFetchAnimationRenderer.launch();
    animeFetchAnimationRenderer.setLabel("...");
    storage.writeUserInfo(userInfos);
    await syncAnimesFromUser(userInfos.name);
    storage.writeAnimesCollection(animes);
    if(userInfos) {
        await syncActivitesFull(userInfos.id);
    }
    animeFetchAnimationRenderer.close();
    window.location.reload();
}

function clearLanding() {
    document.getElementById("landing-page").remove();
}