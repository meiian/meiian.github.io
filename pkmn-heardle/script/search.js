const music_list = musics.map(m => m.title);

document.addEventListener("DOMContentLoaded", function() {
    const autocomplete = new autoComplete({
        placeHolder: "Know it? Search for the artist / title",
        data: {
            src: music_list,
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
                    autocomplete.input.value = selection;
                }
            }
        }
    })
});
