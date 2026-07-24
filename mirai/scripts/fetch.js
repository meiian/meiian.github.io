const url = 'https://graphql.anilist.co/';

/**
 * Search animes by title.
 * @param {String} title 
 * @returns {Object} results
 */
async function anilistSearch(title) {
    const query = JSON.stringify(
    {
        query: `query ($search: String, $type: MediaType, $perPage: Int, $page: Int) {
            Page(perPage: $perPage, page: $page) {
                media(search: $search, type: $type) {
                    id
                    title {
                        romaji
                        english
                    }
                    coverImage {
                        large
                    }
                }
            }
        }`,
        variables: {
            search:title,
            type:"ANIME",
            perPage:50,
            page:1
        }
    });

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: query
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Returns one page of animes in the user list.
 * @param {String} userName 
 * @param {Number} pageNumber 
 * @returns {Array} page of animes in user list
 */
async function fetchPageOfAnimeListByUser(userName, pageNumber) {
const query = JSON.stringify(
    {
        query: `query Query($page: Int, $perPage: Int, $userName: String, $type: MediaType, $isMain: Boolean) {
            Page(page: $page, perPage: $perPage) {
                mediaList(userName: $userName, type: $type) {
                    media {
                        id
                        title {
                            romaji
                            english
                        }
                        bannerImage
                        averageScore
                        description
                        duration
                        episodes
                        season
                        seasonYear
                        studios(isMain: $isMain) {
                            nodes {
                                name
                            }
                        }
                        externalLinks {
                            color
                            icon
                            site
                            siteId
                            type
                            url
                        }
                        rankings {
                            allTime
                            context
                            rank
                            season
                            type
                            format
                            year
                        }
                        coverImage {
                            large
                        }
                        airingSchedule {
                            nodes {
                                episode
                                airingAt
                            }
                        }
                    }
                    status
                    score
                    progress
                    updatedAt
                }
            }
        }`,
        variables: {
            userName: userName,
            type:"ANIME",
            perPage:50,
            page:pageNumber,
            isMain: true
        }
    });

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: query
    };

    try {
        spinner.show("Fetching anime entries...");
        const response = await throttleFetch(url, options);
        const responseObject = await response.json();
        let medias = [];

        if(responseObject.data && responseObject.data.Page && responseObject.data.Page.mediaList) {
            medias = responseObject.data.Page.mediaList;
        }
        spinner.hide();
        animeTransform.transformList(medias)

        return medias;
    } catch (error) {
        console.error(error);
        spinner.hide();
    }
}


/**
 * Returns user info.
 * @param {String} userName 
 * @returns {Object} user info
 */
async function fetchUserInfo(userName) {
const query = JSON.stringify(
    {
        query: `query Query($name: String) {
                    User(name: $name) {
                        avatar {
                            medium
                        }
                        bannerImage
                        id
                        name
                        options {
                            profileColor
                            titleLanguage
                            timezone
                        }
                        statistics {
                            anime {
                                meanScore
                                minutesWatched
                                count
                                episodesWatched
                            }
                        }
                    }
                }`,
        variables: {
            name: userName,
        }
    });

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: query
    };

    try {
        spinner.show("Fetching user info...");
        const response = await throttleFetch(url, options);
        const responseObject = await response.json();
        let userInfos = null;

        if(responseObject.data && responseObject.data.User) {
            userInfos = responseObject.data.User
        }

        spinner.hide();
        return userInfos;
    } catch (error) {
        console.error(error);
        spinner.hide();
    }
}

async function throttleFetch(url, options) {
    const startTime = new Date();
    const response = await fetch(url, options);
    const endTime = new Date();
    if(endTime - startTime < 2000) {
        await wait((2000 - (endTime - startTime)));
    }
    return response
}