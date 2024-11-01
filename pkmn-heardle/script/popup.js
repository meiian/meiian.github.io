function showStats() {
    const stats = JSON.parse(localStorage.getItem("stats"));

    const graph_games_by_tries = stats.nbWinByTries.map(function(x, index) {
        return `
            <div class="graph-vertical-bar-cont ${(index<1)?"graph-vertical-bar-error":""}">
                <span class="graph-vertical-label">${x}</span>
                <div class="graph-vertical-bar" style="--value: ${Math.round(x/Math.max(...stats.nbWinByTries)*100)}%"></div>
                <span class="graph-vertical-label">${(index<1)?"X":(index+'°')}</span>
            </div>
        `
    })

    const win_rate = Math.round(stats.gameWon / stats.gamePlayed * 10000) / 100;

    const stats_body = `
        <div class="graph-vertical-cont">
            ${graph_games_by_tries.slice(1, 7).join("")}
            ${graph_games_by_tries[0]}
        </div>
        <div class="flex flex-evenly row stats-row">
            <div class="one-stat-number">
                <span class="one-stat-bold">${stats.gamePlayed}</span>
                <span>Played</span>
            </div>
            <div class="one-stat-number">
                <span class="one-stat-bold">${stats.gameWon}</span>
                <span>Won</span>
            </div>
            <div class="one-stat-number">
                <span class="one-stat-bold">${win_rate}%</span>
                <span>Win rate</span>
            </div>
        </div>
        <div class="flex flex-evenly row stats-row">
            <div class="one-stat-number">
                <span class="one-stat-bold">${stats.currentStreak}</span>
                <span>Current streak</span>
            </div>
            <div class="one-stat-number">
                <span class="one-stat-bold">${stats.highestStreak}</span>
                <span>Highest streak</span>
            </div>
        </div>
    `;

    createPopupDisplay("Stats", stats_body, "stats");
}

function showInfo() {

    const info_body = `
        <div class="flex flex-column">
            <span class="text-slightly-large">Original Heardle concept by <a href="https://omakase.studio/">Studio Omakase</a></span>
            <span class="text-slightly-large">Serverless recreation with YT videos by <a href="https://mstdn.shalyu.run/@Akane">Akane</a></span>
            <span class="text-muted text-small">Created using <a href="https://icons.getbootstrap.com/">Bootstrap Icons</a>, 
            <a href="https://developers.google.com/youtube/iframe_api_reference/">YouTube iframe API</a>, 
            <a href="https://tarekraafat.github.io/autoComplete.js/#/">autocomplete.js</a>.</span>
        <div>
    `

    createPopupDisplay("About", info_body, "about");
}

function createPopupDisplay(title, body, id) {
    const popup = document.getElementById("popup");
    let popup_display_node = document.createElement("div");
    popup_display_node.id = id;
    popup_display_node.classList.add("popup-display");
    popup_display_node.innerHTML = `
        <span class="popup-display-title">${title}</span>
        <div class="popup-body">
            ${body}
        </div>
    `
    popup.append(popup_display_node);
    showPopup();
}

function showPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = null;
    popup.addEventListener("click", function(e) {
        if(e.target !== e.currentTarget) {
            return;
        }
        hidePopup();
    })
}

function hidePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
    popup.innerHTML = '';
}