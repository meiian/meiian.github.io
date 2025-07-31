let music_list = musics.map(m => m.titleDisplay);
let game_list = [...new Set(musics.map(g => g.game))];

document.addEventListener("DOMContentLoaded", function() {
    const autocompleteMusic = new autoComplete({
        placeHolder: "Music title",
        searchEngine: "loose",
        selector: "#autoComplete-music",
        data: {
            src: music_list,
            cache: false,
        },
        resultItem: {
            highlight: true
        },
        resultsList: {
            maxResults: 5,
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autocompleteMusic.input.value = selection;
                }
            }
        }
    });
    const autocompleteGame = new autoComplete({
        placeHolder: "Game name",
        searchEngine: "loose",
        selector: "#autoComplete-game",
        data: {
            src: game_list,
            cache: true,
        },
        resultItem: {
            highlight: true
        },
        resultsList: {
            maxResults: 5,
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autocompleteGame.input.value = selection;
                    autocompleteMusic.input.disabled = false;
                    autocompleteMusic.input.value = null;
                },
                change : (event) => {
                    if(!game_list.find(x => x === autocompleteGame.input.value)) {
                        autocompleteMusic.input.disabled = true;
                        autocompleteMusic.input.value = null;
                    } else {
                        autocompleteMusic.input.disabled = false;
                        autocompleteMusic.input.value = null;
                        autocompleteMusic.data.src = musics.filter(m => m.game === autocompleteGame.input.value).map(m => m.titleDisplay);
                    }
                }
            }
        }
    })
});
