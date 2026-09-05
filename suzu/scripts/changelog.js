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