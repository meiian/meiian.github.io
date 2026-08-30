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

async function resyncUser(name, activitiesFullSync=false) {
    renderIn("app-cont", document.createElement("div"), true);
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
    storage.writeUserInfo(userInfos);
    await syncAnimesFromUser(userInfos.name);
    storage.writeAnimesCollection(animes);
    if(userInfos) {
        await syncActivitesFull(userInfos.id);
    }
    window.location.reload();
}

function clearLanding() {
    document.getElementById("landing-page").remove();
}