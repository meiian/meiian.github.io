let intervalAudioTime;
let timeoutPlayback;
let timerTomorrowInterval;

let game =
{
    maxPlaytime: RULES.MAXTIME,
    currentPlaytime: RULES.MAXTIME * RULES.TIMES[0],
    nbTries: 0,
    finished: false,
    musicDuration: 0,
    triesResults: Array(6).fill(TRIES.NOTHING),
    result: -1,
    loadedByStorage: false
};

const musicThumbnail = `https://img.youtube.com/vi/${musicOTD.id}/default.jpg`


/* Call to YT Embed API */

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/* Creating iframe */
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: musicOTD.id,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError,
      }
    });
}

function onPlayerError(event) {
    const error_body = `
        <div class="flex flex-column">
            <span class="text-slightly-large">The YT video cannot be reached.</span>
            <span class="text-slightly-large">It may have been removed from YT.</span>
            <span class="text-muted text-small">Error code: ${event.data}, id: ${musicOTD.id}</span>
        <div>
    `
    createPopupDisplay("Error", error_body, "error");
}

/* On player ready */
function onPlayerReady(event) {
    const play_btn = document.getElementById("play-btn");
    const skip_btn = document.getElementById("skip-button");
    const submit_btn = document.getElementById("submit-button");
    const max_time_display = document.getElementById("max-time");

    // Check if storage exists
    checkIfStorageExists()

    game.musicDuration = event.target.getDuration();

    // If audio time less than game maxPlaytime then reduce maxPlaytime
    if(event.target.getDuration() < RULES.MAXTIME) {
        game.maxPlaytime = event.target.getDuration();
        game.currentPlaytime = event.target.getDuration() * RULES.TIMES[game.nbTries];
    }

    max_time_display.innerText = UTILS.secondsToDisplay(game.currentPlaytime);

    document.getElementById("playback-time-bar-bg").setAttribute("style", `--bg-value: ${RULES.TIMES[game.nbTries]*100}%`)

    // Add play button functionnality
    play_btn.addEventListener("click", function() {
        if(event.target.getPlayerState() == YT.PlayerState.PLAYING) {
            stopAudio(event.target);
        }
        else {
            event.target.playVideo();
            play_btn.innerHTML = ICONS.stop;

            if (!intervalAudioTime) {
                intervalAudioTime = setInterval(checkAudioTime, 10);
            }
        }
        
    })
    play_btn.innerHTML = ICONS.play;

    // Add skip button functionnality
    skip_btn.addEventListener("click", function() {
        skipTry();
    })

    // Add submit button functionnality
    submit_btn.addEventListener("click", function() {
        makeTry();
    })

    UTILS.showNodesByClass("wait-for-player-ready");

    // Check if today game already played
    if (checkIfTodayAlreadyPlayed()) {
        const todayPlay = getTodayPlay();
        game.finished = true;
        game.triesResults = todayPlay.triesResults;
        game.nbTries = todayPlay.nbTries;
        game.loadedByStorage = true;
        showResults();
    }

}

function stopAudio(player) {
    const play_btn = document.getElementById("play-btn");
    player.pauseVideo();
    player.seekTo(0);
    play_btn.innerHTML = ICONS.play;
    clearInterval(intervalAudioTime);
    intervalAudioTime = null;
    clearTimeout(timeoutPlayback);
    timeoutPlayback = null;
    document.getElementById("playback-time-bar").setAttribute("style", `--value: 0%`)
}


/* On player state change */
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        stopAudio(event.target);
    }
}

/* Check audio time */
function checkAudioTime() {
    const currentTime = player.getCurrentTime();
    let duration = player.getDuration();
    if (!game.finished) {
        duration = (player.getDuration()>=RULES.MAXTIME)?RULES.MAXTIME:player.getDuration();
    }
    const pctPlayed = Math.floor((currentTime / duration) * 1000)/10;
    if(currentTime >= game.currentPlaytime) {
        stopAudio(player);
        document.getElementById("current-time").innerText = UTILS.secondsToDisplay(game.currentPlaytime);
    }
    document.getElementById("current-time").innerText = UTILS.secondsToDisplay(Math.floor(player.getCurrentTime()));
    document.getElementById("playback-time-bar").setAttribute("style", `--value: ${pctPlayed}%`)
}

