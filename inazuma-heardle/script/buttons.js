document.addEventListener("DOMContentLoaded", function() {

    /* Buttons definitions */
    const play_btn = document.getElementById("play-btn");
    const stats_btn = document.getElementById("stats-btn");
    const info_btn = document.getElementById("info-btn");

    /* Initialization */
    play_btn.innerHTML = ICONS.wait;
    stats_btn.innerHTML = ICONS.stats;
    info_btn.innerHTML = ICONS.info;

    stats_btn.addEventListener("click", showStats);
    info_btn.addEventListener("click", showInfo);

    UTILS.hideNodesByClass("wait-for-player-ready");
})