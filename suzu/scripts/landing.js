let syncChoices = {
    userInfo: false,
    animeList: false,
    activities: {
        sinceLastTime: false,
        full: false
    }
}

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
    const oldAnimes = animes;
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
        const oldAnime = oldAnimes.filter(a => a.media.id === anime.media.id)[0];
        let firstPageToFetch = 1;
        if(oldAnime && oldAnime.media.airingSchedule && oldAnime.media.airingSchedule.nodes) {
            const nbNodes = oldAnime.media.airingSchedule.nodes.length;
            firstPageToFetch = Math.floor((nbNodes / 25) + 1);
            anime.media.airingSchedule.nodes = oldAnime.media.airingSchedule.nodes;
        }
        const airingSchedule = await fetchAllAiringScheduleOfAnime(anime.media.id, firstPageToFetch);
        anime.media.airingSchedule.nodes = anime.media.airingSchedule.nodes.slice(0, (firstPageToFetch - 1)*25).concat(airingSchedule);
    }

    storage.writeAnimesCollection(animes);
}

async function resyncUser(name) {
    animeFetchAnimationRenderer.launch();
    animeFetchAnimationRenderer.setLabel("...");
    if(syncChoices.userInfo) {
        userInfos = await fetchUserInfo(name);
        storage.writeUserInfo(userInfos);
    }
    if(syncChoices.animeList) {
        await syncAnimesFromUser(name);
    }
    
    if(userInfos) {
        if(syncChoices.activities.full) {
            await syncActivitesFull(userInfos.id);
        } else if (syncChoices.activities.sinceLastTime) {
            await syncActivitesFromLastSync(userInfos.id);
        }
    }
    animeFetchAnimationRenderer.close();
    window.location.reload();
}

function showSyncModal(name) {
    const infoModal = new Modal("Sync", []);
    const explaination = document.createElement("div");
    explaination.classList.add("modal-paragraph");
    explaination.innerHTML = `Choose any of the following data type to synchronize:`

    const choices = document.createElement("div");
    choices.classList.add("checklist");

    const choicesList = [
        {
            name: "User profile and settings",
            description: "When you modified your profile or AniList user settings.",
            time: "Very short",
            id: "userInfo",
            options: null,
            icon: ICONS.PERSON
        },
        {
            name: "Animes in your list",
            description: "When you added/edited anime in your list or if an anime doesn't show in schedule.",
            time: "May be long if you have lots of animes in your list",
            id: "animeList",
            options: null,
            icon: ICONS.SCHEDULE
        },
        {
            name: "Activity",
            description: "When you watched anime since last sync.",
            time: "Short if sync since last time, very long if full sync",
            id: "activities",
            options: [
                {
                    name: "Since last time",
                    id: "sinceLastTime"
                },
                {
                    name: "Full sync",
                    id: "full"
                }
            ],
            icon: ICONS.WRITING
        }
    ]

    for(choiceOption of choicesList) {
        const choice = document.createElement("div");
        choice.classList.add("choice");
        choice.setAttribute("option", choiceOption.id);

        const iconBg = document.createElement("div");
        iconBg.innerHTML = choiceOption.icon;
        iconBg.classList.add("choice-icon-bg");
        choice.append(iconBg);

        if(choiceOption.options === null) {
            choice.addEventListener("click", function(e) {
                if(choice.classList.contains("active")) {
                    syncChoices[e.currentTarget.getAttribute("option")] = false;
                    choice.classList.remove("active");
                } else {
                    syncChoices[e.currentTarget.getAttribute("option")] = true;
                    choice.classList.add("active");
                }
            })
        }

        const choiceBody = document.createElement("div");
        choiceBody.classList.add("choice-body");
        const choiceName = document.createElement("span");
        choiceName.classList.add("choice-name");
        choiceName.innerText = choiceOption.name;
        choiceBody.append(choiceName);
        const choiceDesc = document.createElement("span");
        choiceDesc.classList.add("choice-description");
        choiceDesc.innerText = choiceOption.description;
        choiceBody.append(choiceDesc);
        const choiceTime = document.createElement("span");
        choiceTime.classList.add("choice-time");
        choiceTime.innerText = "Estimated time: " + choiceOption.time;
        choiceBody.append(choiceTime);
        choice.append(choiceBody);

        if(choiceOption.options) {
            choice.classList.add("not-active");
            const optionsBody = document.createElement("div");
            optionsBody.classList.add("choice-options");

            for(option of choiceOption.options) {
                const optionNode = document.createElement("div");
                optionNode.classList.add("choice-option");
                optionNode.innerText = option.name;
                optionNode.id = choiceOption.id + option.id;
                optionNode.setAttribute("option", option.id);
                optionNode.addEventListener("click", function(e) {
                    for(optionToDisable of choiceOption.options) {
                        if(optionToDisable.id === e.currentTarget.getAttribute("option")) {
                            continue;
                        }
                        syncChoices[choiceOption.id][optionToDisable.id] = false;
                        const nodeToDisable = document.getElementById(choiceOption.id + optionToDisable.id);
                        if(nodeToDisable) {
                            nodeToDisable.classList.remove("active");
                        }
                    }
                    if(optionNode.classList.contains("active")) {
                        syncChoices[choiceOption.id][e.currentTarget.getAttribute("option")] = false;
                        optionNode.classList.remove("active");
                    } else {
                        syncChoices[choiceOption.id][e.currentTarget.getAttribute("option")] = true;
                        optionNode.classList.add("active");
                    }
                })
                optionsBody.append(optionNode);
            }
            choice.append(optionsBody);
        }

        choices.append(choice);  
    }


    const buttons = document.createElement("div");
    buttons.classList.add("modal-buttons");

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", function() {
        infoModal.close();
    })
    buttons.append(cancelButton);

    const okBouton = document.createElement("button");
    okBouton.classList.add("button");
    okBouton.innerText = "OK";
    okBouton.addEventListener("click", function() {
        infoModal.close();
        resyncUser(name);
    })
    buttons.append(okBouton);

    infoModal.setBody([explaination, choices, buttons]);
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