function makeTry() {
    const titleTried = document.getElementById("autoComplete").value;
    let isCorrect = false;

    // Count a try only if title correct
    if(musics_available.find(x => x.title === titleTried)) {
        isCorrect = (musicOTD.title === titleTried);

        if(isCorrect) {
            game.triesResults[game.nbTries] = TRIES.SUCCESS;
            game.nbTries += 1;
            UTILS.clearInput("autoComplete");
            
            showResults()
        }
        else {
            game.triesResults[game.nbTries] = TRIES.FAILED;
            game.nbTries += 1;
            UTILS.clearInput("autoComplete");

            if(game.nbTries > 5) {
                showResults();
            }
            else {
                addTryName(titleTried, TRIES.FAILED, game.nbTries);
                game.currentPlaytime = game.maxPlaytime * RULES.TIMES[game.nbTries];
                document.getElementById("current-time").innerText = UTILS.secondsToDisplay(Math.floor(player.getCurrentTime()));
                document.getElementById("max-time").innerText = UTILS.secondsToDisplay(game.currentPlaytime);
                document.getElementById("playback-time-bar").setAttribute("style", `--value: 0%`)
                document.getElementById("playback-time-bar-bg").setAttribute("style", `--bg-value: ${RULES.TIMES[game.nbTries]*100}%`);
            }
        }
    }
}

/* Skip try */
function skipTry() {
    game.triesResults[game.nbTries] = TRIES.SKIP;
    UTILS.clearInput("autoComplete");
    game.nbTries += 1;
    if(game.nbTries < 6) {
        addTryName("SKIPPED", TRIES.SKIP, game.nbTries);
        game.currentPlaytime = game.maxPlaytime * RULES.TIMES[game.nbTries];
        document.getElementById("current-time").innerText = UTILS.secondsToDisplay(Math.floor(player.getCurrentTime()));
        document.getElementById("max-time").innerText = UTILS.secondsToDisplay(game.currentPlaytime);
        document.getElementById("playback-time-bar").setAttribute("style", `--value: 0%`)
        document.getElementById("playback-time-bar-bg").setAttribute("style", `--bg-value: ${RULES.TIMES[game.nbTries]*100}%`);
    }
    else {
        showResults();
    }
}

