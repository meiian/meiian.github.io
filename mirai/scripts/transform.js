const animeTransform = {
    transform(anime) {
        if(anime.media.airingSchedule.nodes) {
            for(const node of anime.media.airingSchedule.nodes) {
                const jsdate = new Date(0);
                jsdate.setUTCSeconds(node.airingAt);
                node.jsDate = jsdate;
            }
        }
    },

    transformList(animes) {
        for(const anime of animes) {
            this.transform(anime);
        }
    }
}