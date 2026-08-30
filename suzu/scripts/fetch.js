const url = 'https://graphql.anilist.co/';

/**
 * Search animes by title.
 * @param {String} title 
 * @returns {Object} results
 */
async function anilistSearch(title) {
    const query = JSON.stringify(
    {
        query: `query ($search: String, $type: MediaType, $perPage: Int, $page: Int, $isMain: Boolean, $sort: [MediaSort]) {
            Page(perPage: $perPage, page: $page) {
                media(search: $search, type: $type, sort: $sort) {
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
            }
        }`,
        variables: {
            search:title,
            type:"ANIME",
            perPage:50,
            page:1,
            isMain: true,
            sort: "POPULARITY_DESC"
        }
    });

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: query
    };

    try {
        spinner.show("Searching for animes...");
        const response = await throttleFetch(url, options);
        const responseObject = await response.json();
        let medias = [];

        if(responseObject.data && responseObject.data.Page && responseObject.data.Page.media) {
            medias = responseObject.data.Page.media.map(function(a) {return {media: a}});
        }
        spinner.hide();

        return medias;
    } catch (error) {
        console.error(error);
        spinner.hide();
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
 * Returns all collection of activities of the user since date.
 * @param {Number} userId 
 * @param {Number} dateEpoch 
 * @returns {Array} page of activities in user list
 */
async function fetchActivitySince(userId, dateEpoch) {
    const query = 
    {
        query: `query Query($userId: Int, $type: ActivityType, $sort: [ActivitySort], $page: Int, $perPage: Int, $createdAtGreater: Int) {
                Page(page: $page, perPage: $perPage) {
                    activities(userId: $userId, type: $type, sort: $sort, createdAt_greater: $createdAtGreater) {
                    ... on ListActivity {
                        createdAt
                        media {
                        id
                        }
                        progress
                        status
                    }
                    }
                    pageInfo {
                    currentPage
                    hasNextPage
                    total
                    lastPage
                    }
                }
                }`,
        variables: {
            userId: userId,
            type:"ANIME_LIST",
            perPage:50,
            page:1,
            createdAtGreater: dateEpoch
        }
    };

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(query)
    };

    let finished = false;
    let activities = [];
    let currentPage = 1;

    do {
        try {
            const nbPagesShown = ".".repeat(currentPage - 1);
            spinner.show(`Fetching activity ${nbPagesShown}...`);
            const response = await throttleFetch(url, options);
            const responseObject = await response.json();

            if(responseObject.data && responseObject.data.Page && responseObject.data.Page.activities) {
                activities.push(...responseObject.data.Page.activities);
            }

            if(responseObject.data && responseObject.data.Page && responseObject.data.Page.pageInfo
                && responseObject.data.Page.pageInfo.hasNextPage) {
                currentPage++;
                query.variables.page = currentPage;
                options.body = JSON.stringify(query);
            } else {
                finished = true;
            }
        } catch (error) {
            console.error(error);
            finished = true;
        }
    } while (!finished);

    spinner.hide();
    return activities;
}


/**
 * Returns user info.
 * @param {String} userName 
 * @returns {Object} user info
 */
async function fetchUserInfo(userName) {
const query = JSON.stringify(
    {
        query: `query Query($name: String, $sort: [UserStatisticsSort]) {
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
                        mediaListOptions {
                            scoreFormat
                        }
                        statistics {
                            anime {
                                episodesWatched
                                count
                                meanScore
                                minutesWatched
                                genres(sort: $sort) {
                                    genre
                                    count
                                    meanScore
                                    minutesWatched
                                }
                                lengths(sort: $sort) {
                                    count
                                    length
                                    meanScore
                                    minutesWatched
                                }
                                formats(sort: $sort) {
                                    count
                                    format
                                    meanScore
                                    minutesWatched
                                }
                                scores {
                                    score
                                    minutesWatched
                                    count
                                }
                                tags(sort: $sort) {
                                    count
                                    meanScore
                                    minutesWatched
                                    tag {
                                        name
                                    }
                                }
                                statuses(sort: $sort) {
                                    count
                                    minutesWatched
                                    status
                                    meanScore
                                }
                                countries(sort: $sort) {
                                    count
                                    country
                                    meanScore
                                    minutesWatched
                                }
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