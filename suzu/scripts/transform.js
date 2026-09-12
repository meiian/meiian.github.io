const animeTransform = {
    transformAiring(nodes) {
        for(const node of nodes) {
            const jsdate = new Date(0);
            jsdate.setUTCSeconds(node.airingAt);
            node.jsDate = jsdate;
        }
    },
    
    transform(anime) {
        if(anime.media.airingSchedule.nodes) {
            this.transformAiring(anime.media.airingSchedule.nodes);
        }
    },

    transformList(animes) {
        for(const anime of animes) {
            this.transform(anime);
        }
    }
}