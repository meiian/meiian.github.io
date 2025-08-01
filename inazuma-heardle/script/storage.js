function checkIfStorageExists() {
    const previous_games = JSON.parse(localStorage.getItem("previous_games_inazuma"));
    if(previous_games === null) {
        initStorage();
    }
    const stats = JSON.parse(localStorage.getItem("stats_inazuma"));
    if(stats === null) {
        initStatsStorage();
    }
}

function initStorage() {
    localStorage.setItem("previous_games_inazuma", "{}");
}

function initStatsStorage() {
    const stats = {
        nbWinByTries: [0, 0, 0, 0, 0, 0, 0],
        gamePlayed: 0,
        gameWon: 0,
        currentStreak: 0,
        highestStreak: 0
    }
    localStorage.setItem("stats_inazuma", JSON.stringify(stats));
}

function addGameToStorage() {
    let previous_games = JSON.parse(localStorage.getItem("previous_games_inazuma"));
    if(previous_games) {
        const current_game = createResultsForStorage();
        previous_games[current_game.date] = current_game;
        localStorage.setItem("previous_games_inazuma", JSON.stringify(previous_games));
    }
}

function updateStats() {
    const stats = JSON.parse(localStorage.getItem("stats_inazuma"));
    if(stats) {
        stats.gamePlayed++;
        if(game.result === GAME_RESULTS.WON) {
            stats.gameWon++;
            stats.nbWinByTries[game.nbTries] += 1;
            stats.currentStreak += 1;
            if(stats.currentStreak > stats.highestStreak) {
                stats.highestStreak = stats.currentStreak;
            }
        }
        else {
            stats.currentStreak = 0;
            stats.nbWinByTries[0] += 1;
        }

        localStorage.setItem("stats_inazuma", JSON.stringify(stats));
    }
}

function checkIfTodayAlreadyPlayed() {
    if (getTodayPlay()) {
        return true;
    }
    return false;
}

function getTodayPlay() {
    const previous_games = JSON.parse(localStorage.getItem("previous_games_inazuma"));
    let today_game = null;
    if (previous_games) {
        today_game = previous_games[today.toLocaleDateString('en-US')]
    }
    return today_game;
}