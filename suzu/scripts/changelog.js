class Version {
    tag = null;
    features = [];
    fixes = [];
    releaseDate = null;

    constructor(tag, features, fixes, releaseDate) {
        this.tag = tag;
        this.features = features;
        this.fixes = fixes;
        this.releaseDate = releaseDate;
    }

    getTag() {
        return this.tag;
    }

    getFeatures() {
        return this.features;
    }

    getFixes() {
        return this.fixes;
    }

    getReleaseDate() {
        return this.releaseDate;
    }
}


const versions = [
    new Version(
        "2608.01",
        [
            "Added anime schedule of each week",
            "Added side panel with global and personal anime details",
            "Added tierlist maker with seasonal anime selector"
        ],
        [],
        new Date("2026/08/22")
    ),
    new Version(
        "2608.02",
        [
            "Added anime search by title",
            "Added changelog showing when accessing Suzu while a new version released",
            "Added theming",
            "Added logo",
        ],
        [
            "Fixed animes airing on mondays/sundays not showing on schedule in some occasions"
        ],
        new Date("2026/08/28")
    ),
    new Version(
        "2608.03",
        [
            "Added activity tab",
            "Added fetching activity of user at first login",
            "Modified sync button to add fetching of activity since last time or in full mode",
            "(WIP) Added mobile layout"
        ],
        [],
        new Date("2026/08/30")
    ),
    new Version(
        "2608.04",
        [],
        [
            "Activity tab : fixed months not showing after current month for previous years"
        ],
        new Date("2026/08/30")
    ),
    new Version(
        "2608.05",
        [
            "Activity: display month with correct week day placement"
        ],
        [],
        new Date("2026/08/30")
    ),
    new Version(
        "2608.06",
        [
            "Activity: changed scroll method to make calendar vertical",
            "Activity: calendar now starts at first activity found for user"
        ],
        [],
        new Date("2026/09/05")
    ),
    new Version(
        "2609.01",
        [
            "Tierlists: added modal to warn the user of risk of data loss if they don't save their tierlist",
            "Tierlists: users can now save and open tierlists as files",
            "Schedule: added indicator of current time",
            "Navbar: added indicator of the displayed page",
            "Sync: changed sync animation"
        ],
        [
            "Schedule: all airing occurences were not fetched for animes with more than 24 episodes",
            "Tierlists: anime selector was not reset after page change"
        ],
        new Date("2026/09/12")
    ),
    new Version(
        "2609.02",
        [
        ],
        [
            "Tierlists: an empty space was present at bottom of generated pictures",
            "Tierlists: items and text in generated pictures could be very big or small with some screen resolutions"
        ],
        new Date("2026/09/12")
    ),
    new Version(
        "2609.03",
        [
            "Logo: changed logo",
            "Sync: added modal with options on what data to sync",
            "Card: added profile card generation with possibility to copy and save the card as a picture"
        ],
        [
            "Tierlists: changed resolution of generated pictures to be more readable",
            "Tierlists: warning modal when changing pages was showing even with no modifications to save",
            "Sync: << Gathering additional info >> part has been optimized to make it faster if you already have some additional info on your device"
        ],
        new Date("2026/09/20")
    ),
    new Version(
        "2610.01",
        [
            "Landing: new visuals for landing page",
            "Recap: added year recap page"
        ],
        [
            "Sync: << Gathering additional info >> part has been even more optimized to make it faster if you already have some additional info on your device",
            "Schedule: animes on the same day and hour can now stack in the same line if each of them were piling onto each other",
        ],
        new Date("2026/10/17")
    )
]


const changelog = {
    lastVersion: null,
    renderNewVersionsSince() {
        let versionsNodes = [];

        const versionsSince = versions.filter(v => parseFloat(v.getTag()) > parseFloat(this.lastVersion))
            .sort((a, b) => b.getReleaseDate() - a.getReleaseDate());
        if(!versionsSince || versionsSince.length <= 0) {
            return;
        }
        for(const v of versionsSince) {
            const subtitle = document.createElement("span");
            subtitle.classList.add("changelog-version-title");
            subtitle.innerHTML = `<span class="changelog-version">${v.getTag()}</span>
                <span class="changelog-date"><span class="icon">${ICONS.SCHEDULE}</span>${dateUtils.formatToDatePrintable(v.getReleaseDate())}</span>`;
            versionsNodes.push(subtitle);

            if(v.getFeatures() && v.getFeatures().length > 0) {
                const featuresSubtitle = document.createElement("span");
                featuresSubtitle.classList.add("modal-subtitle");
                featuresSubtitle.innerText = "Features";
                versionsNodes.push(featuresSubtitle);

                const features = document.createElement("div");
                features.classList.add("modal-paragraph");
                features.innerHTML = `<ul>${v.getFeatures().map(f => "<li>" + f + "</li>").join(" ")}</ul>`;
                versionsNodes.push(features);
            }

            if(v.getFixes() && v.getFixes().length > 0) {
                const fixesSubtitle = document.createElement("span");
                fixesSubtitle.classList.add("modal-subtitle");
                fixesSubtitle.innerText = "Fixes";
                versionsNodes.push(fixesSubtitle);

                const fixes = document.createElement("div");
                fixes.classList.add("modal-paragraph");
                fixes.innerHTML = `
                    <ul>
                        ${v.getFixes().map(f => "<li>" + f + "</li>").join(" ")}
                    </ul>
                `
                versionsNodes.push(fixes);
            }
            
        }      

        const changelogModal = new Modal("Since your last visit", versionsNodes);
        changelogModal.render();
    }
}