function showResults() {
    game.finished = true;

    // Remove game buttons
    UTILS.hideNodesByClass("remove-when-results");

    // Make the player play entire audio
    game.currentPlaytime = game.musicDuration;
    document.getElementById("max-time").innerText = UTILS.secondsToDisplay(game.currentPlaytime);
    document.getElementById("current-time").innerText = UTILS.secondsToDisplay(0);
    document.getElementById("playback-time-bar").setAttribute("style", `--value: 0%`)
    document.getElementById("playback-time-bar-bg").setAttribute("style", `--bg-value: 100%`);

    // Show the results in body
    const app_body = document.getElementById("app-body");
    app_body.innerHTML = "";
    let results_node = document.createElement("a");
    results_node.id = "results";
    results_node.classList.add("flex-between");
    results_node.href = player.getVideoUrl();
    results_node.target = "_blank";
    results_node.innerHTML = `
        <div class="flex flex-center">
            <img class="results-thumbnail" src="${musicThumbnail}">
            <div class="flex flex-column">
                <span>${musicOTD.titleDisplay}</span>
                <span>${musicOTD.game}</span>
            </div>
        </div>
        <div class="flex flex-between youtube-link">
            <span class="flex flex-center yt-icon">${ICONS.youtube}</span><span>YouTube</span>
        </div>
    `
    const tries_display = game.triesResults.map(function(x) {
        let try_class = "try-nothing";
        switch(x) {
            case TRIES.SUCCESS:
                try_class = "try-success";
                break;
            case TRIES.FAILED:
                try_class = "try-failed";
                break;
            case TRIES.SKIP:
                try_class = "try-skipped";
                break;
            default:
                break;
        }
        return `<span class="try-display ${try_class}"></span>`;
    });

    let results_msg = `You didn't get today's ${GAME_NAMES.GAME_TITLE}. Better luck tomorrow!`;
    if(game.triesResults.includes(TRIES.SUCCESS)) {
        game.result = GAME_RESULTS.WON;
        results_msg = `You found today's ${GAME_NAMES.GAME_TITLE} in ${game.nbTries} tr${(game.nbTries>1)?"ies":"y"}. Good job!`;
    }
    else {
        game.result = GAME_RESULTS.LOST;
    }

    let score_node = document.createElement("div");
    score_node.classList.add("flex", "flex-center", "flex-column");
    score_node.id = "score";
    score_node.innerHTML = `
            <div id="tries-display" class="flex">
                ${tries_display.join(" ")}
            </div>
            <div>
                <span>${results_msg}</span>
            </div>
            <div>
                <button id="share-button" onclick="shareResultsToClipboard()">SHARE RESULT</button>
            </div>
    `;

    let next_audio_node = document.createElement("div");
    next_audio_node.innerHTML = `
        <span class="text-muted text-small">Next track in:</span>
        <span id="time-until-next">${UTILS.timeBetweenDates(new Date(), UTILS.getTomorrow())}</span>
    `

    // Add game results to storage
    addGameToStorage();

    // Update stats in storage
    if(!game.loadedByStorage) {
        updateStats();
    }

    app_body.appendChild(results_node);
    app_body.appendChild(score_node);
    app_body.appendChild(next_audio_node);
    if (player.getCurrentTime() > 0) {
        player.seekTo(0);
    }
    else {
        if(!game.loadedByStorage) {
            document.getElementById("play-btn").click();
        }
    }

    timerTomorrowInterval = setInterval(function() {
        document.getElementById("time-until-next").innerText = UTILS.timeBetweenDates(new Date(), UTILS.getTomorrow());
    }, 500)
    
}


function shareResultsToClipboard() {
    const todayTitle = `${GAME_NAMES.GAME_TITLE} - ${today.toLocaleDateString()}`;

    let resultsString = "🔉";
    game.triesResults.forEach(function(x) {
        let square = RESULTS_SHARE.NOTHING;
        switch(x) {
            case TRIES.SUCCESS:
                square = RESULTS_SHARE.SUCCESS;
                break;
            case TRIES.FAILED:
                square = RESULTS_SHARE.FAILED;
                break;
            case TRIES.SKIP:
                square = RESULTS_SHARE.SKIP;
                break;
            default:
                break;
        }
        resultsString += square;
    });

    const lines = [todayTitle, resultsString, GAME_NAMES.HASHTAGS, window.location.href];

    const toClipboard = lines.join("\n\n");

    navigator.clipboard.writeText(toClipboard).then(function() {
        document.getElementById("share-button").innerText = "COPIED!"
    });
}

function createResultsForStorage() {
    let results_for_storage = {
        date: today.toLocaleDateString('en-US'),
        nbTries: game.nbTries,
        result: game.result,
        triesResults: game.triesResults
    }
    return results_for_storage;
}

function addTryName(title, status, index) {
    let try_node = document.getElementById("try-name-" + index);
    switch(status) {
        case TRIES.FAILED:
            try_node.classList.add("try-name-fail");
            break;
        case TRIES.SKIP:
            try_node.classList.add("try-name-skip");
        default:
            break;
    }
    try_node.innerHTML = `<span>${title}</span>`;
    try_node.classList.remove("try-name-active");

    let next_try_node = document.getElementById(`try-name-${index+1}`);
    if(next_try_node) {
        next_try_node.classList.add("try-name-active");
    }
}